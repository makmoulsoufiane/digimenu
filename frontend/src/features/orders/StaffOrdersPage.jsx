import { useEffect, useState } from 'react'
import Icon from '../../shared/components/Icon'
import { formatCurrency } from '../../shared/utils/formatCurrency'
import {
  getStaffOrders,
  updateOrderStatus,
} from './services/orderService'
import { ORDER_STATUS_LABELS } from './utils/orderUtils'

function nextAction(order) {
  if (order.status === 'pending') {
    return { label: 'Accept order', status: 'accepted' }
  }

  if (order.status === 'accepted') {
    return { label: 'Mark cooked', status: 'cooked' }
  }

  if (order.status === 'cooked') {
    return { label: 'Mark delivered', status: 'delivered' }
  }

  return null
}

function StaffOrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  async function loadOrders() {
    try {
      const data = await getStaffOrders()
      setOrders(data.orders ?? [])
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadOrders, 0)
    const intervalId = window.setInterval(loadOrders, 5000)

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [])

  async function updateStatus(order, status) {
    setUpdatingId(order.id)
    try {
      const data = await updateOrderStatus(order.id, status)
      setOrders((currentOrders) => {
        if (data.order.status === 'delivered') {
          return currentOrders.filter((currentOrder) => currentOrder.id !== order.id)
        }

        return currentOrders.map((currentOrder) =>
          currentOrder.id === order.id ? data.order : currentOrder,
        )
      })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#24718a]">
            Waiter workspace
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">
            Orders
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62757d]">
            Accept new orders, mark them cooked, then confirm delivery to the table.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-[#d9e2e5] bg-white px-4 text-xs font-bold text-[#154f65] hover:bg-[#f7f9fa]"
        >
          <Icon name="bell" size={15} />
          Refresh
        </button>
      </section>

      {error ? (
        <section className="mt-5 rounded-xl border border-[#f0c5c5] bg-[#fff7f7] px-5 py-4 text-sm font-semibold text-[#9c3b3b]">
          {error}
        </section>
      ) : null}

      {isLoading ? (
        <section className="mt-7 rounded-xl border border-[#dbe3e6] bg-white px-6 py-12 text-center">
          <p className="font-bold text-[#30464e]">Loading orders...</p>
        </section>
      ) : null}

      {!isLoading && orders.length === 0 ? (
        <section className="mt-7 rounded-xl border border-dashed border-[#cbd7db] bg-white px-6 py-16 text-center">
          <h2 className="font-bold text-[#263940]">No active orders</h2>
          <p className="mt-2 text-sm text-[#718087]">
            New and in-progress customer orders will appear here.
          </p>
        </section>
      ) : null}

      <section className="mt-7 grid gap-4 xl:grid-cols-2">
        {orders.map((order) => {
          const action = nextAction(order)

          return (
            <article
              key={order.id}
              className="rounded-xl border border-[#dbe3e6] bg-white p-5 shadow-[0_1px_2px_rgba(16,45,55,0.03)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-[#687a82]">
                    Order #{order.id}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    Table {order.table.number}
                  </h2>
                  <p className="mt-1 text-xs text-[#6b7c83]">
                    {order.customer.name}
                  </p>
                </div>
                <span className="rounded-lg bg-[#edf5f7] px-3 py-2 text-xs font-bold text-[#1b6079]">
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 border-y border-[#edf1f2] py-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-semibold">
                      {item.quantity} x {item.name}
                    </span>
                    <span className="text-[#5c7078]">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <strong className="text-sm">{formatCurrency(order.total)}</strong>
                {action ? (
                  <button
                    type="button"
                    disabled={updatingId === order.id}
                    onClick={() => updateStatus(order, action.status)}
                    className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-[#154f65] px-4 text-xs font-bold text-white hover:bg-[#0f4154] disabled:opacity-60"
                  >
                    <Icon name="check" size={15} />
                    {action.label}
                  </button>
                ) : null}
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}

export default StaffOrdersPage
