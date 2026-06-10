import { useRef } from 'react'
import useModalBehavior from '../hooks/useModalBehavior'
import Icon from './Icon'

function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null)
  const dialogRef = useModalBehavior({
    onClose: onCancel,
    initialFocusRef: cancelButtonRef,
    enabled: isOpen,
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#0c1a20]/60 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-[0_24px_70px_rgba(5,20,26,0.28)]"
      >
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff0f0] text-[#b13c3c]">
            <Icon name="trash" size={19} />
          </span>
          <div>
            <h2 id="confirm-title" className="text-lg font-bold">
              {title}
            </h2>
            <p
              id="confirm-description"
              className="mt-2 text-sm leading-6 text-[#6b7c83]"
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-[#d7e0e3] px-4 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-lg bg-[#b13c3c] px-4 text-sm font-bold text-white hover:bg-[#922f2f]"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
