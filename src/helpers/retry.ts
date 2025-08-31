export async function retry<T>(
    callback: () => Promise<T>,
    times: number,
    interval: number
): Promise<T> {
    let attempt = 0;

    while (attempt < times) {
        try {
            attempt++;

            const result = await callback();
            
            return result;
        } catch (err) {
            console.log(`Attempt ${attempt} failed`);

            // Если лимит - выходим
            if (attempt >= times) {
                throw err;
            }
            // Ждём interval секунд
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    }

    throw new Error("Unexpected error in retry loop");
}