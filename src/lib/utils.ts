import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Department } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDepartmentCardStyle(department?: Department | null) {
  if (!department?.color) return {}

  return {
    backgroundColor: department.color + '10',
    borderLeftColor: department.color,
    borderLeftWidth: '4px'
  }
}

export function getDepartmentRowStyle(department?: Department | null) {
  if (!department?.color) return {}

  // Convert hex to rgba with 0.063 alpha (same as kanban cards)
  const hex = department.color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.063)`
  }
}