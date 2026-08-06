import { apiRequest } from '../../../shared/services/apiClient'

export function getTableMenu(tableCode) {
  return apiRequest(`/tables/${tableCode}/menu`)
}

export function createTableOrder(tableCode, orderData) {
  return apiRequest(`/tables/${tableCode}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  })
}

export function getCustomerOrder(orderId) {
  return apiRequest(`/orders/${orderId}`)
}

export function getStaffOrders() {
  return apiRequest('/staff/orders')
}

export function updateOrderStatus(orderId, status) {
  return apiRequest(`/staff/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
