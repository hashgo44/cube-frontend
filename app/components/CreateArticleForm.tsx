"use client";

import { useState } from "react";
import { ArticleCreate } from "../types/article";

interface CreateArticleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Électronique",
  "Véhicules",
  "Immobilier",
  "Maison & Jardin",
  "Mode",
  "Sports & Loisirs",
  "Services",
  "Emploi",
  "Autre",
];

export function CreateArticleForm({ onSuccess, onCancel }: CreateArticleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleCreate>({
    title: "",
    description: "",
    price: 0,
    category: "",
    location: "",
    contact_email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          description: formData.description || undefined,
          category: formData.category || undefined,
          location: formData.location || undefined,
          contact_email: formData.contact_email || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erreur lors de la création");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900">
            Nouvelle annonce
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Titre *
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={255}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Ex: iPhone 14 Pro Max 256Go"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Décrivez votre article..."
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Prix (€) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={0.01}
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Sélectionner</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Localisation
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Paris, France"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email de contact
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="contact@email.com"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 cursor-pointer rounded-xl border border-zinc-200 px-4 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 cursor-pointer rounded-xl bg-emerald-500 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Publication..." : "Publier l'annonce"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
