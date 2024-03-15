# BoilingData WebSocket URL Signer

Sign BoilingData API WebSocket (wss) URL and use e.g. `wscat` to send SQL queries over the WebSocket

```shell
yarn install
wscat -c `node get-signed-wss-url.js "<username>" "<password>" | jq -r '.signedWsUrl'`
Connected (press CTRL+C to quit)
> {"sql":"SELECT 1;"}
< {"messageType":"DATA","data":[{"1":1}],"batchSerial":1,"totalBatches":1}
> {"sql":"SELECT * FROM parquet_scan('s3://boilingdata-demo/test.parquet') LIMIT 1;"}
< {"messageType":"DATA","requestId":"reqIdNotFound","batchSerial":1,"totalBatches":1,"data":[{"registration_dttm":"2016-02-03 07:55:29+00","id":1,"first_name":"Amanda","last_name":"Jordan","email":"ajordan0@com.com","gender":"Female","ip_address":"1.197.201.2","cc":"6759521864920116","country":"Indonesia","birthdate":"3/8/1971","salary":49756.53,"title":"Internal Auditor","comments":"1E+02"}]}
```

## Mosaic duckdb-server API Support

The [Mosaic duckdb-server](https://uwdata.github.io/mosaic/duckdb/) supports WebSocket connections with simple API.

You can use the generated signed WebSocket URL with Mosaic "clients" for using BoilingData instead of a local duckdb-server.

```shell
> {"sql":"SELECT 1;","type":"json"}
< [{"1":1}]
> {"sql":"SELECT * FROM parquet_scan('s3://boilingdata-demo/test.parquet') LIMIT 1;","type":"json"}
< [{"registration_dttm":"2016-02-03 07:55:29+00","id":1,"first_name":"Amanda","last_name":"Jordan","email":"ajordan0@com.com","gender":"Female","ip_address":"1.197.201.2","cc":"6759521864920116","country":"Indonesia","birthdate":"3/8/1971","salary":49756.53,"title":"Internal Auditor","comments":"1E+02"}]
```

> Since there is no requestId (or similar) key to map requests and responses, only one request should be sent at a time. Also, as there is no batch fragment identifiers, multiple received messages should be assumed to belong to the same response set.
