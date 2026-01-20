import React from 'react';
import format from 'date-fns';
import { PostMatter, UseCaseMatter } from '../../types';
import * as Styled from './style';
import Link from 'next/link';

type Props = React.ComponentPropsWithoutRef<'div'> &
  (
    | {
        posts: PostMatter[];
        variant: 'blog';
      }
    | {
        posts: UseCaseMatter[];
        variant: 'use-case';
      }
  );

const dateSort = (a1: PostMatter, a2: PostMatter) => {
  if (new Date(a1.date) > new Date(a2.date)) {
    return -1;
  } else {
    return 1;
  }
};

const orderSort = (a1: UseCaseMatter, a2: UseCaseMatter) => a1.order - a2.order;

const Posts: React.FunctionComponent<Props> = ({ posts, variant }) => {
  const [showMore, toggleMore] = React.useState(false);

  return (
    <Styled.Posts>
      {variant === 'blog' &&
        posts
          .sort(dateSort)
          .slice(0, showMore ? posts.length : 10)
          .map((post, index) => (
            <a href={post.articleUrl} target={'_blank'} key={index} rel="noreferrer">
              <Styled.Post>
                <span>{format(new Date(post.date), 'd MMMM yyyy')}</span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </Styled.Post>
            </a>
          ))}
      {variant === 'use-case' &&
        posts.sort(orderSort).map((post, index) => (
          <Link href={`use-cases/${post.slug}`} key={index}>
            <a>
              <Styled.Post>
                <span>
                  {'Uses: '}
                  {post.components.join(', ')}
                </span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </Styled.Post>
            </a>
          </Link>
        ))}
      {variant === 'blog' && !showMore && posts.length > 10 && (
        <button onClick={() => toggleMore(true)}>I need more ...</button>
      )}
    </Styled.Posts>
  );
};

export default Posts;
