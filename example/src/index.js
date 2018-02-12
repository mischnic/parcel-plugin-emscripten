import Module from './test.c';

const add = Module.cwrap("add", "number", ["number","number"])
const root = Module.cwrap("root", "number", ["number"])
const test = Module.cwrap("test", "string", ["number"])
const print = Module.cwrap("print", null, ["number"])


Module.ready.then(()=>{
	// console.log(Module._add(10,20));
	// console.log(add(10,20));
	// console.log(test(true))
	// console.log(Module.ccall("test", "string", ["number"], [false]))
	// console.log(Module._libtest())

	document.getElementById("content").innerHTML = 
	`<pre><code>`+
		`Direct calling: add(30,20)  = ${Module._add(30,20)}\n`+
		`Float:          root(120)   = ${root(120)}\n`+
		`String:         test(true)  = ${test(true)}\n`+
		`String:         test(false) = ${test(false)}\n`+
		`Libtest:        libtest()   = ${Module._libtest()}\n`+
		`printf(100) in C            = ${print(100) || "(look at console)"}\n`;
	`</code></pre>`;

});
