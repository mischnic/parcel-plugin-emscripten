#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE add(int a, int b){
	return a + b;
}
