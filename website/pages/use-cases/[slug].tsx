import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import React from 'react';
import Head from 'next/head';
import { UseCaseMatter } from '../../types';
import { readDirForMDX, readMDXContent } from '../../helpers/fsReaders';
import { getLayoutInformation } from '../../helpers/resourceGetters';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';
import Section from '../../components/Section';
import List from '../../components/List';

type Props = {
  mdxSource: MDXRemoteSerializeResult;
};

const Page: NextPage<Props> = ({ mdxSource }) => {
  return (
    <React.Fragment>
      <Head>
        {mdxSource.frontmatter && (
          <React.Fragment>
            <title>{(mdxSource.frontmatter as UseCaseMatter).title}</title>
            <meta
              name="description"
              content={(mdxSource.frontmatter as UseCaseMatter).description}
            />
          </React.Fragment>
        )}
      </Head>
      <Section>
        <Section.Full marked>
          <MDXRemote {...mdxSource} components={{ ul: List }} />
        </Section.Full>
      </Section>
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

  const source = readMDXContent(['use-cases', `${params.slug}.md`]);
  const mdxSource = await serialize(source, {
    parseFrontmatter: true,
    mdxOptions: {
      rehypePlugins: [rehypePrism],
    },
  });

  return {
    ...result,
    ...{ props: { mdxSource, ...(await getLayoutInformation()) } },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = readDirForMDX(['use-cases'])
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }));

  return {
    paths: pages,
    fallback: false,
  };
};

export default Page;
