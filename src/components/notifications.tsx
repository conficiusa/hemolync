
import { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Notification {
	id: number;
	avatar: string;
	message: string;
	time: string;
	isUnread: boolean;
	isSelected?: boolean;
}

export function NotificationsPanel() {
	const [activeTab, setActiveTab] = useState<"unread" | "all">("all");
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: 1,
			avatar: "/placeholder.svg?height=40&width=40",
			message:
				"I have not yet arrived there, I haven't reached where I want to be, I have the feeling of having the best so far though I'm not there yet buh the Bible said it has not yet appeared like what we shall look like",
			time: "13min ago",
			isUnread: true,
			isSelected: true,
		},
		{
			id: 2,
			avatar: "/placeholder.svg?height=40&width=40",
			message:
				"Sure. God has a lot installed for us. It's a matter of time and proper alignment",
			time: "13min ago",
			isUnread: false,
			isSelected: true,
		},
		{
			id: 3,
			avatar: "/placeholder.svg?height=40&width=40",
			message:
				"Sure. God has a lot installed for us. It's a matter of time and proper alignment",
			time: "13min ago",
			isUnread: false,
			isSelected: true,
		},
		{
			id: 4,
			avatar: "/placeholder.svg?height=40&width=40",
			message:
				"Sure. God has a lot installed for us. It's a matter of time and proper alignment",
			time: "13min ago",
			isUnread: false,
			isSelected: true,
		},
		{
			id: 5,
			avatar: "/placeholder.svg?height=40&width=40",
			message:
				"Sure. God has a lot installed for us. It's a matter of time and proper alignment",
			time: "13min ago",
			isUnread: false,
			isSelected: true,
		},
		{
			id: 6,
			avatar: "/placeholder.svg?height=40&width=40",
			message:
				"Sure. God has a lot installed for us. It's a matter of time and proper alignment",
			time: "13min ago",
			isUnread: false,
			isSelected: true,
		},
	]);

	const unreadCount = notifications.filter((n) => n.isUnread).length;
	const filteredNotifications =
		activeTab === "unread"
			? notifications.filter((n) => n.isUnread)
			: notifications;

	const allSelected =
		filteredNotifications.length > 0 &&
		filteredNotifications.every((n) => n.isSelected);

	const toggleSelectAll = () => {
		setNotifications((prev) =>
			prev.map((notification) => ({
				...notification,
				isSelected:
					activeTab === "unread"
						? notification.isUnread
							? !allSelected
							: notification.isSelected
						: !allSelected,
			}))
		);
	};

	const toggleSelect = (id: number) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id
					? { ...notification, isSelected: !notification.isSelected }
					: notification
			)
		);
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button className='w-8 h-8 flex items-center justify-center'>
					<Bell size={20} />
				</button>
			</SheetTrigger>
			<SheetContent className='min-w-lg'>
				<div>
					<div />
					<div>
						<div className='p-6 flex items-center justify-between'>
							<h2 className='text-2xl font-medium text-gray-800'>
								Notifications
							</h2>
						</div>

						<div className='border-b'>
							<div className='flex justify-center px-6'>
								<div className='flex w-full max-w-xs justify-center gap-9'>
									<button
										onClick={() => setActiveTab("unread")}
										className={cn(
											"py-3 text-center relative",
											activeTab === "unread"
												? "text-gray-800 font-medium"
												: "text-gray-400"
										)}
									>
										<span
											className={cn(
												"p-2",
												activeTab === "unread" &&
													"flex items-center border-b-2 border-b-primary"
											)}
										>
											Unread
											<span className='ml-1 text-xs bg-transparent text-gray-400 rounded-full border border-gray-200 w-5 h-5 inline-flex items-center justify-center'>
												{unreadCount}
											</span>
										</span>
									</button>
									<button
										onClick={() => setActiveTab("all")}
										className={cn(
											"py-3 text-center relative",
											activeTab === "all"
												? "text-gray-800 font-medium"
												: "text-gray-400"
										)}
									>
										<span
											className={cn(
												"p-2",
												activeTab === "all" &&
													"flex items-center border-b-2 border-b-primary"
											)}
										>
											All
											<span className='ml-1 text-xs bg-transparent text-gray-400 rounded-full border border-gray-200 w-5 h-5 inline-flex items-center justify-center'>
												{notifications.length}
											</span>
										</span>
									</button>
								</div>
							</div>
						</div>

						<div className='border-b'>
							<div className='p-4 flex items-center'>
								<Checkbox
									className='data-[state=checked]:bg-transparent'
									checkStyle='text-primary'
									onCheckedChange={toggleSelectAll}
									checked={allSelected}
								/>
							</div>
						</div>

						<div className='py-1'>
							{filteredNotifications.map((notification) => (
								<div key={notification.id} className='px-2 py-1'>
									<div
										className={cn(
											"rounded-sm flex gap-3 p-3",
											notification.isSelected
												? "bg-primary-accent/90"
												: "bg-white"
										)}
									>
										<div className='flex-shrink-0 pt-1'>
											<div className='p-4 flex items-center'>
												<Checkbox
													className='data-[state=checked]:bg-transparent'
													checkStyle='text-primary'
													onCheckedChange={() => toggleSelect(notification.id)}
													checked={notification.isSelected}
												/>
											</div>
										</div>
										<div className='flex gap-3 flex-1'>
											<div className='flex-shrink-0 relative'>
												<div className='w-10 h-10 bg-gray-200 rounded-full overflow-hidden'>
													<img
														src={"/profile.avif"}
														alt='profile'
														className='w-full h-full object-cover'
														width={40}
														height={40}
													/>
												</div>
												{notification.isUnread && (
													<div className='absolute -right-1 top-0 w-3 h-3 bg-primary rounded-full border-2 border-white'></div>
												)}
											</div>
											<div className='flex-1'>
												<p className='text-sm text-gray-700 mb-1'>
													{notification.message}
												</p>
												<p className='text-xs text-gray-400'>
													{notification.time}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
