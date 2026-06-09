// Layout chung cho các trang auth (đăng nhập, đăng ký) — căn giữa nội dung
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {children}
    </div>
  );
}
