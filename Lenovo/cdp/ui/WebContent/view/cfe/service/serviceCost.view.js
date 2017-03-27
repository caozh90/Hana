/************************************
* Created by Billy Qiao at 2015-9-7
* Modified by Billy Qiao at 2015-9-7
* Version 1.0
*************************************/

jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");


sap.ui.jsview("lenovo.view.cfe.service.serviceCost",{
	
	
/*createContent function*/
	createContent : function() {
		//app
		var app = new sap.m.App(); 
		
		//Page Header
		var header = new lenovo.control.commontable.Table.createHeader("Service", "ServiceCost");
		
		//oModel
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();
		
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		
		var auth = lenovo.control.commontable.Table.getViewAuth("serviceCost");
		
		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		
		config.bindRowUrl = "/UI_SERVICE_COST";
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
		this._cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		
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
					editButton.setVisible(auth.editable);
				}
				if(deleteButton){
					deleteButton.setVisible(auth.deleteable);
				}
				if(auth.uploadable){
					uploadButton.setVisible(auth.uploadable);
					uploadTemButton.setVisible(auth.uploadable);
					viewStatusButton.setVisible(auth.uploadable);
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
		
		
		/******Copy_Change_Start*******/
		
		
		/*
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
		*/
		
		
		//create: Subgeo, Country cascade
		/*if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var brandDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Subgeo")[0];
		    var prodFamilyDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Country")[0];
		    var opts = {
		    		transform: function (data){
						return data.d.results;
					},
					url: function(selectedKey){
						return oServiceUrl+"/IN_SUBGEO_C(IN_SUBGEO_C='" + selectedKey + "')/Results?$format=json";
					},
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE",
					notAddFirstListItem:false, 
		    };
		    var createBrandValue = brandDropdownBox2.getValue();
		    opts.selectedKey = createBrandValue;
		    lenovo.control.commontable.Toolkit.reReloadDropdownBox(prodFamilyDropdownBox2, opts);
			lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox2, prodFamilyDropdownBox2, opts);	
		}*/
		//******Copy_Change_End*******//*
		//app
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header,filterPanel,oEditDeleteUploadDownload,table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	
/*Functions*/
	
	setConfig : function(config, oServiceUrl, uServiceUrl, auth){
		//table		
		config.columns = [
		    {field: "MODEL", label: "Model", type:"TextField", width: "150px"},
		    {field: "BRAND", label: "Brand", type:"TextField", width: "150px"},
		    {field: "SUBGEO", label: "Subgeo", type:"TextField", width: "150px"},
		    {field: "COUNTRY", label: "Country", type:"TextField", width: "150px"},
		    {field: "M1", label: "M1", type:"TextField", width: "100px"},
		    {field: "M2", label: "M2", type:"TextField", width: "100px"},
		    {field: "M3", label: "M3", type:"TextField", width: "100px"},
		    {field: "M4", label: "M4", type:"TextField", width: "100px"},
		    {field: "M5", label: "M5", type:"TextField", width: "100px"},
		    {field: "M6", label: "M6", type:"TextField", width: "100px"},
		    {field: "M7", label: "M7", type:"TextField", width: "100px"},
		    {field: "M8", label: "M8", type:"TextField", width: "100px"},
		    {field: "M9", label: "M9", type:"TextField", width: "100px"},
		    {field: "M10", label: "M10", type:"TextField", width: "100px"},
		    {field: "M11", label: "M11", type:"TextField", width: "100px"},
		    {field: "M12", label: "M12", type:"TextField", width: "100px"},
		    {field: "M13", label: "M13", type:"TextField", width: "100px"},
		    {field: "M14", label: "M14", type:"TextField", width: "100px"},
		    {field: "M15", label: "M15", type:"TextField", width: "100px"},
		    {field: "M16", label: "M16", type:"TextField", width: "100px"},
		    {field: "M17", label: "M17", type:"TextField", width: "100px"},
		    {field: "M18", label: "M18", type:"TextField", width: "100px"},
		    {field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "150px"},
		    {field: "SYS_LAST_MODIFIED_DATE_CHAR", label: "Last Modified Date", type:"TextField", width: "150px"}		    
		];
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);

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
					url: oServiceUrl +"/UI_SERVICE_COST_SEARCH?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
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
					url: oServiceUrl +"/UI_SERVICE_COST_SEARCH?$filter=ITEM_TYPE eq 'BRAND' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "MODEL", label: "Model", type: "TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
/*			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_SERVICE_COST_SEARCH?$filter=ITEM_TYPE eq 'MODEL' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}*/
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),

				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_SERVICE_COST_SEARCH?$filter=ITEM_TYPE eq 'COUNTRY' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		
		//create	
		/*var defaultInsertValue = this.setCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "MODEL", 
			label: "Model", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				//defaultValue: defaultInsertValue.defaultBrand,
				odata:{
					url: oServiceUrl +"/UI_SERVICE_COST_CREATE?$filter=ITEM_TYPE eq 'MODEL' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "BRAND", 
			label: "Brand", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				//defaultValue: defaultInsertValue.defaultBrand,
				odata:{
					url: oServiceUrl +"/UI_SERVICE_COST_CREATE?$filter=ITEM_TYPE eq 'BRAND' &$format=json",
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
				defaultValue: defaultInsertValue.defaultSubgeo,
				odata:{
					url: oServiceUrl +"/UI_SERVICE_COST_CREATE?$filter=ITEM_TYPE eq 'SUBGEO' &$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
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
				//defaultValue: defaultInsertValue.defaultCountry,
			}
		},
		{field: "M1",label: "M1",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M2",label: "M2",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M3",label: "M3",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M4",label: "M4",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M5",label: "M5",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M6",label: "M6",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M7",label: "M7",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M8",label: "M8",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M9",label: "M9",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M10",label: "M10",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M11",label: "M11",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M12",label: "M12",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M13",label: "M13",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M14",label: "M14",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M15",label: "M15",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M16",label: "M16",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M17",label: "M17",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},
		{field: "M18",label: "M18",type:"TextField",required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			},{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}
		];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_SERVICE_COST";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT"
		};
		config.create.caninitialnull = true;*/
		
		//edit		
		config.editRaw = [
			{field: "M1", label: "M1",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M2", label: "M2",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M3", label: "M3",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M4", label: "M4",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M5", label: "M5",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M6", label: "M6",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M7", label: "M7",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M8", label: "M8",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M9", label: "M9",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M10", label: "M10",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M11", label: "M11",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M12", label: "M12",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M13", label: "M13",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M14", label: "M14",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M15", label: "M15",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M16", label: "M16",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M17", label: "M17",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    },
			{field: "M18", label: "M18",required: true,required: true,
		    	validation: [{
					validType: lenovo.control.Validation.require,
					errMsg: "Required!"
				},{
					validType: /^\d{0,11}(\.\d{0,})?$/,
					errMsg: "The data type of this field is Float (11,n)!"
				}]
		    }
		];
		
		
		//download
		config.download.url = "/cdp/common/services/getFileOfNoSymbol.xsjs";
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_service_cost/CV_UI_SERVICE_COST"';
		config.download.columns=[
			 "MODEL","BRAND","COUNTRY",
			 "M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","M13","M14","M15","M16","M17","M18"];
		config.download.filename= "UI_SERVICE_COST";
		
		
		//upload
		config.upload = {
				url: uServiceUrl + "/ui_service_cost.xsjs",
				excelUrl: "cfe/service/ui_service_cost.xlsx"
			};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_SERVICECOST'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_SERVICE_COST_ERR_DETAIL?$format=json",
				fixHeight: "600px",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Product Group",
					field: "PRODUCT_GROUP",
					type:  "TextField"
				},{
					label: "Model",
					field: "MODEL",
					type:  "TextField"
				},{
					label: "Brand",
					field: "BRAND",
					type:  "TextField"
				},{
					label: "Subgeo",
					field: "SUBGEO",
					type:  "TextField"
				},{
					label: "Country",
					field: "COUNTRY",
					type:  "TextField"
				},
				{label: "M1",field: "M1",type:  "TextField"},
				{label: "M2",field: "M2",type:  "TextField"},
				{label: "M3",field: "M3",type:  "TextField"},
				{label: "M4",field: "M4",type:  "TextField"},
				{label: "M5",field: "M5",type:  "TextField"},
				{label: "M6",field: "M6",type:  "TextField"},
				{label: "M7",field: "M7",type:  "TextField"},
				{label: "M8",field: "M8",type:  "TextField"},
				{label: "M9",field: "M9",type:  "TextField"},
				{label: "M10",field: "M10",type:  "TextField"},
				{label: "M11",field: "M11",type:  "TextField"},
				{label: "M12",field: "M12",type:  "TextField"},
				{label: "M13",field: "M13",type:  "TextField"},
				{label: "M14",field: "M14",type:  "TextField"},
				{label: "M15",field: "M15",type:  "TextField"},
				{label: "M16",field: "M16",type:  "TextField"},
				{label: "M17",field: "M17",type:  "TextField"},
				{label: "M18",field: "M18",type:  "TextField"}
				]],
				resubmit: {
					url: uServiceUrl + "/ui_service_cost.xsjs"
				}
			}
		};
		
		//toolbar , auth
		config.create.visible = false;
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.upload.visible = auth.uploadable;
		config.viewstatus.visible = auth.uploadable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
		config.upload.roleName =  auth.uploadableRoleName;
		
	},
	
	

	/*setCreateCascade: function(oServiceUrl){
		var defaultSubgeo = null, defaultCountry = null;
		$.ajax({
			url: oServiceUrl+"/UI_SERVICE_COST_CREATE?$filter=ITEM_TYPE eq 'SUBGEO' &$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultSubgeo = data.d.results[0].SUBGEO;
			}		
		});
		if(defaultSubgeo !== null) {

			$.ajax({
				url: oServiceUrl + "/IN_SUBGEO_C(IN_SUBGEO_C='" + defaultSubgeo + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaultCountry = data.d.results[0].COUNTRY;
				}
			});	
		}
		return {
			defaultSubgeo: defaultSubgeo,
			defaultCountry: defaultCountry
		};
	},
	*/
	
});
