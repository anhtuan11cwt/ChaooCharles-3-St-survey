interface AmenityItemProps {
  children: React.ReactNode;
}

// Wrapper hiển thị một tiện ích với icon + label
export default function AmenityItem({ children }: AmenityItemProps) {
  return <div className="flex items-center gap-2">{children}</div>;
}
