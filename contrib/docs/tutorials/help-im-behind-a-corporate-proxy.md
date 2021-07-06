# Running the backend behind a Corporate Proxy

Let's admit it, we've all been there. Sometimes you've gotta run stuff with no way out to the public internet, only the smallest of corporate proxy tunnels.

Whilst this isn't supported natively by Backstage, this might help you get your installation up and running making calls through the said proxy tunnel.

## backend

Unfortunately, `nodejs` does not respect `HTTP(S)_PROXY` environment variables by default, and the library that we use to provide `fetch` functionality `node-fetch` (provided by `cross-fetch`) does not also respect these environment variables.

There are however some ways to get this to work without too much effort. It's most likely that you're going to run into these issues from the `backend` part of `backstage` as that's the part that isn't helped by your browser or OS's settings for the corporate proxy.

**Note:** You're gonna want to be in your backend working directory for these solutions as that's where the requests come from that don't go through this proxy.

### Using `global-agent`

1. Install `global-agent` using `yarn add global-agent`
2. Go to the entry file for the backend (`src/index.ts`)
3. At the top of the file paste the following:

```ts
import 'global-agent/bootstrap';
```

4. Start the backend with the `global-agent` variables

```sh
export GLOBAL_AGENT_HTTP_PROXY=$HTTP_PROXY
export GLOBAL_AGENT_NO_PROXY=$NO_PROXY
yarn start
```

More information and more options for configuring `global-agent` including just using the default environment variables can be found here: https://github.com/gajus/global-agent

### Using `proxy-agent`

`proxy-agent` is a library that you can use to override the `globalAgents` of `node` land with a tunnel to use for each request.

1. Install `proxy-agent` using `yarn add proxy-agent`
2. Go to the entry file for the backend (`src/index.ts`)
3. At the top of the file paste the following:

```ts
import ProxyAgent from 'proxy-agent';
import http from 'http';
import https from 'https';

/*
  Something to note here, this might need different configuration depending on your own setup.
  If you only have an http_proxy then you'll need to set that as both the http and https globalAgent instead.
*/
if (process.env.HTTP_PROXY) {
  http.globalAgent = new ProxyAgent(process.env.HTTP_PROXY);
}

if (process.env.HTTPS_PROXY) {
  https.globalAgent = new ProxyAgent(process.env.HTTPS_PROXY);
}
```

4. Start the backend with `yarn start`

## config

If your development environment is in the cloud (like with [AWS Cloud9](https://aws.amazon.com/cloud9/) or an instance of [Theia](https://theia-ide.org/)), you will need to update your configuration.

You will probably need to make some changes in `app-config.yaml` (or another config file like `app-config.local.yaml` if you've created it, see the [configuration doc](https://backstage.io/docs/conf/#supplying-configuration)).  
The exact values will depend on your setup but for instance, if your public url is `https://your-public-url.com` and the port `3000` and `8080` are open:

```yaml
app:
  baseUrl: https://your-public-url.com:3000
  listen:
    host: 0.0.0.0 # This makes the dev server bind to all IPv4 interfaces and not just the baseUrl hostname

backend:
  baseUrl: https://your-public-url.com:8080
  listen:
    port: 8080
  cors:
    origin: https://your-public-url.com:3000
```

The app port must proxy web socket connections in order to make hot reloading work.
