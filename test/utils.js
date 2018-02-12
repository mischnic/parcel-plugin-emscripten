// Code mainly from parcel-bundler/test/utils.js

const path = require('path');
const vm = require('vm');
const fs = require('fs');
const WebSocket = require('ws');

const Bundler = require('parcel-bundler');

const plugin = require('../')

const outDir = ".dist";

function bundler(file, opts) {
	const b = new Bundler(
		file,
		Object.assign(
			{
				outDir: path.join(__dirname, outDir),
				cacheDir: path.join(__dirname, '.cache'),
				publicURL: "/",
				watch: false,
				cache: false,
				hmr: false,
				logLevel: 0
			},
			opts
		)
	);

	plugin(b);
	
	return b;
}

function bundle(file, opts) {
	return bundler(file, opts).bundle();
}

function prepareBrowserContext(bundle, globals) {
	// for testing dynamic imports
	const fakeDocument = {
		createElement(tag) {
			return {tag};
		},

		getElementsByTagName() {
			return [
				{
					appendChild(el) {
						setTimeout(function() {
							if (el.tag === 'script') {
								vm.runInContext(
									fs.readFileSync(path.join(__dirname, outDir, el.src)),
									ctx
								);
							}

							el.onload();
						}, 0);
					}
				}
			];
		}
	};

	var ctx = Object.assign(
		{
			document: fakeDocument,
			WebSocket,
			console,
			location: {hostname: 'localhost'},
			fetch(url) {
				return Promise.resolve({
					ok: true,
					arrayBuffer() {
						return Promise.resolve(
							new Uint8Array(fs.readFileSync(path.join(__dirname, outDir, url)))
								.buffer
						);
					}
				});
			}
		},
		globals
	);

	ctx.window = ctx;

	return ctx;
}

function prepareNodeContext(bundle, globals) {
	var mod = new Module(bundle.name);
	mod.paths = [path.dirname(bundle.name) + '/node_modules'];

	return Object.assign(
		{
			module: mod,
			__filename: bundle.name,
			__dirname: path.dirname(bundle.name),
			require: function(path) {
				return mod.require(path);
			},
			process: process
		},
		globals
	);
}

function run(bundle, globals, opts = {}) {
	var ctx;
	switch (bundle.entryAsset.options.target) {
		case 'node':
			ctx = prepareNodeContext(bundle, globals);
			break;
		case 'electron':
			ctx = Object.assign(
				prepareBrowserContext(bundle, globals),
				prepareNodeContext(bundle, globals)
			);
			break;
		default:
			ctx = prepareBrowserContext(bundle, globals);
			break;
	}

	vm.createContext(ctx);
	vm.runInContext(fs.readFileSync(bundle.name), ctx);

	if (opts.require !== false) {
		return ctx.require(bundle.entryAsset.id);
	}

	return ctx;
}

exports.bundler = bundler;
exports.bundle = bundle;
exports.run = run;
