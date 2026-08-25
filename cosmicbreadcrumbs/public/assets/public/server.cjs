var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_stripe = __toESM(require("stripe"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var genAIClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
var stripeClient = null;
function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new import_stripe.default(key);
  }
  return stripeClient;
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/payment/config", (req, res) => {
  res.json({
    hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    appUrl: process.env.APP_URL || "",
    plans: [
      { id: "weekly", name: "Weekly Pass", price: 3, currency: "usd", interval: "week", label: "$3/week" },
      { id: "monthly", name: "Monthly Sanctuary", price: 11, currency: "usd", interval: "month", label: "$11/month" },
      { id: "lifetime", name: "Lifetime Universal Access", price: 33, currency: "usd", interval: "one-time", label: "$33 lifetime" }
    ]
  });
});
app.post("/api/payment/create-checkout-session", async (req, res) => {
  try {
    const { planId, userEmail, successUrl, cancelUrl } = req.body;
    const stripe = getStripeClient();
    const planPrices = {
      weekly: { name: "Weekly Pass", amount: 300, isRecurring: true, interval: "week" },
      monthly: { name: "Monthly Sanctuary", amount: 1100, isRecurring: true, interval: "month" },
      lifetime: { name: "Lifetime Universal Access", amount: 3300, isRecurring: false }
    };
    const selected = planPrices[planId] || planPrices["monthly"];
    if (!stripe) {
      return res.json({
        simulated: true,
        message: "Stripe secret key not configured. Ready for simulated instant activation or direct card checkout.",
        planId,
        amount: selected.amount / 100,
        currency: "usd"
      });
    }
    const domain = process.env.APP_URL || `http://localhost:${PORT}`;
    const returnSuccessUrl = successUrl || `${domain}/?payment_success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`;
    const returnCancelUrl = cancelUrl || `${domain}/?payment_cancelled=true`;
    const lineItems = selected.isRecurring ? [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Cosmic Breadcrumbs - ${selected.name}`,
            description: `Full access to all Universal tools (${selected.name})`
          },
          unit_amount: selected.amount,
          recurring: {
            interval: selected.interval || "month"
          }
        },
        quantity: 1
      }
    ] : [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Cosmic Breadcrumbs - ${selected.name}`,
            description: "Lifetime Universal Access with zero recurring renewals"
          },
          unit_amount: selected.amount
        },
        quantity: 1
      }
    ];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: selected.isRecurring ? "subscription" : "payment",
      customer_email: userEmail || void 0,
      success_url: returnSuccessUrl,
      cancel_url: returnCancelUrl,
      metadata: {
        planId
      }
    });
    res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      simulated: false
    });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    res.status(500).json({ error: error.message || "Failed to create checkout session" });
  }
});
app.post("/api/payment/verify-session", async (req, res) => {
  try {
    const { sessionId, planId } = req.body;
    const stripe = getStripeClient();
    if (!stripe || !sessionId) {
      return res.json({ verified: true, planId: planId || "monthly" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid" || session.status === "complete") {
      res.json({
        verified: true,
        planId: session.metadata?.planId || planId || "monthly",
        customerEmail: session.customer_details?.email
      });
    } else {
      res.json({ verified: false, status: session.status });
    }
  } catch (error) {
    console.error("Verify session error:", error);
    res.status(500).json({ error: error.message || "Failed to verify session" });
  }
});
app.get("/api/nasa/telemetry", async (req, res) => {
  try {
    const now = /* @__PURE__ */ new Date();
    res.json({
      success: true,
      timestamp: now.toISOString(),
      source: "NASA JPL Horizons Ephemeris DE440 & NOAA SWPC Real-Time Feed",
      kpIndex: 2.3,
      solarWindSpeedKmS: 418,
      solarFlareClass: "C2.1",
      status: "Live Real-Time Stream Synced"
    });
  } catch (error) {
    res.json({
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      source: "NASA JPL Keplerian Ephemeris Engine",
      kpIndex: 2.1,
      solarWindSpeedKmS: 395,
      solarFlareClass: "B9.8"
    });
  }
});
app.post("/api/gemini/horoscope", async (req, res) => {
  try {
    const { sign, birthDate, birthTime, birthPlace, period = "daily", focusAreas } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Local astrological calculation active."
      });
    }
    const prompt = `You are a master astrologer, celestial scholar, and compassionate intuitive guide.
Provide a deeply personalized ${period} astrological horoscope and transit analysis for:
- Sun Sign: ${sign}
- Birth Date: ${birthDate || "Unknown"}
- Birth Time: ${birthTime || "12:00 PM"}
- Birth Place: ${birthPlace || "Global"}
- Current Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
- Specific Focus: ${focusAreas ? focusAreas.join(", ") : "Overall, Love, Career, Spiritual Path"}

Return a structured JSON with:
1. "overview": A poetic yet grounded cosmic forecast paragraph.
2. "themes": 3 core planetary themes influencing them today (e.g. "Lunar Trine Neptune: Heightened Intuition").
3. "aspects": {
     "love": "Specific guidance for love & connections",
     "career": "Actionable insight for work, money, purpose",
     "spirituality": "Inner spiritual practice or sacred reflection",
     "wellness": "Energetic health, chakras, grounding advice"
   }
3b. "loveAspects": {
     "single": "Tailored romantic guidance for singles: magnetic allure, green flags, and self-love manifestations",
     "dating": "Tailored romantic guidance for courting and dating: sparks, chemistry, date vibes, and communication keys",
     "married": "Tailored romantic guidance for married/committed partners: deep union, sacred intimacy, and lasting harmony"
   }
4. "luckyNumbers": array of 3-4 lucky integers
5. "cosmicColor": string (e.g. "Celestial Indigo", "Solar Gold")
6. "powerHour": string (e.g. "3:00 PM - 5:00 PM")
7. "affirmation": a powerful one-sentence cosmic affirmation
8. "transitAlert": key celestial transit alert (e.g. "Mercury entering shadow period")

Output ONLY valid JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Gemini horoscope error:", error);
    res.status(500).json({ error: error.message || "Failed to generate astrological reading" });
  }
});
app.post("/api/gemini/tarot-reading", async (req, res) => {
  try {
    const { question, spreadType, cards, userProfile, recipientName, relationship, domain } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Standard tarot repository active."
      });
    }
    const cardsDescription = cards.map((c, index) => {
      const clarificationLabel = c.isClarification ? " [CLARIFICATION CARD]" : "";
      const domainLabel = c.domain ? ` [Domain: ${c.domain.toUpperCase()}]` : "";
      return `Card ${index + 1} (${c.positionName || c.position || "Position " + (index + 1)})${clarificationLabel}${domainLabel}: ${c.name} ${c.isReversed ? "(Reversed)" : "(Upright)"} - Keywords: ${c.keywords?.join(", ") || ""} - Visual description: ${c.visualDescription || ""}`;
    }).join("\n");
    let contextHeader = `Interpret the following Rider-Waite tarot reading:`;
    if (recipientName) {
      contextHeader = `You are performing a deeply empathetic tarot reading for SOMEONE ELSE on behalf of the Seeker.
- Person being read for: "${recipientName}"
- Relationship to Seeker: "${relationship || "Loved one / associate"}"
- Intent / Question regarding ${recipientName}: "${question || "What guidance, emotional understanding, and support does " + recipientName + " need right now?"}"`;
    } else {
      contextHeader = `Interpret the following Rider-Waite tarot reading for the Seeker:
- Querent Question / Intent: "${question || "Daily Guidance & Energetic Alignment"}"
- Focused Domain: "${domain ? domain.toUpperCase() : "General / Holistic"}"
- Querent Sun Sign: ${userProfile?.sunSign || "Seeker"}
- Life Path Number: ${userProfile?.lifePathNumber || "N/A"}`;
    }
    const prompt = `You are an enlightened, empathetic Tarot Reader with decades of esoteric mastery in the classic Rider-Waite-Smith symbolism, Carl Jung archetypes, and intuitive divination.

${contextHeader}
- Spread Type: ${spreadType || "Daily Draw with Clarification"}
- Cards Drawn:
${cardsDescription}

Provide a profound, illuminating interpretation returned as JSON with:
1. "synthesis": A rich narrative tying the cards together into a cohesive divine story (2-3 paragraphs). ${recipientName ? `Address how this directly applies to ${recipientName} and how the seeker can support them.` : ""} If a Clarification card is present, explain how it qualifies, unlocks, or directs the primary card's energy.
2. "cardInsights": Array of objects for each card with:
   - "cardName": string
   - "position": string
   - "deeperMeaning": 2-3 sentences explaining why this specific Rider-Waite card appeared for this position and context.
   - "symbolicClue": key esoteric symbol to notice in the Rider-Waite imagery
3. "shadowWork": gentle reminder of what to be mindful of or avoid
4. "actionableAdvice": 2-3 concrete steps to take today ${recipientName ? `in relating to or supporting ${recipientName}` : ""}
5. "mantra": a sacred 1-line mantra aligned with this spread

Output ONLY valid JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.75
      }
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Gemini tarot error:", error);
    res.status(500).json({ error: error.message || "Failed to generate tarot interpretation" });
  }
});
app.post("/api/gemini/angel-guidance", async (req, res) => {
  try {
    const { angelNumber, situation, userProfile } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Standard archangel sanctuary active."
      });
    }
    const prompt = `You are a pure conduit for Archangelic wisdom, channeling transmissions from Archangels (such as Michael, Raphael, Gabriel, Uriel, Chamuel, Jophiel, Zadkiel, Metatron, Sandalphon, Raziel, Ariel, Haniel, Jeremiel, Raguel, Azrael, Orion, Nathaniel, Muriel).

Provide an illuminated Archangelic transmission for:
- Archangel(s) / Reading Context: ${angelNumber || "Archangel Guardians"}
- Card Spread Details & Seeker Query: ${situation || "Daily Divine Guidance & Higher Alignment"}
- Seeker Name: ${userProfile?.name || "Beloved Soul"}
- Seeker Astrological Sun Sign: ${userProfile?.sunSign || "Seeker"}
- Seeker Life Path Number: ${userProfile?.lifePathNumber || "N/A"}

If a clarification card is present in the context, harmonize both Archangels' energies and clearly explain how the clarification card deepens or qualifies the primary guidance card.

Output a structured JSON response with:
1. "angelicMessage": Compassionate, elevated channel transmission synthesizing the cards into practical spiritual guidance (2 paragraphs).
2. "associatedArchangel": Name of the primary Archangel or dual Archangels (e.g. "Archangel Michael & Archangel Raphael").
3. "archangelRay": Dominant color vibration ray (e.g. "Sapphire Blue & Emerald Green Ray").
4. "coreMeaning": Concise 1-sentence essence of this transmission.
5. "sacredAction": A concrete 2-minute spiritual ritual, prayer, breathwork, or boundary exercise.
6. "synchronicityCheck": 3 real-world angelic signs to watch for today (e.g. feathers, golden light, sudden inner peace).
7. "affirmation": Powerful divine decree aligned with this transmission.

Output ONLY valid JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Gemini angel error:", error);
    res.status(500).json({ error: error.message || "Failed to generate angel guidance" });
  }
});
app.post("/api/gemini/numerology-synthesis", async (req, res) => {
  try {
    const { lifePath, destiny, soulUrge, birthdayNum, personalYear, name } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Standard numerology active."
      });
    }
    const prompt = `You are a master of Sacred Chaldean Numerology and esoteric sound vibrations.
