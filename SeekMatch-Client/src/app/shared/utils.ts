/**
 * Formats a given date (either a Date object or a string) into the 'yyyy-MM-dd' format.
 * If the input is null, it returns null.
 * 
 * @param date - The date to be formatted. It can be either a Date object, a string representation of a date, or null.
 * @returns A string representing the date in 'yyyy-MM-dd' format, or null if the input is null.
 */
export function formatDateToISO(date: string | Date | null): string | null {
    if (date === null || date === undefined) {
        return null;
    }

    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    } else {
        return new Date(date).toISOString().split('T')[0];
    }
}