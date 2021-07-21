import type { Input } from './types';

interface Decode {
  (input: Uint8Array): Input;
}

type DecodeProcessResult = [input: Input, readBytes: number];

const decodeArrayItems = (input: Uint8Array, len: number) => {
  let acc = 0;
  let array: Array<Input> = Array(len);
  for (let i = 0; i < len; i++) {
    let [item, readBytes] = _decode(input.slice(acc), acc);
    array[i] = item;
    acc += readBytes;
  }
  return [array, acc] as const;
};

const _decode = (input: Uint8Array, pos = 0): DecodeProcessResult => {
  let acc = 0;
  let header = input[acc++];

  if (header < 0x80) {
    return [header, acc];
  } else if (header < 0x90) {
    return [null, acc];
  } else if (header < 0xa0) {
    let itemLen = header & 15;
    let array: Array<Input> = Array(itemLen);
    for (let i = 0; i < itemLen; i++) {
      let [item, readBytes] = _decode(input.slice(acc), acc);
      array[i] = item;
      acc += readBytes;
    }
    return [array, acc];
  } else if (header < 0xc0) {
    let len = 0x1f & header;
    let str = new TextDecoder().decode(input.slice(acc, acc + len));
    return [str, acc + len];
  } else if (header === 0xc0) {
    return [null, acc];
  } else if (header === 0xc1) {
    return [null, acc];
  } else if (header === 0xc2) {
    return [false, acc];
  } else if (header === 0xc3) {
    return [true, acc];
  } else if (header === 0xc4) {
    let len = input[acc++];
    let bin = input.slice(acc, acc + len);
    return [bin, acc + len];
  } else if (header === 0xc5) {
    let view = new DataView(input.buffer, acc);
    let len = view.getUint16(0, false);
    acc += 2;
    let data = input.slice(acc, acc + len);
    return [data, acc + len];
  } else if (header === 0xc6) {
    let view = new DataView(input.buffer, acc);
    let len = view.getUint32(0, false);
    acc += 4;
    let data = input.slice(acc, acc + len);
    return [data, acc + len];
  } else if (header === 0xc7) {
    return [null, acc];
  } else if (header === 0xc8) {
    return [null, acc];
  } else if (header === 0xc9) {
    return [null, acc];
  } else if (header === 0xca) {
    let view = new DataView(input.buffer, acc);
    let data = view.getFloat32(0, false);
    return [data, acc + 4];
  } else if (header === 0xcb) {
    let view = new DataView(input.buffer, acc);
    let data = view.getFloat64(0, false);
    return [data, acc + 8];
  } else if (header === 0xcc) {
    let data = input[acc++];
    return [data, acc];
  } else if (header === 0xcd) {
    let view = new DataView(input.buffer, acc);
    let data = view.getUint16(0, false);
    return [data, acc + 2];
  } else if (header === 0xce) {
    let view = new DataView(input.buffer, acc);
    let data = view.getUint32(0, false);
    return [data, acc + 4];
  } else if (header === 0xcf) {
    let view = new DataView(input.buffer, acc);
    let hi = view.getUint32(0, false);
    let lo = view.getUint32(4, false);
    let data = (hi * Math.pow(256, 4)) + lo;
    return [data, acc + 8];
  } else if (header === 0xd0) {
    let view = new DataView(input.buffer, acc);
    return [view.getInt8(0), acc + 1];
  } else if (header === 0xd1) {
    let view = new DataView(input.buffer, acc);
    let data = view.getInt16(0, false);
    return [data, acc + 2];
  } else if (header === 0xd2) {
    let view = new DataView(input.buffer, acc);
    let data = view.getInt32(0, false);
    return [data, acc + 4];
  } else if (header === 0xd3) {
    let carry = 1;
    for (let i = 8; i >= 1; i--) {
      const v = (input[i] ^ 0xff) + carry;
      input[i] = v & 0xff;
      carry = v >> 8;
    }
    let view = new DataView(input.buffer, acc);
    let hi = view.getUint32(0, false);
    let lo = view.getUint32(4, false);
    let data = -((hi * Math.pow(256, 4)) + lo);
    return [data, acc + 8];
  } else if (header === 0xd4) {
    return [null, acc];
  } else if (header === 0xd5) {
    return [null, acc];
  } else if (header === 0xd6) {
    return [null, acc];
  } else if (header === 0xd7) {
    return [null, acc];
  } else if (header === 0xd8) {
    return [null, acc];
  } else if (header === 0xd9) {
    let len = input[acc++];
    let data = new TextDecoder().decode(input.slice(acc, acc + len));
    return [data, acc + len];
  } else if (header === 0xda) {
    let view = new DataView(input.buffer, acc);
    let len = view.getUint16(0, false);
    acc += 2;

    let data = new TextDecoder().decode(input.slice(acc, acc + len));
    return [data, acc + len];
  } else if (header === 0xdb) {
    let view = new DataView(input.buffer, acc);
    let len = view.getUint32(0, false);
    acc += 4;

    let data = new TextDecoder().decode(input.slice(acc, acc + len));
    return [data, acc + len];
  } else if (header === 0xdc) {
    let view = new DataView(input.buffer, acc);
    let len = view.getUint16(0, false);
    acc += 2;

    let [array, readBytes] = decodeArrayItems(input.slice(acc, acc + len), len);
    return [array, acc + readBytes];
  } else if (header === 0xdd) {
    return [null, acc];
  } else if (header === 0xde) {
    return [null, acc];
  } else if (header === 0xdf) {
    return [null, acc];
  } else if (header < 0x100) {
    return [~(header ^ 255), acc];
  }

  throw new Error(`Unknown header ${header} at ${pos}`);
};

export const decode: Decode = input => {
  let [data, readBytes] = _decode(input, 0);
  if (readBytes !== input.length) {
    throw new Error(`invalid input length, expected ${input.length}, but got ${readBytes}`);
  }
  return data;
};
