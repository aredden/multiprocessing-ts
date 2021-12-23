declare function reviver(key: any, value: string | number | Date): string | number | Date;
declare function safeStringify(obj: any): string | undefined;
declare function safeParse(this: {
    reviver: (key: any, value: string | number | Date) => string | number | Date;
    safeStringify: (obj: any) => string | undefined;
    safeParse: (str: string) => any;
}, str: string): any;
declare const _default: {
    reviver: typeof reviver;
    safeStringify: typeof safeStringify;
    safeParse: typeof safeParse;
};
export default _default;
//# sourceMappingURL=../src/src/json-utils.d.ts.map