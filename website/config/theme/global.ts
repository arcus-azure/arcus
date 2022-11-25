import { createGlobalStyle, css } from 'styled-components';
import { media } from './util';

const GlobalStyle = createGlobalStyle`
  ${({ theme }) => css`
    body {
      font-family: sans-serif;
      font: ${theme.typography.text.default};
      color: ${theme.palette.text.dark};

      &.noscroll {
        height: 100%;
        overflow: hidden;
      }
    }

    * {
      margin: 0;
      padding: 0;
    }

    h1,
    h2 {
      position: relative;
      margin-bottom: 104px;

      &:before {
        content: '';
        position: absolute;
        height: 3px;
        background: ${theme.palette.primary[60]};
        bottom: -48px;
      }

      ${media.mobile`
        font: ${theme.typography.page.mobile};
        &:before {
          width: 250px;
        }
      `}

      ${media.tablet`
        font: ${theme.typography.page.title};
        &:before {
          width: 300px;
        }
      `}

      ${media.desktopSM`
        font: ${theme.typography.page.large};
        &:before {
          width: 400px;
        }
      `}
    }

    h3 {
      font: ${theme.typography.article.heading};
      margin-bottom: 32px;
    }

    h4 {
      font: ${theme.typography.article.emphasis};
    }

    h5 {
      font: ${theme.typography.text.emphasis};
    }

    a {
      color: ${theme.palette.primary[60]};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    a.btn,
    button {
      color: ${theme.palette.text.light};
      background: ${theme.palette.primary[60]};
      font: ${theme.typography.article.emphasis};
      font-size: 20px;
      padding: 16px 32px;
      display: inline-block;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        text-decoration: none;
        background: ${theme.palette.neutral[60]};
      }
    }
  `}
`;

export default GlobalStyle;
