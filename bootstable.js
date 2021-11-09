/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.5
 @author Tito Hinostroza
 @contributors Tyler Hardison
*/
"use strict";
//Global variables
var params = null; //Parameters
var colsEdi = null;
var newColHtml =
  '<div class="btn-group float-end">' +
  '<button id="bEdit" type="button" class="btn btn-sm btn-primary" onclick="butRowEdit(this);">' +
  '<span class="fa fa-pencil" > </span>' +
  "</button>" +
  '<button id="bElim" type="button" class="btn btn-sm btn-danger" onclick="butRowDelete(this);">' +
  '<span class="fa fa-trash" > </span>' +
  "</button>" +
  '<button id="bAcep" type="button" class="btn btn-sm btn-success" style="display:none;" onclick="butRowAcep(this);">' +
  '<span class="fa fa-check" > </span>' +
  "</button>" +
  '<button id="bCanc" type="button" class="btn btn-sm btn-warning" style="display:none;" onclick="butRowCancel(this);">' +
  '<span class="fa fa-remove" > </span>' +
  "</button>" +
  "</div>";
//Case NOT Bootstrap
var newColHtml2 =
  '<div class="btn-group float-end">' +
  '<button id="bEdit" type="button" class="btn btn-sm btn-primary" onclick="butRowEdit(this);">' +
  '<span class="fa fa-pencil" > ✎ </span>' +
  "</button>" +
  '<button id="bElim" type="button" class="btn btn-sm btn-danger" onclick="butRowDelete(this);">' +
  '<span class="fa fa-trash" > X </span>' +
  "</button>" +
  '<button id="bAcep" type="button" class="btn btn-sm btn-success" style="display:none;" onclick="butRowAcep(this);">' +
  '<span class="fa fa-check" > ✓ </span>' +
  "</button>" +
  '<button id="bCanc" type="button" class="btn btn-sm btn-warning" style="display:none;" onclick="butRowCancel(this);">' +
  '<span class="fa fa-remove" > → </span>' +
  "</button>" +
  "</div>";

var colEdicHtml = document.createElement("td");
colEdicHtml.setAttribute("name", "buttons");
colEdicHtml.innerHTML = newColHtml;

function SetEditable(element, options) {
  var defaults = {
    columnsEd: null, //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
    $addButton: null, //Selector for Add Button
    bootstrap: true, //Indicates bootstrap is present.
    defaultValues: [], // set default values on add
    addButtonEdit: true, // set fields to editable when add
    onEdit: function () {}, //Called after edition
    onBeforeDelete: function () {}, //Called before deletion
    onDelete: function () {}, //Called after deletion
    onAdd: function () {}, //Called when added a new row
  };

  params = _extend(defaults, options);

  var $tabedi = element; //Read reference to the current table.
  const addButtonTh = document.createElement("th");
  addButtonTh.setAttribute("name", "buttons");
  if (params.$addButton) {
    const addButton = document.createElement("button");
    addButton.setAttribute("class", "btn btn-success");
    addButton.id = params.$addButton;
    addButton.addEventListener("onclick", () => {
      if (params.addButtonEdit) rowAddNewAndEdit(element, params.defaultValues);
      else rowAddNew(element);
    });
    const glyph = document.createElement("i");
    glyph.setAttribute("fa fa-plus");
    addButton.appendChild(glyph);

    addButtonTh.appendChild(addButton);
  }
  document.querySelectorAll(`#${element} thead tr`)[0].appendChild(addButtonTh);

  if (!params.bootstrap) {
    colEdicHtml.innerHTML = `<td name="buttons">${newColHtml2}</td>`;
  }
  //Add column for buttons to all rows.
  const rows = document.querySelectorAll(`#${element} tbody tr`);

  for (const row of rows) {
    row.appendChild(colEdicHtml);
  }

  //Process "columnsEd" parameter
  if (params.columnsEd != null) {
    //Extract felds
    colsEdi = params.columnsEd.split(",");
  }
}

function IterarCamposEdit($cols, action) {
  //Iterate through editable fields in a row
  var n = 0;
  for (const col of $cols) {
    n++;
    if (col.getAttribute("name") == "buttons") return; //Exclude buttons column
    if (!IsEditable(n - 1)) return; //It's not editable
    action(col);
  }
}

function IsEditable(idx) {
  //Indicates if the passed column is set to be editable
  if (colsEdi == null) {
    //no se definió
    return true; //todas son editable
  } else {
    //hay filtro de campos
    for (var i = 0; i < colsEdi.length; i++) {
      if (idx == colsEdi[i]) return true;
    }
    return false; //no se encontró
  }
}

function ModoEdicion($row) {
  if ($row.id == "editing") {
    return true;
  } else {
    return false;
  }
}
//Set buttons state
function SetButtonsNormal(but) {
  const children = but.childNodes();
  for (var child of children) {
    switch (child.id) {
      case "bAcep":
        child.style.display = "none";
        break;
      case "bCanc":
        child.style.display = "none";
        break;
      case "bEdit":
        child.style.display = "block";
        break;
      case "bElim":
        child.style.display = "block";
        break;
    }
  }
  but.parentNode.parentNode.setAttribute("id", "");
}

