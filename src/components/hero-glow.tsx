'use client';

import { useEffect, useRef, useCallback } from 'react';

interface GlowOrb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: [number, number, number];
  opacity: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  driftX: number;
  driftY: number;
}

const ORB_CONFIGS: Array<{
  baseX: number; baseY: number; radius: number;
  color: [number, number, number]; opacity: number;
  speedX: number; speedY: number; driftX: number; driftY: number;
}> = [
  // Large primary orange — top left area
  { baseX: 0.2, baseY: 0.25, radius: 380, color: [255, 57, 0], opacity: 0.22, speedX: 0.0004, speedY: 0.0003, driftX: 80, driftY: 60 },
  // Deep red — right side
  { baseX: 0.8, baseY: 0.35, radius: 320, color: [255, 40, 10], opacity: 0.16, speedX: 0.0003, speedY: 0.0005, driftX: 70, driftY: 50 },
  // Warm white/orange — bottom center
  { baseX: 0.5, baseY: 0.75, radius: 300, color: [255, 120, 60], opacity: 0.12, speedX: 0.0005, speedY: 0.0004, driftX: 90, driftY: 40 },
  // Small bright accent — top center
  { baseX: 0.45, baseY: 0.15, radius: 200, color: [255, 180, 120], opacity: 0.08, speedX: 0.0006, speedY: 0.0003, driftX: 60, driftY: 70 },
  // Subtle cool tone — bottom left
  { baseX: 0.15, baseY: 0.8, radius: 260, color: [255, 80, 30], opacity: 0.1, speedX: 0.0004, speedY: 0.0006, driftX: 50, driftY: 80 },
  // Distant warm glow — center right
  { baseX: 0.7, baseY: 0.6, radius: 280, color: [255, 100, 50], opacity: 0.09, speedX: 0.0003, speedY: 0.0004, driftX: 75, driftY: 55 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function HeroGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // Normalized 0-1
  const orbsRef = useRef<GlowOrb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const isVisibleRef = useRef(true);

  const initOrbs = useCallback((w: number, h: number) => {
    orbsRef.current = ORB_CONFIGS.map((cfg, i) => ({
      x: cfg.baseX * w,
      y: cfg.baseY * h,
      baseX: cfg.baseX * w,
      baseY: cfg.baseY * h,
      radius: cfg.radius,
      color: cfg.color,
      opacity: cfg.opacity,
      phaseX: i * 1.3,
      phaseY: i * 0.9,
      speedX: cfg.speedX,
      speedY: cfg.speedY,
      driftX: cfg.driftX,
      driftY: cfg.driftY,
    }));
  }, []);

  const spawnParticle = useCallback((w: number, h: number, maxCount: number) => {
    if (particlesRef.current.length >= maxCount) return;
    particlesRef.current.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.8 + 0.4,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let maxParticles = window.innerWidth < 768 ? 14 : 30;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      maxParticles = w < 768 ? 14 : 30;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initOrbs(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / (w || 1),
        y: e.clientY / (h || 1),
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0.5, y: 0.5 };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Pause animation when hero is offscreen
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !animRef.current) {
            animRef.current = requestAnimationFrame(animate);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      } else {
        isVisibleRef.current = true;
        if (!animRef.current) {
          animRef.current = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let frameCount = 0;

    const animate = () => {
      if (!isVisibleRef.current) {
        animRef.current = 0;
        return;
      }

      timeRef.current += 1;
      frameCount++;
      const t = timeRef.current;
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // ── Draw orbs with smooth radial gradient (GPU-blurred via container CSS filter) ──
      for (const orb of orbsRef.current) {
        const rawX = orb.baseX + Math.sin(t * orb.speedX + orb.phaseX) * orb.driftX
          + Math.cos(t * orb.speedX * 0.7 + orb.phaseY) * orb.driftX * 0.4;
        const rawY = orb.baseY + Math.cos(t * orb.speedY + orb.phaseY) * orb.driftY
          + Math.sin(t * orb.speedY * 0.6 + orb.phaseX) * orb.driftY * 0.3;

        const parallaxStrength = 30;
        const px = (mx - 0.5) * parallaxStrength * (orb.radius / 350);
        const py = (my - 0.5) * parallaxStrength * (orb.radius / 350);

        orb.x = rawX + px;
        orb.y = rawY + py;

        const [r, g, b] = orb.color;
        const pulseFactor = 1 + Math.sin(t * 0.002 + orb.phaseX) * 0.15;
        const finalOpacity = orb.opacity * pulseFactor;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalOpacity})`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${finalOpacity * 0.55})`);
        grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${finalOpacity * 0.18})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Mouse spotlight (desktop only) ──
      if (w >= 768 && mx > 0 && mx < 1 && my > 0 && my < 1) {
        const spotX = mx * w;
        const spotY = my * h;
        const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 250);
        spotGrad.addColorStop(0, 'rgba(255, 90, 30, 0.04)');
        spotGrad.addColorStop(0.5, 'rgba(255, 57, 0, 0.015)');
        spotGrad.addColorStop(1, 'rgba(255, 57, 0, 0)');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Floating particles ──
      const particles = particlesRef.current;

      if (frameCount % 10 === 0) {
        spawnParticle(w, h, maxParticles);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = lifeRatio / 0.15;
        } else if (lifeRatio > 0.85) {
          p.opacity = (1 - lifeRatio) / 0.15;
        } else {
          p.opacity = 1;
        }
        p.opacity *= 0.45;

        const dx = mx * w - p.x;
        const dy = my * h - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.opacity *= 1 + (1 - dist / 180) * 1.2;
          p.vx -= (dx / Math.max(dist, 1)) * 0.003;
          p.vy -= (dy / Math.max(dist, 1)) * 0.003;
        }

        const isNear = dist < 250;
        const pr = isNear ? 255 : 180;
        const pg = isNear ? 90 : 180;
        const pb = isNear ? 40 : 180;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${p.opacity})`;
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initOrbs, spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none filter blur-[50px] transform-gpu"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
