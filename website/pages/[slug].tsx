import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { readDirForMDX, readMDXContent } from '../helpers/fsReaders';
import React from 'react';
import Head from 'next/head';
import { getFrontMatterModels, getLayoutInformation } from '../helpers/resourceGetters';
import { ComponentMatter, PageMatter, PostMatter, UseCaseMatter } from '../types';
import Section from '../components/Section';
import List from '../components/List';
import Posts from '../components/Posts';
import ComponentList from '../components/ComponentList';

type Props = {
  mdxSource: MDXRemoteSerializeResult;
  posts?: PostMatter[];
  arcusComponents?: ComponentMatter[];
  useCases?: UseCaseMatter[];
};

const Page: NextPage<Props> = ({ mdxSource, posts, arcusComponents, useCases }) => {
  let components = { Section, ul: List, li: List.Item };
  let scope = {};

  if (posts) {
    components = { ...components, ...{ Posts } };
    scope = { posts };
  }

  if (arcusComponents) {
    components = { ...components, ...{ ComponentList } };
    scope = { arcusComponents: arcusComponents.filter((comp) => comp.type === 'component') };
  }

  if (useCases) {
    components = { ...components, ...{ Posts } };
    scope = { useCases };
  }

  return (
    <React.Fragment>
      <Head>
        {mdxSource.frontmatter && (
          <React.Fragment>
            <title>{(mdxSource.frontmatter as PageMatter).title}</title>
            <meta name="description" content={(mdxSource.frontmatter as PageMatter).description} />
          </React.Fragment>
        )}
      </Head>
      <MDXRemote {...mdxSource} components={components} scope={scope} />
    </React.Fragment>
  );
};

export const getStaticProps: GetStaticProps<{ mdxSource: MDXRemoteSerializeResult } | {}> = async ({
  params,
}) => {
  let result = { props: {} };

  if (!params) {
    return result;
  }

  const source = readMDXContent(['pages', `${params.slug}.mdx`]);
  const mdxSource = await serialize(source, { parseFrontmatter: true });

  if (params.slug === 'blog') {
    result = { ...result, ...{ props: { posts: getFrontMatterModels<PostMatter>('posts') } } };
  }

  if (params.slug === 'components') {
    result = {
      ...result,
      ...{
        props: {
          ...result.props,
          arcusComponents: getFrontMatterModels<ComponentMatter>('components'),
        },
      },
    };
  }

  if (params.slug === 'use-cases') {
    result = {
      ...result,
      ...{ props: { ...result.props, useCases: getFrontMatterModels<UseCaseMatter>('use-cases') } },
    };
  }

  return {
    ...result,
    ...{
      props: {
        ...result.props,
        mdxSource,
        ...(await getLayoutInformation()),
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = readDirForMDX(['pages'])
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }));

  return {
    paths: pages,
    fallback: false,
  };
};

export default Page;
