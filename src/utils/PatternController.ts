export const THEME_CONFIG = {
  0: 'bg-white',
  1: 'bg-[image:var(--cross-pattern)]',
  2: 'bg-[image:var(--triangle-pattern)]',
  3: 'bg-[image:var(--diamonds-pattern)]',
  4: 'bg-[image:var(--overlapcrc-pattern)]',
  5: 'bg-[image:var(--brickwall-pattern)]',
  6: 'bg-[image:var(--bubbles-pattern)]',
  7: 'bg-[image:var(--leaf-pattern)]',
  8: 'bg-[image:var(--tictactoe-pattern)]',
  9: 'bg-[image:var(--wavy-pattern)] ',
  10: 'bg-[image:var(--clouds-pattern)] ',
};

// --todo-- write better theme logic

function getTheme(index: number): string {
  if (index > Object.keys(THEME_CONFIG).length - 1) return THEME_CONFIG[0];
  const theme: string = Object(THEME_CONFIG)[index];
  return theme;
}

export default getTheme;
