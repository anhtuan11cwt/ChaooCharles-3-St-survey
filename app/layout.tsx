import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	description: "Ứng dụng khảo sát 3 giai đoạn",
	title: "Khảo sát 3 giai đoạn",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className="h-full antialiased" lang="vi">
			<body className="min-h-full">{children}</body>
		</html>
	);
}
