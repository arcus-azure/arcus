import styled from 'styled-components';

export const List = styled.ul`
  padding-left: 20px;
`;

export const Item = styled.li`
  strong {
    font: ${(props) => props.theme.typography.article.emphasis};
  }

  p {
    margin-bottom: 24px;
  }
`;
