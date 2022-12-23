import { palette } from './palette';
import { typography } from './typography';

export const theme = {
  palette,
  typography,
};

export type RootTheme = Readonly<typeof theme>;

export { palette, typography };
