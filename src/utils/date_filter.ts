export function formatDate(
    date: string | Date,
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string {
    return new Date(date).toLocaleDateString(undefined, options)
}

export function formatMonth(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short' }
    return new Date(date).toLocaleDateString(undefined, options)
}

export function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
        case 1:
            return 'st'
        case 2:
            return 'nd'
        case 3:
            return 'rd'
        default:
            return 'th'
    }
}

export function formatDateWithSuffix(date: string | Date): string {
    const day = new Date(date).getDate();
    const dayWithSuffix = day + getOrdinalSuffix(day);

    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return `${dayWithSuffix} ${formattedDate}`;
}
