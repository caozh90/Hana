/*
develop by Robin @ 2015/1/13
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.pmReports.moPulledInformation", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);
		var auth =  lenovo.control.commontable.Table.getViewAuth("moPulledInformation");
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "120px"
		}, {
			field: "MO_NO",
			label: "MO No",
			type: "TextField",
			width: "150px"
		}, {
			field: "PLAN_DATE",
			label: "Plan Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "NORMAL_PULLS",
			label: "Normal Pull ID",
			type: "TextField",
			width: "280px"
		}, {
			field: "EXCESS_PULLS",
			label: "Excess Pull ID",
			type: "TextField",
			width: "120px"
		}, {
			field: "SHIPPING_PULLS",
			label: "Shipping Pull ID",
			type: "TextField",
			width: "150px"
		}, {
			field: "CANDYMAN_PULLS",
			label: "Candyman Pull ID",
			type: "TextField",
			width: "120px"
		}, {
			field: "PACKAGING_PULLS",
			label: "Packaging Pull ID",
			type: "TextField",
			width: "180px"
		}, {
			field: "MTM",
			label: "MTM",
			type: "TextField",
			width: "70px"
		}, {
			field: "FAMILY",
			label: "Family",
			type: "TextField",
			width: "160px"
		}, {
			field: "REMARK",
			label: "MO Remark",
			type: "TextField",
			width: "120px"
		}, {
			field: "ORDER_TYPE",
			label: "Order Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "PRODUCTION_LINE",
			label: "DS Line",
			type: "TextField",
			width: "100px"
		}, {
			field: "MRP_CONTROLLER",
			label: "MRP Controller",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_TIMESTAMP",
			label: "Sys Date",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_TIMESTAMP_T",
			label: "Sys Time",
			type: "TextField",
			width: "100px"
		}, {
			field: "BOM_QTY",
			label: "MO Qty",
			type: "TextField",
			width: "80px"
		}];

		config.bindRowUrl = "/MO_PULLED_INFORMATION";

		config.filtersRaw = [{
			field: "PLAN_DATE",
			label: "Plan Date",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_PULLED_INFORMATION_DDL?$format=json&$select=PLAN_DATE,MS",
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
						/*textfield: {
							type: new lenovo.control.commontable.singleQuotes()
						}*/
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "MO_NO",
			label: "MO No",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_PULLED_INFORMATION_DDL?$format=json&$select=MO_NO,MS",
				field: "MO_NO",
				columns: [{
					label: "MO No",
					field: "MO_NO",
					type: "TextField"
				}],
				filters: [
					[{
						field: "MO_NO",
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
			field: "MTM",
			label: "MTM",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MO_PULLED_INFORMATION_DDL?$format=json&$select=MTM,MS",
				field: "MTM",
				columns: [{
					label: "MTM",
					field: "MTM",
					type: "TextField"
				}],
				filters: [
					[{
						field: "MTM",
						label: "MTM",
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.pmreport/AN_MO_PULLED_INFORMATION"';
		config.download.columns = ["CANDYMAN_PULLS","PLAN_DATE","EXCESS_PULLS","FAMILY","LOGICAL_PLANT","MO_NO","BOM_QTY","MRP_CONTROLLER","MTM","NORMAL_PULLS","ORDER_TYPE","PACKAGING_PULLS","PLAN_DATE","PRODUCTION_LINE","REMARK","SHIPPING_PULLS","SYS_TIMESTAMP","SYS_TIMESTAMP001","SYS_TIMESTAMP_T"];
		config.download.roleName = auth.exportableRoleName;
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {BOM_QTY:"MO_QTY"};
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
		var header = lenovo.control.commontable.Table.createHeader("PM Report", "MO Pulled Information");
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
		if(oData.view === "MO Pulled Information") {
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