"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type TrackingStatus = "Accepted" | "Rejected";
type TrackingTab =
	| "Requested"
	| "Accepted/Rejected"
	| "Dispatched"
	| "Received";

interface TrackingItem {
	id: number;
	acceptedBy: {
		name: string;
		avatar: string;
	};
	product: string;
	sentTo: string;
	dateTime: string;
	status: TrackingStatus;
}

export default function Tracking() {
	const [activeTab, setActiveTab] = useState<TrackingTab>("Accepted/Rejected");

	// Sample tracking data
	const trackingItems: TrackingItem[] = [
		{
			id: 1,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Accepted",
		},
		{
			id: 2,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Platelets",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Accepted",
		},
		{
			id: 3,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Accepted",
		},
		{
			id: 4,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Accepted",
		},
		{
			id: 5,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Accepted",
		},
		{
			id: 6,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Rejected",
		},
		{
			id: 7,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Rejected",
		},
		{
			id: 8,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Rejected",
		},
		{
			id: 9,
			acceptedBy: {
				name: "Olivia Rhye",
				avatar: "/profile.avif",
			},
			product: "Whole Blood",
			sentTo: "Tamale teaching Hospital",
			dateTime: "12/04/2024: 12:10",
			status: "Rejected",
		},
	];

	const tabs: TrackingTab[] = [
		"Requested",
		"Accepted/Rejected",
		"Dispatched",
		"Received",
	];

	return (
		<div className='p-6'>
			{/* Tabs */}
			<div className='flex space-x-4 mb-6'>
				{tabs.map((tab) => (
					<button
						key={tab}
						className={cn(
							"px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-in-out", // Added transition for smoothness
							activeTab === tab
								? "bg-primary text-white shadow-md" // Keep active style distinct
								: "bg-white text-gray-700 hover:bg-gray-100 hover:outline-[0.5px] outline-primary-accent-foreground/30" // Added hover shadow with primary tint
						)}
						onClick={() => setActiveTab(tab)}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Tracking Table */}
			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<table className='w-full'>
					<thead>
						<tr className='border-b border-gray-200'>
							<th className='text-left py-4 px-6 text-sm font-medium text-gray-500'>
								Accepted by
							</th>
							<th className='text-left py-4 px-6 text-sm font-medium text-gray-500'>
								Product
							</th>
							<th className='text-left py-4 px-6 text-sm font-medium text-gray-500'>
								Sent to
							</th>
							<th className='text-left py-4 px-6 text-sm font-medium text-gray-500'>
								Accepted Date/Time
							</th>
							<th className='text-left py-4 px-6 text-sm font-medium text-gray-500'>
								Status
							</th>
							<th className='text-left py-4 px-6 text-sm font-medium text-gray-500'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{trackingItems.map((item, index) => (
							<tr
								key={item.id}
								className={cn(
									"border-b border-gray-100",
									index % 2 === 0 ? "bg-white" : "bg-gray-50"
								)}
							>
								<td className='py-4 px-6'>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200'>
											<Image
												src={item.acceptedBy.avatar || "/placeholder.svg"}
												alt={"profile image "}
												height={40}
												width={40}
												className='object-cover'
											/>
										</div>
										<span className='text-sm font-medium text-gray-900 whitespace-nowrap'>
											{item.acceptedBy.name}
										</span>
									</div>
								</td>
								<td className='py-4 px-6 text-sm text-gray-700'>
									{item.product}
								</td>
								<td className='py-4 px-6 text-sm text-gray-700'>
									{item.sentTo}
								</td>
								<td className='py-4 px-6 text-sm text-gray-700'>
									{item.dateTime}
								</td>
								<td className='py-4 px-6'>
									<span
										className={cn(
											"inline-block px-1 py-0.5 rounded-full text-xs font-medium",
											item.status === "Accepted"
												? "bg-muted-foreground/10 text-foreground/70"
												: "bg-destructive/10 text-destructive/80"
										)}
									>
										{item.status}
									</span>
								</td>
								<td className='py-4 px-6'>
									<button className='text-gray-400 hover:text-gray-600'>
										<MoreVertical className='h-5 w-5' />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
