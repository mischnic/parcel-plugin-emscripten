import Module from './test.c';

module.exports = Module.ready.then(()=>{
	return Module._add(7,10);
});