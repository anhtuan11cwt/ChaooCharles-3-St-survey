interface AmenityItemProps {
  children: React.ReactNode;
}

export default function AmenityItem({ children }: AmenityItemProps) {
  return <div className="flex items-center gap-2">{children}</div>;
}
