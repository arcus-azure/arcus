import styled from 'styled-components';
import { media } from '../../config/theme/util';

export const Feature = styled.div`
  margin-top: 48px;
  padding: 0 24px;

  h3 {
    margin-bottom: 24px;
  }

  p {
    font: ${(props) => props.theme.typography.text.default};
  }

  img {
    width: 150px;
    height: 150px;
  }

  ${media.mobile`
    width: 100%;
    max-width: 400px;
  `}

  ${media.tablet`
    max-width: 100%;
    width: 100%;

    img {
      float: left;
      margin: 32px 32px 32px 0;
    }

    p, h3 {
      text-align: right;
    }

    h3 {
      width: 320px;
      margin-right: 0;
      margin-left: auto;
    }

    &:nth-child(2) {
      img {
        float: right;
        margin: 32px 0 32px 32px;
      }

      p, h3 {
        text-align: left;
      }

      h3 {
        margin-right: auto;
        margin-left: 0;
      }
    }
  `}

  ${media.desktopSM`
    width: 400px;
    max-width: 400px;

    &, &:nth-child(2) {
      img {
        float: none;
        margin: 0;
      }
      
      h3, p {
        width: auto;
        margin-left: 0;
        margin-right: 0;
        text-align: inherit;
      }
    }
  `}
`;
