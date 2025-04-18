import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getStatusBadgeClass = (status: string) => {
	switch (status) {
		case "Expired":
			return "bg-red-50 text-red-700";
		case "In Stock":
			return "bg-green-50 text-green-700";
		case "Limited":
			return "bg-amber-50 text-amber-700";
		case "Out of Stock":
			return "bg-gray-50 text-gray-700";
		default:
			return "bg-gray-50 text-gray-700";
	}
};
