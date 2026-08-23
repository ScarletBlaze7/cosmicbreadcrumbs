import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number; // in radians
  alpha: number;
  active: boolean;
  size: number;
  trail: { x: number; y: number }[];
}

export const ShootingStarsCanvas: React.FC<{ intensity?: 'low' | 'medium' | 'high' }> = ({
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Static / Twinkling Stars
    const starColors = ['#ffffff', '#e0e7ff', '#c084fc', '#fde047', '#38bdf8'];
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 4500);
      for (let i = 0; i < starCount; i++) {
        const baseAlpha = Math.random() * 0.7 + 0.2;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.3,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    // Shooting Stars / Meteors
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = intensity === 'high' ? 4 : intensity === 'medium' ? 3 : 2;

    const spawnShootingStar = () => {
      // Start near top or right edge
      const angle = (Math.PI / 4) + (Math.random() * 0.3 - 0.15); // ~45 degrees diagonal down-right
      const startSide = Math.random() > 0.5;

      const x = startSide ? Math.random() * width * 0.8 : -50;
      const y = startSide ? -50 : Math.random() * height * 0.4;

      shootingStars.push({
        x,
        y,
        length: Math.random() * 110 + 70,
        speed: Math.random() * 12 + 10,
        angle,
        alpha: 1,
        active: true,
        size: Math.random() * 1.8 + 1.2,
        trail: [],
      });
    };

    let lastSpawnTime = Date.now();
    const spawnInterval = intensity === 'high' ? 1800 : intensity === 'medium' ? 2600 : 3800;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Twinkling Stars (Clean, highly optimized for mobile GPU)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.85 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(0.9, star.alpha));
        ctx.fill();
      }

      // Spawn periodic shooting stars
      const now = Date.now();
      if (now - lastSpawnTime > spawnInterval && shootingStars.length < maxShootingStars) {
        spawnShootingStar();
        lastSpawnTime = now;
      }

      // Update & Draw Shooting Stars (Optimized trail)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];

        // Move meteor
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;

        // Tail calculation
        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        // Gradient for meteor trail
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(0.2, 'rgba(192, 132, 252, 0.7)'); // Purple neon
        gradient.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)'); // Cyan
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.size;
        ctx.lineCap = 'round';
        ctx.globalAlpha = meteor.alpha;
        ctx.stroke();

        // Meteor Head Sparkle
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Fade out as it travels
        if (meteor.x > width + 100 || meteor.y > height + 100) {
          meteor.alpha -= 0.08;
        }

        if (meteor.alpha <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
