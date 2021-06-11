# @backstage/backend-common

Common functionality library for Backstage backends, implementing logging,
error handling and similar.

## Usage

Add the library to your backend package:

```sh
# From your Backstage root directory
cd packages/backend
yarn add @backstage/backend-common
```

then make use of the handlers and logger as necessary:

```typescript
import {
  errorHandler,
  getRootLogger,
  notFoundHandler,
  requestLoggingHandler,
} from '@backstage/backend-common';

const app = express();
app.use(requestLoggingHandler());
app.use('/home', myHomeRouter);
app.use(notFoundHandler());
app.use(errorHandler());

app.listen(PORT, () => {
  getRootLogger().info(`Listening on port ${PORT}`);
});
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
