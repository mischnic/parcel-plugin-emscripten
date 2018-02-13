#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE printout(int a){
	printf("test: %d\n", a);
}
