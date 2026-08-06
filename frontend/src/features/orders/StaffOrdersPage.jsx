import { useEffect, useState } from 'react'
import Icon from '../../shared/components/Icon'
import { formatCurrency } from '../../shared/utils/formatCurrency'
import {
  getStaffOrders,
  updateOrderStatus,
} from './services/orderService'
import { ORDER_STATUS_LABELS } from './utils/orderUtils'

const STATUS_GROUPS = [
  {
    id: 'pending',
    title: 'New',
    description: 'Needs acceptance',
  },
  {
    id: 'accepted',
    title: 'Preparing',
    description: 'Kitchen is cooking',
  },
  {
    id: 'cooked',
    title: 'Ready',
    description: 'Deliver to table',
  },
]

const STATUS_STYLES = {
  pending: {
    badge: 'border-[#f2d28a] bg-[#fff7df] text-[#7b5511]',
    dot: 'bg-[#d99514]',
    accent: 'border-l-[#d99514]',
    action: 'bg-[#154f65] text-white hover:bg-[#0f4154]',
  },
  accepted: {
    badge: 'border-[#bcd8ee] bg-[#edf7ff] text-[#1f5f87]',
    dot: 'bg-[#2b85b8]',
    accent: 'border-l-[#2b85b8]',
    action: 'bg-[#1f5f87] text-white hover:bg-[#174b6d]',
  },
  cooked: {
    badge: 'border-[#bfe3cf] bg-[#eefaf3] text-[#247344]',
    dot: 'bg-[#2f9c5b]',
    accent: 'border-l-[#2f9c5b]',
    action: 'bg-[#247344] text-white hover:bg-[#1c5d36]',
  },
}

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

  const groupedOrders = STATUS_GROUPS.map((group) => ({
    ...group,
    orders: orders.filter((order) => order.status === group.id),
  }))

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

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {groupedOrders.map((group) => {
          const styles = STATUS_STYLES[group.id]

          return (
            <div
              key={group.id}
              className="flex min-h-[92px] items-center justify-between rounded-lg border border-[#dbe3e6] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(16,45,55,0.04)]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
                  <p className="text-sm font-bold text-[#263940]">
                    {group.title}
                  </p>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#718087]">
                  {group.description}
                </p>
              </div>
              <strong className="text-2xl font-extrabold text-[#154f65]">
                {group.orders.length}
              </strong>
            </div>
          )
        })}
      </section>

      {error ? (
        <section className="mt-5 rounded-lg border border-[#f0c5c5] bg-[#fff7f7] px-5 py-4 text-sm font-semibold text-[#9c3b3b]">
          {error}
        </section>
      ) : null}

      {isLoading ? (
        <section className="mt-7 rounded-lg border border-[#dbe3e6] bg-white px-6 py-12 text-center">
          <p className="font-bold text-[#30464e]">Loading orders...</p>
        </section>
      ) : null}

      {!isLoading && orders.length === 0 ? (
        <section className="mt-7 rounded-lg border border-dashed border-[#cbd7db] bg-white px-6 py-16 text-center">
          <h2 className="font-bold text-[#263940]">No active orders</h2>
          <p className="mt-2 text-sm text-[#718087]">
            New and in-progress customer orders will appear here.
          </p>
        </section>
      ) : null}

      <section className="mt-7 grid items-start gap-4 xl:grid-cols-3">
        {groupedOrders.map((group) => {
          const styles = STATUS_STYLES[group.id]

          return (
            <section key={group.id} className="min-w-0">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[#263940]">
                    {group.title}
                  </h2>
                  <p className="mt-0.5 text-xs font-semibold text-[#718087]">
                    {group.description}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-bold ${styles.badge}`}
                >
                  {group.orders.length}
                </span>
              </div>

              <div className="space-y-3">
                {group.orders.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[#cbd7db] bg-white px-4 py-8 text-center text-xs font-semibold text-[#718087]">
                    No orders here
                  </div>
                ) : null}

                {group.orders.map((order) => {
                  const action = nextAction(order)

                  return (
                    <article
                      key={order.id}
                      className={`rounded-lg border border-[#dbe3e6] border-l-4 ${styles.accent} bg-white p-4 shadow-[0_1px_3px_rgba(16,45,55,0.05)]`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#687a82]">
                            Order #{order.id}
                          </p>
                          <h3 className="mt-1 text-xl font-extrabold text-[#1f3037]">
                            Table {order.table.number}
                          </h3>
                          <p className="mt-1 truncate text-sm font-semibold text-[#6b7c83]">
                            {order.customer.name}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                        >
                          {ORDER_STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>

                      <div className="mt-4 divide-y divide-[#edf1f2] border-y border-[#edf1f2]">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-3 py-2.5 text-sm"
                          >
                            <span className="min-w-0 font-semibold leading-5 text-[#30464e]">
                              {item.quantity} x {item.name}
                            </span>
                            <span className="shrink-0 font-semibold text-[#687a82]">
                              {formatCurrency(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#829097]">
                            Total
                          </p>
                          <strong className="text-lg text-[#1f3037]">
                            {formatCurrency(order.total)}
                          </strong>
                        </div>
                        {action ? (
                          <button
                            type="button"
                            disabled={updatingId === order.id}
                            onClick={() => updateStatus(order, action.status)}
                            className={`ml-auto inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold shadow-[0_4px_12px_rgba(16,45,55,0.12)] transition disabled:opacity-60 ${styles.action}`}
                          >
                            <Icon name="check" size={16} />
                            {action.label}
                          </button>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </section>
    </>
  )
}

export default StaffOrdersPage
