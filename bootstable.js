/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
"use strict";
//Global variables
var params = null;  		//Parameters
var colsEdi =null;
var colsTyp = null;
var colsSel = null;
var colsCheck = null;
var newColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="butRowEdit(this);">' +
'<span class="glyphicon glyphicon-pencil" > </span>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default" onclick="butRowDelete(this);">' +
'<span class="glyphicon glyphicon-trash" > </span>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowAcep(this);">' + 
'<span class="glyphicon glyphicon-ok" > </span>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowCancel(this);">' + 
'<span class="glyphicon glyphicon-remove" > </span>'+
'</button>'+
  '</div>';
  //Case NOT Bootstrap
  var newColHtml2 = '<div class="btn-group pull-right">'+
  '<button id="bEdit" type="button" class="btn btn-sm btn-default" onclick="butRowEdit(this);">' +
  '<span class="glyphicon glyphicon-pencil" > ✎ </span>'+
  '</button>'+
  '<button id="bElim" type="button" class="btn btn-sm btn-default" onclick="butRowDelete(this);">' +
  '<span class="glyphicon glyphicon-trash" > X </span>'+
  '</button>'+
  '<button id="bAcep" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowAcep(this);">' + 
  '<span class="glyphicon glyphicon-ok" > ✓ </span>'+
  '</button>'+
  '<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="butRowCancel(this);">' + 
  '<span class="glyphicon glyphicon-remove" > → </span>'+
  '</button>'+
    '</div>';
var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>'; 
$.fn.SetEditable = function (options) {
    var defaults = {
        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        columnsType: null,         //Columns types (date,text,number,...)
        columnsSelect: null,       // Works with columnsType = select example columnsSelect : [2,{"choice1","choice2","choice3"}]
        columnsCheck: null,       // Works with columnsType = checkbox example columnsCheck : [2,{"YES","NO"}]
        $addButton: null,        //Jquery object of "Add" button
        bootstrap: true,         //Indicates bootstrap is present.
        onEdit: function () {
        },   //Called after edition
        onBeforeDelete: function () {
        }, //Called before deletion
        onDelete: function () {
        }, //Called after deletion
        onAdd: function () {
        }     //Called when added a new row
    };
    params = $.extend(defaults, options);
    var $tabedi = this;   //Read reference to the current table.
    $tabedi.find('thead tr').append('<th name="buttons"></th>');  //Add empty column
    if (!params.bootstrap) {
        colEdicHtml = '<td name="buttons">' + newColHtml2 + '</td>';
    }
    //Add column for buttons to all rows.
    $tabedi.find('tbody tr').append(colEdicHtml);
    //Process "addButton" parameter
    if (params.$addButton != null) {
        //There is parameter
        params.$addButton.click(function () {
            rowAddNew($tabedi.attr("id"));
        });
    }
    //Process "columnsEd" parameter
    if (params.columnsEd != null) {
        //Extract felds
        colsEdi = params.columnsEd.split(',');
    }

    //Process "columnsEd" parameter
    if (params.columnsType != null) {
        //Extract felds
        colsTyp = params.columnsType.split(',');
    }

    if (params.columnsSelect != null) {
        //Extract options
        colsSel = params.columnsSelect;
    }

    if (params.columnsCheck != null) {
        //Extract options
        colsCheck = params.columnsCheck;
    }


};

function IterarCamposEdit($cols, action) {
//Iterate through editable fields in a row
    var n = 0;
    $cols.each(function () {
        n++;
        if ($(this).attr('name') == 'buttons') return;  //Exclude buttons column
        if (!IsEditable(n - 1)) return;   //It's not editable
        action($(this));
    });

    function IsEditable(idx) {
        //Indicates if the passed column is set to be editable
        if (colsEdi == null) {  //no se definió
            return true;  //todas son editable
        } else {  //hay filtro de campos
            for (var i = 0; i < colsEdi.length; i++) {
                if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontró
        }
    }
}

function ModoEdicion($row) {
    if ($row.attr('id') == 'editing') {
        return true;
    } else {
        return false;
    }
}

//Set buttons state
function SetButtonsNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}

function SetButtonsEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que está en edición
}

//Events functions
function butRowAcep(but) {
//Acepta los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function ($td) {  //itera por la columnas
        var ele = $td.find('input,select'); //lee contenido del input
        var cont = ele.val();


        if (ele.attr('type') === 'checkbox') {
            try {
                var opts = [];

                colsCheck.forEach(function (idx) {

                    try{
                    idx[$td.index()].forEach(function (idy) {
                        opts.push(idy);
                    });
                    }
                    catch (ex2)
                    {

                    }
                });

                cont = ele.is(':checked') ? opts[0] : opts[1];
            } catch (ex) {
                cont = ele.is(':checked') ? 'X':'-';
            }

        }


        $td.html(cont);  //fija contenido y elimina controles
    });
    SetButtonsNormal(but);
    params.onEdit($row);
}

