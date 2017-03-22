/*
	develop by Coral Zhang @ 2015/1/8
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.pmReports.onHoldMOLines", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);
		var auth =  lenovo.control.commontable.Table.getViewAuth("onHoldMOLines");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "MO_ID",
			label: "MO ID",
			type: "TextField",
			width: "180px"
		},{
			field: "WERKS",
			label: "Site ID",
			type: "TextField",
			width: "80px"
		},{
			field: "MATNR",
			label: "Item",
			type: "TextField",
			width: "120px"
		},{
			field: "PULL_QTY",
			label: "Pull Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "SYS_TIMESTAMP",
			label: "Sys Timestamp",
			type: "TextField",
			width: "150px"
		},{
			field: "BUILD_ENTITY",
			label: "Build Entity",
			type: "TextField",
			width: "150px"
		},{
			field: "BOMNAME",
			label: "Bomname",
			type: "TextField",
			width: "90px"
		},{
			field: "CANCEL_REASON",
			label: "Cancel Reason",
			type: "TextField",
			width: "200px"
		},{
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "120px"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Dest Storage Bin",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Dest Storage Type",
			type: "TextField",
			width: "150px"
		},{
			field: "HEADER_SUPPLIERID",
			label: "Header Supplierid",
			type: "TextField",
			width: "150px"
		},{
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			type: "TextField",
			width: "120px"
		},{
			field: "IS_ACTIVE_LINE",
			label: "Is Active Line",
			type: "TextField",
			width: "120px"
		},{
			field: "IS_CQE",
			label: "Is Cqe",
			type: "TextField",
			width: "80px"
		},{
			field: "LINE_SUPPLIERID",
			label: "Line Supplierid",
			type: "TextField",
			width: "120px"
		},{
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "180px"
		},{
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "180px"
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "140px"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Src Storage Bin",
			type: "TextField",
			width: "120px"
		},{
			field: "SRC_STORAGE_LOC",
			label: "Src Storage Loc",
			type: "TextField",
			width: "120px"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Src Storage Type",
			type: "TextField",
			width: "140px"
		},{
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "80px"
		},{
			field: "SYS_SOURCE",
			label: "Sys Source",
			type: "TextField",
			width: "100px"
		},{
			field: "WHS_NO",
			label: "Whs No",
			type: "TextField",
			width: "80px"
		}];
		//TODO 
		config.bindRowUrl = "/ON_HOLD_MO_LINES";
		config.defaultSort = [{
			field: "SYS_TIMESTAMP",
			bDescending: true
		}];

		config.filtersRaw = [{
			field: "WERKS",
			label: "Site ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ON_HOLD_MO_LINES_DDL?$format=json&$select=WERKS,MS",
				field: "WERKS",
				columns: [{
					label: "Site ID",
					field: "WERKS",
					type: "TextField"
				}],
				filters: [
					[{
						field: "WERKS",
						label: "Site ID",
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
				bindRowUrl: "/ON_HOLD_MO_LINES_DDL?$format=json&$select=SYS_TIMESTAMP,MS",
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
		},{
			field: "PRODUCTIONORDID",
			label: "MO ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				//bindRowUrl: "/MO_CUTBACK_REPORT_MS?$format=json&$select=MO_ID,MS",
				bindRowUrl: "/ON_HOLD_MO_LINES_DDL?$format=json&$select=MO_ID,MS",
				field: "MO_ID",
				columns: [{
					label: "MO ID",
					field: "MO_ID",
					type: "TextField"
				}],
				filters: [
					[{
						field: "MO_ID",
						label: "MO ID",
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/CV_ON_HOLD_MO_LINES"';
		config.download.columns = ["BOMNAME","BUILD_ENTITY","CANCEL_REASON","DELIVERY_DATE","DEST_STORAGE_BIN","DEST_STORAGE_LOC","DEST_STORAGE_TYPE","HEADER_SUPPLIERID","INVENTORY_TYPE","IS_ACTIVE_LINE","IS_CQE","LENGTH","LINE_SUPPLIERID","MATNR","MO_ID","PHYSICAL_PLANT","PRODUCTIONORDID","PRODUCTION_LINE","PULL_QTY","PULL_TYPE","SRC_STORAGE_BIN","SRC_STORAGE_LOC","SRC_STORAGE_TYPE","STATUS","SYS_SOURCE","SYS_TIMESTAMP","WERKS","WHS_NO"];
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
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmiReport();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);

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
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		var header = lenovo.control.commontable.Table.createHeader("PM Reports", "On Hold MO Lines");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "On Hold MO Lines") {
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