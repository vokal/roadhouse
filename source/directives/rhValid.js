"use strict";

module.exports = [ "$q", function ( $q )
{
    return {
        require: "ngModel",
        scope: {
            validator: "=rhValid"
        },
        link: function ( scope, elm, attrs, ctrl )
        {
            if( angular.isFunction( scope.validator ) )
            {
                ctrl.$asyncValidators.rh = scope.validator;
            }
        }
    };
} ];
