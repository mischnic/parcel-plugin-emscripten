const path = require('path');
const fs = require('fs');
const assert = require('assert');
const commandExists = require('command-exists');
const {bundle, run} = require('./utils')

const CAsset = require("../CAsset")


describe('Basic Tests', function() {
	if (!commandExists.sync('emcc')) {
		console.log(
			'Emscripten needs to be installed!'
		);
		return;
	}

	this.timeout(60000);

	it('throw when Emscripten not installed', async function(){
		this.timeout(60000);
		const oldPATH = process.env.PATH;
		process.env.PATH = "/usr/bin:/usr/sbin:/bin:/sbin";

		try{
			await bundle(__dirname + '/minimal/index.js')		
		} catch(e){
			assert.equal(e.message, "Emscripten isn't installed!");
		} finally{
			process.env.PATH = oldPATH;		
		}

	});

	it('bundling works', async function(){
		this.b = await bundle(__dirname + '/minimal/index.js');
	});


	it('index.js bundle exists', function() {
		assert(fs.existsSync(this.b.name));
	});

	it('wasm file exists', function(){
		const p = path.basename(
					Array.from(this.b.assets)
						 .find((v)=>v instanceof CAsset)
						 .outPath, '.js'
				  );

		assert(fs.existsSync(__dirname + `/.dist/${p}.wasm`));	
	});

	it('Non minified code', function(){
		assert(fs.statSync(this.b.name).size > 50000);
	});

	it('Dev: Calling a function directly', async function() {
		const result = await run(this.b);
		assert.equal(result, 17);
	});

	it('Minify works', async function() {
		this.bProd = await bundle(__dirname + '/minimal/index.js', {minify: true});

		assert(fs.statSync(this.bProd.name).size < 50000)
	});

	it('Prod: Calling a function directly', async function() {
		const result = await run(this.bProd);
		assert.equal(result, 17);
	});
});

describe("Test ccall and cwrap", async function(){
	this.timeout(60000);
	it('bundling works', async function() {
		this.b = await bundle(__dirname + '/ccall/index.js');
	});
	it('Dev: Test', async function() {
		const result = await run(this.b)
		assert.deepEqual(result, ["yes!", "no!", "yes!", "no!"])
	});

	it('Prod: Test', async function() {
		this.bProd = await bundle(__dirname + '/ccall/index.js', {minify: true});
		
		const result = await run(this.bProd);
		assert.deepEqual(result, ["yes!", "no!", "yes!", "no!"])
	});
});