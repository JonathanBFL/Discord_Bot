//function to delete caches
function requireUncached(module) {

    try {

        delete require.cache[require.resolve(module)];

        return require(module);

    }

    catch(err) {

        console.log('!!!!! error occured in requireuncached.js !!!!!');

    }

}

module.exports = { requireUncached }