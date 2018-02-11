import Module from './minimal.c';

module.exports = Module.ready.then(()=>{
	return Module._add(7,10);
});
