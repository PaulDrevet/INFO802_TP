"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Webserver_1 = __importDefault(require("./base/Webserver"));
const tslog_1 = require("tslog");
class Main {
    webserver;
    logger;
    constructor() {
        this.webserver = new Webserver_1.default({ port: 80 });
        this.logger = new tslog_1.Logger({
            displayFilePath: "hidden",
            displayFunctionName: false,
            prefix: ["RAPI |"],
            overwriteConsole: true,
            dateTimeTimezone: "Europe/Paris",
            dateTimePattern: "day/month/year hour:minute:second.millisecond",
        });
    }
    async start() {
        await this.webserver.start();
    }
    getWebServer() {
        return this.webserver;
    }
    getLogger() {
        return this.logger;
    }
}
exports.default = new Main();
