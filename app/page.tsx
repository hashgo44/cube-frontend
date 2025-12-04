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

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-white via-emerald-50/40 to-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-center text-zinc-600">{error}</p>
        <a
          href="/"
          className="cursor-pointer rounded-xl bg-zinc-900 px-6 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Réessayer
        </a>
      </div>
    );
  }

  return <ArticlesPage initialArticles={articles} searchQuery={search} />;
}
