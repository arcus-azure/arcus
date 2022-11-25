import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ComponentMatter, PageMatter } from '../../types';
import Container from '../Container';
import * as Styled from './style';
import imageLoader from '../../loader';
import config from '../../resources/layout/config.json';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  pages?: PageMatter[];
  components?: ComponentMatter[];
};

const handleScroll = () => {
  if (document.body.classList.contains('noscroll')) {
    document.body.classList.remove('noscroll');
  } else {
    document.body.classList.add('noscroll');
  }
};

const Layout: React.FunctionComponent<Props> = ({ children, pages, components }) => {
  const router = useRouter();
  const menuRef = React.useRef<HTMLInputElement>(null);

  const handleNavClick = () => {
    if (menuRef.current && menuRef.current.checked) {
      menuRef.current.checked = false;
      handleScroll();
    }
  };

  return (
    <Styled.Layout>
      <Container>
        <Styled.Header>
          <Link href={'/'}>
            <a>
              <Image
                loader={imageLoader}
                src={'/Logo_Dark.svg'}
                alt="Arcus logo"
                width={192}
                height={47}
              />
            </a>
          </Link>
          <nav>
            <Styled.MenuTrigger
              ref={menuRef}
              type="checkbox"
              id="side-menu"
              onClick={handleScroll}
            />
            <Styled.Hamburger className="hamburger" htmlFor="side-menu">
              <span></span>
            </Styled.Hamburger>
            <div className="desktop">
              {pages &&
                pages
                  .sort((a1, a2) => a1.order - a2.order)
                  .map((page) => (
                    <Link key={page.slug} href={`/${page.slug}`} passHref>
                      <Styled.NavLink
                        active={router.query.slug === page.slug}
                        onClick={handleNavClick}
                      >
                        {page.title}
                      </Styled.NavLink>
                    </Link>
                  ))}
              {config.nav.map((item, index) => (
                <Styled.NavLink key={index} href={item.link} target="_blank">
                  {item.name}
                </Styled.NavLink>
              ))}
            </div>
          </nav>
        </Styled.Header>
        {children}
      </Container>
      <Styled.Footer>
        <Container>
          <Styled.FooterBase>
            <Styled.FooterBrand>
              <Image
                loader={imageLoader}
                src={'/Mono_Logo_Light.svg'}
                alt="Arcus logo"
                width={150}
                height={38}
              />
              <Styled.Tag>{config.tagline}</Styled.Tag>
            </Styled.FooterBrand>
            <Styled.LinkSection>
              <Styled.Links>
                <Styled.LinkTitle>{config.links.components}</Styled.LinkTitle>
                {components &&
                  components
                    .filter((comp) => comp.type === 'component')
                    .map((comp, index) => (
                      <Styled.Link
                        key={index}
                        href={comp.documentation}
                        target={'_blank'}
                        rel="noreferrer"
                      >
                        {comp.title}
                      </Styled.Link>
                    ))}
              </Styled.Links>
              <Styled.Links>
                <Styled.LinkTitle>{config.links.resources}</Styled.LinkTitle>
                {pages &&
                  pages
                    .sort((a1, a2) => a1.order - a2.order)
                    .map((page) => (
                      <Link key={page.slug} href={`/${page.slug}`} passHref>
                        <Styled.Link>{page.title}</Styled.Link>
                      </Link>
                    ))}
              </Styled.Links>
              <Styled.Links>
                <Styled.LinkTitle>{config.links.social}</Styled.LinkTitle>
                {config.social.map((socialItem, index) => (
                  <Styled.Link
                    key={index}
                    href={socialItem.link}
                    target={'_blank'}
                    rel="noreferrer"
                  >
                    {socialItem.name}
                  </Styled.Link>
                ))}
              </Styled.Links>
            </Styled.LinkSection>
          </Styled.FooterBase>
          <Styled.Bottom>
            {`${config['allRights-pre']} ${new Date().getFullYear()}. ${config.allRights}`}{' '}
            <Link href="https://codit.eu">
              <a target={'_blank'} rel="noreferrer" aria-label="Codit.eu">
                <Image
                  loader={imageLoader}
                  src={'/Logo_Codit.svg'}
                  alt="Codit"
                  width={52}
                  height={18}
                />
              </a>
            </Link>
          </Styled.Bottom>
        </Container>
      </Styled.Footer>
    </Styled.Layout>
  );
};

export default Layout;
