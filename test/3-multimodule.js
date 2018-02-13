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

describe('Multiple modules', function() {
	this.timeout(60000);

	it('bundling works', async function(){
		this.b = await bundle(__dirname + '/multimodule/index.js');
	});
	
	it('index.js bundle exists', function() {
		assert(fs.existsSync(this.b.name))
	});

	it('wasm files exist', function(){
		const list = Array.from(this.b.assets)
			 .filter(v => v instanceof CAsset)
			 .map(v => path.basename(v.outPath, ".js"));
			 
		list.forEach(v => assert(fs.existsSync(__dirname + `/.dist/${v}.wasm`)));

		assert.equal(list.length, 2);
	});

	it('Calling functions', async function() {
		const result = await run(this.b);
		assert.deepEqual(result, [17, 5]);
	});

});
