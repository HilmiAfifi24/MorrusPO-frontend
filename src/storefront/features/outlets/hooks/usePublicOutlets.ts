import { useEffect, useState, useCallback } from "react";
import { fetchPublicOutlets } from "../api/outletApi";
import type { PublicOutlet } from "../types";

interface UsePublicOutletsResult {
  outlets: PublicOutlet[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook untuk mengambil daftar outlet aktif dari backend.
 * Dipakai di OutletsPage untuk menampilkan pilihan outlet kepada customer.
 */
export function usePublicOutlets(): UsePublicOutletsResult {
  const [outlets, setOutlets] = useState<PublicOutlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPublicOutlets();
      setOutlets(data);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(
        apiError?.message ??
          "Gagal memuat daftar outlet. Silakan periksa koneksi Anda dan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { outlets, isLoading, error, refetch: load };
}
