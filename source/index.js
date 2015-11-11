"use strict";

require( "angular-datetime" );
require( "ng-dialog" );
global.toastr = require( "toastr" );
global.jQuery = global.$ = require( "jquery" );

angular.module( "roadhouse", [ "vokal.datePicker", "ngDialog" ] )
.service( "Pager", require( "./services/pager" ) )
.directive( "rhTable", require( "./directives/rhTable" ) )
.directive( "rhPaginator", require( "./directives/rhPaginator" ) )
.directive( "rhForm", require( "./directives/rhForm" ) );
