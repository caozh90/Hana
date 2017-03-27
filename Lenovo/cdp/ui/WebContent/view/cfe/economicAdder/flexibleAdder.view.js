//Created by Zhang Ruixue at 2014-12-08
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.economicAdder.flexibleAdder", {
	setCreateCascade: function(oServiceUrl){
		var defaultAdderName = null, defaulttBAType = null, defaultBrand = null, defaultFamily = null;
		$.ajax({
			url: oServiceUrl+"/UI_FLEXIBLE_ADDER_CREATE_ADDER_NAME?$filter=ITEM_TYPE eq 'ADDER_NAME'&$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
					defaultAdderName = data.d.results[0].ITEM_VALUE;
			}		
		});
		if(defaultAdderName !== null) {
			var adderName = defaultAdderName.substring(defaultAdderName.length -1);
			$.ajax({
				url: oServiceUrl + "/INPUT_ADDER_CONF_TBA2(INPUT_ADDER_NAME='"+encodeURI(adderName)+"')/Results",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaulttBAType = data.d.results[0].ITEM_VALUE;
				}
			});	
		}
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
			defaultAdderName: defaultAdderName,
			defaulttBAType: defaulttBAType,
			defaultBrand: defaultBrand,
			defaultFamily: defaultFamily
		};
	},
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
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
		//table		
		config.columns = [{
			field: "ADDER_NAME", label: "Adder Name", type:"TextField",width:"100px"
		},{
			field: "BRAND", label: "Brand", type:"TextField",width:"100px"
		},{
			field: "FAMILY", label: "Family", type: "TextField",width:"100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "SUBGEO", label: "SUBGEO", type:"TextField",width:"100px"
		},{
			field: "ASSEMBLY", label: "Assembly", type:"TextField",width:"100px"
		},{
			field: "TBA_TYPE", label: "TBA_TYPE", type:"TextField",width:"100px"
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
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField",width:"200px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField",width:"200px"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(4);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_FLEXIBLE_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_FLEXIBLE_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}	
					
			}
		},{
			field: "SUBGEO", label: "SUBGEO", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_FLEXIBLE_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json"
				}	
					
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_FLEXIBLE_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json"
				}	
					
			}
		},{
			field: "FAMILY", label: "Family", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]			
			}
			
		},{
			field: "ASSEMBLY", label: "Assembly", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_FLEXIBLE_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'ASSEMBLY'&$format=json"
				}	
					
			}
		},{
			field: "ADDER_NAME", label: "Adder Name", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_FLEXIBLE_ADDER_SEARCH_DDL?$filter=ITEM_TYPE eq 'ADDER_NAME'&$format=json"
				}	
					
			}
		},{
			field: "TBA_TYPE", label: "TBA Type",type: "TextField",
			textfield: {
				enabled: false,
				defaultFilterOp: "EQ"
			}
			
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		
		//edit		
		config.editRaw = [{
			field: "M1", 
		    label: labelArr.M1,
		    validation: [{
		    	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M2", 
			label: labelArr.M2,
			validation: [{
			    validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M3", 
			label: labelArr.M3,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M4", 
			label: labelArr.M4,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M5", 
			label: labelArr.M5,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M6", 
			label: labelArr.M6,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M7", 
			label: labelArr.M7,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M8", 
			label: labelArr.M8,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M9", 
			label: labelArr.M9,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M10", 
			label: labelArr.M10,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M11", 
			label: labelArr.M11,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M12", 
			label: labelArr.M12,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M13", 
			label: labelArr.M13,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M14", 
			label: labelArr.M14,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M15", 
			label: labelArr.M15,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M16", 
			label: labelArr.M16,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M17", 
			label: labelArr.M17,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M18", 
			label: labelArr.M18,
			validation: [{
			   	validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_flexible_adder/CA_UI_FLEXIBLE_ADDER"';
		config.download.columns=[
		                         "CYCLE", "ADDER_NAME", "BRAND", "FAMILY", "PLANT", "SUBGEO", "ASSEMBLY",
		                         "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18"
		                         ];
		config.download.filename= "UI_FLEXIBLE_ADDER";
		
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_flexible_adder.xsjs",
			excelUrl: "cfe/economicAdder/flexible_adder.xlsx"
		};
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_FLEXIBLE_ADDER'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_FLEXIBLE_ADDER_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "Brand",
					field: "BRAND",
					type:  "TextField"
				},{
					label: "Product Family",
					field: "FAMILY",
					type:  "TextField"
				},{
					label: "Plant",
					field: "PLANT",
					type:  "TextField"
					
				},{
					label: "SUBGEO",
					field: "SUBGEO",
					type:  "TextField"
					
				},{
					label: "Assembly",
					field: "ASSEMBLY",
					type:  "TextField"
					
				},{
					label: "Adder Name",
					field: "ADDER_NAME",
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
				}],[{
					field: "M6", label: "M6", type:"TextField"
				},{
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
					url: uServiceUrl + "/ui_flexible_adder.xsjs"
				}
			}
		};
		
		//create	
		var defaultInsertValue = this.setCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "ADDER_NAME", label: "Adder Name", type: "DropdownBox", 
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultAdderName,
				odata: {
					url: oServiceUrl+"/UI_FLEXIBLE_ADDER_CREATE_ADDER_NAME?$filter=ITEM_TYPE eq 'ADDER_NAME'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "TBA_TYPE", label: "TBA Type",  type:"TextField",
			textfield: {
				enabled: false,
				defaultValue: defaultInsertValue.defaulttBAType
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultBrand,
				odata: {
					url: oServiceUrl+"/CREATE_BRAND_DDL?$filter=ITEM_TYPE eq 'BRAND'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "FAMILY", label: "Family", type:"DropdownBox",
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultFamily,			
			}
		},{
			field: "PLANT", label: "Plant",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_ECONOMIC_ADDER_CREATE_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "SUBGEO", label: "SUBGEO", type:"TextField", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					url: oServiceUrl+"/UI_ECONOMIC_ADDER_CREATE_DDL?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "ASSEMBLY", label: "Assembly", type:"TextField", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Assembly is required!"
			}]
		},{
			field: "M1", label: "M1", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M2", label: "M2", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M3", label: "M3", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M4", label: "M4", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M5", label: "M5", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M6", label: "M6", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M7", label: "M7", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M8", label: "M8", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M9", label: "M9", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M10", label: "M10", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M11", label: "M11", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M12", label: "M12", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M13", label: "M13", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M14", label: "M14", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M15", label: "M15", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M16", label: "M16", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M17", label: "M17", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M18", label: "M18", type:"TextField",
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_FLEXIBLE_ADDER";
		config.create.fakeData = {
				"CYCLE":"CURRENT",			
				"PRODUCT_GROUP":"EBG"	
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
	getTBAType: function(oServiceUrl,adderName,tBATypeTextField){
		var lastLetter = adderName.substring(adderName.length-1);
		$.ajax({
			url: oServiceUrl + "/INPUT_ADDER_CONF_TBA2(INPUT_ADDER_NAME='"+encodeURI(lastLetter)+"')/Results",
			type: "GET",
			dataType: "json", 
			success: function(data){
				if(data.d.results.length > 0){
					var value = data.d.results[0].ITEM_VALUE;
					tBATypeTextField.setValue(value);
				}				
			}
		});	
	},
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("flexibleAdder");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Ecomomic Adder", "Flexible Adder");

		config.bindRowUrl = "/UI_FLEXIBLE_ADDER";
		var table = lenovo.control.commontable.Table.createTable(config);
		/*********************************************************
		 * Added by Chris Gao - 2015-10-31
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the long waiting time of loading
		 *******************************************************/
		//oModel.setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
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
		
		searchBtn.attachPress(function(){			
			var selectedKey = cycleDropdownBox.getSelectedKey();
			$.ajax({
				url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='"+selectedKey+"')/Results?$format=json",
				type:"GET",
				dataType:"json",
				success: function(data){
					var oResult = data.d.results;
					if(oResult.length>0){
						var labelArr = oResult[0];
						var oColumns = table.getColumns();
						var oStartIndex = 7;
						for(var i=oStartIndex; i<oStartIndex+18; i++){
							var oAttName = "M"+(i-oStartIndex+1);
							oColumns[i].setLabel(new sap.ui.commons.Label({
								text: labelArr[oAttName]
							}));
						}
						
					}			
				}
			});
					
		});
		
		//toolbar	
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
					case "upload, only xlsx and csv files are allowed"://update by Chris Gao 2015-11-01
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
		
		//filter, brand, prod_family cascade		
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_BRAND8(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		//filter, addname, tba_type cascade
		var that = this;
		var adderNameDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Adder Name")[0];
		var tBATypeTextField = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "TBA Type")[0];
		adderNameDropdownBox.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === lenovo.control.Constants.allDropdownBoxListItem) {
				tBATypeTextField.setValue(null);
			}else{
				//tBATypeTextField.setValue("anc");
				that.getTBAType(oServiceUrl,selectedKey,tBATypeTextField);
			}
			console.log("selectedKey", selectedKey);
		});
		
		if(auth.createable){
			//create: brand, prod_family cascade
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var brandDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Brand")[0];
		    var prodFamilyDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Family")[0];
		    var opts = {
		    		transform: function (data){
						return data.d.results;
					},
					url: function(selectedKey){
						return oServiceUrl+"/INPUT_BRAND5(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
					},
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE",
					notAddFirstListItem:true
		    };
		    var createBrandValue = brandDropdownBox2.getValue();
		    opts.selectedKey = createBrandValue;
		    lenovo.control.commontable.Toolkit.reReloadDropdownBox(prodFamilyDropdownBox2, opts);
			lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox2, prodFamilyDropdownBox2, opts);
			
			//create, addname, tba_type cascade
			var that = this;
			var adderNameDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Adder Name")[0];
			var tBATypeTextField2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "TBA Type")[0];
			adderNameDropdownBox2.attachChange(function(){
				var selectedKey = this.getSelectedKey();
				that.getTBAType(oServiceUrl,selectedKey,tBATypeTextField2);
				
				console.log("selectedKey", selectedKey);
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

	}
});