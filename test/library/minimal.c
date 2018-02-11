//parcel: lib.c
#include <emscripten.h>
#include "lib.h"

int EMSCRIPTEN_KEEPALIVE test(){
	return generate();
}
