//Created by zhaodan1 at 2017-02-07
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.CommissionableAdder.cryadPh", {
	
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
			field: "CYCLE", label: "Cycle", type:"TextField",width:"100px"
		},{
			field: "PH", label: "PH", type:"TextField",width:"100px"
		},{
			field: "ITEM", label: "ITEM", type: "TextField",width:"100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "COUNTRY", label: "Country", type:"TextField",width:"100px"
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
					url: oServiceUrl +"/UI_CRYAD_PH_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$orderby=ITEM_VALUE desc&$format=json"
				}				
			}
		},{
			field: "PH", label: "PH", type: "TextField", 
			textfield: {
				enabled: true,
				defaultFilterOp: "Contains"
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
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CRYAD_PH_SEARCH_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json"
				}	
					
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CRYAD_PH_SEARCH_DDL?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json"
				}
			}
			
		},{
			field: "TBA_TYPE", label: "TBA Type",type: "DropdownBox",
			dropdownbox : {
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CRYAD_PH_SEARCH_DDL?$filter=ITEM_TYPE eq 'TBA_TYPE'&$format=json"
				}	
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
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
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_cryad_ph/CV_UI_CRYAD_PH"';
		config.download.columns=[
		                         "CYCLE", "PH", "ITEM", "PLANT", "COUNTRY", "TBA_TYPE",
		                         "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18",
		                         "SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"
		                         ];
		config.download.filename= "UI_CRYAD_PH";
		
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_cryad_ph.xsjs",
			excelUrl: "cfe/CommissionableAdder/cryad_ph.xlsx"
		};
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_CRYAD_PH'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_CRYAD_PH_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "PH",
					field: "PH",
					type:  "TextField"
				},{
					label: "Item",
					field: "ITEM",
					type:  "TextField"
				},{
					label: "Plant",
					field: "PLANT",
					type:  "TextField"
					
				},{
					label: "Country",
					field: "COUNTRY",
					type:  "TextField"
					
				},{
					label: "TBA_TYPE",
					field: "TBA_TYPE",
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
					url: uServiceUrl + "/ui_cryad_ph.xsjs"
				}
			}
		};
		
		//create	
		
		config.insertRaw=[{
			field: "PH", label: "PH", type: "TextField", 
			textfield: {
				
				enabled: true
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
			field: "PLANT", label: "Plant",  type:"DropdownBox",required: true,
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/UI_CRYAD_PH_CREATE_DDL?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "COUNTRY", label: "Country", type:"DropdownBox",required: true,
			dropdownbox : {
				odata:	{			
					defaultSelectAll: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_CRYAD_PH_CREATE_DDL?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json"
				}
			}
		},{
			field: "TBA_TYPE", label: "TBA Type",  type:"DropdownBox",required: true,
			dropdownbox : {
				odata:{
					defaultSelectAll: true,
					url: oServiceUrl +"/UI_CRYAD_PH_CREATE_DDL?$filter=ITEM_TYPE eq 'TBA_TYPE'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "M1", label: "M1", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M2", label: "M2", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M3", label: "M3", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M4", label: "M4", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M5", label: "M5", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M6", label: "M6", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M7", label: "M7", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M8", label: "M8", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M9", label: "M9", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M10", label: "M10", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M11", label: "M11", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M12", label: "M12", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M13", label: "M13", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M14", label: "M14", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M15", label: "M15", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M16", label: "M16", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M17", label: "M17", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		},{
			field: "M18", label: "M18", type:"TextField",required: true,
			validation: [{
				validType: /^\d{0,11}(\.\d{0,4})?$/,
				errMsg: "The date type of this field is Decimal(15,4)!"
			}]
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_CRYAD_PH";
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
		var bindUrl = "/UI_CRYAD_PH_CREATE_DDL?";
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
		var bindUrl = "/UI_CRYAD_PH_CREATE_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},	
	createContent: function(){
		var app = new sap.m.App(); 

		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();

		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("cryadPh");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Commissionable Adder", "CRYAD by PH");

		config.bindRowUrl = "/UI_CRYAD_PH";
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
						var oStartIndex = 6;
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
		if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var PHBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "PH")[0];
		    var ItemBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Item")[0];
		    
		    insertDialog.attachClosed(function(){
		    	PHBox.setEnabled(true);
		    	ItemBox.setEnabled(true);
		    });
		    
		    PHBox.attachChange(function(oEvent){
		    	var itemValue = oEvent.getSource().getValue();
		    	if(itemValue != "")
				{
		    		ItemBox.setEnabled(false);
		    		ItemBox.setValue("N/A");
				}
				else
				{
					ItemBox.setEnabled(true);
				}
		    });
		    ItemBox.attachChange(function(oEvent){
		    	var itemValue = oEvent.getSource().getValue();
		    	if(itemValue != "")
				{
		    		PHBox.setEnabled(false);
		    		PHBox.setValue("N/A");
				}
				else
				{
					PHBox.setEnabled(true);
				}
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