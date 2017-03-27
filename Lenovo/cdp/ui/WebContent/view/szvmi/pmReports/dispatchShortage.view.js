/*
develop by Alex Liu @ 2015/1/5
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.pmReports.dispatchShortage", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var auth =  lenovo.control.commontable.Table.getViewAuth("dispatchShortage");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "MO_ID",
			label: "MO ID",
			type: "TextField",
			width: "120px"
		}, {
			field: "WERKS",
			label: "Werks",
			type: "TextField",
			width: "70px"
		}, {
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "140px"
		}, {
			field: "PART_NO",
			label: "Part No",
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
			field: "SHORT_DATE",
			label: "Short Date",
			type: "TextField",
			width: "120px"
		}, {
			field: "SHORT_TIME",
			label: "Short Time",
			type: "TextField",
			width: "120px"
		}, {
			field: "QTY_TO_PRD_LINE",
			label: "Qty to Prd Line",
			type: "TextField",
			width: "150px"
		}, {
			field: "DISPATCH_QTY",
			label: "Dispatch Qty",
			type: "TextField",
			width: "120px"
		}, {
			field: "TOTAL_PULLED_QTY",
			label: "Total Pulled Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "DIFFERENCE_QTY",
			label: "Difference Qty",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/DISPATCH_SHORTAGE";

		config.filtersRaw = [{
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TimeRange"
		}, {
			field: "MO_ID",
			label: "MO ID",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/DISPATCH_SHORTAGE_DDL?$format=json&$select=MO_ID,MS",
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
			field: "SHORT_DATE",
			label: "Short Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/DISPATCH_SHORTAGE_DDL?$format=json&$select=SHORT_DATE,MS",
				field: "SHORT_DATE",
				columns: [{
					label: "Short Date",
					field: "SHORT_DATE",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SHORT_DATE",
						label: "Short Date",
						type: "TextField",
						textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "SHORT_TIME",
			label: "Short Time",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/DISPATCH_SHORTAGE_DDL?$format=json&$select=SHORT_TIME,MS",
				field: "SHORT_TIME",
				columns: [{
					label: "Short Time",
					field: "SHORT_TIME",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SHORT_TIME",
						label: "Short Time",
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/CV_DISPATCH_SHORTAGE"';
		config.download.columns = ["DELIVERY_DATE","DIFFERENCE_QTY","DISPATCH_QTY","MO_ID","PART_NO","PRODUCTION_LINE","PULL_HEADER_ID","PULL_LINE_ID","QTY_TO_PRD_LINE","SHORT_DATE","SHORT_TIME","TOTAL_PULLED_QTY","WERKS"];
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
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "Dispatch Shortage");
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
		
		var startDate = filterPanel.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[1];
		var endDate = filterPanel.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[3];
		var today = new Date();
		var lastMonth = new Date(today.getTime() - 30*24*60*60*1000);
		startDate.setValue(lastMonth.Format("yyyy - MM - dd"));
		endDate.setValue(today.Format("yyyy - MM - dd"));
		
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
		if(oData.view === "Dispatch Shortage") {
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