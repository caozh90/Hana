/*
	develop by Coral Zhang @ 2014/12/18
	update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.manage.confirmDispatches", {
	setConfig: function(config,sServiceUrl,auth) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		//var auth =  lenovo.control.commontable.Table.getViewAuth("confirmDispatches");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(7);
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField",
			width: "100px"
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		},{
			field: "WERKS",
			label: "Physical Plant",
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
		}];

		config.bindRowUrl = "/CONFIRM_DISPATCHES";
		config.defaultSort = [{
					field: "SYS_CREATED_DATE",
					bDescending: true
				}];
		config.filtersRaw = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField"
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
			field: "TPL_ID",
			label: "3PL Id",
			type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				},
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		},{
			field: "SHIPPED_DATE",
			label: "Shipped Date",
			type: "TimeRange",
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
		},{
			field: "DELIVERY_DATE",
			label: "Due Date",
			type: "TimeRange",
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
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
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
					url: sServiceUrl + "/CONF_MATERIAL_MAP?$select=PULL_TYPE&$format=json",
					bindKeyField: "PULL_TYPE",
					bindTextField: "PULL_TYPE",
					defaultSelectAll: true
				}
			}
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
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/CV_DISPATCH_LIST"';
		config.download.columns = ["PULL_HEADER_ID","PULL_TYPE","WERKS","DEST_STORAGE_LOC","DEST_STORAGE_TYPE","DEST_STORAGE_BIN","TPL_ID","DEST_WERKS","SHIPPED_DATE","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE","STATUS"];
		config.download.roleName = auth.exportableRoleName;
	},

	createContent: function(oController) {
		var service = new lenovo.service.VMI;
		
		var sServiceUrl = service.getMXVmi();
		//var dSchema = service.getMXVmiSchema();
		var iServiceUrl = service.getMXVmiDSGeneral();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		var auth =  lenovo.control.commontable.Table.getViewAuth("confirmDispatches");
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl,auth);

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
					"VIEW_NAME": "confirmDispatches",
					"PROCESS_NAME": "CONFIRMED_DISPATCH_P",
					"TABLE_NAME": "MXEBGVMI.DISPATCH_LIST",
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
		//var auth =  lenovo.control.commontable.Table.getViewAuth("confirmDispatches");
		for (i in auth) {
			switch(i) {
				case "confirm":
					oInvokeBtn.setVisible(auth[i]);
					break;
			}
		}
		oToolbarCtn.insertContent(oInvokeBtn,0);
		
		var header = lenovo.control.commontable.Table.createHeader("Manage", "Confirm Dispatches");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Confirm Dispatches") {
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