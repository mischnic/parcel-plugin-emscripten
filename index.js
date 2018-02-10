module.exports = function (bundler) {
	bundler.addAssetType('c', require.resolve('./CAsset'));
	bundler.addAssetType('cpp', require.resolve('./CAsset'));
};
