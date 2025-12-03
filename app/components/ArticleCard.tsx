"use client";

import { Article } from "../types/article";

interface ArticleCardProps {
  article: Article;
  onDelete?: (id: number) => void;
}

export function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50">
      {/* Category badge */}
      {article.category && (
        <span className="mb-3 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          {article.category}
        </span>
      )}

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-zinc-900">
        {article.title}
      </h3>

      {/* Description */}
      {article.description && (
        <p className="mb-4 line-clamp-2 text-sm text-zinc-600">
          {article.description}
        </p>
      )}

      {/* Price */}
      <div className="mt-auto">
        <span className="text-2xl font-bold text-emerald-600">
          {formatPrice(article.price)}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div className="flex flex-col gap-1">
          {article.location && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {article.location}
            </span>
          )}
          <span className="text-xs text-zinc-400">
            {formatDate(article.created_at)}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(article.id)}
            className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Supprimer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
