# BoilingData WebSocket URL Signer

Sign BoilingData API WebSocket (wss) URL and use e.g. `wscat` to send SQL queries over the WebSocket

```shell
yarn install
wscat -c `node get-signed-wss-url.js "<username>" "<password>" | jq -r '.signedWsUrl'`
Connected (press CTRL+C to quit)
> {"sql":"SELECT 1;"}
< {"messageType":"DATA","data":[{"1":1}],"batchSerial":1,"totalBatches":1}
```

## Mosaic duckdb-server API Support

The [Mosaic duckdb-server](https://uwdata.github.io/mosaic/duckdb/) supports WebSocket connections with simple API.

You can use the generated signed WebSocket URL with Mosaic to run duckdb-server compatible queries cloud side on BoilingData.

```shell
> {"sql":"SELECT 1;","type":"json"}
< [{"1":1}]
```
