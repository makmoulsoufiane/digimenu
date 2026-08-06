export const ORDER_STATUS_LABELS = {
  pending: 'Waiting for acceptance',
  accepted: 'Order accepted',
  cooked: 'Meal cooked',
  delivered: 'Delivered',
}

export function formatDeliveryTime(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function buildOrderItems(quantities) {
  return Object.entries(quantities)
    .map(([menuItemId, quantity]) => ({
      menuItemId: Number(menuItemId),
      quantity: Number(quantity),
    }))
    .filter((item) => item.quantity > 0)
}

export function orderTotal(items, quantities) {
  return items.reduce(
    (total, item) => total + item.price * (quantities[item.id] ?? 0),
    0,
  )
}
