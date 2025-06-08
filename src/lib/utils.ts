import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}

// You probably already have this function
export function truncateAddress(address: string): string {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const formatBalance = (balance?: string | number) => {
	if (!balance) return "0";

	const num =
		typeof balance === "string" ? Number.parseFloat(balance) : balance;

	if (num >= 1000) {
		return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
	}
	if (num >= 1) {
		return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
	}
	if (num >= 0.0001) {
		return num.toLocaleString(undefined, { maximumFractionDigits: 6 });
	}
	return num.toLocaleString(undefined, {
		maximumFractionDigits: 8,
		minimumSignificantDigits: 2,
	});
};