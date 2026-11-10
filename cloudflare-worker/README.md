# aem-cf-ew-worker

Cloudflare Worker that fronts `cf-ew.osrecio.com` with AEM Edge Delivery Services as origin (`main--cf-ew--osrecio.aem.live`).

- `src/index.mjs` is the official [adobe/aem-cloudflare-prod-worker](https://github.com/adobe/aem-cloudflare-prod-worker) code, unchanged.
- `cloudflare.config.ts` holds the route and the `ORIGIN_HOSTNAME` variable for the [`cf` CLI](https://developers.cloudflare.com/cf/).

## Deploy

```sh
npm install
cf auth login
cf deploy
```

This folder is listed in `.hlxignore`, so AEM does not serve it.

Setup guide: https://www.aem.live/docs/byo-cdn-cloudflare-worker-setup
