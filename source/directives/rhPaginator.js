"use strict";

module.exports = [ "$compile", "$location", function ( $compile, $location )
{
    var template = '<nav><ul class="pagination rh-paginator" data-ng-if="pages.length > 1">'
        + '<li data-ng-repeat="page in pages" data-ng-class="{ \'active\': page.index === currentPage }">'
        + '<a data-ng-click="clickPage( page )">'
        + '<span class="{{ page.css }}">{{ page.css ? "" : page.index }}</span>'
        + "</a></li></ul></nav>";

    return {
        scope: {
            currentPage: "=rhPaginatorCurrentPage",
            pageCount: "=rhPaginatorPageCount",
            pageSelected: "=rhPaginatorOnPageSelected"
        },
        link: function ( scope, element )
        {
            var linkCount = 5;
            scope.currentPage = scope.currentPage || 1;

            scope.clickPage = function ( page )
            {
                scope.currentPage = page.index;
                if( angular.isFunction( scope.pageSelected ) )
                {
                    $location.search( "rhcurrentpage", page.index );
                    scope.pageSelected( page );
                }
            };

            var createPage = function ( index, css )
            {
                return {
                    index: index,
                    css: css
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

                if( firstPage > 1 )
                {
                    scope.pages.push( createPage( firstPage - 1, "glyphicon glyphicon-chevron-left" ) );
                }

                for( var i = firstPage; i < firstPage + linkCount && i <= scope.pageCount; i++ )
                {
                    scope.pages.push( createPage( i ) );
                }

                if( scope.pageCount > firstPage + linkCount )
                {
                    scope.pages.push( createPage( firstPage + linkCount, "glyphicon glyphicon-chevron-right" ) );
                }

                element.html( template );
                $compile( element.contents() )( scope );
            };

            scope.$watch( "currentPage", render );
            scope.$watch( "pageCount", render );
        }
    };
} ];
