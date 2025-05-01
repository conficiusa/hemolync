import {
	Search,
	Plus,
	Download,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InviteUserDialog } from "@/components/user-invite";
import StaffTable from "@/components/staff-table";

export default function StaffManagement() {
	return (
		<div className='p-6'>
			<div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
				<div className='p-6 flex flex-col gap-6'>
					<div className='flex justify-between items-center'>
						<div className='flex gap-2 items-center'>
							<h2 className='text-xl font-semibold text-gray-900'>Users</h2>
							<Badge className='bg-[#f8e3e8] hover:bg-[#f8e3e8] text-primary-accent-foreground'>
								15 users
							</Badge>
						</div>
						<div className='flex items-center gap-3'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<input
									type='text'
									placeholder='Search user'
									className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-[300px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>
							<InviteUserDialog>
								<button className='bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2'>
									<Plus className='h-4 w-4' />
									Add User
								</button>
							</InviteUserDialog>
							<button className='border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2'>
								Export
								<Download className='h-4 w-4' />
							</button>
						</div>
					</div>

					<div className='overflow-x-auto'>
						<StaffTable />
					</div>

					<div className='flex justify-between items-center'>
						<button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700'>
							<ChevronLeft className='h-4 w-4' />
							Previous
						</button>
						<div className='flex items-center gap-1'>
							<button className='w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white text-sm font-medium'>
								1
							</button>
							{[2, 3].map((page) => (
								<button
									key={page}
									className='w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium'
								>
									{page}
								</button>
							))}
							<span className='text-gray-500 px-1'>...</span>
							{[8, 9, 10].map((page) => (
								<button
									key={page}
									className='w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium'
								>
									{page}
								</button>
							))}
						</div>
						<button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700'>
							Next
							<ChevronRight className='h-4 w-4' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