function SetButtonsEdit(but) {
  const children = but.childNodes();
  for (var child of children) {
    switch (child.id) {
      case "bAcep":
        child.style.display = "block";
        break;
      case "bCanc":
        child.style.display = "block";
        break;
      case "bEdit":
        child.style.display = "none";
        break;
      case "bElim":
        child.style.display = "none";
        break;
    }
  }
  but.parentNode.parentNode.setAttribute("id", "editing");
}
//Events functions
function butRowAcep(but) {
  //Acepta los cambios de la edición
  var $row = but.parentNode.parentNode; //accede a la fila
  var $cols = $row.querySelectorAll("td"); //lee campos
  if (!ModoEdicion($row)) return; //Ya está en edición
  //Está en edición. Hay que finalizar la edición
  IterarCamposEdit($cols, function ($td) {
    //itera por la columnas
    var cont = $td.value; //lee contenido del input
    $td.innerHTML = cont; //fija contenido y elimina controles
  });
  SetButtonsNormal(but);
  params.onEdit($row);
}
function butRowCancel(but) {
  //Rechaza los cambios de la edición
  var $row = but.parentNode.parentNode; //accede a la fila
  var $cols = $row.querySelectorAll("td"); //lee campos
  if (!ModoEdicion($row)) return; //Ya está en edición
  //Está en edición. Hay que finalizar la edición
  IterarCamposEdit($cols, function ($td) {
    //itera por la columnas
    var cont = ($td.querySelectorAll("div").innerHTML = ""); //lee contenido del div
    $td.html(cont); //fija contenido y elimina controles
  });
  SetButtonsNormal(but);
}
function butRowEdit(but) {
  //Start the edition mode for a row.
  var $row = but.parentNode.parentNode; //accede a la fila
  var $cols = $row.querySelectorAll("td"); //lee campos
  if (ModoEdicion($row)) return; //Ya está en edición
  //Pone en modo de edición
  var focused = false; //flag
  IterarCamposEdit($cols, function ($td) {
    //itera por la columnas
    var cont = ($td.innerHTML = ""); //lee contenido
    //Save previous content in a hide <div>
    var div = '<div style="display: none;">' + cont + "</div>";
    var input = '<input class="form-control input-sm"  value="' + cont + '">';
    $td.innerHTML = div + input; //Set new content
    //Set focus to first column
    if (!focused) {
      $td.querySelectorAll("input")[0].focus();
      focused = true;
    }
  });
  SetButtonsEdit(but);
}
function butRowDelete(but) {
  //Elimina la fila actual
  var $row = but.parentNode.parentNode; //accede a la fila
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
  var $tab_en_edic = document.getElementByID(tabId); //Table to edit

  var $row = $tab_en_edic.querySelectorAll("thead tr")[0]; //encabezado
  var $cols = $row.querySelectorAll("th"); //lee campos
  //construye html
  var i = 0;
  var tr = document.createElement("tr");

  for (const col of $cols) {
    if (col.getAttribute("name") == "buttons") {
      //Es columna de botones
      tr.appendChild(colEdicHtml);
    } else {
      const td = document.createElement("td");
      if (i < initValues.length) {
        const value = document.createTextNode(initValues[i]);
        td.appendChild(value);
        tr.appendChild(td);
      } else {
        tr.appendChild(td);
      }
    }
    i++;
  }
  $tab_en_edic.querySelectorAll("tbody")[0].appendChild(tr);
  params.onAdd();
}
function rowAddNewAndEdit(tabId, initValues = []) {
  /* Add a new row an set edition mode */
  rowAddNew(tabId, initValues);
  var $lastRow = document
    .getElementById(tabId)
    .querySelectorAll("tbody")[0].lastChild;
  butRowEdit($lastRow.getElementByID("bEdit")); //Pass a button reference
}
function TableToCSV(tabId, separator) {
  //Convert table to CSV
  var datFil = "";
  var tmp = "";
  var $tab_en_edic = document.getElementById(tabId); //Table source
  for (const row of $tab_en_edic.querySelectorAll("tbody tr")) {
    //Termina la edición si es que existe
    if (ModoEdicion(row)) {
      var evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      // If cancelled, don't dispatch our event
      var canceled = !row.getElementByID("bAcep").dispatchEvent(evt);
    }
  }

  var $cols = $tab_en_edic.querySelectorAll("td"); //lee campos
  datFil = "";
  for (const col of $cols) {
    if (col.getAttribute("name") == "buttons") {
      //Es columna de botones
      continue;
    } else {
      datFil = datFil + col.innerHTML + separator;
    }
  }
  if (datFil != "") {
    datFil = datFil.substr(0, datFil.length - separator.length);
  }
  tmp = tmp + datFil + "\n";
  return tmp;
}

function TableToJson(tabId) {
  var obj = [];
  const table = document.getElementByID(tabId);
  const headersHtml = table.querySelectorAll("thead tr th");
  var headers = [];

  for (const head of headersHtml) {
    headers.push(head.innerHTML);
  }

  const rows = table.querySelectorAll("tbody tr");

  for (const row of rows) {
    var count = 0;
    obj.push({});
    for (const field of row.querySelectorAll("td")) {
      obj[obj.length - 1][headers[count]] = field.innerHTML;
      count++;
    }
  }

  return JSON.Stringify(obj);
}

function _extend(a, b) {
  for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
}
