/************************************
* Created by Chris Gao at 2015-8-10
* Version 1.0 2015-08-10
* Upgraded by Chris Gao at 2015-09-22
* Version 2.0 changed requirements
************************************/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");


sap.ui.jsview("lenovo.view.cfe.CommissionableAdder.baseWarrPcaUplift", {
	
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
				url: oServiceUrl + "/INPUT_RATIOCODE_C(input_ratiocode='" + defaultRatioCode.ITEM_VALUE + "')/Results?$format=json",
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
	//columns
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
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
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_CREATE_DDL?$filter=ITEM_TYPE eq 'TBA_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}				
			},width:"100px"
		},{
			field: "BASE_WARR", label: "Base Warranty", type:"TextField", width: "100px"
		},{
			field: "PCA", label: "PCA", type:"TextField", width: "100px"
		},{
			field: "UPLIFT", label: "UPLIFT", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter 
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
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
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_SEARCH_DDL?$filter=ITEM_TYPE eq 'RATIO_CODE' &$format=json",
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
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_SEARCH_DDL?$filter=ITEM_TYPE eq 'SUBGEO' &$format=json",
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
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_SEARCH_DDL?$filter=ITEM_TYPE eq 'TBA_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		//create
		//create view - cascade Ratio code and Subgeo and Country
		var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
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
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_CREATE_DDL?$filter=ITEM_TYPE eq 'RATIO_CODE' &$format=json",
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
				defaultValue: defaultInsertValue.defaultSugeo
			}
		},{
			field: "COUNTRY", 
			label: "Country", 
			type:"DropdownBox",
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultCountry	
				
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
					url: oServiceUrl +"/UI_WARR_PCA_UPLIFT_CREATE_DDL?$filter=ITEM_TYPE eq 'TBA_TYPE' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "BASE_WARR", 
			label: "Base Warranty", 
			type:"TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
				//validType: /^\d{0,11}(\.\d{0,})?$/, //validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
			
		},{
			field: "PCA", 
			label: "PCA", 
			required: true,
			type:"TextField",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
				//validType: /^\d{0,11}(\.\d{0,})?$/, //validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
			
		},{
			field: "UPLIFT", 
			label: "UPLIFT", 
			required: true,
			type:"TextField",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
				//validType: /^\d{0,11}(\.\d{0,})?$/, //validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The data type of this field is Float (11,n)!"
			}]
			
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_WARR_PCA_UPLIFT";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT"
		};
		
		//edit		
		config.editRaw = [
//		                  	{
//								field: "TBA_TYPE", 
//								label: "TBA Type"
//								
//							},
							{
			          			field: "BASE_WARR", 
			          			label: "Base Warranty",
			          			validation: [{
			          				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
			          				//validType: /^\d{0,11}(\.\d{0,})?$/, //validType: /^\d{0,11}(\.\d{0,4})?$/,
			          				errMsg: "The data type of this field is Float (11,n)!"
			          			}]
		          			},
		          			{
			          			field: "PCA", 
			          			label: "PCA",
			          			validation: [{
			          				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
			          				//validType: /^\d{0,11}(\.\d{0,})?$/, //validType: /^\d{0,11}(\.\d{0,4})?$/,
			          				errMsg: "The data type of this field is Float (11,n)!"
			          			}]
		          			},
		          			{
			          			field: "UPLIFT", 
			          			label: "UPLIFT",
			          			validation: [{
			          				validType: /^[-+]?\d{0,11}(\.\d{0,})?$/, //enable -,+
			          				//validType: /^\d{0,11}(\.\d{0,})?$/, //validType: /^\d{0,11}(\.\d{0,4})?$/,
			          				errMsg: "The data type of this field is Float (11,n)!"
			          			}]
		          			}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_warr_pca_uplift/CV_UI_WARR_PCA_UPLIFT"';
		config.download.columns=[
			 "CYCLE","RATIO_CODE","SUBGEO","COUNTRY","TBA_TYPE","BASE_WARR","PCA","UPLIFT"];
		config.download.filename= "UI_WARR_PCA_UPLIFT";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_warr_pca_uplift.xsjs",
			excelUrl: "cfe/CommissionableAdder/warr_pca_uplift.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_WARR_PCA_UPLIFT'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_WARR_PCA_UPLIFT_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Ratio Code",
					field: "RATIO_CODE",
					type:  "TextField"
				},{
					label: "Subgeo",
					field: "SUBGEO",
					type:  "TextField"
				},{
					label: "Country",
					field: "COUNTRY",
					type:  "TextField"
					
				},{
					label: "TBA Type",
					field: "TBA_TYPE",
					type:  "TextField"
				},{
					label: "Base Warranty",
					field: "BASE_WARR",
					type:  "TextField"
					
				},{
					label: "PCA",
					field: "PCA",
					type:  "TextField"
					
				},{
					label: "UPLIFT",
					field: "UPLIFT",
					type:  "TextField"
					
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_warr_pca_uplift.xsjs"
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
	
	createContent: function(){
		var app = new sap.m.App(); 
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		
		var auth = lenovo.control.commontable.Table.getViewAuth("baseWarrPcaUplift");
	
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("CommissionableAdder", "Base Warranty PCA Uplift");

		config.bindRowUrl = "/UI_WARR_PCA_UPLIFT";
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
		 
		//filter: Subgeo, Country cascade
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Subgeo")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_SUBGEO_S(input_subgeo='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		
		//create: Ratio Code, Subgeo, Country cascade
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
						return oServiceUrl+"/INPUT_RATIOCODE_C(input_ratiocode='" + selectedKey + "')/Results?$format=json";
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

		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Warr PCA Uplift") {
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
