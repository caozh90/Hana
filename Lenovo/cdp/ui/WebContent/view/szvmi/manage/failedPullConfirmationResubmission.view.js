/*
develop by Robin Yan @ 2014/12/16
to-do export & checkbox & auth & confirm & cancel
update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.manage.failedPullConfirmationResubmission", {
	getControllerName: function() {

	},
 
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
		var auth =  lenovo.control.commontable.Table.getViewAuth("failedPullConfirmationResubmission");
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
			label: "Part Number",
			type: "TextField",
			width: "100px"
		},{
			field: "CONFIRMED_QTY",
			label: "3PL Confirmed Qty",
			type: "TextField",
			width: "150px"
		},{
			field: "REQUEST_QTY",
			label: "Request Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "CONFIRMED_QTY",
			label: "Full Box Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "TPL_ID",
			label: "Supplier ID",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_LOC",
			label: "Src Storage Location",
			type: "TextField",
			width: "180px"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Src Storage Type",
			type: "TextField",
			width: "150px"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Src Storage Bin",
			type: "TextField",
			width: "150px"
		},{
			field: "LIFNR",
			label: "Vendor",
			type: "TextField",
			width: "100px"
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		},{
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Conf Last Modified Date",
			type: "TextField",
			width: "200px"
		},{
			field: "STATUS",
			label: "Conf Ecc Status",
			type: "TextField",
			width: "150px"
		},{
			field: "REASON_CODE",
			label: "Conf Error Code",
			type: "TextField",
			width: "150px"
		},{
			field: "ECC_STEP",
			label: "Conf Ecc Step",
			type: "TextField",
			width: "150px"
		},{
			field: "TR_NUMBER",
			label: "Conf Tr Number",
			type: "TextField",
			width: "150px"
		},{
			field: "TR_ITEM_NUMBER",
			label: "Conf Tr Item Number",
			type: "TextField",
			width: "180px"
		},{
			field: "MATERIAL_DOCUMENT_YEAR",
			label: "Conf Material Document Year",
			type: "TextField",
			width: "220px"
		},{
			field: "MATERIAL_DOCUMENT",
			label: "Conf Material Document",
			type: "TextField",
			width: "180px"
		},{
			field: "DIFFERENCE_QTY",
			label: "Difference Qty",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/CLEAR_DIFF";
		config.defaultSort = [{
					field: "SYS_TIMESTAMP",
					bDescending: true
				}];
		config.filtersRaw = [{
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField"
		},{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Source Bin",
			type: "TextField"
		},{
			field: "HEADER_SUPPLIERID",
			label: "3PL ID",
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
			field: "MATNR",
			label: "Part Number",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/ITEMSITEMASTER001",
				field: "ITEM",
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
			field: "SRC_STORAGE_LOC",
			label: "Source Location",
			type: "TextField"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Source Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout:  new sap.ui.layout.GridData({span: "L6 M6 S6"})
			}
		},{
			field: "INVENTORY_TYPE",
			label: "Invty Type",
			type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			dropdownbox: {
				layout:  new sap.ui.layout.GridData({span: "L6 M6 S6"}),
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='INVENTORY_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "NoResubmitableRecords",
			label: "No-Resubmitable Records",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			
			type: "CheckBox",
			checkbox: {
				layout:  new sap.ui.layout.GridData({span: "L6 M6 S6"}),
				filters: [{field:"STATUS",
							op: "EQ",
							value: "ERROR"
						  },{
						  	field:"REQUEST_QTY",
							op: "NE",
							value: "CONFIRMED_QTY"
						  }]
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
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_CLEAR_DIFF"';
		config.download.columns = ["PULL_HEADER_ID","PULL_LINE_ID","MATNR","CONFIRMED_QTY","Request_QTY","CONFIRMED_QTY","WERKS","TPL_ID","SRC_STORAGE_LOC","SRC_STORAGE_TYPE","SRC_STORAGE_BIN",
"LIFNR","PULL_TYPE","INVENTORY_TYPE","SYS_TIMESTAMP","STATUS","REASON_CODE","ECC_STEP","TR_NUMBER","TR_ITEM_NUMBER","MATERIAL_DOCUMENT_YEAR","MATERIAL_DOCUMENT","DIFFERENCE_QTY"];
		config.download.roleName = auth.exportableRoleName;
		config.download.urlParam = {
			func: this.downloadUrlParam,
			context: this
		};
		config.download.countUrl = {
			func: this.downloadCountUrl,
			context: this
		};
	},

	downloadUrlParam: function(){
		console.log("downloadUrlParam: " + this.searchURL);
		return this.searchURL;
	},

	downloadCountUrl: function(){
		console.log("downloadCountUrl: " + this.searchCountURL);
		return this.searchCountURL;
	},
	
	_search: function(filterModel, table, url, sServiceUrl){
		var all = lenovo.control.Constants.allDropdownBoxListItem;
		var lineId = filterModel.getProperty("/PULL_LINE_ID/filterValue");
		var pullId = filterModel.getProperty("/PULL_HEADER_ID/filterValue");
		var srcBin = filterModel.getProperty("/SRC_STORAGE_BIN/filterValue");
		var tplId = filterModel.getProperty("/HEADER_SUPPLIERID/filterValue");
		var pullType = filterModel.getProperty("/PULL_TYPE/filterValue");
		var logicPlant = filterModel.getProperty("/WERKS/filterValue");
		var partNumber = filterModel.getProperty("/MATNR/filterValue");
		var srcLocation = filterModel.getProperty("/SRC_STORAGE_LOC/filterValue");
		var srcType = filterModel.getProperty("/SRC_STORAGE_TYPE/filterValue");
		var InvtyType = filterModel.getProperty("/INVENTORY_TYPE/filterValue");
		var noResubmitableRecords = filterModel.getProperty("/NoResubmitableRecords/filterValue");
		var filterStr = "$filter=(";
		if(lineId != "") {
			filterStr = filterStr + "(";
			for(var i = 0, l = lineId.length; i < l; i++){
				filterStr = filterStr + "substringof('" + lineId[i] + "',PULL_LINE_ID) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((lineId == null || lineId == "") ? "" : ("substringof('" + lineId + "',PULL_LINE_ID) and "));
		if(pullId != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = pullId.length; i < l; i++){
				filterStr = filterStr + "substringof('" + pullId[i] + "',PULL_HEADER_ID) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((pullId == null || pullId == "") ? "" : ("substringof('" + pullId + "',PULL_HEADER_ID) and "));
		if(srcBin != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = srcBin.length; i < l; i++){
				filterStr = filterStr + "substringof('" + srcBin[i] + "',SRC_STORAGE_BIN) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((srcBin == null || srcBin == "") ? "" : ("substringof('" + srcBin + "',SRC_STORAGE_BIN) and "));
		filterStr = filterStr + (tplId == all ? "" : ("HEADER_SUPPLIERID eq '" + tplId + "' and "));
		filterStr = filterStr + (pullType == all ? "" : ("PULL_TYPE eq '" + pullType + "' and "));
		filterStr = filterStr + (logicPlant == all ? "" : ("WERKS eq '" + logicPlant + "' and "));
		if(partNumber != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = partNumber.length; i < l; i++){
				filterStr = filterStr + "substringof('" + partNumber[i] + "',MATNR) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		if(srcLocation != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = srcLocation.length; i < l; i++){
				filterStr = filterStr + "substringof('" + srcLocation[i] + "',SRC_STORAGE_LOC) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((srcLocation == null || srcLocation == "") ? "" : ("substringof('" + srcLocation + "',SRC_STORAGE_LOC) and "));
		if(srcType != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = srcType.length; i < l; i++){
				filterStr = filterStr + "substringof('" + srcType[i] + "',SRC_STORAGE_TYPE) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((srcType == null || srcType == "") ? "" : ("substringof('" + srcType + "',SRC_STORAGE_TYPE) and "));
		filterStr = filterStr + (InvtyType == all ? "" : ("INVENTORY_TYPE eq '" + InvtyType + "' and "));
		if(noResubmitableRecords){
			filterStr = filterStr + "STATUS eq 'ERROR' and REQUEST_QTY ne CONFIRMED_QTY and ";
		}
		filterStr = filterStr.substring(0, filterStr.length - 5);
		filterStr = "?" + filterStr + ")";

		this.searchCountURL = sServiceUrl + url + "/$count" + filterStr;
		

		if(filterStr == "?$fil)"){
			filterStr = "";
			this.searchCountURL = sServiceUrl + "/CLEAR_DIFF/$count";
			this.searchURL = "";
		}else{
			this.searchURL = "&" + filterStr.substring(2, filterStr.length);
		}

		console.log(this.searchURL);
		table.clearSelection();
		table.setBusy(true);
		table.setFirstVisibleRow(0);
		table.bindRows(url + filterStr);
	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmi();
		var iServiceUrl = service.getMXVmiDSGeneral();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);
		this.searchCountURL = sServiceUrl + "/CLEAR_DIFF/$count";
		this.searchURL = "";		
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});
		config._search = {
			args: [table, config.bindRowUrl,sServiceUrl],
			func: this._search,
			context: this
		};
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
							PULL_HEADER_ID: selectedObject.PULL_HEADER_ID,
							WERKS: selectedObject.WERKS
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
					"VIEW_NAME": "failedPullConfirmationResubmission",
					"PROCESS_NAME": "RESUBMIT_CONFIRMED_PULL_TO_ECC_SZ",
					"TABLE_NAME": "SZEBGVMI.CLEAR_DIFF",
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
		var auth =  lenovo.control.commontable.Table.getViewAuth("failedPullConfirmationResubmission");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;
			}
		}
		oToolbarCtn.insertContent(oInvokeBtn,0);

		var header = lenovo.control.commontable.Table.createHeader("Manage", "Failed Pull Confirmation Resubmission");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Failed Pull Confirmation Resubmission") {
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