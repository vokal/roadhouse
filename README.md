# roadhouse

Angular Admin CRUD Tools


## Why

At [Vokal](https://www.vokal.io) we often build CRUD UI for the administration of our API services with Angular. There are certain patterns those show up pretty universally for these admin sites. Roadhouse is a set of patterns encapsulated in Angular directives and services that remove all repetitive HTML for these admin sites.

Roadhouse relies heavily on JavaScript objects for data definitions, but provides the flexibility needed to build most practical CRUD interfaces.


## Requirements

The HTML that Roadhouse creates is designed to be used with Bootstrap CSS, but doesn't assume the use of any of the Bootstrap JavaScript components. The subset of CSS from bootstrap that Roadhouse uses is actually quite small and would be reasonably easy for someone to optimize.

There are a few relatively light npm dependencies:

- alertify.js
- angular-datetime
- angular-slugify
- ng-dialog


## Directives

### rh-field

Binds models to appropriate field types.

### rh-form

Wraps a number of `rh-field`s to display an editable record with some buttons to potentially create, update, and delete records.

### rh-valid

Attach validation functions to fields, used by `rh-field` in particular.

### rh-table

The table list view for record sets. Essentially creates the required columns, column headings, and binds cell contents for loaded records.

### rh-paginator

A simple paginator that displays a list of numbers corresponding to pages to show in an `rh-table` and when needed left and right overflow arrows indicating additional pages exist.


## Record Definition Object

In Roadhouse, the relationship between the records returned from the database and displayed in the UI is in a definition object.

The simplest possible definition would look like this and allow create, update, and delete for a record with just one field named `field1`:


```js
{
    field1: {}
}
```

But all these options are available:

```js
{
    meta: { // meta is a specially named key
        title: String,
        refreshOnSave: Boolean,
        canCreate: Boolean | Function that returns Boolean | Object { max: Number },
        canEdit: Boolean | Function that returns Boolean,
        canDelete: Boolean | Function that returns Boolean,
        showDelete: [FORM ONLY] Boolean | Function that returns Boolean,
        showEditDelete: [TABLE ONLY] Boolean,
        editHeading: String,
        deleteHeading: String
    },
    field1: { // all other key names match the field name from the API
        name: String,
        canView: Boolean | Function that returns Boolean,
        canEdit: "initial" | "not-initial" | "empty" | Boolean | Function that returns Boolean,
        canViewList: Boolean,
        required: Boolean,
        type: String, any valid HTML input type,
        "default": String | Boolean | Number,
        options: Array of Objects { value: String | Boolean, name: String },
        validate: Promise,
        href: String | Function that returns String,
        pattern: String of regular expression,
        placeholder: String,
        fieldDirective: String,
        fieldAttrs: Object, additional attributes and values to add to `rh-field`
    },
    fieldN: { ... },
    ...
}
```

### Meta Definition

#### `title`

*String* | Default: ""

Title is displayed as a header in `rh-form` and on the button to add a record.

* * *

#### `refreshOnSave`

*Boolean* | Default: true

Whether the value returned on POST or PUT will be used to refresh the record on the web. This is particularly useful for fields generated on the API.

* * *

#### `canCreate`

*Boolean, Function that returns Boolean, Object { max: Number }* | Default: true

Whether a record can be added.

* * *

#### `canEdit`

*Boolean, Function that returns Boolean* | Default: true

Whether a record can be edited.

* * *

#### `canDelete`

*Boolean, Function that returns Boolean* | Default: true

Whether a record can be deleted.

* * *

#### `editHeading`

*String* | Default: ""

The heading of the edit column in `rh-table` when it is visible.

* * *

#### `deleteHeading`

*String* | Default: ""

The heading of the delete column in `rh-table` when it is visible.

* * *

### Field Definition

#### `name`

*String* | Default: Name of key

The name is used for `rh-table` column headings and `rh-field` labels.

* * *

#### `canView`

*Boolean, "edit", Function that returns Boolean* | Default: true

Whether the field can be viewed. The most common reason this would be set to `false` is to hide ID fields. When `"edit"` the field is only visible when editing, so not during creation.

* * *

#### `canEdit`

*"initial", "empty", Boolean, Function that returns Boolean* | Default: true

Whether the field can be edited. When set to `false` an `rh-field` will be disabled. When `"initial"` the field is only editable during `rh-form` record creation, and the opposite for `"not-initial"`. When `"empty"` the field is only editable if it starts out empty when editing.

* * *

#### `showDelete`

*"Optional" Boolean* | Default: true

**[Form Directive Only]** Optional boolean switch for hiding delete button in the
form dialog.

* * *

#### `showEditDelete`

*"Optional" Boolean* | Default: false

**[Table Directive Only]** Optional boolean switch for hiding delete button in the
edit dialog.

* * *

#### `canEditItem`

*"Optional" Function that returns Boolean* | Default: Function returning true

**[Table Directive Only]** Optional filter function for selectively
enabling/disabling which list items have edit capability.

* * *

#### `canDeleteItem`

*"Optional" Function that returns Boolean* | Default: Function returning true

**[Table Directive Only]** Optional filter function for selectively
enabling/disabling which list items have delete option.

#### `canViewList`

*Boolean* | Default: true

Whether the field is displayed in `rh-table`.

* * *

#### `required`

*Boolean* | Default: false

Whether the field is required by `rh-field` validation.

* * *

#### `type`

*String* | Default: "text"

The field type for the `rh-field`. Options include any valid value for the type of an HTML input element, and "select". Certain values will trigger custom `pattern` values or different input controls. A checkbox will be rendered as a "yes" and "no" button, while a "date" type will use the `angular-datetime` directive.

* * *

#### `default`

*String, Boolean, Number* | Default: null

The default value for an empty field.

* * *

#### `options`

*Array of Objects { value: String | Boolean, name: String }* | Default: null

`rh-field` can display a list of discrete options instead of a text input using a list of buttons. To use a `select` field instead, `type` should be set to `"select"`. If you have more than five options, you likely want to use `type: "select"` for design reasons, but there is no enforced limit.

* * *

#### `validate`

*Promise* | Default: null

`rh-field` can delegate complex validations to `rh-valid` using a supplied promise. A promise is used to allow for validations that might require network calls to complete, but can also be used to do any field comparison, or whatever else is needed.

* * *

#### `href`

*String, Function that returns String* | Default: null

`rh-table` will display a link if `href` is provided. To include values from the current row, the property name is `item`, so a link to a page with the id of the current widget might be `href: "widget/{{ item.id }}"`.

* * *

#### `pattern`

*String or a regular expression* | Default: null

`rh-field` can use custom patterns for field validation.

* * *

#### `placeholder`

*String* | Default: null

`rh-field` can display a placeholder.

* * *

#### `fieldDirective`

*String* | Default: null

Add a directive to the `rh-field` by injecting this value directly into a `<div>`. For example, if you'd like to use the directive `angular-years-and-days` to edit the field value instead of a standard HTML input type and the data type should be seconds, use `fieldDirective: 'years-and-days data-as-seconds="true"'`. This will cause `rh-field` to be a `<div>` instead of an input type and will write that text directly into the tag.

* * *

#### `fieldAttrs`

*Object* | Default: null

Additional attributes to be added to `rh-field`

* * *


## Basic HTML

Each of the directives in Roadhouse can be used individually, but to create a typical paged table, create HTML like this.

```html
<div rh-table
    rh-definition="list.definition"
    rh-list="list.list"
    rh-on-create="list.create"
    rh-on-update="list.update"
    rh-on-delete="list.delete"
    rh-hide-edit-delete="list.hideEditDelete"
    rh-can-edit-item="list.canEditItem"
    rh-can-delete-item="list.canDeleteItem"
    rh-loading="list.loading"></div>

<div rh-paginator
    rh-paginator-page-count="list.pageCount"
    rh-paginator-current-page="list.currentPage"
    rh-paginator-on-page-selected="list.getList"></div>
```

### In the above:

- `rh-definition` is the definition object, explained above
- `rh-list` is an array of records
- `rh-on-create` is a callback function
- `rh-on-update` is a callback function
- `rh-on-delete` is a callback function
- `rh-show-edit-delete` is a boolean to hide the delete button in the edit
  dialog
- `rh-can-edit-item` is a callback function that receives the corresponding
item object as an argument and should return a boolean. Boolean result
determines if the item edit button is shown for the row.
- `rh-can-delete-item` is a callback function that receives the corresponding
item object as an argument and should return a boolean. Boolean result
determines if the delete button on the edit dialog is hidden.
- `rh-loading` is a boolean to tell the table whether loading is in progress, this is important so the table knows whether records are loading or the list is loaded with no records as both statuses are displayed for the user
- `rh-paginator-page-count` is the total number of pages
- `rh-paginator-current-page` is the current page number
- `rh-paginator-on-page-selected` is a callback function

### The controllers should generally be as simple as:

- Set `rh-loading` to true, request the list from the API, assign results to `rh-list`, assign page count results `rh-paginator-page-count`, and set `rh-loading` to false
- Use `rh-on-create` to POST the item to the API
- Use `rh-on-update` to PUT the item to the API
- Use `rh-on-delete` to DELETE the item from the API

#### For example:

```js
ctrl.list = [];
ctrl.definition = {...};
ctrl.showEditDelete = false;

ctrl.getList = function ()
{
    ctrl.loading = true;

    return API.getList()
        .then( function ( response )
        {
            ctrl.list = response.data.results;
            ctrl.loading = false;
        },
        function ()
        {
            alertify.error( "The list could not be loaded" );
            ctrl.loading = false;
        } );
};

ctrl.create = function ( item ) { /* POST item to API */ };
ctrl.update = function ( item ) { /* PUT item to API */ };
ctrl.delete = function ( item ) { /* DELETE item from API */ };

ctrl.canEditItem = function ( item ) { /* Retuen Boolean */ };
ctrl.canDeleteItem = function ( item ) { /* Retuen Boolean */ };

ctrl.getList(); // on load
```
