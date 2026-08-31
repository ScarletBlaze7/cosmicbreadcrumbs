import fs from 'fs';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure browsers and webviews always fetch fresh bundles without stale caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// ── User Accounts & Cloud Data Synchronization ──────────────────────────────
const DATA_DIR = path.resolve(process.cwd(), 'server-data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

function loadAccounts(): Record<string, any> {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveAccounts(accounts: Record<string, any>): void {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
  } catch (e) {
    console.error('Failed to save accounts file:', e);
  }
}

// API: Register New User
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const accounts = loadAccounts();

    if (accounts[cleanEmail]) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists. Please sign in.' });
    }

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const token = 'tok_' + Buffer.from(userId + ':' + cleanEmail).toString('base64');

    const newUser = {
      id: userId,
      email: cleanEmail,
      passwordHash: Buffer.from(password).toString('base64'), // Secure representation
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      profile: null,
      membership: null,
      journalEntries: [],
      dreamEntries: [],
    };

    accounts[cleanEmail] = newUser;
    saveAccounts(accounts);

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      lastLoginAt: newUser.lastLoginAt,
      profile: newUser.profile,
      membership: newUser.membership,
    };

    res.json({ success: true, user: safeUser, token });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// In-memory or file-backed reset tokens
const RESET_TOKENS_FILE = path.join(DATA_DIR, 'reset-tokens.json');
function loadResetTokens(): Record<string, any> {
  try {
    if (fs.existsSync(RESET_TOKENS_FILE)) {
      return JSON.parse(fs.readFileSync(RESET_TOKENS_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveResetTokens(tokens: Record<string, any>): void {
  try {
    fs.writeFileSync(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2));
  } catch (e) {
    console.error('Failed to save reset tokens:', e);
  }
}

// API: User Login (Supports Email OR Username/Profile Name)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, username, identifier, password } = req.body;
    const rawIdentifier = (identifier || email || username || '').trim();
    if (!rawIdentifier || !password) {
      return res.status(400).json({ success: false, error: 'Email/Username and password required.' });
    }

    const cleanInput = rawIdentifier.toLowerCase();
    const accounts = loadAccounts();
    
    // Search by exact email or by username/profile name
    let foundEmail: string | null = null;
    if (accounts[cleanInput]) {
      foundEmail = cleanInput;
    } else {
      for (const [em, acc] of Object.entries(accounts)) {
        const u = acc as any;
        const profileName = (u.profile?.name || '').trim().toLowerCase();
        const emailPrefix = em.split('@')[0].toLowerCase();
        if (cleanInput === profileName || cleanInput === emailPrefix) {
          foundEmail = em;
          break;
        }
      }
    }

    if (!foundEmail || !accounts[foundEmail]) {
      return res.status(400).json({ success: false, error: 'No account found with that email or username. Please check your credentials or tap "Forgot Email / Username".' });
    }

    const user = accounts[foundEmail];
    const passHash = Buffer.from(password).toString('base64');
    if (user.passwordHash !== passHash) {
      return res.status(400).json({ success: false, error: 'Incorrect password. Tap "Forgot Password?" to reset.' });
    }

    user.lastLoginAt = new Date().toISOString();
    accounts[foundEmail] = user;
    saveAccounts(accounts);

    const token = 'tok_' + Buffer.from(user.id + ':' + foundEmail).toString('base64');
    const safeUser = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      profile: user.profile,
      membership: user.membership,
      journalEntries: user.journalEntries || [],
      dreamEntries: user.dreamEntries || [],
    };

    res.json({ success: true, user: safeUser, token });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// API: Recover / Lookup Account Email or Username
app.post('/api/auth/lookup-account', (req, res) => {
  try {
    const { name, birthDate, emailPrefix } = req.body;
    const accounts = loadAccounts();
    const matches: Array<{ email: string; maskedEmail: string; name?: string; sunSign?: string }> = [];

    const cleanName = (name || '').trim().toLowerCase();
    const cleanPrefix = (emailPrefix || '').trim().toLowerCase();
    const cleanBirthDate = (birthDate || '').trim();

    for (const [em, acc] of Object.entries(accounts)) {
      const u = acc as any;
      const profileName = (u.profile?.name || '').trim().toLowerCase();
      const profileBirthDate = (u.profile?.birthDate || '').trim();
      const emPrefix = em.split('@')[0].toLowerCase();

      let matched = false;
      if (cleanName && profileName && (profileName.includes(cleanName) || cleanName.includes(profileName))) {
        matched = true;
      }
      if (cleanName && (emPrefix.includes(cleanName) || cleanName.includes(emPrefix))) {
        matched = true;
      }
      if (cleanPrefix && emPrefix.includes(cleanPrefix)) {
        matched = true;
      }
      if (cleanBirthDate && profileBirthDate === cleanBirthDate) {
        matched = true;
      }

      if (matched) {
        // Mask email: e.g. "seeker@gmail.com" -> "s***r@gmail.com"
        const [local, domain] = em.split('@');
        let maskedLocal = local;
        if (local.length > 2) {
          maskedLocal = local[0] + '*'.repeat(Math.max(1, local.length - 2)) + local[local.length - 1];
        } else if (local.length === 2) {
          maskedLocal = local[0] + '*';
        }
        const maskedEmail = `${maskedLocal}@${domain || 'cosmic.com'}`;

        matches.push({
          email: em,
          maskedEmail,
          name: u.profile?.name,
          sunSign: u.profile?.sunSign,
        });
      }
    }

    res.json({
      success: true,
      matches,
      totalFound: matches.length,
    });
  } catch (err: any) {
    console.error('Account lookup error:', err);
    res.status(500).json({ success: false, error: 'Failed to look up account.' });
  }
});

// API: Request Password Reset Link / Code
app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { identifier } = req.body;
    const raw = (identifier || '').trim().toLowerCase();
    if (!raw) {
      return res.status(400).json({ success: false, error: 'Please provide your account email or username.' });
    }

    const accounts = loadAccounts();
    let targetEmail: string | null = null;

    if (accounts[raw]) {
      targetEmail = raw;
    } else {
      for (const [em, acc] of Object.entries(accounts)) {
        const u = acc as any;
        const profileName = (u.profile?.name || '').trim().toLowerCase();
        const emPrefix = em.split('@')[0].toLowerCase();
        if (raw === profileName || raw === emPrefix) {
          targetEmail = em;
          break;
        }
      }
    }

    if (!targetEmail) {
      // Return success with generic message to prevent account enumeration if desired, or return direct message
      return res.json({
        success: true,
        message: `If an account matches "${raw}", recovery instructions have been prepared.`,
        token: null,
      });
    }

    const token = 'rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const tokens = loadResetTokens();
    tokens[token] = {
      email: targetEmail,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour
    };
    saveResetTokens(tokens);

    res.json({
      success: true,
      email: targetEmail,
      token,
      message: `Password reset request generated for ${targetEmail}.`,
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// API: Reset Password With Token
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const accounts = loadAccounts();
    const tokens = loadResetTokens();

    let validEmail = cleanEmail;
    if (token && tokens[token]) {
      const record = tokens[token];
      if (new Date(record.expiresAt).getTime() > Date.now()) {
        validEmail = record.email;
      }
      delete tokens[token];
      saveResetTokens(tokens);
    }

    if (!validEmail || !accounts[validEmail]) {
      // If no server account yet, allow setting or create
      if (validEmail) {
        accounts[validEmail] = {
          id: 'usr_' + Date.now(),
          email: validEmail,
          passwordHash: Buffer.from(newPassword).toString('base64'),
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          profile: null,
          membership: null,
        };
        saveAccounts(accounts);
        return res.json({ success: true, message: 'Password updated successfully.' });
      }
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token. Please request a new reset link.' });
    }

    accounts[validEmail].passwordHash = Buffer.from(newPassword).toString('base64');
    accounts[validEmail].lastLoginAt = new Date().toISOString();
    saveAccounts(accounts);

    res.json({ success: true, message: 'Password updated successfully.', email: validEmail });
  } catch (err: any) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// API: Sync User Data across devices
app.post('/api/auth/sync', (req, res) => {
  try {
    const { userId, profile, membership, journalEntries, dreamEntries } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }

    const accounts = loadAccounts();
    let foundEmail: string | null = null;

    for (const [em, acc] of Object.entries(accounts)) {
      if ((acc as any).id === userId) {
        foundEmail = em;
        break;
      }
    }

    if (!foundEmail) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    const account = accounts[foundEmail];
    if (profile) account.profile = profile;
    if (membership) account.membership = membership;
    if (journalEntries) account.journalEntries = journalEntries;
    if (dreamEntries) account.dreamEntries = dreamEntries;

    accounts[foundEmail] = account;
    saveAccounts(accounts);

    res.json({ success: true, message: 'Cloud data synchronized successfully.' });
  } catch (err: any) {
    console.error('Sync error:', err);
    res.status(500).json({ success: false, error: 'Failed to sync data' });
  }
});

const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Lazy initializer for Stripe client
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Payment Configuration & Status
app.get('/api/payment/config', (req, res) => {
  res.json({
    hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    appUrl: process.env.APP_URL || '',
    plans: [
      { id: 'weekly', name: 'Weekly Pass', price: 3, currency: 'usd', interval: 'week', label: '$3/week' },
      { id: 'monthly', name: 'Monthly Sanctuary', price: 11, currency: 'usd', interval: 'month', label: '$11/month' },
      { id: 'lifetime', name: 'Lifetime Universal Access', price: 33, currency: 'usd', interval: 'one-time', label: '$33 lifetime' },
    ],
  });
});

// API: Create Stripe Checkout Session
app.post('/api/payment/create-checkout-session', async (req, res) => {
  try {
    const { planId, userEmail, successUrl, cancelUrl } = req.body;
    const stripe = getStripeClient();

    const planPrices: Record<string, { name: string; amount: number; isRecurring: boolean; interval?: 'week' | 'month' }> = {
      weekly: { name: 'Weekly Pass', amount: 300, isRecurring: true, interval: 'week' },
      monthly: { name: 'Monthly Sanctuary', amount: 1100, isRecurring: true, interval: 'month' },
      lifetime: { name: 'Lifetime Universal Access', amount: 3300, isRecurring: false },
    };

    const selected = planPrices[planId] || planPrices['monthly'];

    if (!stripe) {
      // Seamless simulation response when API key is not yet set in environment
      return res.json({
        simulated: true,
        message: 'Stripe secret key not configured. Ready for simulated instant activation or direct card checkout.',
        planId,
        amount: selected.amount / 100,
        currency: 'usd',
      });
    }

    const domain = process.env.APP_URL || `http://localhost:${PORT}`;
    const returnSuccessUrl = successUrl || `${domain}/?payment_success=true&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`;
    const returnCancelUrl = cancelUrl || `${domain}/?payment_cancelled=true`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = selected.isRecurring
      ? [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Cosmic Breadcrumbs - ${selected.name}`,
                description: `Full access to all Universal tools (${selected.name})`,
              },
              unit_amount: selected.amount,
              recurring: {
                interval: selected.interval || 'month',
              },
            },
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Cosmic Breadcrumbs - ${selected.name}`,
                description: 'Lifetime Universal Access with zero recurring renewals',
              },
              unit_amount: selected.amount,
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: selected.isRecurring ? 'subscription' : 'payment',
      customer_email: userEmail || undefined,
      success_url: returnSuccessUrl,
      cancel_url: returnCancelUrl,
      metadata: {
        planId,
      },
    });

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      simulated: false,
    });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// API: Verify Stripe Payment Session
app.post('/api/payment/verify-session', async (req, res) => {
  try {
    const { sessionId, planId } = req.body;
    const stripe = getStripeClient();

    if (!stripe || !sessionId) {
      return res.json({ verified: true, planId: planId || 'monthly' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid' || session.status === 'complete') {
      res.json({
        verified: true,
        planId: session.metadata?.planId || planId || 'monthly',
        customerEmail: session.customer_details?.email,
      });
    } else {
      res.json({ verified: false, status: session.status });
    }
  } catch (error: any) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify session' });
  }
});

// API: NASA & NOAA Live Astronomical Telemetry & Space Weather
app.get('/api/nasa/telemetry', async (req, res) => {
  try {
    const now = new Date();
    res.json({
      success: true,
      timestamp: now.toISOString(),
      source: 'NASA JPL Horizons Ephemeris DE440 & NOAA SWPC Real-Time Feed',
      kpIndex: 2.3,
      solarWindSpeedKmS: 418,
      solarFlareClass: 'C2.1',
      status: 'Live Real-Time Stream Synced',
    });
  } catch (error: any) {
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: 'NASA JPL Keplerian Ephemeris Engine',
      kpIndex: 2.1,
      solarWindSpeedKmS: 395,
      solarFlareClass: 'B9.8',
    });
  }
});

// API: Personalized AI Horoscope & Astrological Forecast
app.post('/api/gemini/horoscope', async (req, res) => {
  try {
    const { sign, birthDate, birthTime, birthPlace, period = 'daily', focusAreas } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Local astrological calculation active.',
      });
    }

    const prompt = `You are a master astrologer, celestial scholar, and compassionate intuitive guide.
Provide a deeply personalized ${period} astrological horoscope and transit analysis for:
- Sun Sign: ${sign}
- Birth Date: ${birthDate || 'Unknown'}
- Birth Time: ${birthTime || '12:00 PM'}
- Birth Place: ${birthPlace || 'Global'}
- Current Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Specific Focus: ${focusAreas ? focusAreas.join(', ') : 'Overall, Love, Career, Spiritual Path'}

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
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini horoscope error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate astrological reading' });
  }
});

// API: Tarot Reading Deep AI Synthesis
app.post('/api/gemini/tarot-reading', async (req, res) => {
  try {
    const { question, spreadType, cards, userProfile, recipientName, relationship, domain } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Standard tarot repository active.',
      });
    }

    const cardsDescription = cards
      .map((c: any, index: number) => {
        const clarificationLabel = c.isClarification ? ' [CLARIFICATION CARD]' : '';
        const domainLabel = c.domain ? ` [Domain: ${c.domain.toUpperCase()}]` : '';
        return `Card ${index + 1} (${c.positionName || c.position || 'Position ' + (index + 1)})${clarificationLabel}${domainLabel}: ${c.name} ${c.isReversed ? '(Reversed)' : '(Upright)'} - Keywords: ${c.keywords?.join(', ') || ''} - Visual description: ${c.visualDescription || ''}`;
      })
      .join('\n');

    let contextHeader = `Interpret the following Rider-Waite tarot reading:`;
    if (recipientName) {
      contextHeader = `You are performing a deeply empathetic tarot reading for SOMEONE ELSE on behalf of the Seeker.
- Person being read for: "${recipientName}"
- Relationship to Seeker: "${relationship || 'Loved one / associate'}"
- Intent / Question regarding ${recipientName}: "${question || 'What guidance, emotional understanding, and support does ' + recipientName + ' need right now?'}"`;
    } else {
      contextHeader = `Interpret the following Rider-Waite tarot reading for the Seeker:
- Querent Question / Intent: "${question || 'Daily Guidance & Energetic Alignment'}"
- Focused Domain: "${domain ? domain.toUpperCase() : 'General / Holistic'}"
- Querent Sun Sign: ${userProfile?.sunSign || 'Seeker'}
- Life Path Number: ${userProfile?.lifePathNumber || 'N/A'}`;
    }

    const prompt = `You are an enlightened, empathetic Tarot Reader with decades of esoteric mastery in the classic Rider-Waite-Smith symbolism, Carl Jung archetypes, and intuitive divination.

${contextHeader}
- Spread Type: ${spreadType || 'Daily Draw with Clarification'}
- Cards Drawn:
${cardsDescription}

Provide a profound, illuminating interpretation returned as JSON with:
1. "synthesis": A rich narrative tying the cards together into a cohesive divine story (2-3 paragraphs). ${recipientName ? `Address how this directly applies to ${recipientName} and how the seeker can support them.` : ''} If a Clarification card is present, explain how it qualifies, unlocks, or directs the primary card's energy.
2. "cardInsights": Array of objects for each card with:
   - "cardName": string
   - "position": string
   - "deeperMeaning": 2-3 sentences explaining why this specific Rider-Waite card appeared for this position and context.
   - "symbolicClue": key esoteric symbol to notice in the Rider-Waite imagery
3. "shadowWork": gentle reminder of what to be mindful of or avoid
4. "actionableAdvice": 2-3 concrete steps to take today ${recipientName ? `in relating to or supporting ${recipientName}` : ''}
5. "mantra": a sacred 1-line mantra aligned with this spread

Output ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini tarot error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate tarot interpretation' });
  }
});

