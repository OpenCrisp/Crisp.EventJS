"use strict;"

require("crisp-base");
require("crisp-create");

require("../dist/<%= grunt.pkg.name %>");

module.exports = require("<%= testfile %>");
