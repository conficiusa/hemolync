"use client";
import { memo, useState } from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import TrackingTable from "@/components/tracking-table";
import { Button } from "@/components/ui/button";

type TrackingTab =
	| "Incoming Requests"
	| "My Requests"
	| "Dispatched"
	| "Received";
const tabs: TrackingTab[] = [
	"Incoming Requests",
	"My Requests",
	"Dispatched",
	"Received",
];

const TrackingTabsContent = [
	{ tab: "Incoming Requests", content: <TrackingTable /> },
];
const TrackingTabs = memo(() => {
	const [active, setActive] = useState<TrackingTab>("My Requests");
	

	const handleTabChange = (value: string) => {
		setActive(value as TrackingTab);
	};
	return (
		<Tabs defaultValue='Requested' onValueChange={handleTabChange}>
			<div className='flex justify-between items-center mb-6'>
				<TabsList className='space-x-4 flex'>
					{tabs.map((tab) => (
						<TabsPrimitive.TabsTrigger
							value={tab}
							key={tab}
							className={cn(
								"px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-in-out", // Added transition for smoothness
								active === tab
									? "bg-primary text-white shadow-md" // Keep active style distinct
									: "bg-white text-gray-700 hover:bg-gray-100 hover:outline-[0.5px] outline-primary-accent-foreground/30" // Added hover shadow with primary tint
							)}
						>
							{tab}
						</TabsPrimitive.TabsTrigger>
					))}
				</TabsList>
				<Button
					className='border-primary text-primary hover:bg-primary transition-colors duration-500 hover:text-white'
					variant={"outline"}
				>
					Place a Request
				</Button>
			</div>
			{TrackingTabsContent.map((item) => (
				<TabsContent
					key={item.tab}
					value={item.tab}
					className='bg-white rounded-lg overflow-hidden'
				>
					{item.content}
				</TabsContent>
			))}
		</Tabs>
	);
});

TrackingTabs.displayName = "TrackingTabs";
export default TrackingTabs;
