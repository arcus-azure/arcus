import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { readMDXContent } from '../helpers/fsReaders';
import React, { PropsWithoutRef } from 'react';
import { getFrontMatterModels, getLayoutInformation } from '../helpers/resourceGetters';
import Section from '../components/Section';
import Feature from '../components/Feature';
import Hero from '../components/Hero';
import UserList from '../components/UserList';
import ComponentList from '../components/ComponentList';
import { ComponentMatter, UserMatter } from '../types';
import MDXNextLink from '../components/MDXNextLink';

type Props = {
  mdxSource: MDXRemoteSerializeResult;
  users: UserMatter[];
  components: ComponentMatter[];
};

const Home: NextPage<Props> = ({ mdxSource, users, components }) => {
  return (
    <React.Fragment>
      <Head>
        {mdxSource.frontmatter && (
          <React.Fragment>
            <title>{(mdxSource.frontmatter as any).title}</title>
            <meta name="description" content={(mdxSource.frontmatter as any).description} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:url" content={'https://arcus-azure.net/'} />
            <meta name="twitter:title" content={(mdxSource.frontmatter as any).title} />
            <meta name="twitter:description" content={(mdxSource.frontmatter as any).description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={(mdxSource.frontmatter as any).title} />
            <meta property="og:description" content={(mdxSource.frontmatter as any).description} />
            <meta property="og:site_name" content={'Arcus'} />
            <meta property="og:url" content={'https://arcus-azure.net/'} />
          </React.Fragment>
        )}
      </Head>
      <MDXRemote
        {...mdxSource}
        components={{ Section, Feature, Hero, UserList, ComponentList, a: MDXNextLink }}
        scope={{ users, components: components.filter((comp) => comp.featured) }}
      />
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps<{ mdxSource: MDXRemoteSerializeResult }> = async () => {
  const source = readMDXContent(['index.mdx']);
  const mdxSource = await serialize(source, { parseFrontmatter: true });

  return {
    props: {
      mdxSource,
      ...(await getLayoutInformation()),
      users: getFrontMatterModels<UserMatter>('users'),
    },
  };
};

export default Home;
