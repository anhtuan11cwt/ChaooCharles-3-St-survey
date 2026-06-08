import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp className với tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Định dạng tiền tệ theo kiểu Việt Nam (1.000.000 ₫)
export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;
}
