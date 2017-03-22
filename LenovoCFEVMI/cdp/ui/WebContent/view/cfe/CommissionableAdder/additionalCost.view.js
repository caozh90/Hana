/************************************
* Created by Chris Gao at 2015-8-12
* Version 1.0 2015-08-12
* Upgraded by Chris Gao as Requirements Changed
* Version 2.0 2015-09-22
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.CommissionableAdder.additionalCost", { 
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
		var auth = lenovo.control.commontable.Table.getViewAuth("additionalCost");
		/******Copy_Change_End*******/

		//generate UI
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);   //call private function -- ui_view configuration
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("CommissionableAdder", "Additional Cost");
		/******Copy_Change_End*******/
		
		//set data connection
		/******Copy_Change_Start*******/
		config.bindRowUrl = "/UI_ADDITIONAL_COST";
		/******Copy_Change_End*******/
		
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		//filter panel
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);
		//tool bar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);
		//authorization buttons
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
		
		/***********************************
		 * CYCLE != CURRENT edit,delete unvisible
		 * Added by Chris Gao
		 * 2015-09-08
		 **********************************/
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
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
		
		/***********************************
		 * End by Chris Gao
		 * 2015-09-08
		 **********************************/
		
		/******Copy_Change_Start*******/
		//filter: Subgeo, Country cascade
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Subgeo")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_SUBGEO(IN_SUBGEO='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		
		//create: Subgeo, Country cascade
		if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var ratioCodeDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Ratio Code")[0];
		    var subgeoDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Subgeo")[0];
		    var countryDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Country")[0];
		    var opts = {
		    		transform: function (data){
						return data.d.results;
					},
					url: function(selectedKey){
						return oServiceUrl+"/IN_RATIOCODE_C(input_ratiocode='" + selectedKey + "')/Results?$format=json";
					},
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE",
					notAddFirstListItem: true,//modified by Chris Gao 2015-09-22
					 
		    };
		    var opts1 = {
		    		transform: function (data){
						return data.d.results;
					},
					url: function(selectedKey){
						return oServiceUrl+"/INPUT_SUBGEO_C(input_subgeo='" + selectedKey + "')/Results?$format=json";
					},
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE",
//					notAddFirstListItem: true,
					notAddFirstListItem:false, //modified by Chris Gao 2015-08-25 for CFE changed request 7.1,7.2,7.3 default dropdownbox value of "ALL"
					firstItemDefaultValue:"ALL" //modified by Chris Gao 2015-08-25 for CFE changed request 7.1,7.2,7.3 default dropdownbox value of "ALL"
		    };
		    var createRatioCodeValue = ratioCodeDropdownBox.getValue();
		    opts.selectedKey = createRatioCodeValue;
		    lenovo.control.commontable.Toolkit.reReloadDropdownBox(subgeoDropdownBox, opts);
			lenovo.control.commontable.Toolkit.relateDropDwonBox(ratioCodeDropdownBox, subgeoDropdownBox, opts);	
			
			var createSubgeoValue = subgeoDropdownBox.getValue();
		    opts1.selectedKey = createSubgeoValue;
		    lenovo.control.commontable.Toolkit.reReloadDropdownBox(countryDropdownBox, opts1);
			lenovo.control.commontable.Toolkit.relateDropDwonBox(subgeoDropdownBox, countryDropdownBox, opts1);	
			
			//close to reload
			
			insertDialog.attachClosed(function(){
				opts.selectedKey = createRatioCodeValue;
			    lenovo.control.commontable.Toolkit.reReloadDropdownBox(subgeoDropdownBox, opts);
				lenovo.control.commontable.Toolkit.relateDropDwonBox(ratioCodeDropdownBox, subgeoDropdownBox, opts);	
				opts1.selectedKey = createSubgeoValue;
			    lenovo.control.commontable.Toolkit.reReloadDropdownBox(countryDropdownBox, opts1);
				lenovo.control.commontable.Toolkit.relateDropDwonBox(subgeoDropdownBox, countryDropdownBox, opts1);	
			});
		}
		/******Copy_Change_End*******/
		
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table] //header, filterPanel, oEditDeleteUploadDownload, table             
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
	
	//private function -- ui_view columns configuration
	setConfig: function(config, oServiceUrl, uServiceUrl, auth) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "RATIO_CODE", label: "Ratio Code", type:"TextField", width: "100px"
		},{
			field: "SUBGEO", label: "Subgeo", type:"TextField", width: "100px"
		},{
			field: "COUNTRY", label: "Country", type:"TextField", width: "100px"
		},{
			field: "TBA_TYPE", label: "TBA Type", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_ADDITIONAL_COST_CREATE?$filter=ITEM_TYPE eq 'TBA_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}				
			},width:"100px"
		},{
			field: "ADDITIONAL_COST", label: "Additional Cost", type:"TextField", width: "100px"
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
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_ADDITIONAL_COST_SEARCH?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
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
					url: oServiceUrl +"/UI_ADDITIONAL_COST_SEARCH?$filter=ITEM_TYPE eq 'RATIO_CODE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "SUBGEO", label: "Subgeo", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_ADDITIONAL_COST_SEARCH?$filter=ITEM_TYPE eq 'SUBGEO' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				data:[{
					"text": lenovo.control.Constants.allDropdownBoxListItem, 
					"key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "TBA_TYPE", label: "TBA Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_ADDITIONAL_COST_SEARCH?$filter=ITEM_TYPE eq 'TBA_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//create view - Default cascade Subgeo and Country
		var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//create
		config.insertRaw=[{
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
		};
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//edit
		config.editRaw = [
//		    {
//				field: "TBA_TYPE", 
//				label: "TBA Type"
//			
//			},
			{
	  			field: "ADDITIONAL_COST", 
	  			label: "Additional Cost",
	  			validation: [{
	  				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
	  				//validType: /^\d{0,11}(\.\d{0,})?$/,//validType: /^\d{0,11}(\.\d{0,4})?$/,
	  				errMsg: "The data type of this field is Float (11,n)!"
	  			}]
//  			validation: [{
//  			    validType: /^[0-9]*$/,
//  				errMsg: "The date type of this field is Integer!"
//  			}]
			}];
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_additional_cost/CV_UI_ADDITIONAL_COST"';
		config.download.columns=[
			 "CYCLE","RATIO_CODE","SUBGEO","COUNTRY","TBA_TYPE","ADDITIONAL_COST"];
		config.download.filename= "UI_ADDITIONAL_COST";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_additionalcost.xsjs",
			excelUrl: "cfe/CommissionableAdder/additional_cost.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_ADDITIONAL_COST'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_ADDITIONAL_COST_ERR_DETAIL?$format=json",
					columns: [[{
						field: "CYCLE",
						label: "Cycle",
						type:  "TextField"
					},{
						field: "RATIO_CODE",
						label: "Ratio Code",
						type:  "TextField"
					},{
						field: "SUBGEO",
						label: "Subgeo",
						type:  "TextField"
					},{
						field: "COUNTRY",
						label: "Country",
						type:  "TextField"
						
					},{
						field: "TBA_TYPE",
						label: "TBA Type",
						type:  "TextField"
					},{
						field: "ADDITIONAL_COST",
						label: "Additional Cost",
						type:  "TextField"
						
					}]],
					resubmit: {
						url: uServiceUrl + "/ui_additionalcost.xsjs"
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
	//default Cascade Ratio Code, Subgeo and Country
	setDefaultCreateCascade: function(oServiceUrl){
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
	},
	/******Copy_Change_End*******/
	
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "Additional Cost") {
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
	}
});