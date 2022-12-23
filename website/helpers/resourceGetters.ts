import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { ComponentMatter } from '../types';
import { readDirForMDX, readMDXContent } from './fsReaders';

export const getPages = async () => {
  return await Promise.all(
    readDirForMDX(['pages']).map(async (mdx) => {
      const fileContent = readMDXContent(['pages', mdx]);
      const mdxPage = await serialize(fileContent, { parseFrontmatter: true });
      return mdxPage.frontmatter;
    })
  );
};

export const getFrontMatterModels = <T>(path: string) => {
  const paths = readDirForMDX([path]);
  return getFrontMatter<T>([path], paths);
};

export const getLayoutInformation = async () => {
  return {
    pages: await getPages(),
    components: getFrontMatterModels<ComponentMatter>('components'),
  };
};

export const getFrontMatter = <T extends unknown>(basePaths: string[], collection: string[]) => {
  return collection.map((item) => {
    const fileContent = readMDXContent([...basePaths, item]);
    const { data } = matter(fileContent);

    return JSON.parse(JSON.stringify(data)) as T;
  });
};
