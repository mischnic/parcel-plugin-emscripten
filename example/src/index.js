import Module1 from './test.c';
const Instance1 = Module1();

const add = Instance1.cwrap("add", "number", ["number","number"])
const root = Instance1.cwrap("root", "number", ["number"])
const test = Instance1.cwrap("test", "string", ["number"])
const print = Instance1.cwrap("print", null, ["number"])

Instance1.then(()=>{
	// console.log(Instance1._add(10,20));
	// console.log(add(10,20));
	// console.log(test(true))
	// console.log(Instance1.ccall("test", "string", ["number"], [false]))
	// console.log(Instance1._libtest())

	document.getElementById("content").innerHTML = 
	`<pre><code>`+
		`Direct calling: add(30,20)  = ${Instance1._add(30,20)}\n`+
		`cwrapped:       add(30,20)  = ${add(30,20)}\n`+
		`Float:          root(120)   = ${root(120)}\n`+
		`String:         test(true)  = ${test(true)}\n`+
		`String:         test(false) = ${test(false)}\n`+
		`Libtest:        libtest()   = ${Instance1._libtest()}\n`+
		`printf(100) in C            = ${print(100) || "(look at console)"}\n`;
	`</code></pre>`;

});


import Module2 from './other.c';
const Instance2 = Module2();


Instance2.then(()=>{
	document.getElementById("content").innerHTML +=
	`<pre><code>`+
		`2nd module:  subtract(10,5) = ${Instance2._subtract(10,5)}\n`+
	`</code></pre>`;
})

