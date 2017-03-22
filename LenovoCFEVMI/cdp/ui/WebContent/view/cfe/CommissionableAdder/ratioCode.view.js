/**********************************
* Created by Zhao Dan at 2015-8-5
* Modified by Chris Gao at 2015-8-11
* Version 2.0
* Upgraded by Chris Gao at 2015-09-21
* as requirements changed
***********************************/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");


sap.ui.jsview("lenovo.view.cfe.CommissionableAdder.ratioCode", {
	
	//private parameters definition
	_cycleDropdownBox : null,
	
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
		config.columns = [{
			field: "BRAND", label: "Brand", type:"TextField", width: "150px"
		},{
			field: "FAMILY", label: "Family", type:"TextField", width: "150px"
		},{
			field: "GEO", label: "GEO", type:"TextField", width: "150px"
		},{
			field: "MACHINETYPE", label: "Machine Type", type:"TextField", width: "150px"
		},{
			field: "ITEM", label: "Item", type:"TextField", width: "150px"
		},{
			field: "RATIO_CODE", label: "Ratio Code", type:"TextField", width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "150px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		
		//filter 
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "MACHINETYPE", label: "Machine Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'MACHINETYPE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		},{
			field: "ITEM", label: "Item", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Item",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Item",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadItemDropdownTable,
					context: this
				}
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'FAMILY' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}					
			}
		},{
			field: "RATIO_CODE", label: "Ratio Code", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'RATIO_CODE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		},{
			field: "GEO", label: "GEO", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'GEO' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}					
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		

		//create	
