import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import AppErrorState from "../../components/ui/AppErrorState";
import AuthGuard from "../guards/AuthGuard";
import GuestGuard from "../guards/GuestGuard";
import PermissionGuard from "../guards/PermissionGuard";
import AuthLayout from "../../components/layout/AuthLayout";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SignInPage from "../../features/auth/pages/SignInPage";
import CategoriesPage from "../../features/categories/pages/CategoriesPage";
import ConsignmentsPage from "../../features/consignments/pages/ConsignmentsPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import SupplierDebtsPage from "../../features/debts/pages/SupplierDebtsPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import OutletsPage from "../../features/outlets/pages/OutletsPage";
import PosPage from "../../features/pos/pages/PosPage";
import ProductCreatePage from "../../features/products/pages/ProductCreatePage";
import ProductEditPage from "../../features/products/pages/ProductEditPage";
import ProductsPage from "../../features/products/pages/ProductsPage";
import PurchaseOrdersPage from "../../features/purchase-orders/pages/PurchaseOrdersPage";
import SuppliersPage from "../../features/suppliers/pages/SuppliersPage";
import ChangePasswordPage from "../../features/users/pages/ChangePasswordPage";
import UserCreatePage from "../../features/users/pages/UserCreatePage";
import UserEditPage from "../../features/users/pages/UserEditPage";
import UsersPage from "../../features/users/pages/UsersPage";
import CashierSessionPage from "../../features/pos/pages/CashierSessionPage";
import TransactionDetailPage from "../../features/transactions/pages/TransactionDetailPage";
import TransactionsPage from "../../features/transactions/pages/TransactionsPage";
import { getNavigationItem } from "./navigation";

