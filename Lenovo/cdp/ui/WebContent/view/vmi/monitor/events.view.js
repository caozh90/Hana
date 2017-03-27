/*
develop by Alex Liu @ 2014/12/12
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.monitor.events", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("events");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
		//var headerHeight = 300;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PULL_ID",
			label: "Pull Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "LINE_ID",
			label: "Line Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "PN_NUMBER",
			label: "Part Number",
			type: "TextField",
			width: "100px"
		}, {
			field: "PN_DESCRIPTION",
			label: "PN Description",
			type: "TextField",
			width: "150px"
		}, {
			field: "PLANT",
			label: "Plant",
			type: "TextField",
			width: "100px"
		}, {
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "REQUESTED_QTY",
			label: "Requested Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "FULL_BOX_QTY",
			label: "Full Box Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "TPL_ID",
			label: "3PL ID",
			type: "TextField",
			width: "100px"
		}, {
			field: "WAREHOUSE_NO",
			label: "Warehouse No",
			type: "TextField",
			width: "150px"
		}, {
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "150px"
		}, {
			field: "VENDOR",
			label: "Vendor",
			type: "TextField",
			width: "100px"
		}, {
			field: "SOURCE_LOCATION",
			label: "Source Location",
			type: "TextField",
			width: "150px"
		}, {
			field: "SOURCE_TYPE",
			label: "Source Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "SOURCE_BIN",
			label: "Source Bin",
			type: "TextField",
			width: "100px"
		}, {
			field: "DESTINATION_LOCATION",
			label: "Destination Location",
			type: "TextField",
			width: "150px"
		}, {
			field: "DESTINATION_TYPE",
			label: "Destination Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "DESTINATION_BIN",
			label: "Destination Bin",
			type: "TextField",
			width: "150px"
		}, {
			field: "CREATED_BY",
			label: "Created By",
			type: "TextField",
			width: "100px"
		}, {
			field: "CREATION_DATE",
			label: "Created Date",
			type: "TextField",
			width: "100px"
		}, {
			field: "LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		}, {
			field: "LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/UI_EVENTS";
		config.defaultSort = {
			field: "PULL_ID",
			bDescending: true
		};


		config.filtersRaw = [{
			field: "EVENT_TYPE",
			label: "Event Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('EVENT_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_MATERIAL_MAP?$format=json",
					bindKeyField: "PULL_TYPE",
					bindTextField: "PULL_TYPE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "PLANT",
			label: "Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "TPL_ID",
			label: "3PL Id",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "CREATION_DATE",
			label: "Pull Creation Date",
			type: "TimeRange"
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_DISPATCH_DELAY"';
		config.download.columns = ["PULL_ID", "LINE_ID", "PN_NUMBER", "PN_DESCRIPTION", "PLANT", "PULL_TYPE", "REQUESTED_QTY", "FULL_BOX_QTY", "INVENTORY_TYPE",
			"DELIVERY_DATE", "PHYSICAL_PLANT", "TPL_ID", "WAREHOUSE_NO", "PRODUCTION_LINE", "VENDOR", "SOURCE_LOCATION", "SOURCE_TYPE",
			"SOURCE_BIN", "DESTINATION_LOCATION", "DESTINATION_TYPE", "DESTINATION_BIN", "CREATED_BY", "CREATION_DATE", "LAST_MODIFIED_BY",
			"LAST_MODIFIED_DATE"
		];
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
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);
		var header = lenovo.control.commontable.Table.createHeader("monitor", "events");
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

		return [header,filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Events") {
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