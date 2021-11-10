/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.5
 @author Tito Hinostroza
 @contributors Tyler Hardison
*/
"use strict";

class bootstable {
  constructor(/** @type string */ element, /** @type object */ options) {
    var defaults = {
      columnsEd: [], //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
      $addButton: null, //Selector for Add Button
      exportCsvButton: false, // Add an export to CSV button
      exportJsonButton: false, // Add an export to JSON button
      defaultValues: [], // set default values on add
      addButtonEdit: true, // set fields to editable when add
      buttons: null,
      customInputs: [], // Add in custom form fields
      onEditSave: function () {}, //Called after edition
      onBeforeDelete: function () {}, //Called before deletion
      onDelete: function () {}, //Called after deletion
      onAdd: function () {}, //Called when added a new row
    };
    this.table = document.getElementById(element);
    this.headers = this._getTableHeaders(this.table);
    this.params = this._extend(defaults, options);
    this.colEdicHtml = document.createElement("td");
    this.colEdicHtml.setAttribute("name", "buttons");
    this.colEdicHtml.appendChild(
      this._buildDefaultButtons(this.params.buttons)
    );
    this.SetEditable(element);
  }

  SetEditable(/** @type string */ element) {
    const addButtonTh = document.createElement("th");
    addButtonTh.style.whiteSpace = "nowrap";
    addButtonTh.style.width = "6.3vw";
    addButtonTh.setAttribute("name", "buttons");
    if (this.params.exportCsvButton) {
      const csvButton = document.createElement("button");
      csvButton.className = "btn btn-secondary btn-sm float-end";
      csvButton.id = "btnCsv";
      csvButton.addEventListener("click", () => {
        this.TableToCSV(element, ",", true, `${element}.export.csv`);
      });
      csvButton.setAttribute("text", "Export to CSV");
      const glyph = document.createElement("i");
      glyph.className = "bi bi-file-spreadsheet";
      csvButton.appendChild(glyph);
      addButtonTh.appendChild(csvButton);
    }
    if (this.params.exportCsvButton) {
      const csvButton = document.createElement("button");
      csvButton.className = "btn btn-secondary btn-sm float-end";
      csvButton.id = "btnJson";
      csvButton.addEventListener("click", () => {
        this.TableToJSON(element, true, `${element}.export.csv`);
      });
      csvButton.setAttribute("text", "Export to JSON");
      const glyph = document.createElement("i");
      glyph.className = "bi bi-file-code";
      csvButton.appendChild(glyph);
      addButtonTh.appendChild(csvButton);
    }

    if (this.params.$addButton) {
      const addButton = document.createElement("button");
      addButton.className = "btn btn-success btn-sm float-end";
      addButton.id = this.params.$addButton;
      addButton.addEventListener("click", () => {
        if (this.params.addButtonEdit)
          this.rowAddNewAndEdit(element, this.params.defaultValues);
        else this.rowAddNew(element);
      });
      addButton.setAttribute("text", "Add New Row");
      const glyph = document.createElement("i");
      glyph.className = "bi bi-plus";
      addButton.appendChild(glyph);

      addButtonTh.appendChild(addButton);
    }

    document
      .querySelectorAll(`#${element} thead tr`)[0]
      .appendChild(addButtonTh);

    //Add column for buttons to all rows.
    const rows = document.querySelectorAll(`#${element} tbody tr`);

    for (var i = 0; i < rows.length; i++) {
      var td = document.createElement("td");
      td.setAttribute("name", "buttons");
      td.appendChild(this._buildDefaultButtons(this.params.buttons));
      rows[i].appendChild(td);
    }

    //Process "columnsEd" parameter
    if (this.params.columnsEd != null) {
      //Extract felds
      this.colsEdi = this.params.columnsEd;
    }
  }

  /**
   *
   * @param array $cols
   * @param {action} action - process table cell
   */

  /**
   * Callback to handle interated cells.
   * @callback action
   * @param {object} boots - reference to self
   * @param {object} tableCell
   * @param {number} index
   */
  IterarCamposEdit(/** @type array */ $cols, /** @type function */ action) {
    //Iterate through editable fields in a row
    var n = -1;
    for (const col of $cols) {
      n++;
      if (col.style.display == "none") continue; // Ignore Hidden Columns
      if (col.getAttribute("name") == "buttons") continue; //Exclude buttons column
      if (!this.IsEditable(n)) continue; //It's not editable
      action(this, col, n);
    }
  }

