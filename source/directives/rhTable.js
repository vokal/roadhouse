"use strict";

var utils = require( "../utils" );

module.exports = [ "$compile", "$rootScope", "ngDialog", "alertify",
function ( $compile, $rootScope, ngDialog, alertify )
{
    var formTemplate = "<div data-rh-form"
        + ' data-rh-definition="definition"'
        + ' data-rh-model="item"'
        + ' data-rh-on-save="save"'
        + ' data-rh-on-cancel="cancel"'
        + ' data-rh-on-delete="delete"></div>';

    return {
        scope: {
            definition: "=rhDefinition",
            list: "=rhList",
            update: "=rhOnUpdate",
            create: "=rhOnCreate",
            delete: "=rhOnDelete"
        },
        link: function ( scope, element )
        {
            var getIndexById = function ( id )
            {
                for( var i = 0; i < scope.list.length; i++ )
                {
                    if( scope.list[ i ].id === id )
                    {
                        return i;
                    }
                }
                return null;
            };

            var openDialog = function ( dialogScope )
            {
                dialogScope.definition = scope.definition;

                dialogScope.cancel = function ()
                {
                    ngDialog.close();
                };

                dialogScope.delete = function ( item )
                {
                    scope.delete( item )
                        .then( function ()
                        {
                            scope.list[ getIndexById( item.id ) ].meta = { deleted: true };
                            ngDialog.close();
                        },
                        function ()
                        {
                            alertify.error( "Oops, There was an issue deleting the item" );
                        } );
                };

                ngDialog.open( {
                    plain: true,
                    template: formTemplate,
                    className: "ngdialog-theme-default rh-form",
                    scope: dialogScope
                } );
            };

            scope.editClick = function ( item )
            {
                var dialogScope = scope.$new();
                dialogScope.item = angular.copy( item );
                dialogScope.save = function ( item )
                {
                    scope.update( item )
                        .then( function ( response )
                        {
                            var updatedItem = response.data;
                            updatedItem.meta = { updated: true };
                            scope.list.splice( getIndexById( item.id ), 1, updatedItem );
                            ngDialog.close();
                        },
                        function ()
                        {
                            alertify.error( "Oops, there was a problem updating the item" );
                        } );
                };
                openDialog( dialogScope );
            };

            scope.addClick = function ()
            {
                var dialogScope = scope.$new();
                dialogScope.item = {};
                dialogScope.save = function ( item )
                {
                    scope.create( item )
                        .then( function ( response )
                        {
                            //TODO: this is a little weird, should really reload the list in most cases
                            response.data.meta = { updated: true };
                            scope.list.push( response.data );
                            ngDialog.close();
                        },
                        function ()
                        {
                            alertify.error( "Oops, there was an issue creating the item" );
                        } );
                };
                openDialog( dialogScope );
            };

            var getCell = function ( key, def )
            {
                var wrapCell = function ( content )
                {
                    return "<td><h6>" + def.name + "</h6><span>" + content + "</span></td>";
                };

                if( def.href )
                {
                    return wrapCell( '<a data-ng-href="'
                        + utils.runIfFunc( def.href )
                        + ( def.hrefTarget ? '" target="' + def.hrefTarget + '" ' : "" )
                        + '">' + ( def.name || key ) + "</a>" );
                }
                else if( def.type === "checkbox" )
                {
                    return wrapCell( '<i class="glyphicon glyphicon-{{ item.'
                        + key + ' ? \'ok\' : \'unchecked\' }}"></i>' );
                }

                return wrapCell( "{{ item." + key + ( def.type === "date" ? " | date" : "" ) + " }}" );
            };

            var render = function ()
            {
                if( typeof( scope.definition ) !== "object" )
                {
                    element.html( "" );
                    $compile( element.contents() )( scope );
                    return;
                }

                if( !angular.isArray( scope.list ) )
                {
                    scope.list = [];
                }

                var keys = Object.keys( scope.definition );
                var thead = [];
                var tbody = [];
                scope.model = scope.model || {};

                scope.canCreate = function ()
                {
                    if( utils.runIfFunc( scope.definition.meta.canCreate ) === false )
                    {
                        return false;
                    }
                    else if( scope.definition.meta.canCreate && scope.definition.meta.canCreate.max )
                    {
                        return scope.list.filter( function ( i ) { return !i.meta || !i.meta.deleted; } ).length
                            < scope.definition.meta.canCreate.max;
                    }
                    return true;
                };

                keys.forEach( function ( key )
                {
                    if( key === "meta" )
                    {
                        return;
                    }

                    var def = scope.definition[ key ];

                    if( def.canView === false || def.canViewList === false )
                    {
                        return;
                    }

                    thead.push( "<th>" + ( def.name || key ) + "</th>" );
                    tbody.push( getCell( key, def ) );
                } );

                if( utils.runIfFunc( scope.definition.meta.canEdit ) !== false )
                {
                    thead.push( "<th></th>" );
                    tbody.push( '<td><h6>Edit</h6><span><i data-ng-click="editClick( item )"'
                        + ' data-ng-if="!item.meta.deleted"'
                        + ' class="glyphicon glyphicon-edit"></span></i></td>' );
                }

                var controls = '<div class="table-controls form-inline clearfix"'
                    + ' data-ng-if="canCreate()">'
                    + '<button id="add-item-btn" type="button" class="btn btn-primary"'
                        + 'data-ng-click="addClick()">Add New {{ definition.meta.title }}</button>'
                + "</div>";

                var table = '<table class="rh-table">'
                + "  <thead><tr>" + thead.join( "\n" ) + "</tr></thead>"
                + '  <tbody><tr data-ng-repeat="item in list" '
                + '  data-ng-class="{ \'deleted\': item.meta.deleted, \'updated\': item.meta.updated }">'
                    + tbody.join( "\n" ) + "</tr></tbody>"
                + "</table>";

                element.html( controls + table );
                $compile( element.contents() )( scope );
            };

            scope.$watchCollection( "list", render );
            scope.$watch( "definition", render );
        }
    };
} ];
