/**
 * Binary rain shared by the home hero (MatrixFluidCanvas) and the wireframe section, so the two
 * pages read as one continuous stream: one digit per 36×42px cell, all falling down.
 */
export const RAIN_FONT = '400 15px var(--font-inter), system-ui, -apple-system, sans-serif';
export const RAIN_FLIP_EVERY = 180; // frames between 0↔1 flips

export type RainCell = {
  x: number; // resting screen position (px)
  y: number;
  char: string;
  speed: number; // px per frame
  color: string; // rgba prefix, alpha appended when drawn
  opacity: number;
  flipTimer: number;
};

export function rainCells(width: number, height: number): RainCell[] {
  const cells: RainCell[] = [];
  const cols = Math.ceil(width / 36);
  const rows = Math.ceil(height / 42);
  for (let c = 0; c < cols; c++) {
    const x = c * 36 + (Math.random() - 0.5) * 8;
    for (let r = 0; r < rows; r++) {
      const isGreen = Math.random() < 0.25; // ~25% Drava lime, the rest neutral grey
      cells.push({
        x,
        y: r * 42 + (Math.random() - 0.5) * 8,
        char: Math.random() > 0.5 ? '1' : '0',
        speed: 0.35 + Math.random() * 0.7,
        color: isGreen ? 'rgba(182, 255, 102, ' : 'rgba(150, 155, 165, ',
        opacity: isGreen ? 0.75 + Math.random() * 0.25 : 0.45 + Math.random() * 0.45,
        flipTimer: Math.floor(Math.random() * 200)
      });
    }
  }
  return cells;
}
