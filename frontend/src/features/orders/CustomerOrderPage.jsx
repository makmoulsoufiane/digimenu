import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Icon from '../../shared/components/Icon'
import { formatCurrency } from '../../shared/utils/formatCurrency'
import {
  createTableOrder,
  getCustomerOrder,
  getTableMenu,
} from './services/orderService'
import {
  ORDER_STATUS_LABELS,
  buildOrderItems,
  formatDeliveryTime,
  orderTotal,
} from './utils/orderUtils'

const CUSTOMER_STATUS_MESSAGES = {
  pending: 'Your order was sent to the waiter. Waiting for acceptance.',
  accepted: 'Your order was accepted and is being prepared.',
  cooked: 'Your meal is ready. The waiter will deliver it to your table.',
  delivered: 'Your meal was delivered. Enjoy.',
}

function CustomerOrderPage() {
  const { tableCode } = useParams()
  const [table, setTable] = useState(null)
  const [menus, setMenus] = useState([])
  const [quantities, setQuantities] = useState({})
  const [customerName, setCustomerName] = useState('')
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const deliveredNoticeSent = useRef(false)

  const allItems = useMemo(
    () => menus.flatMap((menu) => menu.items ?? []),
    [menus],
  )
  const selectedItems = buildOrderItems(quantities)
  const total = orderTotal(allItems, quantities)

  useEffect(() => {
    let isMounted = true

    async function loadMenu() {
      try {
        const data = await getTableMenu(tableCode)
        if (!isMounted) return
        setTable(data.table)
        setMenus(data.menus ?? [])
      } catch (error) {
        if (isMounted) setMessage(error.message)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadMenu()

    return () => {
      isMounted = false
    }
  }, [tableCode])

  useEffect(() => {
    if (!order || order.status === 'delivered') return undefined

    const intervalId = window.setInterval(async () => {
      try {
        const data = await getCustomerOrder(order.id)
        setOrder(data.order)
      } catch {
        window.clearInterval(intervalId)
      }
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [order])

  useEffect(() => {
    if (order?.status !== 'delivered' || deliveredNoticeSent.current) return

    deliveredNoticeSent.current = true
    setMessage('Your order has been delivered to the table.')

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('DigiMenu', {
        body: 'Your order has been delivered to your table.',
      })
    }
  }, [order])

  function updateQuantity(itemId, nextQuantity) {
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, Number(nextQuantity)),
    }))
  }

  async function submitOrder(event) {
    event.preventDefault()
    setMessage('')

    if (selectedItems.length === 0) {
      setMessage('Choose at least one item before sending your order.')
      return
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    setIsSubmitting(true)
    try {
      const data = await createTableOrder(tableCode, {
        customerName,
        items: selectedItems,
      })
      setOrder(data.order)
      setMessage('Order sent. Waiting for the waiter to accept it.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f7f8] px-4 text-[#124b61]">
        <p className="text-sm font-bold">Loading menu...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f7f8] px-4 py-6 text-[#20353d] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-xl border border-[#dbe3e6] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#24718a]">
            Table {table?.number ?? tableCode}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold">DigiMenu</h1>
          <p className="mt-2 text-sm leading-6 text-[#62757d]">
            Choose your food and send the order to the waiter.
          </p>
        </section>

        {message ? (
          <div className="mt-4 rounded-lg border border-[#d5e4d9] bg-[#f4fbf6] px-4 py-3 text-sm font-semibold text-[#28633d]">
            {message}
          </div>
        ) : null}

        {order ? (
          <section className="mt-4 rounded-xl border border-[#dbe3e6] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#687a82]">
                  Order #{order.id}
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </h2>
                {order.status !== 'delivered' ? (
                  <p className="mt-2 text-sm leading-6 text-[#62757d]">
                    {CUSTOMER_STATUS_MESSAGES[order.status]}
                    {order.status === 'pending' ? (
                      <>
                        {' '}
                        Estimated delivery:{' '}
                        <strong className="text-[#154f65]">
                          {formatDeliveryTime(order.estimatedDeliveryAt) ||
                            `${order.estimatedDeliveryMinutes} minutes`}
                        </strong>
                      </>
                    ) : null}
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-[#28633d]">
                    {CUSTOMER_STATUS_MESSAGES.delivered}
                  </p>
                )}
              </div>
              <span className="rounded-lg bg-[#edf5f7] px-3 py-2 text-xs font-bold text-[#1b6079]">
                {formatCurrency(order.total)}
              </span>
            </div>
          </section>
        ) : null}

        {!order ? (
          <form onSubmit={submitOrder} className="mt-5 space-y-5">
            <label className="block rounded-xl border border-[#dbe3e6] bg-white p-4">
              <span className="text-xs font-bold text-[#52676f]">
                Your name
              </span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Optional"
                className="mt-2 h-11 w-full rounded-lg border border-[#d9e2e5] px-3 text-sm outline-none focus:border-[#1b6079] focus:ring-2 focus:ring-[#1b6079]/10"
              />
            </label>

            {menus.map((menu) => (
              <section
                key={menu.id}
                className="rounded-xl border border-[#dbe3e6] bg-white p-4"
              >
                <h2 className="text-lg font-bold">{menu.name}</h2>
                <p className="mt-1 text-sm text-[#62757d]">
                  {menu.description}
                </p>

                <div className="mt-4 space-y-3">
                  {menu.items.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-3 border-t border-[#edf1f2] pt-3"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="mt-1 text-xs leading-5 text-[#6d7d84]">
                          {item.description}
                        </p>
                        <p className="mt-2 text-sm font-bold text-[#154f65]">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={quantities[item.id] ?? 0}
                        onChange={(event) =>
                          updateQuantity(item.id, event.target.value)
                        }
                        className="h-10 w-16 rounded-lg border border-[#d9e2e5] text-center text-sm font-bold outline-none focus:border-[#1b6079]"
                        aria-label={`${item.name} quantity`}
                      />
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <div className="sticky bottom-0 -mx-4 border-t border-[#dbe3e6] bg-white/95 px-4 py-3 backdrop-blur sm:rounded-xl sm:border">
              <div className="mx-auto flex max-w-3xl items-center gap-3">
                <span className="text-sm font-bold">
                  Total {formatCurrency(total)}
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg bg-[#154f65] px-5 text-sm font-bold text-white hover:bg-[#0f4154] disabled:opacity-60"
                >
                  <Icon name="check" size={16} />
                  Send order
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  )
}

export default CustomerOrderPage
