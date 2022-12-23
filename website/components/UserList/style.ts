import styled, { css } from 'styled-components';
import { media } from '../../config/theme/util';

export const List = styled.div`
  ${({ theme }) => css`
    width: 100%;

    p {
      font: ${theme.typography.text.info};
      color: ${theme.palette.neutral[30]};
      margin-bottom: 24px;
      text-align: center;
    }

    ${media.mobile`
      margin-bottom: 32px;
    `}

    ${media.tablet`
      margin-bottom: 80px;
    `}

    ${media.desktopSM`
      margin-bottom: 112px;
    `}
  `}
`;

export const User = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 90%;
  margin: 0 auto;

  a {
    position: relative;
    width: 250px;
    height: 50px;

    img {
      filter: gray;
      -webkit-filter: grayscale(1);
      filter: grayscale(1);
      opacity: 0.5;
    }

    img:hover {
      -webkit-filter: grayscale(0);
      filter: none;
      opacity: 1;
    }

    ${media.mobile`
      margin: 0 auto 48px;
    `}

    ${media.tablet`
      margin: 0 24px;
    `}
    
    ${media.desktopSM`
      margin: 0;
    `}
  }

  ${media.mobile`
    flex-direction: column;
  `}

  ${media.tablet`
    flex-direction: row;
  `}

  ${media.desktopSM`
    margin: 0 auto;
  `}
`;
