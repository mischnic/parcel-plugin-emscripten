#include <emscripten.h>
#include <iostream>
#include <vector>

extern "C" {

void EMSCRIPTEN_KEEPALIVE test(int a, int b){
	std::vector<int> v;

	v.push_back(a);
	v.push_back(b);
	v.push_back(25);
	v.push_back(13);

	for(int n : v) {
		std::cout << n << ',';
	}
	std::cout << std::endl;
}

}