//		var defaultInsertValue = this.setCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "FAMILY", 
			label: "Family", 
			type:"DropdownBox",
			dropdownbox : {
				defaultNullValue: true, //to add null line for drop down box when insert -- call toolkit
				defaultValue: "N/A", //to clear other data and ensure the create drop down box with initial value = '' Added by Chris Gao 2015-10-10
				odata:{
					url: oServiceUrl +"/UI_RATIO_CODE_CREATE_DDL?$filter=ITEM_TYPE eq 'FAMILY' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		},{
			field: "GEO", 
			label: "GEO", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
//				defaultValue: defaultInsertValue.defaultBrand,
				odata:{
					url: oServiceUrl +"/UI_RATIO_CODE_CREATE_DDL?$filter=ITEM_TYPE eq 'GEO' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}
			}
		},{
			field: "MACHINETYPE", 
			label: "Machine Type", 
			type:"DropdownTable",
			//uninput: true, // to use the custom search value help contro for disable input 2015-09-24
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "MACHINETYPE",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "Machine Type",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Machine Type",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadCreateSearchMachineTypeDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateMachineTypeDropdownTable,
					context: this
				}
			}
			
		},{
			field: "ITEM", 
			label: "Item", 
			type:"DropdownTable",
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "ITEM",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "Item",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Item",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadCreateSearchItemDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateItemDropdownTable,
					context: this
				}
			}
			
		},{
			field: "RATIO_CODE", 
			label: "Ratio Code", 
			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(3, config.insertRaw);
		config.create.url = "/UI_RATIO_CODE";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT",
				"BRAND" : "N/A"
		};
		config.create.caninitialnull = true; // to process pass initial null value by 2015-08-26 Chris Gao
		config.create.initialnullValue = {
				"FAMILY" : "N/A",
				"MACHINETYPE" : "N/A",
				"ITEM" : "ALL"
		};
		//edit		
		config.editRaw = [{
							field: "RATIO_CODE", 
							label: "Ratio Code",
							required: true,
							validation: [{
								validType: lenovo.control.Validation.require,
								errMsg: "Required!"
							}]
						  }
		                  ];
		
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_ratio_code/CV_UI_RATIO_CODE"';
		config.download.columns=[
			 "CYCLE","BRAND","FAMILY","GEO","MACHINETYPE","ITEM","RATIO_CODE"];
		config.download.filename= "UI_RATIO_CODE";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_ratiocode.xsjs",
			excelUrl: "cfe/CommissionableAdder/ratio_code.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_RATIO_CODE'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_RATIO_CODE_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Brand",
					field: "BRAND",
					type:  "TextField"
				},{
					label: "Family",
					field: "FAMILY",
					type:  "TextField"
				},{
					label: "Machine Type",
					field: "MACHINETYPE",
					type:  "TextField"
					
				},{
					label: "Item",
					field: "ITEM",
					type:  "TextField"
				},{
					label: "Ratio Code",
					field: "RATIO_CODE",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_ratiocode.xsjs"
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
	
	/****************** Start Select Data Helper Table******************************/
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'ITEM'"
			})
			];
		}
		var bindUrl = "/UI_RATIO_CODE_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadItemDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao - 2015-09-09
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_RATIO_CODE_SEARCH_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	/******************* End Select Data Helper Table******************************/
	
	/******************* Start Create Data Helper Table******************************/
	reloadCreateSearchItemDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'ITEM'"
			})
			];
		}
		var bindUrl = "/UI_RATIO_CODE_CREATE_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadCreateItemDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao - 2015-09-09
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_RATIO_CODE_CREATE_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	
	//to change Machine Type from Dropdownbox to Dropdown Table as requirements described 
	//2015-09-24
	reloadCreateSearchMachineTypeDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			new sap.ui.model.Filter({
				path: "ITEM_TYPE",
                operator: "EQ",
                value1: "'MACHINETYPE'"
			})
			];
		}
		var bindUrl = "/UI_RATIO_CODE_CREATE_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadCreateMachineTypeDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao - 2015-09-09
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_RATIO_CODE_CREATE_DDL?$filter=ITEM_TYPE eq 'MACHINETYPE' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	/******************* End Create Data Helper Table******************************/
	
	createContent: function(){
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		
		var auth = lenovo.control.commontable.Table.getViewAuth("ratioCode");
	
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("CommissionableAdder", "Ratiocode");

		config.bindRowUrl = "/UI_RATIO_CODE";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		
		var oForm = filterPanel.getContent()[0];
		
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this._cycleDropdownBox = cycleDropdownBox;
		
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
					case "upload, only xlsx and csv files are allowed":
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
				if(auth.uploadable && uploadButton){
					uploadButton.setVisible(false);
					uploadTemButton.setVisible(false);
					viewStatusButton.setVisible(false);
				}		
			}
		});
		 

		if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    
		    /**********************************
			* Created by Chris Gao at 2015-8-25
			* to do the toUpperCase
			***********************************/
		   
		    var ratiocodeBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Ratio Code")[0];
		    ratiocodeBox.attachChange(this.ratiocodeBoxChange);
		    ratiocodeBox.attachLiveChange(this.ratiocodeBoxLiveChange);
		    /**********************************
			* End by Chris Gao at 2015-8-25
			***********************************/
		    
		    /**********************************
			* Created by Chris Gao at 2015-9-6
			* to do the toUpperCase
			* Modified by Chris Gao at 2015-09-22
			* to do the disabled (only enabled in Family, Machine type, Item)
			***********************************/
		    var itemBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Item")[0];
		    var familyBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Family")[0];
		    var machineTypeBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Machine Type")[0];
		    
		    //clear disabled status for all the controls when close
		    insertDialog.attachClosed(function(){
		    	familyBox.setEnabled(true);
				machineTypeBox.setEnabled(true);
				itemBox.setEnabled(true);
		    });
		    
		    itemBox.attachChange(function(oEvent){
		    	//upper case
				var itemValue = oEvent.getSource().getValue();
				itemValue = itemValue.toUpperCase();
				oEvent.getSource().setValue(itemValue);
				//change disabled others
				if(itemValue != "")
				{
					familyBox.setEnabled(false);
					familyBox.setValue("");
					machineTypeBox.setEnabled(false);
					machineTypeBox.setValue("");
				}
				else
				{
					familyBox.setEnabled(true);
					machineTypeBox.setEnabled(true);
				}
				
				
		    });
		    itemBox.attachLiveChange(function(oEvent){
		    	//upper case
		    	var itemValue = oEvent.getSource().getValue();
				var newValue = oEvent.getSource().getLiveValue();//get live value
				itemValue = newValue.toUpperCase();
				oEvent.getSource().setValue(itemValue);
				//change disabled others
				if(itemValue != "")
				{
					familyBox.setEnabled(false);
					familyBox.setValue("");
					machineTypeBox.setEnabled(false);
					machineTypeBox.setValue("");
				}
				else
				{
					familyBox.setEnabled(true);
					machineTypeBox.setEnabled(true);
				}
		    });
		    familyBox.attachChange(function(oEvent){
		    	
		    	var itemValue = oEvent.getSource().getValue();
		    	if(itemValue != "")
				{
		    		itemBox.setEnabled(false);
		    		itemBox.setValue("");
					machineTypeBox.setEnabled(false);
					machineTypeBox.setValue("");
				}
				else
				{
					itemBox.setEnabled(true);
					machineTypeBox.setEnabled(true);
				}
		    	
		    });
		    machineTypeBox.attachChange(function(oEvent){
		    	var itemValue = oEvent.getSource().getValue();
		    	if(itemValue != "")
				{
		    		itemBox.setEnabled(false);
		    		itemBox.setValue("");
		    		familyBox.setEnabled(false);
		    		familyBox.setValue("");
				}
				else
				{
					itemBox.setEnabled(true);
					familyBox.setEnabled(true);
				}
		    });
		    


		    /**********************************
			* End by Chris Gao at 2015-9-22
			***********************************/
		    
		}
		
		/********************************
		 * Added by Chris Gao
		 * to process convert to Upper case when edit
		 * 2015-09-11
		 ********************************/
		if(auth.editable){
			//trigger attach change of drop down list
			var columnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Ratio Code", table);
			var that = this;
			
			table.attachCellClick(function(oEvent){

				var rows = this.getRows();
				var selectedRowIndex = this.getSelectedIndex();
				var clickedRowIndex = oEvent.getParameter("rowIndex");
				var clickedColumnIndex = oEvent.getParameter("columnIndex");
				if(clickedRowIndex < rows.length && clickedRowIndex == selectedRowIndex && clickedColumnIndex == columnIndex)
				{
					var row = rows[selectedRowIndex];
					var cells = row.getCells();
					
					var sourceCell = cells[columnIndex];
					
					if(sourceCell.getValue() != "" && sourceCell != undefined)
					{
						sourceCell.attachLiveChange(that.itemboxLiveChange);
					}
				}
				
		    });	
		}	
		
		/*************************************************
		 * End by Chris Gao
		 * 2015-09-11
		 **************************************************/

		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	
