"use strict";

require( "angular-datetime" );
require( "ng-dialog" );
require( "alertify.js/dist/js/ngAlertify" );

angular.module( "roadhouse", [ "vokal.datePicker", "ngDialog", "ngAlertify" ] )
.service( "Pager", require( "./services/pager" ) )
.directive( "rhTable", require( "./directives/rhTable" ) )
.directive( "rhPaginator", require( "./directives/rhPaginator" ) )
.directive( "rhForm", require( "./directives/rhForm" ) )
.directive( "rhField", require( "./directives/rhField" ) )
.directive( "rhValid", require( "./directives/rhValid" ) );
