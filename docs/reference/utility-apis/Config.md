---
---
# Config

The Config type is defined at
[packages/config/src/types.ts:32](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/config/src/types.ts#L32).

The following Utility API implements this type:
[configApiRef](./README.md#config)

## Members

### has()

<pre>
has(key: string): boolean
</pre>

### keys()

<pre>
keys(): string[]
</pre>

### get()

<pre>
get(key?: string): <a href="#jsonvalue">JsonValue</a>
</pre>

### getOptional()

<pre>
getOptional(key?: string): <a href="#jsonvalue">JsonValue</a> | undefined
</pre>

### getConfig()

<pre>
getConfig(key: string): <a href="#config">Config</a>
</pre>

### getOptionalConfig()

<pre>
getOptionalConfig(key: string): <a href="#config">Config</a> | undefined
</pre>

### getConfigArray()

<pre>
getConfigArray(key: string): <a href="#config">Config</a>[]
</pre>

### getOptionalConfigArray()

<pre>
getOptionalConfigArray(key: string): <a href="#config">Config</a>[] | undefined
</pre>

### getNumber()

<pre>
getNumber(key: string): number
</pre>

### getOptionalNumber()

<pre>
getOptionalNumber(key: string): number | undefined
</pre>

### getBoolean()

<pre>
getBoolean(key: string): boolean
</pre>

### getOptionalBoolean()

<pre>
getOptionalBoolean(key: string): boolean | undefined
</pre>

### getString()

<pre>
getString(key: string): string
</pre>

### getOptionalString()

<pre>
getOptionalString(key: string): string | undefined
</pre>

### getStringArray()

<pre>
getStringArray(key: string): string[]
</pre>

### getOptionalStringArray()

<pre>
getOptionalStringArray(key: string): string[] | undefined
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### Config

```tsx
export type Config = {
  has(key: string): boolean;

  keys(): string[];

  get(key?: string): <a href="#jsonvalue">JsonValue</a>;
  getOptional(key?: string): <a href="#jsonvalue">JsonValue</a> | undefined;

  getConfig(key: string): Config;
  getOptionalConfig(key: string): <a href="#config">Config</a> | undefined;

  getConfigArray(key: string): <a href="#config">Config</a>[];
  getOptionalConfigArray(key: string): <a href="#config">Config</a>[] | undefined;

  getNumber(key: string): number;
  getOptionalNumber(key: string): number | undefined;

  getBoolean(key: string): boolean;
  getOptionalBoolean(key: string): boolean | undefined;

  getString(key: string): string;
  getOptionalString(key: string): string | undefined;

  getStringArray(key: string): string[];
  getOptionalStringArray(key: string): string[] | undefined;
}
```

Defined at
[packages/config/src/types.ts:32](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/config/src/types.ts#L32).

Referenced by: [getConfig](#getconfig), [getOptionalConfig](#getoptionalconfig),
[getConfigArray](#getconfigarray),
[getOptionalConfigArray](#getoptionalconfigarray), [Config](#config).

### JsonArray

<pre>
export type JsonArray = <a href="#jsonvalue">JsonValue</a>[]
</pre>

Defined at
[packages/config/src/types.ts:18](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/config/src/types.ts#L18).

Referenced by: [JsonValue](#jsonvalue).

### JsonObject

```tsx
export type JsonObject = { [key in string]?: <a href="#jsonvalue">JsonValue</a> }
```

Defined at
[packages/config/src/types.ts:17](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/config/src/types.ts#L17).

Referenced by: [JsonValue](#jsonvalue).

### JsonValue

```tsx
export type JsonValue =
  | <a href="#jsonobject">JsonObject</a>
  | <a href="#jsonarray">JsonArray</a>
  | number
  | string
  | boolean
  | null
```

Defined at
[packages/config/src/types.ts:19](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/config/src/types.ts#L19).

Referenced by: [get](#get), [getOptional](#getoptional),
[JsonObject](#jsonobject), [JsonArray](#jsonarray), [Config](#config).