  IsEditable(/** @type number */ idx) {
    //Indicates if the passed column is set to be editable
    if (this.colsEdi.length == 0) return true;
    return this.colsEdi.includes(idx);
  }

  ModoEdicion(/** @type array */ $row) {
    if ($row.id == "editing") {
      return true;
    } else {
      return false;
    }
  }
  //Set buttons state
  SetButtonsNormal(/** @type HTMLElement */ but) {
    const children = but.parentNode.childNodes;
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
    but.parentNode.parentNode.parentNode.setAttribute("id", "");
  }

  SetButtonsEdit(/** @type HTMLElement */ but) {
    const children = but.parentNode.childNodes;
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
    but.parentNode.parentNode.parentNode.setAttribute("id", "editing");
  }
  //Events functions
  butRowAcep(/** @type HTMLElement */ but) {
    //Acepta los cambios de la edición
    var $row = but.parentNode.parentNode.parentNode; //accede a la fila
    var $cols = $row.querySelectorAll("td"); //lee campos
    if (!this.ModoEdicion($row)) return; //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    this.IterarCamposEdit($cols, function (boots, $td, index) {
      //itera por la columnas
      var cont = $td.querySelector("input").value; //lee contenido del input
      $td.innerHTML = cont; //fija contenido y elimina controles
    });
    this.SetButtonsNormal(but);
    this.params.onEditSave($row);
  }
  butRowCancel(/** @type HTMLElement */ but) {
    //Rechaza los cambios de la edición
    var $row = but.parentNode.parentNode.parentNode; //accede a la fila
    var $cols = $row.querySelectorAll("td"); //lee campos
    if (!this.ModoEdicion($row)) return; //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    this.IterarCamposEdit($cols, function (boots, $td, index) {
      //itera por la columnas
      var cont = $td.querySelector("div").innerHTML; //lee contenido del div
      $td.innerHTML = cont; //fija contenido y elimina controles
    });
    this.SetButtonsNormal(but);
  }
  butRowEdit(/** @type HTMLElement */ but) {
    //Start the edition mode for a row.
    var $row = but.parentNode.parentNode.parentNode; //accede a la fila
    var $cols = $row.querySelectorAll("td"); //lee campos
    if (this.ModoEdicion($row)) return; //Ya está en edición
    //Pone en modo de edición
    var focused = false; //flag

    this.IterarCamposEdit($cols, function (boots, $td, index) {
      //itera por la columnas
      var cont = $td.innerHTML; //lee contenido
      $td.innerHTML = "";
      //Save previous content in a hide <div>
      var div = document.createElement("div");
      div.style.display = "none";
      var divText = document.createTextNode(cont);
      div.appendChild(divText);

      $td.appendChild(div);
      var input;
      if (boots.customInputs && boots.customInputs.length > 0) {
        input = boots._customInput(
          boots,
          boots.customInputs[index],
          cont,
          index
        );
      } else {
        input = document.createElement("input");
        input.className = "form-control form-control-sm";
        input.value = cont;
        input.setAttribute("name", boots.headers[index]);
      }
      $td.appendChild(input);
      //Set focus to first column
      if (!focused) {
        $td.querySelectorAll("input")[0].focus();
        focused = true;
      }
    });
    this.SetButtonsEdit(but);
  }
  butRowDelete(/** @type HTMLElement */ but) {
    //Elimina la fila actual
    var $row = but.parentNode.parentNode.parentNode; //accede a la fila
    this.params.onBeforeDelete($row);
    $row.remove();
    this.params.onDelete();
  }
  //Functions that can be called directly
  rowAddNew(/** @type string */ tabId, /** @type array */ initValues = []) {
    /* Add a new row to a editable table. 
   Parameters: 
    tabId       -> Id for the editable table.
    initValues  -> Optional. Array containing the initial value for the 
                   new row.
  */
    var $tab_en_edic = document.getElementById(tabId); //Table to edit

    var $row = $tab_en_edic.querySelectorAll("thead tr")[0]; //encabezado
    var $cols = $row.querySelectorAll("th"); //lee campos
    //construye html
    var i = 0;
    var tr = document.createElement("tr");

    for (const col of $cols) {
      if (col.style.display == "none") {
        const td = document.createElement("td");
        td.style.display = "none";
        td.setAttribute("role", col.getAttribute("role"));
        tr.appendChild(td);
      } else if (col.getAttribute("name") == "buttons") {
        //Es columna de botones
        tr.appendChild(this.colEdicHtml);
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
    this.params.onAdd(tr);
  }
  rowAddNewAndEdit(
    /** @type string */ tabId,
    /** @type array */ initValues = []
  ) {
    /* Add a new row an set edition mode */
    this.rowAddNew(tabId, initValues);
    var $lastRow = document
      .getElementById(tabId)
      .querySelectorAll("tbody")[0].lastChild;
    this.butRowEdit($lastRow.querySelector("#bEdit")); //Pass a button reference
  }
  TableToCSV(
    /** @type string */ tabId,
    /** @type string */ separator,
    /** @type boolean */ download = false,
    /** @type string */ filename = null
  ) {
    //Convert table to CSV
    var csv = [];

    var $tab_en_edic = document.getElementById(tabId); //Table source
    const headers = this._getTableHeaders($tab_en_edic);

    csv.push(headers);

    for (const row of $tab_en_edic.querySelectorAll("tbody tr")) {
      var $cols = row.querySelectorAll("td"); //lee campos
      csv.push([]);
      for (const col of $cols) {
        if (col.getAttribute("name") == "buttons") {
          //Es columna de botones
          continue;
        } else {
          csv[csv.length - 1].push(col.innerHTML);
        }
      }
    }
    var csvString = "";
    for (const csvRow of csv) {
      csvString += csvRow.join(separator) + "\n";
    }
    if (download && filename) {
      this._download(filename, csvString, "application/csv");
    }
    return csvString;
  }

  TableToJson(
    /** @type string */ tabId,
    /** @type boolean */ download = false,
    /** @type string */ filename = null
  ) {
    var obj = [];
    const table = document.getElementById(tabId);
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
        if (field.getAttribute("name") == "buttons") continue;
        obj[obj.length - 1][headers[count]] = field.innerHTML;
        count++;
      }
    }

    if (download) {
      this._download(filename, JSON.stringify(obj), "application/json");
    }
    return JSON.stringify(obj);
  }

  _extend(/** @type object */ a, /** @type object */ b) {
    for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
    return a;
  }

  _buildDefaultButtons(/** @type object */ buttonOverride = {}) {
    const buttons = {
      bEdit: {
        className: "btn btn-sm btn-primary",
        icon: "bi bi-pencil",
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
        icon: "bi bi-trash",
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
        icon: "bi bi-check",
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
        icon: "bi bi-x-circle",
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

    this.localbuttons = this._extend(buttons, buttonOverride);

    const div = document.createElement("div");
    div.className = "d-grid gap-2 d-md-flex justify-content-md-end";

    for (const button in this.localbuttons) {
      const thisButton = document.createElement("button");
      thisButton.id = button;
      thisButton.className = this.localbuttons[button].className;
      thisButton.style.display = this.localbuttons[button].display;
      thisButton.addEventListener("click", this.localbuttons[button].onclick);
      const icon = document.createElement("i");
      icon.className = this.localbuttons[button].icon;
      thisButton.appendChild(icon);
      div.appendChild(thisButton);
    }
    return div;
  }
  _download(
    /** @type string */ filename,
    /** @type string */ text,
    /** @type string */ mimetype = "text/plain"
  ) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${mimetype};charset=utf-8,${encodeURIComponent(text)}`
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  _getTableHeaders(/** @type HTMLElement */ table) {
    const headersHtml = table.querySelectorAll("thead tr th");
    var headers = [];

    for (const head of headersHtml) {
      if (head.getAttribute("name") == "buttons") continue;
      headers.push(head.innerHTML);
    }
    return headers;
  }

  _customInput(
    /** @type object */ boots,
    /** @type object */ inputObj,
    /** @type string */ value = null,
    /** @type number */ index
  ) {
    const input = document.createElement(inputObj.element);
    if (input.element === "input") input.setAttribute("type", inputObj.type);
    input.className = inputObj.className;
    input.setAttribute("name", inputObj.name);
    if (value) input.value = value;
    else if (boots.defaultValues.length > 0)
      input.value = boots.defaultValues[index];
    return input;
  }
}
