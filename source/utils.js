"use strict";

var utils = {};

module.exports = utils;

utils.runIfFunc = function ( arg )
{
    return angular.isFunction( arg ) ? arg() : arg;
};
