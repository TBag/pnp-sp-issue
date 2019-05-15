declare var global: any;
const NodeFetch = require("node-fetch");

export function patch() {

    // patch these globallobally for nodejs
    if (!global.Headers) {
        global.Headers = NodeFetch.Headers;
    }
    if (!global.Request) {
        global.Request = NodeFetch.Request;
    }
    if (!global.Response) {
        global.Response = NodeFetch.Response;
    }
    if (!global.fetch) {
        global.fetch = NodeFetch;
    }
}