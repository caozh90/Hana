/*
develop by Robin @ 2015/1/13
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.pmReports.moDestinationChangeError", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var auth =  lenovo.control.commontable.Table.getViewAuth("moDestinationChangeError");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "CHANGE_DATE",
			label: "Change Date",
			type: "TextField",
			width: "120px"
		}, {
			field: "CHANGE_TIME",
			label: "Change Time",
			type: "TextField",
			width: "120px"
		}, {
			field: "MO_ID",
			label: "MO ID",
			type: "TextField",
			width: "120px"
		}, {
			field: "PART_NUMBER",
			label: "Part Number",
			type: "TextField",
			width: "120px"
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
			type: "TextField",
			width: "150px"
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "120px"
		}, {
			field: "POSNR",
			label: "Posnr",
			type: "TextField",
			width: "70px"
		}, {
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "70px"
		}, {
			field: "REASON_CODE",
			label: "Reason Code",
			type: "TextField",
			width: "300px"
		}, {
			field: "COUNTER",
			label: "Counter",
			type: "TextField",
			width: "70px"
		}];

		config.bindRowUrl = "/MO_DESTINATION_CHANGE_ERROR";

		config.filtersRaw = [{
			field: "CHANGE_DATE",
			label: "Change Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_DESTINATION_CHANGE_ERROR_DDL?$format=json&$select=CHANGE_DATE,MS",
				field: "CHANGE_DATE",
				columns: [{
					label: "Change Date",
					field: "CHANGE_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "CHANGE_DATE",
						label: "Change Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "CHANGE_TIME",
			label: "Change Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_DESTINATION_CHANGE_ERROR_DDL?$format=json&$select=CHANGE_TIME,MS",
				field: "CHANGE_TIME",
				columns: [{
					label: "Change Time",
					field: "CHANGE_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						field: "CHANGE_TIME",
						label: "Change Time",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "MO_ID",
			label: "MO ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_DESTINATION_CHANGE_ERROR_DDL?$format=json&$select=MO_ID,MS",
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
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_DESTINATION_CHANGE_ERROR_DDL?$format=json&$select=LOGICAL_PLANT,MS",
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
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models.pmreport/CV_MO_DESTINATION_CHANGE_ERROR"';
		config.download.columns = ["CHANGE_DATE","CHANGE_TIME","COUNTER","DEST_STORAGE_LOC","LOGICAL_PLANT","MO_ID","PART_NUMBER","POSNR","REASON_CODE","STATUS"];
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
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "MO Destination Change Error");
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
		if(oData.view === "MO Destination Change Error") {
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