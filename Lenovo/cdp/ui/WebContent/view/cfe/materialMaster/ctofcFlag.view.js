//Created by Bian zehan at 2016-2-22
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.materialMaster.ctofcFlag", {
	setConfig: function(config, oServiceUrl, uServiceUrl, auth){
		//table
		config.columns = [{
			field: "CTO", label: "CTO", type:"TextField"
		},{
			field: "FC", label: "FC", type:"TextField"
		},{
			field: "ANNOUNCE_DATE", label: "Announce Date", type:"DatePicker",
			datepicker: {

                format: 'yyyy-MM-dd'

        }, width: "150px"
		},{
			field: "WITHDRAW_DATE", label: "Withdraw Date", type:"DatePicker",
			datepicker: {

                format: 'yyyy-MM-dd'

        }, width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 250;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);

		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);

		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl+"/UI_CTOFC_FLAG_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "CTO", label: "CTO", type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		},{
			field: "FC", label: "FC", type:"TextField",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		},{
			field: "ANNOUNCE_DATE", label: "Announce Date", type:"TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		},{
			field: "WITHDRAW_DATE", label: "Withdraw Date", type:"TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//create		
		config.insertRaw=[{
			field: "CTO", label:"CTO",type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
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
					func: this.reloadCreateSearchCTODropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateCTODropdownTable,
					context: this
				}
			}
		},{	
			field: "FC", label:"FC",type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
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
					func: this.reloadCreateSearchFCDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateFCDropdownTable,
					context: this
				}
			}
		},{
			field: "ANNOUNCE_DATE", label: "Announce Date", type:"DatePicker",width:"150px"
		},{
			field: "WITHDRAW_DATE", label: "Withdraw Date", type:"DatePicker",width:"150px"
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/UI_CTOFC_FLAG";
		config.create.fakeData = {
				"CYCLE" : "CURRENT",
				"PRODUCT_GROUP" : "EBG"
		};

		//edit		
		config.editRaw = [{field: "ANNOUNCE_DATE", label: "Announce Date", type: "DatePicker"},
		                  {field: "WITHDRAW_DATE", label: "Withdraw Date", type: "DatePicker"}];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_ctofc_flag/CV_UI_CTOFC_FLAG"';
		config.download.columns=[
			"CYCLE","CTO","FC","ANNOUNCE_DATE","WITHDRAW_DATE"];
		config.download.filename= "UI_CTOFC_FLAG";
		
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_ctofc_flag.xsjs",
			excelUrl: "cfe/materialMaster/ctofc_flag.xlsx"
		};
		config.viewstatus = {
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_CTOFC_FLAG'",
				selectionMode: sap.ui.table.SelectionMode.Single
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO"
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_CTOFC_FLAG_ERR_DETAIL?$format=json",
				columns: [[{
					label: "Cycle",
					field: "CYCLE",
					type:  "TextField"
				},{
					label: "CTO",
					field: "CTO",
					type:  "TextField"
				},{
					label: "FC",
					field: "FC",
					type:  "TextField"
				},{
					label: "ANNOUNCE_DATE",
					field: "ANNOUNCE_DATE",
					type:  "TextField"
				},{
					label: "WITHDRAW_DATE",
					field: "WITHDRAW_DATE",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_ctofc_flag.xsjs"
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
	reloadCreateSearchCTODropdownTable: function(filterModel, filterPanel, table){
		
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
			})
			];
		}
		var bindUrl = "/UI_CTOFC_FLAG_CREATE_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadCreateCTODropdownTable: function(dropdownTable){
		
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
		var bindUrl = "/UI_CTOFC_FLAG_CREATE_DDL?$filter=ITEM_TYPE eq 'CTO' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadCreateSearchFCDropdownTable: function(filterModel, filterPanel, table){
		
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
			})
			];
		}
		var bindUrl = "/UI_CTOFC_FLAG_CREATE_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadCreateFCDropdownTable: function(dropdownTable){
		
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
		var bindUrl = "/UI_CTOFC_FLAG_CREATE_DDL?$filter=ITEM_TYPE eq 'FC' &$format=json";
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
		var auth = lenovo.control.commontable.Table.getViewAuth("ctofcFlag");

		this.setConfig(config, oServiceUrl, uServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Material Master", "CTO-FC EOL");

		config.bindRowUrl = "/UI_CTOFC_FLAG";
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