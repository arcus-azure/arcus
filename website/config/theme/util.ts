import { css, SimpleInterpolation } from 'styled-components';

export const media = {
  desktopLG: (literals: TemplateStringsArray, ...placeholders: SimpleInterpolation[]) =>
    css`
      @media (min-width: 1440px) {
        ${css(literals, ...placeholders)};
      }
    `,
  desktopSM: (literals: TemplateStringsArray, ...placeholders: SimpleInterpolation[]) =>
    css`
      @media (min-width: 1280px) {
        ${css(literals, ...placeholders)};
      }
    `,
  tablet: (literals: TemplateStringsArray, ...placeholders: SimpleInterpolation[]) =>
    css`
      @media (min-width: 744px) {
        ${css(literals, ...placeholders)};
      }
    `,
  mobile: (literals: TemplateStringsArray, ...placeholders: SimpleInterpolation[]) =>
    css`
      @media (min-width: 320px) {
        ${css(literals, ...placeholders)};
      }
    `,
};
