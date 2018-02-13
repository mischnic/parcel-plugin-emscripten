# Parcel plugin for Emscripten

[![Build Status](https://travis-ci.org/mischnic/parcel-plugin-emscripten.svg?branch=master)](https://travis-ci.org/mischnic/parcel-plugin-emscripten)

A [Parcel](https://parceljs.org/) plugin to enable importing a C(++) file inside a JS file.

Emscripten has to be installed and `emcc` needs to be in `PATH`.

Example:

```js
import Module from './test.c';
const Instance = Module();

Instance.then(()=>{
    console.log(Instance._add(10,20));
});

// equivalent to

Instance.then((v)=>{
    console.log(v._add(10,20));
});
```

```c
//test.c
#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE add(int x, int y) {
    return x + y;
}
```

For more complex examples, see the [example](example/src) directory.

**`Instance.then` is quite fragile and not a thenable, see [https://github.com/kripken/emscripten/issues/5820](https://github.com/kripken/emscripten/issues/5820)**

Using multiple Modules (= importing multiple C files) is supported, but it isn't very filesize efficient. Consider writing a single C-wrapper and importing that instead!


To pass additional arguments to `emcc` (change optimization, link another C file or a library, ...), specify them in the first line of your main C file: (this would disable optimizations and compile and link `lib.c` as well)

```c
//parcel: -O0 lib.c
#include ...
```
