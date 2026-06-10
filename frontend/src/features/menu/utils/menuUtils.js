export function getNextId(records) {
  return Math.max(...records.map((record) => record.id), 0) + 1
}

export function formatMenuSchedule(menu) {
  return menu.startTime && menu.endTime
    ? `${menu.startTime} - ${menu.endTime}`
    : 'All day'
}

export function normalizeText(value) {
  return value.trim().toLowerCase()
}
