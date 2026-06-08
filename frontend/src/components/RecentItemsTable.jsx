function RecentItemsTable({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-2xl text-left">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Item Name</th>
            <th className="px-6 py-4">Menu Name</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Availability</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="transition hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">
                {item.name}
              </td>
              <td className="px-6 py-4 text-slate-600">{item.menuName}</td>
              <td className="px-6 py-4 font-medium text-slate-700">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.available
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentItemsTable
