"use client"

import { useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

// Типы для toast 
type ToastProps = {
  title: string
  description?: string
  duration?: number
  action?: ReactNode
}

export const useToast = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Обертка для предотвращения запуска toast на сервере
  const showToast = ({ title, description, duration = 5000, action }: ToastProps) => {
    if (isMounted) {
      return toast(title, {
        description,
        duration,
        action,
      })
    }
  }

  return {
    toast: showToast,
  }
}
