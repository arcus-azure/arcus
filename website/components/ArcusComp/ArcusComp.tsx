import Image from 'next/image';
import React from 'react';
import { ComponentMatter } from '../../types';
import * as Styled from './style';
import imageLoader from '../../loader';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  component: ComponentMatter;
};

const ArcusComp: React.FunctionComponent<Props> = ({ component }) => {
  return (
    <Styled.Card>
      <Image
        loader={imageLoader}
        src={component.type === 'template' ? '/Template.svg' : '/Component.svg'}
        width={40}
        height={40}
        alt={component.type === 'template' ? 'Arcus template' : 'Arcus component'}
      />
      <h2>{component.title}</h2>
      <p>{component.description}</p>
      <footer>
        <a href={component.documentation} target={'_blank'} rel="noreferrer">
          {'Docs'}
        </a>
        <a href={component.github} target={'_blank'} rel="noreferrer">
          {'GitHub'}
        </a>
      </footer>
    </Styled.Card>
  );
};

export default ArcusComp;
