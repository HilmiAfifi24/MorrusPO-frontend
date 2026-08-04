import { useNavigate } from "react-router";
import { useStorefront, type StorefrontOutlet } from "../../../context/StorefrontContext";

const DUMMY_OUTLETS: StorefrontOutlet[] = [
  { id: "1", code: "outlet-utama", name: "Morrus Coffee — Pasteur", address: "Jl. Pasteur No. 12, Sukajadi, Bandung", isOpen: true, phone: "081234567890" },
  { id: "2", code: "outlet-dipatiukur", name: "Morrus Coffee — Dipatiukur", address: "Jl. Dipatiukur No. 45, Coblong, Bandung", isOpen: true, phone: "081234567891" },
  { id: "3", code: "outlet-dago", name: "Morrus Coffee — Dago", address: "Jl. Ir. H. Juanda No. 110, Coblong, Bandung", isOpen: false, phone: "081234567892" },
];

export default function OutletsPage() {
  const navigate = useNavigate();
  const { setSelectedOutlet } = useStorefront();

  const handleSelectOutlet = (outlet: StorefrontOutlet) => {
    if (!outlet.isOpen) return;
    setSelectedOutlet(outlet);
    navigate(`/shop/o/${outlet.code}/menu`);
  };

  return (
    <div className="flex-1 flex flex-col font-outfit px-2 sm:px-0 pb-6">
      
      {/* Page header */}
      <div className="py-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          Pilih Outlet
        </h2>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
          Temukan outlet Morrus terdekat dan mulai pesan
        </p>
      </div>

      {/* Outlets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {DUMMY_OUTLETS.map((outlet, i) => (
          <button
            key={outlet.id}
            onClick={() => handleSelectOutlet(outlet)}
            disabled={!outlet.isOpen}
            className={`group w-full text-left rounded-3xl p-6 transition-all duration-300 relative overflow-hidden ${
              outlet.isOpen
                ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                : "cursor-not-allowed opacity-50"
            }`}
            style={{
              background: outlet.isOpen
                ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
                : "rgba(255,255,255,0.03)",
              border: outlet.isOpen
                ? "1px solid rgba(245,124,0,0.2)"
                : "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              boxShadow: outlet.isOpen ? "0 4px 30px rgba(0,0,0,0.2)" : "none",
              animationDelay: `${i * 80}ms`
            }}
          >
            {/* Glow accent on hover */}
            {outlet.isOpen && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "radial-gradient(circle at top left, rgba(245,124,0,0.08), transparent 60%)" }} />
            )}

            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              {/* Icon */}
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: outlet.isOpen
                    ? "linear-gradient(135deg, rgba(245,124,0,0.25), rgba(230,81,0,0.15))"
                    : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(245,124,0,0.2)"
                }}>
                ☕
              </div>

              {/* Status badge */}
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{
                  background: outlet.isOpen ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                  color: outlet.isOpen ? "#4ade80" : "rgba(255,255,255,0.3)",
                  border: `1px solid ${outlet.isOpen ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`
                }}>
                {outlet.isOpen ? "● Buka" : "● Tutup"}
              </span>
            </div>

            {/* Info */}
            <h3 className="font-bold text-white text-sm leading-snug mb-1">{outlet.name}</h3>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {outlet.address}
            </p>

            {/* CTA row */}
            {outlet.isOpen && (
              <div className="mt-5 pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(245,124,0,0.15)" }}>
                <span className="text-xs font-bold" style={{ color: "#f57c00" }}>Mulai Belanja</span>
                <div className="h-7 w-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1"
                  style={{ background: "rgba(245,124,0,0.15)", color: "#f57c00" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
