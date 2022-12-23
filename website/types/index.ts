export type PageMatter = {
  title: string;
  slug: string;
  description?: string;
  order: number;
};

export type PostMatter = {
  title: string;
  date: string;
  description: string;
  articleUrl: string;
};

export type ComponentMatter = {
  title: string;
  description: string;
  github: string;
  documentation: string;
  type: 'component' | 'template';
  featured?: boolean;
};

export type UseCaseMatter = {
  title: string;
  slug: string;
  order: number;
  description: string;
  components: string[];
};

export type UserMatter = {
  name: string;
  logo: string;
  url: string;
};
