# Parcel plugin for Emscripten

A [Parcel](https://parceljs.org/) plugin to enable importing a C file inside a JS file.

Minimal example:

```js
import Module from './test.c';

Module.ready.then(()=>{
    console.log(Module._add(10,20));
});
```

```c
//test.c
#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE add(int x, int y) {
    return x + y;
}
```

For more complex examples, see the [examples](examples) directory.

To pass additional arguments to `emcc` (change optimization, link another C file or a library, ...), specify them in the first line of your main C file: (this would disable optimizations and compile and link `lib.c` as well)

```c
//parcel: -O0 lib.c
```
