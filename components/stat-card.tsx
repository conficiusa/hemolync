import { TrendingDown, TrendingUp, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string;
	change: number;
	changeType: "increase" | "decrease";
	changeText: string;
	changeColor?: "success" | "destructive" | "primary";
}

export function StatCard({
	title,
	value,
	change,
	changeType,
	changeText,
	changeColor = "success",
}: StatCardProps) {
	return (
		<div className='bg-white rounded-lg p-6 flex justify-between items-start'>
			<div>
				<h3 className='text-sm font-medium text-gray-500 mb-1'>{title}</h3>
				<p className='text-2xl font-bold text-gray-900 mb-2'>{value}</p>
				<div className='flex items-center gap-1'>
					{changeType === "increase" ? (
						<TrendingUp
							size={16}
							className={cn(
								"text-success",
								changeColor === "destructive" && "text-destructive",
								changeColor === "primary" && "text-primary"
							)}
						/>
					) : (
						<TrendingDown size={16} className='text-destructive' />
					)}
					<span
						className={cn(
							"text-sm font-medium text-success",
							changeColor === "destructive" && "text-destructive",
							changeColor === "primary" && "text-primary"
						)}
					>
						{change}%
					</span>
					<span className='text-sm text-gray-500'>{changeText}</span>
				</div>
			</div>
			<div className='w-10 h-10 rounded-full bg-[#f7e1e7] flex items-center justify-center'>
				<Users2 size={20} className='text-[#991742]' />
			</div>
		</div>
	);
}
