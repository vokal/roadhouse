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
            var validator = scope.validator;

            if( angular.isFunction( validator ) )
            {
                ctrl.$asyncValidators.rh = validator;
            }
            else if( validator.sameAsModel )
            {
                ctrl.$asyncValidators.rh = function ( modelValue, viewValue )
                {
                    var defer = $q.defer();

                    var comparison = angular.element( document.querySelector( "#" + validator.sameAsModel.key ) );

                    if( comparison && comparison.data( "$ngModelController" ).$modelValue === viewValue )
                    {
                        defer.resolve( true );
                    }
                    else
                    {
                        defer.reject( "Must be the same as " + validator.sameAsModel.key );
                    }
                    return defer.promise;
                };
            }
        }
    };
} ];
