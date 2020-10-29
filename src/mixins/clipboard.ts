export const copyToClipboard = {
    methods: {
        copyToClipboard(data: string): void {
            navigator.clipboard.writeText(data);
        },
    },
};
