"use strict";

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

            var input = '<input type="' + getType() + '" '
            + 'data-ng-model="model.' + scope.def.key + '" '
            + 'id="' + scope.def.key + '" '
            + 'class="form-control"'
            + ( scope.def.uiMask ? 'ui-mask="' + scope.def.uiMask + '" ' : "" )
            + ( scope.def.required ? "required " : "" )
            + ( scope.def.canEdit === false || scope.def.canEdit === "initial" && scope.initial ? "disabled " : "" )
            + ( scope.def.type === "date" ? "data-date-picker " : "" )
            + ">";

            var inputGroup = '<div class="input-group">'
            + input
            + '<span class="input-group-addon">'
            + '<i class="glyphicon glyphicon-ok-circle"></i>'
            + '<i class="glyphicon glyphicon-exclamation-sign"></i>'
            + "</span></div>";

            var wrapper = '<div class="input-group-wrapper">'
                + '<label for="' + scope.def.key  + '"><span>' + ( scope.def.name || scope.def.key ) + "</span></label>"
                + inputGroup
                + "</div>";

            element.html( wrapper );
            $compile( element.contents() )( scope );
        }
    };
} ];
