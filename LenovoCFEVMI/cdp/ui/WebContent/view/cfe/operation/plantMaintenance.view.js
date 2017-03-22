//Created by Zhang Ruixue at 2014-12-03
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.plantMaintenance", {
	setConfig: function(config, oServiceUrl, auth){

		//table		
		config.columns = [{
			field: "PLANT", label: "Plant", type:"TextField"
		},{
			field: "PLANT_TYPE", label: "Plant Type", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_PLANT_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'Plant_Type'&$format=json"
				}	
					
			}
		},{
			field: "PLANT_DESC", label: "Description", type:"TextField"
		},{
			field: "PLANT_SUBGEO", label: "Plant SUBGEO", type: "DropdownBox", 
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_PLANT_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField"
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 255;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);

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
					url: oServiceUrl +"/UI_PLANT_DROPDOWNLIST?$filter=ITEM_TYPE eq 'CYCLE'&$format=json"
				}				
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				odata: {
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_PLANT_DROPDOWNLIST?$filter=ITEM_TYPE eq 'PLANT'&$format=json",
					bindTextField:'ITEM_VALUE',
					bindKeyField:'ITEM_VALUE'
				}
			}
		},{
			field: "PLANT_TYPE", label: "Plant Type", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "PLANT_SUBGEO", label: "Plant SUBGEO", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L5 M5 S5", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L7 M7 S7"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_PLANT_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
	/*	config.filterLayout = {
				0: new sap.ui.layout.GridData({span: "L2 M2 S2"}),
				1: new sap.ui.layout.GridData({span: "L2 M2 S2"}),
				2: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				3: new sap.ui.layout.GridData({span: "L4 M4 S4"})	
			};*/

		//create		
		config.insertRaw=[{
			field: "PLANT", label: "Plant", type:"TextField"
		},{
			field: "PLANT_TYPE", label: "Plant Type", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/UI_PLANT_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'Plant_Type'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PLANT_DESC", label: "Description", type:"TextField"
		},{
			field: "PLANT_SUBGEO", label: "Plant SUBGEO", type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl +"/UI_PLANT_CREATE_DROPDOWNLIST?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		config.create.url = "/CFE_UI_PLANT";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG"
		};
		
		//edit		
		config.editRaw = [
		                  /*{field: "PLANT", label: "Plant"},*/
		                  {field: "PLANT_TYPE", label: "Plant Type"},
		                  {field: "PLANT_SUBGEO", label: "Plant SUBGEO"}
		                  ];
		
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_plant/CV_UI_PLANT"';
		config.download.columns=[
			"PLANT","PLANT_TYPE","PLANT_DESC","PLANT_SUBGEO","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.filename= "UI_PLANT";
		
		//toolbar , auth
		config.create.visible = auth.createable;
		config.edit.visible = auth.editable;
		config.deleteable.visible = auth.deleteable;
		config.download.visible = auth.exportable;
		config.upload.visible=false;
		config.download.roleName = auth.exportableRoleName;
	},
	createContent: function(){
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("plantMaintenance");
		
		this.setConfig(config, oServiceUrl, auth);
		var header = lenovo.control.commontable.Table.createHeader("Operation", "Plant Maintenance");

		config.bindRowUrl = "/CFE_UI_PLANT";
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
		var editButton = null, deleteButton = null;
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
			} else {
				if(editButton){
					editButton.setVisible(false);
				}
				if(deleteButton){
					deleteButton.setVisible(false);
				}
			}
		});	

		//plant, plant type,  cascade	
		var plantDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		var plantTypeDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant Type")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(plantDropdownBox, plantTypeDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl +"/INPUT_PLANT(INPUT_PLANT='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		//
		lenovo.control.commontable.Toolkit.refreshDropdownbox(oForm);

		//app
		var app = new sap.m.App(); 
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	}
});