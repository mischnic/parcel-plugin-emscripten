const path = require('path');
const readline = require('readline');
const url = require('url');
const commandExists = require('command-exists');
const { Asset } = require('parcel-bundler');

const childProcess = require('child_process');
const exec = promisify(childProcess.execFile);
const _fs = require('fs');
const fs = {
	copyFile: promisify(_fs.copyFile),
	readFile: promisify(_fs.readFile)
};
const mkdirp = promisify(require('mkdirp'));


function promisify(fn) {
  return function(...args) {
    return new Promise(function(resolve, reject) {
      fn(...args, function(err, ...res) {
        if (err) return reject(err);

        if (res.length === 1) return resolve(res[0]);

        resolve(res);
      });
    });
  };
};


function readLine(file){
	return new Promise((res, rej)=>{
		try{
			const lineReader = readline.createInterface({
				input: _fs.createReadStream(file),
			});

			let lineCounter = 0;
			const lines = [];
			lineReader.on('line', function (line) {
				if(lineCounter++ >= 1){
					lineReader.close();
					return;
				}
				res(line);
				// lines.push(line);
			});
			// lineReader.on('close', function() {
				// res(Array.from(lines))
			// });
		} catch(err){
			rej(err);
		}
	})
}


let installed = false;

const headerRegex = /^\s*#include\s+"(.+)"/;
const cRegex = /\.c(?:pp)?$/;

class CAsset extends Asset {
	constructor(name, pkg, options) {
		super(name, pkg, options);
		this.type = 'js'

		this.outPath = path.join(this.options.cacheDir, this.generateBundleName());
	}

	async pretransform(){
		const firstLine = await readLine(this.name);
		this.cFiles = [];

		const p = path.dirname(this.name)
		if(firstLine.indexOf("//parcel: ") == 0){
			this.args = firstLine.substr(10).split(" ");
			
			for(let i = this.args.length - 1; i >= 0; i--){
				if(cRegex.test(this.args[i])){
					this.cFiles.push(this.args[i]);
				}
			}
		}
	}

	process() {
		if (this.options.isWarmUp) {
			return;
		}

		return super.process();
	}

	collectDependencies() {
		const folder = path.dirname(this.name);
		const getAbs = (v) => path.join(folder, v);

		this.contents.split("\n")
					 .map((l)=>l.match(headerRegex))
					 .filter((v)=> v && v[1])
					 .map((v)=> this.addDependency("./"+v[1], {includedInParent: true, name: getAbs(v[1])}));

		for(let i = this.cFiles.length - 1; i >= 0; i--){
			this.addDependency("./"+this.cFiles[i], {includedInParent: true, name: getAbs(this.cFiles[i])});
		}

	}

	async parse() {
		const name = this.generateBundleName();

		await this.checkEmscripten();

		await mkdirp(this.options.cacheDir);
		
		let args = [
			// '-Os',
			'-s', "WASM=1",
			// '-s', 'ASSERTIONS=1',
			'-s', 'EXTRA_EXPORTED_RUNTIME_METHODS=["ccall", "cwrap"]',
			this.name,
			'-o',
			this.outPath
		];

		if(this.options.minify){
			args.push("-Os");
		}

		if(this.args){
			args = args.concat(this.args)
		}

		await exec('emcc', args, {cwd: path.dirname(this.name)});

		if(args.includes("WASM=1")){
			await fs.copyFile(
				path.join(this.options.cacheDir, name).slice(0,-3)+".wasm",
				path.join(this.options.outDir, name).slice(0,-3)+".wasm"
			)
		}
	}

	async checkEmscripten() {
		if(installed) return;
		try {
			await commandExists('emcc');
		} catch (e) {
			throw new Error(
				"Emscripten isn't installed!"
			);
		}
		installed = true;
	}

	async generate() {
		const name = this.generateBundleName().slice(0,-3);
		const publicURL = this.options.publicURL.replace(/\/+$/, "");

		return {
			js: (await fs.readFile(this.outPath, "utf8"))
					.replace(new RegExp(name, "g"), publicURL+"/"+name)
					+ ";Module.ready = new Promise(res => { Module['onRuntimeInitialized'] = () => res(Module) });"
					+ "module.exports = Module;"
		};
	}
}

module.exports = CAsset;
