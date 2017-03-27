/*
	develop by Coral Zhang @ 2014/12/18
	update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.changeASNPull", {
	setConfig: function(config,sServiceUrl,auth) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		//var auth =  lenovo.control.commontable.Table.getViewAuth("confirmDispatches");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "DEST_STORAGE_TYPE",
			label: "Dest Type",
			type: "TextField",
			width: "100px"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Dest Bin",
			type: "TextField",
			width: "100px"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Location",
			type: "TextField",
			width: "100px"
		},{
			field: "WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "IS_LOI",
			label: "is LOI",
			type: "TextField",
			width: "150px"
		},{
			field: "PRODUCTION_LINE",
			label: "Pdtn Line",
			type: "TextField",
			width: "100px"
		},{
			field: "SUPPLIER",
			label: "Supplier",
			type: "TextField",
			width: "100px"
		},{
			field: "DELIVERY_DATE",
			label: "Date",
			type: "TextField",
			width: "150px"
		},{
			field: "MATNR",
			label: "Item Id",
			type: "TextField",
			width: "150px"
		},{
			field: "PULL_QTY",
			label: "Qty",
			type: "TextField",
			width: "150px"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Src Type",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Src Bin",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_LOC",
			label: "Src Location",
			type: "TextField",
			width: "100px"
		},{
			field: "VENDOR",
			label: "Vendor",
			type: "TextField",
			
		},{
			field: "NOTES",
			label: "Notes",
			type: "TextField",
			/*type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='ASN_PULL_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			},*/
		   width: "150px"
		}];

		config.bindRowUrl = "/CHANGE_ASN_PULL";
