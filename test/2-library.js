const path = require('path');
const fs = require('fs');
const assert = require('assert');
const commandExists = require('command-exists');
const {bundle, run} = require('./utils')

const CAsset = require("../CAsset")


if (!commandExists.sync('emcc')) {
	console.log(
		'Emscripten needs to be installed!'
	);
	return;
}


describe('Library bundling', function() {
	this.timeout(60000);

	it('bundling works', async function(){
		this.b = await bundle(__dirname + '/library/index.js');
	});
	
	it('index.js bundle exists', function() {
		assert(fs.existsSync(this.b.name))
	});

	it('wasm file exists', function(){
		const p = path.basename(
					Array.from(this.b.assets)
						 .find((v)=>v instanceof CAsset)
						 .outPath, '.js'
				  );


		assert(fs.existsSync(__dirname + `/.dist/${p}.wasm`));
	});

	// it('files added as dependencies', function(){

	// 	console.log(Array.from(this.b.assets).find((v)=>v instanceof CAsset))
	// 	// console.log(Array.from(this.b.assets).find((v)=>v instanceof CAsset).dependencies)

	// });


	it('Calling library function', async function() {
		const result = await run(this.b);
		assert.equal(result, 120);
	});

});
