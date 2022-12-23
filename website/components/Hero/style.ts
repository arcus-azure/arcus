import styled, { css } from 'styled-components';
import { media } from '../../config/theme/util';

export const Hero = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    justify-content: space-between;

    > div:first-child {
      h1 {
        margin-bottom: 24px;

        &:before {
          content: none;
        }
      }

      strong {
        color: ${theme.palette.primary[60]};
      }

      p {
        font: ${theme.typography.text.emphasis};
        margin-bottom: 24px;
      }
    }

    ${media.mobile`
      flex-direction: column;
      margin-bottom: 48px;
      
      > div:first-child {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 80px;

        h1 {
          text-align: center;
        }

        strong {
          display: block;
        }

        p {
          text-align: center;
        }
      }

      > div:nth-child(2) {
        display: none;
      }
    `}

    ${media.tablet`
      margin-bottom: 80px;
      
      > div:first-child {
        
        h1 {
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        strong {
          display: inline;
        }
      }

      > div:nth-child(2) {
        display: block;
      }
    `}

    ${media.desktopSM`
      flex-direction: row;
      margin-bottom: 144px;
      
      > div:first-child {
        display: block;
        width: 417px;
        margin-top: 64px;

        h1 {
          text-align: left;
          max-width: initial;
          margin-left: initial;
          margin-right: initial;
        }

        strong {
          display: block;
        }

        p {
          text-align: left;
        }
      }
      
      > div:nth-child(2) {
        width: 650px;
        transform: translateX(70px) translateY(40px);
      }   
    `}

    ${media.desktopLG`
      > div:nth-child(2) {
        width: 800px;
        transform: translateX(70px);
      }  
    `}
  `}
`;
