// import original module declarations
import 'styled-components';
import { RootTheme } from './config/theme';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends RootTheme {}
}
