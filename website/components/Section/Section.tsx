import React from 'react';
import * as Styled from './style';

type SectionComponent = React.FunctionComponent<React.ComponentPropsWithoutRef<'section'>> & {
  Left: React.FunctionComponent<React.ComponentPropsWithoutRef<'div'>>;
  Right: React.FunctionComponent<React.ComponentPropsWithoutRef<'div'>>;
  Center: React.FunctionComponent<React.ComponentPropsWithoutRef<'div'>>;
  Full: React.FunctionComponent<React.ComponentPropsWithoutRef<'div'> & Styled.Marked>;
};

const Section: SectionComponent = (props) => {
  return <Styled.Section {...props} />;
};

Section.Left = Styled.Left;
Section.Right = Styled.Right;
Section.Center = Styled.Center;
Section.Full = Styled.Full;

export default Section;
