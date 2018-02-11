#include <emscripten.h>

char* EMSCRIPTEN_KEEPALIVE test(int b){
	if(b){
		return "yes!";
	} else {
		return "no!";
	}
}
