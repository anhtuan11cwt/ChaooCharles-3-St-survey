export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-6 py-4 md:px-16 lg:px-24 xl:px-32">
      {children}
    </div>
  );
}
