import React from 'react';
import Link from 'next/link';

type Props = React.ComponentPropsWithoutRef<'a'> & {};

const MDXNextLink: React.FunctionComponent<Props> = ({ href, ...props }) => {
  return (
    <Link href={href || '/'}>
      <a {...props}></a>
    </Link>
  );
};

export default MDXNextLink;
