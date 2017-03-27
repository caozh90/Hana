/*
develop by Alex Liu @ 2014/12/16
lack Odata
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.archived.archivedDispatches", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var auth =  lenovo.control.commontable.Table.getViewAuth("archivedDispatches");
		//var headerHeight = 300;
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
			width: "200px"
		}, {
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Source Storage Location",
			type: "TextField",
			width: "200px"
		}, {
			field: "SRC_STORAGE_TYPE",
			label: "Source Storage Type",
			type: "TextField",
			width: "200px"
		}, {
			field: "SRC_STORAGE_BIN",
			label: "Source Storage Bin",
			type: "TextField",
			width: "200px"
		}, {
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Destination Storage Location",
			type: "TextField",
			width: "250px"
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Destination Storage Type",
			type: "TextField",
			width: "250px"
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Destination Storage Bin",
			type: "TextField",
			width: "250px"
		}, {
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "LIFNR",
			label: "Supplier",
			type: "TextField",
			width: "100px"
		}, {
			field: "TPL_ID",
			label: "3PL Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "SHIPPED_DATE",
			label: "Shipped Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_CREATED_BY",
			label: "Create By",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "200px"
		}, {
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		}];

        //var oSearch = new Date(((new Date()).getTime() - 90*24*60*60*1000)).Format("yyyy-MM-dd");

		config.bindRowUrl = "/UI_DISPATCH_ARCHIVED";//?$filter=SYS_CREATED_DATE ge datetime'" + oSearch + "'";
		config.defaultSort = [{
					field: "SYS_CREATED_DATE",
					bDescending: true
				}];
		//config.bindRowUrl = "/UI_DISPATCH_ARCHIVED";

		config.filtersRaw = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
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
			field: "WERK",
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
			field: "DEST_STORAGE_LOC",
			label: "Dest Str Loc",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Dest Type",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Dest Bin",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		}, {
			field: "MATNR",
			label: "Part Number",
			/*labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),*/
			type: "DropdownTable",
			dropdowntable: {
				/*layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),*/
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
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			/*labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),*/
			type: "DropdownBox",
			dropdownbox: {
				/*layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),*/
				odata: {
					url: sServiceUrl + "/InputParams('INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "PULL_TYPE",
			label: "Pull Type",
			/*labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),*/
			type: "DropdownBox",
			dropdownbox: {
				/*layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),*/
				odata: {
					url: sServiceUrl + "/CONF_MATERIAL_MAP?$format=json",
					bindKeyField: "PULL_TYPE",
					bindTextField: "PULL_TYPE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "SHIPPED_DATE",
			label: "Ship Date",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TimeRange",
			timerange: {
				fromLabelLayout: new sap.ui.layout.GridData({
					span: "L2 M2 S2"
				}),
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		}, {
			field: "DELIVERY_DATE",
			label: "Due Date",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TimeRange",
			timerange: {
				fromLabelLayout: new sap.ui.layout.GridData({
					span: "L2 M2 S2"
				}),
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		}, {
			field: "STATUS",
			label: "Status",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams('DISPATCH_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				},
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_DISPATCH_ARCHIVED"';
		config.download.columns = ["PULL_HEADER_ID", "PULL_LINE_ID", "MATNR","MATNR_DESCR",
			"WERKS",
			"SRC_STORAGE_LOC",
			"SRC_STORAGE_TYPE",
			"SRC_STORAGE_BIN",
			"PULL_TYPE",
			"DEST_STORAGE_LOC",
			"DEST_STORAGE_TYPE",
			"DEST_STORAGE_BIN",
			"INVENTORY_TYPE",
			"LIFNR",
			"TPL_ID",
			"SHIPPED_DATE",
			"SYS_CREATED_DATE",
			"SYS_CREATED_BY",
			"SYS_LAST_MODIFIED_BY",
			"SYS_LAST_MODIFIED_DATE",
			"STATUS"
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
		var header = lenovo.control.commontable.Table.createHeader("archived", "archived dispatches");
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
		if(oData.view === "Archived Dispatches") {
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