sap.ui.table.Table.extend("lenovo.control.LenovoTable", { // call the new Control type "HighlightField" 
                                                      // and let it inherit from sap.ui.commons.TextField
     
      _jumpPage: function(){
        var oTable = this;
        var pageNo = oTable._oJump.getLiveValue();
        var validFlag = oTable._pageNoValidation(oTable,pageNo);
        var paginator = oTable._oPaginator;
        if(!validFlag){
          //msgbox shows "wrong page no"
          return;
        }
        oTable._paging(oTable,pageNo);
        paginator.firePage();
      },
      _pageNoValidation: function(table, pageNo){
        var totalPage = table._oPaginator.getNumberOfPages();

        if(pageNo > totalPage)
          return false;
        if(pageNo < 1)
          return false;
        return true;
      },
      _paging:function(table, pageNo){
        var rowNo = table.getVisibleRowCount();
        table.setFirstVisibleRow((pageNo-1)*rowNo);
      },
      renderer: {
          // note that NO render() function is given here! The TextField's render() function is used. 
          // But one function is overwritten:
          render: function(rm, oTable) {

              // return immediately if control is invisible
              if (!oTable.getVisible()) {
                return;
              }
              
              // create the rows of the table 
              // (here we could think about a swith to allow the programmatic usage of the table)
              oTable._createRows();

              // basic table div
              rm.write("<div");
              if (oTable._bAccMode) {
                var aAriaOwnsIds = [];
                if (oTable.getToolbar()) {
                  aAriaOwnsIds.push(oTable.getToolbar().getId());
                }
                aAriaOwnsIds.push(oTable.getId() + "-table");
                rm.writeAttribute("aria-owns", aAriaOwnsIds.join(" "));
                rm.writeAttribute("aria-readonly", "true");
                if (oTable.getTitle()) {
                  rm.writeAttribute("aria-labelledby", oTable.getTitle().getId());
                }
                if (oTable.getSelectionMode() === sap.ui.table.SelectionMode.Multi) {
                  rm.writeAttribute("aria-multiselectable", "true");
                }
              }
              rm.writeControlData(oTable);
              rm.addClass("sapUiTable");
              rm.addClass("sapUiTableSelMode" + oTable.getSelectionMode());
              if (oTable.getColumnHeaderVisible()) {
                rm.addClass("sapUiTableCHdr"); // show column headers
              }
              if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None &&
                  oTable.getSelectionBehavior() !== sap.ui.table.SelectionBehavior.RowOnly) {
                rm.addClass("sapUiTableRSel"); // show row selector
              }
              rm.addClass("sapUiTableSelMode" + oTable.getSelectionMode()); // row selection mode
              //rm.addClass("sapUiTableHScr"); // show horizontal scrollbar
              if (oTable.getNavigationMode() === sap.ui.table.NavigationMode.Scrollbar) {
                rm.addClass("sapUiTableVScr"); // show vertical scrollbar
              }
              if (oTable.getEditable()) {
                rm.addClass("sapUiTableEdt"); // editable (background color)
              }
              rm.addClass("sapUiTableShNoDa");
              if (oTable.getShowNoData() && oTable._getRowCount() === 0) {
                rm.addClass("sapUiTableEmpty"); // no data!
              }
              if (oTable.getEnableGrouping()) {
                rm.addClass("sapUiTableGrouping");
              }
              rm.writeClasses();
              if (oTable.getWidth()) {
                rm.addStyle("width", oTable.getWidth());
              }
              rm.writeStyles();
              rm.write(">");

              if (oTable.getTitle()) {
                this.renderHeader(rm, oTable, oTable.getTitle());
              }

              if (oTable.getToolbar()) {
                this.renderToolbar(rm, oTable, oTable.getToolbar());
              }

              if (oTable.getExtension() && oTable.getExtension().length > 0) {
                this.renderExtensions(rm, oTable, oTable.getExtension());
              }

              rm.write("<div");
              rm.addClass("sapUiTableCnt");
              rm.writeClasses();
              if (oTable._bAccMode) {
                rm.writeAttribute("aria-describedby", oTable.getId() + "-ariacount");
              }
              rm.write(">");

              this.renderColHdr(rm, oTable);

              this.renderTable(rm, oTable);

              if (oTable._bAccMode) {
                // aria description for the row count
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-ariadesc");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write(oTable._oResBundle.getText("TBL_TABLE"));
                rm.write("</span>");
                // aria description for the row count
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-ariacount");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write("</span>");
                // aria description for toggling the edit mode
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-toggleedit");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write(oTable._oResBundle.getText("TBL_TOGGLE_EDIT_KEY"));
                rm.write("</span>");
                // aria description for row selection behavior with no line selected
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-selectrow");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write(oTable._oResBundle.getText("TBL_ROW_SELECT_KEY"));
                rm.write("</span>");
                // aria description for row selection behavior with line selected
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-selectrowmulti");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write(oTable._oResBundle.getText("TBL_ROW_SELECT_MULTI_KEY"));
                rm.write("</span>");
                // aria description for row deselection behavior with no line selected
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-deselectrow");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write(oTable._oResBundle.getText("TBL_ROW_DESELECT_KEY"));
                rm.write("</span>");
                // aria description for row deselection behavior with line selected
                rm.write("<span");
                rm.writeAttribute("id", oTable.getId() + "-deselectrowmulti");
                rm.addStyle("position", "absolute");
                rm.addStyle("top", "-20000px");
                rm.writeStyles();
                rm.write(">");
                rm.write(oTable._oResBundle.getText("TBL_ROW_DESELECT_MULTI_KEY"));
                rm.write("</span>");
              }

              rm.write("</div>");

              if (oTable.getNavigationMode() === sap.ui.table.NavigationMode.Paginator) {
                rm.write("<div");
                rm.addClass("sapUiTablePaginator");
                rm.writeClasses();
                rm.write(">");
                if (!oTable._oPaginator) {
                  jQuery.sap.require("sap.ui.commons.Paginator");
                  oTable._oPaginator = new sap.ui.commons.Paginator(oTable.getId() + "-paginator");
                  oTable._oPaginator.attachPage(jQuery.proxy(oTable.onvscroll, oTable));
                }
                rm.renderControl(oTable._oPaginator);

                //extend for page jump
                //--start--
                if(!oTable._oJump){
                  oTable._oJump = new sap.ui.commons.TextField(oTable.getId() + "-pagejump",{
                    width: "40px",
                    liveChange: function(oEvent){
                      var key = oEvent.getParameter("liveValue");
                      this.setValue(key.replace(/\D/g,""));
                    }
                  });

                  // oTable._oJump.attachChange();
                  oTable._oJumpBtn = new sap.ui.commons.Button(oTable.getId() + "-pagejumpbtn",{
                    icon: "sap-icon://open-command-field",
                    lite: true,
                    press: jQuery.proxy(oTable._jumpPage, oTable)
                  });
                }
                
                rm.renderControl(oTable._oJump);
                rm.renderControl(oTable._oJumpBtn);
                //--end--

                rm.write("</div>");
              }

              if (oTable.getFooter()) {
                this.renderFooter(rm, oTable, oTable.getFooter());
              }

              if (oTable.getVisibleRowCountMode() == sap.ui.table.VisibleRowCountMode.Interactive) {
                this.renderVariableHeight(rm ,oTable);
              }

              rm.write("</div>");

            }
      }
  });