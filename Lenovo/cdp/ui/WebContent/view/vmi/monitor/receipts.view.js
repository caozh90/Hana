/*
	develop by Coral Zhang @ 2014/12/9
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.monitor.receipts", {
	setConfig: function(config, sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var auth =  lenovo.control.commontable.Table.getViewAuth("receipts");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "RECEIPT_ID",
			label: "Receipt Id",
			type: "TextField",
			width: "120px"
		}, {
			field: "INVENTORY_TYPE",
			label: "Inv Type",
			type: "TextField",
			width: "80px"
		}, {
			field: "HAWB",
			label: "Hawb",
			type: "TextField",
			width: "100px"
		}, {
			field: "TPL_RECEIPT_ID",
			label: "3PL Receipt Id",
			type: "TextField",
			width: "150px"
		}, {
			field: "TPL_RECEIPT_LINE_ID",
			label: "3PL Receipt Line Id",
			type: "TextField",
			width: "150px"
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
			field: "QTY",
			label: "Received Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "LIFNR",
			label: "Vendor",
			type: "TextField",
			width: "100px"
		}, {
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		}, {
			field: "RECEIPT_DATE",
			label: "Receipt Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_TIMESTAMP",
			label: "Sys Timestamp",
			type: "TextField",
			width: "150px"
		}, {
			field: "HOLD_TYPE",
			label: "Hold Type",
			type: "TextField",
			width: "100px"
		}, {
			field: "HOLD_QTY",
			label: "Hold Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "DEST_STORAGE_LOCATION",
			label: "Destination Location",
			type: "TextField",
			width: "200px"
		}, {
			field: "DEST_TYPE",
			label: "Destination Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "DEST_BIN",
			label: "Destination Bin",
			type: "TextField",
			width: "150px"
		}, {
			field: "TPL_ID",
			label: "3PL ID",
			type: "TextField",
			width: "100px"
		}, {
			field: "PO_LINE_ID",
			label: "PO Line Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "PO_NUMBER",
			label: "PO Id",
			type: "TextField",
			width: "100px"
		}, {
			field: "INVOICE_NUMBER",
			label: "Invoice",
			type: "TextField",
			width: "100px"
		}, {
			field: "MATERIAL_DOCUMENT_YEAR",
			label: "Mtr Document Year",
			type: "TextField",
			width: "200px"
		}, {
			field: "MATERIAL_DOCUMENT",
			label: "Mtr Document",
			type: "TextField",
			width: "150px"
		}, {
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Modified By User",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_CREATED_BY",
			label: "Created By",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Creation Date",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_AUTH_ID",
			label: "Auth Id",
			type: "TextField",
			width: "100px"
		}];

		// config.bindRowUrl = "/UI_GR?$orderby=SYS_TIMESTAMP desc&SYS_CREATED_DATE desc";
		config.bindRowUrl = "/UI_GR";
		config.defaultSort = [{
			field: "SYS_CREATED_DATE",
			bDescending: true
		},{
			field: "SYS_TIMESTAMP",
			bDescending: true
		}];
		config.filtersRaw = [{
			field: "RECEIPT_ID",
			label: "Receipt Id",
			type: "TextField",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			textfield: {
				// defaultFilterOp: "EQ"
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// type: new lenovo.control.commontable.singleQuotes()
			}
		}, {
			field: "TPL_RECEIPT_ID",
			label: "3PL Receipt Id",
			type: "TextField",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			textfield: {
				// defaultFilterOp: "EQ"
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// type: new lenovo.control.commontable.singleQuotes()
			}
		}, {
			field: "TPL_RECEIPT_LINE_ID",
			label: "3PL Receipt Line Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// type: new lenovo.control.commontable.singleQuotes()
			}
		}, {
			field: "MATNR",
			label: "Part Number",
			type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			dropdowntable: {				
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				// defaultFilterOp: "EQ",
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
						label: "Part Description",
						field: "ITEMDESC",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
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
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			dropdownbox: {			
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "LIFNR",
			label: "Vendor",
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
							defaultFilterOp: "EQ"
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
							defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "PO_NUMBER",
			label: "PO Id",
			type: "TextField",
			/*textfield: {
				type: new lenovo.control.commontable.singleQuotes()
			}*/
		}, {
			field: "PO_LINE_ID",
			label: "PO Line Id",
			type: "TextField",
			/*textfield: {
				type: new lenovo.control.commontable.singleQuotes()
			}*/
		}, {
			field: "TPL_ID",
			label: "3PL ID",
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
			field: "STATUS",
			label: "Status",
			type: "DropdownBox",
			dropdownbox: {			
				odata: {
					url: sServiceUrl + "/InputParams('GR_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "INVENTORY_TYPE",
			label: "Inv Type",
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
			field: "RECEIPT_DATE",
			label: "Receipt Date",
			type: "TimeRange"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Creation Date",
			type: "TimeRange"
		}, {
			field: "HAWB",
			label: "Hawb",
			type: "TextField"
		}, {
			field: "INVOICE_NUMBER",
			label: "Invoice",
			type: "TextField"
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			2: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
		};

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_GR"';
		config.download.columns = ["RECEIPT_ID", "INVENTORY_TYPE", "HAWB", "TPL_RECEIPT_ID", "TPL_RECEIPT_LINE_ID", "MATNR", "MATNR_DESCR", "QTY", "LIFNR", "WERKS", "RECEIPT_DATE", "SYS_TIMESTAMP", "HOLD_TYPE", "HOLD_QTY", "DEST_STORAGE_LOCATION", "DEST_TYPE", "DEST_BIN", "TPL_ID", "PO_LINE_ID", "PO_NUMBER", "INVOICE_NUMBER", "MATERIAL_DOCUMENT_YEAR", "MATERIAL_DOCUMENT", "STATUS", "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE", "SYS_CREATED_BY", "SYS_CREATED_DATE", "SYS_AUTH_ID"];
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

	createContent: function() {
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);
		var header = lenovo.control.commontable.Table.createHeader("monitor", "receipts");
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
		if(oData.view === "Receipts") {
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