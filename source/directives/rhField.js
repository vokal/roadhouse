"use strict";

var utils = require( "../utils" );

module.exports = [ "$compile", function ( $compile )
{
    return {
        scope: {
            def: "=rhDefinition",
            model: "=rhModel",
            initial: "=rhInitial"
        },
        link: function ( scope, element )
        {
            scope.def = scope.def || {};
            scope.model = scope.model || {};
            scope.initial = !!scope.initial;

            var getType = function ()
            {
                if( !scope.def.type || scope.def.type === "date" )
                {
                    return "text";
                }
                return scope.def.type;
            };

            var modelName = "model." + scope.def.key;
            scope.canEdit = utils.runIfFunc( scope.def.canEdit );

            var inputAttrs = 'data-ng-model="' + modelName + '" '
                + ( scope.def.validate ? 'rh-valid="def.validate"' : "" )
                + ( scope.def.changed ? 'ng-change="def.changed()"' : "" )
                + 'id="' + scope.def.key + '" '
                + 'class="form-control"'
                + ( scope.def.labelType === "placeholder"
                    ? 'placeholder="' + ( scope.def.name || scope.def.key ) + '" '
                    : "" )
                + ( scope.def.uiMask ? 'ui-mask="' + scope.def.uiMask + '" ' : "" )
                + ( scope.def.pattern ? 'pattern="' + scope.def.pattern + '" ' : "" )
                + ( scope.def.required ? "required " : "" )
                + 'ng-disabled="canEdit === false || canEdit === \'initial\' && initial"'
                + ( scope.def.type === "date" ? "data-date-picker " : "" );

            var input = "<input "
                + 'type="' + getType() + '" '
                + inputAttrs + ">";

            if( getType() === "checkbox" )
            {
                scope.def.options = [
                    { name: "Yes", value: true },
                    { name: "No", value: false }
                ];
            }

            if( scope.def.options )
            {
                input += '<div class="btn-group" role="group">'
                + '  <button data-ng-repeat="option in def.options" type="button"'
                + '     class="btn btn-default rh-{{ option.value }}"'
                + '     data-ng-click="' + modelName + ' = option.value"'
                + '     data-ng-class="{ \'active\': ' + modelName + ' === option.value }">{{ option.name }}</button>'
                + "</div>";
            }

            if( scope.def.fieldDirective )
            {
                input = "<div " + inputAttrs + " " + scope.def.fieldDirective + "></div>";
            }

            var inputGroup = '<div class="input-group">'
            + input
            + '<span class="input-group-addon">'
            + '<i class="glyphicon glyphicon-ok-circle"></i>'
            + '<i class="glyphicon glyphicon-exclamation-sign"></i>'
            + "</span></div>";

            var wrapper = '<div class="input-group-wrapper rh-' + getType() + '">'
                + '<label data-ng-class="{ \'hidden-label\': def.labelType === \'placeholder\' }" '
                + '  for="' + scope.def.key  + '"><span>' + ( scope.def.name || scope.def.key ) + "</span></label>"
                + inputGroup
                + "</div>";

            element.html( wrapper );
            $compile( element.contents() )( scope );
        }
    };
} ];
