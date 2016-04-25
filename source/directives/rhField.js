"use strict";

var utils = require( "../utils" );

module.exports = [ "$compile", "$filter", function ( $compile, $filter )
{
    return {
        scope: {
            def: "=rhDefinition",
            model: "=rhModel",
            initial: "=rhInitial"
        },
        link: function ( scope, element, attrs )
        {
            var render = function ()
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

                var getPattern = function ()
                {
                    if( scope.def.pattern )
                    {
                        return scope.def.pattern;
                    }
                    if( getType() === "email" )
                    {
                        return "^.+@.+\\..{2,}$";
                    }
                    if( getType() === "url" )
                    {
                        return "^.+://.+\\..{2,}$";
                    }
                    if( getType() === "tel" )
                    {
                        return ".*\\d.*\\d.*\\d.*\\d.*\\d.*\\d.*\\d.*\\d.*";
                    }
                    return null;
                };

                var getDirectAttrs = function ()
                {
                    if( !scope.def.fieldAttrs )
                    {
                        return "";
                    }

                    return Object.keys( scope.def.fieldAttrs ).map( function ( key )
                    {
                        return $filter( "slugify" )( key ) + '="' + scope.def.fieldAttrs[ key ] + '"';
                    } ).join( " " );
                };

                var pattern = getPattern();
                var modelName = "model." + scope.def.key;
                scope.canEdit = utils.runIfFunc( scope.def.canEdit );
                scope.canView = utils.runIfFunc( scope.def.canView );

                if( scope.canView === false || scope.initial && scope.canEdit === false )
                {
                    element.html( "" );
                    $compile( element.contents() )( scope );
                    return;
                }

                if( scope.def.default &&
                    ( scope.model[ scope.def.key ] === undefined || scope.model[ scope.def.key ] === null ) )
                {
                    scope.model[ scope.def.key ] = scope.def.default;
                }

                scope.startEmpty = !scope.model[ scope.def.key ];

                var ngDisabled = 'ng-disabled="canEdit === false || canEdit === \'initial\' && !initial'
                    + ' || canEdit === \'not-initial\' && initial || canEdit === \'empty\' && !startEmpty "';

                var inputAttrs = 'data-ng-model="' + modelName + '" '
                    + ( scope.def.validate ? 'rh-valid="def.validate"' : "" )
                    + ( scope.def.changed ? 'ng-change="def.changed()"' : "" )
                    + 'id="' + scope.def.key + '" '
                    + 'class="form-control"'
                    + ( scope.def.labelType === "placeholder" || scope.def.placeholder
                        ? 'placeholder="' + ( scope.def.placeholder || scope.def.name || scope.def.key ) + '" '
                        : "" )
                    + ( scope.def.uiMask ? 'ui-mask="' + scope.def.uiMask + '" ' : "" )
                    + ( pattern ? 'pattern="' + pattern + '" ' : "" )
                    + ( scope.def.required ? "required " : "" )
                    + ngDisabled
                    + ( scope.def.type === "date" ? "data-date-picker " : "" )
                    + " " + getDirectAttrs();

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
                    if( getType() === "select" )
                    {
                        input = '<select data-ng-model="selected" data-ng-change="select()"'
                        + ' data-ng-options="option as option.name for option in def.options"'
                        + inputAttrs + "></select>";

                        scope.$watch( modelName, function ( newVal, oldVal )
                        {
                            if( newVal )
                            {
                                scope.selected = scope.def.options.filter( function ( item )
                                {
                                    return item.value === newVal;
                                } )[ 0 ];
                            }
                        } );

                        scope.select = function ()
                        {
                            scope.model[ scope.def.key ] = scope.selected ? scope.selected.value : null;
                        };
                    }
                    else
                    {
                        input += '<div class="btn-group" role="group">'
                        + '  <button data-ng-repeat="option in def.options" type="button"'
                        + '     class="btn btn-default rh-{{ option.value === true ? \'true\' : option.value === false ? \'false\' : option.value | slugify }}"'
                        + '     data-ng-click="' + modelName + ' = option.value"'
                        + "     " + ngDisabled
                        + '     data-ng-class="{ \'active\': ' + modelName + ' === option.value }">{{ option.name }}</button>'
                        + "</div>";
                    }
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

                var wrapper = '<div class="input-group-wrapper rh-' + getType()
                    + " " + ( scope.def.options ? "rh-options" : "" ) + '">'
                    + '<label data-ng-class="{ \'hidden-label\': def.labelType === \'placeholder\' }" '
                    + '  for="' + scope.def.key  + '"><span>' + ( scope.def.name || scope.def.key ) + "</span></label>"
                    + inputGroup
                    + "</div>";

                element.html( wrapper );
                $compile( element.contents() )( scope );
            };

            render();
            scope.$watch( "def",  function ( newVal, oldVal ) {
                if( newVal !== oldVal )
                {
                    render();
                }
            } );
            scope.$watch( "initial",  function ( newVal, oldVal ) {
                if( newVal !== oldVal )
                {
                    render();
                }
            } );
        }
    };
} ];
