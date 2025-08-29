export function getToday(): string {
    const date = new Date().toISOString().slice(0, 10); 
    console.log(`Date: ${date}`);
    return date;
}