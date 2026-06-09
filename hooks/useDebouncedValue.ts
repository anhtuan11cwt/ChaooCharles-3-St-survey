"use client";

import { useEffect, useState } from "react";

// Debounce giá trị — trì hoãn cập nhật cho đến khi ngừng thay đổi sau `delay`ms
export function useDebouncedValue<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay ?? 300);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
