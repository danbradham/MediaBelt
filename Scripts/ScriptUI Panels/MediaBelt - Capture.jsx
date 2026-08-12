#include "(MediaBelt)/lib.jsx"


(function Belt(thisObj) {
  function init(thisObj) {
    /* Build UI */
    var ui =
      thisObj instanceof Panel
        ? thisObj
        : new Window("palette", "Media Belt Capture", undefined, { resizable: true });
    ui.title = "Media Belt Capture";
    ui.onResizing = ui.onResize = function () {
      thisObj.layout.resize();
    };

    var mark_panel = ui.add("panel", undefined, "Markers");
    mark_panel.orientation = "column";
    mark_panel.alignment = ["fill", "top"];

    var mark_row = mark_panel.add("group", undefined, "Mark Row");
    mark_row.orientation = "row";
    mark_row.alignChildren = ["fill", ""];

    var button_prev_still = mark_row.add("button", undefined, "<");
    button_prev_still.preferredSize.width = 48;
    button_prev_still.alignment = "left";
    button_prev_still.onClick = function () {
      goto_prev_still(app.project.activeItem);
    };

    var button_next_still = mark_row.add("button", undefined, ">");
    button_next_still.preferredSize.width = 48;
    button_next_still.alignment = "left";
    button_next_still.onClick = function () {
      goto_next_still(app.project.activeItem);
    };

    var button_add_still = mark_row.add("button", undefined, "Add");
    button_add_still.alignment = "left";
    button_add_still.onClick = function () {
      add_still(app.project.activeItem);
    };

    var button_remove_still = mark_row.add("button", undefined, "Remove");
    button_remove_still.alignment = "left";
    button_remove_still.onClick = function () {
      remove_still(app.project.activeItem);
    };

    var button_mark_still = mark_row.add("button", undefined, "Clear");
    button_mark_still.alignment = "left";
    button_mark_still.onClick = function () {
      clear_stills(app.project.activeItem);
    };

    var select_panel = ui.add("panel", undefined, "Select");
    select_panel.orientation = "column";
    select_panel.alignment = ["fill", "top"];
    select_panel.alignChildren = ["fill", ""];
    var select_row = select_panel.add("group", undefined, "Select Row");
    select_row.orientation = "row";
    select_row.alignChildren = ["fill", ""];

    var button_select_comps = select_row.add("button", undefined, "All Comps with Markers")
    button_select_comps.alignment = ["center", ""];
    button_select_comps.onClick = function () {
      select_comps_with_stills();
    };

    var export_panel = ui.add("panel", undefined, "Export");
    export_panel.orientation = "column";
    export_panel.alignment = ["fill", "top"];
    export_panel.alignChildren = ["fill", ""];

    var folder_row = export_panel.add("group", undefined, "Folder Row");
    folder_row.orientation = "row";
    folder_row.alignChildren = ["fill", ""]

    var folder_edit = folder_row.add("edittext", undefined, "");
    folder_edit.text = Folder.desktop.fsName;

    var button_browse = folder_row.add("button", undefined, "Browse");
    button_browse.maximumSize.width = 75;
    button_browse.minimumSize.width = 75;
    button_browse.alignment = ["right", ""];
    button_browse.onClick = function () {
      var folder = Folder.selectDialog("Choose a folder to save stills into.");
      folder_edit.text = folder.fsName;
    };

    var capture_row = export_panel.add("group", undefined, "Capture Button Row");
    capture_row.orientation = "row";
    capture_row.alignChildren = ["right", ""];

    var mode_current_comp = capture_row.add("radiobutton", undefined, "Current Comp");
    var mode_selected_comps = capture_row.add("radiobutton", undefined, "Selected Comps");
    mode_current_comp.value = true;

    var button_export = capture_row.add("button", undefined, "Export");
    button_export.maximumSize.width = 75;
    button_export.minimumSize.width = 75;
    button_export.alignment = ["right", ""];
    button_export.onClick = function () {
      export_stills(folder_edit.text, mode_selected_comps.value);
    };

    return ui;
  }

  /* Initialize UI */
  ui = init(thisObj);
  if (ui instanceof Panel) {
    ui.layout.layout(true);
    ui.layout.resize();
  } else {
    ui.center();
    ui.show();
  }
})(this);
