# Arcus documentation

To update the documentation on the website there are 2 folders you should use `/public` and `/resources`.

- `/public`, contains all assets (f.e. images) you can use in the pages
- `/resources`, contains the actual documentation resources, available in basic markdown (`.md`) or MDX (`.mdx`) files.

Most resources are markdown based, only the files within `/pages` and the index file are using MDX. This allows us to use JSX within our markdown files and create pages that don't only look good but are also easy to update, read more on their [official website](https://mdxjs.com/).

## Adding a new blog post

1. Create a new file in `/resources/posts`
2. Provide a `title`, `date`, `description` and `articleUrl` in the metadata

## Adding a new component

1. Create a new file in `/resources/components`
2. Provide a `title`, `description`, `github`, `documentation` and `type` (`component` or `template`) in the metadata
3. Provide a brief summary with what the goal of the component is
4. If it needs to be featured on the homepage, add `featured: true` to the metadata

## Adding a new use-case

1. Create a new file in `/resources/use-cases`
2. Provide a `title`, `slug`, `description`, `order` and a list of `components` in the metadata with general information
3. Provide a thorough use-case on how you can combine Arcus components to bring added value quickly, don't forget to add proper code syntax to your code blocks (f.e. ` ```csharp `).

## Updating content in MDX files

Updating content in the pages is as easy as writing markdown. You can use the same syntax, add images and links. Only thing you do have to be aware that adding text within the body of a component requires a blank line both above and below.

```jsx
// ❌ Bad
<Section.Center>
    ## Start exploring
</Section.Center>

// ✅ Good
<Section.Center>

    ## Start exploring

</Section.Center>
```

## Need to update footer content?

While this probably isn't needed, you can find all content for this within the `/resources/layout/config.json` file. You can add social links to your liking. Components and Resources are auto-generated from the available components and pages within `/resources`.

# Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Using MDX

Here is an example on how to use the MDX component within your app. See [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) for information.

```jsx
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import Test from '../components/test';

const components = { Test };

export default function TestPage({ source }) {
  return (
    <div className="wrapper">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

export async function getStaticProps() {
  // MDX text - can be from a local file, database, anywhere
  const source = 'Some **mdx** text, with a component <Test />';
  const mdxSource = await serialize(source);
  return { props: { source: mdxSource } };
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
