export function cn(...inputs: Array<false | null | string | undefined>): string {
    return inputs.filter(Boolean).join(' ');
}
