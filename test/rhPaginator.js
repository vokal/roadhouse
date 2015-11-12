"use strict";

var utils = require( "./utils" );

describe( "Roadhouse Paginator", function ()
{
    it( "should load", function ()
    {
        browser.get( "/" );
    } );

    it( "should be empty absent initially", function ()
    {
        expect( $( "#harness" ).isPresent() ).toBe( true );
        expect( $( "#harness .rh-paginator" ).isPresent() ).toBe( false );
    } );

    it( "should be empty absent with 0 or 1 pages", function ()
    {
        utils.set( "pageCount", 0 );
        expect( $( ".rh-paginator" ).isPresent() ).toBe( false );

        utils.set( "pageCount", 1 );
        expect( $( ".rh-paginator" ).isPresent() ).toBe( false );
    } );

    it( "should be present with 2+ pages", function ()
    {
        utils.set( "pageCount", 2 );
        expect( $( ".rh-paginator" ).isPresent() ).toBe( true );
        expect( $$( ".rh-paginator li" ).count() ).toBe( 2 );
    } );

    it( "should have up to 5 pages", function ()
    {
        utils.set( "pageCount", 6 );
        expect( $$( ".rh-paginator li" ).count() ).toBe( 5 );
    } );

    it( "should select page 1 by default", function ()
    {
        expect( $( ".rh-paginator li:nth-child(1).active" ).isPresent() ).toBe( true );
    } );

    it( "should select a new page which is then active", function ()
    {
        expect( $( ".rh-paginator li:nth-child(3).active" ).isPresent() ).toBe( false );
        $( ".rh-paginator li:nth-child(3)" ).click();
        expect( $( ".rh-paginator li:nth-child(1).active" ).isPresent() ).toBe( false );
        expect( $( ".rh-paginator li:nth-child(3).active" ).isPresent() ).toBe( true );
    } );

} );
