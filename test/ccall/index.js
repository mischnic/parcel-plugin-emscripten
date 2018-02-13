import Module from './test.c';
const Instance = Module();

// Workaround for https://github.com/kripken/emscripten/issues/5820
module.exports = new Promise(res => 
	Instance.then(()=>{
		const func = Instance.cwrap("test", "string", ["number"]);

		res([func(true), func(false),
			Instance.ccall("test", "string", ["number"], [true]),
			Instance.ccall("test", "string", ["number"], [false])]);
	}));
