declare function safeStringify(obj: object): string;
declare function safeParse(this: any, str: string): unknown;
declare const _default: {
    safeStringify: typeof safeStringify;
    safeParse: typeof safeParse;
};
export default _default;
