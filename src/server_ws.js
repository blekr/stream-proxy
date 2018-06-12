import WebSocket from 'ws';
import config from './config';
import { webSocketHandler } from './wsProxy';
import errors from './errors';

const wss = new WebSocket.Server({
  port: config.wsPort,
  host: '0.0.0.0',
});
wss.on('connection', (ws, req) => {
  webSocketHandler(ws, req);
});

console.log(`web sock is listening on ${config.wsPort}`);

// Shutdown Node.js app gracefully
function handleExit(options, err) {
  if (options.cleanup) {
    const actions = [wss.close];
    actions.forEach((close, i) => {
      try {
        close(() => {
          if (i === actions.length - 1) process.exit();
        });
      } catch (error) {
        if (i === actions.length - 1) process.exit();
      }
    });
  }
  if (err) errors.report(err);
  if (options.exit) process.exit();
}

process.on('exit', handleExit.bind(null, { cleanup: true }));
process.on('SIGINT', handleExit.bind(null, { exit: true }));
process.on('SIGTERM', handleExit.bind(null, { exit: true }));
process.on('uncaughtException', handleExit.bind(null, { exit: true }));
