/*
develop by Robin @ 2015/1/13
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.pmReports.moCutbackMaterialReturnReport", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var auth =  lenovo.control.commontable.Table.getViewAuth("moCutbackMaterialReturnReport");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "DEST_STORAGE_BIN",
			label: "Dest Storage Bin",
			type: "TextField",
			width: "150px"
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
			type: "TextField",
			width: "150px"
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Dest Storage Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "PART_NUMBER",
			label: "Part Number",
			type: "TextField",
			width: "120px"
		}, {
			field: "MO_ID",
			label: "MO ID",
			type: "TextField",
			width: "150px"
		}, {
			field: "PULL_HEADER_ID",
			label: "Pull Header Id",
			type: "TextField",
			width: "120px"
		}, {
			field: "PULL_LINE_ID",
			label: "Pull Line Id",
			type: "TextField",
			width: "120px"
		}, {
			field: "SRC_STORAGE_BIN",
			label: "Src Storage Bin",
			type: "TextField",
			width: "120px"
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Src Storage Loc",
			type: "TextField",
			width: "120px"
		}, {
			field: "SRC_STORAGE_TYPE",
			label: "Src Storage Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "STATUS",
			label: "ECC Status",
			type: "TextField",
			width: "120px"
		}, {
			field: "RETURN_DATE",
			label: "Return Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "RETURN_TIME",
			label: "Return Time",
			type: "TextField",
			width: "150px"
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "REASON_CODE",
			label: "Reason Code",
			type: "TextField",
			width: "400px"
		}, {
			field: "MATNR_CUTBACK_QTY",
			label: "Cutback Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "PULL_QTY",
			label: "Return Qty ",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/MO_CUTBACK_MATERIAL_RETURN";

		config.filtersRaw = [{
			field: "MO_ID",
			label: "MO ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_MATERIAL_RETURN_DDL?$format=json&$select=MO_ID,MS",
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
		}, {
			field: "RETURN_DATE",
			label: "Return Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_MATERIAL_RETURN_DDL?$format=json&$select=RETURN_DATE,MS",
				field: "RETURN_DATE",
				columns: [{
					label: "Return Date",
					field: "RETURN_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "RETURN_DATE",
						label: "Return Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "RETURN_TIME",
			label: "Return Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_MATERIAL_RETURN_DDL?$format=json&$select=RETURN_TIME,MS",
				field: "RETURN_TIME",
				columns: [{
					label: "Return Time",
					field: "RETURN_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						field: "RETURN_TIME",
						label: "Return Time",
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
				bindRowUrl: "/MO_CUTBACK_MATERIAL_RETURN_DDL?$format=json&$select=LOGICAL_PLANT,MS",
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
		}, {
			field: "PULL_LINE_ID",
			label: "Pull Line Id",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_MATERIAL_RETURN_DDL?$format=json&$select=PULL_LINE_ID,MS",
				field: "PULL_LINE_ID",
				columns: [{
					label: "Pull Line Id",
					field: "PULL_LINE_ID",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PULL_LINE_ID",
						label: "Pull Line Id",
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/AN_MO_CUTBACK_MATERIAL_RETURN"';
		config.download.columns = ["DEST_STORAGE_BIN","DEST_STORAGE_LOC","DEST_STORAGE_TYPE","LOGICAL_PLANT","MATNR_CUTBACK_QTY","MO_ID","PART_NUMBER","PULL_HEADER_ID","PULL_LINE_ID","PULL_QTY","REASON_CODE","RETURN_DATE","RETURN_TIME","SRC_STORAGE_BIN","SRC_STORAGE_LOC","SRC_STORAGE_TYPE","STATUS","SYS_TIMESTAMP"];
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
		var service = new lenovo.service.SZVMI;
		var sServiceUrl = service.getMXVmiReport();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "MO Cutback Material Return Report");
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
		if(oData.view === "MO Cutback Material Return Report") {
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