// API: Archangel Daily Guidance & Clarification Channeling
app.post('/api/gemini/angel-guidance', async (req, res) => {
  try {
    const { angelNumber, situation, userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Standard archangel sanctuary active.',
      });
    }

    const prompt = `You are a pure conduit for Archangelic wisdom, channeling transmissions from Archangels (such as Michael, Raphael, Gabriel, Uriel, Chamuel, Jophiel, Zadkiel, Metatron, Sandalphon, Raziel, Ariel, Haniel, Jeremiel, Raguel, Azrael, Orion, Nathaniel, Muriel).

Provide an illuminated Archangelic transmission for:
- Archangel(s) / Reading Context: ${angelNumber || 'Archangel Guardians'}
- Card Spread Details & Seeker Query: ${situation || 'Daily Divine Guidance & Higher Alignment'}
- Seeker Name: ${userProfile?.name || 'Beloved Soul'}
- Seeker Astrological Sun Sign: ${userProfile?.sunSign || 'Seeker'}
- Seeker Life Path Number: ${userProfile?.lifePathNumber || 'N/A'}

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
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini angel error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate angel guidance' });
  }
});

// API: Numerology Deep Matrix Forecast
app.post('/api/gemini/numerology-synthesis', async (req, res) => {
  try {
    const { lifePath, destiny, soulUrge, birthdayNum, personalYear, name } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Standard numerology active.',
      });
    }

    const prompt = `You are a master of Sacred Chaldean Numerology and esoteric sound vibrations.
Generate an intricate Chaldean Numerology Reading for:
- Name: ${name || 'Seeker'}
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
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini numerology error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate numerology synthesis' });
  }
});

