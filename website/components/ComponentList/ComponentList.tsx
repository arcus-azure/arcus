import React from 'react';
import { ComponentMatter } from '../../types';
import ArcusComp from '../ArcusComp';
import * as Styled from './style';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  components: ComponentMatter[];
};

const ComponentList: React.FunctionComponent<Props> = ({ components }) => {
  return (
    <React.Fragment>
      <Styled.List>
        {components.map((comp, index) => (
          <ArcusComp key={index} component={comp} />
        ))}
      </Styled.List>
    </React.Fragment>
  );
};

export default ComponentList;
