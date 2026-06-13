import MenuPage from './MenuPage'

export const menuRoutes = [
  {
    path: 'menus',
    element: <MenuPage />,
  },
  {
    path: 'menus/:menuId',
    element: <MenuPage />,
  },
]
