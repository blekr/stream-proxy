/* eslint-disable import/prefer-default-export,no-console */
import WebSocket from 'ws';
import request from 'request';
import config from './config';
import { isPrivateIp } from './util';

export function webSocketHandler(ws, req) {
  const { srs: { host, port } } = config;

  const remoteIp = req.connection.remoteAddress;
  console.log(`${req.url}: got ws connection from ${remoteIp}`);

  if (!isPrivateIp(remoteIp)) {
    console.log(`${req.url}: blocked`);
    ws.terminate();
    return;
  }

  let srsClient = request({
    uri: `http://${host}:${port}${req.url}`,
    method: 'GET',
    timeout: 6000,
  })
    .on('data', data => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.log(`${req.url}: state is not OPEN: ${ws.readyState}`);
        srsClient.abort();
        return;
      }
      ws.send(data, err => {
        if (err) {
          console.error(`${req.url}: send error: `, err);
          srsClient.abort();
        }
      });
    })
    .on('end', () => {
      console.error(`${req.url}: upstream end`);
      ws.terminate();
    })
    .on('error', err => {
      console.error(`${req.url}: upstream error: `, err);
      ws.terminate();
    });

  ws
    .on('close', () => {
      console.log(`${req.url} webSocket closed`);
      srsClient.abort();
      srsClient = null;
    })
    .on('error', err => {
      console.log(`${req.url} webSocket error: `, err);
      srsClient.abort();
      srsClient = null;
    });
}
