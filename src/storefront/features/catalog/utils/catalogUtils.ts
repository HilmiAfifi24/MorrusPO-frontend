/**
 * Utilitas bersama untuk storefront catalog.
 * Dipisah agar bisa dipakai di MenuPage dan ProductDetailPage tanpa circular import.
 */

// Emoji fallback berdasarkan nama kategori produk
export function getCategoryEmoji(categoryName: string | null | undefined): string {
  if (!categoryName) return "🛍️";
  const lower = categoryName.toLowerCase();
  if (lower.includes("coffee") || lower.includes("kopi")) return "☕";
  if (lower.includes("tea") || lower.includes("teh")) return "🍵";
  if (lower.includes("juice") || lower.includes("jus")) return "🧃";
  if (lower.includes("food") || lower.includes("makan") || lower.includes("snack")) return "🍽️";
  if (lower.includes("pastry") || lower.includes("cake") || lower.includes("kue")) return "🥐";
  if (lower.includes("drink") || lower.includes("minum") || lower.includes("beverage")) return "🥤";
  return "🛍️";
}
