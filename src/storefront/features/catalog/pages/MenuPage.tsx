import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useStorefront, type StorefrontProduct } from "../../../context/StorefrontContext";

const DUMMY_PRODUCTS: StorefrontProduct[] = [
  { id: "101", name: "Classic Espresso", sku: "PRD-ESP-01", price: 22000, unit: "Cup", qtyOnHand: 15, description: "Espresso shot murni diekstrak presisi dari biji kopi arabika pilihan.", categoryName: "Coffee", imageUrl: "☕" },
  { id: "102", name: "Iced Cafe Latte", sku: "PRD-LAT-02", price: 28000, unit: "Cup", qtyOnHand: 4, description: "Perpaduan espresso arabika morrus dengan susu segar dingin yang creamy.", categoryName: "Coffee", imageUrl: "🥛" },
  { id: "103", name: "Signature Matcha Latte", sku: "PRD-MAT-03", price: 30000, unit: "Cup", qtyOnHand: 12, description: "Matcha khas Uji Jepang kualitas premium dipadu dengan susu segar manis.", categoryName: "Non-Coffee", imageUrl: "🍵" },
  { id: "104", name: "Butter Croissant", sku: "PRD-CRO-04", price: 25000, unit: "Pcs", qtyOnHand: 0, description: "Croissant gurih berlapis mentega Prancis, disajikan hangat dan renyah.", categoryName: "Pastry", imageUrl: "🥐" },
  { id: "105", name: "Hot Cappuccino", sku: "PRD-CAP-05", price: 28000, unit: "Cup", qtyOnHand: 20, description: "Minuman espresso klasik dengan foam susu tebal dan taburan bubuk cokelat.", categoryName: "Coffee", imageUrl: "☕" },
  { id: "106", name: "Iced Lemon Tea", sku: "PRD-LTE-06", price: 20000, unit: "Cup", qtyOnHand: 3, description: "Teh hitam dingin dipadu dengan perasan lemon segar untuk melepas dahaga.", categoryName: "Non-Coffee", imageUrl: "🍹" },
];

const CATEGORIES = ["Semua", "Coffee", "Non-Coffee", "Pastry"];

const CATEGORY_ICONS: Record<string, string> = {
  "Semua": "✨",
  "Coffee": "☕",
  "Non-Coffee": "🍹",
  "Pastry": "🥐",
};

export default function MenuPage() {
  const { outletCode } = useParams<{ outletCode: string }>();
  const { addToCart, cart } = useStorefront();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "Semua" || product.categoryName === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddQuickly = (product: StorefrontProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 800);
  };

  const getProductCartQty = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.qty : 0;
  };

  return (
    <div className="flex-1 flex flex-col font-outfit">

      {/* ── Sticky search + category bar ── */}
      <div className="sticky z-30 px-1 pb-4 pt-2" style={{ top: "64px" }}>
        <div className="rounded-2xl p-3 space-y-3" style={{ background: "rgba(15,8,3,0.90)", backdropFilter: "blur(20px)", border: "1px solid rgba(245,124,0,0.12)" }}>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu favorit Anda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", caretColor: "#f57c00" }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              className="absolute left-3.5 top-3.5 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>

          {/* Category tabs */}
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200"
                style={
                  selectedCategory === cat
                    ? { background: "linear-gradient(135deg, #ffa726, #f57c00)", color: "white", boxShadow: "0 4px 20px rgba(245,124,0,0.3)" }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="flex-1 pb-28">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-bold text-white">Menu tidak ditemukan</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Coba kata kunci atau kategori lain
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filteredProducts.map((product, i) => {
              const inCartQty = getProductCartQty(product.id);
              const isOos = product.qtyOnHand === 0;
              const isLimited = product.qtyOnHand > 0 && product.qtyOnHand <= 5;
              const maxReached = inCartQty >= product.qtyOnHand;
              const justAdded = addedId === product.id;

              return (
                <Link
                  key={product.id}
                  to={`/shop/o/${outletCode}/products/${product.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 relative"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                    border: inCartQty > 0 ? "1px solid rgba(245,124,0,0.4)" : "1px solid rgba(255,255,255,0.07)",
                    boxShadow: inCartQty > 0 ? "0 0 20px rgba(245,124,0,0.1)" : "0 2px 10px rgba(0,0,0,0.2)",
                    animationDelay: `${i * 40}ms`,
                    opacity: isOos ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!isOos) e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                >

                  {/* Image area */}
                  <div className="relative aspect-square w-full flex items-center justify-center text-5xl"
                    style={{ background: "linear-gradient(145deg, rgba(245,124,0,0.1) 0%, rgba(0,0,0,0.1) 100%)" }}>
                    <span className="transition-transform duration-300 group-hover:scale-110 select-none">{product.imageUrl}</span>

                    {/* In-cart badge */}
                    {inCartQty > 0 && (
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full text-[11px] font-extrabold text-white flex items-center justify-center shadow-lg"
                        style={{ background: "#f57c00" }}>
                        {inCartQty}
                      </div>
                    )}

                    {/* OOS overlay */}
                    {isOos && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-t-2xl"
                        style={{ background: "rgba(0,0,0,0.6)" }}>
                        <span className="text-xs font-bold text-white/80">Habis</span>
                      </div>
                    )}
                  </div>

                  {/* Info + add button */}
                  <div className="flex flex-col flex-1 p-3 space-y-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(245,124,0,0.7)" }}>
                        {product.categoryName}
                      </span>
                      <h3 className="text-xs font-bold text-white mt-0.5 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </div>

                    {/* Stock status */}
                    {!isOos && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full w-fit"
                        style={
                          isLimited
                            ? { background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.2)" }
                            : { background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.15)" }
                        }>
                        {isLimited ? `Sisa ${product.qtyOnHand}` : "Tersedia"}
                      </span>
                    )}

                    {/* Price + Add button */}
                    <div className="flex items-center justify-between mt-auto pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-xs font-extrabold" style={{ color: "#ffa726" }}>
                        {formatCurrency(product.price)}
                      </span>
                      <button
                        onClick={(e) => handleAddQuickly(product, e)}
                        disabled={isOos || maxReached}
                        className="h-7 w-7 rounded-full flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
                        style={
                          justAdded
                            ? { background: "#4ade80", color: "white" }
                            : isOos || maxReached
                            ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }
                            : { background: "rgba(245,124,0,0.2)", color: "#f57c00", border: "1px solid rgba(245,124,0,0.3)" }
                        }
                        title={maxReached ? "Sudah di keranjang" : "Tambah ke keranjang"}
                      >
                        {justAdded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
