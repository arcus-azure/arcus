import styled from 'styled-components';
import { media } from '../../config/theme/util';

export const Hamburger = styled.label`
  cursor: pointer;
  padding: 16px;
  margin-bottom: 3px;

  > span,
  > span:before,
  > span:after {
    display: block;
    height: 3px;
    width: 24px;
    background: ${(props) => props.theme.palette.text.dark};
    position: relative;
    transition: all 0.2s ease-out;
  }

  > span:before,
  > span:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
  }

  > span:before {
    top: -8px;
  }

  > span:after {
    top: 8px;
  }
`;

export const MenuTrigger = styled.input`
  display: none;

  &:checked {
    ~ ${Hamburger} > span {
      background: transparent;
    }

    ~ ${Hamburger} > span:before {
      transform: rotate(-45deg);
      top: 0;
    }

    ~ ${Hamburger} > span:after {
      transform: rotate(45deg);
      top: 0;
    }

    ~ .desktop {
      padding-top: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 180px;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${(props) => props.theme.palette.background.base};
      z-index: 100;

      > a {
        margin-bottom: 32px;
      }
    }
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 48px 0 104px;
  width: 100%;

  ${media.mobile`
    > a {
      width: 150px;
    }

    ${Hamburger} {
      display: inherit;
    }

    > nav .desktop {
      display: none;
    }
  `}

  ${media.desktopSM`
    > a {
      width: auto;
    }

    ${Hamburger} {
      display: none;
    }

    > nav .desktop {
      display: inherit;
    }
  `}
`;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const NavLink = styled.a<{ active?: boolean }>`
  font: ${(props) => props.theme.typography.article.emphasis};
  color: ${(props) =>
    props.active ? props.theme.palette.primary[60] : props.theme.palette.text.dark};
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.palette.primary[60]};
    cursor: pointer;
    text-decoration: none;
  }

  ${media.desktopSM`
    margin-left: 24px;
  `}

  ${media.desktopLG`
    margin-left: 40px;
  `}
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 64px 0px 48px;
  gap: 88px;
  background: ${(props) => props.theme.palette.neutral[60]};
  color: ${(props) => props.theme.palette.text.light};
  margin-top: 40px;
`;

export const FooterBase = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;

  ${media.mobile`
    flex-direction: column;
  `}

  ${media.desktopSM`
    flex-direction: row;
  `}
`;

export const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  max-width: 500px;

  ${media.mobile`
    flex-direction: column;
    margin-bottom: 80px;
    width: 100%;
  `}

  ${media.tablet`
    flex-direction: row;
  `}

  ${media.desktopSM`
    margin-bottom: 0;
  `}
`;

export const Tag = styled.span`
  display: block;
  max-width: 296px;
  font: ${(props) => props.theme.typography.text.info};

  ${media.mobile`
    margin-left: 0;
    margin-top: 32px;
    text-align: center;
  `}

  ${media.tablet`
    margin-left: 56px;
    margin-top: 0;
    text-align: left;
  `}
`;

export const Bottom = styled.span`
  display: block;
  font: ${(props) => props.theme.typography.text.info};
  align-self: flex-end;
`;

export const LinkSection = styled.section`
  display: grid;
  margin-bottom: 88px;

  ${media.mobile`
    grid-template-columns: max-content max-content;
    grid-template-rows: 1fr;
    column-gap: 32px;
    row-gap: 32px;
  `}

  ${media.tablet`
    grid-template-columns: max-content max-content max-content;
    grid-template-rows: 1fr;
    column-gap: 88px;
  `}
`;

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const LinkTitle = styled.span`
  display: block;
  font: ${(props) => props.theme.typography.article.emphasis};
  margin-bottom: 16px;
`;

export const Link = styled.a`
  font: ${(props) => props.theme.typography.text.default};
  color: ${(props) => props.theme.palette.text.light};
  margin-bottom: 8px;
`;
