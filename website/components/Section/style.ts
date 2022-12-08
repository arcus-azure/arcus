import styled, { css } from 'styled-components';
import { media } from '../../config/theme/util';
import { List } from '../List/style';

type Section = {
  centered?: boolean;
};

export const Section = styled.section<Section>`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  font: ${(props) => props.theme.typography.text.emphasis};

  ${({ centered }) =>
    centered &&
    css`
      &&& {
        align-items: center;
        flex-direction: column;
      }

      h1,
      h2 {
        max-width: 750px;
        margin-right: auto;
        margin-left: auto;

        &:before {
          left: 50%;
          transform: translate(-50%);
        }
      }
    `}

  ${media.mobile`
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  `}

  ${media.desktopSM`
    flex-direction: row;
    align-items: start;
    margin-bottom: 80px;
  `}
`;

type Left = { half?: boolean };
export const Left = styled.div<Left>`
  ${({ half }) => css`
    flex-shrink: 0;
    text-align: left;

    ${media.mobile`
      width: 100%;
      margin-right: 0;
    `}

    ${media.desktopSM`
      width: ${half ? '50%' : '460px'};
      margin-right: ${half ? '0' : '104px'};
    `}
  `}
`;

export const Right = styled.div`
  p {
    margin-bottom: 48px;
  }

  ${List} {
    li::marker {
      content: '✓ ';
    }
  }
`;

export const Center = styled.div`
  text-align: center;
  width: 100%;
`;

export type Marked = { marked?: boolean };
export const Full = styled.div<Marked>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  max-width: 100%;

  p {
    max-width: 820px;
  }

  ${({ theme, marked }) =>
    marked &&
    css`
      ${media.mobile`
        max-width: 100%;
      `}

      ${media.desktopSM`
        max-width: 80%;
      `}

      p, ul {
        max-width: 100%;
        margin-bottom: 24px;
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        max-width: 900px;
      }

      h2,
      h3,
      h4,
      h5 {
        margin-top: 32px;
        margin-bottom: 16px;
      }

      h2 {
        font: ${theme.typography.page.title};

        &:before {
          content: none;
        }
      }

      pre {
        font-size: 18px;
        margin: 0 0 24px 0;
      }

      img {
        width: 100%;
      }
    `}
`;
