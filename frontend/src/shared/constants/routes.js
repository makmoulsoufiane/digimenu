export const ROUTES = {
  login: '/',
  dashboard: '/dashboard',
  menus: '/dashboard/menus',
  menuDetails: (menuId) => `/dashboard/menus/${menuId}`,
  orders: '/dashboard/orders',
  table: (tableCode) => `/table/${tableCode}`,
}
