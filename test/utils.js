"use strict";

var utils = {};
module.exports = utils;

utils.set = function ( key, val )
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "scope['" + key + "'] = JSON.parse( '" + JSON.stringify( val ) + "' );"
        + "scope.$apply();" );
    return utils;
};

utils.applyScope = function ()
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "scope.$apply();" );
    return utils;
};

utils.closeNgDialog = function ()
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "angular.element( document.body ).injector().get( 'ngDialog' ).close();"
        + "scope.$apply();" );
    return utils;
};

utils.addForm = function ()
{
    $( "#add-item-btn" ).click();
    return utils;
};

utils.editForm = function ()
{
    $$( ".glyphicon-edit" ).get( 0 ).click();
    return utils;
};

utils.sendToForm = function ( data )
{
    Object.keys( data ).forEach( key =>
    {
        if( typeof( data[ key ] ) === "string" )
        {
            element( by.model( "model." + key ) ).sendKeys( data[ key ] );
        }
        else if( typeof( data[ key ] ) === "boolean" )
        {
            element( by.model( "model." + key ) ).click();
        }
    } );
    return utils;
};

utils.saveForm = function ( pauseAfter )
{
    $( ".ngdialog .btn-primary" ).click();
    if( pauseAfter !== false )
    {
        browser.sleep( 1000 );
    }
    return utils;
};

utils.deleteForm = function ( pauseAfter )
{
    $( ".ngdialog" ).element( by.buttonText( "Delete" ) ).click();
    $( ".ngdialog" ).element( by.buttonText( "Yes, Delete" ) ).click();
    if( pauseAfter !== false )
    {
        browser.sleep( 1000 );
    }
    return utils;
};

utils.expectNgDialogIsHidden = function ()
{
    expect( $$( ".ngdialog" ).count() ).toBe( 0 );
    return utils;
};

utils.expectNgDialogIsVisible = function ()
{
    expect( $$( ".ngdialog" ).count() ).toBe( 1 );
    return utils;
};
