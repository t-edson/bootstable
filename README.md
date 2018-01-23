# Bootstable
Javascript library to make HMTL tables editable, using Bootstrap

"Bootstable" is a javascript library (plug-in), that lets convert a HTML static table to a editable table. 
A table is made editable, including several buttons to perform the edition actions.

Edition options includes:

* Edit fields.
* Remove rows.
* Add rows. (require and aditional button)

Dependencies:

* Jquery
* Bootstrap

Bootstrap is necessary to format correctly the controls used, and to draw icons.

No database connection is included. The library was designed to work offline.

Examples:

Sets all the columns of #mytable editable:

      $('#mytable').SetEditable();

Sets the columns 0 and 1 of #mytable editable:

      $('#mytable').SetEditable({
                    columnsEd: "0,1" //editable columns 
      });

Includes a "New row" button:

      $('#mytable').SetEditable({
                    columnsEd: "0,1", 
                    $addButton: $('#but_add')
      });

IMPORTANT: Bootstable need the ID of the table to edit, and can only work on a single table. 

      $('.mytable').SetEditable();    //BAD. No class.
      $('table').SetEditable();    //BAD. No several tables

If several tables need to be editable in a same Web page, it's needed to set each table:

      $('#mytable1').SetEditable();
      $('#mytable2').SetEditable();

Parameters:

        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        //Jquery object of "Add" button
        onEdit: function() {},   //Called after edition
        onBeforeDelete: function() {}, //Called before deletion
        onDelete: function() {}, //Called after deletion
        onAdd: function() {}     //Called when added a new row
