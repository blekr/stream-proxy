/* eslint-disable import/prefer-default-export */
export function isPrivateIp(ip) {
  return (
    /^10.255.*/.test(ip) ||
    /^101.254.255.*/.test(ip) ||
    /127.0.0.1/.test(ip) ||
    ip === '::1' ||
    ip === '221.122.103.135'
  );
}
