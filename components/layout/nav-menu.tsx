"use client";

import { BookOpenCheck, ChevronsUpDown, Hotel, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu điều hướng cho user đã đăng nhập (thêm KS, KS của tôi, đặt chỗ)
export default function NavMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/hotel/new")}
        >
          <Plus size={15} />
          <span>Thêm khách sạn</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/my-hotels")}
        >
          <Hotel size={15} />
          <span>Khách sạn của tôi</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/my-bookings")}
        >
          <BookOpenCheck size={15} />
          <span>Đặt chỗ của tôi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
