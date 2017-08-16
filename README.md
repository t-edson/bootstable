# Bootstable
Javascript library to make HMTL tables editable, using Bootstrap

"boots_table" is a javascript library, that lets convert a HTML static table to a editable table. 
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

Parameters:

        columnsEd: null,    //Index to editable columns: "1,2,3,4,5"
        $addButton: null,   //Jquery Add button
        onEdit: function() {},   //Edit event
        onDelete: function() {}, //Delete event
        onAdd: function() {}     //Add event
