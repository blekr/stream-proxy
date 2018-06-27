/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import config from './config';

export function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.superSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}