function butRowCancel(but) {
//Rechaza los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function ($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    SetButtonsNormal(but);
}

function butRowEdit(but) {
    //Start the edition mode for a row.
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (ModoEdicion($row)) return;  //Ya está en edición
    //Pone en modo de edición
    var focused = false;  //flag
    IterarCamposEdit($cols, function ($td) {  //itera por la columnas
        var cont = $td.html(); //lee contenido
        //Save previous content in a hide <div>
        var div = '<div style="display: none;">' + cont + '</div>';

        var type = 'text';
        try {
            type = colsTyp[$td.index()];
        } catch (ex) {

        }
        var input = null;
        if (type === 'select') {
            try {

                var opts = [];
                colsSel.forEach(function (idx) {
                    idx[$td.index()].forEach(function (idy) {
                        opts.push(idy);
                    })
                });

                input = '<select class="form-control input-sm" >';

                opts.forEach(function (op) {
                    input += '<option>' + op + '</option>';
                });
                input += '</select>';

            } catch (ex) {
                alert(ex.message);
                type = 'text';
            }
        } else if (type === 'checkbox') {
            try {
                var opts = [];
                try {
                    colsCheck.forEach(function (idx) {
                        try{
                        idx[$td.index()].forEach(function (idy) {
                            opts.push(idy);
                        })
                        }catch (ex2){}
                    });
                } catch (ex) {
                    opts = ['true', 'false'];
                }

                input = '<div class="form-check"><input class="form-check-input " type="checkbox" ' + (cont === opts[0] ? 'checked' : '') + '></div>';
            } catch (ex) {
                type = 'text';
            }
        }
        if (input == null)
            input = '<input class="form-control input-sm" type="' + type + '" value="' + cont + '">';
        $td.html(div + input);  //Set new content
        //Set focus to first column
        if (!focused) {
            $td.find('input').focus();
            focused = true;
        }
    });
    SetButtonsEdit(but);
}

function butRowDelete(but) {  //Elimina la fila actual
    var $row = $(but).parents('tr');  //accede a la fila
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}

//Functions that can be called directly
function rowAddNew(tabId, initValues = []) {
    /* Add a new row to a editable table.
     Parameters:
      tabId       -> Id for the editable table.
      initValues  -> Optional. Array containing the initial value for the
                     new row.
    */
    var $tab_en_edic = $("#" + tabId);  //Table to edit
    var $rows = $tab_en_edic.find('tbody tr');
    //if ($rows.length==0) {
    //No hay filas de datos. Hay que crearlas completas
    var $row = $tab_en_edic.find('thead tr');  //encabezado
    var $cols = $row.find('th');  //lee campos
    //construye html
    var htmlDat = '';
    var i = 0;
    $cols.each(function () {
        if ($(this).attr('name') == 'buttons') {
            //Es columna de botones
            htmlDat = htmlDat + colEdicHtml;  //agrega botones
        } else {
            if (i < initValues.length) {
                htmlDat = htmlDat + '<td>' + initValues[i] + '</td>';
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        }
        i++;
    });
    $tab_en_edic.find('tbody').append('<tr>' + htmlDat + '</tr>');
    /*} else {
        //Hay otras filas, podemos clonar la última fila, para copiar los botones
        var $lastRow = $tab_en_edic.find('tr:last');
        $lastRow.clone().appendTo($lastRow.parent());
        $lastRow = $tab_en_edic.find('tr:last');
        var $cols = $lastRow.find('td');  //lee campos
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                $(this).html('');  //limpia contenido
            }
        });
    }*/
    params.onAdd();
}

function rowAddNewAndEdit(tabId, initValues = []) {
    /* Add a new row an set edition mode */
    rowAddNew(tabId, initValues);
    var $lastRow = $('#' + tabId + ' tr:last');
    butRowEdit($lastRow.find('#bEdit'));  //Pass a button reference
}

function TableToCSV(tabId, separator) {  //Convert table to CSV
    var datFil = '';
    var tmp = '';
    var $tab_en_edic = $("#" + tabId);  //Table source
    $tab_en_edic.find('tbody tr').each(function () {
        //Termina la edición si es que existe
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  //acepta edición
        }
        var $cols = $(this).find('td');  //lee campos
        datFil = '';
        $cols.each(function () {
            if ($(this).attr('name') == 'buttons') {
                //Es columna de botones
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil != '') {
            datFil = datFil.substr(0, datFil.length - separator.length);
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}

function TableToJson(tabId) {   //Convert table to JSON
    var json = '{';
    var otArr = [];
    var tbl2 = $('#' + tabId + ' tr').each(function (i) {
        var x = $(this).children();
        var itArr = [];
        x.each(function () {
            itArr.push('"' + $(this).text() + '"');
        });
        otArr.push('"' + i + '": [' + itArr.join(',') + ']');
    })
    json += otArr.join(",") + '}'
    return json;
}