//	/**********************************
//	* Created by Chris Gao at 2015-8-25
//	* set to Upper when value changed, including value helper chosen
//	***********************************/
//	itemboxChange: function(oEvent){
//		var that = this;
//		var itemValue = oEvent.getSource().getValue();
//		itemValue = itemValue.toUpperCase();
//		oEvent.getSource().setValue(itemValue);
//		
//	},
//	
//	/**********************************
//	* when free text, each character when input will be converted to Upper
//	***********************************/
//	itemboxLiveChange: function(oEvent){
//		
//		var itemValue = oEvent.getSource().getValue();
//		var newValue = oEvent.getSource().getLiveValue();//get live value
//		itemValue = newValue.toUpperCase();
//		oEvent.getSource().setValue(itemValue);
//	},
//	
//	/**********************************
//	* End by Chris Gao at 2015-8-25
//	***********************************/
	
	/**********************************
	* Created by Chris Gao at 2015-9-6
	* set to Upper when value changed, including value helper chosen
	***********************************/
	ratiocodeBoxChange: function(oEvent){
		
		var itemValue = oEvent.getSource().getValue();
		itemValue = itemValue.toUpperCase();
		oEvent.getSource().setValue(itemValue);
		
	},
	
	/**********************************
	* when free text, each character when input will be converted to Upper
	***********************************/
	ratiocodeBoxLiveChange: function(oEvent){
		var itemValue = oEvent.getSource().getValue();
		var newValue = oEvent.getSource().getLiveValue();//get live value
		itemValue = newValue.toUpperCase();
		oEvent.getSource().setValue(itemValue);
	},
	
	/**********************************
	* End by Chris Gao at 2015-9-6
	***********************************/
	
	/**********************************
	* Created by Chris Gao at 2015-9-22
	* to do the disabled (only enabled in Family, Machine type, Item)
	***********************************/
	familyBoxChange: function(oEvent){
		
	},
	
	machineTypeBoxChange: function(oEvent){
		
	},
	
	/**********************************
	* End by Chris Gao at 2015-9-22
	***********************************/
	
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Ratio Code") {
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
