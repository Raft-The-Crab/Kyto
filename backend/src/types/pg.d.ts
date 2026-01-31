declare module 'pg' {
  export class Pool {
    constructor(opts?: any);
    query(text: string, params?: any[]): Promise<any>;
    connect(): Promise<any>;
    end(): Promise<void>;
  }
}
