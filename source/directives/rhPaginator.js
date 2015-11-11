"use strict";

module.exports = [ "$compile", function ( $compile )
{
    var template = '<nav><ul class="pagination rh-paginator" data-ng-if="pages.length > 1">'
        + '<li data-ng-repeat="page in pages" data-ng-class="{ \'active\': page.index === currentPage }">'
        + '<a data-ng-click="clickPage( page )">{{ page.index }}</a>'
        + "</li></ul></nav>";

    return {
        scope: {
            currentPage: "=rhPaginatorCurrentPage",
            pageCount: "=rhPaginatorPageCount",
            pageSelected: "=rhPaginatorOnPageSelected"
        },
        link: function ( scope, element )
        {
            scope.currentPage = scope.currentPage || 1;

            scope.clickPage = function ( page )
            {
                scope.currentPage = page.index;
                if( angular.isFunction( scope.pageSelected ) )
                {
                    scope.pageSelected( page );
                }
            };

            var createPage = function ( index )
            {
                return {
                    index: index
                };
            };

            var render = function ()
            {
                if( !scope.pageCount )
                {
                    return element.html( "" );
                }

                scope.pages = [];
                var firstPage = Math.max( 1, scope.currentPage - 2 );

                for( var i = firstPage; i < firstPage + 5 && i <= scope.pageCount; i++ )
                {
                    scope.pages.push( createPage( i ) );
                }

                element.html( template );
                $compile( element.contents() )( scope );
            };

            scope.$watch( "currentPage", render );
            scope.$watch( "pageCount", render );
        }
    };
} ];