/*		config.defaultSort = [{
					field: "SYS_CREATED_DATE",
					bDescending: true
				}];*/
		config.filtersRaw = [{
			field: "PRODUCTION_LINE",
			label: "Pdtn Line",
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
			field: "DELIVERY_DATE", label: "Date Range", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
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
		},{
			field: "NOTES",
			label: "Notes",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='ASN_PULL_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		config.editRaw = [ 
		                   {field: "NOTES", label: "Notes", type: "DropdownBox",
		           			dropdownbox: {
		        				odata: {
		        					url: sServiceUrl + "/InputParams(P_PTYPE='ASN_PULL_STATUS')/Results?$format=json",
		        					bindKeyField: "PVALUE",
		        					bindTextField: "PVALUE",
		        					defaultSelectAll: true
		        				}
		        			}, 
		        			referTo: "Notes"}
		                  ];
		//auth
		config.create.visible=false;
		config.edit.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.download.visible = true;
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_ASN_PULL"';
		config.download.columns = ["DEST_STORAGE_TYPE","DEST_STORAGE_BIN","DEST_STORAGE_LOC","WERKS","PHYSICAL_PLANT","IS_LOI","PRODUCTION_LINE","SUPPLIER","DELIVERY_DATE","MATNR","PULL_QTY","SRC_STORAGE_TYPE","SRC_STORAGE_BIN","SRC_STORAGE_LOC","VENDOR","NOTES"];
		config.download.roleName = auth.exportableRoleName;
	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmi();
		//var dSchema = service.getMXVmiSchema();
		var iServiceUrl = service.getMXVmiInvoke();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		var auth =  lenovo.control.commontable.Table.getViewAuth("changeASNPull");
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
//add pulled and unpulled button.
		var oToolbarCtn = oInsertUpload.getContent()[0];
		var oReadyBtn = new sap.ui.commons.Button({
			lite: true,
			//icon: "sap-icon://arrow-right", //zhaodan1
			tooltip: "Mark to Pulled",
			text:"Mark to Pulled",
			visible: false,
			lite: true,
			press: function(oEvent){
				var selectedIndices = table.getSelectedIndices();
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				var oUpdateData = {};
			    var oASNPull = {};
			    oASNPull.data = [];
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.NOTES == "" || 
					   selectedObject.NOTES == null ){
						oUpdateData = $.extend(true, {}, oUpdateData);
					//	oUpdateData = oUpdateData + selectedObject.MO_ID + ",";
						oUpdateData.DEST_STORAGE_TYPE = selectedObject.DEST_STORAGE_TYPE;
						oUpdateData.DEST_STORAGE_BIN = selectedObject.DEST_STORAGE_BIN;
						oUpdateData.DEST_STORAGE_LOC = selectedObject.DEST_STORAGE_LOC;
						oUpdateData.WERKS = selectedObject.WERKS;
						oUpdateData.PHYSICAL_PLANT = selectedObject.PHYSICAL_PLANT;
						oUpdateData.PRODUCTION_LINE = selectedObject.PRODUCTION_LINE;
						oUpdateData.DELIVERY_DATE = selectedObject.DELIVERY_DATE;
						oUpdateData.MATNR = selectedObject.MATNR;
						oUpdateData.SRC_STORAGE_LOC = selectedObject.SRC_STORAGE_LOC;
						oUpdateData.NOTES = "PULL_COMPLETED";
						oUpdateData.JOB_TYPE = "PULL_COMPLETED"
					    //JSON.stringify(oUpdateData);
						oASNPull.data.push(oUpdateData);
					}
				}
				if(oASNPull.data == undefined || oASNPull.data.length == 0){
					lenovo.control.commontable.Toolkit.showErrorMsg("Only status is blank can be set to 'PULL_COMPLETED'!", "ERROR", "Error");
					return;
				}
				//oASNPull.JOB_TYPE = "PULL_COMPLETED";
				
	/*			var oEntry = {
					"JOB_TYPE": "PULL_COMPLETED",
					"ASN_LIST": oASNPull 
				};*/
				$.ajax({
					url: iServiceUrl + "/ui_change_ASN_pull.xsjs",
					type: "POST",
					data: JSON.stringify(oASNPull),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						lenovo.control.commontable.Toolkit.showErrorMsg("Mark to Pulled successfully!", "SUCCESS", "Information");
					},
					error: function(e,b) {
						lenovo.control.commontable.Toolkit.showErrorMsg("Mark to Pulled:" && e.responseText, "ERROR", "Information");
					}
				});
			}
		}).addStyleClass("onDemond-toolBar-Button");
	

		var oReadyAllBtn = new sap.ui.commons.Button({
			lite: true,
			//icon: "sap-icon://arrow-left",
			text:"Mark to Unpulled",
			tooltip: "Mark to Unpulled",
			visible: false,
			press: function(oEvent){
				var selectedIndices = table.getSelectedIndices();
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				var oUpdateData = {};
			    var oASNPull = {};
			    oASNPull.data = [];	
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					//if(selectedObject.NOTES == "PULL_COMPLETED"){
					oUpdateData = $.extend(true, {}, oUpdateData);
						oUpdateData.DEST_STORAGE_TYPE = selectedObject.DEST_STORAGE_TYPE;
						oUpdateData.DEST_STORAGE_BIN = selectedObject.DEST_STORAGE_BIN;
						oUpdateData.DEST_STORAGE_LOC = selectedObject.DEST_STORAGE_LOC;
						oUpdateData.WERKS = selectedObject.WERKS;
						oUpdateData.PHYSICAL_PLANT = selectedObject.PHYSICAL_PLANT;
						oUpdateData.PRODUCTION_LINE = selectedObject.PRODUCTION_LINE;
						oUpdateData.DELIVERY_DATE = selectedObject.DELIVERY_DATE;
						oUpdateData.MATNR = selectedObject.MATNR;
						oUpdateData.SRC_STORAGE_LOC = selectedObject.SRC_STORAGE_LOC;
						oUpdateData.NOTES = "";
						oUpdateData.JOB_TYPE = "PULL_UNCOMPLETED"					
						//JSON.stringify(oUpdateData);
						oASNPull.data.push(oUpdateData);
					//}
				}
				/*if(oASNPull.data == undefined || oASNPull.data.length == 0){
					lenovo.control.commontable.Toolkit.showErrorMsg("Only status 'PULL_COMPLETED' can be clear status!", "ERROR", "Error");
					return;
				}*/
				
				$.ajax({
					url: iServiceUrl + "/ui_change_ASN_pull.xsjs",
					type: "POST",
					data: JSON.stringify(oASNPull),
					dataType: "text",
					contentType: "application/json",
					success: function(msg) {
						table.getModel().refresh();
						lenovo.control.commontable.Toolkit.showErrorMsg("Mark to Unpulled successfully!", "SUCCESS", "Information");
					},
					error: function(e,b) {
						lenovo.control.commontable.Toolkit.showErrorMsg("Mark to Unpulled:" && e.responseText, "ERROR", "Information");
					}
				});
			}
		}).addStyleClass("onDemond-toolBar-Button");
		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("changeASNPull");
		for (i in auth) {
			switch(i) {
				case "editable":
					oReadyBtn.setVisible(auth[i]);
					oReadyAllBtn.setVisible(auth[i]);
					break;
			}
		}
		
		oToolbarCtn.insertContent(oReadyBtn,0);
		oToolbarCtn.insertContent(oReadyAllBtn,1);
		
		
		var header = lenovo.control.commontable.Table.createHeader("Control", "ASN Pull Report");
		oReadyBtn.setStyle(sap.ui.commons.ButtonStyle.Emph );//zhaodan1
		oReadyAllBtn.setStyle(sap.ui.commons.ButtonStyle.Emph );//zhaodan1
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