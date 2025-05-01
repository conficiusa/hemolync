import { Search, Plus, Download, ChevronDown } from "lucide-react";
import InventoryTable from "@/components/inventory-table";
import TablePagination from "@/components/table-pagination";
import { AddBloodDialog } from "@/components/add-blood-products";

export default function Inventory() {
	return (
		<div className='py-6 space-y-6'>
			<div className='bg-background rounded-lg shadow-sm overflow-hidden'>
				<div className='p-6 flex flex-col gap-6'>
					<div className='flex justify-between items-center'>
						<div>
							<h2 className='text-xl font-bold'>Blood Products</h2>
						</div>
						<div className='flex items-center gap-3'>
							<div className='flex gap-2 items-center text-muted-foreground text-sm'>
								<p className='text-sm'>Sort by</p>
								<div className='relative'>
									<div className='flex bg-muted items-center border border-gray-300 rounded-lg px-3 py-2 w-[150px] cursor-pointer'>
										<span className='text-gray-400 text-sm flex-1'>select</span>
										<ChevronDown className='h-4 w-4 text-gray-500' />
									</div>
								</div>
							</div>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<input
									type='text'
									placeholder='Search Product'
									className='pl-10 pr-4 py-2 border border-gray-300 rounded-sm w-[200px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>
							<AddBloodDialog>
								<button className='bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2'>
									<Plus className='h-4 w-4' />
									Add Product
								</button>
							</AddBloodDialog>
							<button className='border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2'>
								Export
								<Download className='h-4 w-4' />
							</button>
						</div>
					</div>

					<div className='overflow-x-auto'>
						<InventoryTable />
					</div>
					<TablePagination />
				</div>
			</div>
		</div>
	);
}
