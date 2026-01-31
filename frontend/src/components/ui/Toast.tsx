import React, { useEffect, useState } from 'react'
import './Toast.css'

type Props = {
  message: string
  duration?: number
  onClose?: () => void
}

export const Toast: React.FC<Props> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])
  if (!visible) return null
  return (
    <div className="kyto-toast" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}
export default Toast
