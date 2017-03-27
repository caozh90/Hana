/*
develop by Robin Yan @ 2014/12/17
to-do confirm & cancel & export & auth
update by alex liu @ 2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.manage.failedDispatches", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(7);
		var auth =  lenovo.control.commontable.Table.getViewAuth("failedDispatches");
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
			field: "MATNR_DESCR",
			label: "Part Description",
			type: "TextField",
			width: "200px"
		},{
			field: "LIFNR",label: "Supplier",width: "150px",type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/IN_SUPITEM",
				relatedUrl: "/IN_SUPITEM",
				field: "SUPPLIERID",
				relatedFields: [{key: "IN_ITEM", fieldIndex:2}, {key: "IN_SITEID", fieldIndex:7}],
				columns: [{
					label: "Supplier Id",field: "SUPPLIERID",type: "TextField"
				}, {
					label: "Supplier Name",field: "SUPPLIERDESC",type: "TextField"
				}],
				filters: [
					[{
						label: "Supplier Id",
						field: "SUPPLIERID",
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
		},{
			field: "SA_NUMBER",
			label: "Sa Number",
			width: "150px",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/IN_SA",
				relatedUrl: "/IN_SA",
				field: "SA_NUMBER",
				relatedFields: [{key: "IN_MATNR", fieldIndex:2}, {key: "IN_LIFNR", fieldIndex:4}],
				dependentFileds: [{field:"SA_LINE_ID", target:"Sa Line Id"}],//add by zhaodan1
				columns: [{
					label: "Sa Number",field: "SA_NUMBER",type: "TextField",width:"100px"
				}, {
					label: "Sa Line Id",field: "SA_LINE_ID",type: "TextField",width:"100px"
				}, {
					label: "Logical Plant",field: "WERKS",type: "TextField",width:"100px"
				}, {
					label: "Part No.",field: "MATNR",type: "TextField",width:"120px"
				}, {
					label: "Open QTY",field: "OPEN_QTY",type: "TextField",width:"100px"
				}, {
					label: "QTY",field: "QTY",type: "TextField",width:"80px"
				}, {
					label: "Start Date",field: "START_DATE",type: "TextField",width:"150px"
				}, {
					label: "End Date",field: "END_DATE",type: "TextField",width:"150px"
				}],
				filters: [
					[{
						field: "SA_NUMBER",label: "Sa Number",type: "TextField",						
					}],
					[{
						field: "SA_LINE_ID",label: "Sa Line Id",type: "TextField",
					}],
					[{
						field: "WERKS",label: "Plant",type: "TextField",
					}],
					[{
						field: "MATNR",label: "Part Number",type: "TextField",
					}],
					[{
						field: "OPEN_QTY",label: "Open QTY",type: "TextField",
					}],
					[{
						field: "QTY",label: "QTY",type: "TextField",
					}],
					[{
						field: "START_DATE",label: "Start Date",type: "TimeRange",
					}],
					[{
						field: "END_DATE",label: "End Date",type: "TimeRange",
					}]
				],
				filterLayout: {
					0: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
					1: new sap.ui.layout.GridData({span: "L8 M8 S8"})
				},
				visibleRowCount: 10
			}
		},{
			field: "SA_LINE_ID",
			label: "Sa Line Id",
			type: "TextField",
			width: "150px"
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
			field: "TPL_ID",
			label: "3pl Id",
			type: "TextField",
			width: "100px"
		},{
			field: "DEST_WERKS",
			label: "Ship To",
			type: "TextField",
			width: "100px"
		},{
			field: "SHIPPED_DATE",
			label: "Shipped Date",
			type: "TextField",
			width: "150px"
		},{
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "150px"
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

		config.bindRowUrl = "/FAILED_DISPATCHES";
		config.defaultSort = [ {
			field: "SYS_CREATED_DATE",
			bDescending: true
		},{
			field: "INVENTORY_TYPE",
			bDescending: false
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
			label: "Part No.",
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
			field: "TPL_ID",
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
			field: "SRC_STORAGE_LOC",
			label: "Source Location",
			type: "TextField"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Source Type",
			type: "TextField"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Source Bin",
			type: "TextField"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Destination Location",
			type: "TextField"
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Destination Type",
			type: "TextField"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Destination Bin",
			type: "TextField"
		},{
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "EQ"
			}
		},{
			field: "SYS_TIMESTAMP",
			label: "Sys TimeStamp",
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
						label: "Supplier Id",
						field: "SUPPLIERID",
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
		}];
 
		//edit
		config.editRaw = [{
			field: "SA_NUMBER",label: "Sa Number"		
		},{
			field: "LIFNR",label: "Supplier"			
		},{
			field: "MATNR",label: "Part Number", editable: false
		},{
			field: "WERKS",label: "Logical Plant", editable: false
		},{
			field: "SA_LINE_ID",label: "Sa Line Id", editable: false //ADD BY ZHAODAN1
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			1: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
			2: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			
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
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models.FailedDispatches/CV_DISPATCH_LIST"';
		config.download.columns = ["PULL_HEADER_ID","PULL_LINE_ID","MATNR","MATNR_DESCR","WERKS","PULL_TYPE","INVENTORY_TYPE","SRC_STORAGE_LOC","SRC_STORAGE_TYPE","SRC_STORAGE_BIN",
"STATUS","ECC_STEP","REASON_CODE","DEST_STORAGE_LOC","DEST_STORAGE_TYPE","DEST_STORAGE_BIN","LIFNR","TPL_ID","DEST_WERKS","SHIPPED_DATE",
"DELIVERY_DATE","SYS_CREATED_DATE","SYS_CREATED_BY","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE","TR_NUMBER","TR_ITEM_NUMBER","MATERIAL_DOCUMENT_YEAR","MATERIAL_DOCUMENT"];
		config.download.roleName = auth.exportableRoleName;
	},

	createContent: function(oController) {
		var service = new lenovo.service.VMI;
		
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
					"VIEW_NAME": "failedDispatches",
					"PROCESS_NAME": "CONFIRMED_DISPATCH_P",
					"TABLE_NAME": "MXEBGVMI.DISPATCH_LIST",
					"SEGMENT_NAME": "STATUS",
					"P_KEY": oUpdateData
				};
				$.ajax({
					url: iServiceUrl,
					type: "POST",
					// async: false,
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
		var auth =  lenovo.control.commontable.Table.getViewAuth("failedDispatches");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;			
			}
		}

		oToolbarCtn.insertContent(oInvokeBtn,0);
		
		var header = lenovo.control.commontable.Table.createHeader("Manage", "Failed Dispatches");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Failed Dispatches") {
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