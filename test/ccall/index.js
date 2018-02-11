import Module from './test.c';

module.exports = Module.ready.then(()=>{
	const func = Module.cwrap("test", "string", ["number"]);

	return [func(true), func(false),
			Module.ccall("test", "string", ["number"], [true]),
			Module.ccall("test", "string", ["number"], [false])];
});
