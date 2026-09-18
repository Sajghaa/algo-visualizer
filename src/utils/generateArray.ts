export function generateArray(size: number, max = 400): number[] {
    return Array.from(
        { length: size },
        () => Math.floor(Math.random() * max) + 10
    );
}