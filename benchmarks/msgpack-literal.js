const { Benchmark } = require('benchmark');

const urlpack = require('@urlpack/msgpack/lib');
const msgpack5 = require('msgpack5')();
const msgpackLite = require('msgpack-lite');

new Benchmark.Suite()
.add('encode misc - urlpack', () => {
  urlpack.encode(0);
  urlpack.encode(null);
  urlpack.encode(true);
  urlpack.encode(false);
})
.add('encode misc - msgpack5', () => {
  msgpack5.encode(0);
  msgpack5.encode(null);
  msgpack5.encode(true);
  msgpack5.encode(false);
})
.add('encode misc - msgpack-lite', () => {
  msgpackLite.encode(0);
  msgpackLite.encode(null);
  msgpackLite.encode(true);
  msgpackLite.encode(false);
})
.add('encode positive int - urlpack', () => {
  urlpack.encode(1);
  urlpack.encode(256);
  urlpack.encode(65536);
  urlpack.encode(4294967296);
  urlpack.encode(9007199254740991);
})
.add('encode positive int - msgpack5', () => {
  msgpack5.encode(1);
  msgpack5.encode(256);
  msgpack5.encode(65536);
  msgpack5.encode(4294967296);
  msgpack5.encode(9007199254740991);
})
.add('encode positive int - msgpack-lite', () => {
  msgpackLite.encode(1);
  msgpackLite.encode(256);
  msgpackLite.encode(65536);
  msgpackLite.encode(4294967296);
  msgpackLite.encode(9007199254740991);
})
.add('encode negative int - urlpack', () => {
  urlpack.encode(-1);
  urlpack.encode(-256);
  urlpack.encode(-65536);
  urlpack.encode(-4294967296);
  urlpack.encode(-9007199254740991);
})
.add('encode negative int - msgpack5', () => {
  msgpack5.encode(-1);
  msgpack5.encode(-256);
  msgpack5.encode(-65536);
  msgpack5.encode(-4294967296);
  msgpack5.encode(-9007199254740991);
})
.add('encode negative int - msgpack-lite', () => {
  msgpackLite.encode(-1);
  msgpackLite.encode(-256);
  msgpackLite.encode(-65536);
  msgpackLite.encode(-4294967296);
  msgpackLite.encode(-9007199254740991);
})
.add('encode float - urlpack', () => {
  urlpack.encode(0.5);
  urlpack.encode(1.2);
  urlpack.encode(1.337);
})
.add('encode float - msgpack5', () => {
  msgpack5.encode(0.5);
  msgpack5.encode(1.2);
  msgpack5.encode(1.337);
})
.add('encode float - msgpack-lite', () => {
  msgpackLite.encode(0.5);
  msgpackLite.encode(1.2);
  msgpackLite.encode(1.337);
})
.add('encode str - urlpack', () => {
  urlpack.encode('Hello World!');
  urlpack.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
})
.add('encode str - msgpack5', () => {
  msgpack5.encode('Hello World!');
  msgpack5.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
})
.add('encode str - msgpack-lite', () => {
  msgpackLite.encode('Hello World!');
  msgpackLite.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
})
.add('encode bin - urlpack', () => {
  const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
  urlpack.encode(bin8);
})
.add('encode bin - msgpack5', () => {
  const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
  msgpack5.encode(bin8);
})
.add('encode bin - msgpack-lite', () => {
  const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
  msgpackLite.encode(bin8);
})
.add('encode fixarray - urlpack', () => {
  urlpack.encode([null, null, null, null, null]);
})
.add('encode fixarray - msgpack5', () => {
  msgpack5.encode([null, null, null, null, null]);
})
.add('encode fixarray - msgpack-lite', () => {
  msgpackLite.encode([null, null, null, null, null]);
})
.add('encode array 8 - urlpack', () => {
  const arr = Array(2**8 - 1).fill(null);
  urlpack.encode(arr);
})
.add('encode array 8 - msgpack5', () => {
  const arr = Array(2**8 - 1).fill(null);
  msgpack5.encode(arr);
})
.add('encode array 8 - msgpack-lite', () => {
  const arr = Array(2**8 - 1).fill(null);
  msgpackLite.encode(arr);
})
.add('encode array 16 - urlpack', () => {
  const arr = Array(2**16 - 1).fill(null);
  urlpack.encode(arr);
})
.add('encode array 16 - msgpack5', () => {
  const arr = Array(2**16 - 1).fill(null);
  msgpack5.encode(arr);
})
.add('encode array 16 - msgpack-lite', () => {
  const arr = Array(2**16 - 1).fill(null);
  msgpackLite.encode(arr);
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
