/*
	develop by Coral Zhang @ 2014/12/15
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");
jQuery.sap.require("lenovo.control.Util");

sap.ui.jsview("lenovo.view.vmi.control.vmiPurchaseProportion", {
	setConfig: function(config,sServiceUrl, uServiceUrl,iServiceUrl, dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("vmiPurchaseProportion");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField",
			width: "120px"
		}, {
			field: "ITEM",
			label: "Item Id",
			type: "TextField",
			width: "120px"
		}, {
			field: "ITEMDESC",
			label: "Item Desc",
			type: "TextField",
			width: "240px"
		}, {
			field: "VENDORID",
			label: "Vendor Id",
			type: "TextField",
			width: "120px"
		}, {
			field: "VENDORNAME",
			label: "Vendor Name",
			type: "TextField",
			width: "240px"
		}, {
			field: "START_DATE",
			label: "Start Date",
			type: "DatePicker",
			datepicker: {
				format: "yyyy-MM-dd"
			},
			width: "120px"
		}, {
			field: "END_DATE",
			label: "End Date",
			type: "DatePicker",
			datepicker: {
				format: "yyyy-MM-dd"
			},
			width: "120px"
		}, {
			field: "PROPORTION",
			label: "Proportion",
			type: "TextField",
			width: "120px"
		}];
		config.selectionMode = sap.ui.table.SelectionMode.Single;
		config.bindRowUrl = "/UI_PURCHASE_PROP_VMI";
		config.defaultSort = [{
			field: "ITEM",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "LOGICAL_PLANT",
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
		}, {
			field: "ITEM",
			label: "Item Id",
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
					label: "Item Description",
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
						label: "Item Description",
						field: "ITEMDESC",
						type: "TextField",
						labelLayout: new sap.ui.layout.GridData({
							span: "L6 M6 S6",
							linebreak: true
						}),
						textfield: {
							layout: new sap.ui.layout.GridData({
								span: "L6 M6 S6"
							}),
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "VENDORID",
			label: "Vendor Id",
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
							span: "L6 M6 S6",
							linebreak: true
						}),
						type: "TextField",
						textfield: {
							layout: new sap.ui.layout.GridData({
								span: "L6 M6 S6"
							}),
							// defaultFilterOp: "EQ"
						}
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "ITEMDESC",
			label: "Item Desc",
			type: "TextField"
		}, {
			field: "VENDORNAME",
			label: "Vendor Name",
			type: "TextField"
		}, {
			field: "START_DATE",
			label: "Start Date",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "GE"
			}
		}, {
			field: "END_DATE",
			label: "End Date",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "LE"
			}
		}, {
			field: "PROPORTION",
			label: "Proportion",
			type: "MultiEQ",
			multieq: {
				defaultFilterOp: "EQ"
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//delete
		config.deleteable.url = "/UI_PURCHASE_PROP_VMI";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_purchase_prop_vmi_mid.xsjs",
			excelUrl: "vmi/control/vmi_purchase_proportion.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_PURCHASE_PROP_VMI'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UI_PURCHASE_PROP_VMI_UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				_errorDetail: {
					func: this._showUploadErrorDetail,
					context: this,
					args: [uServiceUrl+"/upload.xsodata/UI_PURCHASE_PROP_VMI_UPLOAD_ERR_INFO", sServiceUrl, uServiceUrl]
				},
				columns: [
					[{
						field: "LOGICAL_PLANT",
						label: "Logical Plant",
						type: "TextField"
					}, {
						field: "ITEM",
						label: "Item Id",
						type: "TextField"
					}, {
						field: "VENDORID",
						label: "Vendor Id",
						type: "TextField"
					}, {
						field: "START_DATE",
						label: "Start Date",
						type: "TextField"
					}, {
						field: "END_DATE",
						label: "End Date",
						type: "TextField"
					}, {
						field: "PROPORTION",
						label: "Proportion",
						type: "TextField"
					}]
				],
				resubmit: {
					url: uServiceUrl + "/ui_purchase_prop_vmi_mid.xsjs"
				}
			}
		}
		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/AT_PURCHASE_PROPORTION"';
		config.download.columns = ["LOGICAL_PLANT","ITEM","ITEMDESC","VENDORID","VENDORNAME","START_DATE","END_DATE","PROPORTION"];
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
				case "deleteable":
					config.deleteable.visible = auth[i];
					break;
				case "uploadable":
					config.upload.visible = auth[i];
					break;
			}
		}
	},

	createContent: function(){
		var that = this;
		var app = new sap.m.App(); 
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var iServiceUrl = service.getMXVmiInvoke();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl, iServiceUrl,dSchema);

		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
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
				that._onEdit(table, config, sServiceUrl,iServiceUrl, table);
			}	
		}).addStyleClass("commontable-toolbar-btn");

		//auth
		var auth =  lenovo.control.commontable.Table.getViewAuth("vmiPurchaseProportion");
		for (i in auth) {
			switch(i) {
				case "createable":
					oCreateButton.setVisible(auth[i]);
					break;
				case "editable":
					oEditButton.setVisible(auth[i]);
					break;
			}
		}

		oInsertUpload.addContent(oEditButton);
		oInsertUpload.addContent(oCreateButton);

		var header = lenovo.control.commontable.Table.createHeader("Control", "VMI Purchase Proportion");
		
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content: [header, filterPanel, oInsertUpload, table]             
	    });
        app.insertPage(page);
        app.setInitialPage(page);
		return app;
	},

	_onEdit: function(table, config, sServiceUrl,iServiceUrl, table){
		var index = table.getSelectedIndices();
		if(index.length < 1){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row!", "ERROR", "Edit");
			return;
		}

		var selectedIndex = index[0];
		var selectedObject = table.getContextByIndex(selectedIndex).getObject();
		// console.log(selectedObject);

		var jsonModel = new sap.ui.model.json.JSONModel();
		var url = sServiceUrl + config.bindRowUrl + "?$format=json&$filter=ITEM eq '" + selectedObject.ITEM
												+ "' and LOGICAL_PLANT eq '" +  selectedObject.LOGICAL_PLANT
												+"' and START_DATE eq " + sap.ui.model.odata.ODataUtils.formatValue(selectedObject.START_DATE,"Edm.DateTime")
												+" and END_DATE eq " + sap.ui.model.odata.ODataUtils.formatValue(selectedObject.END_DATE,"Edm.DateTime")
												+ "";
		jsonModel.loadData(url,[],false);
		var objects = JSON.parse(jsonModel.getJSON()).d.results;
		this._openInsertDialog(sServiceUrl, config, objects,iServiceUrl, table);
	},

	_openInsertDialog: function(sServiceUrl, config, objects,iServiceUrl, table){
		var that = this;
		var _oContent = [];
		var flag = (table==undefined?true:false);
		_oContent = this._createContents(sServiceUrl,objects, flag);
		var dialog = new Dialog("insert_pp",{
			title: (objects==undefined&&!flag)? "Create VMI Purchase Proportion" : "Edit VMI Purchase Proportion",
			keepInWindow: true,
			height: "600px",
			modal: true,
			content: _oContent,
			closed:function(){
				this.destroy();
			},
		});
		var oButton = new sap.ui.commons.Button("done",{
			text : "Save", 
			press: function(){
				if(!that._validAll(dialog)){
					return;
				}
				if(table!=undefined)
					table.setBusy(true);
				that._createAndEditService(dialog, iServiceUrl, config, objects, table);
				dialog.close();
			}});
		dialog.addButton(oButton);

		dialog.open();
		dialog.ondragstart = false;
	},

	_validProportion: function(dialog){
		var componentsView = dialog.getContent()[0].getContent()[3].getContent()[0].getContent();
		var sum = 0;
		for(var i = 1, l = componentsView.length; i < l; i++){
			try{
				var proportion = parseFloat(componentsView[i].getContent()[2].getValue());
			}catch(e){
				return false;
			}
			sum = sum + proportion;
			sum = Math.round(sum*1000)/1000;
		}
		if(sum == 1)
			return true;
		else
			return false;
	},

	_validVender: function(oComVLayout, value){
		if(oComVLayout == undefined){
			return true;
		}
		for(var i = 1, l = oComVLayout.length; i < l; i++){
			var vendorId = oComVLayout[i].getContent()[0].getValue();
			if(vendorId == value)
				return false
		}
		return true;
	},

	_createContents: function(url, objects, flag){
		var that = this;
		var lLogicalP = new sap.ui.commons.Label({text: 'Logical Plant:', width: "100px"});
		var iLogicalP = new sap.ui.commons.DropdownBox({
			width: "142px",
			enabled: (objects==undefined||flag)?true:false
		});
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		iLogicalP.setModel(oModel);
		var oItemTemplate1 = new sap.ui.core.ListItem();
		oItemTemplate1.bindProperty("text", "SITEID");
		iLogicalP.bindItems("/CONF_SITEMASTER2?$format=json&$select=SITEID,MS", oItemTemplate1);
		iLogicalP.setValue(objects==undefined?"":objects[0].LOGICAL_PLANT);

		var lItemId = new sap.ui.commons.Label({text: 'Item Id:',width: "100px"});
		var iItemId = new sap.ui.commons.ValueHelpField({
			width: "142px",
			enabled: (objects==undefined||flag)?true:false,
			valueHelpRequest: function(oEvent){that._openSearchHelp(url, this, iItemDesc, flag);},
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		iItemId.setValue(objects==undefined?"":objects[0].ITEM);
		var lItemDesc = new sap.ui.commons.Label({text: 'Item Desc:',width: "100px"});
		var iItemDesc = new sap.ui.commons.TextField({
			width: "142px",
			enabled: (objects==undefined)?true:false,
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		if(flag)
			iItemDesc.removeStyleClass("required");
		iItemDesc.setValue(objects==undefined?"":objects[0].ITEMDESC);
		var oLayout1 = new sap.ui.layout.HorizontalLayout({
			content: [lLogicalP, iLogicalP, lItemId, iItemId, lItemDesc, iItemDesc]
		}).addStyleClass("header");
		var lStartD = new sap.ui.commons.Label({text: 'Start Date:',width: "100px"});
		var iStartD = new sap.ui.commons.DatePicker({
			width: "142px",
			tooltip:  objects==undefined?"":objects[0].START_DATE,//edit by ruixue 0318
			enabled: (objects==undefined||flag)?true:false,
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		iStartD.setValue(objects==undefined?"":DateConvert(objects[0].START_DATE).Format("yyyy-MM-dd"));
		var lEndD = new sap.ui.commons.Label({text: 'End Date:',width: "100px"});
		var iEndD = new sap.ui.commons.DatePicker({
			width: "142px",
			tooltip: objects==undefined?"":objects[0].END_DATE,//edit by ruixue 0318
			enabled: (objects==undefined||flag)?true:false,
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		// console.log(parseInt(objects[0].END_DATE.substring(6,19)));
		iEndD.setValue(objects==undefined?"":DateConvert(objects[0].END_DATE).Format("yyyy-MM-dd"));
		var oLayout2 = new sap.ui.layout.HorizontalLayout({
			content: [lStartD, iStartD, lEndD, iEndD]
		}).addStyleClass("header");

		var lVendorId = new sap.ui.commons.Label({text: 'Vendor Id'});
		var lVendorName = new sap.ui.commons.Label({text: 'Vendor Name'});
		var lProportion = new sap.ui.commons.Label({text: 'Proportion'});
		var lEmpty = new sap.ui.commons.Label();
		var oComHLayout1 = new sap.ui.layout.HorizontalLayout({
			width: "100%",
			content: [lVendorId, lVendorName, lProportion, lEmpty]
		});

		var layoutContent = [oComHLayout1]

		for(var i=0, l=objects==undefined?1:objects.length; i<l; i++){
			var iVendorId = new sap.ui.commons.ValueHelpField({
				width: "100%",
				enabled: (objects==undefined||flag)?true:false,
				valueHelpRequest: function(oEvent){that._openSearchHelpForVendor(url, this, iVendorName, layoutContent, flag);},
				change: function(){that._callValidation(this);}
			}).addStyleClass("required");
			iVendorId.setValue(objects==undefined?"":objects[i].VENDORID);
			var iVendorName = new sap.ui.commons.TextField({
				width: "100%",
				enabled: (objects==undefined)?true:false,
				change: function(){that._callValidation(this);}
			}).addStyleClass("required");
			if(flag)
				iVendorName.removeStyleClass("required");
			iVendorName.setValue(objects==undefined?"":objects[i].VENDORNAME);
			var iProportion = new sap.ui.commons.TextField({
				width: "100%",
				change: function(){that._callValidation(this);}
			}).addStyleClass("required");
			iProportion.setValue(objects==undefined?"":objects[i].PROPORTION);
			lEmpty = new sap.ui.commons.Label();
			var oBtn = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://less",
				tooltip: "create an item",
				press: function(oEvent) {
					that._deleteRow(oComVLayout, oComHLayout2);
				}	
			}).addStyleClass("commontable-toolbar-btn");
			
			var oComHLayout2 = new sap.ui.layout.HorizontalLayout({
				width: "100%",
				content: [iVendorId, iVendorName, iProportion, flag?oBtn:lEmpty]
			});

			layoutContent.push(oComHLayout2);
		}

		var oComVLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: layoutContent
		});
		var oPanel = new sap.ui.commons.Panel({
			showCollapseIcon: false,
			width: "100%",
			height: "400px",
			content: [oComVLayout]
		});
		oPanel.setText("All Components");
		oPanel.addStyleClass("Component");

		var oHD = new sap.ui.commons.HorizontalDivider();
		oHD.addStyleClass("HDStyle");
		var oButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://add",
			tooltip: "add an component",
			press: function(oEvent) {
				that._addRow(oComVLayout, url, flag);
			}	
		}).addStyleClass("commontable-toolbar-btn");
		var oLayout = new sap.ui.layout.VerticalLayout({
			content: [oLayout1, oLayout2, oHD, oPanel, oButton]
		});

		return oLayout;
	},

	_addRow: function(oComVLayout, url, flag){
		var that = this;
		var iVendorId = new sap.ui.commons.ValueHelpField({
			width: "100%",
			valueHelpRequest: function(oEvent){that._openSearchHelpForVendor(url, this, iVendorName,oComVLayout.getContent(), flag);},
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		var iVendorName = new sap.ui.commons.TextField({
			width: "100%",
			enabled: !flag,
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		if(flag)
				iVendorName.removeStyleClass("required");
		var iProportion = new sap.ui.commons.TextField({
			width: "100%",
			change: function(){that._callValidation(this);}
		}).addStyleClass("required");
		var oBtn = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://less",
			tooltip: "create an item",
			press: function(oEvent) {
				that._deleteRow(oComVLayout, oComHLayout2);
			}	
		}).addStyleClass("commontable-toolbar-btn");
		var oComHLayout2 = new sap.ui.layout.HorizontalLayout({
			width: "100%",
			content: [iVendorId, iVendorName, iProportion, oBtn]
		});
		oComVLayout.addContent(oComHLayout2);
	},

	_deleteRow: function(oComVLayout,oComHLayout2){
		oComVLayout.removeContent(oComHLayout2);
	},

	_editSaveReturn: function(table, fields, dialog, oComVLayout){
		var selectedIndices = table.getSelectedIndices();
		var oModel = table.getModel();
		var selectedObject, oControl, field;
		for(var i = 0; i < selectedIndices.length; i++) {
			selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
			break;
		}
		if(selectedObject != undefined){
			if(this._validVender(oComVLayout, selectedObject[fields[0][0]])){
				for(var i = 0, l = fields.length; i < l; i++){
					oControl = fields[i][1];
					field = fields[i][0];
					oControl.setValue(selectedObject[field]);
				}
			}else{
				lenovo.control.commontable.Toolkit.showErrorMsg("Duplicated vendor!", "ERROR", "");
			}
		}
		dialog.close();
	},

	_openSearchHelp: function(url, oControl, oTarget, flag){
		var that = this;
		var dropdownTableConfig = {
			defaultFilterOp: "EQ",
			url: url,
			bindRowUrl: "/ITEMSITEMASTER001",
			fields: [["ITEM",oControl],["ITEMDESC",oTarget]],
			columns: [{
				label: "Item Id",
				field: "ITEM",
				type: "TextField"
			}, {
				label: "Item Description",
				field: "ITEMDESC",
				type: "TextField"
			}],
			filters: [
				[{
					field: "ITEM",
					label: "Item Id",
					type: "TextField",
					textfield: {
						defaultFilterOp: "EQ"
					}
				}],
				[{
					label: "Item Description",
					field: "ITEMDESC",
					type: "TextField",
					textfield: {
						defaultFilterOp: "EQ"
					}
				}]
			],
			visibleRowCount: 10
		};
		if(flag){
			dropdownTableConfig.fields.pop();
		}
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

	_openSearchHelpForVendor: function(url, oControl, oTarget, layoutContent, flag){
		var that = this;
		var dropdownTableConfig = {
			defaultFilterOp: "EQ",
			url: url,
			bindRowUrl: "/SUPITEM",
			fields: [["SUPPLIERID",oControl],["SUPPLIERDESC",oTarget]],
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
						defaultFilterOp: "EQ"
					}
				}],
				[{
					label: "Supplier Name",
					field: "SUPPLIERDESC",
					type: "TextField",
					textfield: {
						defaultFilterOp: "EQ"
					}
				}]
			],
			visibleRowCount: 10
		};
		if(flag){
			dropdownTableConfig.fields.pop();
		}
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
					that._editSaveReturn(table, dropdownTableConfig.fields, dialog, layoutContent);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;
	},

	_createAndEditService: function(dialog, sServiceUrl, config, objects, table){
		var date = new Date();
		var logicalPlant = dialog.getContent()[0].getContent()[0].getContent()[1].getValue();
		var itemID = dialog.getContent()[0].getContent()[0].getContent()[3].getValue();
		var itemDesc = dialog.getContent()[0].getContent()[0].getContent()[5].getValue();
		var startDate = dialog.getContent()[0].getContent()[1].getContent()[1].getValue();
		var endDate = dialog.getContent()[0].getContent()[1].getContent()[3].getValue();

		var componentsView = dialog.getContent()[0].getContent()[3].getContent()[0].getContent();
		var oEntry = {};
		var oCom = {};
		if(config == undefined){
			oEntry.filename = "Resubmit";
			oEntry.data = [];
			for(var i = 1, l = componentsView.length; i < l; i++){
	        	oCom = $.extend(true, {}, oCom);
	        	oCom.LOGICAL_PLANT = logicalPlant;
	        	oCom.ITEM = itemID;
	        	oCom.START_DATE = startDate;
	        	oCom.END_DATE = endDate;
	        	oCom.VENDORID = componentsView[i].getContent()[0].getValue();
	        	oCom.PROPORTION = componentsView[i].getContent()[2].getValue();
	        	oEntry.data.push(oCom);
	        }
		}else{
			oEntry.LOGICAL_PLANT = logicalPlant;
			oEntry.ITEM = itemID;
			oEntry.ITEMDESC = itemDesc;
			oEntry.START_DATE = (new Date(startDate)).Format("yyyy-MM-dd");
	        oEntry.END_DATE = (new Date(endDate)).Format("yyyy-MM-dd");
	        oEntry.SYS_CREATED_DATE = (new Date(date)).Format("yyyy-MM-dd hh:mm:ss");
	        oEntry.OP_TYPE = objects==undefined?"CREATE":"UPDATE",
	        oEntry.data = [];
	        for(var i = 1, l = componentsView.length; i < l; i++){
	        	oCom = $.extend(true, {}, oCom);
	        	oCom.VENDORID = componentsView[i].getContent()[0].getValue();
	        	oCom.VENDORNAME = componentsView[i].getContent()[1].getValue();
	        	oCom.PROPORTION = componentsView[i].getContent()[2].getValue();
	        	oEntry.data.push(oCom);
	        }
		}
        console.log(JSON.stringify(oEntry));

        $.ajax({
			url: sServiceUrl + "/ui_purchase_prop_vmi.xsjs",
			type: "POST",
			data: JSON.stringify(oEntry),
			dataType: "text",
			contentType: "application/json;charset=UTF-8",
			success: function(msg) {
				if(table != undefined){
					table.getModel().refresh(true);
					table.setBusy(false);
					lenovo.control.commontable.Toolkit.showErrorMsg(objects==undefined?"Create successfully":"Edit successfully", "SUCCESS", objects==undefined?"Create":"Edit");
				}else{
					lenovo.control.commontable.Toolkit.showErrorMsg("Finished. You can click 'View Status' button to check result." , "SUCCESS", "Resubmit");
				}
			},
			error: function(e,b) {
				if(table != undefined){
					table.setBusy(false);
				}
				lenovo.control.commontable.Toolkit.showErrorMsg(e.responseText, "ERROR",  "Error");
			}
		});
	},
	_valid: function(value){
		if(!lenovo.control.Validation.require(value)){
			return "Required!"
		}
		return "";
	},
	_callValidation: function(control){
		lenovo.control.commontable.Table._clearErrorPopup(control);
		var error = []
		var msg = this._valid(control.getValue().trim());

		if(msg != ""){
			error.push(msg);
		}
		lenovo.control.commontable.Table._showEditError(error,control);
	},
	_validAll: function(dialog){
		var inputs = dialog.$().find("input.required");
		var message = "";
		var requiredCheck = true;
		inputs.each(function(){
			var value = $(this)[0].value;
			if(!lenovo.control.Validation.require(value)){
				// $(this).addClass("required");
				requiredCheck = false;
			}
		});
		if(!requiredCheck){
			message = message + "Required fields can not be empty!"
		}

		if(!this._validProportion(dialog)){
			if(message != "")
				message = message + "\n";
			message = message + "The sum of proporton should be 1!"
		}

		if(message != ""){
			lenovo.control.commontable.Toolkit.showErrorMsg(message, "ERROR", "");
			return false;
		}
		return true;
	},

	_showUploadErrorDetail: function(code, context, url, sServiceUrl, iServiceUrl){
		var selectedObject = context.getObject();
		var jsonModel = new sap.ui.model.json.JSONModel();
		var url = url + "?$format=json&$filter=ITEM eq '" + selectedObject.ITEM
					+ "' and LOGICAL_PLANT eq '" +  selectedObject.LOGICAL_PLANT
					+ "' and CODE eq '" +  code
					+"' and START_DATE eq " + sap.ui.model.odata.ODataUtils.formatValue(selectedObject.START_DATE,"Edm.String")
					+" and END_DATE eq " + sap.ui.model.odata.ODataUtils.formatValue(selectedObject.END_DATE,"Edm.String")
					+ "";
		jsonModel.loadData(url,[],false);
		var objects = JSON.parse(jsonModel.getJSON()).d.results;

		this._openInsertDialog(sServiceUrl, undefined, objects,iServiceUrl, undefined);
	}
});