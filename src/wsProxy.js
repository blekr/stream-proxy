/* eslint-disable import/prefer-default-export,no-console */
import WebSocket from 'ws';
import request from 'request';
import URL from 'url';
import config from './config';
import { verify } from './permissionCheck';
import logger from './logger';

export async function webSocketHandler(ws, req) {
  const { srs: { host, port } } = config;

  const { pathname, query: { token } } = URL.parse(req.url, true);

  if (!token) {
    ws.terminate();
    logger.info(`${req.url}: blocked, token not found`);
    return;
  }

  try {
    await verify(token);
  } catch (err) {
    ws.terminate();
    logger.info(`${req.url}: blocked, token invalid: ${err.message}`);
    return;
  }

  logger.info(`got connection: ${pathname}`);

  let srsClient = request({
    uri: `http://${host}:${port}${pathname}`,
    method: 'GET',
    timeout: 6000,
  })
    .on('data', data => {
      if (ws.readyState !== WebSocket.OPEN) {
        logger.info(`${pathname}: state is not OPEN: ${ws.readyState}`);
        srsClient.abort();
        return;
      }
      ws.send(data, err => {
        if (err) {
          console.error(`${pathname}: send error: `, err);
          srsClient.abort();
        }
      });
    })
    .on('end', () => {
      console.error(`${pathname}: upstream end`);
      ws.terminate();
    })
    .on('error', err => {
      console.error(`${pathname}: upstream error: `, err);
      ws.terminate();
    });

  ws
    .on('close', () => {
      logger.info(`${pathname} webSocket closed`);
      srsClient.abort();
      srsClient = null;
    })
    .on('error', err => {
      logger.info(`${pathname} webSocket error: `, err);
      srsClient.abort();
      srsClient = null;
    });
}
