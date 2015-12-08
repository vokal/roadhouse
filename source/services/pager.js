"use strict";

module.exports = [ "alertify",  "$location",
    function ( alertify, $location )
    {
        return {
            getPage: function ( scope, dataService, page )
            {
                dataService.getPage( page && page.index || Number( $location.search().rhcurrentpage ) || 1 )
                    .then( function ( response )
                    {
                        scope.list = response.data.results;
                        if( response.data.pageCount )
                        {
                            scope.pageCount = Number( response.data.pageCount );
                        }
                        if( response.data.currentPage )
                        {
                            scope.currentPage = Number( response.data.currentPage );
                        }
                    },
                    function ( res )
                    {
                        if( res.status === 404 )
                        {
                            return alertify.log( "The list is empty" );
                        }
                        alertify.error( "Oops, there was an issue retrieving the list" );
                    } );
            }
        };
    }
];
