"use strict";

global.angular = require( "angular" );
require( "angular-mocks" );
require( "../source/index.js" );

angular.module( "Harness", [ "roadhouse" ] )
.run( [ "$rootScope", "$q", "Pager", "alertify", function ( $rootScope, $q, Pager, alertify )
{
    alertify.closeLogOnClick( true );

    $rootScope.dialogOpen = false;

    $rootScope.$on( "ngDialog.opened", function ()
    {
        $rootScope.dialogOpen = true;
    } );

    $rootScope.$on( "ngDialog.closed", function ()
    {
        $rootScope.dialogOpen = false;
    } );

    $rootScope.create = function ( item )
    {
        var defer = $q.defer();
        item.id = 99;
        defer.resolve( { data: item } );
        return defer.promise;
    };

    $rootScope.update = function ( item )
    {
        var defer = $q.defer();
        defer.resolve( { data: item } );
        return defer.promise;
    };

    $rootScope.delete = function ()
    {
        var defer = $q.defer();
        defer.resolve( { data: {} } );
        return defer.promise;
    };

    $rootScope.getList = function ( page )
    {
        var mockDataService = {
            getPage: function ()
            {
                var defer = $q.defer();
                defer.resolve( { data: {
                    results: [ {}, {}, {} ],
                    pageCount: 10,
                    currentPage: page.index
                } } );
                return defer.promise;
            }
        };

        Pager.getPage( $rootScope, mockDataService, page.index );
    };

    $rootScope.get404List = function ( page )
    {
        var mockDataService = {
            getPage: function ()
            {
                var defer = $q.defer();
                defer.reject( { status: 404 } );
                return defer.promise;
            }
        };

        Pager.getPage( $rootScope, mockDataService, page.index );
    };

    $rootScope.get500List = function ( page )
    {
        var mockDataService = {
            getPage: function ()
            {
                var defer = $q.defer();
                defer.reject( { status: 500 } );
                return defer.promise;
            }
        };

        Pager.getPage( $rootScope, mockDataService, page.index );
    };


    var notValid = $q.defer();
    notValid.reject( "nope" );

    var valid = $q.defer();
    valid.resolve( true );

    $rootScope.validators = {
        model: {},
        definition: {
            meta: {},
            a: {
                validate: () => notValid.promise
            },
            b: {
                validate: () => valid.promise
            },
            c: { key: "c" },
            d: {
                key: "d",
                validate: { sameAsModel: { key: "c" } }
            }
        }
    };
} ] );