const cashierSessionPolicy = getNavigationItem("/cashier/session");
const posPolicy = getNavigationItem("/pos");
const transactionsPolicy = getNavigationItem("/transactions");
const productsPolicy = getNavigationItem("/products");
const categoriesPolicy = getNavigationItem("/categories");
const inventoryPolicy = getNavigationItem("/inventory");
const stockTransfersPolicy = getNavigationItem("/stock-transfers");
const suppliersPolicy = getNavigationItem("/suppliers");
const purchaseOrdersPolicy = getNavigationItem("/purchase-orders");
const supplierDebtsPolicy = getNavigationItem("/supplier-debts");
const consignmentsPolicy = getNavigationItem("/consignments");
const usersPolicy = getNavigationItem("/users");
const outletsPolicy = getNavigationItem("/outlets");

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/signin"
          element={
            <GuestGuard>
              <AuthLayout />
            </GuestGuard>
          }
        >
          <Route index element={<SignInPage />} />
        </Route>

        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="cashier/session"
            element={
              <PermissionGuard
                requiredPermissions={cashierSessionPolicy?.requiredPermissions}
                fallbackRoles={cashierSessionPolicy?.fallbackRoles}
              >
                <CashierSessionPage />
              </PermissionGuard>
            }
          />
          <Route
            path="products"
            element={
              <PermissionGuard
                requiredPermissions={productsPolicy?.requiredPermissions}
                fallbackRoles={productsPolicy?.fallbackRoles}
              >
                <ProductsPage />
              </PermissionGuard>
            }
          />
          <Route
            path="products/create"
            element={
              <PermissionGuard
                requiredPermissions={productsPolicy?.requiredPermissions}
                fallbackRoles={productsPolicy?.fallbackRoles}
              >
                <ProductCreatePage />
              </PermissionGuard>
            }
          />
          <Route
            path="products/:id/edit"
            element={
              <PermissionGuard
                requiredPermissions={productsPolicy?.requiredPermissions}
                fallbackRoles={productsPolicy?.fallbackRoles}
              >
                <ProductEditPage />
              </PermissionGuard>
            }
          />
          <Route
            path="categories"
            element={
              <PermissionGuard
                requiredPermissions={categoriesPolicy?.requiredPermissions}
                fallbackRoles={categoriesPolicy?.fallbackRoles}
              >
                <CategoriesPage />
              </PermissionGuard>
            }
          />
          <Route
            path="inventory"
            element={
              <PermissionGuard
                requiredPermissions={inventoryPolicy?.requiredPermissions}
                fallbackRoles={inventoryPolicy?.fallbackRoles}
                allowPlaceholder
              >
                <InventoryPage />
              </PermissionGuard>
            }
          />
          <Route
            path="stock-transfers"
            element={
              <PermissionGuard
                requiredPermissions={stockTransfersPolicy?.requiredPermissions}
                fallbackRoles={stockTransfersPolicy?.fallbackRoles}
                allowPlaceholder
              >
                <InventoryPage mode="transfers" />
              </PermissionGuard>
            }
          />
          <Route
            path="suppliers"
            element={
              <PermissionGuard
                requiredPermissions={suppliersPolicy?.requiredPermissions}
                fallbackRoles={suppliersPolicy?.fallbackRoles}
                allowPlaceholder
              >
                <SuppliersPage />
              </PermissionGuard>
            }
          />
          <Route
            path="purchase-orders"
            element={
              <PermissionGuard
                requiredPermissions={purchaseOrdersPolicy?.requiredPermissions}
                fallbackRoles={purchaseOrdersPolicy?.fallbackRoles}
                allowPlaceholder
              >
                <PurchaseOrdersPage />
              </PermissionGuard>
            }
          />
          <Route
            path="supplier-debts"
            element={
              <PermissionGuard
                requiredPermissions={supplierDebtsPolicy?.requiredPermissions}
                fallbackRoles={supplierDebtsPolicy?.fallbackRoles}
                allowPlaceholder
              >
                <SupplierDebtsPage />
              </PermissionGuard>
            }
          />
          <Route
            path="consignments"
            element={
              <PermissionGuard
                requiredPermissions={consignmentsPolicy?.requiredPermissions}
                fallbackRoles={consignmentsPolicy?.fallbackRoles}
                allowPlaceholder
              >
                <ConsignmentsPage />
              </PermissionGuard>
            }
          />
          <Route
            path="users"
            element={
              <PermissionGuard
                requiredPermissions={usersPolicy?.requiredPermissions}
                fallbackRoles={usersPolicy?.fallbackRoles}
              >
                <UsersPage />
              </PermissionGuard>
            }
          />
          <Route
            path="users/create"
            element={
              <PermissionGuard
                requiredPermissions={usersPolicy?.requiredPermissions}
                fallbackRoles={usersPolicy?.fallbackRoles}
              >
                <UserCreatePage />
              </PermissionGuard>
            }
          />
          <Route
            path="users/:id/edit"
            element={
              <PermissionGuard
                requiredPermissions={usersPolicy?.requiredPermissions}
                fallbackRoles={usersPolicy?.fallbackRoles}
              >
                <UserEditPage />
              </PermissionGuard>
            }
          />
          <Route path="profile/change-password" element={<ChangePasswordPage />} />
          <Route
            path="outlets"
            element={
              <PermissionGuard
                requiredPermissions={outletsPolicy?.requiredPermissions}
                fallbackRoles={outletsPolicy?.fallbackRoles}
              >
                <OutletsPage />
              </PermissionGuard>
            }
          />
          <Route
            path="transactions"
            element={
              <PermissionGuard
                requiredPermissions={transactionsPolicy?.requiredPermissions}
                fallbackRoles={transactionsPolicy?.fallbackRoles}
              >
                <TransactionsPage />
              </PermissionGuard>
            }
          />
          <Route
            path="transactions/:id"
            element={
              <PermissionGuard
                requiredPermissions={transactionsPolicy?.requiredPermissions}
                fallbackRoles={transactionsPolicy?.fallbackRoles}
              >
                <TransactionDetailPage />
              </PermissionGuard>
            }
          />
          <Route
            path="pos"
            element={
              <PermissionGuard
                requiredPermissions={posPolicy?.requiredPermissions}
                fallbackRoles={posPolicy?.fallbackRoles}
              >
                <PosPage />
              </PermissionGuard>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <AppErrorState
              title="Halaman tidak ditemukan"
              description="Rute yang Anda buka belum tersedia di shell MorrusPOS."
              actionLabel="Kembali ke dashboard"
              actionHref="/dashboard"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
