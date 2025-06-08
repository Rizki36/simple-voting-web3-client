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