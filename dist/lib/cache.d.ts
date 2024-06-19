export declare class EaseCache {
    private $handle;
    constructor(handle: any);
    set(key: string, value: any, expire: number | null): Promise<any>;
    get(key: string): Promise<any>;
}
