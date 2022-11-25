import React from 'react';
import * as Styled from './style';

type Props = React.ComponentPropsWithoutRef<'div'> & {};

const Container: React.FunctionComponent<Props> = (props) => {
  return <Styled.Container {...props} />;
};

export default Container;
