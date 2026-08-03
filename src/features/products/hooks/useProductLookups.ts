import { useEffect, useState } from "react";
import { getCategories } from "../../categories/api/categoriesApi";
import type { CategoryDto } from "../../categories/types/category";
import { getOutlets } from "../../outlets/api/outletsApi";
import type { OutletLookupDto } from "../../outlets/types/outlet";
import { getErrorMessage } from "../../../utils/errors";

type ProductLookupsState = {
  categories: CategoryDto[];
  outlets: OutletLookupDto[];
  isLoading: boolean;
  error: string | null;
};

export function useProductLookups(shouldLoadOutlets: boolean) {
  const [state, setState] = useState<ProductLookupsState>({
    categories: [],
    outlets: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function loadLookups() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const [categories, outlets] = await Promise.all([
          getCategories(),
          shouldLoadOutlets ? getOutlets() : Promise.resolve([]),
        ]);

        setState({
          categories,
          outlets,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          categories: [],
          outlets: [],
          isLoading: false,
          error: getErrorMessage(error, "Gagal memuat kategori dan outlet."),
        });
      }
    }

    void loadLookups();
  }, [shouldLoadOutlets]);

  return state;
}
