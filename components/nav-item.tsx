"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface NavItemProps {
	href: string;
	icon: React.ReactNode;
	text: string;
}
export function NavItem({ href, icon, text }: NavItemProps) {
	const pathname = usePathname();
    const active = useMemo(() => {
        return pathname === href;
    }, [pathname, href]);

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-gray-600 hover:bg-muted",
				active && "bg-primary text-white hover:bg-primary"
			)}
		>
			<span className={cn("", active ? "text-white" : "text-gray-600")}>
				{icon}
			</span>
			<span className='text-sm font-medium'>{text}</span>
		</Link>
	);
}
