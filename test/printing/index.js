import Module from './test.c';
const Instance = Module();

let result = "";
function myPrint(a,b,c){
	result += arguments[0];
}

// Workaround for https://github.com/kripken/emscripten/issues/5820
module.exports = new Promise(res =>
	Instance.then(()=>{
		Instance['print'] = myPrint;
		Instance._printout(37);
		res(result);
	}));
