/* 
develop by Alex Liu @ 2014/12/22
modefied by Coral Zhang @ 2014/12/24
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.execute.changeLocation", {
	getControllerName: function() {
 
	},

	setConfig: function(config, sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var auth =  lenovo.control.commontable.Table.getViewAuth("changeLocation");
		//var headerHeight = 450;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);
		config.selectionMode = sap.ui.table.SelectionMode.Single;
		config.columns = [{
			field: "MATNR",
			label: "Part Number",
			type: "TextField",
			width: "100px"
		}, {
			field: "MATNR_DESCR",
			label: "Part Description",
			type: "TextField",
			width: "200px"
		}, {
			field: "MO_NUM",
			label: "MO Number",
			type: "TextField",
			width: "150px"
		}, {
			field: "LINE_NUM",
			label: "Line Num",
			type: "TextField",
			width: "150px"
		}, {
			field: "STORAGE_LOC",
			label: "Dest Storage Location",
			type: "TextField",
			width: "200px"
		}, {
			field: "REMARK",
			label: "REMARK",
			type: "TextField",
			width: "100px"
		}, {
			field: "STATUS",
			label: "STATUS",
			type: "TextField",
			width: "100px"
		}, {
			field: "SYS_CREATED_BY",
			label: "Create By",
			type: "TextField",
			width: "100px"
		},{
			field: "SYS_CREATED_DATE",
			label: "Create Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Date",
			type: "TextField",
			width: "150px"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified By",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/UI_CHANGE_SL";//?$orderby=PULL_HEADER_ID desc,SYS_CREATED_DATE desc";
		config.defaultSort = [{
			field: "SYS_CREATED_DATE",
			bDescending: true
		},{
			field: "MO_NUM",
			bDescending: true
		}];

		config.filtersRaw = [{
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
			field: "MO_NUM",
			label: "Mo Number",
			type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: sServiceUrl,
				bindRowUrl: "/MXEBGVMI_MO_BOM",
				field: "PRODUCTIONORDID",
				columns: [{
					label: "MO Number",
					field: "PRODUCTIONORDID",
					type: "TextField"
				}, {
					label: "BOM Name",
					field: "BOMNAME",
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
			field: "DEST_STORAGE_LOC",
			label: "Dest Stor Loc",
			type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({
				span: "L3 M3 S3",
				linebreak: true
			}),
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CV_WAHREHOUSE_DEST?$format=json",
					bindKeyField: "STORAGE_LOCATION",
					bindTextField: "STORAGE_LOCATION",
					defaultSelectAll: true
				},
				layout: new sap.ui.layout.GridData({
					span: "L9 M9 S9"
				}),
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
			1: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
			2: new sap.ui.layout.GridData({span: "L5 M5 S5"}),
			
		};

		//delete
		config.deleteable.url = "/UI_CHANGE_SL";
		//upload,need to add
		
		//export data
		config.download.filename = "Download_Change_SL_data";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/AT_UI_CHANGE_SL"';
		config.download.columns = [	 "MATNR",
		                           	 "MATNR_DESCR",
		                           	 "MO_NUM",
		                           	 "STORAGE_LOC",
		                           	 "LINE_NUM",
		                           	 "STATUS",
		                           	 "REMARK",
		                           	 "SYS_CREATED_DATE",
		                           	 "SYS_CREATED_BY",
		                           	 "SYS_LAST_MODIFIED_BY",
		                           	 "SYS_LAST_MODIFIED_DATE"
			];
		config.download.roleName = auth.exportableRoleName;
		
		//download template
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_change_location.xsjs",
			excelUrl: "vmi/execute/change_mx.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
//		config.viewstatus = {
//			visible: true,
//			viewUploadHistory: {
//				url: uServiceUrl + "/upload.xsodata",
//				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_MANUAL_PULL'",
//				selectionMode: sap.ui.table.SelectionMode.Single,
//				visibleRowCount: 10
//			},
//			viewErrorInfo: {
//				url: uServiceUrl + "/upload.xsodata",
//				bindRowUrl: "/UPLOAD_ERR_INFO",
//				visibleRowCount: 10
//			},
//			viewUploadErrorDetail: {
//				url: uServiceUrl + "/upload.xsodata/UI_MANUAL_PULL_ERR_DETAIL?$format=json",
//				//addSingleQuotes: true,
//				columns: [[{
//					label: "Dest Storage Type",
//					field: "DEST_STORAGE_TYPE",
//					type:  "TextField"
//				},{
//					label: "Dest Storage Bin",
//					field: "DEST_STORAGE_BIN",
//					type:  "TextField"
//				},{
//					label: "Dest Storage Loc",
//					field: "DEST_STORAGE_LOC",
//					type:  "TextField"
//				},{
//					label: "Src Werks",
//					field: "SRC_WERKS",
//					type:  "TextField"
//				},{
//					label: "Physical Plant",
//					field: "PHYSICAL_PLANT",
//					type:  "TextField"
//				},{
//					label: "Inventory Type",
//					field: "INVENTORY_TYPE",
//					type:  "TextField"
//				},{
//					label: "Production Line",
//					field: "PRODUCTION_LINE",
//					type:  "TextField"
//				},{
//					label: "Head Supplierid",
//					field: "HEAD_SUPPLIERID",
//					type:  "TextField"
//				},{
//					label: "Delivery Date",
//					field: "DELIVERY_DATE",
//					type:  "TextField"
//				},{
//					label: "Matnr",
//					field: "MATNR",
//					type:  "TextField"
//				},{
//					label: "Pull Qty",
//					field: "PULL_QTY",
//					type:  "TextField"
//				},{
//					label: "Src Storage Type",
//					field: "SRC_STORAGE_TYPE",
//					type:  "TextField"
//				},{
//					label: "Src Storage Bin",
//					field: "SRC_STORAGE_BIN",
//					type:  "TextField"
//				},{
//					label: "Src Storage Loc",
//					field: "SRC_STORAGE_LOC",
//					type:  "TextField"
//				},{
//					label: "Line Supplierid",
//					field: "LINE_SUPPLIERID",
//					type:  "TextField"
//				},{
//					label: "Remark",
//					field: "REMARK",
//					type:  "TextField"
//				}]],
//				resubmit: {
//					url: uServiceUrl + "/ui_manual_pull.xsjs" 
//				}
//			}
//		}

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
		var that = this;
		var app = new sap.m.App(); 
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var iServiceUrl = service.getMXVmiInvoke();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("execute", "Change Location");
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});
			
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		this.oForm = filterPanel.getContent()[0];
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		if(config.create.visible == true){
			config.create.visible = false;
			var oCreateButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://add",
				tooltip: "create an items",
				press: function(oEvent) {
					that._openInsertDialog(sServiceUrl, config, undefined, iServiceUrl, table);
				}	
			}).addStyleClass("commontable-toolbar-btn");
		}
		if(config.edit.visible == true){
			config.edit.visible = false;
			var oEditButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://edit",
				tooltip: "Edit an item",
				press: function(oEvent) {
					that._onEdit(table, config, sServiceUrl, iServiceUrl);
				}	
			}).addStyleClass("commontable-toolbar-btn");
		}

		if(config.deleteable.visible == true){
			var oDeleteAllButton = new sap.ui.commons.Button({
				lite: true,
				icon: "resource/img/Delete_All.png",
				tooltip: "Delete All",
				press: function(oEvent) {
					that._onDeleteAll(iServiceUrl, table);				
				}	
			}).addStyleClass("commontable-toolbar-btn");
		}

		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		if(oDeleteAllButton)	{
			//oInsertUpload.addContent(oDeleteAllButton);
			oInsertUpload.getContent()[0].insertContent(oDeleteAllButton,1);
		}
		if(oEditButton)	{
			oInsertUpload.addContent(oEditButton);
		}
		if(oCreateButton){
			oInsertUpload.addContent(oCreateButton);
		}
			
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content: [header,filterPanel, oInsertUpload, table]             
	    });
        app.insertPage(page);
        app.setInitialPage(page);
		return app;
	},
	
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Manual Pull") {
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
				that._deleteAllService(iServiceUrl, table);				
			}
		}, 	"Confirm");
	},

	_deleteAllService: function(iServiceUrl, table){
		var sendData = {};
		sendData.PULL_TYPE = "MANUAL";
		table.setBusy(true);
		$.ajax({
			url: iServiceUrl + "/ui_change_location_delete_all_draft.xsjs",
			type:"post",
			dataType: "text",
			async: false,
			data: JSON.stringify(sendData),
			success: function(resp){
				console.log(resp);
				table.getModel().refresh(true);
				table.clearSelection();
				lenovo.control.commontable.Toolkit.showErrorMsg(resp, "SUCCESS", "Successfully");
				table.setBusy(false);
			},
			error: function(resp){
				lenovo.control.commontable.Toolkit.showErrorMsg(resp, "ERROR", "Error");
				table.getModel().refresh(true);
			}
		});
	},

	_openInsertDialog: function(sServiceUrl, config, objects,iServiceUrl, table){
		var that = this;
		var _oContent = [];
		_oContent = this._createContents(sServiceUrl,objects);
		var dialog = new Dialog("insert",{
			title: objects==undefined? "Insert Item" : "Edit Item",
			keepInWindow: true,
			height: "600px",
			modal: true,
			content: _oContent,
			closed:function(){
				this.destroy();
				//var soi = sap.ui.getCore().byId("i3PLId2");
				//var loi = sap.ui.getCore().byId("i3PLId");
				//if(soi != undefined){
					//soi.destroy();
				//} 
				//if(loi != undefined){
					//loi.destroy();
				//} 
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
	_switchTPL: function(layout, insertC, removeC, index){
		if(layout.indexOfContent(removeC) != -1){
			layout.removeContent(removeC);
		}
		if(layout.indexOfContent(insertC) == -1){
			layout.insertContent(insertC,index);
		}
	},
	_createContents: function(url, objects){
		var that = this;
		//Part number
		var lPartNum = new sap.ui.commons.Label({text: 'Part Number:', width: "110px"});
		var iPartNum = new lenovo.control.LenovoValueHelpField("iPartNum",
				{   placeholder: "--selection only--",
					width : "142px",									
					valueHelpRequest : function(oEvent) { 
						that._openSearchHelpForPartNum(url,
								this);
					}
				}).addStyleClass("required2").attachChange(
				that._isRequired);
		iPartNum.setValue(objects == undefined ? "":objects[0].MATNR);
		
		//PART NUMBER DESCRIPTION
		var lPartDesc = new sap.ui.commons.Label({
			text: 'Part Desc',
			width : "90px"
		}).addStyleClass("hiddenStyle");
		var iPartDesc = new sap.ui.commons.TextField("iPartDesc",{
			width : "142px",
			enabled : false
		}).addStyleClass("hiddenStyle");
		iPartDesc.setValue(objects == undefined ? "":objects[0].MATNR_DESCR);
		
		//Mo number
		var lMoNum = new sap.ui.commons.Label({text: 'Mo Number:', width: "110px"});
		var iMoNum = new sap.ui.commons.TextField("iMoNum",{
			width : "142px",
			maxLength: 12
		}).addStyleClass("required2").attachChange(
				that._isRequired);
		iMoNum.setValue(objects == undefined ? "" : objects[0].MO_NUM);

		//
		
		//Line number
		var lLineNum = new sap.ui.commons.Label({text: 'Line Number:', width: "110px"});
		var iLineNum = new sap.ui.commons.TextField("iLineNum",{
			width : "142px",
			placeholder : "--Number only--",
			maxLength: 12
		});
		iLineNum.setValue(objects == undefined ? "" : objects[0].LINE_NUM);

		var oLayout1 = new sap.ui.layout.HorizontalLayout("header1",{
			content: [lPartNum, iPartNum, lMoNum, iMoNum, lLineNum, iLineNum] ///i3PLId,
		}).addStyleClass("header");


		//Dest Stor Loc:
		var lDestLoc = new sap.ui.commons.Label({text: 'Dest Stor Loc:',width: "112px"});
		var iDestLoc = new sap.ui.commons.DropdownBox(
				"iiDestLoc", {
					width : "142px"
				}).addStyleClass("requiredDropdown").attachChange(
						that._isRequired);
		var oModel = new sap.ui.model.odata.ODataModel(url,true);
		iDestLoc.setModel(oModel);
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "STORAGE_LOCATION");
		iDestLoc.bindItems( "/CV_WAHREHOUSE_SRC?$format=json",
				oItemTemplate1);
		iDestLoc.setValue(objects == undefined ? "": objects[0].STORAGE_LOC);
	
		
//		var iDestLoc = new sap.ui.commons.ValueHelpField("iDestLoc",{
//			width: "142px",
//			valueHelpRequest: function(oEvent){that._openSearchHelpForDest(url, this);}
//		}).addStyleClass("required2").attachChange(that._isRequired);
//		iDestLoc.setValue(objects==undefined?"":objects[0].iDestLoc);
		
		// add part button
		var oAddPartButton = new sap.ui.commons.Button({
			text:"Add Part",
			press: $.proxy(that._onAddPart,that)
		});
		
		var oLayout2 = new sap.ui.layout.HorizontalLayout("header2",{
			content: [lDestLoc, iDestLoc,oAddPartButton, iPartDesc]
		}).addStyleClass("header");	

		


		var oHD = new sap.ui.commons.HorizontalDivider().addStyleClass("HDStyle");
		var oTable = that._createMoBomTable(objects);
		var oPanel1 = new sap.ui.commons.Panel({
			showCollapseIcon: false,
			width: "840px",
			content: [oTable]
		});
		oPanel1.setText("Item Information");
		var oLayout = new sap.ui.layout.VerticalLayout({
			content: [oLayout1, oLayout2, oPanel1]
		});

		return oLayout;
	},
	_onAddPart: function(){
		var oTable = sap.ui.getCore().byId("moBomTable");
		var oTableModel = oTable.getModel();
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var s = sap.ui.getCore();
		var that = this;
		if(!that._addPartValidation()){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please fill in all required fields.", "ERROR", "ERROR");
			return;
		}
		
		var iLineNum = s.byId("iLineNum").getValue();
		if(isNaN(iLineNum)){
			lenovo.control.commontable.Toolkit.showErrorMsg("Line Num should be a number.","ERROR", "ERROR");
			return;
		};
		var aData = oTable.getModel().getJSON()=="{}"?[]:JSON.parse(oTable.getModel().getJSON()).modelData;
		var oEntry = {};
		oEntry.MATNR = s.byId("iPartNum").getValue();
		oEntry.MO_NUM = s.byId("iMoNum").getValue();
		oEntry.LINE_NUM = s.byId("iLineNum").getValue();
		oEntry.STORAGE_LOC = s.byId("iiDestLoc").getValue();
		oEntry.MATNR_DESCR = s.byId("iPartDesc").getValue();
		oEntry.STATUS = "DRAFT";
		aData.push(oEntry);
		//that._freezeHeader();
		oTableModel.setData({modelData: aData});
	},
	_openSearchHelpForDest: function(url, oControl){
		var that = this;
		var s = sap.ui.getCore();
		var bindRowUrl = "/INPUT_CONF_WAHREHOUSE_INFO(P_WHERE='"
			+"(\"LOGIC_PLANT\" =''"+ s.byId("iLogicalP").getValue()+"'') AND ("
			+ "\"IS_DEST\" =''Y'') AND ("
			+"\"TYPE\" =''LOI'') "			
			+"')/Results?$select=STORAGE_LOCATION,STORAGE_TYPE,STORAGE_BIN";
		
		
		var dropdownTableConfig = {
			defaultFilterOp: "Contains",//"EQ",
			url: url,
			bindRowUrl: bindRowUrl,
			fields: [["STORAGE_TYPE",oControl],["STORAGE_LOCATION",s.byId("iDestStorLoc")],["STORAGE_BIN", s.byId("iDestBin")]],
			columns: [{
				label: "Dest Type",
				field: "STORAGE_TYPE",
				type: "TextField"
			}, {
				label: "Dest Stor Loc",
				field: "STORAGE_LOCATION",
				type: "TextField"
			}, {
				label: "Dest Bin",
				field: "STORAGE_BIN",
				type: "TextField"
			}],
			filters: [
				[{
					label: "Dest Type",
					field: "STORAGE_TYPE",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains",//"EQ"
						type: new lenovo.control.commontable.singleQuotes()
					}
				}],
				[{
					label: "Dest Stor Loc",
					field: "STORAGE_LOCATION",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}],
				[{
					label: "Dest Bin",
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
	_openSearchHelpForSourceType: function(url, oControl){
		var that = this;
		var s = sap.ui.getCore();

		var tpl = "";
		var invType = s.byId("iInvType").getValue();

		if(invType == "SOI"){
			tpl = s.byId("i3PLId2").getValue();
		}else{
			tpl = s.byId("i3PLId").getValue();
		}		
		
		var bindRowUrl = "/INPUT_CONF_WAHREHOUSE_INFO(P_WHERE='"
			+"(\"LOGIC_PLANT\" =''"+ s.byId("iLogicalP").getValue()+"'') AND ("
			+ "\"IS_SOURCE\" =''Y'') AND ("
			+ "\"TPL_ID\" =''"+tpl+"'') AND ("
			+"\"TYPE\" =''"+invType+"'') "			
			+"')/Results";
		
		var dropdownTableConfig = {
			defaultFilterOp: "Contains",
			url: url,
			bindRowUrl: bindRowUrl,
			fields: [["STORAGE_TYPE",oControl],["STORAGE_LOCATION",s.byId("iSSL")],["STORAGE_BIN", s.byId("iSB")]],
			columns: [{
				label: "Source Type",
				field: "STORAGE_TYPE",
				type: "TextField"
			}, {
				label: "Src Stor Loc",
				field: "STORAGE_LOCATION",
				type: "TextField"
			}, {
				label: "Source Bin",
				field: "STORAGE_BIN",
				type: "TextField"
			}],
			filters: [
				[{
					label: "Source Type",
					field: "STORAGE_TYPE",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains"
					}
				}],
				[{
					label: "Src Stor Loc",
					field: "STORAGE_LOCATION",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains"
					}
				}],
				[{
					label: "Source Bin",
					field: "STORAGE_BIN",
					type: "TextField",
					textfield: {
						defaultFilterOp: "Contains"
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
				text: "save and return",
				press: function(){
					that._editSaveReturn(table, dropdownTableConfig.fields, dialog);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;
	},
	_openSearchHelpForSupplier: function(url, oControl){
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
					textfield: {
						// defaultFilterOp: "EQ"
					}
				}],
				[{
					label: "Supplier Name",
					field: "SUPPLIERDESC",
					type: "TextField",
					textfield: {
						// defaultFilterOp: "EQ"
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
				text: "save and return",
				press: function(){
					that._editSaveReturn(table, dropdownTableConfig.fields, dialog);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;
	},
	_openSearchHelpForPartNum: function(url, oControl){
		var that = this;
		var dropdownTableConfig = {
			defaultFilterOp: "EQ",
			url: url,
			bindRowUrl: "/ITEMSITEMASTER001",
			fields: [["ITEM",oControl],["ITEMDESC",sap.ui.getCore().byId("iPartDesc")]],
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
			width: '50%',
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
	_openSearchHelpForPhysicalPlant: function(url, oControl){
		var that = this;
		var dropdownTableConfig = {
			defaultFilterOp: "EQ",
			url: url,
			bindRowUrl: "/CONF_SITEMASTER?$select=PHYSICALPLANT",
			fields: [["PHYSICALPLANT",oControl]],
			columns: [{
				label: "Physical Plant",
				field: "PHYSICALPLANT",
				type: "TextField"
			}],
			filters: [
				[{
					label: "Physical Plant",
					field: "PHYSICALPLANT",
					type: "TextField",
					textfield: {
						defaultFilterOp: "EQ"
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
			width: '50%',
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
			var url = sServiceUrl + config.bindRowUrl 
						+ "?$format=json&$filter=(MATNR eq '" 
						+ selectedObject.MATNR 
						+ "')and(STATUS eq '"
						+ selectedObject.STATUS
						+ "')";
			jsonModel.loadData(url,[],false);
			var objects = JSON.parse(jsonModel.getJSON()).d.results;
			this._openInsertDialog(sServiceUrl, config, objects,iServiceUrl, table);
		}else{
			lenovo.control.commontable.Toolkit.showErrorMsg("Only draft record could be edited!", "ERROR", "ERROR");
		}
		
	},
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
	_createMoBomTable: function(objects){
		var that = this;
		var oTable = new sap.ui.table.Table("moBomTable", {
			visibleRowCount: 7,
			firstVisibleRow: 3,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			toolbar: new sap.ui.commons.Toolbar({items: [ 
//				new sap.ui.commons.Button({
//					lite: true,
//					icon: "sap-icon://duplicate",
//					tooltip: "Copy selected rows",
//					press: function() { 
//						var selectedIndices = oTable.getSelectedIndices();
//						if(selectedIndices.length > 0){
//							that._copyRow(oTable, selectedIndices);
//							oTable.clearSelection();
//						}else{
//							lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record.", "ERROR", "ERROR");
//						}
//					}
//				}),
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
					label: new sap.ui.commons.Label({text: "Part Number"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "MATNR"),

					width: "50px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Part Desc"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "MATNR_DESCR"),
					width:"80px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "MO Number"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "MO_NUM"),
					width:"80px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Line Num"}),
					template: new sap.ui.commons.TextField().bindProperty("value", "LINE_NUM").addStyleClass("editable"),
					width:"80px"
				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Dest Location"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "STORAGE_LOC"),
					width:"80px"

				}),
				new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text: "Status"}),
					template: new sap.ui.commons.TextField({editable: false}).bindProperty("value", "STATUS"),
					width:"80px"
				})				
			]
		});
		var oModel = new sap.ui.model.json.JSONModel();
		if(!(objects == undefined || objects == null || objects == "" || objects.length <= 0)){
			oModel.setData({modelData: objects});
		}
		oTable.setModel(oModel);
		oTable.bindRows("/modelData");
		return oTable;
	},
	_onCreate: function(dialog, iServiceUrl, config, status, op, table){
		var oTable = sap.ui.getCore().byId("moBomTable");
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
		
		data.STATUS = status;
		for (var i = 0, l = selectedIndices.length; i < l; i++){
			selectedObject = oTable.getContextByIndex(selectedIndices[i]).getObject();
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
			data.MATNR = selectedObject.MATNR;
			data.MATNR_DESCR = selectedObject.MATNR_DESCR;
			data.LINE_NUM = selectedObject.LINE_NUM;
			data.STORAGE_LOC = selectedObject.STORAGE_LOC;
			data.MO_NUM = selectedObject.MO_NUM;
		    
			sendData.data.push(data);
		}
		console.log(sendData);
		console.log(JSON.stringify(sendData));
		this._createService(sendData, iServiceUrl, config.bindRowUrl, dialog, table);
	},
	_createService: function(sendData, iServiceUrl, path, dialog, table){
		dialog.setBusy(true);
		$.ajax({
			url: iServiceUrl + "/ui_change_location.xsjs",
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
	_addPartValidation: function(){
		var flag = true;
		$(".required2").each(function(){
	        $(this).control()[0].fireChange();
	        var result = $(this).data("result");
	        if(!result)
	        	flag = false;
	    });
		return flag;
	},
});