"use client";


import ArticleDetail from "@/content/article/Article/detail";

// type ArticleDetailPageProps = {
//   params: { id: string };
// };

const ArticleDetailPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <ArticleDetail params={params} />;
};

export default ArticleDetailPages;
