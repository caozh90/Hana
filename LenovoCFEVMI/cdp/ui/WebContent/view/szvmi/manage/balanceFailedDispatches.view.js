/*
	develop by Coral Zhang @ 2014/12/16
	update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.manage.balanceFailedDispatches", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var auth =  lenovo.control.commontable.Table.getViewAuth("balanceFailedDispatches");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField",
			width: "100px"
		},{
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField",
			width: "100px"
		},{
			field: "MATNR",
			label: "Item Id",
			type: "TextField",
			width: "100px"
		},{
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		},{
			field: "INVENTORY_TYPE",
			label: "Invty Type",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_LOC",
			label: "Src Sto Loc",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Src Sto Type",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Src Sto Bin",
			type: "TextField",
			width: "100px"
		},{
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		},{
			field: "ECC_STEP",
			label: "Ecc Step",
			type: "TextField",
			width: "100px"
		},{
			field: "REASON_CODE",
			label: "Error Reason",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Sto Loc",
			type: "TextField",
			width: "100px"
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Dest Sto Type",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Dest Sto Bin",
			type: "TextField",
			width: "100px"
		},{
			field: "LIFNR",
			label: "Supplier",
			type: "TextField",
			width: "100px"
		},{
			field: "TPL_ID",
			label: "3pl Id",
			type: "TextField",
			width: "100px"
		},{
			field: "DELIVERY_DATE",
			label: "Due Date",
			type: "TextField",
			width: "100px"
		},{
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "TextField",
			width: "100px"
		},{
			field: "SYS_CREATED_BY",
			label: "Create By",
			type: "TextField",
			width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		},{
			field: "TR_NUMBER",
			label: "Tr Number",
			type: "TextField",
			width: "100px"
		},{
			field: "TR_ITEM_NUMBER",
			label: "Tr Item Number",
			type: "TextField",
			width: "150px"
		},{
			field: "MATERIAL_DOCUMENT_YEAR",
			label: "Material Document Year",
			type: "TextField",
			width: "200px"
		},{
			field: "MATERIAL_DOCUMENT",
			label: "Material Document",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/BALANCE_DISPATCH";
		config.defaultSort = [{
			field: "SYS_CREATED_DATE",
			bDescending: true
		},{
			field: "INVENTORY_TYPE",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField"
		},{
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField"
		},{
			field: "INVENTORY_TYPE",
			label: "Invty Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "MATNR",
			label: "Part Number",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				field: "ITEM",
				selectionMode: sap.ui.table.SelectionMode.Single,
				columns: [{
					label: "Item Id",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Item Desc",
					field: "ITEMDESC",
					type: "TextField"
				}],
				filters: [
					[{
						field: "ITEM",
						label: "Item Id",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						field: "ITEMDESC",
						label: "Item Desc",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		},{
			field: "TPL_ID",
			label: "3PL Id",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "WERKS",
			label: "Logical Plant",
			labelLayout: new sap.ui.layout.GridData({
							span: "L5 M5 S5",
							linebreak: true
						}),
			type: "DropdownBox",
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
		},{
			field: "SRC_STORAGE_LOC",
			label: "Source Storage Loc",
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
		},{
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
		},{
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
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
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
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Dest Type",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		},{
			field: "DEST_STORAGE_BIN",
			label: "Dest Bin",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ"
			}
		},{
			field: "SYS_TIMESTAMP",
			label: "Sys Timestamp",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "EQ"
			}
		},{
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "GE"
			}
		},{
			field: "LIFNR",
			label: "Supplier",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/SUPITEM",
				field: "SUPPLIERID",
				columns: [{
					label: "Supplier Id",
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
						label: "Supplier Id",
						type: "TextField",
						textfield: {
							// defaultFilterOp: "EQ"
						}
					}],
					[{
						label: "Supplier Name",
						field: "SUPPLIERDESC",
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
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

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
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_BALANCE_DISPATCH"';
		config.download.columns = ["PULL_HEADER_ID","PULL_LINE_ID","MATNR","WERKS","PULL_TYPE",
			"INVENTORY_TYPE","SRC_STORAGE_LOC","SRC_STORAGE_TYPE","SRC_STORAGE_BIN","STATUS",
			"ECC_STEP","REASON_CODE","DEST_STORAGE_LOC","DEST_STORAGE_TYPE","DEST_STORAGE_BIN","LIFNR",
			"TPL_ID","DELIVERY_DATE","SYS_CREATED_DATE","SYS_CREATED_BY","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE",
			"TR_NUMBER","TR_ITEM_NUMBER","MATERIAL_DOCUMENT_YEAR","MATERIAL_DOCUMENT"];
		config.download.roleName = auth.exportableRoleName;

	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmi();
		var iServiceUrl = service.getMXVmiDSGeneral();
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

		//add buttons:ready&Invoke TS Workflow
		var oToolbarCtn = oInsertUpload.getContent()[0];
		var oInvokeBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://begin",
			tooltip: "Confirm",
			visible: true,
			press: function(oEvent){
				var selectedIndices = table.getSelectedIndices();
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				var oUpdateData = [];
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.STATUS == "ERROR"){
						var oTemp = {
							PULL_LINE_ID: selectedObject.PULL_LINE_ID,
							PULL_HEADER_ID: selectedObject.PULL_HEADER_ID
						};
						oUpdateData.push(oTemp);
					}
				}
				if(oUpdateData.length == 0){
					lenovo.control.commontable.Toolkit.showErrorMsg("Status isn't matched!", "ERROR", "Error");
					return;
				}
				var oEntry = {
					"JOB_TYPE": "TS",
					"VIEW_NAME": "balanceFailedDispatches",
					"PROCESS_NAME": "BALANCE_PULL_TO_ECC_SZ",
					"TABLE_NAME": "SZEBGVMI.BALANCE_DISPATCH",
					"SEGMENT_NAME": "STATUS",
					"P_KEY": oUpdateData
				};
				$.ajax({
					url: iServiceUrl,
					type: "POST",
					data: JSON.stringify(oEntry),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						table.clearSelection();
						lenovo.control.commontable.Toolkit.showErrorMsg(msg, "SUCCESS", "Invoke");
					},
					error: function(e) {
						lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR", "Invoke");
					} 
				});
			}
		});
		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("balanceFailedDispatches");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;
			}
		}
		oToolbarCtn.insertContent(oInvokeBtn,0);

		var header = lenovo.control.commontable.Table.createHeader("Manage", "Balance Failed Dispatches");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Balance Failed Dispatches") {
			if(this.table && this.oModel) {		
				var defaultSort = lenovo.control.commontable.Table._getDefaultSort(this.config);
				this.table.bindRows(this.config.bindRowUrl, null, defaultSort);	
				var filterModel = new sap.ui.model.json.JSONModel();				
				var clearObj = this.oForm.data("clearObj");
				var obj = JSON.stringify(clearObj);
				lenovo.control.commontable.Table._clearAllFilterCondition(filterModel, this.oForm, obj);
			}		
		}
	}	
});