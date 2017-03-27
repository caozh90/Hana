/************************************
* Created by zhaodan at 2016-05-26
* Version 1.0 2016-05-26
************************************/
//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.costTape.groupCost", { 
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
		var oModel1 = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		var oModel2 = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("groupCost");
		/******Copy_Change_End*******/
		
		//generate UI
		//declare tab strip
		var oTabStrip =  new sap.ui.commons.TabStrip();
		
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
		

		var config_Family = lenovo.control.commontable.Table.getDefaultTableConfig(oModel); //declare ui_view configuration
		var config_MT =  lenovo.control.commontable.Table.getDefaultTableConfig(oModel1);
		var config_Item =  lenovo.control.commontable.Table.getDefaultTableConfig(oModel2);

		this.setConfig_Family(labelArr,config_Family, oServiceUrl, uServiceUrl,auth, "Family");   //call private function -- ui_view configuration
		this.setConfig_MT(labelArr,config_MT, oServiceUrl, uServiceUrl,auth, "MT");
		this.setConfig_Item(labelArr,config_Item, oServiceUrl, uServiceUrl,auth, "Item");
		
		/******Copy_Change_Start*******/
		var header = lenovo.control.commontable.Table.createHeader("Cost Tape", "Group Cost");
		/******Copy_Change_End*******/
		//set data connection
		/******Copy_Change_Start*******/
		config_Family.bindRowUrl = "/UI_GROUP_COST_FAMILY";
		config_MT.bindRowUrl = "/UI_GROUP_COST_MT"; 
		config_Item.bindRowUrl = "/UI_GROUP_COST_ITEM";
		
		/******Copy_Change_End*******/
		
		var table_Family = lenovo.control.commontable.Table.createTable(config_Family);
		var table_MT = lenovo.control.commontable.Table.createTable(config_MT);
		var table_Item = lenovo.control.commontable.Table.createTable(config_Item);
		
		this.table_Family = table_Family;
		this.table_MT = table_MT;
		this.table_Item = table_Item;
		
		table_Family.setModel(oModel);
		table_MT.setModel(oModel1);
		table_Item.setModel(oModel2);
		
		oModel.attachRequestCompleted(function(){
			table_Family.setBusy(false);
			table_MT.setBusy(false);
			table_Item.setBusy(false);
		});
		oModel1.attachRequestCompleted(function(){
			table_Family.setBusy(false);
			table_MT.setBusy(false);
			table_Item.setBusy(false);
		});
		oModel2.attachRequestCompleted(function(){
			table_Family.setBusy(false);
			table_MT.setBusy(false);
			table_Item.setBusy(false);
		});
		
		//filter panel
		var filterPanel_Family = lenovo.control.commontable.Table.createFilter(config_Family, table_Family);
		var filterPanel_MT = lenovo.control.commontable.Table.createFilter(config_MT, table_MT);
		var filterPanel_Item = lenovo.control.commontable.Table.createFilter(config_Item, table_Item);
		
		//tool bar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config_Family, table_Family, app);
		var oEditDeleteUploadDownload1 = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config_MT, table_MT, app);
		var oEditDeleteUploadDownload2 = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config_Item, table_Item, app);
		
		/************************
		 * authorization buttons for Family Tab
		 ************************/
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
		// CYCLE != CURRENT edit,delete unvisible
		var oForm = filterPanel_Family.getContent()[0];
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
		 **********************************/
		
		/************************
		 * authorization buttons --MT
		 ************************/
		var buttons1 = oEditDeleteUploadDownload1.getContent()[0].getContent();
		var editButton1 = null, uploadButton1 = null,deleteButton1 = null, uploadTemButton1 = null, viewStatusButton1 = null;
		for(var i = 0; i < buttons1.length; i++) {
			var oTooltip = buttons1[i].getTooltip();
			if(auth.editable && oTooltip === 'edit'){
				editButton1 = buttons1[i];
				continue;
			}
			if(auth.deleteable && oTooltip === 'delete'){
				deleteButton1 = buttons1[i];
				continue;
			}
			if(auth.uploadable){
				switch(oTooltip){
					case "upload, only xlsx and csv files are allowed":
						uploadButton1 = buttons1[i];
						break;
					case "download upload template":
						uploadTemButton1 = buttons1[i];
						break;
					case "view status":
						viewStatusButton1 = buttons1[i];
						break;
				}
			}
		}
		// CYCLE != CURRENT edit,delete unvisible
		var oForm1 = filterPanel_MT.getContent()[0];
		var cycleDropdownBox1 = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm1, "Cycle")[0];
		cycleDropdownBox1.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				if(editButton1){
					editButton1.setVisible(true);
				}
				if(deleteButton1){
					deleteButton1.setVisible(true);
				}
				if(auth.uploadable){
					uploadButton1.setVisible(true);
					uploadTemButton1.setVisible(true);
					viewStatusButton1.setVisible(true);
				}
				
			} else {
				if(editButton1){
					editButton1.setVisible(false);
				}
				if(deleteButton1){
					deleteButton1.setVisible(false);
				}
				if(auth.uploadable && uploadButton){
					uploadButton1.setVisible(false);
					uploadTemButton1.setVisible(false);
					viewStatusButton1.setVisible(false);
				}		
			}
		});
		
		/***********************************
		 * End by Chris Gao
		 **********************************/
		
		/************************
		 * authorization buttons --Item
		 ************************/
		var buttons2 = oEditDeleteUploadDownload2.getContent()[0].getContent();
		var editButton2 = null, uploadButton2 = null,deleteButton2 = null, uploadTemButton2 = null, viewStatusButton2 = null;
		for(var i = 0; i < buttons2.length; i++) {
			var oTooltip = buttons2[i].getTooltip();
			if(auth.editable && oTooltip === 'edit'){
				editButton2 = buttons2[i];
				continue;
			}
			if(auth.deleteable && oTooltip === 'delete'){
				deleteButton2 = buttons2[i];
				continue;
			}
			if(auth.uploadable){
				switch(oTooltip){
					case "upload, only xlsx and csv files are allowed":
						uploadButton2 = buttons2[i];
						break;
					case "download upload template":
						uploadTemButton2 = buttons2[i];
						break;
					case "view status":
						viewStatusButton2 = buttons2[i];
						break;
				}
			}
		}
		// CYCLE != CURRENT edit,delete unvisible
		var oForm2 = filterPanel_Item.getContent()[0];
		var cycleDropdownBox2 = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm2, "Cycle")[0];
		cycleDropdownBox2.attachChange(function(){
			var selectedKey = this.getSelectedKey();
			if(selectedKey === "CURRENT") {
				if(editButton2){
					editButton2.setVisible(true);
				}
				if(deleteButton2){
					deleteButton2.setVisible(true);
				}
				if(auth.uploadable){
					uploadButton2.setVisible(true);
					uploadTemButton2.setVisible(true);
					viewStatusButton2.setVisible(true);
				}
				
			} else {
				if(editButton2){
					editButton2.setVisible(false);
				}
				if(deleteButton2){
					deleteButton2.setVisible(false);
				}
				if(auth.uploadable && uploadButton){
					uploadButton2.setVisible(false);
					uploadTemButton2.setVisible(false);
					viewStatusButton2.setVisible(false);
				}		
			}
		});
		
		/***********************************
		 * End by Chris Gao
		 **********************************/
		
		var oVLayout1 = new sap.ui.layout.VerticalLayout ("groupcosttablayout1", {
			width: "100%",
			content: [filterPanel_Family, oEditDeleteUploadDownload, table_Family]
		});
		
		var oVLayout2 = new sap.ui.layout.VerticalLayout ("groupcosttablayout2", {
			width: "100%",
			content: [filterPanel_MT, oEditDeleteUploadDownload1, table_MT]
		});
		var oVLayout3 = new sap.ui.layout.VerticalLayout ("groupcosttablayout3", {
			width: "100%",
			content: [filterPanel_Item, oEditDeleteUploadDownload2, table_Item]
		});

		//add tab strip
		var oTab1 = new sap.ui.commons.Tab("groupcosttab1");
		oTab1.setTooltip("Family");
		oTab1.setTitle(new sap.ui.core.Title("groupcosttbtitleFamily",{text:" By Family",icon:"sap-icon://open-folder"}));
		oTab1.addContent(oVLayout1);
		
		var oTab2 = new sap.ui.commons.Tab("groupcosttab2");
		oTab2.setTooltip("MT");
		oTab2.setTitle(new sap.ui.core.Title("groupcosttbtitleMT",{text:" By MT",icon:"sap-icon://folder"}));
		oTab2.addContent(oVLayout2);
		
		var oTab3 = new sap.ui.commons.Tab("groupcosttab3");
		oTab3.setTooltip("Item");
		oTab3.setTitle(new sap.ui.core.Title("groupcosttbtitleItem",{text:" By Item",icon:"sap-icon://folder"}));
		oTab3.addContent(oVLayout3);
		
		//redefine the tab width
		oTabStrip.addStyleClass("width3TabStrip");//added by Chris Gao 2015-10-24
		
		oTabStrip.addTab(oTab1);
		oTabStrip.addTab(oTab2);
		oTabStrip.addTab(oTab3);
		
		//change tab icon state
		oTabStrip.attachSelect(function(oEvent){
			if(oTabStrip.getSelectedIndex() == 0)
			{
				oTab1.getTitle().setProperty("icon","sap-icon://open-folder");
				oTab2.getTitle().setProperty("icon","sap-icon://folder");
				oTab3.getTitle().setProperty("icon","sap-icon://folder");
			}
			else if(oTabStrip.getSelectedIndex() == 1) 
			{
				oTab1.getTitle().setProperty("icon","sap-icon://folder");
				oTab2.getTitle().setProperty("icon","sap-icon://open-folder");
				oTab3.getTitle().setProperty("icon","sap-icon://folder");
			}
			else
			{
				oTab1.getTitle().setProperty("icon","sap-icon://folder");
				oTab2.getTitle().setProperty("icon","sap-icon://folder");
				oTab3.getTitle().setProperty("icon","sap-icon://open-folder");
			}				
		});
		
		/**************************
		 * Brand Family Cascade
		 *************************/
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_UI_GROUP_COST_S_FAMILY_DDL(IN_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});
		brandDropdownBox.attachChange(function(){
			if(this.getSelectedKey() == "")
			{
				oForm.getModel().setProperty("/PORD_FAMILY/filterValue", "");
			}
		});
		
		/****************************
		 * Insert Brand Family Cascade
		 ****************************/
		//create: Ratio Code, Subgeo, Country cascade
		if(auth.createable){
			var insertDialog = oEditDeleteUploadDownload.data("insertDialog");
		    var insertForm = insertDialog.getContent()[0];
		    var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Brand")[0];
		    var familyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(insertForm, "Product Family")[0];
		    var opts = {
		    		transform: function (data){
						return data.d.results;
					},
					url: function(selectedKey){
						return oServiceUrl+"/IN_UI_GROUP_COST_C_FAMILY_DDL(IN_BRAND='" + selectedKey + "')/Results?$format=json";
					},
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE",
					notAddFirstListItem: true,
		    };
		    var createBrandCodeValue = brandDropdownBox.getValue();
		    opts.selectedKey = createBrandCodeValue;
		    lenovo.control.commontable.Toolkit.reReloadDropdownBox(familyDropdownBox, opts);
			lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, familyDropdownBox, opts);
			
			//close to reload
			
			insertDialog.attachClosed(function(){
				opts.selectedKey = createBrandCodeValue;
			    lenovo.control.commontable.Toolkit.reReloadDropdownBox(familyDropdownBox, opts);
				lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, familyDropdownBox, opts);
			});
		}
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, oTabStrip]         
	    });
       app.insertPage(page);
       app.setInitialPage(page);
       return app;	
		
	},
	
	//private function -- ui_view columns configuration
	setConfig_Family: function(labelArr,config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CYCLE", label: "Cycle", type:"TextField", width: "100px"
		},{
			field: "BRAND", label: "Brand", type:"TextField", width: "100px"
		},{
			field: "PROD_FAMILY", label: "Product Family", type: "TextField",width:"150px"
		},{
			field: "TYPE", label: "Group Type", type:"TextField",width:"100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width:"150px"
		},{
			field: "M2", label: labelArr.M2, type:"TextField", width:"150px"
		},{
			field: "M3", label: labelArr.M3, type:"TextField", width:"150px"
		},{
			field: "M4", label: labelArr.M4, type:"TextField", width:"150px"
		},{
			field: "M5", label: labelArr.M5, type:"TextField", width:"150px"
		},{
			field: "M6", label: labelArr.M6, type:"TextField", width:"150px"
		},{
			field: "M7", label: labelArr.M7, type:"TextField", width:"150px"
		},{
			field: "M8", label: labelArr.M8, type:"TextField", width:"150px"
		},{
			field: "M9", label: labelArr.M9, type:"TextField", width:"150px"
		},{
			field: "M10", label: labelArr.M10, type:"TextField", width:"150px"
		},{
			field: "M11", label: labelArr.M11, type:"TextField", width:"150px"
		},{
			field: "M12", label: labelArr.M12, type:"TextField", width:"150px"
		},{
			field: "M13", label: labelArr.M13, type:"TextField", width:"150px"
		},{
			field: "M14", label: labelArr.M14, type:"TextField", width:"150px"
		},{
			field: "M15", label: labelArr.M15, type:"TextField", width:"150px"
		},{
			field: "M16", label: labelArr.M16, type:"TextField", width:"150px"
		},{
			field: "M17", label: labelArr.M17, type:"TextField", width:"150px"
		},{
			field: "M18", label: labelArr.M18, type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				defaultFilterValue: "CURRENT",
				odata:{               
					defaultSelectAll: false,
					url: oServiceUrl + "/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE'&$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json"
				}	
					
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Brand'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PROD_FAMILY", label: "Family", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				data:[{
					"text": lenovo.control.Constants.allDropdownBoxListItem, 
					"key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "TYPE", label: "Group Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Group Type'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		/******Copy_Change_Start*******/
		//create
		var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "BRAND", 
			label: "Brand", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Brand'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PROD_FAMILY", 
			label: "Product Family", 
			type:"DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			dropdownbox : {
				defaultValue: defaultInsertValue.defaultFamily
			}
		},{
			field: "TYPE", label: "Group Type",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Group Type'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PLANT", label: "Plant",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
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
		config.create.url = "/UI_GROUP_COST_FAMILY";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT",
				"MT" : "N/A",
				"ITEM": "N/A"
		};
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
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
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_group_cost/CV_GROUP_COST_FAMILY"';
		config.download.columns=[
		                        "CYCLE","BRAND", "PROD_FAMILY", "TYPE", "PLANT", "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", 
		                         "M15", "M16", "M17", "M18"
		                         ];
		config.download.filename= "UI_GROUP_COST_FAMILY";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
				url: uServiceUrl + "/ui_group_cost.xsjs",
				excelUrl: "cfe/costTape/group_cost_product_family.xlsx"
			};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_GROUP_COST'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_GROUP_COST_ERR_DETAIL?$format=json",
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
						field: "PROD_FAMILY",
						type:  "TextField"
					},{
						label: "Group Type",
						field: "TYPE",
						type:  "TextField"
					},{
						label: "Plant",
						field: "PLANT",
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
						url: uServiceUrl + "/ui_group_cost.xsjs"
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
	
	setConfig_MT: function(labelArr,config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CYCLE", label: "Cycle", type:"TextField", width: "100px"
		},{
			field: "MT", label: "Machine Type", type:"TextField", width: "100px"
		},{
			field: "TYPE", label: "Group Type", type:"TextField",width:"100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width:"150px"
		},{
			field: "M2", label: labelArr.M2, type:"TextField", width:"150px"
		},{
			field: "M3", label: labelArr.M3, type:"TextField", width:"150px"
		},{
			field: "M4", label: labelArr.M4, type:"TextField", width:"150px"
		},{
			field: "M5", label: labelArr.M5, type:"TextField", width:"150px"
		},{
			field: "M6", label: labelArr.M6, type:"TextField", width:"150px"
		},{
			field: "M7", label: labelArr.M7, type:"TextField", width:"150px"
		},{
			field: "M8", label: labelArr.M8, type:"TextField", width:"150px"
		},{
			field: "M9", label: labelArr.M9, type:"TextField", width:"150px"
		},{
			field: "M10", label: labelArr.M10, type:"TextField", width:"150px"
		},{
			field: "M11", label: labelArr.M11, type:"TextField", width:"150px"
		},{
			field: "M12", label: labelArr.M12, type:"TextField", width:"150px"
		},{
			field: "M13", label: labelArr.M13, type:"TextField", width:"150px"
		},{
			field: "M14", label: labelArr.M14, type:"TextField", width:"150px"
		},{
			field: "M15", label: labelArr.M15, type:"TextField", width:"150px"
		},{
			field: "M16", label: labelArr.M16, type:"TextField", width:"150px"
		},{
			field: "M17", label: labelArr.M17, type:"TextField", width:"150px"
		},{
			field: "M18", label: labelArr.M18, type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_GROUP_COST_S_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "MT", label: "Machine Type", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				defaultFilterOp: "Contains",
				url: oServiceUrl,
				notRefreshTable: true,
				//selectionMode: sap.ui.table.SelectionMode.Single,
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
					func: this.reloadSearchMTDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadMTDropdownTable,
					context: this
				}
			}
		},{
			field: "TYPE", label: "Group Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Group Type'&$format=json"
				}	
					
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		/******Copy_Change_Start*******/
		//create
		config.insertRaw=[{
			field: "MT", 
			label: "Machine Type", 
			type:"DropdownTable",
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
					bindByField: "MT",
					field: "ITEM_VALUE"
				}],
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
					func: this.reloadCreateSearchMTDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadCreateMTDropdownTable,
					context: this
				}
			}
			
		},{
			field: "TYPE", label: "Group Type",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Group Type'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PLANT", label: "Plant",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
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
		config.create.url = "/UI_GROUP_COST_MT";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT",
				"PROD_FAMILY" : "N/A",
				"BRAND" : "N/A",
				"ITEM": "N/A"
		};
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
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
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_group_cost/CV_GROUP_COST_MT"';
		config.download.columns=[
		                        "CYCLE","MT", "TYPE", "PLANT", "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", 
		                         "M15", "M16", "M17", "M18"
		                         ];
		config.download.filename= "UI_GROUP_COST_MT";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
				url: uServiceUrl + "/ui_group_cost.xsjs",
				excelUrl: "cfe/costTape/group_cost_mt.xlsx"
			};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_GROUP_COST'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_GROUP_COST_ERR_DETAIL?$format=json",
					columns: [[
					 {
						label: "Cycle",
						field: "CYCLE",
						type:  "TextField"
					    	   
		            },
					{
						field: "MT",
						label: "Machine Type",
						type:  "TextField"
					},{
						label: "Plant",
						field: "PLANT",
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
						url: uServiceUrl + "/ui_group_cost.xsjs"
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
	
	setConfig_Item: function(labelArr,config, oServiceUrl, uServiceUrl, auth, fixTypeConfig) {
		
		//table columns setting
		/******Copy_Change_Start*******/
		config.columns = [{
			field: "CYCLE", label: "Cycle", type:"TextField", width: "100px"
		},{
			field: "ITEM", label: "Item", type:"TextField", width: "100px"
		},{
			field: "TYPE", label: "Group Type", type:"TextField",width:"100px"
		},{
			field: "PLANT", label: "Plant", type:"TextField",width:"100px"
		},{
			field: "M1", label: labelArr.M1, type:"TextField", width:"150px"
		},{
			field: "M2", label: labelArr.M2, type:"TextField", width:"150px"
		},{
			field: "M3", label: labelArr.M3, type:"TextField", width:"150px"
		},{
			field: "M4", label: labelArr.M4, type:"TextField", width:"150px"
		},{
			field: "M5", label: labelArr.M5, type:"TextField", width:"150px"
		},{
			field: "M6", label: labelArr.M6, type:"TextField", width:"150px"
		},{
			field: "M7", label: labelArr.M7, type:"TextField", width:"150px"
		},{
			field: "M8", label: labelArr.M8, type:"TextField", width:"150px"
		},{
			field: "M9", label: labelArr.M9, type:"TextField", width:"150px"
		},{
			field: "M10", label: labelArr.M10, type:"TextField", width:"150px"
		},{
			field: "M11", label: labelArr.M11, type:"TextField", width:"150px"
		},{
			field: "M12", label: labelArr.M12, type:"TextField", width:"150px"
		},{
			field: "M13", label: labelArr.M13, type:"TextField", width:"150px"
		},{
			field: "M14", label: labelArr.M14, type:"TextField", width:"150px"
		},{
			field: "M15", label: labelArr.M15, type:"TextField", width:"150px"
		},{
			field: "M16", label: labelArr.M16, type:"TextField", width:"150px"
		},{
			field: "M17", label: labelArr.M17, type:"TextField", width:"150px"
		},{
			field: "M18", label: labelArr.M18, type:"TextField", width:"150px"
		},{
			field: "SYS_LAST_MODIFIED_BY", label: "Last Modified By", type:"TextField", width: "100px"
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type:"TextField", width: "100px"
		}];
		/******Copy_Change_End*******/
		
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var rowHeight = 30;
		
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		
		
		/******Copy_Change_Start*******/
		//filter
		config.filtersRaw = [{
			field: "CYCLE", label: "Cycle", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					url: oServiceUrl +"/UI_GROUP_COST_S_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$format=json",
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE"
				}				
			}
		},{
			field: "ITEM", label: "Item", type: "DropdownTable",
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdowntable : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
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
			field: "TYPE", label: "Group Type", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Group Type'&$format=json"
				}	
					
			}
		},{
			field: "PLANT", label: "Plant", type: "DropdownBox", 
			labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),
			dropdownbox : {
				layout: new sap.ui.layout.GridData({span: "L4 M4 S4"}),
				odata:{
					defaultSelectAll:true,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_GROUP_COST_SEARCH_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json"
				}	
					
			}
		},{
			field: "SYS_LAST_MODIFIED_DATE", label: "Last Modified Date", type: "TimeRange",
			labelLayout: new sap.ui.layout.GridData({span: "L3 M3 S3", linebreak: true})
		}];
		/******Copy_Change_End*******/
		
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);
		
		
		/******Copy_Change_Start*******/
		//create view - Default cascade Subgeo and Country
		var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//create
		var defaultInsertValue = this.setDefaultCreateCascade(oServiceUrl);
		config.insertRaw=[{
			field: "ITEM", 
			label: "Item", 
			type:"DropdownTable",
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
			field: "TYPE", label: "Group Type",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Group Type'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		},{
			field: "PLANT", label: "Plant",  type:"DropdownBox",
			dropdownbox : {
				odata:{
					url: oServiceUrl+"/UI_GROUP_COST_CREATE_DDL?$filter=ITEM_TYPE eq 'Plant'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
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
		config.create.url = "/UI_GROUP_COST_ITEM";
		config.create.fakeData = {
				"PRODUCT_GROUP" : "EBG",
				"CYCLE" : "CURRENT",
				"BRAND": "N/A",
				"PROD_FAMILY": "N/A",
				"MT" : "N/A"
		};
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
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
		/******Copy_Change_End*******/
		
		/******Copy_Change_Start*******/
		//download
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.ui_group_cost/CV_GROUP_COST_ITEM"';
		config.download.columns=[
		                        "CYCLE","ITEM", "TYPE", "PLANT", "M1", "M2", "M3", "M4", "M5", 
		                         "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", 
		                         "M15", "M16", "M17", "M18"
		                         ];
		config.download.filename= "UI_GROUP_COST_PN";
		/******Copy_Change_End*******/
		
		
		/******Copy_Change_Start*******/
		//upload
		config.upload = {
			url: uServiceUrl + "/ui_group_cost.xsjs",
			excelUrl: "cfe/costTape/group_cost_pn.xlsx"
		};
		//status view
		config.viewstatus = {
				viewUploadHistory: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_GROUP_COST'",
					selectionMode: sap.ui.table.SelectionMode.Single
				},
				viewErrorInfo: {
					url: uServiceUrl + "/upload.xsodata",
					bindRowUrl: "/UPLOAD_ERR_INFO"
				},
				viewUploadErrorDetail: {
					url: uServiceUrl + "/upload.xsodata/UI_GROUP_COST_ERR_DETAIL?$format=json",
					columns: [[{
								label: "Cycle",
								field: "CYCLE",
								type:  "TextField"
							},{
								label: "Item",
								field: "ITEM",
								type:  "TextField"
							},{
								label: "Group Type",
								field: "TYPE",
								type:  "TextField"
							},{
								label: "Plant",
								field: "PLANT",
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
						url: uServiceUrl + "/ui_group_cost.xsjs"
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
	//default Cascade Brand Family
	setDefaultCreateCascade: function(oServiceUrl){
		var defaultBrand = null, defaultFamily = null;
		var result = {defaultBrand : "", defaultFamily : ""};
		$.ajax({
			url: oServiceUrl+"/UI_GROUP_COST_C_BRAND_DDL?$filter=ITEM_TYPE eq 'BRAND' &$format=json",
			type: "GET",
			dataType: "json", 
			async: false,
			success: function(data){
				if(data.d.results.length > 0)
				{
					defaultBrand = data.d.results[0];
				}
					
			}		
		});
		if(defaultBrand !== null && defaultBrand.ITEM_VALUE !== undefined) {

			$.ajax({
				url: oServiceUrl + "/IN_UI_GROUP_COST_C_FAMILY_DDL(IN_BRAND='" + defaultBrand.ITEM_VALUE + "')/Results?$format=json",
				type: "GET",
				dataType: "json", 
				async: false,
				success: function(data){
					if(data.d.results.length > 0)
						defaultFamily = data.d.results[0];
				}
			});	
		}
		
		if(defaultBrand !== null && defaultBrand.ITEM_VALUE !== undefined)
		{
			result.defaultBrand = defaultBrand.ITEM_VALUE;
		}
		else
		{
			result.defaultBrand = "";
		}
		
		if(defaultFamily !== null && defaultFamily.ITEM_VALUE !== undefined)
		{
			result.defaultFamily = defaultFamily.ITEM_VALUE;
		}
		else
		{
			result.defaultFamily = "";
		}
		
		
		return result;
	},
	/******Copy_Change_End*******/
	
	/****************** Start Select Data Helper Table******************************/
	reloadSearchMTDropdownTable: function(filterModel, filterPanel, table){
		
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
                value1: "'MT'"
			})
			];
		}
		var bindUrl = "/UI_GROUP_COST_S_MT_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadMTDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_GROUP_COST_S_MT_DDL?$filter=ITEM_TYPE eq 'MT' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	
	/******************* Start Create Data Helper Table******************************/
	reloadCreateSearchMTDropdownTable: function(filterModel, filterPanel, table){
		
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
                value1: "'MT'"
			})
			];
		}
		var bindUrl = "/UI_GROUP_COST_C_MT_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadCreateMTDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_GROUP_COST_C_MT_DDL?$filter=ITEM_TYPE eq 'MT' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	
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
		var bindUrl = "/UI_GROUP_COST_S_ITEM_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadItemDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_GROUP_COST_S_ITEM_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json";
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
		var bindUrl = "/UI_GROUP_COST_C_ITEM_DDL?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	reloadCreateItemDropdownTable: function(dropdownTable){
		
		/*********************************************************
		 * Added by Chris Gao
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
		var bindUrl = "/UI_GROUP_COST_C_ITEM_DDL?$filter=ITEM_TYPE eq 'ITEM' &$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	/******************* End Select Data Helper Table******************************/
	
	
	
	//Navigation Setting if required
	onTreeNavigation: function(sChannel, sEvent, oData){
		/******Copy_Change_Start*******/
		if(oData.view === "GROUP Cost") {
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
