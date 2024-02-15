import { FastifyInstance } from "fastify";
interface IWebserver {
    port: number;
    middlewares?: IMiddleware[];
}
interface IMiddleware<T = {}> {
    import: any;
    config?: T;
}
export default class Webserver {
    private readonly port;
    private readonly server;
    private readonly middlewares;
    constructor(option: IWebserver);
    start(): Promise<void>;
    addMiddleware<T = {}>(middleware: IMiddleware): this;
    getServer(): FastifyInstance;
}
export {};
