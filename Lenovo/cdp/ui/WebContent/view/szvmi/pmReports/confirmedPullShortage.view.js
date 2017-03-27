/*
	develop by Coral Zhang @ 2015/1/5
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.pmReports.confirmedPullShortage", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var auth =  lenovo.control.commontable.Table.getViewAuth("confirmedPullShortage");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "MO_ID",
			label: "MO ID",
			type: "TextField",
			width: "100px"
		},{
			field: "WERKS",
			label: "Werks",
			type: "TextField",
			width: "80px"
		},{
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "120px"
		},{
			field: "PULL_HEADER_ID",
			label: "Pull Header Id",
			type: "TextField",
			width: "150px"
		},{
			field: "PULL_LINE_ID",
			label: "Pull Line Id",
			type: "TextField",
			width: "100px"
		},{
			field: "PART_NUMBER",
			label: "Part Number",
			type: "TextField",
			width: "120px"
		},{
			field: "CONFIRMED_DATE",
			label: "Confirmed Date",
			type: "TextField",
			width: "130px"
		},{
			field: "CONFIRMED_TIME",
			label: "Confirmed Time",
			type: "TextField",
			width: "130px"
		},{
			field: "CONFIRMED_QTY",
			label: "Confirmed Qty",
			type: "TextField",
			width: "150px"
		},{
			field: "TOTAL_PULLED_QTY",
			label: "Total Pulled Qty",
			type: "TextField",
			width: "120px"
		},{
			field: "DIFFERENCE",
			label: "Difference",
			type: "TextField",
			width: "100px"
		}];
		
		config.bindRowUrl = "/CONFIRMED_PULL_SHORTAGE";

		config.filtersRaw = [{
			field: "MO_ID",
			label: "MO ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/CONFIRMED_PULL_SHORTAGE_DDL?$select=MO_ID,MS",
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
		},{
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/CONFIRMED_PULL_SHORTAGE_DDL?$select=PRODUCTION_LINE,MS",
				field: "PRODUCTION_LINE",
				columns: [{
					label: "Production Line",
					field: "PRODUCTION_LINE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "PRODUCTION_LINE",
						label: "Production Line",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "CONFIRMED_DATE",
			label: "Confirmed Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/CONFIRMED_PULL_SHORTAGE_DDL?$select=CONFIRMED_DATE,MS",
				field: "CONFIRMED_DATE",
				columns: [{
					label: "Confirmed Date",
					field: "CONFIRMED_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Confirmed Date",
						field: "CONFIRMED_DATE",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}			
		},{
			field: "CONFIRMED_TIME",
			label: "Confirmed Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/CONFIRMED_PULL_SHORTAGE_DDL?$select=CONFIRMED_TIME,MS",
				field: "CONFIRMED_TIME",
				columns: [{
					label: "Confirmed Time",
					field: "CONFIRMED_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Confirmed Time",
						field: "CONFIRMED_TIME",
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/CV_CONFIRMED_PULL_SHORTAGE"';
		config.download.columns = ["CONFIRMED_DATE","CONFIRMED_QTY","CONFIRMED_TIME","DIFFERENCE","MO_ID","PART_NUMBER","PRODUCTION_LINE","PULL_HEADER_ID","PULL_LINE_ID","TOTAL_PULLED_QTY","WERKS"];
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
		var header = lenovo.control.commontable.Table.createHeader("PM Reports", "Confirmed Pull Shortage");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Confirmed Pull Shortage") {
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