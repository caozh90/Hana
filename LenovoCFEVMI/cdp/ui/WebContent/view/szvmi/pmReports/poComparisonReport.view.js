/*
	develop by Coral Zhang @ 2015/1/6
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.pmReports.poComparisonReport", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var auth =  lenovo.control.commontable.Table.getViewAuth("poComparisonReport");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PO_ID",
			label: "PO ID",
			type: "TextField",
			width: "100px"
		},{
			field: "PO_LINE_ID",
			label: "PO Line ID",
			type: "TextField",
			width: "100px"
		},{
			field: "MATNR",
			label: "Matnr",
			type: "TextField",
			width: "120px"
		},{
			field: "WERKS",
			label: "Werks",
			type: "TextField",
			width: "60px"
		},{
			field: "LIFNR",
			label: "Lifnr",
			type: "TextField",
			width: "90px"
		},{
			field: "R3_PO_LPB_SA_SNAPSHOT_START_DATE",
			label: "R3 PO LPB SA Snapshot|Start Date",
			type: "TextField",
			width: "260px"
		},{
			field: "R3_PO_LPB_SA_SNAPSHOT_END_DATE",
			label: "R3 PO LPB SA Snapshot|End Date",
			type: "TextField",
			width: "260px"
		},{
			field: "TPL_PO_START_DATE",
			label: "TPL PO|Start Date",
			type: "TextField",
			width: "150px"
		},{
			field: "TPL_PO_END_DATE",
			label: "TPL PO|End Date",
			type: "TextField",
			width: "150px"
		},{
			field: "R3_TIMESTAMP",
			label: "R3 Timestamp",
			type: "TextField",
			width: "120px"
		},{
			field: "TPL_TIMESTAMP",
			label: "3PL Timestamp",
			type: "TextField",
			width: "150px"
		},{
			field: "R3_QTY",
			label: "R3 Qty",
			type: "TextField",
			width: "80px"
		},{
			field: "TPL_QTY",
			label: "3PL Qty",
			type: "TextField",
			width: "120px"
		},{
			field: "R3_OPEN_QTY",
			label: "R3 Open Qty",
			type: "TextField",
			width: "120px"
		},{
			field: "TPL_OPEN_QTY",
			label: "3PL Open Qty",
			type: "TextField",
			width: "120px"
		}];
		
		config.bindRowUrl = "/PO_COMPARISON";

		config.filtersRaw = [{
			field: "PO_ID",
			label: "PO ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/PO_COMPARISON_DDL?$format=json&$select=PO_ID,MS",
				field: "PO_ID",
				columns: [{
					label: "PO ID",
					field: "PO_ID",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PO_ID",
						label: "PO ID",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "MATNR",
			label: "Matnr",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/PO_COMPARISON_DDL?$format=json&$select=MATNR,MS",
				field: "MATNR",
				columns: [{
					label: "Matnr",
					field: "MATNR",
					type: "TextField"
				}],
				filters: [
					[{
						field: "MATNR",
						label: "Matnr",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "WERKS",
			label: "Werks",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/PO_COMPARISON_DDL?$format=json&$select=WERKS,MS",
				field: "WERKS",
				columns: [{
					label: "Werks",
					field: "WERKS",
					type: "TextField"
				}],
				filters: [
					[{
						field: "WERKS",
						label: "Werks",
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
			label: "Lifnr",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/PO_COMPARISON_DDL?$format=json&$select=LIFNR,MS",
				field: "LIFNR",
				columns: [{
					label: "Lifnr",
					field: "LIFNR",
					type: "TextField"
				}],
				filters: [
					[{
						field: "LIFNR",
						label: "Lifnr",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "R3_TIMESTAMP",
			label: "R3 Timestamp",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/PO_COMPARISON_DDL?$format=json&$select=R3_TIMESTAMP,MS",
				field: "R3_TIMESTAMP",
				columns: [{
					label: "R3 Timestamp",
					field: "R3_TIMESTAMP",
					type: "TextField"
				}],
				filters: [
					[{
						field: "R3_TIMESTAMP",
						label: "R3 Timestamp",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{			
			field: "TPL_TIMESTAMP",
			label: "3PL Timestamp",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/PO_COMPARISON_DDL?$format=json&$select=TPL_TIMESTAMP,MS",
				field: "TPL_TIMESTAMP",
				columns: [{
					label: "3PL Timestamp",
					field: "TPL_TIMESTAMP",
					type: "TextField"
				}],
				filters: [
					[{
						field: "TPL_TIMESTAMP",
						label: "3PL Timestamp",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}]
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/CV_PO_COMPARISON"';
		config.download.columns = ["LIFNR","MATNR","PO_ID","PO_LINE_ID","R3_OPEN_QTY","R3_PO_LPB_SA_SNAPSHOT_END_DATE","R3_PO_LPB_SA_SNAPSHOT_START_DATE","R3_QTY","R3_TIMESTAMP","TPL_OPEN_QTY","TPL_PO_END_DATE","TPL_PO_START_DATE","TPL_QTY","TPL_TIMESTAMP","WERKS"];
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
		var header = lenovo.control.commontable.Table.createHeader("PM Reports", "PO Comparison Report");
		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "PO Comparison Report") {
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