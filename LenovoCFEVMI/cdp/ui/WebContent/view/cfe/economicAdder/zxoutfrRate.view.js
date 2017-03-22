/************************************
* Created by Chris Gao at 2016-05-18
* Version 1.0 2016-05-18
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.economicAdder.zxoutfrRate", { 
/******Copy_Change_End*******/	
	getControllerName: function() {

	},
	
	//Create Page Content including all the UI items
	createContent: function(){
		
		//declare app
		var app = new sap.m.App();
		//declare service url
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();        //model service url
		var uServiceUrl = service.getEBGCfeUpload();  //upload service url
		
		//declare model 
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("zxoutfrRate");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Ecomomic Adder", "XOUTFR Rate");
		/******Copy_Change_End*******/
		
		/******Add by Cuiyue start*******/
		config.bindRowUrl ="/UI_XOUTFR_RATE";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
			var selectedIndices = table.getSelectedIndices();

			for(var i = 0;i < selectedIndices.length; i++){
				if(selectedIndices[i]<table.getFirstVisibleRow() || 
						selectedIndices[i] >= (table.getFirstVisibleRow() + table.getRows().length))
			    {
					table.removeSelectionInterval(selectedIndices[i],selectedIndices[i]);	
			    }else if(table.getContextByIndex(selectedIndices[i]) !== undefined){
			    	var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.FREIGHT_TYPE == 'GEO_MIX')
					{
						
						table.removeSelectionInterval(selectedIndices[i],selectedIndices[i]);
							
					}
			    }else{
			    	table.removeSelectionInterval(selectedIndices[i],selectedIndices[i]);
			    }
				
			}
			//table.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		});
		oModel.attachRequestSent(function(){
			table.setBusy(true);
			//table.setSelectionMode(sap.ui.table.SelectionMode.None);
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		
		var oFilterBtn = filterPanel.getButtons();
		var searchBtn = null;
		for(var i = 0; i < oFilterBtn.length; i++) {
			var oTooltip = oFilterBtn[i].getTooltip();
			if(oTooltip==="search"){
				searchBtn = oFilterBtn[i];
				break;	
			}	
		}
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		//toolbar	
		//config.create.visible=false;
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);	
		
		var oToolbarCtn = oEditDeleteUploadDownload.getContent()[0];	
		var oDelete = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://delete",
			tooltip: "delete",
			press: function(){
				that.deleteBatch(table, oServiceUrl);
				
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		if(auth.deleteable){
			oToolbarCtn.insertContent(oDelete,3);
			
		}
		var oToolbarCtnE = oEditDeleteUploadDownload.getContent()[1];
		var buttonsE = oToolbarCtnE.getContent();
		var saveButton;
		for (var i = 0; i < buttonsE.length; i++) {
			if(buttonsE[i].getTooltip() == 'save'){
				saveButton = buttonsE[i];
				saveButton.setVisible(false);
			}
		}
		var oSave = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://accept",
			tooltip: "save",
			press: function(){
				that._savePress(table, oServiceUrl,oToolbarCtn,oToolbarCtnE);
				
			}
		}).addStyleClass("commontable-toolbar-btn");
		
		oToolbarCtnE.insertContent(oSave,1);
	
		
		var buttons = oToolbarCtn.getContent();
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

		
		cycleDropdownBox.attachChange(function(config){
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
		
		
		/*************************************
		 * Added by Chris Gao
		 * 2015-09-24
		 * to implement the dynamic edit mode
		 *********************************/
		
		var editBtn;
		var saveBtn;
		var buttons = oToolbarCtn.getContent();
		for(var i=0; i<buttons.length; i++)
		{
			if(buttons[i].getTooltip() == 'edit')
			{
				editBtn = buttons[i];
			}else if(buttons[i].getText() == 'save and return'){
				saveBtn =  buttons[i];
			}
		}
		var that = this;
		
		editBtn.attachPress({oTable: table, config: config, that: that}, this._editPress);
		table.attachRowSelectionChange(function(oEvent){			
						
			var selectedIndices = table.getSelectedIndices();
			
			for(var i = 0;i < selectedIndices.length; i++){
				if(selectedIndices[i]<table.getFirstVisibleRow() || 
						selectedIndices[i] >= (table.getFirstVisibleRow() + table.getRows().length))
			    {
					table.removeSelectionInterval(selectedIndices[i],selectedIndices[i]);	
			    }else if(table.getContextByIndex(selectedIndices[i]) !== undefined){
			    	
			    	var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					if(selectedObject.FREIGHT_TYPE == 'GEO_MIX')
					{
						table.removeSelectionInterval(selectedIndices[i],selectedIndices[i]);	
					}
			    }else{
			    	
			    	table.removeSelectionInterval(selectedIndices[i],selectedIndices[i]);
			    }
				
			}
			
		});
		
		/******Add by Cuiyue end*******/
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]           
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
_editPress: function( oBtn,oData){
		
		var oTable = oData.oTable;
		var config = oData.config;
		var here = oData.that;
		var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Freight Type", oTable);
		//var editColumnIndex1 = lenovo.control.commontable.Toolkit.getColumnIndexByField("Hold Type", oTable);
		//var editColumnIndex2 = lenovo.control.commontable.Toolkit.getColumnIndexByField("Hold Qty", oTable);
		var editableColumns = lenovo.control.commontable.Table._getEditableColumns(oTable, config)[0];
		
		var selectedIndices = oTable.getSelectedIndices();

		//1.handle already selected lines
		if(selectedIndices != null && selectedIndices.length>0){
			
			for(var i = 0; i < selectedIndices.length; i++)
			{
				var row = oTable.getRows()[selectedIndices[i]%oTable.getRows().length];
				var judgeColumnValue = row.getCells()[judgeColumnIndex].getValue();
				
				if(judgeColumnValue == 'GEO_MIX')
				{
					for(var j = 0; j < editableColumns.length; j++)
					{
						var cellElement = row.getCells()[editableColumns[j]];
	
							cellElement.setEditable(false);
							cellElement.removeStyleClass("editable");
							cellElement.detachChange(lenovo.control.commontable.Table._editValidation);
							lenovo.control.commontable.Table._clearErrorPopup(cellElement);

					}
				}
			}
		}
		
		
		//2.handle would be selected lines
		oTable.attachRowSelectionChange(function(oEvent){
			
			var thisTable = oEvent.getSource();
			
			var selectedIndices = oEvent.getSource().getSelectedIndices();
			
			if(selectedIndices != null && selectedIndices.length>0){
				
				for(var i = 0; i < selectedIndices.length; i++)
				{
					var row = thisTable.getRows()[selectedIndices[i]%thisTable.getRows().length];
					
					var judgeColumnValue = row.getCells()[judgeColumnIndex].getValue();
					
					if(judgeColumnValue == 'GEO_MIX')
					{
						for(var j = 0; j < editableColumns.length; j++)
						{
							var cellElement = row.getCells()[editableColumns[j]];
								cellElement.setEditable(false);
								cellElement.removeStyleClass("editable");
								cellElement.detachChange(lenovo.control.commontable.Table._editValidation);
								lenovo.control.commontable.Table._clearErrorPopup(cellElement);
						}
					}
				}
			}
		});
},
	_savePress: function( table, oServiceUrl,oToolbarCtn,oToolbarCtnE){
		var selectedIndices = table.getSelectedIndices();
		var oUpdateData = {};
		var oData = [];
		
		if(0 == selectedIndices.length){
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
			return;
		}
		
		for(var i = 0;i < selectedIndices.length; i++){
			//var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
			var row = table.getRows()[selectedIndices[i]%table.getRows().length];
			//var judgeColumnValue = row.getCells()[judgeColumnIndex].getValue();
			//var selectedObject = row.getObject();
			    oUpdateData = {};
			    var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Cycle", table);
				oUpdateData.CYCLE = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Product Group", table);
				oUpdateData.PRODUCT_GROUP = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Brand", table);
				oUpdateData.BRAND = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Plant", table);
				oUpdateData.PLANT = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Geo Type", table);
				oUpdateData.GEO_TYPE = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Geo Code", table);
				oUpdateData.GEO = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Product Family", table);
				oUpdateData.FAMILY = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Machine Type", table);
				oUpdateData.MACHINETYPE = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Freight Type", table);
				oUpdateData.FREIGHT_TYPE  = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("GL Percentage", table);
				oUpdateData.GL_PERCENTAGE  = row.getCells()[judgeColumnIndex].getValue();
				var judgeColumnIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField("Unit Cost", table);
				oUpdateData.UNIT_COST = row.getCells()[judgeColumnIndex].getValue();;
				oData.push(oUpdateData);
			
		}//
		
	  
		var service = new lenovo.service.CFE();
		var logicServiceUrl = service.getEBGCfeLogic();
		
		var obj = {
			"data":oData
		};
		table.setBusy(true);
		$.ajax({
			url: logicServiceUrl+ "/ui_upd_xoutfrRate_batch.xsjs",
			type: "POST",
			data: JSON.stringify(obj),
			dataType: "text",
			contentType: "application/json",
			success: function(data){
				lenovo.control.commontable.Toolkit.showErrorMsg("Successfully save", "SUCCESS", "Save");
				var oModel = table.getModel();
				table.setBusy(false);
				lenovo.control.commontable.Table._resetCells(table);
				
				//lenovo.control.commontable.Table._resetCells(table);
				oModel.refresh(true);
				
				table.clearSelection();
				table.detachRowSelectionChange(lenovo.control.commontable.Table._onHandleSelection);
				
				lenovo.control.commontable.Toolkit.refreshDropdownbox();
				oToolbarCtn.setVisible(true);
				oToolbarCtnE.setVisible(false);
				//lenovo.control.commontable.Table._resetCells(table);
			},
			error: function(err){
				err = err && err.responseText ;
				table.setBusy(false);
				if(!(typeof err === "string"))
					err = JSON.stringify(err);
				lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Save");	
			}
			
		});
	},
	
	deleteBatch: function(table){
		sap.ui.commons.MessageBox.confirm("Do you want to delete selected items?", function(result){
			if(result){
				
				var selectedIndices = table.getSelectedIndices();
				var oUpdateData = {};
				var oData = [];
				var temp = [];
				
				
				if(0 == selectedIndices.length){
					lenovo.control.commontable.Toolkit.showErrorMsg("Please select a row at least!", "ERROR", "Error");
					return;
				}
				
				for(var i = 0;i < selectedIndices.length; i++){
					var selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
					 
					    oUpdateData = {};
						oUpdateData.CYCLE = selectedObject.CYCLE;
						oUpdateData.PRODUCT_GROUP = selectedObject.PRODUCT_GROUP;
						oUpdateData.BRAND = selectedObject.BRAND;
						oUpdateData.PLANT = selectedObject.PLANT;
						oUpdateData.GEO = selectedObject.GEO;
						oUpdateData.FAMILY = selectedObject.FAMILY;
						oUpdateData.MACHINETYPE = selectedObject.MACHINETYPE;
						temp.push(oUpdateData);
					
				}//
				
			      temp.sort("PRODUCT_GROUP","BRAND","PLANT","GEO","FAMILY","MACHINETYPE");
				    for(i = 0; i < temp.length; i++) {
				    	if(temp[i+1] != undefined){
				    		if( temp[i].PRODUCT_GROUP == temp[i+1].PRODUCT_GROUP && temp[i].BRAND == temp[i+1].BRAND
				    				&& temp[i].PLANT == temp[i+1].PLANT && temp[i].GEO == temp[i+1].GEO
				    				&& temp[i].FAMILY == temp[i+1].FAMILY && temp[i].MACHINETYPE == temp[i+1].MACHINETYPE ) {
				    			continue;
				    		}
				    	}
				    	oData[oData.length]=temp[i];
				    }
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();
				
				var obj = {
					"data":oData
				};
				table.setBusy(true);
				$.ajax({
					url: logicServiceUrl+ "/ui_delete_xoutfrRate_batch.xsjs",
					type: "POST",
					data: JSON.stringify(obj),
					dataType: "text",
					contentType: "application/json",
					success: function(data){
						lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete", "SUCCESS", "Delete");
						var oModel = table.getModel();
						table.setBusy(false);
						
						table.clearSelection();
						oModel.refresh(true);
						lenovo.control.commontable.Toolkit.refreshDropdownbox();
					},
					error: function(err){
						err = err && err.responseText ;
						table.setBusy(false);
						if(!(typeof err === "string"))
							err = JSON.stringify(err);
						lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Delete");	
					}
				});
			}
		}, "Confirm");
		
	},
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CYCLE", label: "Cycle", type:"TextField", width: "100px"
		},
		{
			field: "PRODUCT_GROUP", label: "Product Group", type:"TextField", width: "100px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width: "100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "100px"
		},{
			field: "GEO_TYPE", label: "Geo Type", type:"TextField", width:"100px"
		},{
			field: "GEO", label: "Geo Code", type:"TextField", width: "100px"
		},{
			field: "FAMILY", label: "Product Family", type:"TextField", width: "100px"
		},{
			field: "MACHINETYPE", label: "Machine Type", type:"TextField", width: "100px"
		},{
			field: "FREIGHT_TYPE", label: "Freight Type", type:"TextField", width: "100px"
		},{
			field: "GL_PERCENTAGE", label: "GL Percentage", type:"TextField", width: "100px"
		},{
			field: "M1", label: "Unit Cost", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE_CHAR", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		
		
		/******Copy_Change_Start*******/
		//filter
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_XOUTFR_RATE_SEARCH_PLANT_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}	
					
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json"
				}	
					
			}
		},{
			field: "GEO_TYPE", label: "Geo Type", type: "DropdownBox",
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'GEO_TYPE'&$format=json"
				}	
					
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownTable",
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
	
		dropdowntable: {
			//defaultFilterOp: "EQ",
			//url: oServiceUrl,
			//bindRowUrl: "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json",
			defaultFilterOp: "EQ",
			url: oServiceUrl,
//			selectionMode: sap.ui.table.SelectionMode.Single,
			field: "ITEM_VALUE",	
			columns: [{
				label: "Family",
				field: "ITEM_VALUE",
				type: "TextField"
			}],
			notRefreshTable: true,
			filters: [[{
				field: "ITEM_VALUE",
				label: "Family",
				type: "MultiTextField"
			}]],
			_search: {
				func: this.reloadSearchFamilyDropdownTable,
				context: this
			},
			reload: {
				func: this.reloadFamilyDropdownTable,
				context: this
			}
		}
			
		},{
			field: "GEO", label: "Geo Code", type: "DropdownTable",
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),

		dropdowntable: {
			//defaultFilterOp: "EQ",
			//url: oServiceUrl,
			//bindRowUrl:  "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'GEO_CODE'&$format=json",
			defaultFilterOp: "EQ",
			url: oServiceUrl,
//			selectionMode: sap.ui.table.SelectionMode.Single,
			field: "ITEM_VALUE",	
			columns: [{
				label: "Geo Code",
				field: "ITEM_VALUE",
				type: "TextField"
			}],
			notRefreshTable: true,
			filters: [[{
				field: "ITEM_VALUE",
				label: "Geo Code",
				type: "MultiTextField"
			}]],
			_search: {
				func: this.reloadSearchGeoDropdownTable,
				context: this
			},
			reload: {
				func: this.reloadGeoDropdownTable,
				context: this
			}
		}
		},{
			field: "MACHINETYPE", label: "Machine Type", type: "DropdownTable",
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
		dropdowntable: {
			//id:"MACHINETYPE",
			//defaultFilterOp: "EQ",
			//url: oServiceUrl,
			//bindRowUrl: "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'MACHINETYPE'&$format=json",
			defaultFilterOp: "EQ",
			url: oServiceUrl,
//			selectionMode: sap.ui.table.SelectionMode.Single,
			field: "ITEM_VALUE",	
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
				func: this.reloadSearchMachineDropdownTable,
				context: this
			},
			reload: {
				func: this.reloadMachineDropdownTable,
				context: this
			}
		}
		},{
			field: "FREIGHT_TYPE", label: "Freight Type",type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'FREIGHT_TYPE'&$format=json"
				}	
					
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//create view - Default cascade Subgeo and Country
		//var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//create
		/*config.insertRaw=[{
			field: "RATIO_CODE", 
			label: "Ratio Code", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				
				odata:{
					url: oServiceUrl +"/UI_ADDITIONAL_COST_CREATE?$filter=ITEM_TYPE eq 'RATIO_CODE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "SUBGEO", 
			label: "Subgeo", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultSugeo //changed by Chris Gao 2015-09-23
//				odata:{
//					url: oServiceUrl +"/UI_ADDITIONAL_COST_CREATE?$filter=ITEM_TYPE eq 'SUBGEO' &$format=json",
//					bindTextField:"ITEM_VALUE",
//					bindKeyField:"ITEM_VALUE"
//				}
			}
		},{
			field: "COUNTRY", 
			label: "Country", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultCountry,			
			}
		},{
			field: "TBA_TYPE", 
			label: "TBA Type", 
			type: "DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_ADDITIONAL_COST_CREATE?$filter=ITEM_TYPE eq 'TBA_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "ADDITIONAL_COST", 
			label: "Additional Cost", 
			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
				//validType: /^\d{0,11}(\.\d{0,})?$/,//validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
			
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_ADDITIONAL_COST";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT"
		};*/
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//edit
		config.editRaw = [
		    {
			field: "GL_PERCENTAGE", 
		    label: "GL Percentage",
		    validation: [{
		    	validType: /^\d{0,11}(\.\d{0,4})?$/,
		    	errMsg: "The data type of this field is Decimal(15,4)!"		    		
			},{
		    	validType: /^100(\.0*)?$|^0*$|^[0-9]?[0-9]?(\.[0-9]*)?$/,
		    	errMsg: "The data must between 0 and 100!"
		    		
			}]
		},
			{
	  			field: "M1", 
	  			label: "Unit Cost",
	  			validation: [{
			    	validType: /^\d{0,11}(\.\d{0,4})?$/,
					errMsg: "The data type of this field is Decimal(15,4)!"
				}]

			}];
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_xoutfr_rate/CV_UI_XOUTFR_RATE"'
			+ '&sortColumn=CYCLE%20,BRAND%20,PLANT%20,GEO_TYPE%20,GEO%20,FAMILY%20,MACHINETYPE%20,LEVEL%20&sortOrder=asc';
		config.download.columns=[
			 "CYCLE","BRAND","PLANT","GEO_TYPE","GEO","FAMILY","MACHINETYPE","FREIGHT_TYPE","GL_PERCENTAGE_S","M1"];
		config.download.filename= "UI_XOUTFR_RATE";
		config.download.url = "/cdp/common/services/getFileWithHeaderMapping.xsjs";
		config.download.mappingTableHeader = {GL_PERCENTAGE_S:"GL_PERCENTAGE",M1:"UNIT_COST"};
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_xoutfr_rate.xsjs",
			excelUrl: "cfe/economicAdder/xoutfr_rate.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_XOUTFR_RATE'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_XOUTFR_RATE_ERR_DETAIL?$format=json",
					columns: [[{
						label: "Cycle",
						field: "CYCLE",
						type:  "TextField"
					},{
						field: "BRAND",
						label: "Brand",
						type:  "TextField"
					},{
						field: "PLANT",
						label: "Plant",
						type:  "TextField"
					},{
						field: "GEO_TYPE",
						label: "Geo Type",
						type:  "TextField"
					},{
						field: "GEO",
						label: "Geo Code",
						type:  "TextField"
						
					},{
						field: "FAMILY",
						label: "Product Family",
						type:  "TextField"
					},{
						field: "MACHINETYPE",
						label: "Machine Type",
						type:  "TextField"
						
					},{
						field: "FREIGHT_TYPE",
						label: "Freight Type",
						type:  "TextField"
					},{
						field: "GL_PERCENTAGE",
						label: "GL Percentage",
						type:  "TextField"
					},{
						field: "UNIT_COST",
						label: "Unit Cost",
						type:  "TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_xoutfr_rate.xsjs"
					}
				}
			};
		
		
		/******Copy_Change_End*******/
		
		config.defaultSort = [{
			field: "CYCLE",
			bDescending: false
		},{
			field: "BRAND",
			bDescending: false
		},{
			field: "PLANT",
			bDescending: false
		},{
			field: "GEO_TYPE",
			bDescending: false
		},{
			field: "GEO",
			bDescending: false
		},{
			field: "FAMILY",
			bDescending: false
		},{
			field: "MACHINETYPE",
			bDescending: false
		},{
			field: "LEVEL",
			bDescending: false
		}];
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = auth.editable;
		config.deleteable.visible = false;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
	},
	
	/******Copy_Change_Start*******/
	//default Cascade Ratio Code, Subgeo and Country
	/*setDefaultCreateCascade: function(oServiceUrl){
		var defaultRatioCode = null, defaultSugeo = null, defaultCountry = null;
		var result = {defaultSugeo : "", defaultCountry : ""};
		$.ajax({
			url: oServiceUrl+"/UI_WARR_PCA_UPLIFT_CREATE_DDL?$filter=ITEM_TYPE eq 'RATIO_CODE' &$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
				{
					defaultRatioCode = data.d.results[0];
				}
					
			}		
		});
		if(defaultRatioCode !== null && defaultRatioCode.ITEM_VALUE !== undefined) {

			$.ajax({
				url: oServiceUrl + "/IN_RATIOCODE_C(input_ratiocode='" + defaultRatioCode.ITEM_VALUE + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaultSugeo = data.d.results[0];
				}
			});	
		}
		if(defaultSugeo !== null && defaultSugeo.ITEM_VALUE !== undefined) {

			$.ajax({
				url: oServiceUrl + "/INPUT_SUBGEO_C(input_subgeo='" + defaultSugeo.ITEM_VALUE + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaultCountry = data.d.results[0];
				}
			});	
		}
		
		
		if(defaultSugeo !== null && defaultSugeo.ITEM_VALUE !== undefined)
		{
			result.defaultSugeo = defaultSugeo.ITEM_VALUE;
		}
		else
		{
			result.defaultSugeo = "";
		}
		
		if(defaultCountry !== null && defaultCountry.ITEM_VALUE !== undefined)
		{
			result.defaultCountry = defaultCountry.ITEM_VALUE;
		}
		else
		{
			result.defaultCountry = "";
		}
		
		
		return result;
	},*/
	
	/******Copy_Change_End*******/
	
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "XOUTFR Rate") {
		/******Copy_Change_End*******/
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
	reloadSearchFamilyDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'FAMILY'"
			})];
		}
		var bindUrl = "/UI_XOUTFR_RATE_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadFamilyDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'FAMILY'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchMachineDropdownTable: function(filterModel, filterPanel, table){

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
			})];
		}
		var bindUrl = "/UI_XOUTFR_RATE_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadMachineDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'MACHINETYPE'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchGeoDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'GEO_CODE'"
			})];
		}
		var bindUrl = "/UI_XOUTFR_RATE_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadGeoDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_XOUTFR_RATE_SEARCH_DDL?$filter=ITEM_TYPE eq 'GEO_CODE'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
});