export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    content: "Learn how App Router and Server Components work together.",
    createdAt: "2026-05-27",
  },
  {
    id: "2",
    title: "Building APIs with Elysia",
    content: "A quick guide to creating fast APIs using Bun and ElysiaJS.",
    createdAt: "2026-05-26",
  },
  {
    id: "3",
    title: "Organizing Frontend Folders",
    content: "Tips for keeping routes, components, and lib code clean.",
    createdAt: "2026-05-25",
  },
];

export async function getPosts(): Promise<Post[]> {
  return mockPosts;
}
