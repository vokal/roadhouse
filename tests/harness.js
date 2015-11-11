"use strict";

global.angular = require( "angular" );
require( "angular-mocks" );
require( "../source/index.js" );

angular.module( "Harness", [ "roadhouse" ] )
.run( [ "$rootScope", "$q", function ( $rootScope, $q )
{
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
} ] );
