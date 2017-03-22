//Created by Zhang Ruixue at 2014-12-03
//Edit by Coral Zhang at 2015-03-23
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.operation.costModelList", {
	setConfig: function(config, oServiceUrl, auth){

		//table
		config.columns = [{
			field: "ITEM", label: "Item", type: "TextField"
		},{
			field: "ITEM_TYPE", label: "Item Type", type:"TextField"
		},{
			field: "BRAND", label: "Brand", type:"TextField"
		},{
			field: "ASP_PRD_FAMILY", label: "Prod Family", type:"TextField"
		},{
			field: "PLANT", label: "Plant", type:"TextField"
		},{
			field: "SUBGEO", label: "SubGEO", type:"TextField"
		},{
			field: "COUNTRY", label: "Country", type:"TextField"
		},{
			field: "BOM_PLANT", label: "BOM Plant", type:"TextField"
		},{
			field: "EOL_STATUS", label: "EOL Status", type:"DropdownBox",
			dropdownbox : {
				odata:{
					defaultEmpty: true,
					url: oServiceUrl +"/BIZ_COST_MODEL_LIST_EDIT_DROPDOWNLIST?$filter=ITEM_TYPE eq 'EOL_STATUS'&$format=json",
					bindTextField:"ITEM_VALUE",
					bindKeyField:"ITEM_VALUE"
				}
			}
		}];
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
//		var headerHeight = 290;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		
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
					url: oServiceUrl +"/BIZ_COST_MODEL_LIST_CYCLE?$format=json"
				}				
			}
		},{
			field: "ITEM", label: "Item", type: "DropdownTable",
			dropdowntable : {
				defaultFilterOp: "EQ",
				url: oServiceUrl,
	//			selectionMode: sap.ui.table.SelectionMode.Single,
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
			field: "PLANT", label: "Plant",type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "ITEM_TYPE", label: "Item Type", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}		
		},{
			field: "SUBGEO", label: "SubGEO", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "COUNTRY", label: "Country", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "BRAND", label: "Brand", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "ASP_PRD_FAMILY", label: "Prod_Family", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		},{
			field: "BOM_PLANT", label: "BOM Plant", type: "DropdownBox", 
			dropdownbox : {
				data:[{"text": lenovo.control.Constants.allDropdownBoxListItem, "key": lenovo.control.Constants.allDropdownBoxListItem}]					
			}
		}];
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//edit
		config.editRaw = [	                  
		                  {field: "EOL_STATUS", label: "EOL Status"}  
		                  ];

		//download
		config.download.url = "/cdp/common/services/getFileWithTableInputParas.xsjs";
		config.download.tablewithinputpara = '"_SYS_BIC"."cdp.ebgcfe.models.biz_cost_model_list/CV_BIZ_COST_MODEL_LIST"';
		config.download.urlInputParas = [{item: "IN_CYCLE", value:"", bindFilterPath:"CYCLE"}];
		config.download.table = '"_SYS_BIC"."cdp.ebgcfe.models.biz_cost_model_list/CV_BIZ_COST_MODEL_LIST"'
		config.download.columns=[
			             			"ITEM","ITEM_TYPE","BRAND","ASP_PRD_FAMILY","PLANT",
			             			"SUBGEO","COUNTRY","BOM_PLANT","EOL_STATUS"];
 		config.download.filename= "BIZ_MODEL_LIST";
		
		//toolbar , auth
		config.create.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.edit.visible = auth.editable;
		config.download.visible = auth.exportable;
		config.download.roleName = auth.exportableRoleName;
	},
	createContent: function(){
		/*var viewId = sap.ui.getCore().getModel("view").getProperty("/view");
		console.log("viewId", viewId);*/
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl, true);
		oModel.setDefaultCountMode("None");
		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var auth = lenovo.control.commontable.Table.getViewAuth("costModelList");
		
		this.setConfig(config, oServiceUrl,auth);
		var header = lenovo.control.commontable.Table.createHeader("Operation", "Cost Model List");
		config.searchInputs = {
				hasInputPara: true,
				urlId : "/IN_CFE_BIZ_COST_MODEL_LIST",
				urlInputParas:[{item: "IN_CYCLE", value:"", bindFilterPath:"CYCLE"}]
			};
		config.bindRowUrl = "/IN_CFE_BIZ_COST_MODEL_LIST(IN_CYCLE='CURRENT')/Results";
		
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});
		
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);	
		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);
		
		//toolbar		
		var oEditDeleteUploadDownload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
	
		var oForm = filterPanel.getContent()[0];		
		if(auth.editable){
			var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
			this.cycleDropdownBox = cycleDropdownBox;
			var buttons = oEditDeleteUploadDownload.getContent()[0].getContent();
			var editButton = null;
			for(var i = 0; i < buttons.length; i++) {
				var oTooltip = buttons[i].getTooltip();
				if(oTooltip==='edit'){
					editButton = buttons[i];
					break;
				}	
			}
			cycleDropdownBox.attachChange(function(){
				var selectedKey = this.getSelectedKey();
				if(selectedKey === "CURRENT") {
					editButton.setVisible(true);
				} else {
					editButton.setVisible(false);
				}
			});
		}
		
		/******************************************
		 * Added by Chris Gao
		 * 2015-10-16
		 * to process the initial value of cycle
		 * because the model binding used the two-way binding
		 * so the control's value cannot be read at first time
		 * try to set the value from binding filter model
		 ******************************************/
		var defaultCycle = "";
		if(oForm.getModel().getData()!= undefined && oForm.getModel().getData().CYCLE != undefined && oForm.getModel().getData().CYCLE.filterValue != undefined)
		{
			defaultCycle = oForm.getModel().getData().CYCLE.filterValue;
		}
		
		//item type, brand cascade	
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var prodFamilyDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Prod_Family")[0];
		lenovo.control.commontable.Toolkit.relateDropDwonBox(brandDropdownBox, prodFamilyDropdownBox, {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl +"/INPUT_BRAND3(INPUT_BRAND='" + selectedKey + "')/Results?$format=json";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		});

		//SUBGEO, CYCLE cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_CYCLE(INPUT_CYCLE='" + selectedKey + "')/Results?$format=json&$filter=ITEM_TYPE eq 'SUBGEO'";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		};	
		var subgeoDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "SubGEO")[0];
		opts.selectedKey = defaultCycle;//cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(subgeoDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, subgeoDropdownBox, opts);
		
		//COUNTRY, CYCLE cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_CYCLE(INPUT_CYCLE='" + selectedKey + "')/Results?$format=json&$filter=ITEM_TYPE eq 'COUNTRY'";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		};	
		var countryDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		opts.selectedKey = defaultCycle;//cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(countryDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, countryDropdownBox, opts);
		//PLANT, CYCLE cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_CYCLE(INPUT_CYCLE='" + selectedKey + "')/Results?$format=json&$filter=ITEM_TYPE eq 'PLANT'";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		};	
		var plantDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		opts.selectedKey = defaultCycle;//cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(plantDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, plantDropdownBox, opts);
		//ITEM_TYPE, CYCLE cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_CYCLE(INPUT_CYCLE='" + selectedKey + "')/Results?$format=json&$filter=ITEM_TYPE eq 'ITEM_TYPE'";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		};	
		var itemTypeDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Item Type")[0];
		opts.selectedKey = defaultCycle;//cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(itemTypeDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, itemTypeDropdownBox, opts);
		//BRAND, CYCLE cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_CYCLE(INPUT_CYCLE='" + selectedKey + "')/Results?$format=json&$filter=ITEM_TYPE eq 'BRAND'";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		};	
		var brandDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		opts.selectedKey = defaultCycle;//cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(brandDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, brandDropdownBox, opts);
		//BOM_PLANT, CYCLE cascade	
		var opts = {
			transform: function (data){
				return data.d.results;
			},
			url: function(selectedKey){
				return oServiceUrl+"/IN_CYCLE(INPUT_CYCLE='" + selectedKey + "')/Results?$format=json&$filter=ITEM_TYPE eq 'BOM_PLANT'";
			},
			bindTextField:"ITEM_VALUE",
			bindKeyField:"ITEM_VALUE"
		};	
		var bomPlantDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "BOM Plant")[0];
		opts.selectedKey = defaultCycle;//cycleDropdownBox.getValue();
		lenovo.control.commontable.Toolkit.reReloadDropdownBox(bomPlantDropdownBox, opts);
		lenovo.control.commontable.Toolkit.relateDropDwonBox(cycleDropdownBox, bomPlantDropdownBox, opts);
		
		/******************************************
		 * End by Chris Gao
		 * 2015-10-16
		 *****************************************/
		//app
		var app = new sap.m.App(); 
	    var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header, filterPanel, oEditDeleteUploadDownload, table]//[layout]                
	    });
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	

	},
	reloadItemDropdownTable: function(dropdownTable){
		var cycle = this.cycleDropdownBox.getValue();
		var bindUrl = "/IN_CYCLE(INPUT_CYCLE='"+ cycle +"')/Results?$filter=ITEM_TYPE eq 'ITEM'";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchItemDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
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
			})]
		}
		//
		var bindUrl = "/IN_CYCLE(INPUT_CYCLE='"+ cycle +"')/Results?";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Cost Model List") {
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