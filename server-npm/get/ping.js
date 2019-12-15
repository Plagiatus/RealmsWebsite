"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function ping(_input, _response) {
    _response.write(JSON.stringify({ pong: "pong" }));
}
exports.ping = ping;
