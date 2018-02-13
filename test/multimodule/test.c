//parcel: lib.c
#include <emscripten.h>
#include <math.h>
#include <stdio.h>
#include "lib.h"


int EMSCRIPTEN_KEEPALIVE add(int x, int y) {
	return x + y;
}

float EMSCRIPTEN_KEEPALIVE root(int x) {
	return sqrt(x);
}

char* EMSCRIPTEN_KEEPALIVE test(char b) {
	if(b){
		return "hello";
	} else {
		return "go away!";
	}
}

void EMSCRIPTEN_KEEPALIVE print(int i) {
	printf("this was printed from C: i=%d\n", i);
}

int EMSCRIPTEN_KEEPALIVE libtest() {
	return generate();
}
