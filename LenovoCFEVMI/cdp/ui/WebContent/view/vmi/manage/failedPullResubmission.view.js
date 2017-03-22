/*
develop by Robin Yan @ 2014/12/16
to-do export & checkbox & auth & confirm & cancel
update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.manage.failedPullResubmission", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(8);
		var auth =  lenovo.control.commontable.Table.getViewAuth("failedPullResubmission");
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
			label: "3PL Confirmed Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "PULL_QTY",
			label: "Pull Qty",
			type: "TextField",
			width: "100px"
		}, {
			field: "FULL_BOX_QTY",
			label: "Full Box Qty",
			type: "TextField",
			width: "150px"
		}, {
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		}, {
			field: "ECC_STATUS",
			label: "ECC Status",
			type: "TextField",
			width: "100px"
		}, {
			field: "SA_NUMBER",
			label: "SA Number",
			type: "TextField",
			width: "100px"
		}, {
			field: "WERKS",
			label: "Src Site",
			type: "TextField",
			width: "100px"
		}, {
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "HEADER_SUPPLIERID",
			label: "3PL ID",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Src Storage Location",
			type: "TextField",
			width: "180px"
		}, {
			field: "SRC_STORAGE_TYPE",
			label: "Src Storage Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "SRC_STORAGE_BIN",
			label: "Src Storage Bin",
			type: "TextField",
			width: "150px"
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
			label: "Dest Storage Location",
			type: "TextField",
			width: "180px"
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Dest Storage Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Dest Storage Bin",
			type: "TextField",
			width: "150px"
		}, {
			field: "Production_Line",
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
			label: "Inventory Type",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "REASON_CODE",
			label: "Pull Error Code",
			type: "TextField",
			width: "150px"
		}, {
			field: "ECC_STEP",
			label: "Ecc Step",
			type: "TextField",
			width: "100px"
		}, {
			field: "TR_NUMBER",
			label: "TR Number",
			type: "TextField",
			width: "100px"
		}, {
			field: "TR_ITEM_NUMBER",
			label: "TR Item Number",
			type: "TextField",
			width: "150px"
		}, {
			field: "MATERIAL_DOCUMENT_YEAR",
			label: "Material Document Year",
			type: "TextField",
			width: "200px"
		}, {
			field: "MATERIAL_DOCUMENT",
			label: "Material Document",
			type: "TextField",
			width: "150px"
		}, {
			field: "Remark",
			label: "Remark",
			type: "TextField",
			width: "100px"
		}];

		config.bindRowUrl = "/FAILED_PULL_RESUBMISSION";
		config.defaultSort = [{
					field: "SYS_CREATED_DATE",
					bDescending: true
				}];
		config.filtersRaw = [{
			field: "PULL_LINE_ID",
			label: "Line Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "HEADER_SUPPLIERID",
			label: "3PL ID",
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
					url: sServiceUrl + "/InputParams(P_PTYPE='TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}, {
			field: "PULL_TYPE",
			label: "Pull Type",
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
					url: sServiceUrl + "/CONF_MATERIAL_MAP?$format=json",
					bindKeyField: "PULL_TYPE",
					bindTextField: "PULL_TYPE",
					defaultSelectAll: true
				}
			}
		}, {
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
		}, {
			field: "SYS_CREATED_BY",
			label: "Created By",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "SA_NUMBER",
			label: "SA Number",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7",
				})
			}
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6"
				})
			}
		}, {
			field: "SRC_STORAGE_BIN",
			label: "Source Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				})
			}
		}, {
			field: "SRC_STORAGE_TYPE",
			label: "Source Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				})
			}
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Source Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				})
			}
		}, {
			field: "DEST_STORAGE_BIN",
			label: "Destination Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				})
			}
		}, {
			field: "DEST_STORAGE_TYPE",
			label: "Destination Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				})
			}
		}, {
			field: "DEST_STORAGE_LOC",
			label: "Destination Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "TextField",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				})
			}
		}, {
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
		}, {
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
		}, {
			field: "SYS_CREATED_DATE",
			label: "Creation Date",
			type: "TimeRange"
		}, {
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TimeRange"
		}, {
			field: "NoResubmitableRecords",
			label: "No-Resubmitable Records",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "CheckBox",
			checkbox: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				}),
				filters: [{
					field: "STATUS",
					op: "EQ",
					value: "ERROR"
				}, {
					field: "PULL_QTY",
					op: "NE",
					value: "CONFIRMED_QTY"
				}]
			}
		}, {
			field: "UnpeggedSALines",
			label: "Unpegged SA Lines",
			labelLayout: new sap.ui.layout.GridData({
				span: "L6 M6 S6",
				linebreak: true
			}),
			type: "CheckBox",
			checkbox: {
				layout: new sap.ui.layout.GridData({
					span: "L6 M6 S6",
				}),
				filters: [{
					field: "INVENTORY_TYPE",
					op: "EQ",
					value: "SOI"
				}, {
					field: "SA_NUMBER",
					op: "EQ",
					value: ""
				}]
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
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_FAILED_PULL_RESUBMISSION"';
		config.download.columns = ["PULL_HEADER_ID", "PULL_LINE_ID", "MATNR", "MATNR_DESCR", "CONFIRM_QTY", "PULL_QTY", "FULL_BOX_QTY", "STATUS", "SA_NUMBER", "WERKS", "DELIVERY_DATE", "HEADER_SUPPLIERID",
			"SYS_CREATED_DATE", "SYS_LAST_MODIFIED_BY", "SRC_STORAGE_LOC", "SRC_STORAGE_TYPE", "SRC_STORAGE_BIN", "LINE_SUPPLIERID", "PULL_TYPE", "DEST_STORAGE_LOC",
			"DEST_STORAGE_TYPE", "DEST_STORAGE_BIN", "Production_Line", "PHYSICAL_PLANT", "INVENTORY_TYPE", "SYS_LAST_MODIFIED_DATE", "REASON_CODE", "ECC_STEP",
			"TR_NUMBER", "TR_ITEM_NUMBER", "MATERIAL_DOCUMENT_YEAR", "MATERIAL_DOCUMENT", "Remark"
		];
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
		var tplId = filterModel.getProperty("/HEADER_SUPPLIERID/filterValue");
		var pullType = filterModel.getProperty("/PULL_TYPE/filterValue");
		var logicPlant = filterModel.getProperty("/WERKS/filterValue");
		var creatBy = filterModel.getProperty("/SYS_CREATED_BY/filterValue");
		var saNumber = filterModel.getProperty("/SA_NUMBER/filterValue");
		var lastModifyBy = filterModel.getProperty("/SYS_LAST_MODIFIED_BY/filterValue");
		var srcBin = filterModel.getProperty("/SRC_STORAGE_BIN/filterValue");
		var srcType = filterModel.getProperty("/SRC_STORAGE_TYPE/filterValue");
		var srcLocation = filterModel.getProperty("/SRC_STORAGE_LOC/filterValue");
		var destBin = filterModel.getProperty("/DEST_STORAGE_BIN/filterValue");
		var destType = filterModel.getProperty("/DEST_STORAGE_TYPE/filterValue");
		var destLocation = filterModel.getProperty("/DEST_STORAGE_LOC/filterValue");
		var partNumber = filterModel.getProperty("/MATNR/filterValue");
		var InvtyType = filterModel.getProperty("/INVENTORY_TYPE/filterValue");
		var createDate = filterModel.getProperty("/SYS_CREATED_DATE/filterValue");
		var deliveryDate = filterModel.getProperty("/DELIVERY_DATE/filterValue");
		var noResubmitableRecords = filterModel.getProperty("/NoResubmitableRecords/filterValue");
		var unpeggedSALines = filterModel.getProperty("/UnpeggedSALines/filterValue");

		var filterStr = "$filter=(";
		if(lineId != ""){
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
		filterStr = filterStr + (tplId == all ? "" : ("HEADER_SUPPLIERID eq '" + tplId + "' and "));
		filterStr = filterStr + (pullType == all ? "" : ("PULL_TYPE eq '" + pullType + "' and "));
		filterStr = filterStr + (logicPlant == all ? "" : ("WERKS eq '" + logicPlant + "' and "));
		if(creatBy != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = creatBy.length; i < l; i++){
				filterStr = filterStr + "substringof('" + creatBy[i] + "',SYS_CREATED_BY) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((creatBy == null || creatBy == "") ? "" : ("substringof('" + creatBy + "',SYS_CREATED_BY) and "));
		if(saNumber != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = saNumber.length; i < l; i++){
				filterStr = filterStr + "substringof('" + saNumber[i] + "',SA_NUMBER) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((saNumber == null || saNumber == "") ? "" : ("substringof('" + saNumber + "',SA_NUMBER) and "));
		if(lastModifyBy != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = lastModifyBy.length; i < l; i++){
				filterStr = filterStr + "substringof('" + lastModifyBy[i] + "',SYS_LAST_MODIFIED_BY) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((lastModifyBy == null || lastModifyBy == "") ? "" : ("substringof('" + lastModifyBy + "',SYS_LAST_MODIFIED_BY) and "));
		if(srcBin != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = srcBin.length; i < l; i++){
				filterStr = filterStr + "substringof('" + srcBin[i] + "',SRC_STORAGE_BIN) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((srcBin == null || srcBin == "") ? "" : ("substringof('" + srcBin + "',SRC_STORAGE_BIN) and "));
		if(srcType != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = srcType.length; i < l; i++){
				filterStr = filterStr + "substringof('" + srcType[i] + "',SRC_STORAGE_TYPE) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((srcType == null || srcType == "") ? "" : ("substringof('" + srcType + "',SRC_STORAGE_TYPE) and "));
		if(srcLocation != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = srcLocation.length; i < l; i++){
				filterStr = filterStr + "substringof('" + srcLocation[i] + "',SRC_STORAGE_LOC) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((srcLocation == null || srcLocation == "") ? "" : ("substringof('" + srcLocation + "',SRC_STORAGE_LOC) and "));
		if(destBin != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = destBin.length; i < l; i++){
				filterStr = filterStr + "substringof('" + destBin[i] + "',DEST_STORAGE_BIN) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((destBin == null || destBin == "") ? "" : ("substringof('" + destBin + "',DEST_STORAGE_BIN) and "));
		if(destType != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = destType.length; i < l; i++){
				filterStr = filterStr + "substringof('" + destType[i] + "',DEST_STORAGE_TYPE) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((destType == null || destType == "") ? "" : ("substringof('" + destType + "',DEST_STORAGE_TYPE) and "));
		if(destLocation != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = destLocation.length; i < l; i++){
				filterStr = filterStr + "substringof('" + destLocation[i] + "',DEST_STORAGE_LOC) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		//filterStr = filterStr + ((destLocation == null || destLocation == "") ? "" : ("substringof('" + destLocation + "',DEST_STORAGE_LOC) and "));
		if(partNumber != ""){
			filterStr = filterStr + "(";
			for(var i = 0, l = partNumber.length; i < l; i++){
				filterStr = filterStr + "substringof('" + partNumber[i] + "',MATNR) or ";
			}
			filterStr = filterStr.substring(0, filterStr.length - 4);
			filterStr = filterStr + ") and ";
		}
		filterStr = filterStr + (InvtyType == all ? "" : ("INVENTORY_TYPE eq '" + InvtyType + "' and "));

		/*filterStr = filterStr + ((createDate.start == null || createDate.start == "") ? "" : ("SYS_CREATED_DATE ge " + sap.ui.model.odata.ODataUtils.formatValue(createDate.start,"Edm.DateTime") + " and "));
		filterStr = filterStr + ((createDate.end == null || createDate.end == "") ? "" : ("SYS_CREATED_DATE le " + sap.ui.model.odata.ODataUtils.formatValue(createDate.end,"Edm.DateTime") + " and "));
		filterStr = filterStr + ((deliveryDate.start == null || deliveryDate.start == "") ? "" : ("DELIVERY_DATE ge " + sap.ui.model.odata.ODataUtils.formatValue(deliveryDate.start,"Edm.DateTime") + " and "));
		filterStr = filterStr + ((deliveryDate.end == null || deliveryDate.end == "") ? "" : ("DELIVERY_DATE le " + sap.ui.model.odata.ODataUtils.formatValue(deliveryDate.end,"Edm.DateTime") + " and "));
		*/
		var createDateStart = sap.ui.model.odata.ODataUtils.formatValue(createDate.start,"Edm.DateTime");
		var createDateEnd = sap.ui.model.odata.ODataUtils.formatValue(createDate.end,"Edm.DateTime");
		var deliveryDateStart = sap.ui.model.odata.ODataUtils.formatValue(deliveryDate.start,"Edm.DateTime");
		var deliveryDateEnd = sap.ui.model.odata.ODataUtils.formatValue(deliveryDate.end,"Edm.DateTime");
		filterStr = filterStr + ((createDate.start == null || createDate.start == "") ? "" : ("SYS_CREATED_DATE ge " + createDateStart.split("datetime")[1] + " and "));
		filterStr = filterStr + ((createDate.end == null || createDate.end == "") ? "" : ("SYS_CREATED_DATE le " + createDateEnd.split("datetime")[1] + " and "));
		filterStr = filterStr + ((deliveryDate.start == null || deliveryDate.start == "") ? "" : ("DELIVERY_DATE ge " + deliveryDateStart.split("datetime")[1] + " and "));
		filterStr = filterStr + ((deliveryDate.end == null || deliveryDate.end == "") ? "" : ("DELIVERY_DATE le " + deliveryDateEnd.split("datetime")[1] + " and "));
		
		if(noResubmitableRecords){
			filterStr = filterStr + "STATUS eq 'ERROR' and PULL_QTY ne CONFIRM_QTY and ";
		}
		if(unpeggedSALines){
			filterStr = filterStr + "INVENTORY_TYPE eq 'SOI' and length(SA_NUMBER) eq 0 or SA_NUMBER eq '' and ";
		}

		filterStr = filterStr.substring(0, filterStr.length - 5);
		filterStr = "?" + filterStr + ")";
		this.searchCountURL = sServiceUrl + url + "/$count" + filterStr;
		if(filterStr == "?$fil)"){
			filterStr = "";
			this.searchCountURL = sServiceUrl + "/FAILED_PULL_RESUBMISSION/$count";
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
		var service = new lenovo.service.VMI;

		var sServiceUrl = service.getMXVmi();
		var iServiceUrl = service.getMXVmiDSGeneral();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);
		this.searchCountURL = sServiceUrl + "/FAILED_PULL_RESUBMISSION/$count";
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
					if(selectedObject.ECC_STATUS == "PULL_ERROR"){
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
					"VIEW_NAME": "failedPullResubmission",
					"PROCESS_NAME": "RESUBMIT_PULL_TO_ECC",
					"TABLE_NAME": "MXEBGVMI.PULL_LINE",
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
		var auth =  lenovo.control.commontable.Table.getViewAuth("failedPullResubmission");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;
			}
		}
		oToolbarCtn.insertContent(oInvokeBtn,0);

		var header = lenovo.control.commontable.Table.createHeader("Manage", "Failed Pull Resubmission");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Failed Pull Resubmission") {
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