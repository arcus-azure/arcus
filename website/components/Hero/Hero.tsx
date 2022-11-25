import React from 'react';
import Image from 'next/image';
import * as S from './style';
import imageLoader from '../../loader';
import Link from 'next/link';

type Props = React.ComponentPropsWithoutRef<'div'> & {};

const Hero: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <S.Hero>
      <div>
        {children}
        <Link href={'/components'}>
          <a className="btn">{'Get Started'}</a>
        </Link>
      </div>
      <div>
        <Image loader={imageLoader} src={'/Program.svg'} width={800} height={505} alt={''} />
      </div>
    </S.Hero>
  );
};

export default Hero;
