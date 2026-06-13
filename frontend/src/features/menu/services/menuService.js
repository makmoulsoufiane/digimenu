import { initialMenuItems, initialMenus } from '../data/menuData'

function copyRecords(records) {
  return records.map((record) => ({ ...record }))
}

// This data access boundary can later call an API without changing menu UI.
export function getInitialMenus() {
  return copyRecords(initialMenus)
}

export function getInitialMenuItems() {
  return copyRecords(initialMenuItems)
}
