// Lightweight native canvas confetti burst generator

export function triggerConfettiBurst(originX = 0.5, originY = 0.5) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const colors = ['#FF597B', '#FFD124', '#00D26A', '#38BDF8', '#A855F7', '#FF8400'];
  const particleCount = 70;
  
  const startX = width * originX;
  const startY = height * originY;

  const particles = Array.from({ length: particleCount }).map(() => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    };
  });

  let startTime: number | null = null;
  const duration = 2500; // 2.5s

  function animate(now: number) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = elapsed / duration;

    ctx!.clearRect(0, 0, width, height);

    let activeParticles = 0;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress * 1.2);

      if (p.opacity > 0 && p.y < height) {
        activeParticles++;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        } else {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.restore();
      }
    });

    if (progress < 1 && activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  requestAnimationFrame(animate);
}
