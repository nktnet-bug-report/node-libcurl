import { Curl, Easy } from 'node-libcurl';

/*
 * Simplified from [sync-request-curl](https://github.com/nktnet1/sync-request-curl)
 */
const request = (method: string, url: string) => {
  const curl = new Easy();
  curl.setOpt(Curl.option.CUSTOMREQUEST, method);
  curl.setOpt(Curl.option.URL, url);
  curl.perform();
  const statusCode = curl.getInfo('RESPONSE_CODE').data as number;
  curl.close();
  return { statusCode };
};

const localUrl = 'http://localhost:3000';
console.log(`Sending GET request to '${localUrl}' (should get 200)`)
const response = request('GET', localUrl);
console.log('Status Code:', response.statusCode);

console.log();

const externalUrl = 'https://www.google.com'
console.log(`Sending GET request to '${externalUrl}' (gets SEGFAULT)`)
const segfault = request('GET', externalUrl);
console.log('Status Code:', segfault.statusCode);