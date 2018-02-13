import Module from './test.c';
const Instance = Module();

// Workaround for https://github.com/kripken/emscripten/issues/5820
module.exports = new Promise(res => 
	Instance.then(()=>{
		res(Instance._test());
	}));
