"use strict";

module.exports = [ "$compile", function ( $compile )
{
    return {
        scope: {
            definition: "=rhDefinition",
            save: "=rhOnSave",
            delete: "=rhOnDelete",
            cancel: "=rhOnCancel",
            model: "=rhModel"
        },
        link: function ( scope, element )
        {
            var keys = Object.keys( scope.definition );
            var inputs = [];
            scope.model = scope.model || {};
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

            keys.forEach( function ( key )
            {
                if( key === "meta" )
                {
                    return;
                }

                var def = scope.definition[ key ];

                if( def.canView === false || def.type === "link" )
                {
                    return;
                }

                var getType = function ()
                {
                    if( !def.type || def.type === "date" )
                    {
                        return "text";
                    }
                    return def.type;
                };

                var input = '<input type="' + getType() + '" '
                + 'data-ng-model="model.' + key + '" '
                + 'id="' + key + '" '
                + 'class="form-control"'
                + ( def.uiMask ? 'ui-mask="' + def.uiMask + '" ' : "" )
                + ( def.required ? "required " : "" )
                + ( def.canEdit === false || def.canEdit === "initial" && scope.model.id ? "disabled " : "" )
                + ( def.type === "date" ? "data-date-picker " : "" )
                + ">";

                var inputGroup = '<div class="input-group">'
                + input
                + '<span class="input-group-addon">'
                + '<i class="glyphicon glyphicon-ok-circle"></i>'
                + '<i class="glyphicon glyphicon-exclamation-sign"></i>'
                + "</span></div>";

                inputs.push(
                    '<div class="input-group-wrapper">'
                    + '<label for="' + def.key  + '"><span>' + ( def.name || key ) + "</span></label>"
                    + inputGroup
                    + "</div>" );
            } );

            var form = '<form name="form" class="rh-form" data-ng-submit="saveClick( form )">'
            + "  <h3>"
            +   ( !scope.definition.id || scope.model.id ? "Edit " : "Add " )
            +   ( scope.definition.meta.title )
            + "  </h3>"
            +    inputs.join( "\n" )
            + '  <div class="form-controls clearfix initial" data-ng-hide="deletePending">'
            + '    <button type="button" class="btn btn-default" data-ng-click="cancel()">Cancel</button>'
            + ( scope.model.id && scope.definition.meta.canDelete !== false
                ? '<button type="button" class="btn btn-danger" data-ng-click="deletePending = true">Delete</button>'
                : "" )
            + '    <button id="add-item-submit" type="submit" class="btn btn-primary">Save</button>'
            + "  </div>"
            + '<div class="form-controls clearfix delete-confirm" data-ng-show="deletePending">'
            + "  <strong>Do you really want to delete this?</strong>"
            + '  <button type="button" class="btn btn-danger" data-ng-click="deleteClick()">Yes, Delete</button>'
            + '  <button type="button" class="btn btn-default" data-ng-click="deletePending = false">Cancel</button>'
            + "</form>";

            element.html( form );
            $compile( element.contents() )( scope );
        }
    };
} ];
