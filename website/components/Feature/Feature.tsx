import React from 'react';
import * as S from './style';

type Props = React.ComponentPropsWithoutRef<'div'> & {};

const Feature: React.FunctionComponent<Props> = ({ children }) => {
  return <S.Feature>{children}</S.Feature>;
};

export default Feature;
