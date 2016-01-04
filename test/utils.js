"use strict";

var utils = {};
module.exports = utils;

utils.set = function ( key, val )
{
    browser.executeScript(
        "var scope = angular.element( document.body ).injector().get( '$rootScope' );"
        + "scope['" + key + "'] = JSON.parse( '" + JSON.stringify( val ).replace( /"/g, "\\\"" ) + "' );"
        + "scope.$apply();" );
    return utils;
};

utils.applyScope = function ()
{
    browser.executeScript(
        "angular.element( document.body ).injector().get( '$rootScope' ).$apply();" );
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

utils.addForm = function ( pauseAfter )
{
    $( "#add-item-btn" ).click();
    if( pauseAfter !== false )
    {
        browser.sleep( 1000 );
    }
    return utils;
};

utils.editForm = function ( pauseAfter )
{
    $$( ".glyphicon-edit" ).get( 0 ).click();
    if( pauseAfter !== false )
    {
        browser.sleep( 1000 );
    }
    return utils;
};

utils.clearOnForm = function ( keys )
{
    keys.forEach( key =>
    {
        element( by.model( "model." + key ) ).clear();
    } );
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
            if( data[ key ] )
            {
                $( ".rh-true" ).click();
            }
            else
            {
                $( ".rh-false" ).click();
            }
        }
    } );
    return utils;
};

utils.selectOnForm = function ( data )
{
    Object.keys( data ).forEach( key =>
    {
        $( ".rh-" + data[ key ] ).click();
    } );
    return utils;
};

utils.selectOptionOnForm = function ( data )
{
    Object.keys( data ).forEach( key =>
    {
        $( "#" + key ).element( by.cssContainingText( "option", data[ key ] ) ).click();
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

utils.cancelForm = function ( pauseAfter )
{
    $( ".ngdialog .initial" ).element( by.buttonText( "Cancel" ) ).click();
    if( pauseAfter !== false )
    {
        browser.sleep( 1000 );
    }
    return utils;
};

utils.deleteForm = function ( pauseAfter )
{
    $( ".ngdialog" ).element( by.buttonText( "Delete" ) ).click();
    $( ".ngdialog" ).element( by.buttonText( "Confirm" ) ).click();
    if( pauseAfter !== false )
    {
        browser.sleep( 1000 );
    }
    return utils;
};

utils.expectNgDialogIsNotPresent = function ()
{
    expect( $( ".ngdialog" ).isPresent() ).toBe( false );
    return utils;
};

utils.expectNgDialogIsPresent = function ()
{
    expect( $( ".ngdialog" ).isPresent() ).toBe( true );
    return utils;
};

utils.expectAddButtonIsNotPresent = function ()
{
    expect( $( "#add-item-btn" ).isPresent() ).toBe( false );
    return utils;
};

utils.expectAddButtonIsPresent = function ()
{
    expect( $( "#add-item-btn" ).isPresent() ).toBe( true );
    return utils;
};
