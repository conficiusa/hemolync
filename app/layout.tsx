import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
	title: "HymoLync",
	description:
		"HemoLync is a blood management system that helps hospitals and blood banks manage blood donations, inventory, and transfusions.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={cn(inter.className)}>{children}</body>
		</html>
	);
}
