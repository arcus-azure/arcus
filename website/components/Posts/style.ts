import styled from 'styled-components';

export const Posts = styled.div`
  margin-top: 96px;

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: none;
    }
  }
`;

export const Post = styled.article`
  margin-bottom: 64px;
  border-bottom: 3px solid ${(props) => props.theme.palette.primary[60]};

  h2 {
    font: ${(props) => props.theme.typography.article.emphasis};
    margin-top: 16px;
    margin-bottom: 16px;

    &:before {
      content: none;
    }
  }

  p {
    font: ${(props) => props.theme.typography.text.default};
    margin-bottom: 64px;
  }

  span {
    display: block;
    font: ${(props) => props.theme.typography.text.info};
    color: ${(props) => props.theme.palette.neutral[40]};
  }

  ${Posts} &:hover {
    h2 {
      color: ${(props) => props.theme.palette.primary[60]};
    }
  }
`;
