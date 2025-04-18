"use client";
import {
	Search,
	Plus,
	Download,
	Trash2,
	Pencil,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface BloodProduct {
	id: number;
	batchNumber: string;
	productName: string;
	dateAdded: string;
	expirationDate: string;
	status: "In Stock" | "Limited" | "Out of Stock" | "Expired";
}

const bloodProducts: BloodProduct[] = [
	{
		id: 1,
		batchNumber: "14637",
		productName: "Whole Blood",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Expired",
	},
	{
		id: 2,
		batchNumber: "14637",
		productName: "Concentrated Red Cells (CRC)",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Expired",
	},
	{
		id: 3,
		batchNumber: "14637",
		productName: "Fresh frozen plasma (FFP)",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "In Stock",
	},
	{
		id: 4,
		batchNumber: "14637",
		productName: "Platelets",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Out of Stock",
	},
	{
		id: 5,
		batchNumber: "14637",
		productName: "Cryoprecipitate",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Out of Stock",
	},
	{
		id: 6,
		batchNumber: "14637",
		productName: "Platelets",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Limited",
	},
	{
		id: 7,
		batchNumber: "14637",
		productName: "Fresh frozen plasma (FFP)",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Expired",
	},
	{
		id: 8,
		batchNumber: "14637",
		productName: "Platelets",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "Out of Stock",
	},
	{
		id: 9,
		batchNumber: "14637",
		productName: "Cryoprecipitate",
		dateAdded: "12/04/2024",
		expirationDate: "12/04/2024",
		status: "In Stock",
	},
];
export default function Inventory() {
	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case "Expired":
				return "bg-amber-50 text-amber-700";
			case "In Stock":
				return "bg-blue-50 text-blue-700";
			case "Limited":
				return "bg-pink-50 text-pink-700";
			case "Out of Stock":
				return "bg-yellow-50 text-yellow-700";
			default:
				return "bg-gray-50 text-gray-700";
		}
	};

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
							<button className='bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2'>
								<Plus className='h-4 w-4' />
								Add Product
							</button>
							<button className='border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2'>
								Export
								<Download className='h-4 w-4' />
							</button>
						</div>
					</div>

					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-gray-200'>
									<th className='py-3 px-4 text-left'>
										<Checkbox
											className='data-[state=checked]:bg-transparent'
											checkStyle='text-primary'
										/>
									</th>
									<th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
										Batch Number
									</th>
									<th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
										Blood Product
									</th>
									<th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
										Date Added
									</th>
									<th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
										Expiration Date
									</th>
									<th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
										Status
									</th>
									<th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{bloodProducts.map((product) => (
									<tr
										key={product.id}
										className='border-b border-gray-100 hover:bg-gray-50'
									>
										<td className='py-4 px-4'>
											<Checkbox
												className='data-[state=checked]:bg-transparent'
												checkStyle='text-primary'
											/>
										</td>
										<td className='py-4 px-4 text-sm text-gray-900'>
											{product.batchNumber}
										</td>
										<td className='py-4 px-4 text-sm text-gray-900'>
											{product.productName}
										</td>
										<td className='py-4 px-4 text-sm text-gray-500'>
											{product.dateAdded}
										</td>
										<td className='py-4 px-4 text-sm text-gray-500'>
											{product.expirationDate}
										</td>
										<td className='py-4 px-4'>
											<span
												className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
													product.status
												)}`}
											>
												{product.status}
											</span>
										</td>
										<td className='py-4 px-4'>
											<div className='flex items-center gap-2'>
												<button className='p-1 text-gray-400 hover:text-gray-600'>
													<Trash2 className='h-5 w-5' />
												</button>
												<button className='p-1 text-gray-400 hover:text-gray-600'>
													<Pencil className='h-5 w-5' />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
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
