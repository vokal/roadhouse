"use strict";

var utils = {};
module.exports = utils;

utils.set = function ( key, val )
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "scope['" + key + "'] = JSON.parse( '" + JSON.stringify( val ) + "' );"
        + "scope.$apply();" );
};

utils.applyScope = function ()
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "scope.$apply();" );
};

utils.closeNgDialog = function ()
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "angular.element( document.body ).injector().get( 'ngDialog' ).close();"
        + "scope.$apply();" );
};
