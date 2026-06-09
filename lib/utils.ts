import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp className — ưu tiên class sau ghi đè class trước (Tailwind)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format số theo kiểu Việt Nam (VD: 1.000.000 ₫)
export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;
}
