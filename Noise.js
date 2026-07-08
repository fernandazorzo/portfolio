class Noise {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.opts = {
      grainSize: 4,
      patternRefreshInterval: 2,
      patternAlpha: 20,
      ...options
    };

    this.ctx = null;
    this.animationId = null;
    this.frame = 0;
    this.destroyed = false;

    if (this.canvas) this.init();
  }

  init() {
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;

    const resize = () => {
      if (!canvas || this.destroyed) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
    };

    const drawGrain = () => {
      const w = canvas.width;
      const h = canvas.height;
      const gs = this.opts.grainSize;
      const alpha = this.opts.patternAlpha;
      if (w === 0 || h === 0 || gs === 0) return;

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let y = 0; y < h; y += gs) {
        for (let x = 0; x < w; x += gs) {
          const value = Math.random() * 255 | 0;
          const maxY = Math.min(y + gs, h);
          const maxX = Math.min(x + gs, w);
          for (let by = y; by < maxY; by++) {
            for (let bx = x; bx < maxX; bx++) {
              const i = (by * w + bx) * 4;
              data[i] = value;
              data[i + 1] = value;
              data[i + 2] = value;
              data[i + 3] = alpha;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (this.destroyed) return;
      if (this.frame % this.opts.patternRefreshInterval === 0) {
        drawGrain();
      }
      this.frame++;
      this.animationId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    this._resizeHandler = resize;
    resize();
    loop();
  }

  destroy() {
    this.destroyed = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
    this.canvas = null;
    this.ctx = null;
  }
}
