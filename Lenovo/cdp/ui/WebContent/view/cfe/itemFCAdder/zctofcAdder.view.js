/************************************
* Created by cuiyue3 at 2016-06-01
* Version 1.0 2016-06-01
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.itemFCAdder.zctofcAdder", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("zctofcAdder");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Item FC Adder", "CTO-FC Adder");
		/******Copy_Change_End*******/
		
		/******Add by Cuiyue start*******/
		config.bindRowUrl = "/INPUT_PERIOD_CTOFC_ADDER(IN_PERIOD='CURRENT')/Results";
		
		config.searchInputs = {
				hasInputPara: true,
				urlId : "/INPUT_PERIOD_CTOFC_ADDER",
				urlInputParas:[{item: "IN_PERIOD", value:"", bindFilterPath:"CYCLE"}]
			};
		
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
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
			//create: adder, TBA_TYPE cascade zhaodan1
			if(auth.createable){
				var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
			    var insertForm = insertDialog.getContent()[0];
			    var adder_Name = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Adder Name")[0];
			    var TBA_Type = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "TBA Type")[0];
			    var opts = {
			    		transform: function (data){
			    			
							return data.d.results;
						},
						url: function(selectedKey){
							selectedKey = selectedKey.replace('%','%25');
							return oServiceUrl+"/INPUT_TBA(INPUT_ADDER='"+selectedKey+"')/Results?$format=json"
						},
						bindTextField:"ITEM_VALUE",
						bindKeyField:"ITEM_VALUE",
						notAddFirstListItem:true
			    };
			    var createAdderValue = adder_Name.getValue();
			    opts.selectedKey = createAdderValue;
			    lenovo.control.commontable.Toolkit.reReloadDropdownBox(TBA_Type, opts);
				lenovo.control.commontable.Toolkit.relateDropDwonBox(adder_Name, TBA_Type, opts);	
			}
		}
		cycleDropdownBox.attachChange(function(config){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				//config.bindRowUrl = "/INPUT_PERIOD_CTOFC_ADDER(IN_PERIOD='CURRENT')/Results";
				
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
				//config.bindRowUrl = "/INPUT_PERIOD_CTOFC_ADDER(IN_PERIOD='HISTORY')/Results";
				
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
		config.download.table = function(filterModel){
					filterModel = JSON.parse(filterModel.getJSON());
					var cycle = filterModel.CYCLE.filterValue;
					if(cycle=='CURRENT'){
						var downloadPath = '"_SYS_BIC"."cdp.ebgcfe.models.ui_ctofc_adder/CV_UI_CTOFC_ADDER"'
							+'&modelIn="$$IN_PERIOD$$"=>\'CURRENT\'';
					}else{
						var downloadPath = '"_SYS_BIC"."cdp.ebgcfe.models.ui_ctofc_adder/CV_UI_CTOFC_ADDER"'
							+'&modelIn="$$IN_PERIOD$$"=>\'HISTORY\'';
					}
					return downloadPath;
				
				};
		
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
	
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		var labelArr={
				"M1": "M1",
				"M2": "M2",
				"M3": "M3",
				"M4": "M4",
				"M5": "M5",
				"M6": "M6",
				"M7": "M7",
				"M8": "M8",
				"M9": "M9",
				"M10": "M10",
				"M11": "M11",
				"M12": "M12",
				"M13": "M13",
				"M14": "M14",
				"M15": "M15",
				"M16": "M16",
				"M17": "M17",
				"M18": "M18"				
		};
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='CURRENT')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results;
				if(oResult.length>0){
					labelArr = data.d.results[0];
				}
			}
		});
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CYCLE", label: "Cycle", type:"TextField", width: "100px"
		},{
			field: "CTO", label: "CTO", type:"TextField", width: "100px"
		},{
			field: "FC", label: "FC", type:"TextField", width: "100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField", width: "100px"
		},{
			field: "SUBGEO", label: "Subgeo", type:"TextField", width:"100px"
		},{
			field: "ADDER_NAME", label: "Adder Name", type:"TextField", width: "100px"
		},{
			field: "COST_LEVEL", label: "Cost Level", type:"DropdownBox", width: "100px",
				dropdownbox : {
					odata:{
						defaultSelectAll:true,
						bindTextField: "ITEM_VALUE",
						bindKeyField: "ITEM_VALUE",
						url: oServiceUrl +"/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='COST_LEVEL')/Results?$format=json"
					}		
				}
		},{
			field: "TBA_TYPE", label: "TBA Type", type:"TextField", width: "100px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width:"100px"
		},{
			field: "M2", label: labelArr.M2, type:"TextField", width:"100px"
		},{
			field: "M3", label: labelArr.M3, type:"TextField", width:"100px"
		},{
			field: "M4", label: labelArr.M4, type:"TextField", width:"100px"
		},{
			field: "M5", label: labelArr.M5, type:"TextField", width:"100px"
		},{
			field: "M6", label: labelArr.M6, type:"TextField", width:"100px"
		},{
			field: "M7", label: labelArr.M7, type:"TextField", width:"100px"
		},{
			field: "M8", label: labelArr.M8, type:"TextField", width:"100px"
		},{
			field: "M9", label: labelArr.M9, type:"TextField", width:"100px"
		},{
			field: "M10", label: labelArr.M10, type:"TextField", width:"100px"
		},{
			field: "M11", label: labelArr.M11, type:"TextField", width:"100px"
		},{
			field: "M12", label: labelArr.M12, type:"TextField", width:"100px"
		},{
			field: "M13", label: labelArr.M13, type:"TextField", width:"100px"
		},{
			field: "M14", label: labelArr.M14, type:"TextField", width:"100px"
		},{
			field: "M15", label: labelArr.M15, type:"TextField", width:"100px"
		},{
			field: "M16", label: labelArr.M16, type:"TextField", width:"100px"
		},{
			field: "M17", label: labelArr.M17, type:"TextField", width:"100px"
		},{
			field: "M18", label: labelArr.M18, type:"TextField", width:"100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
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
					url: oServiceUrl +"/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "CTO", label: "CTO", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				field: "ITEM_VALUE",	
				columns: [{
					label: "CTO",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "CTO",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchCTODropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCTODropdownTable,
					context: this
				}
			}
			
		},{
			field: "FC", label: "FC", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				field: "ITEM_VALUE",	
				columns: [{
					label: "FC",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "FC",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchFCDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadFCDropdownTable,
					context: this
				}
			}
			
		},{
			field: "SUBGEO", label: "Subgeo", type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json"
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
					url: oServiceUrl +"/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}	
					
			}
		},{
			field: "ADDER_NAME", label: "Adder Name", type: "DropdownTable", 
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				field: "ITEM_VALUE",	
				columns: [{
					label: "Adder Name",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "Adder Name",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchAdderDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadAdderDropdownTable,
					context: this
				}
			}
		},{
			field: "TBA_TYPE", label: "TBA Type", type: "DropdownBox",
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'TBA_TYPE'&$format=json"
				}	
					
			}
		},{
			field: "COST_LEVEL", label: "Cost Level",type: "DropdownBox", 
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'COST_LEVEL'&$format=json"
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
		/*
		 		defaultFilterOp: "EQ",
				url: oServiceUrl,
				field: "ITEM_VALUE",	
				columns: [{
					label: "CTO",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "CTO",
					type: "MultiTextField"
				}]],
		 */
		//create
		config.insertRaw=[{
			field: "CTO", label: "CTO", type: "DropdownTable",required: true,
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "CTO",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "CTO",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "CTO",
					type: "MultiTextField"
				}]],

				_search: {
					func: this.reloadSearchCTODropdownTableC,
					context: this
				},
				reload: {
					func: this.reloadCTODropdownTableC,
					context: this
				}
			}
			
		},{
			field: "FC", label: "FC", type: "DropdownTable",required: true,
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "FC",
					field: "ITEM_VALUE"
				}],
				columns: [{
					label: "FC",
					field: "ITEM_VALUE",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "ITEM_VALUE",
					label: "FC",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchFCDropdownTableC,
					context: this
				},
				reload: {
					func: this.reloadFCDropdownTableC,
					context: this
				}
			}
			
		},{
			field: "SUBGEO", label: "Subgeo", type: "DropdownBox", required: true,
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='SUBGEO')/Results?$format=json"
				}	
					
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", required: true,
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='PLANT')/Results?$format=json"
				}	
					
			}
		},{
			field: "ADDER_NAME", label: "Adder Name", type: "DropdownBox", required: true,
//			labelLayout: new sap.ui.layout.GridData({span: "L2 M2 S2", linebreak: true}),
/*			validation: [{				
				validType: /^.{0,200}$/,
				errMsg: "The data must less than 200 char!"
			}]*/	
			dropdownbox : { //add zhaodan1
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='ADDER_NAME')/Results?$format=json"
				}	
					
			}
	
		},{
			field: "TBA_TYPE", label: "TBA Type", type: "DropdownBox",required: true, //zhaodan1
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='TBA_TYPE')/Results?$format=json"
				}	
					
			}
			
		},{
			field: "COST_LEVEL", label: "Cost level",type: "DropdownBox", required: true,
//			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			/*validation: [{
				validType: /^\d{0}[0-6]?$/,
				errMsg: "The data must between 0 and 6!"
			}]*/
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='COST_LEVEL')/Results?$format=json"
				}	
				
			}
					
		},{
			field: "M1", label: "M1", type:"TextField",required: true,
			validation: [{
				validType: /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M2", label: "M2", type:"TextField",required: true,
			validation: [{
				validType: /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M3", label: "M3", type:"TextField",required: true,
			validation: [{
				validType: /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M4", label: "M4", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M5", label: "M5", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M6", label: "M6", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M7", label: "M7", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M8", label: "M8", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M9", label: "M9", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M10", label: "M10", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M11", label: "M11", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M12", label: "M12", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M13", label: "M13", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M14", label: "M14", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M15", label: "M15", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M16", label: "M16", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M17", label: "M17", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M18", label: "M18", type:"TextField",required: true,
			validation: [{
				validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_CTOFC_ADDER_CURRENT";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT",
				//"ADDER_NAME" : ""
		};
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//edit
		config.editRaw = [
		                  
		    {
		    	field: "COST_LEVEL", label: "Cost Level"
		},{
			field: "M1", 
		    label: labelArr.M1,
		    validation: [{
		    	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M2", 
			label: labelArr.M2,
			validation: [{
			    validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M3", 
			label: labelArr.M3,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M4", 
			label: labelArr.M4,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M5", 
			label: labelArr.M5,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M6", 
			label: labelArr.M6,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M7", 
			label: labelArr.M7,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M8", 
			label: labelArr.M8,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M9", 
			label: labelArr.M9,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M10", 
			label: labelArr.M10,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M11", 
			label: labelArr.M11,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M12", 
			label: labelArr.M12,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M13", 
			label: labelArr.M13,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M14", 
			label: labelArr.M14,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M15", 
			label: labelArr.M15,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M16", 
			label: labelArr.M16,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M17", 
			label: labelArr.M17,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M18", 
			label: labelArr.M18,
			validation: [{
			   	validType:  /^(-)?\d{1,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_ctofc_adder/CV_UI_CTOFC_ADDER"'
			+'&modelIn="$$IN_PERIOD$$"=>\'CURRENT\'';
		config.download.columns=[
		     "CYCLE", "PRODUCT_GROUP", "CTO", "FC", "PLANT", "SUBGEO","ADDER_NAME","COST_LEVEL", "TBA_TYPE",
		     "M1", "M2", "M3", "M4", "M5", 
             "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18"];
		config.download.filename= "UI_CTOFC_ADDER";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_ctofc_adder.xsjs",
			excelUrl: "cfe/itemFCAdder/ctofc_adder.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_CTOFC_ADDER'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_CTOFC_ADDER_ERR_DETAIL?$format=json",
					columns: [[{
						label: "CTO",
						field: "CTO",
						type:  "TextField"
					},{
						field: "FC",
						label: "FC",
						type:  "TextField"
					},{
						field: "PLANT",
						label: "Plant",
						type:  "TextField"
					},{
						field: "SUBGEO",
						label: "Subgeo",
						type:  "TextField"
					},
					{
						field: "ADDER_NAME",
						label: "Adder Name",
						type:  "TextField"
					},{
						field: "COST_LEVEL",
						label: "Cost Level",
						type:  "TextField"
					},{
						field: "M1", label: "M1", type:"TextField"
					},{
						field: "M2", label: "M2", type:"TextField"
					},{
						field: "M3", label: "M3", type:"TextField"
					},{
						field: "M4", label: "M4", type:"TextField"
					},{
						field: "M5", label: "M5", type:"TextField"
					},{
						field: "M6", label: "M6", type:"TextField"
					}],[{
						field: "M7", label: "M7", type:"TextField"
					},{
						field: "M8", label: "M8", type:"TextField"
					},{
						field: "M9", label: "M9", type:"TextField"
					},{
						field: "M10", label: "M10", type:"TextField"
					},{
						field: "M11", label: "M11", type:"TextField"
					},{
						field: "M12", label: "M12", type:"TextField"
					},{
						field: "M13", label: "M13", type:"TextField"
					},{
						field: "M14", label: "M14", type:"TextField"
					},{
						field: "M15", label: "M15", type:"TextField"
					},{
						field: "M16", label: "M16", type:"TextField"
					},{
						field: "M17", label: "M17", type:"TextField"
					},{
						field: "M18", label: "M18", type:"TextField"
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_ctofc_adder.xsjs"
					}
				}
			};
		
		
		/******Copy_Change_End*******/
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
	
	/******Copy_Change_Start*******/
	
	/******Copy_Change_End*******/
	
	reloadSearchCTODropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'CTO'"
			})];
		}
		var bindUrl = "/UI_CTOFC_ADDER_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadCTODropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'CTO'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchFCDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'FC'"
			})];
		}
		var bindUrl = "/UI_CTOFC_ADDER_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadFCDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'FC'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchAdderDropdownTable: function(filterModel, filterPanel, table){

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
                value1: "'ADDER_NAME'"
			})];
		}
		var bindUrl = "/UI_CTOFC_ADDER_SEARCH_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadAdderDropdownTable: function(dropdownTable){
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
		var bindUrl = "/UI_CTOFC_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'ADDER_NAME'&$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchCTODropdownTableC: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			/*new sap.ui.model.Filter({
				path: "INPUT_TYPE",
                operator: "EQ",
                value1: "'CTO'"
			})*/];
		}
		var bindUrl = "/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='CTO')/Results?$format=json";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadCTODropdownTableC: function(dropdownTable){
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
		var bindUrl = "/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='CTO')/Results?$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchFCDropdownTableC: function(filterModel, filterPanel, table){

		var filter = filterModel.getProperty("/ITEM_VALUE");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = [new sap.ui.model.Filter({
				path: "ITEM_VALUE",
				operator: filter.filterOperator,
				value1: "'" + filter.filterValue + "'"
			}),
			/*new sap.ui.model.Filter({
				path: "INPUT_TYPE",
                operator: "EQ",
                value1: "'FC'"
			})*/];
		}
		var bindUrl = "/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='FC')/Results?$format=json";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadFCDropdownTableC: function(dropdownTable){
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
		var bindUrl = "/INPUT_CTOFC_ADDER_C_DDL(INPUT_TYPE='FC')/Results?$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},

	//default Cascade Brand Family
	/*setDefaultCreateCascade: function(oServiceUrl){
		
		var defaultBrand = null, defaultFamily = null;
		$.ajax({
			url: oServiceUrl+"/CREATE_BRAND_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultBrand = data.d.results[0].ITEM_VALUE;
			}		
		});
		if(defaultBrand !== null) {

			$.ajax({
				url: oServiceUrl + "/INPUT_BRAND5(INPUT_BRAND='" + defaultBrand + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaultFamily = data.d.results[0].ITEM_VALUE;
				}
			});	
		}
		return {
			defaultBrand: defaultBrand,
			defaultFamily: defaultFamily
		};
	},*/
});