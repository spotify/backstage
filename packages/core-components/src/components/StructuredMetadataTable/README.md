# Structured MetadataTable

The `Strucuted MetadataTable` staple is a staple component for displaying basic JSON metadata.

# API

There is a very lightweight API around this component

| property |    value    |
| :------- | :---------: |
| metadata | object/JSON |
| dense    |    bool     |

## Metadata

The Metadata property takes in JSON and iterates over it to display the tabled information.

The component itself only handles the display area, so you can use standard JS to construct an object that fits your desired outcome. No need to configure deeper within the staple.

```
<StructuredMetadataTable metadata={json} />
```

This will step through each of the keys and based on their types display them in a logical way.

### Primitives

Any non complex value will be displayed using `{value}` which will just output the value as text.

### Objects/Maps

JSON / Maps are displayed in a `<MetadataItemList>` with its values as formatted key/value pairs.

### Arrays

Arrays are displayed similarly to objects, its values in a `<MetadataItemList>`.

### Custom

If you want to customize the rendering of your value you can just replace it with a React Element.

```
{
    contact: me@email.com
}
```

Would display as <b>contact</b> <span>me@email.com</span>

but if you wanted this to be a mailto you could inject that react into your map:

```
{
    contact: <Link email="me@email.com">me@email.com</Link>
}
```

Then it would be displayed using the react element.

# Usage

For best usage drop this component inside another card. It can be used similarly to the `<MetadataTable>` and exposes the `dense` for when that is necessary.
