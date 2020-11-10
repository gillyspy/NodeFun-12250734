const path = require('path');

module.exports = path.dirname( require.main.filename ); 
// ref: https://nodejs.org/api/modules.html#modules_accessing_the_main_module
