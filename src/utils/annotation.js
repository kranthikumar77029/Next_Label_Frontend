// Shared annotation utilities




/**
 * Get mouse coordinates relative to canvas with proper scaling
 */
/**
 * Get mouse coordinates in CSS pixels
 * (Canvas is already DPR-scaled via ctx.setTransform)
 */
export const getMousePos = (canvas, e) => {
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};


/**
 * Return which resize handle is hit or null
 */
export const getResizeHandle = (x, y, box) => {
  const handles = [
    { x: box.x, y: box.y, corner: 'tl' },
    { x: box.x + box.width, y: box.y, corner: 'tr' },
    { x: box.x, y: box.y + box.height, corner: 'bl' },
    { x: box.x + box.width, y: box.y + box.height, corner: 'br' },
  ];

  for (const handle of handles) {
    if (Math.abs(x - handle.x) < 10 && Math.abs(y - handle.y) < 10) {
      return handle.corner;
    }
  }
  return null;
};
