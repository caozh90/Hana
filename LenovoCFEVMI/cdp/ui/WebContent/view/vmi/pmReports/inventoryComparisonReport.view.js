/*
develop by Robin @ 2015/1/13
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.pmReports.inventoryComparisonReport", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var auth =  lenovo.control.commontable.Table.getViewAuth("inventoryComparisonReport");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "MATNR",
			label: "Part Number",
			type: "TextField",
			width: "120px"
		}, {
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "130px"
		}, {
			field: "LIFNR",
			label: "Vendor",
			type: "TextField",
			width: "70px"
		}, {
			field: "STORAGE_TYPE",
			label: "Storage Type",
			type: "TextField",
			width: "120px"
		}, {
			field: "STORAGE_BIN",
			label: "Storage Bin",
			type: "TextField",
			width: "120px"
		}, {
			field: "HOLD_TYPE",
			label: "Hold Type",
			type: "TextField",
			width: "120px"
		}, {
			field: "SYS_SOURCE",
			label: "Sys Source",
			type: "TextField",
			width: "120px"
		}, {
			field: "R3_TIMESTAMP",
			label: "R3 Timestamp",
			type: "TextField",
			width: "120px"
		}, {
			field: "TPL_TIMESTAMP",
			label: "3PL Timestamp",
			type: "TextField",
			width: "120px"
		}, {
			field: "R3_TIMESTAMP_DATE",
			label: "R3 Timestamp Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "R3_QTY",
			label: "R3 Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "TPL_QTY",
			label: "3PL Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "R3_TPL_DIFF",
			label: "(R3-3PL) Diff",
			type: "TextField",
			width: "100px"
		}];

		config.bindRowUrl = "/INVENTORY_COMPARISON";

		config.filtersRaw = [{
			field: "WERKS",
			label: "Logical Plant",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/INVENTORY_COMPARISON_DDL?$format=json&$select=WERKS,MS",
				field: "WERKS",
				columns: [{
					label: "Logical Plant",
					field: "WERKS",
					type: "TextField"
				}],
				filters: [
					[{
						field: "WERKS",
						label: "Logical Plant",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "HOLD_TYPE",
			label: "Hold Type",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/INVENTORY_COMPARISON_DDL?$format=json&$select=HOLD_TYPE,MS",
				field: "HOLD_TYPE",
				columns: [{
					label: "Hold Type",
					field: "HOLD_TYPE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "HOLD_TYPE",
						label: "Hold Type",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, { //add sys_source zhaodan1 2016/8/2
			field: "SYS_SOURCE",
			label: "Sys Source",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/INVENTORY_COMPARISON_DDL?$format=json&$select=SYS_SOURCE,MS",
				field: "SYS_SOURCE",
				columns: [{
					label: "Sys Source",
					field: "SYS_SOURCE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SYS_SOURCE",
						label: "Sys Source",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "LIFNR",
			label: "Vendor",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/INVENTORY_COMPARISON_DDL?$format=json&$select=LIFNR,MS",
				field: "LIFNR",
				columns: [{
					label: "Vendor",
					field: "LIFNR",
					type: "TextField"
				}],
				filters: [
					[{
						field: "LIFNR",
						label: "Vendor",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "R3_TIMESTAMP_DATE",
			label: "R3 Timestamp Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/INVENTORY_COMPARISON_DDL?$format=json&$select=R3_TIMESTAMP_DATE,MS",
				field: "R3_TIMESTAMP_DATE",
				columns: [{
					label: "R3 Timestamp Date",
					field: "R3_TIMESTAMP_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "R3_TIMESTAMP_DATE",
						label: "R3 Timestamp Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models.pmreport/AN_INVENTORY_COMPARISON"';
		config.download.columns = ["MATNR","WERKS", "STORAGE_TYPE","STORAGE_BIN", "HOLD_TYPE","SYS_SOURCE","R3_TIMESTAMP","TPL_TIMESTAMP","R3_TIMESTAMP_DATE","R3_QTY","TPL_QTY","R3_TPL_DIFF"];
		config.download.roleName = auth.exportableRoleName;
		
		//auth
		config.create.visible=false;
		config.edit.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.download.visible = false;
		
		for (i in auth) {
			switch(i) {
				case "exportable":
					config.download.visible = auth[i];
					break;
				case "createable":
					config.create.visible = auth[i];
					break;
				case "deleteable":
					config.deleteable.visible = auth[i];
					break;
				case "editable":
					config.edit.visible = auth[i];
					break;
				case "uploadable":
					config.upload.visible = auth[i];
					break;
			}
		}
	},

	createContent: function(oController) {
		var app = new sap.m.App(); 
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmiReport();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "Inventory Comparison Report");
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);

		var page = new sap.m.Page({
	      	  showHeader: false,
	          content: [header, filterPanel, oInsertUpload, table]             
	    });
        app.insertPage(page);
        app.setInitialPage(page);
		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Inventory Comparison Report") {
			if(this.table && this.oModel) {		
				var defaultSort = lenovo.control.commontable.Table._getDefaultSort(this.config);
				var defaultFilters = lenovo.control.commontable.Table._getDefaultFilter(this.config);
				this.table.bindRows(this.config.bindRowUrl, null, defaultSort,defaultFilters);	
				var filterModel = new sap.ui.model.json.JSONModel();				
				var clearObj = this.oForm.data("clearObj");
				var obj = JSON.stringify(clearObj);
				lenovo.control.commontable.Table._clearAllFilterCondition(filterModel, this.oForm, obj);												
			}		
		}
	}
});