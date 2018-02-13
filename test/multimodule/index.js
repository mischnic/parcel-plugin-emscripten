import Module1 from './test.c';
const Instance1 = Module1();

import Module2 from './other.c';
const Instance2 = Module2();


function all(promises) {
	return new Promise(function(resolve,reject) {
		var count = promises.length
		var result = []
		var checkDone = function() { if (--count === 0) resolve(result) }
		promises.forEach(function(p, i) {
			p.then(function(x) { result[i] = x }, reject).then(checkDone)
		})
	})
}


module.exports = all([Instance1, Instance2]).then(()=>{
	return [Instance1._add(7,10), Instance2._subtract(10,5)];
});