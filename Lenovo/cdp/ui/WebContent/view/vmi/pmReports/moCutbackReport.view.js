/*
develop by Robin @ 2015/1/13
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.pmReports.moCutbackReport", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var auth =  lenovo.control.commontable.Table.getViewAuth("moCutbackReport");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "ORIGINAL_PULL_ID",
			label: "Original Pull ID",
			type: "TextField",
			width: "120px"
		}, {
			field: "PLAN_DATE",
			label: "Plan Date",
			type: "TextField",
			width: "100px"
		}, {
			field: "PLAN_TIME",
			label: "Plan Time",
			type: "TextField",
			width: "100px"
		}, {
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "140px"
		}, {
			field: "RETURN_PULL_ID",
			label: "Return Pull ID",
			type: "TextField",
			width: "120px"
		}, {
			field: "PULL_DATE",
			label: "Pull Date",
			type: "TextField",
			width: "120px"
		}, {
			field: "PULL_TIME",
			label: "Pull Time",
			type: "TextField",
			width: "120px"
		}, {
			field: "CUTBACK_DATE",
			label: "Cutback Date",
			type: "TextField",
			width: "120px"
		}, {
			field: "CUTBACK_TIME",
			label: "Cutback Time",
			type: "TextField",
			width: "120px"
		}, {
			field: "MO_ID",
			label: "MO ID",
			type: "TextField",
			width: "150px"
		}, {
			field: "CUTBACK_QTY",
			label: "Cut Back Qty",
			type: "TextField",
			width: "120px"
		}, {
			field: "ORIGINAL_QTY",
			label: "Original Qty",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/MO_CUTBACK_REPORT";

		config.filtersRaw = [{
			field: "PLAN_DATE",
			label: "Plan Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_REPORT_DDL?$format=json&$select=PLAN_DATE,MS",
				field: "PLAN_DATE",
				columns: [{
					label: "Plan Date",
					field: "PLAN_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PLAN_DATE",
						label: "Plan Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "PLAN_TIME",
			label: "Plan Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_REPORT_DDL?$format=json&$select=PLAN_TIME,MS",
				field: "PLAN_TIME",
				columns: [{
					label: "Plan Time",
					field: "PLAN_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PLAN_TIME",
						label: "Plan Time",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "PULL_TIME",
			label: "Pull Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_REPORT_DDL?$format=json&$select=PULL_TIME,MS",
				field: "PULL_TIME",
				columns: [{
					label: "Pull Time",
					field: "PULL_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PULL_TIME",
						label: "Pull Time",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "CUTBACK_DATE",
			label: "Cutback Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_REPORT_DDL?$format=json&$select=CUTBACK_DATE,MS",
				field: "CUTBACK_DATE",
				columns: [{
					label: "Cutback Date",
					field: "CUTBACK_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "CUTBACK_DATE",
						label: "Cutback Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "CUTBACK_TIME",
			label: "Cutback Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_CUTBACK_REPORT_DDL?$format=json&$select=CUTBACK_TIME,MS",
				field: "CUTBACK_TIME",
				columns: [{
					label: "Cutback Time",
					field: "CUTBACK_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						field: "CUTBACK_TIME",
						label: "Cutback Time",
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
				bindRowUrl: "/MO_CUTBACK_REPORT_DDL?$format=json&$select=MO_ID,MS",
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
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models.pmreport/AN_MO_CUTBACK_REPORT"';
		config.download.columns = ["CUTBACK_DATE","CUTBACK_QTY","CUTBACK_TIME","CUTBACK_TIMESTAMP","MO_ID","ORIGINAL_PULL_ID","ORIGINAL_QTY","PLAN_DATE","PLAN_TIME","PLAN_TIMESTAMP","PRODUCTION_LINE","PULL_DATE","PULL_TIME","RETURN_PULL_ID","SYS_TIMESTAMP"];
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
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "MO Cutback Report");
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
		if(oData.view === "MO Cutback Report") {
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