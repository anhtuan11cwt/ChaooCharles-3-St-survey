"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
      <Input className="bg-primary/10 pl-10" placeholder="Tìm kiếm" />
    </div>
  );
}
