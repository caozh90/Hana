//Created by Zhang Ruixue at 2014-12-25
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Constants");
sap.ui.jsview("lenovo.view.cfe.materialMaster.manualBom", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table 
		config.columns = [{
			field: "BOM_LEVEL", label: "BOM Level", type:"TextField"
		},{
			field: "FATHER", label: "Father", type:"TextField"
		},{
			field: "CHILDREN", label: "Children", type:"TextField",width:"150px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "QUANTITY", label: "Quantity", type:"TextField",width:"100px"
		},{
			field: "FLAG", label: "Flag", type:"TextField",width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"180px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/CFE_UI_MANUAL_BOM_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "CHILDREN", label: "Children", type: "DropdownTable", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Children",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Children",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchChildrenDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadChildrenDropdownTable,
					context: this
				}	
			}
		},{
			field: "BOM_LEVEL", label: "BOM Level", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_MANUAL_BOM_SEARCH_DDL?$filter=ITEM_TYPE eq 'BOM_LEVEL'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]			
			}
		},{
			field: "FATHER", label: "Father", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Father",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Father",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchFatherDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadFatherDropdownTable,
					context: this
				}		
			}
		},{
			field: "FLAG", label: "Flag", type: "DropdownBox", //update by Chris Gao 2015-10-23
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L9 M9 S9"}),
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl+"/CFE_UI_MANUAL_BOM_SEARCH_DDL?$filter=ITEM_TYPE eq 'FLAG'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		//create		
		config.insertRaw=[{
			field: "BOM_LEVEL", label: "BOM Level", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					url: oServiceUrl+"/CFE_UI_MANUAL_BOM_CREATE_DDL?$filter=ITEM_TYPE eq 'BOM_LEVEL'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "FATHER", label: "Father", type:"DropdownTable",
			validation: [{
				validType: /^[0-9A-Za-z_]+$/,  //added by caozh4 20170315
				errMsg: "Invalid father Number!"
			}],
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "FATHER",
					field: "ITEM"
				}],	
				columns: [{
					label: "Item",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Item Desc",
					field: "ITEM_DESC",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM",
					label: "Item",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchCreateFatherDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateFatherDropdownTable,
					context: this
				}
			}
		},{
			field: "CHILDREN", label: "Children",  type:"DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "CHILDREN",
					field: "ITEM"
				}],	
				columns: [{
					label: "Item",
					field: "ITEM",
					type: "TextField"
				}, {
					label: "Item Desc",
					field: "ITEM_DESC",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM",
					label: "Item",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchCreateChildrenDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateChildrenDropdownTable,
					context: this
				}
			}

		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					url: oServiceUrl+"/CFE_UI_MANUAL_BOM_CREATE_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "QUANTITY", label: "Quantity", type:"TextField",
			validation: [{
				validType: /^\d{0,10}(\.\d{0,3})?$/,
				errMsg: "The date type of this field is Decimal(13,3)!"
			}]
		},{
			field: "FLAG", label: "Flag", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					url: oServiceUrl+"/CFE_UI_MANUAL_BOM_CREATE_DDL?$filter=ITEM_TYPE eq 'FLAG'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CFE_UI_MANUAL_BOM";
		config.create.fakeData = {
				"CYCLE" : "CURRENT",
				"PRODUCT_GROUP" : "EBG"
		};

		//edit		
		config.editRaw = [{
			field: "QUANTITY", 
			label: "Quantity",
			validation: [{
				validType: /^\d{0,10}(\.\d{0,3})?$/,
				errMsg: "The date type of this field is Decimal(13,3)!"
			}]
		}];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_manual_bom/CV_UI_MANUAL_BOM"';
		config.download.columns=[
			"CYCLE","BOM_LEVEL","FATHER","CHILDREN","PLANT","QUANTITY","FLAG"];
		config.download.filename= "UI_MANUAL_BOM";
		
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_manual_bom.xsjs",
			excelUrl: "cfe/materialMaster/manual_bom.xlsx"
		};
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_MANUAL_BOM'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_MANUAL_BOM_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "BOM Level",
					field: "BOM_LEVEL",
					type:  "TextField"
				},{
					label: "Father",
					field: "FATHER",
					type:  "TextField"
				}],[{
					label: "Children",
					field: "CHILDREN",
					type:  "TextField"
				},{
					label: "Plant",
					field: "PLANT",
					type:  "TextField"
				},{
					label: "Quantity",
					field: "QUANTITY",
					type: "TextField"
				},{
					field: "FLAG", label: "Flag", type: "TextField"					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_manual_bom.xsjs"
				}
			}
		};
		//toolbar , auth
		config.create.visible = auth.createable;
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;

	},
	reloadFatherDropdownTable: function(dropdownTable){
		var cycle = this.cycleDropdownBox.getValue();
		var bomLevel = this.bomLevelDropdownBox.getValue();
		var bindUrl = "/INPUT_BOM_LEVEL(INPUT_BOM_LEVEL='"+ bomLevel +"', INPUT_CYCLE='" + cycle + "')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchFatherDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var bomLevel = this.bomLevelDropdownBox.getValue();
		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_BOM_LEVEL(INPUT_BOM_LEVEL='"+ bomLevel +"', INPUT_CYCLE='" + cycle + "')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadChildrenDropdownTable: function(dropdownTable) {
		var cycle = this.cycleDropdownBox.getValue();
		var bomLevel = this.bomLevelDropdownBox.getValue();
		var bindUrl = "/INPUT_BOM_LEVEL2(INPUT_BOM_LEVEL='"+ bomLevel +"', INPUT_CYCLE='" + cycle + "')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchChildrenDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var bomLevel = this.bomLevelDropdownBox.getValue();
		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_BOM_LEVEL2(INPUT_BOM_LEVEL='"+ bomLevel +"', INPUT_CYCLE='" + cycle + "')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadCreateFatherDropdownTable: function(dropdownTable){
		var bomLevel = this.insertBomLevelDropdownBox.getValue();
		var bindUrl = "/INPUT_BOM_LEVEL3(INPUT_BOM_LEVEL='"+ bomLevel +"')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchCreateFatherDropdownTable: function(filterModel, filterPanel, table) {
		var bomLevel = this.insertBomLevelDropdownBox.getValue();
		var filter = filterModel.getProperty("/ITEM");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_BOM_LEVEL3(INPUT_BOM_LEVEL='"+ bomLevel +"')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadCreateChildrenDropdownTable: function(dropdownTable){
		var bomLevel = this.insertBomLevelDropdownBox.getValue();
		var bindUrl = "/INPUT_BOM_LEVEL4(INPUT_BOM_LEVEL='"+ bomLevel +"')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchCreateChildrenDropdownTable: function(filterModel, filterPanel, table){
		var bomLevel = this.insertBomLevelDropdownBox.getValue();
		var filter = filterModel.getProperty("/ITEM");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "ITEM",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_BOM_LEVEL4(INPUT_BOM_LEVEL='"+ bomLevel +"')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	getPlant: function(fatherDropdownBox, childrenDropdownBox, plantDropdownBox, oServiceUrl){
		var cycleValue = this.cycleDropdownBox.getValue();
		var fatherValue = fatherDropdownBox.getModel().getProperty("/FATHER/filterValue");
		var childrenValue = childrenDropdownBox.getModel().getProperty("/CHILDREN/filterValue");
		var plantOpts = {
	    		transform: function (data){
					return data.d.results;
				},
				url: function(selectedKey, fatherValue, childrenValue){
					var url = "", params = [], fatherParam, childrenParam;
					if(fatherValue.length > 0 && childrenValue.length>0) {
						fatherParam =  "INPUT_FATHER='" + fatherValue + "'";
						params.push(fatherParam);
						childrenParam =  "INPUT_CHILDREN='" + childrenValue + "'";
						params.push(childrenParam);
						url = oServiceUrl+"/INPUT_FATHER_CHILDREN(" + params.join(",") + ",INPUT_CYCLE='" + cycleValue + "')/Results?$format=json";
					} else if (fatherValue.length > 0){
						fatherParam =  "INPUT_FATHER='" + fatherValue + "'";
						params.push(fatherParam);
						url = oServiceUrl+"/INPUT_FATHER(" + params.join(",") + ",INPUT_CYCLE='" + cycleValue + "')/Results?$format=json"; 
					} else if(childrenValue.length > 0){
						childrenParam =  "INPUT_CHILDREN='" + childrenValue + "'";
						params.push(childrenParam);
						url = oServiceUrl+"/INPUT_CHILDREN(" + params.join(",") + ",INPUT_CYCLE='" + cycleValue + "')/Results?$format=json";
					}
					return url;
				},
				args: [fatherValue, childrenValue],
				bindTextField:"ITEM_VALUE",
				bindKeyField:"ITEM_VALUE"
	    };
	    if(fatherValue.length == 0 && childrenValue.length == 0) {
	    	plantOpts.selectedKey = lenovo.control.Constants.allDropdownBoxListItem;
		}
	   	lenovo.control.commontable.Toolkit.reReloadDropdownBox(plantDropdownBox, plantOpts);
	},
	relateFilter: function(oForm){
		
		//added by Chris Gao 2015-11-18
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this.cycleDropdownBox = cycleDropdownBox;
		var bomLevelDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "BOM Level")[0];
		this.bomLevelDropdownBox = bomLevelDropdownBox;
		var fatherDropdownTable = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Father")[0];
		var childrenDropdownTable = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Children")[0];
		var plantDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		var that = this;
		childrenDropdownTable.attachChange(function(){
			that.getPlant(fatherDropdownTable, childrenDropdownTable, plantDropdownBox, that.oServiceUrl);
		});
		fatherDropdownTable.attachChange(function(){		
			that.getPlant(fatherDropdownTable, childrenDropdownTable, plantDropdownBox, that.oServiceUrl);
		});
	},
	relateInsert: function(){
		if(this.auth.createable){
			var insertDialog = this.oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var bomLevelDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "BOM Level")[0];
		    this.insertBomLevelDropdownBox = bomLevelDropdownBox2;
		}
	},
	createContent: function(){	
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		this.oServiceUrl = oServiceUrl;
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("manualBom");
		this.auth = auth;
		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "Manual BOM");

		config.bindRowUrl = "/CFE_UI_MANUAL_BOM";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		//filter
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);	
		//toolbar
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table,app);
		this.oEditDeleteUploadDownload = oEditDeleteUploadDownload;
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var editButton = null, uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
			if(auth.editable && oTooltip === 'edit'){
				editButton = buttons[i];
				continue;
			}
			if(auth.deleteable && oTooltip === 'delete'){
				deleteButton = buttons[i];
				continue;
			}
			if(auth.uploadable){
				switch(oTooltip){
					case "upload, only xlsx and csv files are allowed"://update by Chris Gao 2015-11-01//case "upload":
						uploadButton = buttons[i];
						break;
					case "download upload template":
						uploadTemButton = buttons[i];
						break;
					case "view status":
						viewStatusButton = buttons[i];
						break;
				}
			}
		}
		cycleDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				if(editButton){
					editButton.setVisible(true);
				}
				if(deleteButton){
					deleteButton.setVisible(true);
				}
				if(auth.uploadable){
					uploadButton.setVisible(true);
					uploadTemButton.setVisible(true);
					viewStatusButton.setVisible(true);
				}
				
			} else {
				if(editButton){
					editButton.setVisible(false);
				}
				if(deleteButton){
					deleteButton.setVisible(false);
				}
				if(auth.uploadable){
					uploadButton.setVisible(false);
					uploadTemButton.setVisible(false);
					viewStatusButton.setVisible(false);
				}		
			}
		});
		this.relateFilter(oForm);
		this.relateInsert();
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]               
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	}
});