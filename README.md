## Donate to the project

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7LKYWG9LXNQ9C&lc=ES&item_name=Tito%20Hinostroza&item_number=2153&no_note=0&cn=Dar%20instrucciones%20especiales%20al%20vendedor%3a&no_shipping=2&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

### Note from maintainer, I have not changed the above donation link. Please donate to the original author.

# Bootstable
Javascript library to make HMTL tables editable.

![Bootstable](http://blog.pucp.edu.pe/blog/tito/wp-content/uploads/sites/610/2018/01/Sin-título-13.png "Bootstable")

"Bootstable" is a javascript library (plug-in), that lets convert a HTML static table to a editable table. 
A table is made editable, including several buttons to perform the edition actions.

No database connection is included. The library was designed to work offline, when editing.

Edition options includes:

* Edit fields.
* Remove rows.
* Add rows.

## Dependencies:

* Bootstrap
* Font Awesome

Bootstrap is necessary to format correctly the controls used, and to draw icons.
It's possible to work without Bootstrap too. In this case style is missing.

This library utilizes the free set of glyphs for the buttons.

## Requirements

1. For a table to be editable, it needs to have the following structure:

```
<table id="some_id">
      <thead>
            <tr> 
                  <th></th>  <th></th>  <th></th> ...
            </tr>
      </thead>
      <tbody>
            <tr>
                  <td></td>  <td></td>  <td></td> ...
            </tr>
      </tbody>
</table>
```

2. Bootstable needs the ID of the table to edit, and can only work on a single table. 

      const bstable = new bootstable("mytable", options)

## Examples

Sets all the columns of #mytable editable:

      const bstable = new bootstable("mytable");

Sets the columns 0 and 1 of #mytable editable:

      const bstable = new bootstable("mytable", {
            columnsEd: "0,1" //editable columns 
      });

Includes a "New row" button, this will add a new button to the table headers:

      const bstable = new bootstable("mytable", {
                    columnsEd: "0,1", 
                    $addButton: "buttonId"
      });


Set a "New row" button to add a row and set initial values:

      const bstable = new bootstable("mytable", {
            $addButton: "buttonId",
            defaultValues: [1,2,3]
      } );

Set a "New row" button to add a row, set initial values and turn to edit mode:

      const bstable = new bootstable("mytable", {
            $addButton: "buttonId",
            defaultValues: [1,2,3],
            addButtonEdit: true // Forces bootstable to edit the new row immediately.
      } );

Parameters:

      // Properties
      columnsEd: Array(),      // Default: null  -- Index to editable columns. If null, all columns will be editable. Ex.: [ 0,1,2,3,4,5 ]
      $addButton: string,      // Default: null  -- ID of "Add" button. 
      defaultValues: Array(),  // Default: null  -- Set default values, must match the number of editable columns
      addButtonEdit: boolean,  // Default: false -- Should bootstable edit the rows after adding?
      buttons: Object(), // Overide default buttons

      // Callbacks
      onEdit: (rowElement) => {},         // Called after clicking edit button
      onBeforeDelete: (rowElement) => {}, // Called just before deletion
      onDelete: (rowElement) => {},       // Called after deletion button, but after onBeforeDelete. If onBeforeDelete returns false, bypass.
      onAdd: (rowElement) => {}           // Called when new row is added to table

# Utilities

There are two functions, included in the library, to facilitate the export of the table:

* bstable.TableToCSV(tableId, separator, downloadBool, filenameStr)
* bstable.TableToJson(tableId, downloadBool, filenameStr)

These functions return a string in the appropriate format (CSV or JSON) from any HTML table.

# Default Buttons

In order to self-stylize buttons, pass a replacement object for the button(s) you wish to modify:

      const buttons = {
         bEdit: {
           className: "btn btn-sm btn-primary",
           icon: "fa fa-pencil",
           display: "block",
           onclick: (but) => {
             var target = but.target;
             if (target.tagName == "I") {
               target = but.target.parentNode;
             }
             this.butRowEdit(target);
           },
         },
         bElim: {
           className: "btn btn-sm btn-danger",
           icon: "fa fa-trash",
           display: "block",
           onclick: (but) => {
             var target = but.target;
             if (target.tagName == "I") {
               target = but.target.parentNode;
             }
             this.butRowDelete(target);
           },
         },
         bAcep: {
           className: "btn btn-sm btn-success",
           icon: "fa fa-check",
           display: "none",
           onclick: (but) => {
             var target = but.target;
             if (target.tagName == "I") {
               target = but.target.parentNode;
             }
             this.butRowAcep(target);
           },
         },
         bCanc: {
           className: "btn btn-sm btn-warning",
           icon: "fa fa-remove",
           display: "none",
           onclick: (but) => {
             var target = but.target;
             if (target.tagName == "I") {
               target = but.target.parentNode;
             }
             this.butRowCancel(target);
           },
         },
      };

# References (Obsolete, needs updating)

Some page explaining the use of bootstable:

* https://medium.com/@diyifang/bootstable-js-editable-table-with-bootstrap-6694f016f1b8
* https://codepen.io/diyifang/pen/mXdQmB
* http://ivanovdmitry.com/blog/post/create-editable-tables-with-jquery-and-bootstrap-bootstable
