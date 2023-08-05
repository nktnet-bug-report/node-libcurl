# Curl Easy segmentation fault with requests to external site

Thank you for this library :). Please let me know if any other information would help.

## Describe the bug

I get a segmentation fault when I try to send a request using Curl Easy to an external site such as
- https//www.google.com.au

There is no issue with localhost/127.0.0.1.

I discovered this when trying to send requests using [sync-request-curl](https://www.npmjs.com/package/sync-request-curl) in the specific environment with the following inside a Dockerfile:

```dockerfile
FROM php:8.1.8-fpm-alpine
RUN apk add --update npm=7.17.0-r0 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.14/main
```

It seems to work with no issues locally and with other base images, e.g. `node:18-alpine`.

This was just an environment that was configured at my workplace.


## To Reproduce

<details close>
<summary>Code that causes segfault (click to view)</summary>

```typescript
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
```

</details>

---

Docker image [here](https://hub.docker.com/layers/nktnet/node-libcurl/segfault/images/sha256-ba6247ec32b547afad68d49fbdb2007390a26c20b050b4c88567f3d4805d3562?context=repo). Full repository [here](https://github.com/nktnet-bug-report/node-libcurl).

Have the local server running on one terminal
```shell
$ npm start
```
Then in another terminal run `src/request.ts` with

```shell
$ npm test

> test
> ts-node src/request

Sending GET request to 'http://localhost:3000' (should get 200)
Status Code: 200

Sending GET request to 'https://www.google.com' (gets SEGFAULT)
Segmentation fault
```

## Version information

### Node Libcurl Version

3.0.0

### Curl Version:

7.83.1

<details closed>
<summary>node -e "console.log(require('node-libcurl').Curl.getVersionInfoString())" (click to view)</summary>

```shell
$ node -e "console.log(require('node-libcurl').Curl.getVersionInfoString())"
Version: libcurl/7.86.0 OpenSSL/not available zlib/1.2.12 brotli/1.0.9 zstd/1.4.9 libidn2/2.1.1 libssh2/1.10.0 nghttp2/1.47.0
Protocols: dict, file, ftp, ftps, gopher, gophers, http, https, imap, imaps, ldap, ldaps, mqtt, pop3, pop3s, rtsp, scp, sftp, smb, smbs, smtp, smtps, telnet, tftp
Features: AsynchDNS, Debug, TrackMemory, IDN, IPv6, Largefile, NTLM, NTLM_WB, SSL, libz, brotli, TLS-SRP, HTTP2, UnixSockets, HTTPS-proxy, alt-svc
```

</details>

### Operating System

Alpine Linux v3.16 x86_64

<details closed>
<summary>neofetch output (click to view)</summary>

```
$ neofetch --backend off
root@2a8a6f86b13b 
----------------- 
OS: Alpine Linux v3.16 x86_64 
Host: KVM/QEMU (Standard PC (Q35 + ICH9, 2009) pc-q35-8.0) 
Kernel: 5.15.49-linuxkit-pr 
Uptime: 7 hours, 32 mins 
Packages: 43 (apk) 
Shell: ash 
CPU: 11th Gen Intel i7-11370H (4) @ 2.995GHz 
Memory: 1000MiB / 3774MiB
```

</details>


### Node.js Version:

18.9.1

<details closed>
<summary>npm version output (click to view)</summary>

```shell
$ npm version
{
  npm: '7.17.0',
  node: '18.9.1',
  v8: '10.2.154.15-node.12',
  uv: '1.44.1',
  zlib: '1.2.12',
  brotli: '1.0.9',
  ares: '1.18.1',
  modules: '108',
  nghttp2: '1.47.0',
  napi: '8',
  llhttp: '6.0.10',
  openssl: '1.1.1q',
  cldr: '41.0',
  icu: '71.1',
  tz: '2022a',
  unicode: '14.0'
}
```

</details>

## Additional Context

This may be related to [#198](https://github.com/JCMais/node-libcurl/issues/198).