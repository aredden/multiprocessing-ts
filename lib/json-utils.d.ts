declare function reviver(_key: any, value: string | number | Date): string | number | Date;
declare function safeStringify(obj: object): string;
declare function safeParse(this: {
    reviver: (key: string, value: string | number | Date) => string | number | Date;
    safeStringify: (obj: object) => string | undefined;
    safeParse: (str: string) => any;
}, str: string): any;
declare const _default: {
    reviver: typeof reviver;
    safeStringify: typeof safeStringify;
    safeParse: typeof safeParse;
};
export default _default;
