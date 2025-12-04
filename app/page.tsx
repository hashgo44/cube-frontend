import { getArticles } from "./actions/articles";
import { ArticlesPage } from "./components/ArticlesPage";
import { Article } from "./types/article";

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { search } = await searchParams;

  let articles: Article[] = [];
  let error: string | null = null;

  try {
    articles = await getArticles(search);
  } catch (e) {
    error = e instanceof Error ? e.message : "Erreur de connexion";
  }

  return <ArticlesPage initialArticles={articles} searchQuery={search} error={error} />;
}
