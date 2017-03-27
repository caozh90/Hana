/* 
develop by Robin @ 2014/12/25
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");
jQuery.sap.require("lenovo.control.LenovoValueHelpField");//Chris Gao

sap.ui.jsview("lenovo.view.szvmi.execute.pullFromSupplier", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(5);
		var auth =  lenovo.control.commontable.Table.getViewAuth("pullFromSupplier");
		//var headerHeight = 450;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.selectionMode = sap.ui.table.SelectionMode.Single;
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
			width: "150px"
		},{
			field: "PULL_QTY",
			label: "Pull QTY",
			type: "TextField",
			width: "100px"
		},{
			field: "MATNR_DESCR",
			label: "Part Description",
			type: "TextField",
			width: "200px"
		},{
			field: "SRC_WERKS",
			label: "Logical Plant",
			type: "TextField",
			width: "120px"
		},{
			field: "SRC_STORAGE_LOC",
			label: "Src Storage Location",
			type: "TextField",
			width: "160px"
		},{
			field: "SRC_STORAGE_TYPE",
			label: "Source Type",
			type: "TextField",
			width: "100px"
		},{
			field: "SRC_STORAGE_BIN",
			label: "Source Bin",
			type: "TextField",
			width: "100px"
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "100px"
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Storage Location",
			type: "TextField",
			width: "200px"
		},{
			field: "DEST_STORAGE_TYPE",
			label: "Destination Type",
			type: "TextField",
			width: "150px"
		},{
			field: "DEST_STORAGE_BIN",
			label: "Destination Bin",
			type: "TextField",
			width: "150px"
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
			field: "INVENTORY_TYPE",
			label: "Inventory Type",
			type: "TextField",
			width: "150px"
		},{
			field: "LINE_SUPPLIERID",
			label: "Supplier",
			type: "TextField",
			width: "100px"
		},{
			field: "FULL_BOX_QTY",
			label: "Full Box Qty",
			type: "TextField",
			width: "100px"
		},{
			field: "HEAD_SUPPLIERID",
			label: "3PL ID",
			type: "TextField",
			width: "100px"
		},{
			field: "REMARK",
			label: "Remark",
			type: "TextField",
			width: "100px"
		},{
			field: "STATUS",
			label: "Status",
			type: "TextField",
			width: "100px"
		},{
			field: "DELIVERY_DATE",
			label: "Delivery Date",
			type: "TextField",
			width: "150px"
		},{
			field: "PRODUCTION_LINE",
			label: "Production Line",
			type: "TextField",
			width: "150px"
		},{
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_TIMESTAMP",
			label: "Time Stamp",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_CREATED_BY",
			label: "Create By",
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
		}];

		config.bindRowUrl = "/UI_MANUAL_PULL";
		config.defaultSort = [{
			field: "SYS_CREATED_DATE",
			bDescending: true
		},{
			field: "PULL_HEADER_ID",
			bDescending: true
		}];

		config.filtersRaw = [{
			field: "PULL_HEADER_ID",
			label: "Pull Id",
			type: "TextField"
		}, {
			field: "PULL_LINE_ID",
			label: "Line Id",
			type: "TextField"
		}, {
			field: "HEAD_SUPPLIERID",
			label: "Sup Id",
			type: "DropdownBox",
			type: "DropdownTable",
			dropdowntable: {
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
					}],
					[{
						label: "Supplier Name",
						field: "SUPPLIERDESC",
						type: "TextField"
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "SRC_WERKS",
			label: "Logic Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER?$select=SITEID&$format=json",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "MATNR",
			label: "Part Number",
			type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
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
				visibleRowCount: 10,
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		}, {
			field: "SRC_STORAGE_LOC",
			label: "Src Stor Loc",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CV_WAHREHOUSE_SRC?$format=json",
					bindKeyField: "STORAGE_LOCATION",
					bindTextField: "STORAGE_LOCATION",
					defaultSelectAll: true
				},
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				})
			}
		},{
			field: "DEST_STORAGE_LOC",
			label: "Dest Stor Loc",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CV_WAHREHOUSE_DEST?$format=json",
					bindKeyField: "STORAGE_LOCATION",
					bindTextField: "STORAGE_LOCATION",
					defaultSelectAll: true
				},
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
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			type: "TextField",
			//hidden: true,
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
				defaultFilterOp: "EQ",
				enabled: false,
				defaultFilterValue: ["SHIPPING_GROUP"]
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
					url: sServiceUrl + "/InputParams(P_PTYPE='MANUAL_PULL_STATUS')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					bindItemUrl: "/"
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.filterLayout = {
			0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
			1: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
			2: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			
		};
		//create,need to be customized
		config.create.visible=false;
		//edit,need to be customized
		config.edit.visible=false;
		//delete,need to be customized
		config.deleteable.url = "/UI_MANUAL_PULL";
		//upload,need to add
		
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_MANUAL_PULL"';
		config.download.columns = ["PULL_HEADER_ID",
			"PULL_LINE_ID",
			"MATNR",
			"MATNR_DESCR",
			"SRC_WERKS",
			"SRC_STORAGE_LOC",
			"SRC_STORAGE_TYPE",
			"SRC_STORAGE_BIN",
			"PULL_TYPE",
			"DEST_STORAGE_LOC",
			"DEST_STORAGE_TYPE",
			"DEST_STORAGE_BIN",
			"INVENTORY_TYPE",
			"LINE_SUPPLIERID",
			"PULL_QTY",
			"HEAD_SUPPLIERID",
			"REMARK",
			"STATUS",
			"DELIVERY_DATE",
			"PRODUCTION_LINE",
			"PHYSICAL_PLANT",
			"SYS_CREATED_DATE",
			"SYS_CREATED_BY",
			"SYS_LAST_MODIFIED_BY",
			"SYS_LAST_MODIFIED_DATE"];
		config.download.roleName = auth.exportableRoleName;

		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/supplier_manual_pull.xsjs",
			excelUrl: "szvmi/control/pull_from_supplier.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_MANUAL_PULL'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_MANUAL_PULL_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "Dest Storage Type",
					field: "DEST_STORAGE_TYPE",
					type:  "TextField"
				},{
					label: "Dest Storage Bin",
					field: "DEST_STORAGE_BIN",
					type:  "TextField"
				},{
					label: "Dest Storage Loc",
					field: "DEST_STORAGE_LOC",
					type:  "TextField"
				},{
					label: "Src Werks",
					field: "SRC_WERKS",
					type:  "TextField"
				},{
					label: "Physical Plant",
					field: "PHYSICAL_PLANT",
					type:  "TextField"
				},{
					label: "Inventory Type",
					field: "INVENTORY_TYPE",
					type:  "TextField"
				},{
					label: "Production Line",
					field: "PRODUCTION_LINE",
					type:  "TextField"
				},{
					label: "Head Supplierid",
					field: "HEAD_SUPPLIERID",
					type:  "TextField"
				},{
					label: "Delivery Date",
					field: "DELIVERY_DATE",
					type:  "TextField"
				},{
					label: "Matnr",
					field: "MATNR",
					type:  "TextField"
				},{
					label: "Pull Qty",
					field: "PULL_QTY",
					type:  "TextField"
				},{
					label: "Src Storage Type",
					field: "SRC_STORAGE_TYPE",
					type:  "TextField"
				},{
					label: "Src Storage Bin",
					field: "SRC_STORAGE_BIN",
					type:  "TextField"
				},{
					label: "Src Storage Loc",
					field: "SRC_STORAGE_LOC",
					type:  "TextField"
				},{
					label: "Line Supplierid",
					field: "LINE_SUPPLIERID",
					type:  "TextField"
				},{
					label: "Remark",
					field: "REMARK",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_manual_pull.xsjs" 
				}
			}
		}

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
				case "deleteable":
					config.deleteable.visible = auth[i];
					break;
				case "uploadable":
					config.upload.visible = auth[i];
					break;
			}
		}
	},

	createContent: function(oController) {
		var that = this;
		var app = new sap.m.App(); 
		var service = new lenovo.service.SZVMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var iServiceUrl = service.getMXVmiInvoke();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("execute", "Pull From Supplier");
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
		
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		var oCreateButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://add",
			tooltip: "create an item",
			visible: false,
			press: function(oEvent) {
				that._openInsertDialog(sServiceUrl, config, undefined, iServiceUrl, table);
			}	
		}).addStyleClass("commontable-toolbar-btn");

		var oEditButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://edit",
			tooltip: "Edit an item",
			visible: false,
			press: function(oEvent) {
				that._onEdit(table, config, sServiceUrl, iServiceUrl);
			}	
		}).addStyleClass("commontable-toolbar-btn");

		var oDeleteAllButton = new sap.ui.commons.Button({
			lite: true,
			icon: "resource/img/Delete_All.png",
			tooltip: "Delete All",
			visible: false,
			press: function(oEvent) {
				that._onDeleteAll(iServiceUrl, table);
			}	
		}).addStyleClass("commontable-toolbar-btn");

		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("pullFromSupplier");
		for (i in auth) {
			switch(i) {
				case "createable":
					oCreateButton.setVisible(auth[i]);
					break;
				case "editable":
					oEditButton.setVisible(auth[i]);
					break;
				case "deleteable":
					oDeleteAllButton.setVisible(auth[i]);
					break;
			}
		}
		//oInsertUpload.addContent(oDeleteAllButton);
		oInsertUpload.getContent()[0].insertContent(oDeleteAllButton,1);
		oInsertUpload.addContent(oEditButton);
		oInsertUpload.addContent(oCreateButton);
		

		var page = new sap.m.Page({
	      	  showHeader: false,
	          content: [header,filterPanel, oInsertUpload, table]             
	    });
        app.insertPage(page);
        app.setInitialPage(page);
		return app;
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Pull From Supplier") {
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
	},

	_onDeleteAll: function(iServiceUrl, table){
		var that = this;
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to delete all Draft records?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				that._deleteAllService(iServiceUrl,table);
			}
		}, 	"Confirm");
	},

	_deleteAllService: function(iServiceUrl,table){
		var sendData = {};
		sendData.PULL_TYPE = "SHIPPING_GROUP";
		table.setBusy(true);
		
		$.ajax({
			url: iServiceUrl + "/ui_manual_pull_delete_all_draft.xsjs",
			type:"post",
			dataType: "text",
			async: false,
			data: JSON.stringify(sendData),
			success: function(resp){
				console.log(resp);
				table.getModel().refresh(true);
				lenovo.control.commontable.Toolkit.showErrorMsg(resp, "SUCCESS", "Successfully");
				table.setBusy(false);
			},
			error: function(resp){
				lenovo.control.commontable.Toolkit.showErrorMsg(resp, "ERROR", "Error");
			}
		});
	},

	_openInsertDialog: function(sServiceUrl, config, objects,iServiceUrl, table){
		var that = this;
		var _oContent = [];
		_oContent = this._createContents(sServiceUrl,objects);
		var dialog = new Dialog("insert",{
			title: objects==undefined? "Create Pull" : "Edit Pull",
			keepInWindow: true,
			height: "600px",
			modal: true,
			content: _oContent,
			closed:function(){
				this.destroy();
			},
		});
		var oDraftButton = new sap.ui.commons.Button({
			text : "Save as Draft", 
			press: function(){
				that._onCreate(dialog, iServiceUrl, config, "DRAFT", objects==undefined? "CREATE" : "UPDATE", table);
				// dialog.closed();
			}});
		var oButton = new sap.ui.commons.Button("done",{
			text : "Send", 
			press: function(){
				that._onCreate(dialog, iServiceUrl, config, "NEW", objects==undefined? "CREATE" : "UPDATE", table);
				// dialog.closed();
			}});
		dialog.addButton(oDraftButton);
		dialog.addButton(oButton);

		dialog.open();
		dialog.ondragstart = false;
	},
	_createContents: function(url, objects){
		console.log(objects);
		var that = this;
		//LOGICAL_PLANT
		var lLogicalP = new sap.ui.commons.Label({text: 'Logical Plant:', width: "110px"});
		var iLogicalP = new sap.ui.commons.DropdownBox("iLogicalP",{
			width: "142px"
		}).addStyleClass("requiredDropdown");
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		//added by Chris Gao -- to clear count
		oModel.setDefaultCountMode("None");
		iLogicalP.setModel(oModel);
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "SITEID");
		iLogicalP.bindItems("/CONF_SITEMASTER?$select=SITEID", oItemTemplate1);
		iLogicalP.setValue(objects==undefined?"":objects[0].SRC_WERKS);
		//INVENTORY_TYPE
		var lInvType = new sap.ui.commons.Label({text: 'Inventory Type:', width: "110px"});
		var iInvType = new sap.ui.commons.TextField("iInvType", {
			width: "142px",
			enabled: false
		}).addStyleClass("requiredDropdown");
		iInvType.setValue(objects==undefined?"SOI":objects[0].INVENTORY_TYPE);

		//PULL_HEADER_ID
		var iHeadId = new sap.ui.commons.TextField("iHeadId", {
			width: "142px",
			enabled: false
		}).addStyleClass("hiddenStyle");;
		iHeadId.setValue(objects==undefined?"":objects[0].PULL_HEADER_ID);
		
		//HEAD_SUPPLIERID
		var l3PLId = new sap.ui.commons.Label({text: 'Sup ID:',width: "110px"});
		var i3PLId = new lenovo.control.LenovoValueHelpField("i3PLId", {
			width: "142px",
			placeholder: "--selection only--",
			valueHelpRequest: function(oEvent){that._openSearchHelpforSupplierId(url, iPartNum.getValue(), this);} //updated by Chris Gao 2015-09-22
		}).addStyleClass("required").attachChange(that._isRequired);
		i3PLId.setValue(objects==undefined?"":objects[0].HEAD_SUPPLIERID);
		var oLayout1 = new sap.ui.layout.HorizontalLayout("header1",{
			content: [lLogicalP, iLogicalP, lInvType, iInvType, l3PLId, i3PLId, iHeadId]
		}).addStyleClass("header");

		//DEST_STORAGE_TYPE
		var lDestType = new sap.ui.commons.Label({text: 'Destination Type:',width: "112px"});
		var iDestType = new lenovo.control.LenovoValueHelpField("iDestType", {
			width: "142px",
			placeholder: "--selection only--",
			valueHelpRequest: function(oEvent){that._openSearchHelpForDest(url, this, true);}
		}).addStyleClass("required").attachChange(that._isRequired);
		iDestType.setValue(objects==undefined?"":objects[0].DEST_STORAGE_TYPE);
		//DEST_STORAGE_BIN
		var lDestBin = new sap.ui.commons.Label({text: 'Destination Bin:',width: "110px"});
		var iDestBin = new sap.ui.commons.TextField("iDestBin",{
			width: "142px",
			// editable: false,
			enabled: false
		});
		iDestBin.setValue(objects==undefined?"":objects[0].DEST_STORAGE_BIN);
		//DEST_STORAGE_LOC
		var lDestStorLoc = new sap.ui.commons.Label({text: 'Dest Stor Loc:',width: "110px"});
		var iDestStorLoc = new sap.ui.commons.TextField("iDestStorLoc",{
			width: "142px",
			// editable: false,
			enabled: false
		});
		iDestStorLoc.setValue(objects==undefined?"":objects[0].DEST_STORAGE_LOC);
		var oLayout2 = new sap.ui.layout.HorizontalLayout("header2",{
			content: [lDestType, iDestType, lDestBin, iDestBin, lDestStorLoc, iDestStorLoc]
		}).addStyleClass("header");
		//PRODUCTION_LINE
		var lProductLine = new sap.ui.commons.Label({text: 'Production Line:',width: "110px"});
		var iProductLine = new sap.ui.commons.DropdownBox("iProductLine", {
			width: "142px",
		});
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		iProductLine.setModel(oModel);
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "DS_LINE");
		iProductLine.bindItems("/UI_LINE_FLOOR_MAPPING_DS_LINE", oItemTemplate1);
		iProductLine.setValue(objects==undefined?"":objects[0].PRODUCTION_LINE);
		//PHYSICAL_PLANT
		var lPhysicalPlant = new sap.ui.commons.Label({text: 'Physical Plant:',width: "110px"});
		var iPhysicalPlant = new sap.ui.commons.DropdownBox("iPhysicalPlant", {
			width: "142px",
		});
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		//added by Chris Gao -- to clear count
		oModel.setDefaultCountMode("None");
		iPhysicalPlant.setModel(oModel);
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "PHYSICALPLANT");
		iPhysicalPlant.bindItems("/CONF_SITEMASTER?$select=PHYSICALPLANT", oItemTemplate1);
		iPhysicalPlant.setValue(objects==undefined?"":objects[0].PHYSICAL_PLANT);		
		//PULL_TYPE
		var lPullType = new sap.ui.commons.Label({text: 'Pull Type:',width: "110px"});
		var iPullType = new sap.ui.commons.TextField("iPullType",{
			width: "142px",
			enabled: false,
			// enabled: objects==undefined?true:false
		});
		iPullType.setValue(objects==undefined?"SHIPPING_GROUP":objects[0].PULL_TYPE);
		var oLayout3 = new sap.ui.layout.HorizontalLayout("header3",{
			content: [lProductLine, iProductLine, lPhysicalPlant, iPhysicalPlant, lPullType, iPullType]
		}).addStyleClass("header");
		//DELIVERY_DATE
		var lDeliveryDate = new sap.ui.commons.Label({text: 'Delivery Date:',width: "110px"});
		var iDeliveryDate = new sap.ui.commons.DatePicker("iDeliveryDate", {
			width: "142px",
		});
		iDeliveryDate.setValue(objects==undefined?(new Date()).Format("yyyy-MM-dd hh:mm:ss"):DateConvert(objects[0].DELIVERY_DATE).Format("yyyy-MM-dd"));
		//added by Chris Gao 2015-09-22
		iDeliveryDate.attachChange(function(oEvent){
			var dateValue = oEvent.getSource().getValue();
			dateValue = DateConvert(dateValue).Format("yyyy-MM-dd hh:mm:ss");
			oEvent.getSource().setValue(dateValue);
		});
		
		var oLayout4 = new sap.ui.layout.HorizontalLayout("header4",{
			content: [lDeliveryDate, iDeliveryDate]
		}).addStyleClass("header");

//		var lPartNum = new sap.ui.commons.Label({text: "Part Number", width: "110px"});
//		var iPartNum = new sap.ui.commons.TextField("iPartNum", {width: "142px",}).addStyleClass("required").attachChange(that._isRequired);
		
		//added by Chris Gao
		var lPartNum = new sap.ui.commons.Label({text: "Part Number", width: "110px"});
		var iPartNum = new lenovo.control.LenovoValueHelpField("iPartNum",
				{   placeholder: "--selection only--",
					width : "142px",									
					valueHelpRequest : function(oEvent) {
						that._openSearchHelpForPartNum(url,
								this);
					}
				}).addStyleClass("required").attachChange(that._isRequired);	
		
		var lPullQty = new sap.ui.commons.Label({text: "Pull Qty", width: "110px"});
		var iPullQty = new sap.ui.commons.TextField("iPQ",{width: "142px",}).addStyleClass("required").attachChange(that._isRequired);
		var lSourceType = new sap.ui.commons.Label({text: "Source Type", width: "110px"});
		var iSourceType = new lenovo.control.LenovoValueHelpField("iST",{
			width: "142px",
			placeholder: "--selection only--",
			valueHelpRequest: function(oEvent){that._openSearchHelpForDest(url, this, false);}
		}).addStyleClass("required").attachChange(that._isRequired);
		var iRSL = new sap.ui.commons.TextField("iSSL", {width: "142px",}).addStyleClass("hiddenStyle");
		var iRB = new sap.ui.commons.TextField("iSB",{width: "142px",}).addStyleClass("hiddenStyle");
		var oAddPartButton = new sap.ui.commons.Button({
			text:"Add Part",
			press: $.proxy(that._onAddPart,that)
		});
		var oLayout5 = new sap.ui.layout.HorizontalLayout({
			content: [lPartNum, iPartNum, lPullQty, iPullQty, lSourceType, iSourceType, oAddPartButton, iRSL, iRB]
		});
		var oPanel = new sap.ui.commons.Panel({
			showCollapseIcon: false,
			width: "100%",
			content: [oLayout5]
		});
		oPanel.setText("Add Line Item");
		oPanel.addStyleClass("Component1");
		var oHD = new sap.ui.commons.HorizontalDivider().addStyleClass("HDStyle");
		var oHD1 = new sap.ui.commons.HorizontalDivider().addStyleClass("HDStyle");
		var oTable = that._createPullLineTable(objects);
		var oPanel1 = new sap.ui.commons.Panel({
			showCollapseIcon: false,
			width: "900px",
			content: [oTable]
		});
		oPanel1.setText("Pull Line Information");
		var oLayout = new sap.ui.layout.VerticalLayout({
			content: [oLayout1, oLayout2, oLayout3, oLayout4, oHD1, oPanel, oHD, oPanel1]
		});

		return oLayout;
	},
	_openSearchHelp: function(url, oControl){
		var that = this;
		var dropdownTableConfig = {
			defaultFilterOp: "EQ",
				url: url,
				bindRowUrl: "/SUPITEM",
				fields: [["SUPPLIERID",oControl]],
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
					}],
					[{
						label: "Supplier Name",
						field: "SUPPLIERDESC",
						labelLayout: new sap.ui.layout.GridData({
							span: "L6 M6 S6",
							linebreak: true
						}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
								span: "L6 M6 S6"
							}),
						}
					}]
				],
				visibleRowCount: 10
		};
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		var table =  lenovo.control.commontable.Table.createTable(dropdownTableConfig);
		var filterPanel =  lenovo.control.commontable.Table.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		table.setSelectionMode(sap.ui.table.SelectionMode.Single);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var dialog = new sap.ui.commons.Dialog({
			width: '70%',
			title: 'select',
			modal: true,
			content: [filterPanel, table],
			buttons: [new sap.ui.commons.Button({
				text: "Save and Return",
				press: function(){
					that._editSaveReturn(table, dropdownTableConfig.fields, dialog);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;	
	},
	
	/***************************
	 * Added by Chris Gao 2015-09-22
	 * to filter supplier id
	 **************************/
	_openSearchHelpforSupplierId: function(url, oSourcePartNum ,oControl){
		var that = this;
		var bindUrl = "/SUPITEM";
		if(oSourcePartNum != "" && oSourcePartNum != undefined)
		{
			bindUrl = "/SUPITEM?$format=json&$filter=PARTNO eq '" + oSourcePartNum + "'";
		}
		
		var dropdownTableConfig = {
			defaultFilterOp: "EQ",
				url: url,
				bindRowUrl: bindUrl,
				fields: [["SUPPLIERID",oControl]],
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
					}],
					[{
						label: "Supplier Name",
						field: "SUPPLIERDESC",
						labelLayout: new sap.ui.layout.GridData({
							span: "L6 M6 S6",
							linebreak: true
						}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
								span: "L6 M6 S6"
							}),
						}
					}]
				],
				visibleRowCount: 10
		};
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		//added by Chris Gao -- to clear count
		oModel.setDefaultCountMode("None");
		var table =  lenovo.control.commontable.Table.createTable(dropdownTableConfig);
		var filterPanel =  lenovo.control.commontable.Table.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		table.setSelectionMode(sap.ui.table.SelectionMode.Single);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var dialog = new sap.ui.commons.Dialog({
			width: '70%',
			title: 'select',
			modal: true,
			content: [filterPanel, table],
			buttons: [new sap.ui.commons.Button({
				text: "Save and Return",
				press: function(){
					that._editSaveReturn(table, dropdownTableConfig.fields, dialog);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;	
	},
	/***************************
	 * End by Chris Gao
	 **************************/

	_openSearchHelpForDest: function(url, oControl, isDest){
		var that = this;
		var s = sap.ui.getCore();

		if(isDest){
			//var bindRowUrl = "/CONF_WAHREHOUSE_INFO?$filter=(LOGIC_PLANT eq '" + s.byId("iLogicalP").getValue() +"')"
			//			+ "and(TYPE eq 'LOI')"
			//			+ "and(IS_DEST eq 'Y')";
			var bindRowUrl = "/INPUT_CONF_WAHREHOUSE_INFO(P_WHERE='"
				+"(\"LOGIC_PLANT\" =''"+ s.byId("iLogicalP").getValue()+"'') AND ("
				+ "\"IS_DEST\" =''Y'') AND ("
				+"\"TYPE\" =''LOI'') "			
				+"')/Results?$select=STORAGE_LOCATION,STORAGE_TYPE,STORAGE_BIN";
		}else{			
			//var bindRowUrl = "/CONF_WAHREHOUSE_INFO?$filter=(LOGIC_PLANT eq '" + s.byId("iLogicalP").getValue() +"')"
			//			+ "and(TYPE eq 'SOI')"
			//			+ "and(IS_SOURCE eq 'Y')";
			var bindRowUrl = "/INPUT_CONF_WAHREHOUSE_INFO(P_WHERE='"
				+"(\"LOGIC_PLANT\" =''"+ s.byId("iLogicalP").getValue()+"'') AND ("
				+ "\"IS_SOURCE\" =''Y'') AND ("
				+"\"TYPE\" =''SOI'') "			
				+"')/Results";
		}

		console.log(bindRowUrl);
		var dropdownTableConfig = {
			defaultFilterOp: "Contains",
			url: url,
			bindRowUrl: bindRowUrl,
			fields: isDest?[["STORAGE_TYPE",oControl],["STORAGE_LOCATION",s.byId("iDestStorLoc")],["STORAGE_BIN", s.byId("iDestBin")]]:[["STORAGE_TYPE",oControl],["STORAGE_LOCATION",s.byId("iSSL")],["STORAGE_BIN", s.byId("iSB")]],
			columns: [{
				label: isDest?"Dest Type":"Source Type",
				field: "STORAGE_TYPE",
				type: "TextField"
			}, {
				label: isDest?"Dest Stor Loc":"Src Stor Loc",
				field: "STORAGE_LOCATION",
				type: "TextField"
			}, {
				label: isDest?"Dest Bin":"Source Bin",
				field: "STORAGE_BIN",
				type: "TextField"
			}],
			filters: [
				[{
					label: isDest?"Dest Type":"Source Type",
					field: "STORAGE_TYPE",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}],
				[{
					label: isDest?"Dest Stor Loc":"Src Stor Loc",
					field: "STORAGE_LOCATION",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}],
				[{
					label: isDest?"Dest Bin":"Source Bin",
					field: "STORAGE_BIN",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}]
			],
			visibleRowCount: 10
		};
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		//added by Chris Gao -- to clear count
		oModel.setDefaultCountMode("None");
		var table =  lenovo.control.commontable.Table.createTable(dropdownTableConfig);
		var filterPanel =  lenovo.control.commontable.Table.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		table.setSelectionMode(sap.ui.table.SelectionMode.Single);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var dialog = new sap.ui.commons.Dialog({
			width: '70%',
			title: 'select',
			modal: true,
			content: [filterPanel, table],
			buttons: [new sap.ui.commons.Button({
				text: "save and return",
				press: function(){
					that._editSaveReturn(table, dropdownTableConfig.fields, dialog);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;	
	},

	_onEdit: function(table, config, sServiceUrl,iServiceUrl){
		var index = table.getSelectedIndices();
		if(index.length < 1){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row!", "ERROR", "Edit");
			return;
		}

		var selectedIndex = index[0];
		var selectedObject = table.getContextByIndex(selectedIndex).getObject();
		// console.log(selectedObject);
		if(selectedObject.STATUS == "DRAFT"){
			var jsonModel = new sap.ui.model.json.JSONModel();
			var url = sServiceUrl + config.bindRowUrl + "?$format=json&$filter=PULL_HEADER_ID eq '" + selectedObject.PULL_HEADER_ID + "'";
			jsonModel.loadData(url,[],false);
			var objects = JSON.parse(jsonModel.getJSON()).d.results;
			this._openInsertDialog(sServiceUrl, config, objects,iServiceUrl, table);
		}else{
			lenovo.control.commontable.Toolkit.showErrorMsg("Only draft record could be edited!", "ERROR", "ERROR");
		}
	},
	
	_openSearchHelpForPartNum : function(url, oControl) { 
		var that = this;
		var s = sap.ui.getCore();
//
//		var tpl = "";
//		var invType = s.byId("iInvType").getValue();
//
//		if (invType == "SOI") {
//			tpl = s.byId("i3PLId2").getValue();
//		} else {
//			tpl = s.byId("i3PLId").getValue();
//		}

		var bindRowUrl = "/ITEMSITEMASTER001";

		var dropdownTableConfig = {
			defaultFilterOp : "Contains",// "EQ"
			url : url,
			bindRowUrl : bindRowUrl,
			fields : [[ "ITEM", oControl]],
			columns : [ {
				label : "Part Number",
				field : "ITEM",
				type : "TextField"
			}, {
				label : "Part Desc",
				field : "ITEMDESC",
				type : "TextField"
			}],
			filters : [ [ {
				label : "Part Number",
				field : "ITEM",
				type : "TextField",
				textfield : {
					defaultFilterOp : "Contains"
				}
			} ], [ {
				label : "Part Desc",
				field : "ITEMDESC",
				type : "TextField",
				textfield : {
					defaultFilterOp : "Contains"
				}
			} ] ],
			visibleRowCount : 10
		};
		var oModel = new sap.ui.model.odata.ODataModel(url,
				true);
		var table = lenovo.control.commontable.Table
				.createTable(dropdownTableConfig);
		var filterPanel = lenovo.control.commontable.Table
				.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		table.setSelectionMode(sap.ui.table.SelectionMode.Single);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var dialog = new sap.ui.commons.Dialog({
			width : '70%',
			title : 'select',
			modal : true,
			content : [ filterPanel, table ],
			buttons : [ new sap.ui.commons.Button(
					{
						text : "save and return",
						press : function() {
							that._editSaveReturn(table,
									dropdownTableConfig.fields,
									dialog);
						}
					}) ]
		});
		dialog.open();
		dialog.ondragstart = false;
	},
	/************************
	 * Added by Chris Gao
	 * 2015-09-21
	 ***********************/
	_openSearchHelpForSourceTypeinTable : function(url, oControl) {
		var that = this;
		var s = sap.ui.getCore();

		var tpl = "";
		var invType = s.byId("iInvType").getValue();

		if (invType == "SOI") {
			tpl = s.byId("i3PLId2").getValue();
		} else {
			tpl = s.byId("i3PLId").getValue();
		}

		var bindRowUrl = "/INPUT_CONF_WAHREHOUSE_INFO(P_WHERE='"
				+ "(\"LOGIC_PLANT\" =''"
				+ s.byId("iLogicalP").getValue()
				+ "'') AND ("
				+ "\"IS_SOURCE\" =''Y'') AND ("
				+ "\"TPL_ID\" =''"
				+ tpl
				+ "'') AND ("
				+ "\"TYPE\" =''"
				+ invType
				+ "'') "
				+ "')/Results";

		var dropdownTableConfig = {
			defaultFilterOp : "Contains",// "EQ"
			url : url,
			bindRowUrl : bindRowUrl,
			fields : [ [ "STORAGE_TYPE", oControl ],
					[ "STORAGE_LOCATION",s.byId("iSSL") ],
					[ "STORAGE_BIN", s.byId("iSB") ] ],
			columns : [ {
				label : "Source Type",
				field : "STORAGE_TYPE",
				type : "TextField"
			}, {
				label : "Src Stor Loc",
				field : "STORAGE_LOCATION",
				type : "TextField"
			}, {
				label : "Source Bin",
				field : "STORAGE_BIN",
				type : "TextField"
			} ],
			filters : [ [ {
				label : "Source Type",
				field : "STORAGE_TYPE",
				type : "TextField",
				textfield : {
					defaultFilterOp : "Contains"
				}
			} ], [ {
				label : "Src Stor Loc",
				field : "STORAGE_LOCATION",
				type : "TextField",
				textfield : {
					defaultFilterOp : "Contains"
				}
			} ], [ {
				label : "Source Bin",
				field : "STORAGE_BIN",
				type : "TextField",
				textfield : {
					defaultFilterOp : "Contains"
				}
			} ] ],
			visibleRowCount : 10
		};
		var oModel = new sap.ui.model.odata.ODataModel(url,
				true);
		var table = lenovo.control.commontable.Table
				.createTable(dropdownTableConfig);
		var filterPanel = lenovo.control.commontable.Table
				.createFilter(dropdownTableConfig, table);
		table.setBusy(true);
		table.setModel(oModel);
		table
				.setSelectionMode(sap.ui.table.SelectionMode.Single);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var dialog = new sap.ui.commons.Dialog({
			width : '70%',
			title : 'select',
			modal : true,
			content : [ filterPanel, table ],
			buttons : [ new sap.ui.commons.Button(
					{
						text : "save and return",
						press : function() {
							that._editSaveReturnforTable(table,
									dropdownTableConfig.fields,
									oControl.getParent(),//added by Chris Gao - to getRows
									dialog);
							
							
						}
					}) ]
		});
		dialog.open();
		dialog.ondragstart = false;
	},
	
	_editSaveReturnforTable : function(table, fields, sourceRow, dialog) {
		var selectedIndices = table.getSelectedIndices();
		var oModel = table.getModel();
		var selectedObject, oControl, field;
		for (var i = 0; i < selectedIndices.length; i++) {
			selectedObject = table.getContextByIndex(
					selectedIndices[i]).getObject();
			break;
		}
		if (selectedObject != undefined) {
			for (var i = 0, l = fields.length; i < l; i++) {
				oControl = fields[i][1];
				field = fields[i][0];
				
				oControl.setValue(selectedObject[field]);
				
				//added by Chris Gao
				if(field == "STORAGE_LOCATION")
				{
					sourceRow.getCells()[4].setValue(selectedObject[field]);
				}
				if(field == "STORAGE_BIN")
				{
					sourceRow.getCells()[5].setValue(selectedObject[field]);
				}
			}
		}
		dialog.close();
	},
	
	/************************
	 * End by Chris Gao
	 * 2015-09-21
	 ***********************/
	_editSaveReturn: function(table, fields, dialog){
		var selectedIndices = table.getSelectedIndices();
		var oModel = table.getModel();
		var selectedObject, oControl, field;
		for(var i = 0; i < selectedIndices.length; i++) {
			selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
			break;
		}
		if(selectedObject != undefined){
			for(var i = 0, l = fields.length; i < l; i++){
				oControl = fields[i][1];
				field = fields[i][0];
				oControl.setValue(selectedObject[field]);
			}
		}
		dialog.close();
	},
	_createPullLineTable: function(objects){
		var that = this;
		var oTable = new sap.ui.table.Table("pullLineInfo", {
			visibleRowCount: 7,
			firstVisibleRow: 3,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			toolbar: new sap.ui.commons.Toolbar({items: [ 
				new sap.ui.commons.Button({
					lite: true,
					icon: "sap-icon://duplicate",
					tooltip: "Copy selected rows",
					press: function() { 
						var selectedIndices = oTable.getSelectedIndices();
						if(selectedIndices.length > 0){
							that._copyRow(oTable, selectedIndices);
							oTable.clearSelection();
						}else{
							lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record.", "ERROR", "ERROR");
						}
					}
				}),
				new sap.ui.commons.Button({
					lite: true,
					icon: "sap-icon://delete",
					tooltip: "Delete selected rows",
					press: function() { 
						var selectedIndices = oTable.getSelectedIndices();
						if(selectedIndices.length > 0){
							that._deleteRow(oTable, selectedIndices);
							oTable.clearSelection();
						}else{
							lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record.", "ERROR", "ERROR");
						}
					}
				})
			]}).addStyleClass("dialog-toolbar"),
			columns: [
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Line Id"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "PULL_LINE_ID"),

					width: "80px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Part Number"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "MATNR"),
					width:"120px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Supplier"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "LINE_SUPPLIERID"),
					width:"80px"

				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Source Type"}),
					template : new lenovo.control.LenovoValueHelpField( //Chris Gao
							{
								//editable : true,
								placeholder: "--selection only--",
								valueHelpRequest : function(oEvent) {
									var index = oTable.getSelectedIndices();
									var SRC_STORAGE_LOC;
									var SRC_STORAGE_BIN;
									var s = sap.ui.getCore();
									if (index.length < 1) {
										lenovo.control.commontable.Toolkit.showErrorMsg(
												"Please select a row!", "ERROR", "Edit");
										return;
									}
									
									//modified by Chris Gao 2015-09-21
									that._openSearchHelpForSourceTypeinTable(sServiceUrl,
											this);	
								}
							}).bindProperty("value", "SRC_STORAGE_TYPE"),
					width:"80px"
				}),
//				new sap.ui.table.Column({
//					label: new sap.ui.commons.Label({text: "Source Type"}),
//					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "SRC_STORAGE_TYPE"),
//					width:"120px"
//				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Src Stor Loc"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "SRC_STORAGE_LOC"),
					width:"120px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Source Bin"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "SRC_STORAGE_BIN"),
					width:"100px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Pull Qty"}),
					template: (new sap.ui.commons.TextField().bindProperty("value", "PULL_QTY")).addStyleClass("editable").attachChange(that._isRequired),
					width:"80px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Pull Status"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "STATUS"),
					width:"100px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Remark"}),
					template: (new sap.ui.commons.TextField().bindProperty("value", "REMARK")).addStyleClass("editable"),
					width:"100px"
				})				
			]
		});
		var oModel = new sap.ui.model.json.JSONModel();
		if(!(objects == undefined || objects == null || objects == "" || objects.length <= 0)){
			// aData = that._populateTableData(objects);
			oModel.setData({modelData: objects});
		}
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");
		return oTable;
	},
	_addPartValidation: function(){
		var flag = true;
		$(".required").each(function(){
	        $(this).control()[0].fireChange();
	        var result = $(this).data("result");
	        if(!result)
	        	flag = false;
	    });
		return flag;
	},

	_freezeHeader: function(){
		var s = sap.ui.getCore();
		for(var i = 1; i < 5; i++){
			var layout = s.byId("header"+i);
			layout.$().find("input").each(function(){
		        ($(this).control()[0]).setEnabled(false);
		    });
		}
		
	},
	_onAddPart: function(){
		var oTable = sap.ui.getCore().byId("pullLineInfo");
		var oTableModel = oTable.getModel();
		var service = new lenovo.service.SZVMI;
		var sServiceUrl = service.getMXVmi();
		var s = sap.ui.getCore();
		var that = this;
		if(!that._addPartValidation()){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please fill in all required fields.", "ERROR", "ERROR");
			return;
		}

		var url = "/INPUT_VALIDATION(IN_PART_NUMBER='" + s.byId("iPartNum").getValue() + "',IN_LOGIC_PLANT='" + s.byId("iLogicalP").getValue() + "')/Results/$count";
		$.ajax({
			url: sServiceUrl + url,
			type:"get",
			dataType: "text",
			success: function(resp){
				if(resp > 0){
					var aData = oTable.getModel().getJSON()=="{}"?[]:JSON.parse(oTable.getModel().getJSON()).modelData;
					var oEntry = {};
					oEntry.MATNR = s.byId("iPartNum").getValue();
					oEntry.LINE_SUPPLIERID = s.byId("i3PLId").getValue();
					oEntry.SRC_STORAGE_TYPE = s.byId("iST").getValue();
					oEntry.SRC_STORAGE_LOC = s.byId("iSSL").getValue();
					oEntry.SRC_STORAGE_BIN = s.byId("iSB").getValue();
					oEntry.PULL_QTY = s.byId("iPQ").getValue();
					oEntry.STATUS = "DRAFT";
					oEntry.REMARK = "";
					aData.push(oEntry);
					that._freezeHeader();
					oTableModel.setData({modelData: aData});
				}else{
					lenovo.control.commontable.Toolkit.showErrorMsg("INVALID MATNR.", "ERROR", "ERROR");
				}
			}
		});
	},
	_onCreate: function(dialog, iServiceUrl, config, status, op, table){
		
		var oTable = sap.ui.getCore().byId("pullLineInfo");
		var selectedIndices = oTable.getSelectedIndices();
		if(selectedIndices.length < 1){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record.", "ERROR", "ERROR");
			return;
		}
		var sendData = {};
		sendData.OP_TYPE = op;
		sendData.data = [];
		var data = {};
		var selectedObject;
		var s = sap.ui.getCore();
		var date = new Date();
		data.SYS_CREATED_DATE = date.Format("yyyy-MM-dd hh:mm:ss");
		data.DEST_STORAGE_LOC = s.byId("iDestStorLoc").getValue();
		data.DEST_STORAGE_TYPE = s.byId("iDestType").getValue();
		data.DEST_STORAGE_BIN = s.byId("iDestBin").getValue();
		data.SRC_WERKS = s.byId("iLogicalP").getValue();
		data.PHYSICAL_PLANT = s.byId("iPhysicalPlant").getValue();
		data.INVENTORY_TYPE = s.byId("iInvType").getValue();
		data.PRODUCTION_LINE = s.byId("iProductLine").getValue();
		data.HEAD_SUPPLIERID = s.byId("i3PLId").getValue();
		data.DELIVERY_DATE = (new Date(s.byId("iDeliveryDate").getValue())).Format("yyyy-MM-dd hh:mm:ss");
		data.STATUS = status;
		data.PULL_HEADER_ID = s.byId("iHeadId").getValue();
		// data.PULL_LINE_ID = "fake";
		data.PULL_TYPE = s.byId("iPullType").getValue();
		for (var i = 0, l = selectedIndices.length; i < l; i++){
			selectedObject = oTable.getContextByIndex(selectedIndices[i]).getObject();
			// console.log(selectedObject);
			// var oEntry = $.extend(true, data, selectedObject);
			if(selectedObject.STATUS != "DRAFT"){
				var errorMSG = "";
				if(status=="DRAFT")
					errorMSG = "The user could not choose no draft status data to save.";
				else
					errorMSG = "The user could not choose no draft status data to sent.";
				lenovo.control.commontable.Toolkit.showErrorMsg(errorMSG, "ERROR", "ERROR");
				return;
			}
			data = $.extend(true, {}, data);
			data.PULL_LINE_ID = selectedObject.PULL_LINE_ID?selectedObject.PULL_LINE_ID:"";
			data.MATNR = selectedObject.MATNR;
			data.LINE_SUPPLIERID = selectedObject.LINE_SUPPLIERID;
		    data.SRC_STORAGE_TYPE = selectedObject.SRC_STORAGE_TYPE;
		    data.SRC_STORAGE_LOC = selectedObject.SRC_STORAGE_LOC;
		    data.SRC_STORAGE_BIN = selectedObject.SRC_STORAGE_BIN;
		    data.PULL_QTY = selectedObject.PULL_QTY;
		    data.REMARK = selectedObject.REMARK?selectedObject.REMARK:"";
		    data.SYS_SOURCE = 'CSE';
		    
			sendData.data.push(data);
		}
		console.log(sendData);
		console.log(JSON.stringify(sendData));
		this._createService(sendData, iServiceUrl, config.bindRowUrl, dialog, table);
	},
	_createService: function(sendData, iServiceUrl, path, dialog, table){
		dialog.setBusy(true);
		$.ajax({
			url: iServiceUrl + "/ui_manual_pull.xsjs",
			type: "POST",
			data: JSON.stringify(sendData),
			dataType: "text",
			contentType: "application/json;charset=UTF-8",
			success: function(msg) {
				table.getModel().refresh(true);
				table.clearSelection();
				lenovo.control.commontable.Toolkit.showErrorMsg("Successfully", "SUCCESS", "Successfully");
				dialog.setBusy(false);
				dialog.close();
			},
			error: function(e,b) {
				lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR",  "Error");
				dialog.setBusy(false);
				console.log(e);
			}
		});
	},
	_copyRow: function(oTable, selectedIndices){
		var aData = oTable.getModel().getJSON()=="{}"?[]:JSON.parse(oTable.getModel().getJSON()).modelData;
		var selectedObject, copyObject;
		var oTableModel = oTable.getModel();

		for(var i = 0, l = selectedIndices.length; i < l; i++){
			selectedObject = oTable.getContextByIndex(selectedIndices[i]).getObject();
			copyObject = $.extend(true, {}, selectedObject);
			copyObject.PULL_LINE_ID = "";
			aData.push(copyObject);
		}
		oTableModel.setData({modelData: aData});
	},
	_deleteRow: function(oTable, selectedIndices){
		var aData = oTable.getModel().getJSON()=="{}"?[]:JSON.parse(oTable.getModel().getJSON()).modelData;
		var oTableModel = oTable.getModel();

		for(var i = selectedIndices.length-1; i >= 0; i--){
			aData.splice(selectedIndices[i], 1);
		}
		oTableModel.setData({modelData: aData});
	},
	_isRequired: function(){
		var tp = new sap.ui.ux3.ToolPopup({
				autoClose: true,
				content : [ new sap.ui.commons.Label({
					text : "Required field"
				}) ],
				opener : this
			});
		if(this.getValue().trim() == ""){
			this.setValueState(sap.ui.core.ValueState.Error);													
			tp.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);		
			this.$().data("result", false);													
		}else{
			tp.close();
			this.setValueState(sap.ui.core.ValueState.None).setTooltip("");
			this.$().data("result", true);
		}
	}
});