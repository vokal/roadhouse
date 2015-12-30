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
        expect( $( "#harness .normal .rh-paginator" ).isPresent() ).toBe( false );
    } );

    it( "should be empty absent with 0 or 1 pages", function ()
    {
        utils.set( "pageCount", 0 );
        expect( $( ".normal .rh-paginator" ).isPresent() ).toBe( false );

        utils.set( "pageCount", 1 );
        expect( $( ".normal .rh-paginator" ).isPresent() ).toBe( false );
    } );

    it( "should be present with 2+ pages", function ()
    {
        utils.set( "pageCount", 2 );
        expect( $( ".normal .rh-paginator" ).isPresent() ).toBe( true );
        expect( $$( ".normal .rh-paginator li" ).count() ).toBe( 2 );
    } );

    it( "should have up to 5 pages", function ()
    {
        utils.set( "pageCount", 6 );
        expect( $$( ".normal .rh-paginator li" ).count() ).toBe( 5 );
    } );

    it( "should select page 1 by default", function ()
    {
        expect( $( ".normal .rh-paginator li:nth-child(1).active" ).isPresent() ).toBe( true );
    } );

    it( "should select a new page which is then active", function ()
    {
        expect( $( ".normal .rh-paginator li:nth-child(3).active" ).isPresent() ).toBe( false );
        $( ".normal .rh-paginator li:nth-child(3)" ).click();
        expect( $( ".normal .rh-paginator li:nth-child(1).active" ).isPresent() ).toBe( false );
        expect( $( ".normal .rh-paginator li:nth-child(3).active" ).isPresent() ).toBe( true );
    } );

    it( "should focus page ranges around the selected page", function ()
    {
        expect( $( ".normal .rh-paginator .glyphicon-chevron-left" ).isPresent() ).toBe( false );
        $( ".normal .rh-paginator li:nth-child(5)" ).click();
        expect( $( ".normal .rh-paginator .glyphicon-chevron-left" ).isPresent() ).toBe( true );
    } );

    it( "should handle 404 when selecting a page", function ()
    {
        $( ".p404 .rh-paginator li:nth-child(3)" ).click();
        expect( $( ".alertify-logs" ).getText() ).toBe( "The list is empty" );
        $( ".alertify-logs" ).click();
        browser.sleep( 1000 );
    } );

    it( "should handle 500 when selecting a page", function ()
    {
        $( ".p500 .rh-paginator li:nth-child(3)" ).click();
        expect( $( ".alertify-logs" ).getText() ).toBe( "Oops, there was an issue retrieving the list" );
    } );

} );
