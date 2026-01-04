"use server";

import { revalidatePath } from "next/cache";
import { Article, ArticleCreate } from "../types/article";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function getArticles(search?: string): Promise<Article[]> {
  const url = search
    ? `${BACKEND_URL}/articles?search=${encodeURIComponent(search)}`
    : `${BACKEND_URL}/articles`;

  console.log("🔄 [Server] Fetching articles from:", url);

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("❌ [Server] Failed to fetch articles:", response.status);
      throw new Error("Erreur lors du chargement des articles");
    }

    const data = await response.json();
    console.log("✅ [Server] Articles fetchedd:", data.length);
    return data;
  } catch (error) {
    console.error("❌ [Server] Error:", error);
    throw error;
  }
}

export async function createArticle(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const payload: ArticleCreate = {
    title: formData.get("title") as string,
    price: parseFloat(formData.get("price") as string) || 0,
    description: (formData.get("description") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    contact_email: (formData.get("contact_email") as string) || undefined,
  };

  console.log("📝 [Server] Creating article:", payload.title);

  try {
    const response = await fetch(`${BACKEND_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("❌ [Server] Failed to create article:", data);
      return { success: false, error: data.detail || "Erreur lors de la création" };
    }

    const created = await response.json();
    console.log("✅ [Server] Article created:", created.id, "-", created.title);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ [Server] Error:", error);
    return { success: false, error: "Erreur de connexion au serveur" };
  }
}

export async function deleteArticle(id: number): Promise<{ success: boolean; error?: string }> {
  console.log("🗑️ [Server] Deleting article:", id);

  try {
    const response = await fetch(`${BACKEND_URL}/articles/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("❌ [Server] Failed to delete article:", response.status);
      return { success: false, error: "Erreur lors de la suppression" };
    }

    console.log("✅ [Server] Article deleted:", id);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ [Server] Error:", error);
    return { success: false, error: "Erreur de connexion au serveur" };
  }
}

