## Donate to the project

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7LKYWG9LXNQ9C&lc=ES&item_name=Tito%20Hinostroza&item_number=2153&no_note=0&cn=Dar%20instrucciones%20especiales%20al%20vendedor%3a&no_shipping=2&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

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

* Jquery
* Bootstrap

Bootstrap is necessary to format correctly the controls used, and to draw icons.
It's possible to work without Bootstrap too. In this case style is missing.

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

      $('.mytable').SetEditable();  //BAD! No class reference allowed.
      $('table').SetEditable();     //BAD! No several tables allowed.

If several tables need to be editable in a same Web page, it's needed to set each table:

      $('#mytable1').SetEditable();       //GOOD!
      $('#mytable2').SetEditable();       //GOOD!

LIMITATION: When using several editable tables, events won't work properly.

## Examples

Sets all the columns of #mytable editable:

      $('#mytable').SetEditable();

Sets the columns 0 and 1 of #mytable editable:

      $('#mytable').SetEditable({
                    columnsEd: "0,1" //editable columns 
      });

Includes a "New row" button (Obsolete):

      $('#mytable').SetEditable({
                    columnsEd: "0,1", 
                    $addButton: $('#but_add')
      });

Includes a "New row" button (Prefered):

      $('#mytable').SetEditable();

      $('#but_add').click(function() {
            rowAddNew('table-list');
      });

Set a "New row" button to add a row and set initial values:

      $('#mytable').SetEditable();

      $('#but_add').click(function() {
            rowAddNew('table-list', [1,2,3]);
      });

Set a "New row" button to add a row, set initial values and turn to edit mode:

      $('#mytable').SetEditable();

      $('#but_add').click(function() {
            rowAddNewAndEdit('table-list', [1,2,3]);
      });

Parameters:

      columnsEd: null,         //Index to editable columns. If null, all columns will be editables. Ex.: "1,2,3,4,5"
      $addButton: null,        //Jquery object of "Add" button. OBSOLETE. 
      bootstrap: true,         //Indicates if library is going to worl with Bootstrap library.
      onEdit: function() {},   //Called after edition
      onBeforeDelete: function() {}, //Called before deletion
      onDelete: function() {}, //Called after deletion
      onAdd: function() {}     //Called when added a new row

# Utilities

There are two functions, included in the library, to facilitate the export of the table:

* function TableToCSV(tabId, separator)
* function TableToJson(tabId)

These functions return a string in the appropriate format (CSV or JSON) from any HTML table.

# References

Some page explaining the use of bootstable:

* https://medium.com/@diyifang/bootstable-js-editable-table-with-bootstrap-6694f016f1b8
* https://codepen.io/diyifang/pen/mXdQmB
* http://ivanovdmitry.com/blog/post/create-editable-tables-with-jquery-and-bootstrap-bootstable
