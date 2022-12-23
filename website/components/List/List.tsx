import React from 'react';
import * as Styled from './style';

type ListComponent = React.FunctionComponent & {
  Item: React.FunctionComponent;
};

const List: ListComponent = (props) => {
  return <Styled.List {...props} />;
};

List.Item = Styled.Item;

export default List;
