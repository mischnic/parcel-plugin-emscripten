#include <emscripten.h>
#include <math.h>


int EMSCRIPTEN_KEEPALIVE subtract(int x, int y) {
	return x - y;
}
