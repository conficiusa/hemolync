import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

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
		<html lang='en' suppressHydrationWarning className={cn(inter.className)}>
			<head>
				{/* <script
					crossOrigin='anonymous'
					src='//unpkg.com/react-scan/dist/auto.global.js'
				/> */}
			</head>
			<body>{children}</body>
		</html>
	);
}
