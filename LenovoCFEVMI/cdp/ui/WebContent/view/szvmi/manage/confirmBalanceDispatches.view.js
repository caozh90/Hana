/*
	develop by Coral Zhang @ 2014/12/18
	update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.manage.confirmBalanceDispatches", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(7);
		var auth =  lenovo.control.commontable.Table.getViewAuth("confirmBalanceDispatches");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);
		config.columns = [{
			field: "PULL_HEADER_ID",
			label: "Header Id",
			type: "TextField",
			width: "100px"
		},{
			field: "QTY_SUM",
			label: "Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Location",
			type: "TextField",
			width: "200px"
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Dest Storage Type",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Dest Storage Bin",
			type: "TextField",
			width: "150px"
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
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		},{
			field: "TPL_ID",
			label: "3PL Id",
			type: "TextField",
			width: "100px"
		}];

		config.bindRowUrl = "/CONFIRM_BALANCE_DISPATCH";
		config.defaultSort = [{
					field: "SYS_LAST_MODIFIED_DATE",
					bDescending: true
				}];
		config.filtersRaw = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField"
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
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		},{
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Loc",
			type: "TextField"
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Dest Storage Type",
			type: "TextField"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Dest Storage Bin",
			type: "TextField"
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
			field: "MATNR_DESCR",
			label: "Part Description",
			type: "TextField",
			textfield: {
				// defaultFilterOp: "EQ",
			}
		},{
			field: "SHIPPED_DATE",
			label: "Shipped Date",
			type: "TimeRange"
		},{
			field: "DELIVERY_DATE",
			label: "Due Date",
			type: "TimeRange"
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
	

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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/CV_CONFIRM_BALANCE_DISPATCHES"';
		config.download.columns = ["PULL_HEADER_ID","QTY_SUM","WERKS","DEST_STORAGE_LOC","DEST_STORAGE_TYPE","DEST_STORAGE_BIN","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE","STATUS"];
		config.download.roleName = auth.exportableRoleName;
	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmi();
		//var dSchema = service.getMXVmiSchema();
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
					if(selectedObject.STATUS == "IN_PROCESS"){
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
					"VIEW_NAME": "confirmBalanceDispatches",
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
		var auth =  lenovo.control.commontable.Table.getViewAuth("confirmBalanceDispatches");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;
			}
		}
		oToolbarCtn.insertContent(oInvokeBtn,0);
		
		var header = lenovo.control.commontable.Table.createHeader("Manage", "Confirm Balance Dispatches");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Confirm Balance Dispatches") {
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