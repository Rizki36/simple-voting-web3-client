/**
 * Converts a Unix timestamp (seconds) to a JavaScript Date object
 */
export function fromUnixTimestamp(timestamp: bigint | number): Date {
    const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    return new Date(timestampNumber * 1000); // Convert seconds to milliseconds
}

/**
 * Converts a JavaScript Date to Unix timestamp (seconds)
 */
export function toUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}