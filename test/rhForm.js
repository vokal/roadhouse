"use strict";

var utils = require( "./utils" );

describe( "Roadhouse Form", function ()
{
    it( "should render when there is a definition", function ()
    {
        browser.get( "/" );

        expect( $( "#a" ).isPresent() ).toBe( true );
    } );

    it( "should not render when there is not a definition", function ()
    {
        utils.set( "formDefinition", "not an object" );
        expect( $( "#a" ).isPresent() ).toBe( false );
    } );

} );