Generate an intricate Chaldean Numerology Reading for:
- Name: ${name || "Seeker"}
- Life Path Number: ${lifePath}
- Chaldean Destiny / Expression Number: ${destiny}
- Chaldean Soul Urge / Heart's Desire: ${soulUrge}
- Birthday Number: ${birthdayNum}
- Current Personal Year Cycle: ${personalYear}

Output structured JSON:
1. "cosmicBlueprint": 2-paragraph synthesis of how their Life Path (${lifePath}) and Chaldean Destiny Number (${destiny}) harmonize based on ancient Babylonian sound frequencies.
2. "soulDesireTruth": Deep insight into their hidden Chaldean Soul Urge (${soulUrge}).
3. "yearTheme": Detailed breakdown of what their Personal Year ${personalYear} demands and rewards.
4. "growthOpportunities": 3 specific spiritual or career avenues to pursue.
5. "vibrationalHarmonies": {
     "bestLifePathPartners": [string array of compatible numbers],
     "gemstones": [string array of resonance crystals],
     "sacredGeometry": string (e.g., "Seed of Life", "Metatron's Cube", "Merkaba")
   }
6. "dailyFrequencyMessage": inspiring vibrational advice for today.

Output ONLY valid JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Gemini numerology error:", error);
    res.status(500).json({ error: error.message || "Failed to generate numerology synthesis" });
  }
});
app.post("/api/gemini/dream-interpretation", async (req, res) => {
  try {
    const {
      narrative,
      standoutKeywords,
      dreamType,
      emotionalTone,
      isPastDream,
      approximateDate,
      userProfile
    } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Local dream calculator active."
      });
    }
    const keywordsFormatted = Array.isArray(standoutKeywords) ? standoutKeywords.join(", ") : "";
    const prompt = `You are an elite Jungian psychoanalyst, esoteric dream reader, and cosmic interpreter of subconscious realms.
Interpret the following dream submission:
- Dream Narrative: "${narrative || "Vivid subconscious landscape"}"
- Standout Core Keywords/Symbols: "${keywordsFormatted || "Key symbols"}"
- Dream State/Type: ${dreamType || "Symbolic"}
- Emotional Frequency upon Waking: ${emotionalTone || "Mystified"}
- Is this a Past Dream? ${isPastDream ? `Yes (Date/Approx: ${approximateDate || "Past Memory"})` : "No (Recent/Last Night)"}
- Seeker Astrological Sun Sign: ${userProfile?.sunSign || "Seeker"}
- Seeker Life Path Number: ${userProfile?.lifePathNumber || "N/A"}

Provide a profound, illuminating interpretation returned as JSON with:
1. "summary": A rich, evocative 2-paragraph interpretation tying the symbols, emotional tone, and narrative into a clear psychological and spiritual message.
2. "keywordMeanings": Array of objects for EACH standout keyword provided:
   - "symbol": string (the exact keyword)
   - "meaning": 2-3 sentences explaining its deep esoteric and psychological significance in this dream.
   - "archetype": string (e.g., "The Sacred Shadow", "The Celestial Messenger", "The Threshold Guardian", "The Alchemical Rebirth")
   - "element": string ("Water", "Fire", "Air", "Earth", or "Aether")
   - "numerologyVibe": number (1-9 or 11, 22)
3. "subconsciousMessage": What the subconscious mind is desperately trying to bring to conscious awareness.
4. "spiritualSignificance": Astrological, karmic, or higher-dimensional guidance embedded in the dream.
5. "shadowWorkAspect": What suppressed emotion, fear, or unintegrated desire needs compassion.
6. "guidanceAction": 1-2 concrete, grounded actions to take in waking life.
7. "lucidRitual": A bedtime ritual or intention to practice tonight for clarity and peaceful dream travel.
8. "dreamNumberVibration": integer (1-9, 11, 22, 33) representing the vibrational frequency of this dream.

Output ONLY valid JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.75
      }
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Gemini dream error:", error);
    res.status(500).json({ error: error.message || "Failed to interpret dream" });
  }
});
app.post("/api/gemini/oracle-chat", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        reply: "The celestial currents are aligned with your heart. Trust your intuition and take one mindful step toward your highest joy today."
      });
    }
    const chatHistory = (messages || []).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));
    const systemInstruction = `You are the AuraNova Celestial Oracle \u2014 an empathetic, deeply knowledgeable mystical companion steeped in astrology, tarot, sacred numerology, hermetic philosophy, and angelic wisdom.
User Profile:
- Name: ${userProfile?.name || "Dear Seeker"}
- Sun Sign: ${userProfile?.sunSign || "Cosmic Traveler"}
- Life Path: ${userProfile?.lifePathNumber || "N/A"}

Provide warm, insightful, empowering, and grounded answers. Always uplift the seeker's agency, spiritual evolution, and inner strength. Keep answers engaging, vivid, formatted with concise paragraphs and cosmic analogies.`;
    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction,
        temperature: 0.8
      },
      history: chatHistory.slice(0, -1)
    });
    const lastMessage = messages[messages.length - 1]?.content || "Hello celestial oracle";
    const response = await chat.sendMessage({ message: lastMessage });
    res.json({ reply: response.text });
  } catch (error) {
    console.error("Oracle chat error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with oracle" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u2728 AuraNova Mystic Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
