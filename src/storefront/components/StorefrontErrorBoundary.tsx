import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class StorefrontErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Storefront Error Boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 px-4 font-outfit">
          <div className="w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-8 text-center shadow-storefront-premium">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-storefront-primary-50 text-storefront-primary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Terjadi Kesalahan
            </h1>
            
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Mohon maaf, halaman tidak dapat dimuat karena terjadi kendala teknis. Silakan coba memuat ulang halaman.
            </p>

            <button
              onClick={this.handleReload}
              className="mt-8 w-full rounded-2xl bg-storefront-primary-500 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-storefront-primary-600 active:scale-[0.98] shadow-storefront-premium"
            >
              Muat Ulang Halaman
            </button>

            <a
              href="/shop"
              className="mt-4 block text-xs font-medium text-gray-500 hover:text-storefront-primary-500 transition-colors"
            >
              Kembali ke Beranda Storefront
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StorefrontErrorBoundary;
