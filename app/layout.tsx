import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	description: "Book a hotel of your choice",
	icons: "/assets/favicon.svg",
	title: "Stay Savvy",
};

// Layout gốc, bao gồm Navbar và toast
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn("h-full antialiased", "font-sans", inter.variable)}
			lang="vi"
			suppressHydrationWarning
		>
			<body className="min-h-full">
				<main className="flex min-h-screen flex-col bg-secondary">
					<Navbar />
					<section className="flex-grow">{children}</section>
				</main>
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
