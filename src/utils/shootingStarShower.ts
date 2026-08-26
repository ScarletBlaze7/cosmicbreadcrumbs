/**
 * Fireworks & Screen Celebrations Disabled
 * (Replaced with elegant 3D tactile card flips)
 */

export interface FireworkOptions {
  origin?: { x?: number; y?: number };
  count?: number;
  particleCount?: number;
  colors?: string[];
  grand?: boolean;
  duration?: number;
  scalar?: number;
}

export function triggerFireworks(_options?: FireworkOptions) {
  // Fireworks intentionally removed per user request in favor of clean 3D card flips.
}

export function triggerFireworksFromClick(
  _e: MouseEvent | { clientX: number; clientY: number },
  _options?: Partial<FireworkOptions>
) {
  // No fireworks on click
}

export const triggerShootingStars = triggerFireworks;
export const triggerShootingStarsFromClick = triggerFireworksFromClick;
export const triggerFireworkBurst = (_options?: { x?: number; y?: number; particleCount?: number; colors?: string[]; scalar?: number }) => {};

export default triggerFireworks;
