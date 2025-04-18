import type React from "react";
import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-screen bg-muted'>
			<DashboardSidebar />
			<div className='flex-1 flex flex-col ml-68'>
				<DashboardHeader />

				<main className='flex-1 p-6'>{children}</main>
			</div>
		</div>
	);
}
