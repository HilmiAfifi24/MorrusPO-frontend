import { storefrontClient } from "../../../api/storefrontClient";
import type { PublicProduct, PublicCategory } from "../types";

/**
 * Ambil katalog produk aktif + stok untuk satu outlet.
 * Endpoint: GET /api/public/catalog/{outletCode}
 */
export async function fetchCatalog(outletCode: string): Promise<PublicProduct[]> {
  return storefrontClient.get<PublicProduct[]>(
    `/api/public/catalog/${encodeURIComponent(outletCode)}`
  );
}

/**
 * Ambil semua kategori — untuk filter di halaman menu.
 * Endpoint: GET /api/public/categories
 */
export async function fetchCategories(): Promise<PublicCategory[]> {
  return storefrontClient.get<PublicCategory[]>("/api/public/categories");
}
