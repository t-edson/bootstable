/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
  "use strict";
  // Global variables
  var params = null;  		//Parameters
  var colsEdi =null;
  var newColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="rowEdit(this);">' +
'<span class="glyphicon glyphicon-pencil" > </span>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default" onclick="rowElim(this);">' +
'<span class="glyphicon glyphicon-trash" > </span>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowAcep(this);">' + 
'<span class="glyphicon glyphicon-ok" > </span>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowCancel(this);">' + 
'<span class="glyphicon glyphicon-remove" > </span>'+
'</button>'+
    '</div>';
  var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>'; 
    
  $.fn.SetEditable = function (options) {
    var defaults = {
        columnsEd: null,         // Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        // Jquery object of "Add" button
        onEdit: function() {},   // Called after edition
		onBeforeDelete: function() {}, // Called before deletion
        onDelete: function() {}, // Called after deletion
        onAdd: function() {}     // Called when added a new row
    };
    params = $.extend(defaults, options);
    this.find('thead tr').append('<th name="buttons"></th>');  // Empty header
    this.find('tbody tr').append(colEdicHtml);
	var $tabedi = this;   // Read reference to the current table, to resolve "this" here.
    // Process "addButton" parameter
    if (params.$addButton != null) {
        // A parameter was provided
        params.$addButton.click(function() {
            rowAddNew($tabedi.attr("id"));
        });
    }
    // Process "columnsEd" parameter
    if (params.columnsEd != null) {
        // Extract felds
        colsEdi = params.columnsEd.split(',');
    }
  };
function IterarCamposEdit($cols, tarea) {
// Iterate through the editable fields of a row
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  // Exclude the column with buttons
        if (!EsEditable(n-1)) return;   // It is not an editable field
        tarea($(this));
    });
    
    function EsEditable(idx) {
    // Indicates if the column given is set up to be editable
        if (colsEdi==null) {  // Not defined
            return true;  // All are editable
        } else {  // There is a filter for fields
// alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  // Was not found
        }
    }
}
function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  // Access to the row
    $row.attr('id', '');  // Remove the mark
}
function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  // Access to the row
    $row.attr('id', 'editing');  // Indicates it is on edition
}
function ModoEdicion($row) {
    if ($row.attr('id')=='editing') {
        return true;
    } else {
        return false;
    }
}
function rowAcep(but) {
// Accepts changes of the editon
    var $row = $(but).parents('tr');  // Access to the row
    var $cols = $row.find('td');  // Read field
    if (!ModoEdicion($row)) return;  // It is already in edition
    // It is on edition. Have to ends edition
    IterarCamposEdit($cols, function($td) {  // Iterates through the columns
      var cont = $td.find('input').val(); // Reads content of the input
      $td.html(cont);  // Sets the content and deletes the controls
    });
    FijModoNormal(but);
    params.onEdit($row);
}
function rowCancel(but) {
// Rejects changes of the edition
    var $row = $(but).parents('tr');  // Access to the row
    var $cols = $row.find('td');  // Reads fields
    if (!ModoEdicion($row)) return;  // It is already in edition
    // It is on edition. Have to ends edition
    IterarCamposEdit($cols, function($td) { // Iterates through the columns
        var cont = $td.find('div').html(); // Reads content of the 'div'
        $td.html(cont);  // Sets content and deletes the controls
    });
    FijModoNormal(but);
}
function rowEdit(but) {  // Inits row's edition
    var $row = $(but).parents('tr');  // Access to the row
    var $cols = $row.find('td');  // Reads fields
    if (ModoEdicion($row)) return;  // It is already in edition
    // Sets in edition mode
    IterarCamposEdit($cols, function($td) {  // Iterates through the columns
        var cont = $td.html(); // Reads content
        var div = '<div style="display: none;">' + cont + '</div>';  // Save content
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        $td.html(div + input);  // Sets content
    });
    FijModoEdit(but);
}
function rowElim(but) {  // Deletes current row
    var $row = $(but).parents('tr');  // Access to the row
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}
function rowAddNew(tabId) {  // Adds row to the given table
var $tab_en_edic = $("#" + tabId);  // Table to edit
    var $filas = $tab_en_edic.find('tbody tr');
    if ($filas.length==0) {
        // No hay filas de datos. Hay que crearlas completas
        // There are no rows of data. Has to create them
        var $row = $tab_en_edic.find('thead tr');  // Header
        var $cols = $row.find('th');  // Read fields
        // Build html
        var htmlDat = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                // It is column of buttons
                htmlDat = htmlDat + colEdicHtml;  // Adds buttons
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
    } else {
        // There are other rows, clones the last row to copy buttons
        var $ultFila = $tab_en_edic.find('tr:last');
        $ultFila.clone().appendTo($ultFila.parent());  
        $ultFila = $tab_en_edic.find('tr:last');
        var $cols = $ultFila.find('td');  // Reads fields
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                // It is a column of buttons
            } else {
                $(this).html('');  // Clears content
            }
        });
    }
	params.onAdd();
}
function TableToCSV(tabId, separator) {  // Converts HTML table to CSV
    var datFil = '';
    var tmp = '';
	var $tab_en_edic = $("#" + tabId);  // Table source
    $tab_en_edic.find('tbody tr').each(function() {
        // If there is edition, it ends
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  // Accepts edition
        }
        var $cols = $(this).find('td');  // Reads fields
        datFil = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                // It is a column of buttons
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil!='') {
            datFil = datFil.substr(0, datFil.length-separator.length); 
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}
