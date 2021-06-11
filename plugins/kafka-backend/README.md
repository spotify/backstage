# Kafka Backend

This is the backend part of the Kafka plugin. It responds to Kafka requests
from the frontend.

## Configuration

This configures how to connect to the brokers in your Kafka cluster.

### `clientId`

The name of the client to use when connecting to the cluster.

### `brokers`

A list of the brokers' host names and ports to connect to.

### `ssl` (optional)

Configure TLS connection to the Kafka cluster. The options are passed directly
to [tls.connect] and used to create the TLS secure context. Normally these
would include `key` and `cert`.

Example:

```yaml
kafka:
  clientId: backstage
  clusters:
    - name: prod
      brokers:
        - localhost:9092
```

### `sasl` (optional)

Configure SASL authentication for the Kafka client.

```yaml
kafka:
  clientId: backstage
  clusters:
    - name: prod
      brokers:
        - my-cluster:9092
      ssl: true
      sasl:
        mechanism: plain # or 'scram-sha-256' or 'scram-sha-512'
        username: my-username
        password: my-password
```
