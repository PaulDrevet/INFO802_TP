import Webserver from "./base/Webserver";
import { Logger } from "tslog";
declare class Main {
    private readonly webserver;
    private readonly logger;
    constructor();
    start(): Promise<void>;
    getWebServer(): Webserver;
    getLogger(): Logger;
}
declare const _default: Main;
export default _default;
