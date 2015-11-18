"use strict";

var utils = require( "./utils" );

describe( "Roadhouse Valid", function ()
{
    it( "should NOT be valid when validate returns false", function ()
    {
        browser.get( "/" );

        expect( $( "#a" ).isPresent() ).toBe( true );
        expect( $( "#a.ng-valid" ).isPresent() ).toBe( false );
    } );

    it( "should be valid when validate returns true", function ()
    {
        expect( $( "#b.ng-valid" ).isPresent() ).toBe( true );
    } );

    it( "should be valid only when sameAsModel is true", function ()
    {
        expect( $( "#d.ng-valid" ).isPresent() ).toBe( true );

        $( "#c" ).sendKeys( "1" );
        $( "#d" ).sendKeys( "a" );
        expect( $( "#d.ng-valid" ).isPresent() ).toBe( false );

        $( "#d" ).clear().sendKeys( "1" );
        expect( $( "#d.ng-valid" ).isPresent() ).toBe( true );
    } );

} );
