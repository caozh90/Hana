/*
develop by Alex Liu @ 2014/12/11
lack odata
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.archived.archivedPullLines", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(9);
		var auth =  lenovo.control.commontable.Table.getViewAuth("archivedPullLines");
		//var headerHeight = 450;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "MATNR",
			label: "Part Number",
			type: "TextField",
			width: "100px"
		}, {
			field: "MATNR_DESCR",
			label: "Part Description",
			type: "TextField",
			width: "150px"
		}, {
			field: "CONFIRM_QTY",
			label: "Confirmed Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "PULL_QTY",
			label: "Requested Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "FULL_BOX_QTY",
			label: "Full Box Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "SHIP_QTY",
			label: "Shipment Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		}, {
			field: "SA_NUMBER",
			label: "SA Number",
			type: "TextField",
			width: "100px"
		}, {
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "HEADER_SUPPLIERID",
			label: "Supplier Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_CREATED_BY",
			label: "Created By",
			type: "TextField",
			width: "200px"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Created Date",
			type: "TextField",
			width: "200px"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Source Location",
			type: "TextField",
			width: "150px"
		}, {
			field: "SRC_STORAGE_TYPE",
			label: "Source Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "SRC_STORAGE_BIN",
			label: "Source Bin",
			type: "TextField",
			width: "100px"
		}, {
			field: "LINE_SUPPLIERID",
			label: "Vendor",
			type: "TextField",
			width: "100px"
		}, {
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
			type: "TextField",
			width: "150px"
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Dest Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Dest Bin",
			type: "TextField",
			width: "100px"
		}, {
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "150px"
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "INVENTORY_TYPE",
			label: "Invty Type",
			type: "TextField",
			width: "100px"
		}];

		//var oSearch = new Date(((new Date()).getTime() - 90*24*60*60*1000)).Format("yyyy-MM-dd");

		config.bindRowUrl = "/UI_PULL_ARCHIVED";//?$filter=SYS_CREATED_DATE ge datetime'" + oSearch + "'";
		config.defaultSort = [{
					field: "SYS_CREATED_DATE",
					bDescending: false
				}];
		//config.bindRowUrl = "/UI_PULL_ARCHIVED";

		config.filtersRaw = [{
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "SYS_CREATED_BY",
			label: "Created By",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "SA_NUMBER",
			label: "SA Number",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "HEADER_SUPPLIERID",
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
			field: "WERKS",
			label: "Logical Plant",
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
			field: "SRC_STORAGE_BIN",
			label: "Source Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Source Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "SRC_STORAGE_TYPE",
			label: "Source Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Destination Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Destination Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "MATNR",
			label: "Part Number",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownTable",
			dropdowntable: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				field: "ITEM",
				columns: [{
					label: "Part Number",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Part Description",
					field: "ITEMDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ITEM",
						label: "Part Number",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Part Description",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Created Date",
			type: "TimeRange"
		}, {
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TimeRange"
		}, {
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "STATUS",
			label: "Status",
			type: "ListBox",
			listbox: {
				odata: {
					url: sServiceUrl + "/InputParams('PULL_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					bindItemUrl: "/"
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			1: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			2: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
			
		};

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_PULL_LINE_ARCHIVED"';
		config.download.columns = ["PULL_HEADER_ID", "PULL_LINE_ID", "MATNR", "MATNR_DESCR", "CONFIRM_QTY", "PULL_QTY", "FULL_BOX_QTY", "SHIP_QTY", "STATUS", "SA_NUMBER", "WERKS", "DELIVERY_DATE", "HEADER_SUPPLIERID",
			"SYS_CREATED_BY", "SYS_CREATED_DATE", "SYS_LAST_MODIFIED_BY", "SRC_STORAGE_LOC", "SRC_STORAGE_TYPE", "SRC_STORAGE_BIN", "LINE_SUPPLIERID", "PULL_TYPE", "DEST_STORAGE_LOC", "DEST_STORAGE_TYPE",
			"DEST_STORAGE_BIN", "PRODUCTION_LINE", "PHYSICAL_PLANT", "INVENTORY_TYPE"
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
		var header = lenovo.control.commontable.Table.createHeader("archived", "archived pull lines");
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
		if(oData.view === "Archived Pull Lines") {
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