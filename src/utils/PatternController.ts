export const THEME_CONFIG = {
  0: 'bg-white',
  1: 'bg-cross-pattern',
  2: 'bg-triangle-pattern',
  3: 'bg-diamonds-pattern',
  4: 'bg-overlapcrc-pattern',
  5: 'bg-brickwall-pattern',
  6: 'bg-bubbles-pattern',
  7: 'bg-leaf-pattern',
  8: 'bg-tictactoe-pattern',
  9: 'bg-wavy-pattern',
  10: 'bg-clouds-pattern',
};

// --todo-- write better theme logic

function getTheme(index: number): string {
  if (index > Object.keys(THEME_CONFIG).length - 1) return THEME_CONFIG[0];
  const theme: string = Object(THEME_CONFIG)[index];
  return theme;
}

export default getTheme;
