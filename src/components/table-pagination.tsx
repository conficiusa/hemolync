import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

const TablePagination = memo(() => {
	return (
		<div className='flex justify-between items-center'>
			<button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700'>
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
			<button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700'>
				Next
				<ChevronRight className='h-4 w-4' />
			</button>
		</div>
	);
});

TablePagination.displayName = "TablePagination";
 
export default TablePagination;
