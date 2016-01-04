"use strict";

var utils = require( "./utils" );

describe( "Roadhouse Field", function ()
{
    it( "should have correct default type and pattern attributes", function ()
    {
        browser.get( "/" );

        expect( $( ".field input" ).getAttribute( "type" ) ).toBe( "text" );
        expect( $( ".field input" ).getAttribute( "pattern" ) ).toBe( "" );
    } );

    it( "should have correct email attributes", function ()
    {
        utils.set( "fieldDefinition", { type: "email" } );
        expect( $( ".field input" ).getAttribute( "type" ) ).toBe( "email" );
        expect( $( ".field input" ).getAttribute( "pattern" ) ).toBe( "^.+@.+\\..{2,}$" );
    } );

    it( "should have correct url attributes", function ()
    {
        utils.set( "fieldDefinition", { type: "url" } );
        expect( $( ".field input" ).getAttribute( "type" ) ).toBe( "url" );
        expect( $( ".field input" ).getAttribute( "pattern" ) ).toBe( "^.+://.+\\..{2,}$" );
    } );

    it( "should have correct tel attributes", function ()
    {
        utils.set( "fieldDefinition", { type: "tel" } );
        expect( $( ".field input" ).getAttribute( "type" ) ).toBe( "tel" );
        expect( $( ".field input" ).getAttribute( "pattern" ) ).toBe( ".*\\d.*\\d.*\\d.*\\d.*\\d.*\\d.*\\d.*\\d.*" );
    } );

    it( "should have correct custom pattern attributes", function ()
    {
        utils.set( "fieldDefinition", { type: "text", pattern: ".*" } );
        expect( $( ".field input" ).getAttribute( "type" ) ).toBe( "text" );
        expect( $( ".field input" ).getAttribute( "pattern" ) ).toBe( ".*" );
    } );

    it( "should have correct fieldAttrs attributes", function ()
    {
        utils.set( "fieldDefinition", { type: "text", fieldAttrs: { "data-thing": "hello" } } );
        expect( $( ".field input" ).getAttribute( "data-thing" ) ).toBe( "hello" );
    } );

    it( "should not render if initial and not canEdit", function ()
    {
        utils.set( "fieldDefinition", { type: "text", canEdit: false } );
        utils.set( "fieldInitial", true );
        expect( $( ".field input" ).isPresent() ).toBe( false );
    } );

    it( "should accept a default", function ()
    {
        utils.set( "fieldDefinition", { type: "text", "default": "hello" } );
        expect( $( ".field input" ).getAttribute( "value" ) ).toBe( "hello" );
    } );

    it( "should accept a fieldDirective", function ()
    {
        utils.set( "fieldDefinition", { fieldDirective: 'data-whatever="yes"' } );
        expect( $( ".field input" ).isPresent() ).toBe( false );
        expect( $( ".field .input-group div" ).getAttribute( "data-whatever" ) ).toBe( "yes" );
    } );

    it( "should render a Select input", function ()
    {
        utils.set( "fieldDefinition", { type: "select",
            options: [ { name: "1", value: true }, { name: "2", value: false } ] } );
        expect( $( ".field input" ).isPresent() ).toBe( false );
        element( by.cssContainingText( ".field select option", "1" ) ).click();
    } );


} );
