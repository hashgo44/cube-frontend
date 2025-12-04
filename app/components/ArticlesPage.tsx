"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../types/article";
import { ArticleCard } from "./ArticleCard";
import { CreateArticleForm } from "./CreateArticleForm";
import { deleteArticle } from "../actions/articles";

interface ArticlesPageProps {
  initialArticles: Article[];
  searchQuery?: string;
  error?: string | null;
}

export function ArticlesPage({ initialArticles, searchQuery = "", error }: ArticlesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState(searchQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearch(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      router.push(value ? `/?${params.toString()}` : "/");
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;

    const result = await deleteArticle(id);
    if (!result.success) {
      alert(result.error || "Erreur lors de la suppression");
    }
  };

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/40 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Collector</h1>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/40"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Déposer une annonce
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher une annonce..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-zinc-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
            {isPending && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-center text-zinc-600">{error}</p>
            <button
              onClick={handleRetry}
              className="cursor-pointer rounded-xl bg-zinc-900 px-6 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {initialArticles.length} annonce{initialArticles.length > 1 ? "s" : ""} disponible{initialArticles.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Content */}
            {initialArticles.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <svg className="h-10 w-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium text-zinc-900">Aucune annonce</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Soyez le premier à déposer une annonce !
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 cursor-pointer rounded-xl bg-emerald-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  Créer une annonce
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {initialArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Form Modal */}
      {showForm && (
        <CreateArticleForm
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
