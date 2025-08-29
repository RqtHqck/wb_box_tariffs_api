export function stringAsNumberValuePipe(field: string | null) {
    return field === "-" ? null : field;
}

export function dateToYyyyMmDdPipe(date: string | Date) {
    if (!date) return null;
    return (date instanceof Date ? date.toISOString() : date).slice(0, 10);
}
