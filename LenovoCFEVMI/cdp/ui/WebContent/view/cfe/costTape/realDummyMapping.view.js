//Created by Zhang Ruixue at 2014-12-08
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.costTape.realDummyMapping", {
	reloadRealPartDropdownTable: function(dropdownTable){
		var cycle = this.cycleDropdownBox.getValue();
		var bindUrl = "/INPUT_CYCLE6(input_cycle='"+ cycle +"')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchRealPartDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var filter = filterModel.getProperty("/REAL_PART");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "REAL_PART",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_CYCLE6(input_cycle='"+ cycle +"')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadDummyPartDropdownTable: function(dropdownTable){
		var cycle = this.cycleDropdownBox.getValue();
		var bindUrl = "/INPUT_CYCLE5(input_cycle='"+ cycle +"')/Results";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchDummyPartDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var filter = filterModel.getProperty("/DUMMY_PART");
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "DUMMY_PART",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/INPUT_CYCLE5(input_cycle='"+ cycle +"')/Results";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){

		//table		
		config.columns = [{
			field: "REAL_PART", label: "Real Part", type:"TextField"
		},{
			field: "DUMMY_PART", label: "Dummy Part", type:"TextField"
		},{
			field: "COMMODITY", label: "Commodity", type:"TextField"
		},{
			field: "OWNER", label: "Owner", type: "TextField"	
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE_CHAR", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "CYCLE",
					bindKeyField: "CYCLE",
					url: oServiceUrl +"/UI_REAL_DUMMY_MAPPING_CYCLE?$format=json"
				}				
			}
		},{
			field: "OWNER", label: "Owner", type: "DropdownBox",
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]			
					
			}
		},{
			field: "REAL_PART", label: "Real Part", type: "DropdownTable",
			dropdowntable : {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "REAL_PART",	
				columns: [{
					label: "Real Part",
					field: "REAL_PART",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "REAL_PART",
					label: "Real Part",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchRealPartDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadRealPartDropdownTable,
					context: this
				}
			}
		},{
			field: "DUMMY_PART", label: "Dummy Part", type: "DropdownTable",
			dropdowntable : {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
				field: "DUMMY_PART",	
				columns: [{
					label: "Dummy Part",
					field: "DUMMY_PART",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "DUMMY_PART",
					label: "Dummy Part",
					type: "MultiTextField"
				}]],
				_search: {
					func: this.reloadSearchDummyPartDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadDummyPartDropdownTable,
					context: this
				}
			}
		},{
			field: "COMMODITY", label: "Commodity", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]								
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
/*		config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				1: new sap.ui.layout.GridData({span: "L3 M3 S3"}),
				2: new sap.ui.layout.GridData({span: "L6 M6 S6"})	
			};*/
		
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_real_dummy_mapping/CV_REAL_DUMMY_MAPPING"';
		config.download.columns=["CYCLE","REAL_PART", "DUMMY_PART", "COMMODITY","OWNER",
		                         "SYS_LAST_MODIFIED_BY", "SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "UI_REAL_DUMMY_MAPPING";
		
		//create		
		config.insertRaw=[{
			field: "REAL_PART", label: "Real Part", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_REAL_DUMMY_MAPPING_CREATE_REALPART",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "REAL_PART",
					field: "ITEM"
				}],	
				columns: [{
					label: "Real Part",
					field: "ITEM",
					type: "TextField"
				}],
				filters: [[{
					label: "Real Part",
					field: "ITEM",
					type: "MultiTextField"
				}]]
			}
		},{
			field: "DUMMY_PART", label: "Dummy Part", type: "DropdownTable",
			dropdowntable: {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
				bindRowUrl: "/UI_REAL_DUMMY_MAPPING_CREATE_DUMMYPART",
//				selectionMode: sap.ui.table.SelectionMode.Single,
				fields: [{
					bindByField: "DUMMY_PART",
					field: "DUMMY_PART"
				}],	
				columns: [{
					label: "Dummy Part",
					field: "DUMMY_PART",
					type: "TextField"
				}],
				filters: [[{
					label: "Dummy Part",
					field: "DUMMY_PART",
					type: "MultiTextField",
					multitextfield: {
	//					defaultFilterOp: "EQ"
					}
				}]]
			}
		},{
			field: "COMMODITY", label: "Commodity", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					bindTextField: "PVALUE",
					bindKeyField: "PVALUE",
					url: oServiceUrl +"/UI_REAL_DUMMY_MAPPING_CREATE_COMMODITY?$format=json"
				}	
					
			}
		},{
			field: "OWNER", label: "Owner", type: "TextField"
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(1, config.insertRaw);
		config.create.url = "/UI_REAL_DUMMY_MAPPING";
		config.create.fakeData = {
				"CYCLE":"CURRENT",
				"PRODUCT_GROUP" : "EBG"
		};
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_real_dummy_mapping.xsjs",
			excelUrl: "cfe/costTape/real_dummy_mapping.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_REAL_DUMMY_MAPPING'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_REAL_DUMMY_MAPPING_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Real Part",
					field: "REAL_PART",
					type:  "TextField"
				},{
					label: "Dummy Part",
					field: "DUMMY_PART",
					type:  "TextField"
				},{
					label: "Commodity",
					field: "COMMODITY",
					type:  "TextField"
				},{
					label: "Owner",
					field: "OWNER",
					type: "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_real_dummy_mapping.xsjs"
				}
			}
		};
		
		//toolbar , auth
		config.create.visible = auth.createable;
		config.edit.visible =  false;//auth.editable;;
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
		var auth = lenovo.control.commontable.Table.getViewAuth("realDummyMapping");
		
		this.setConfig(config, oServiceUrl, uServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Cost Tape", "Real Dummy Mapping");

		config.bindRowUrl = "/UI_REAL_DUMMY_MAPPING";
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
		this.cycleDropdownBox = cycleDropdownBox;
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var uploadButton = null,deleteButton = null, uploadTemButton = null, viewStatusButton = null;
		for(var i = 0; i < buttons.length; i++) {
			var oTooltip = buttons[i].getTooltip();
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
				if(deleteButton){
					deleteButton.setVisible(true);
				}
				if(auth.uploadable){
					uploadButton.setVisible(true);
					uploadTemButton.setVisible(true);
					viewStatusButton.setVisible(true);
				}
				
			} else {
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
		
		//cycle, commodity cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_CYCLE3(input_cycle='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"COMMODITY",
			bindKeyField:"COMMODITY"
		};	
		var commodityDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Commodity")[0];
		opts.selectedKey = oForm.getModel().getProperty("/CYCLE/filterValue"); //updated by Chris Gao 2015-11-26
//		if (!cycleDropdownBox.getValue())
//			{
//			opts.selectedKey = 'CURRENT'
//			}else{
//			opts.selectedKey = cycleDropdownBox.getValue();
//		}
		
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(commodityDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, commodityDropdownBox, opts);
		
		//cycle, owner cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/INPUT_CYCLE4(input_cycle='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"OWNER",
			bindKeyField:"OWNER"
		};	
		var ownerDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Owner")[0];
		opts.selectedKey = oForm.getModel().getProperty("/CYCLE/filterValue");  //updated by Chris Gao 2015-11-26
//		if (!cycleDropdownBox.getValue())
//			{
//			opts.selectedKey = 'CURRENT'
//		}else{
//			opts.selectedKey = cycleDropdownBox.getValue();
//			}
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(ownerDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, ownerDropdownBox, opts);
		
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