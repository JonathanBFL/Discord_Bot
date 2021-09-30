//function to delete caches
function requireUncached(module) {

    delete require.cache[require.resolve(module)];

    return require(module);

}

module.exports = { requireUncached }