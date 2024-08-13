/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-continue */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
import Block from '../core/Block';

type PlainObject<T = unknown> = {
  [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

export function isEqual(lhs: PlainObject | string, rhs: PlainObject | string) {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }
  if (typeof rhs !== 'string') {
    for (const [key, value] of Object.entries(lhs)) {
      const rightValue = rhs[key];
      if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
        if (isEqual(value as PlainObject, rightValue as PlainObject)) {
          continue;
        }
        return false;
      }

      if (value !== rightValue) {
        return false;
      }
    }
  }
  return true;
}


export function render(query: string, block: Block): void {
  const root = document.querySelector(query);
  if (root) {
    root.innerHTML = '';
    // eslint-disable-next-line new-cap
    root.append(block.getContent() || '');
  }
}


type Indexed<T = unknown> = {
  [key in string]: T;
};

function merge(lhs: Indexed<T>, rhs: Indexed<T>): Indexed<T> {
  // eslint-disable-next-line no-restricted-syntax
  for (const p in rhs) {
    if (!rhs.hasOwnProperty(p)) {
      continue;
    }
    try {
      if (rhs[p].constructor === Object) {
        rhs[p] = merge(lhs[p] as Indexed<T>, rhs[p] as Indexed<T>);
      } else {
        lhs[p] = rhs[p];
      }
    } catch (e) {
      lhs[p] = rhs[p];
    }
  }
  return lhs;
}

export function set(object: unknown, path: string, value: unknown): unknown {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }

  const result = path.split('.').reduceRight<Indexed<T>>((acc, key) => ({
    [key]: acc,
  }), value as Indexed<T>);
  return merge(object as Indexed<T>, result);
}

export function cloneDeep(obj: unknown): unknown {
  return (function cloneDeepF(item: unknown): unknown {
    // Handle:
    // * null
    // * undefined
    // * boolean
    // * number
    // * string
    // * symbol
    // * function
    if (item === null || typeof item !== 'object') {
      return item;
    }

    // Handle:
    // * Date
    if (item instanceof Date) {
      return new Date(item.valueOf());
    }

    // Handle:
    // * Array
    if (item instanceof Array) {
      const copy: unknown[] = [];

      item.forEach((_, i) => (copy[i] = cloneDeepF(item[i])));

      return copy;
    }

    // Handle:
    // * Set
    if (item instanceof Set) {
      const copy = new Set();

      item.forEach((v) => copy.add(cloneDeepF(v)));

      return copy;
    }

    // Handle:
    // * Map
    if (item instanceof Map) {
      const copy = new Map();

      item.forEach((v, k) => copy.set(k, cloneDeepF(v)));

      return copy;
    }

    // Handle:
    // * Object
    if (item instanceof Object) {
      const copy: Record<symbol | string, unknown> = {};

      // Handle:
      // * Object.symbol
      Object
        .getOwnPropertySymbols(item as Record<symbol, unknown>)
        .forEach((s: symbol) => (copy[s] = cloneDeepF((item as Record<symbol, unknown>)[s])));

      // Handle:
      // * Object.name (other)
      Object
        .keys(item as Record<string, unknown>)
        .forEach((k: string) => (copy[k] = cloneDeepF((item as Record<string, unknown>)[k])));

      return copy;
    }
    return undefined;
  }(obj));
}

type RecordType = Record<string, unknown>;
export function searchObjInArray<T extends RecordType[]>(array: T, key: string, value: string | number): unknown {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (`${key}` in item && item[key] === value) {
      return cloneDeep(item);
    }
  }
  return undefined;
}
