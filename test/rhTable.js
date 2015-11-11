"use strict";

var utils = require( "./utils" );

describe( "Roadhouse Table", function ()
{
    it( "should load", function ()
    {
        browser.get( "/" );
    } );

    it( "should be empty without a definition", function ()
    {
        expect( $( "#harness" ).isPresent() ).toBe( true );
        expect( $( "#harness .rh-table" ).isPresent() ).toBe( false );
    } );

    it( "should have no rows without a list", function ()
    {
        utils.set( "definition", { meta: {}, id: {}, name: {} } );

        expect( $$( ".rh-table thead tr" ).count() ).toBe( 1 ); // 1 header rows
        expect( $$( ".rh-table tbody tr" ).count() ).toBe( 0 ); // 0 body rows
    } );

    it( "should have defaults with data", function ()
    {
        utils.set( "list", [ { name: "one", id: 1 }, { name: "two", id: 2 } ] );

        expect( $$( ".rh-table thead th" ).count() ).toBe( 3 ); // 3 columns
        expect( $$( ".rh-table thead tr" ).count() ).toBe( 1 ); // 1 header row
        expect( $$( ".rh-table tbody tr" ).count() ).toBe( 2 ); // 2 body rows
        expect( $$( ".rh-table tbody tr:first-child .glyphicon-edit" ).count() ).toBe( 1 ); // edit button
        expect( $$( ".table-controls" ).count() ).toBe( 1 ); // add button visible
    } );

    it( "should have non-view columns", function ()
    {
        utils.set( "definition", { meta: {}, id: { canViewList: false }, name: {} } );

        expect( $$( ".rh-table thead th" ).count() ).toBe( 2 ); // 2 columns
    } );

    it( "should be able to open Add an item", function ()
    {
        utils
            .expectNgDialogIsHidden()
            .addForm()
            .expectNgDialogIsVisible();
    } );

    it( "should cancel adding an item", function ()
    {
        $( ".ngdialog .initial" ).element( by.buttonText( "Cancel" ) ).click();
        browser.sleep( 1000 );
        utils.expectNgDialogIsHidden();
    } );

    it( "should save a new item", function ()
    {
        utils.addForm();
        $( ".ngdialog .initial" ).element( by.buttonText( "Save" ) ).click();
        browser.sleep( 1000 );
        utils.expectNgDialogIsHidden();
        expect( $$( ".rh-table tbody tr" ).count() ).toBe( 3 ); // 3 body rows
    } );

    it( "should edit an item", function ()
    {
        expect( $$( ".rh-table tbody tr.updated" ).count() ).toBe( 1 ); // 1 updated rows
        expect( $( ".rh-table tbody tr:first-child td:first-child" ).getText() ).toBe( "one" );

        $$( ".rh-table tbody tr .glyphicon-edit" ).get( 0 ).click();
        $( ".ngdialog" ).element( by.model( "model.name" ) ).sendKeys( "-edited" );
        $( ".ngdialog" ).element( by.buttonText( "Save" ) ).click();
        browser.sleep( 1000 );

        expect( $( ".rh-table tbody tr:first-child td:first-child" ).getText() ).toBe( "one-edited" );
        utils.expectNgDialogIsHidden();
        expect( $$( ".rh-table tbody tr.updated" ).count() ).toBe( 2 ); // 2 updated rows
    } );

    it( "should delete an item", function ()
    {
        expect( $$( ".rh-table tbody tr.deleted" ).count() ).toBe( 0 ); // no deleted rows
        expect( $( ".ngdialog .delete-confirm" ).isPresent() ).toBe( false );

        $$( ".rh-table tbody tr .glyphicon-edit" ).get( 2 ).click();
        $( ".ngdialog .initial" ).element( by.buttonText( "Delete" ) ).click();
        $( ".ngdialog .delete-confirm" ).element( by.buttonText( "Yes, Delete" ) ).click();
        browser.sleep( 1000 );

        utils.expectNgDialogIsHidden();
        expect( $$( ".rh-table tbody tr.deleted" ).count() ).toBe( 1 ); // 1 deleted row
    } );

    it( "should have no add button when canCreate is false", function ()
    {
        expect( $( "#add-item-btn" ).isPresent() ).toBe( true );

        utils.set( "definition", { meta: { canCreate: false }, id: {}, name: {} } );
        expect( $( "#add-item-btn" ).isPresent() ).toBe( false );
    } );

    it( "should have an add button based on max items", function ()
    {
        expect( $( "#add-item-btn" ).isPresent() ).toBe( false );

        utils.set( "definition", { meta: { canCreate: { max: 10 } }, id: {}, name: {} } );
        expect( $( "#add-item-btn" ).isPresent() ).toBe( true );

        utils.set( "definition", { meta: { canCreate: { max: 1 } }, id: {}, name: {} } );
        expect( $( "#add-item-btn" ).isPresent() ).toBe( false );
    } );

    it( "should draw checkbox columns", function ()
    {
        expect( $$( ".rh-table .glyphicon-unchecked" ).count() ).toBe( 0 );
        utils.set( "definition", { meta: {}, id: {}, checkbox: { type: "checkbox" } } );
        expect( $$( ".rh-table .glyphicon-unchecked" ).count() ).toBe( 3 );
    } );

    it( "should draw date columns", function ()
    {
        utils.set( "list", [ { date: "2015-09-22", id: 1 } ] );
        utils.set( "definition", { meta: {}, id: { canView: false }, date: { type: "date" } } );
        expect( $( ".rh-table tbody td:first-child" ).getText() ).toBe( "Sep 22, 2015" );
    } );

    it( "should draw link columns", function ()
    {
        utils.set( "list", [ { id: 1 } ] );
        utils.set( "definition", { meta: {}, id: { canView: false },
            link: { href: "http://domain.com/{{item.id}}" } } );
        expect( $( ".rh-table tbody td:first-child" ).getText() ).toBe( "link" );
        expect( $( ".rh-table tbody td:first-child a" ).getAttribute( "href" ) ).toBe( "http://domain.com/1" );
    } );

} );
