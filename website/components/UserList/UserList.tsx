import React from 'react';
import Image from 'next/image';
import { UserMatter } from '../../types';
import imageLoader from '../../loader';
import * as S from './style';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  users: UserMatter[];
};

const UserList: React.FunctionComponent<Props> = ({ users }) => {
  return (
    <S.List>
      <p>{'Adopted by'}</p>
      <S.User>
        {users.map((user, index) => (
          <a key={index} href={user.url} target="_blank" rel="noreferrer">
            <Image
              loader={imageLoader}
              src={user.logo}
              layout={'fill'}
              objectFit="contain"
              alt={user.name}
            />
          </a>
        ))}
      </S.User>
    </S.List>
  );
};

export default UserList;
