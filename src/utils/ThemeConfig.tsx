const THEME_CONFIG = {
	0: 'bg-overlapcrc-pattern',
	1: 'bg-cross-pattern',
	2: 'bg-triangle-pattern',
	3: 'bg-diamonds-pattern',
};
function getTheme(index: number): string {
	if (index > Object.keys(THEME_CONFIG).length - 1) return THEME_CONFIG[0];
	const theme: string = Object(THEME_CONFIG)[index];
	return theme;
}

export default getTheme;
