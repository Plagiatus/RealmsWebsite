import * as Http from "http";
export async function ping(_input, _response: Http.OutgoingMessage) {
  _response.write(JSON.stringify({pong: "pong"}));
}