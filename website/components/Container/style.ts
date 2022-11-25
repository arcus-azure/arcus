import styled from 'styled-components';
import { media } from '../../config/theme/util';

export const Container = styled.div`
  width: auto;
  display: none;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  flex-grow: 1;

  ${media.mobile`
    display: flex;
    max-width: calc(100% - 48px);
  `}

  ${media.tablet`
    max-width: 644px;
  `}

  ${media.desktopSM`
    max-width: 1088px;
  `}

  ${media.desktopLG`
    max-width: 1238px;
  `}
`;
