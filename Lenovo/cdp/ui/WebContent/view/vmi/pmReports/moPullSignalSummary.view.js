/*
develop by Robin @ 2015/1/13
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.pmReports.moPullSignalSummary", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var auth =  lenovo.control.commontable.Table.getViewAuth("moPullSignalSummary");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "110px"
		}, {
			field: "PRODUCTIONORDID",
			label: "MO No",
			type: "TextField",
			width: "150px"
		}, {
			field: "MATNR",
			label: "Part No",
			type: "TextField",
			width: "150px"
		}, {
			field: "PULL_HEADER_ID",
			label: "Pull ID",
			type: "TextField",
			width: "150px"
		}, {
			field: "DISPATCH_HEADER_ID",
			label: "Dispatch ID",
			type: "TextField",
			width: "100px"
		}, {
			field: "SOURCE_TYPE",
			label: "Source Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "DESTINATION_TYPE",
			label: "Dest Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "STORAGE_CONDITION",
			label: "Storage Condition",
			type: "TextField",
			width: "140px"
		}, {
			field: "PRODUCTION_LINE",
			label: "DS Line",
			type: "TextField",
			width: "70px"
		}, /*{
			field: "SYS_TIMESTAMP",
			label: "Sys Date",
			type: "TextField",
			width: "100px"
		},*/ {
			field: "SYS_TIMESTAMP",
			label: "Sys Time",
			type: "TextField",
			width: "100px"
		}, {
			field: "BOM_QTY",
			label: "BOM Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "PULL_QTY",
			label: "Pull Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "CONFIRMED_QTY",
			label: "Confirmed Qty",
			type: "TextField",
			width: "120px"
		}, {
			field: "DISPATCH_QTY",
			label: "Dispatch Qty",
			type: "TextField",
			width: "120px"
		}];

		config.bindRowUrl = "/MO_PULL_SIGNAL_SUMMARY";

		config.filtersRaw = [{
			field: "PRODUCTIONORDID",
			label: "MO No",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_PULL_SIGNAL_SUMMARY_DDL?$format=json&$select=PRODUCTIONORDID,MS",
				field: "PRODUCTIONORDID",
				columns: [{
					label: "MO No",
					field: "PRODUCTIONORDID",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PRODUCTIONORDID",
						label: "MO No",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "SYS_TIMESTAMP",
			label: "Sys Timestamp",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_PULL_SIGNAL_SUMMARY_DDL?$format=json&$select=SYS_TIMESTAMP,MS",
				field: "SYS_TIMESTAMP",
				columns: [{
					label: "Sys Timestamp",
					field: "SYS_TIMESTAMP",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SYS_TIMESTAMP",
						label: "Sys Timestamp",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_PULL_SIGNAL_SUMMARY_DDL?$format=json&$select=LOGICAL_PLANT,MS",
				field: "LOGICAL_PLANT",
				columns: [{
					label: "Logical Plant",
					field: "LOGICAL_PLANT",
					type: "TextField"
				}],
				filters: [
					[{
						field: "LOGICAL_PLANT",
						label: "Logical Plant",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models.pmreport/AN_MO_PULL_SIGNAL_SUMMARY"';
		config.download.columns = ["BOM_QTY","CONFIRMED_QTY","DESTINATION_TYPE","DISPATCH_HEADER_ID","DISPATCH_QTY","LOGICAL_PLANT","MATNR","PRODUCTIONORDID","PRODUCTION_LINE","PULL_HEADER_ID","PULL_QTY","SOURCE_TYPE","STORAGE_CONDITION","SYS_TIMESTAMP","SYS_TIMESTAMP001","SYS_TIMESTAMP_T"];
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
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "MO Pull Signal Summary");
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
		if(oData.view === "MO Pull Signal Summary") {
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