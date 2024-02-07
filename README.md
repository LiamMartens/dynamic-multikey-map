# dynamic-multikey-map

[![badge](https://img.shields.io/npm/v/dynamic-multikey-map)](https://www.npmjs.com/package/dynamic-multikey-map) [![badge](https://img.shields.io/bundlephobia/min/dynamic-multikey-map)](https://bundlephobia.com/package/dynamic-multikey-map) ![badge](https://img.shields.io/github/license/LiamMartens/dynamic-multikey-map)

This is a dynamic multiple key map to map a single object to multiple dynamic values.

## Usage

```js
import { MultiKeyMap } from "dynamic-multikey-map";

type ValueType = {
  username: string;
  ssn: string;
};

const map = new MultiKeyMap<ValueType, string>([
  (value: ValueType) => value.ssn,
  (value: ValueType) => value.username,
]);

map.add({
  username: "john.doe",
  ssn: "123-45-6789",
});

expect(map.get("john.doe")).toEqual(map.get("123-45-6789"));
```
