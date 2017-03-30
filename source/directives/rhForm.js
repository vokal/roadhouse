"use strict";

var utils = require( "../utils" );

module.exports = [ "$compile", function ( $compile )
{
    return {
        scope: {
            definition: "=rhDefinition",
            save: "=rhOnSave",
            delete: "=rhOnDelete",
            cancel: "=rhOnCancel",
            model: "=rhModel",
            titleVisible: "=rhTitleVisible",
            showDelete: "=?rhShowDelete"
        },
        link: function ( scope, element )
        {
            var render = function ()
            {
                if( typeof( scope.definition ) !== "object" )
                {
                    element.html( "" );
                    $compile( element.contents() )( scope );
                    return;
                }

                var keys = Object.keys( scope.definition );
                var inputs = [];
                scope.definition.meta = scope.definition.meta || {};
                scope.model = scope.model || {};
                scope.toggleDeletePending = function ()
                {
                    scope.deletePending = !scope.deletePending;
                };
                scope.deleteClick = function ()
                {
                    scope.delete( scope.model );
                };
                scope.saveClick = function ( form )
                {
                    if( form.$valid )
                    {
                        scope.save( scope.model );
                    }
                };
                scope.getShowDeleteState = function ()
                {
                    // NOTE: Maintain Default for Previous Implementation
                    if ( !(typeof( scope.showDelete ) === 'boolean' || angular.isFunction( scope.showDelete )) )
                    {
                        return true;
                    }
                    return Boolean(
                        angular.isFunction( scope.showDelete ) ? scope.showDelete( scope.model ) : scope.showDelete
                    );
                }

                keys.forEach( function ( key )
                {
                    var def = scope.definition[ key ];
                    if( key !== "meta"
                        && def.canView === false
                        && !scope.model.id
                        && def.type !== "link"
                        && def.default
                        && !scope.model[ key ] )
                        {
                            scope.model[ key ] = def.default;
                        }
                } );

                scope.formFields = keys.filter( function ( key )
                {
                    var def = scope.definition[ key ];
                    return key !== "meta"
                        && def.canView !== false
                        && ( def.canView !== "edit" || scope.model.id )
                        && def.type !== "link";
                } )
                .map( function ( key )
                {
                    var def = scope.definition[ key ];
                    def.key = key;
                    return def;
                } );

                scope.formName = "rh" + ( scope.definition.meta.title || "" ).replace( /[^\w\d]*/g, "" ) + "Form";
                scope.canDelete = Boolean(
                  scope.getShowDeleteState() &&
                  scope.model.id &&
                  utils.runIfFunc( scope.definition.meta.canDelete ) !== false
                );


                var form = '<form name="{{ formName }}" class="rh-form" data-ng-submit="saveClick( ' + scope.formName + ' )">'
                + "  <h3 data-ng-if='titleVisible !== false'>"
                + '    {{ !definition.id || model.id ? "Edit " : "Add "}}'
                + '    {{ definition.meta.title || "" }}'
                + "  </h3>"
                + '  <div ng-repeat="field in formFields" '
                + '    rh-field rh-model="model"'
                + '    rh-definition="field" rh-initial="!model.id" ></div>'
                + '  <div class="form-controls clearfix initial" data-ng-hide="deletePending">'
                + '    <button type="button" class="btn btn-danger pull-left" data-ng-if="canDelete"'
                + '      data-ng-click="toggleDeletePending()">Delete</button>'
                + '    <button type="button" class="btn btn-default" data-ng-click="cancel()">Cancel</button>'
                + '    <button id="add-item-submit" type="submit" class="btn btn-primary">Save</button>'
                + "  </div>"
                + '  <div class="form-controls clearfix delete-confirm" '
                + '    data-ng-if="canDelete" data-ng-show="deletePending">'
                + "    <strong>Do you really want to delete this?</strong>"
                + '    <button type="button" class="btn btn-danger" data-ng-click="deleteClick()">Confirm</button>'
                + '    <button type="button" class="btn btn-default" data-ng-click="toggleDeletePending()">Cancel</button>'
                + "  </div>"
                + "</form>";

                element.html( form );
                $compile( element.contents() )( scope );
            };

            scope.$watch( "definition",  function ( newVal, oldVal ) {
                if( newVal !== oldVal )
                {
                    render();
                }
            } );
            scope.$watch( "model", function ( newVal, oldVal ) {
                if( newVal !== oldVal )
                {
                    render();
                }
            } );
            render();
        }
    };
} ];
