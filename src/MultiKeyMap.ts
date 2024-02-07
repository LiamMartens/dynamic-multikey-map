type ExtractorFunction<T, K> = (value: T) => K;

export class MultiKeyMap<ObjectType, KeyValueTypes extends unknown> {
  protected valueKeys = new Map<ObjectType, KeyValueTypes[]>();
  protected map = new Map<KeyValueTypes, ObjectType>();

  constructor(
    public extractors: ExtractorFunction<ObjectType, KeyValueTypes>[]
  ) {}

  public get size() {
    return this.valueKeys.size;
  }

  /**
   * Clears the map keys and values
   */
  public clear = () => {
    this.valueKeys.clear();
    this.map.clear();
  };

  /**
   * Adds a value to the map
   * @param value
   */
  public add = (value: ObjectType) => {
    const valueKeys: KeyValueTypes[] = [];
    for (const fn of this.extractors) {
      const key = fn(value);
      valueKeys.push(key);
      if (this.map.has(key)) {
        console.warn(`[duplicate_key] ${key}`, value);
      }
      this.map.set(key, value);
    }
    this.valueKeys.set(value, valueKeys);
  };

  /**
   * Removes a value from the map by value
   * @param value
   * @returns false if the value was not found in the map, true if successfull
   */
  public deleteByValue = (value: ObjectType) => {
    if (this.valueKeys.has(value)) {
      const keys = this.valueKeys.get(value)!;
      this.valueKeys.delete(value);
      for (const key of keys) {
        this.map.delete(key);
      }
      return true;
    }
    return false;
  };

  /**
   * Removes a value from the map by key
   * @param key
   * @returns false if the key was not found in the map, true if successfull
   */
  public deleteByKey = (key: KeyValueTypes) => {
    if (this.map.has(key)) {
      const value = this.map.get(key)!;
      const keys = this.valueKeys.get(value);
      if (keys) {
        this.valueKeys.delete(value);
        for (const key of keys) {
          this.map.delete(key);
        }
      }
      return true;
    }
    return false;
  };

  /**
   * @param key
   * @returns if a key exists in the map
   */
  public has = (key: KeyValueTypes) => {
    return this.map.has(key);
  };

  /**
   * Finds he value for a specified key
   * @param key
   * @returns associated value
   */
  public get = (key: KeyValueTypes) => {
    return this.map.get(key);
  };

  /**
   * Replaces the value of a specific key. It will update all previously associated keys to match
   * @param key
   * @param value
   * @returns true if successfull, false if not found
   */
  public replace = (key: KeyValueTypes, value: ObjectType) => {
    if (this.has(key)) {
      this.deleteByValue(value);
      this.add(value);
      return true;
    }
    return false;
  };

  /**
   * @returns an iterator for the map keys
   */
  public keys = (): IterableIterator<KeyValueTypes[]> => {
    const valueKeys = this.valueKeys.values();
    const iterator: IterableIterator<KeyValueTypes[]> = {
      [Symbol.iterator]: () => iterator,
      next: () => {
        const entry = valueKeys.next();
        if (entry.done) {
          return { done: true, value: undefined };
        }

        return {
          done: entry.done,
          value: entry.value,
        };
      },
    };
    return iterator;
  };

  /**
   * @returns an iterator for the map entries
   */
  public entries = (): IterableIterator<[KeyValueTypes[], ObjectType]> => {
    const valueKeys = this.valueKeys.entries();
    const iterator: IterableIterator<[KeyValueTypes[], ObjectType]> = {
      [Symbol.iterator]: () => iterator,
      next: () => {
        const entry = valueKeys.next();
        if (entry.done) {
          return { done: true, value: undefined };
        }

        return {
          done: entry.done,
          value: [entry.value[1], entry.value[0]],
        };
      },
    };
    return iterator;
  };

  /**
   * @returns an iterator for the map values
   */
  public values = (): IterableIterator<ObjectType> => {
    const values = this.valueKeys.keys();
    const iterator: IterableIterator<ObjectType> = {
      [Symbol.iterator]: () => iterator,
      next: () => {
        const entry = values.next();
        if (entry.done) {
          return { done: true, value: undefined };
        }

        return {
          done: entry.done,
          value: entry.value,
        };
      },
    };
    return iterator;
  };

  /**
   * Loops over the map with a callback
   * @param callbackfn
   * @param thisArg
   */
  public forEach = (
    callbackfn: (value: ObjectType, key: KeyValueTypes[], map: this) => void,
    thisArg?: any
  ) => {
    for (const [value, keys] of this.valueKeys) {
      if (typeof thisArg === "undefined" || thisArg === null) {
        callbackfn(value, keys, this);
      } else {
        callbackfn.call(thisArg, value, keys, this);
      }
    }
  };
}
