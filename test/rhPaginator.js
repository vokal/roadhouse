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
        expect( $$( ".normal .rh-paginator li" ).get( 0 ).getAttribute( "class" ) ).toContain( "active" );
    } );

    it( "should select a new page which is then active", function ()
    {
        expect( $$( ".normal .rh-paginator li" ).get( 2 ).getAttribute( "class" ) ).not.toContain( "active" );
        $$( ".normal .rh-paginator li a" ).get( 2 ).click();
        expect( $$( ".normal .rh-paginator li" ).get( 0 ).getAttribute( "class" ) ).not.toContain( "active" );
        expect( $$( ".normal .rh-paginator li" ).get( 2 ).getAttribute( "class" ) ).toContain( "active" );
    } );

    it( "should focus page ranges around the selected page", function ()
    {
        expect( $( ".normal .rh-paginator .glyphicon-chevron-left" ).isPresent() ).toBe( false );
        $$( ".normal .rh-paginator li a" ).get( 4 ).click();
        expect( $( ".normal .rh-paginator .glyphicon-chevron-left" ).isPresent() ).toBe( true );
    } );

    it( "should handle 404 when selecting a page", function ()
    {
        $$( ".p404 .rh-paginator li a" ).get( 2 ).click();
        browser.sleep( 100 );
        expect( $( ".alertify-logs" ).getText() ).toBe( "The list is empty" );
        $( ".alertify-logs div" ).click();
        browser.sleep( 1200 );
    } );

    it( "should handle 500 when selecting a page", function ()
    {
        $$( ".p500 .rh-paginator li a" ).get( 2 ).click();
        browser.sleep( 100 );
        expect( $( ".alertify-logs" ).getText() ).toBe( "Oops, there was an issue retrieving the list" );
        $( ".alertify-logs div" ).click();
        browser.sleep( 1200 );
    } );

} );
