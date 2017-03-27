/*
develop by Alex Liu @ 2014/12/5
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.monitor.pullSignals", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var auth =  lenovo.control.commontable.Table.getViewAuth("pullSignals");
		//var headerHeight = 450;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "Link",
			width: "100px"
		}, {
			field: "HEADER_SUPPLIERID",
			label: "Supplier",
			type: "TextField",
			width: "100px"
		}, {
			field: "LINE_SUPPLIERID",
			label: "Vendor",
			type: "TextField",
			width: "100px"
		}, {
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Created Date(GMT+8)",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_CREATED_BY",
			label: "Created By",
			type: "TextField",
			width: "100px"
		}, {
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "INVENTORY_TYPE",
			label: "Invty Type",
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
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_Date",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		}];

		var linkColunmn = lenovo.control.commontable.Toolkit.getMatchedElementFromArray("field", "PULL_HEADER_ID", config.columns)[0];
		linkColunmn.linkConfig = {
			url: sServiceUrl,
			bindRowUrl: "/UI_PULL_LINE",
			columns: [{
				field: "PULL_LINE_ID",
				label: "Line Id",
				type: "TextField",
				width: "80px"
			}, {
				field: "MATNR",
				label: "Part Number",
				type: "TextField",
				width: "110px"
			}, {
				field: "MATNR_DESCR",
				label: "Part Description",
				type: "TextField",
				width: "150px"
			}, {
				field: "WERKS",
				label: "Logical Plant",
				type: "TextField",
				width: "120px"
			}, {
				field: "CONFIRM_QTY",
				label: "3PL Confirmed Qty",
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
				field: "REMARK",
				label: "Remark",
				type: "TextField",
				width: "100px"
			}],
			headerInfo: {
				url: sServiceUrl,
				path: "/UI_PULL_LINE",
				key: "PULL_HEADER_ID",
				filters: [{
					field: "PULL_HEADER_ID",
					label: "Pull Id"
				}, {
					field: "STATUS",
					label: "Status"
				}, {
					field: "DEST_STORAGE_TYPE",
					label: "Destination Type"
				}, {
					field: "DEST_STORAGE_BIN",
					label: "Destination Bin"
				}, {
					field: "PRODUCTION_LINE",
					label: "Production Line"
				}, {
					field: "HEADER_SUPPLIERID",
					label: "Supplier"
				}, {
					field: "SYS_CREATED_BY",
					label: "Created By"
				}, {
					field: "SYS_CREATED_DATE",
					label: "Creation Date(GMT+8)"
				}, {
					field: "DELIVERY_DATE",
					label: "Delivery Date"
				}, {
					field: "PHYSICAL_PLANT",
					label: "Physical Plant"
				}, {
					field: "PULL_TYPE",
					label: "Pull Type"
				}]
			}
		};

		config.bindRowUrl = "/UI_PULL_LINE";
		config.defaultSort = {
			field: "SYS_CREATED_DATE",
			bDescending: true
		};

		config.filtersRaw = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField"
		}, {
			field: "HEADER_SUPPLIERID",
			label: "Supplier",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SUPITEM",
				field: "SUPPLIERID",
				columns: [{
					label: "Supplier",
					field: "SUPPLIERID",
					type: "TextField"
				}, {
					label: "Supplier Name",
					field: "SUPPLIERDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "SUPPLIERID",
						label: "Supplier",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "SUPPLIERDESC",
						label: "Supplier Name",
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
			field: "DEST_STORAGE_TYPE",
			label: "Dest Type",
			type: "TextField"
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
			type: "TextField"
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Dest Bin",
			type: "TextField"
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
			field: "SYS_CREATED_BY",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			label: "Created By",
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		}, {
			field: "SYS_CREATED_DATE",
			label: "Created Date",
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
			type: "ListBox",
			listbox: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
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
			0: new sap.ui.layout.GridData({
				span: "L3 M3 S3"
			}),
			1: new sap.ui.layout.GridData({
				span: "L4 M4 S4"
			}),
			2: new sap.ui.layout.GridData({
				span: "L5 M5 S5"
			}),

		};

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_PULL_LINE"';
		config.download.columns = ["PULL_HEADER_ID", "HEADER_SUPPLIERID", "LINE_SUPPLIERID", "WERKS", "SYS_CREATED_DATE",
			"SYS_CREATED_BY", "PULL_TYPE", "INVENTORY_TYPE", "DEST_STORAGE_LOC", "DEST_STORAGE_TYPE", "DEST_STORAGE_BIN", "STATUS",
			"PHYSICAL_PLANT", "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_Date"
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
		var header = lenovo.control.commontable.Table.createHeader("monitor", "pull signals");
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

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Pull Signals") {
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