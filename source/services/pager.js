"use strict";

module.exports = [ "alertify", function ( alertify )
    {
        return {
            getPage: function ( scope, dataService, page )
            {
                dataService.getPage( page && page.index || 1 )
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
                    function ()
                    {
                        alertify.error( "Oops, there was an issue retrieving the list" );
                    } );
            }
        };
    }
];
