import styled from 'styled-components';
import { media } from '../../config/theme/util';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  border: 2px solid ${(props) => props.theme.palette.primary[60]};
  position: relative;
  text-align: left;

  ${media.mobile`
    width: 100%;
  `}

  ${media.tablet`
    width: 316px; 
  `}

  ${media.desktopSM`
    width: 352px;    
  `}

  ${media.desktopLG`
    width: 370px;
  `}

  h2 {
    font: ${(props) => props.theme.typography.article.emphasis};
    margin: 16px 0;

    &:before {
      content: none;
    }
  }

  p {
    font: ${(props) => props.theme.typography.text.info};
    margin-bottom: 16px;
  }

  a {
    font: ${(props) => props.theme.typography.text.default};
    margin-right: 16px;
  }

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 8px;
    left: 8px;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(props) => props.theme.palette.primary[40]};
    z-index: -1;
    transition: left 0.1s ease-out, bottom 0.1s ease-out;
  }

  &:hover,
  &:hover:before {
    border-color: ${(props) => props.theme.palette.neutral[60]};
  }

  &:hover:before {
    top: 6px;
    left: 6px;
  }
`;
