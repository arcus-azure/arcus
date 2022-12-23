import styled from 'styled-components';
import { media } from '../../config/theme/util';

export const List = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  width: 100%;
  margin-top: 64px;
  margin-bottom: 80px;

  ${media.mobile`
    grid-template-columns: 1fr;
    column-gap: 24px;
    row-gap: 24px;
    justify-content: center;
    justify-items: center;
  `}

  ${media.tablet`
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
    justify-content: start;
    justify-items: start;
  `}

  ${media.desktopSM`
    grid-template-columns: 1fr 1fr 1fr;
  `}

  ${media.desktopLG`
    column-gap: 64px;
    row-gap: 64px;
  `}
`;