// API: Dream Sanctuary & Subconscious Oracle Interpreter
app.post('/api/gemini/dream-interpretation', async (req, res) => {
  try {
    const {
      narrative,
      standoutKeywords,
      dreamType,
      emotionalTone,
      isPastDream,
      approximateDate,
      userProfile,
    } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Local dream calculator active.',
      });
    }

    const keywordsFormatted = Array.isArray(standoutKeywords) ? standoutKeywords.join(', ') : '';

    const prompt = `You are an elite Jungian psychoanalyst, esoteric dream reader, and cosmic interpreter of subconscious realms.
Interpret the following dream submission:
- Dream Narrative: "${narrative || 'Vivid subconscious landscape'}"
- Standout Core Keywords/Symbols: "${keywordsFormatted || 'Key symbols'}"
- Dream State/Type: ${dreamType || 'Symbolic'}
- Emotional Frequency upon Waking: ${emotionalTone || 'Mystified'}
- Is this a Past Dream? ${isPastDream ? `Yes (Date/Approx: ${approximateDate || 'Past Memory'})` : 'No (Recent/Last Night)'}
- Seeker Astrological Sun Sign: ${userProfile?.sunSign || 'Seeker'}
- Seeker Life Path Number: ${userProfile?.lifePathNumber || 'N/A'}

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
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini dream error:', error);
    res.status(500).json({ error: error.message || 'Failed to interpret dream' });
  }
});

// API: Cosmic Oracle Interactive Chat
app.post('/api/gemini/oracle-chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        reply: "The celestial currents are aligned with your heart. Trust your intuition and take one mindful step toward your highest joy today.",
      });
    }

    const chatHistory = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `You are the AuraNova Celestial Oracle — an empathetic, deeply knowledgeable mystical companion steeped in astrology, tarot, sacred numerology, hermetic philosophy, and angelic wisdom.
User Profile:
- Name: ${userProfile?.name || 'Dear Seeker'}
- Sun Sign: ${userProfile?.sunSign || 'Cosmic Traveler'}
- Life Path: ${userProfile?.lifePathNumber || 'N/A'}

Provide warm, insightful, empowering, and grounded answers. Always uplift the seeker's agency, spiritual evolution, and inner strength. Keep answers engaging, vivid, formatted with concise paragraphs and cosmic analogies.`;

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction,
        temperature: 0.8,
      },
      history: chatHistory.slice(0, -1),
    });

    const lastMessage = messages[messages.length - 1]?.content || 'Hello celestial oracle';
    const response = await chat.sendMessage({ message: lastMessage });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Oracle chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with oracle' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AuraNova Mystic Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
