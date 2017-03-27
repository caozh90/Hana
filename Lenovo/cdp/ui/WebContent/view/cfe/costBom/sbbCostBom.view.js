/************************************
* Created by Chris Gao at 2015-8-14
* Version 1.0 2015-08-14
* Version 1.0
************************************/

//require what you need
/******Copy_Change_Start*******/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Validation");
/******Copy_Change_End*******/	

//main
/******Copy_Change_Start*******/
sap.ui.jsview("lenovo.view.cfe.costBom.sbbCostBom", { 
	
	displayAllRows: function(oTableTree){ //add by zhaodan1
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);	//modified by Chris Gao 2015-09-14
		var rowHeight = 30;
		var visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight);
		oTableTree.setVisibleRowCount(visibleRowCount);	
	},
	getControllerName: function() {

	},
	
	//Create Page Content including all the UI items
	createContent: function(){
		
		//declare app
		var app = new sap.m.App();
		//declare service url
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();        //model service url
		this.oServiceUrl = oServiceUrl;
		
		//declare authorization
		/******Copy_Change_Start*******/
		var auth = lenovo.control.commontable.Table.getViewAuth("sbbCostBom");
		//set page parameters
		this.auth = auth;
		/******Copy_Change_End*******/

		/******Copy_Change_Start*******/
		//set header
		var headerInfo = lenovo.control.commontable.Table.createHeader("Cost Bom", "SBB Cost Bom");
		/******Copy_Change_End*******/

		var initialHeaderInfo = this.getTableHeaderLabel("CURRENT", oServiceUrl);
		var oTreeTable = this.createTreeTable(initialHeaderInfo);
		var filterConfig = this.setFilterConfig(oTreeTable);
		var filterPanel = lenovo.control.commontable.Table.createFilter(filterConfig);
		var oForm = filterPanel.getContent()[0];
		this.oForm = oForm;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);		
		
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this.cycleDropdownBox = cycleDropdownBox;
		var sbbDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "SBB")[0];
		this.sbbDropdownBox = sbbDropdownBox;
		var plantDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		this.plantDropdownBox = plantDropdownBox;
		
		this.setFilterControlRelation(filterPanel, oServiceUrl);
		var treeTableBar = this.createTreeTableBar(oTreeTable);
		
		//generate page into app
		var page = new sap.m.Page({
	      	  showHeader: false,
	      	  content :[headerInfo, filterPanel, treeTableBar, oTreeTable]                
	    }).addStyleClass("cto-cost-bom");
		this.page = page;
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
		
	},
	
	onTreeNavigation:function(sChannel, sEvent, oData){
		if(oData.view === "SBB Cost BOM") {
			if(this.treeTable) {
				this.treeTable.clearSelection();
				this.treeeModel.setData();
				this.treeeModel.refresh(true);				
			}	
			if(this.fatherTable){
				this.fatherTable.unbindRows();
			}
			if(this.childTable){
				this.childTable.unbindRows();
			}
			var filterModel = new sap.ui.model.json.JSONModel();				
			var clearObj = this.oForm.data("clearObj");
			var obj = JSON.stringify(clearObj);
			lenovo.control.commontable.Table._clearAllFilterCondition(filterModel, this.oForm, obj);
			var oBrand = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Brand")[0];
			oBrand.setValue("");
			var oFamily = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Family")[0];
			oFamily.setValue("");	
		}
	},
	
	getTableHeaderLabel: function(cycle, oServiceUrl){
		var header = {};
		var months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18"];
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='" + cycle + "')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results[0];
				if(oResult) {
					for(var i = 0; i < months.length; i++) {
						header[months[i]] = oResult[months[i]];
					}
				}
			}
		});
		return header;
	},
	
	createTreeTable: function(initialHeaderInfo){
		var that = this;
		var treeTableConfig = {
			visibleRowCount: 5
		};
		treeTableConfig.columns = [{
			label: "Part",
			field: "CHILDREN",
			width: "150px",
			type: "TextField"
		},{
			label: "Part description",
			field: "ITEM_DESC",
			width: "150px",
			type: "TextField"
		},{
			label: "LV",
			field: "LV",
			width: "80px",
			type: "TextField"
		},{
			label: "BOM Quantity",
			field: "QTYPER",
			width: "130px",
			type: "TextField"
		},{
			label: "AltGroup",
			field: "ALTGRUP",
			width: "130px",
			type: "TextField"
		},{
			label: "AltPri",
			field: "ALTPRI",
			width: "130px",
			type: "TextField"
		},{
			label: "AltPercentage",
			field: "ALTPERCENT",
			width: "130px",
			type: "TextField"
		},{
			label: "CostName",
			field: "COST_NAME",
			width: "130px",
			type: "TextField"
		}];
		$.each(initialHeaderInfo, function(key, value){
			treeTableConfig.columns.push({
				field: key,
				label: value + "E",
				type: "TextField",
				width: "100px"
			});
		});
		$.each(initialHeaderInfo, function(key, value){
			treeTableConfig.columns.push({
				field: "L" + key,
				label: value + "L",
				type: "TextField",
				width: "100px"
			});
		});
		var oTreeTable = lenovo.control.commontable.Table.createTreeTable(treeTableConfig);
		this.displayAllRows(oTreeTable);//added by zhaodan1
		this.treeTable = oTreeTable;
		
		oTreeTable.setFixedColumnCount(2).setShowNoData(false);  
		oTreeTable.attachToggleOpenState(function(oEvent){
			that.toggleOpenState(oEvent);
		});
		this.treeeModel = new sap.ui.model.json.JSONModel();
		this.expendRecord = {};
		oTreeTable.setModel(this.treeeModel);
		oTreeTable.bindRows("/root");
        return oTreeTable;
	},
	
	_cache_size_limit: 0,
	
	refreshTreeDataModel: function(oTreeTable, filterModel){
		var oModel = oTreeTable.getModel();
		var that = this;
		var filter = this._getFilterCondition(filterModel);
		
		var model = filterModel.getProperty("/MODEL/filterValue");
		var plant = filterModel.getProperty("/PLANT/filterValue");
		var country = filterModel.getProperty("/COUNTRY/filterValue");
		
		//added by Chris Gao 2015-10-30
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var fatherFilter = "$filter=CYCLE eq '" + cycle + "'";
		
		//var url = this.oServiceUrl + "/UI_SBB_COSTBOM_SBB_FATHER?" + filter + "&orderby=MODEL asc&$format=json";
		var url = this.oServiceUrl + "/INPUT_UI_SBB_COSTBOM_SBB_FATHER(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "')/Results?" + fatherFilter +"&orderby=CHILDREN asc&$format=json";
		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			success: function(data){
				//To process threshold data with limit 100 - 2016-07-11
				var dataLength = 1000;
				if(data.d != undefined && data.d.results != undefined)
				{
					dataLength = data.d.results.length;
				}
				that._cache_size_limit = dataLength;
				oModel.setSizeLimit(dataLength);
				//end 2016-07-11
				data = that._transformTreeData(data);
				oModel.setData(data);
				that.expendRecord = {};
				for(var i = 0; i < that.treeTableCount; i++) {
					oTreeTable.collapse(i);
				}
				oTreeTable.setFirstVisibleRow(0);
				oTreeTable.setBusy(false);
			},
			error: function(){
				oModel.setData({root: {}});
				oTreeTable.setBusy(false);
			}
		});
	},
	
	toggleOpenState: function(oEvent){
		var oRowContext = oEvent.getParameter("rowContext");
		var bExpanded = oEvent.getParameter("expanded");
		var path = oRowContext.getPath();
		if(bExpanded && (!this.expendRecord[path])) {
			this.treeTable.setBusy(true);
			this.expendRecord[path] = true;
//			var father = this.treeeModel.getProperty("MODEL", oRowContext);  //modified by Chris Gao 2015-09-14
			var father = this.treeeModel.getProperty("CHILDREN", oRowContext);  //modified by Chris Gao 2015-10-31
			var childrenData = this.loadTreeTableChildrenData(father, this.treeTable);
			this.treeeModel.setProperty(path + "/0" , childrenData);
			this.treeTable.setBusy(false);
		}
	},
	
	_getFilterCondition: function(filterModel){
		var all = lenovo.control.Constants.allDropdownBoxListItem;
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var model = filterModel.getProperty("/MODEL/filterValue");
		var plant = filterModel.getProperty("/PLANT/filterValue");
		var brand = filterModel.getProperty("/BRAND/filterValue");
		var family = filterModel.getProperty("/FAMILY/filterValue");
		var filter = "$filter=CYCLE eq '" + cycle + "' and MODEL eq '" + model + "'" ;
		if(plant && plant !== all) {
			filter += " and PLANT eq '" + plant + "'";
		}
//		if(brand && brand !== all) {
//			filter += " and BRAND eq '" + brand + "'";
//		}
//		if(family && family !== all) {
//			filter += " and FAMILY eq '" + family + "'";
//		}
		return filter;
	},
	
	//added by Chris Gao 2015-10-30
	_getFatherFilterCondition: function(filterModel){
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var filter = "$father_filter=CYCLE eq '" + cycle + "'";
		return filter;
	},
	
	_transformTreeData: function(data){
		var results = data && data.d && data.d.results || [];
		var obj = {root: {}};
		this.treeTableCount = results.length;
		for(var i = 0; i < results.length; i++) {
			obj.root[i] = results[i];
			obj.root[i][0] = {};
			delete obj.root[i].CTOCOSTBOM_TREETABLE_SHOW;
			delete obj.root[i].__metadata;
		}
		return obj;
	},
	
	loadTreeTableChildrenData: function(father, oTreeTable){
		var filter = this._getFilterCondition(this.filterModel);
		
		var model = this.filterModel.getProperty("/MODEL/filterValue");
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		
		var childrenData = [];
		filter += " and FATHER eq '" + father + "'"; //modified by Chris Gao 2015-09-14
		var url = this.oServiceUrl + "/INPUT_UI_SBB_COSTBOM_SBB_CHILDREN(V_PLANT='" + plant + "', V_COUNTRY='" + country + "', V_SBB='" + father + "')/Results?" + filter + "&$orderby= CHILDREN asc&$format=json";
		//var url = this.oServiceUrl + "/UI_SBB_COSTBOM_SBB_CHILDREN?" + filter + "&$format=json";
		
		var that = this;
		var oTreeTableModel = oTreeTable.getModel();
		
		$.ajax({
			url: url,
			async: false,
			type: "GET",
			dataType: "json",
			success: function(data){
				//To process threshold data with limit 100 - 2016-07-11
				
				var dataLength = 1000;
				if(data.d != undefined && data.d.results != undefined)
				{
					dataLength = data.d.results.length;
				}
				
				that._cache_size_limit = that._cache_size_limit + dataLength;
				
				oTreeTableModel.setSizeLimit(that._cache_size_limit);
				//end 2016-07-11
				
				childrenData = data && data.d && data.d.results || [];
				for(var i = 0; i < childrenData.length; i++) {
					delete childrenData[i].CTOCOSTBOM_TREETABLE_SHOW;
					delete childrenData[i].__metadata;
				}
			}
		});
		return childrenData;
	},
	
	expandTreeTable: function(oTreeTable){
		var treeTableCount = this.treeTableCount || 0; 
		if(treeTableCount > 0) {
			for(var i = 0; i <= treeTableCount; i++) {
				oTreeTable.expand(i);
			}
		}
	},
	
	collapseTreeTable: function(oTreeTable){
		var treeTableCount = this.treeTableCount || 0; 
		if(treeTableCount > 0) {
			for(var i = 0; i <= treeTableCount; i++) {
				oTreeTable.collapse(i);
			}
		}
	},
	
	createTreeTableBar: function(oTreeTable){
		var that = this;
		var layout = new sap.ui.layout.HorizontalLayout().addStyleClass("lenovotable-toolbar");
		var oDetailButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://table-view",
				tooltip: "table view",
				press: function(oEvent) {
					that.detailView(oTreeTable, that);
				}
			}).addStyleClass("commontable-toolbar-btn");
			layout.addContent(oDetailButton);
		return layout;
	},
	
	/******************************************
	 * Chris Gao 2015-09-14
	 * click "view detail" button when choose child node
	 *****************************************/
	detailView: function(oTreeTable, that){
		var selectedIndex = oTreeTable.getSelectedIndex();
		if(selectedIndex == -1) {
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select an item", "ERROR", "View detail");
			return;
		}
//		var rows = oTreeTable.getRows();
//		var visibleRowCount = oTreeTable.getVisibleRowCount();
//		var row = rows[selectedIndex % visibleRowCount];
//		var id = row.$().attr("id");
//		id = id + "-fixed";
//		var level = $("#" + id).attr("aria-level");
		
		/**************************************
		 * Modified by Chris Gao
		 * 2015-12-22
		 * to handle father table selected value
		 *************************************/
		var selectedPath = oTreeTable.getContextByIndex(selectedIndex).sPath;
		var selectedModel = oTreeTable.getModel().getProperty(selectedPath);
		var cost_type = selectedModel.COST_NAME;
		var part = selectedModel.CHILDREN;
		//var part = row.getCells()[0].getValue();
		/**************************************
		 * End by Chris Gao
		 *************************************/
		
		//modified by Chris Gao 2015-09-14
		if(cost_type == 'SBB-COST')
		{
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select a child node", "ERROR", "View detail");
			return;
		}
		else 
		{
			if(this.fatherTable !== undefined) {
				this.fatherTable.destroy();
				this.fatherTable = undefined;
			}
			if(this.childTable === undefined) {
				this.childTable = this.createChildOTable();
				//add by zhaodan1 start
				if(this.arrowBar === undefined){					
				}else{
					this.arrowBar.destroy();					
				}
				this.arrowBar = this.createArrowBar(oTreeTable,this.childTable);
				this.page.addContent(this.arrowBar);
				//end
				this.page.addContent(this.childTable);
			}
			this.refreshChildOTable(part, this.childTable);
			/********************************
			 * Modified by Chris Gao 2015-09-15
			 ********************************/
			this.childTable.setVisible(true);
			/************************************
			 * End by Chris Gao
			 ************************************/
			oTreeTable.setVisibleRowCount(8);//zhaodan1
			if(that.oDownUpArrow != undefined) //modified by Chris Gao 
			{
				that.oDownUpArrow.setIcon("sap-icon://navigation-down-arrow");
			}
		}
	},
	
	/******************************************
	 * End by Chris Gao
	 *****************************************/
	
	getTableHeaderLabel: function(cycle, oServiceUrl){
		var header = {};
		var months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16", "M17", "M18"];
		$.ajax({
			url:oServiceUrl+"/V_CYCLE(INPUT_CYCLE='" + cycle + "')/Results?$format=json",
			type:"GET",
			async: false,
			dataType:"json",
			success: function(data){
				var oResult = data.d.results[0];
				if(oResult) {
					for(var i = 0; i < months.length; i++) {
						header[months[i]] = oResult[months[i]];
					}
				}
			}
		});
		return header;
	},
	
	createTable: function(config){	
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);	//modified by Chris Gao 2015-09-14
		var rowHeight = 30;
		config.visibleRowCount = 8;//lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 250);//modified by Chris Gao 2015-09-14
		config.notRefreshTable = true;
		var oModel = new sap.ui.model.odata.ODataModel(this.oServiceUrl, true);
		var oTable =  lenovo.control.commontable.Table.createTable(config);
		oTable.setShowNoData(false);
		oTable.setModel(oModel);
		oModel.attachRequestCompleted(function(){	
			oTable.setBusy(false);
		});
		return oTable;
	},
	
	
	createChildOTable: function(){
		var cycle = this.cycle;
		var headerInfo = this.getTableHeaderLabel(cycle, this.oServiceUrl);
		var columns =  [{
			field: "COST_ELEM", label: "Cost Elem", type: "TextField",width: "100px"
		},{
			field: "CURRENCY_NAME", label: "Currency Name", type:"TextField",width: "100px"
		}];
		$.each(headerInfo, function(key, value){
			columns.push({
				field: key,
				label: value + "E",
				type: "TextField",
				width: "100px"
			});
		});
		//comment by Chris Gao as requirements changed 2015-09-23
//		$.each(headerInfo, function(key, value){
//			columns.push({
//				field: "L" + key,
//				label: value + "L",
//				type: "TextField",
//				width: "100px"
//			});
//		});
//		columns.push({
//			field: "LAST_MODIFIED_BY", label: "Last Moddified By", type: "TextField",width: "100px"
//		});
//		columns.push({
//			field: "LAST_MODIFIED_NAME ", label: "Last Moddified Name", type: "TextField",width: "100px"
//		});
		var config = {columns: columns, bindRowUrl:"/UI_COST_TAPE"};
		var childTable = this.createTable(config);
		childTable.setFixedColumnCount(2);
		childTable.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
//		childTable.setVisibleRowCount(8);
		
		/***********************
		 * Modified by Chris Gao
		 * 2015-09-14
		 **********************/
		childTable.getModel().setDefaultCountMode("None");
		/***********************
		 * End by Chris Gao
		 **********************/
		
		return childTable;
	},
	
	refreshChildOTable: function(child, oTable){
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var cycle = this.filterModel.getProperty("/CYCLE/filterValue");
		oTable.setBusy(true);
		var filter = "$filter=PART_NUMBER eq '" + child + "' and CYCLE eq '" + cycle + "'";
		if(plant && plant !== lenovo.control.Constants.allDropdownBoxListItem) {
			filter += " and PLANT eq '" + plant + "'";
		}
		oTable.bindRows("/UI_COST_TAPE?" + filter);
	},	
	createArrowBar: function(oTreeTable,oTable){ //add by zhaodan1
		var oDownUpArrow = new sap.ui.commons.Button("", {
			icon: "sap-icon://navigation-up-arrow",
			lite: true,
			tooltip: "hide",
			press: function(){
				if (oDownUpArrow.getIcon() == "sap-icon://navigation-down-arrow") {	
					
					oTable.setVisible(false);					
					var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
					var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);	//modified by Chris Gao 2015-09-14
					var rowHeight = 30;
					var visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
					oTreeTable.setVisibleRowCount(visibleRowCount);
					
					setTimeout(function(){oDownUpArrow.setIcon("sap-icon://navigation-up-arrow")},1000);
				}else{
					
					oTable.setVisible(true);
					oTreeTable.setVisibleRowCount(8);
					
					setTimeout(function(){oDownUpArrow.setIcon("sap-icon://navigation-down-arrow")},1000);
				}
				
			}
		});
		this.oDownUpArrow = oDownUpArrow;
			
		var ArrowBar = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 0, 
			defaultSpan: "L6 M3 S12",
			defaultIndent: "L6 M3 S0",
			position: sap.ui.layout.GridPosition.Center ,
			content:[oDownUpArrow]});
		return ArrowBar;
		
	},		
	setFilterConfig: function(oTreeTable, oTable){
	 	var config = {};
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();
		var uServiceUrl = service.getEBGCfeUpload();
		var logicServiceUrl = service.getEBGCfeLogic();
		config.filtersRaw = [{
			field: "CYCLE",
			label: "Cycle",
			type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Cycle is required!"
			}],
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "ITEM_VALUE",
					bindKeyField: "ITEM_VALUE",
					url: oServiceUrl +"/UI_SBB_COSTBOM_SBB_SEARCH_DDL?$filter=ITEM_TYPE eq 'CYCLE' &$orderby=ITEM_VALUE desc&$format=json"
				}				
			}
		}, {
			field: "COUNTRY", label: "Country",type: "DropdownBox", 
//			required: true,
//			validation: [{
//				validType: lenovo.control.Validation.require,
//				errMsg: "Country is required!"
//			}],
			dropdownbox : {
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					value:  lenovo.control.Constants.allDropdownBoxListItem
				}]			
			}
		}, {
			field: "MODEL",
			label: "SBB",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "SBB is required!"
			}],
			dropdowntable : {
				defaultFilterOperator: "EQ", //defaultFilterOp: "EQ",modified by Chris Gao 2015-11-21 changed default contains to eq
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "MODEL",	
				columns: [{
					label: "SBB",
					field: "MODEL",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					label: "SBB",
					field: "SBB",
					type: "MultiTextField",
					multitextfield: {
						//defaultFilterOp: "EQ",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}]],
				_search: {
					func: this.reloadSearchSbbDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadSbbDropdownTable,
					context: this
				}
			}
		}, {
			field: "BRAND", label: "Brand",type: "TextField", 
			textfield : {
				enabled: false			
			}
		}, {
			field: "PLANT", label: "Plant",type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Plant is required!"
			}],
			dropdownbox : {
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					value:  lenovo.control.Constants.allDropdownBoxListItem
				}]			
			}
		}, {
			field: "ASP_PRD_FAMILY", label: "Family",type: "TextField", 
			textfield: {
				enabled: false			
			}
		},{
			field: "SUBGEO", label: "Subgeo",type: "DropdownBox",
			//labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),  
//			required: true,
//			validation: [{
//				validType: lenovo.control.Validation.require,
//				errMsg: "Subgeo is required!"
//			}],
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					key:  lenovo.control.Constants.allDropdownBoxListItem
				}]				
			}
		}];
		this.cycle = "CURRENT";
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(4, config.filtersRaw);
		config._search = {
			args: [oTreeTable, oTable, config],
			func: this._search,
			context: this
		};

		config.download = {
			preCheck: {
				func: this.downloadPreCheck,
				context: this
			},
			urlParam: {
				func: this.downloadUrlParam,
				context: this
			},
			countUrl: {
				func: this.downloadCountUrl,
				context: this
			},
			table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_sbb_cost_bom/CV_UI_SBB_COSTBOM_SBB_FATHER_LAST"',
			columns: ["CHILDREN", "ITEM_DESC", "LV", "QTYPER", "ALTGRUP", "ALTPRI", "ALTPERCENT", "COST_NAME", "M1", "M2", "M3","M4", "M5", "M6","M7", "M8", "M9", "M10", "M11", "M12",
						"M13","M14","M15","M16","M17","M18","LM1", "LM2", "LM3","LM4", "LM5", "LM6","LM7", "LM8", "LM9", "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18"],
					filename: "UI_SBB_COST_BOM",
			roleName: this.auth.exportableRoleName,
			visible: this.auth.exportable
		};
		
		config.batchdownload = {
				header:"SBB Cost Bom",
			    subheader:"Batch Download",
				visible: this.auth.exportable,
				forBatchDownload: true,
				uploadHistoryConfig: {
					url: oServiceUrl,
					bindRowUrl: "/INPUT_CV_SBB_COSTBOM_DOWNLOAD(IN_MODIFIED_BY='" + localStorage.USERNAME + "')/Results",
					defaultSort:[{
						field: "CYCLE",
						bDescending: true
					},{
						field: "ITEM",
						bDescending: true
					}],
					columns:[{
						label: "CYCLE",
						field: "CYCLE",
						type: "TextField"
					},{
						label: "ITEM",
						field: "ITEM",
						type: "TextField"
					},{
						label: "PLANT",
						field: "PLANT",
						type: "TextField"
					}]
					//selectionMode: sap.ui.table.SelectionMode.Single
				},
				deleteConfig:{
					url: logicServiceUrl + "/ui_sbb_costbom_download_delete.xsjs",
					fields:["CYCLE","ITEM","PLANT"]
				},
				deleteAllConfig:{
					url: logicServiceUrl + "/ui_delete_all.xsjs",
					tablename: "UI_SBB_DOWNLOAD"
				},
				upload: {
						url: uServiceUrl + "/ui_sbb_costbom_batch_upload.xsjs",
						excelUrl: "cfe/costBom/ui_sbb_costbom_download_template.xlsx"
				},
				download:{
					url: "/cdp/common/services/getBatchData.xsjs",
					type: "SBB", //"SEO","SBB"
					table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_sbb_cost_bom/CV_UI_SBB_DOWNLOAD"(placeholder."$$in_user$$"=>\'' + localStorage.USERNAME + '\')',
					filterTable: '"_SYS_BIC"."cdp.ebgcfe.models.ui_sbb_cost_bom/CV_UI_SBB_COSTBOM_DOWNLOAD_RECORDS"(placeholder."$$IN_MODIFIED_BY$$"=>\'' + localStorage.USERNAME + '\')',
					filterColumns:["CYCLE","MODEL","PLANT","COUNTRY"],
					columns: ["CHILDREN", "ITEM_DESC", "LV", "QTYPER", "ALTGRUP", "ALTPRI", "ALTPERCENT", "COST_NAME", "M1", "M2", "M3","M4", "M5", "M6","M7", "M8", "M9", "M10", "M11", "M12",
								"M13","M14","M15","M16","M17","M18","LM1", "LM2", "LM3","LM4", "LM5", "LM6","LM7", "LM8", "LM9", "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18"],
					relatedFilter: [{
						name: "BRAND",
						table:'"_SYS_BIC"."cdp.ebgcfe.models.ui_sbb_cost_bom/CV_UI_SBB_COSTBOM_SBB_BRAND_SEARCH_DDL"',
						inputParas:[{label:"input_cycle",field:"CYCLE"},{label:"input_model",field:"MODEL"}],
						select: "BRAND",
						where: ""
					},{
						name: "FAMILY",
						table:'"_SYS_BIC"."cdp.ebgcfe.models.ui_sbb_cost_bom/CV_UI_SBB_COSTBOM_SBB_FAMILY_SEARCH_DDL"',
						inputParas:[{label:"input_cycle",field:"CYCLE"},{label:"input_model",field:"MODEL"}],
						select: "FAMILY",
						where: ""
					}],
					filename: "UI_SBB_COSTBOM_BATCH",
					roleName: this.auth.exportableRoleName
				}
				
			};
		return config;
	},
	
	reloadSbbDropdownTable: function(dropdownTable){
		/*********************************************************
		 * Added by Chris Gao - 2015-09-10
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		dropdownTable.getModel().setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/
//		var oForm = filterPanel.getContent()[0];
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var cycle = this.cycleDropdownBox.getValue();
		
		var bindUrl = "/MODEL_CASCADE(INPUT_CYCLE='" + cycle + "')/Results?$format=json";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchSbbDropdownTable: function(filterModel, filterPanel, table){

//		var oForm = filterPanel.getContent()[0];
//		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		var cycle = this.cycleDropdownBox.getValue();
		
		var filter = filterModel.getProperty("/SBB");
		var filterModel = null;
		if(filter.filterValue.length > 0) {
			filterModel = new sap.ui.model.Filter({
				path: "MODEL",
				operator: filter.filterOperator,
				value1: filter.filterValue
			});
		}
		var bindUrl = "/MODEL_CASCADE(INPUT_CYCLE='" + cycle + "')/Results?$format=json";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	
	downloadPreCheck: function(){
		var model = this.filterModel &&  this.filterModel.getProperty("/MODEL/filterValue");
		if(!model || model.length == 0) {
			lenovo.control.commontable.Toolkit.showErrorMsg("Please firstly click search button then download", "ERROR", "Download");
			return false;
		}
		return true;
	},
	
	downloadCountUrl: function(){
		return 100;
	},
	
	downloadUrlParam: function(){
		
		//modified by Chris Gao 2015-09-14
		//'"_SYS_BIC"."cdp.ebgcfe.models.ui_rpt_whereused/CV_UI_RPT_WHERE_USED2" (placeholder."$$in_cycle$$" => \'CURRENT\', placeholder."$$in_partnumber$$" => \'000000C25127,000000C25128\')'
		var cycle = this.cycleDropdownBox.getValue();
		var model = this.sbbDropdownBox.getValue();
		var plant = this.plantDropdownBox.getValue();
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		
		var filter = this._getFilterCondition(this.filterModel);
		filter = filter.substring(1, filter.length);
		
		//added by Chris Gao 2015-10-30
		var fatherFilter = this._getFatherFilterCondition(this.filterModel);
		fatherFilter = fatherFilter.substring(1, filter.length);
		
		//brand and family header
		var oBrand = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Brand")[0];
		var oFamily = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Family")[0];
		var brandHeaderandValue = "&brandHeader='Brand'&brandValue='" + oBrand.getValue()+"'";
		var familyHeaderandValue = "&familyHeader='Family'&familyValue='" + oFamily.getValue()+"'";
		
		return '&modelIn="$$v_model$$"=>\''+model+'\' and "$$v_plant$$"=>\'' + plant + '\' and "$$v_country$$"=>\'' + country + '\'' + '&childrenModelIn="$$V_PLANT$$"=>\'' + plant + '\' and "$$V_COUNTRY$$"=>\''+ country + '\'' +"&cycle=" + this.cycle + brandHeaderandValue + familyHeaderandValue + "&sortColumn=CHILDREN&headerMapping=true&sortOrder=asc&downloadType=sbb&" + filter + "&" + fatherFilter;
//		return ' (placeholder."$$IN_CYCLE$$"=>\''+cycle+'\', placeholder."$$IN_MODEL$$"=>\''
//		        +model +'\', placeholder."$$IN_PLANT$$"=>\'' + plant + '\')' + "&headerMapping=true&sortColumn=PART,LV&sortOrder=asc&" + filter;

	},
	
	addExpandAllElement: function(filterPanel, oTreeTable){
		var oForm = filterPanel.getContent()[0];
		var that = this;
		var formContainers = oForm.getFormContainers();
		var lastFormContainer = formContainers[formContainers.length - 1];
		var oCollpaseBtn = new sap.ui.commons.Button("ctoCollapse", {
			icon: "sap-icon://collapse",
			lite: true,
			tooltip: "collapse",
			press: function(){
				that.collapseTreeTable(oTreeTable);
			}
		});
		var oExpandBtn = new sap.ui.commons.Button("ctoExpand", {
			icon: "sap-icon://expand",
			lite: true,
			tooltip: "expand",
			press: function(){
				that.expandTreeTable(oTreeTable);
			}
		});
		var oFormElement = new sap.ui.layout.form.FormElement({
			label: "Expand/Collapse",
			fields: [oExpandBtn, oCollpaseBtn]
		});
		oFormElement.getLabelControl().setLayoutData(new sap.ui.layout.GridData({
			span: "L6 M6 S6",
			linebreak: true
		}));
		lastFormContainer.addFormElement(oFormElement);
	},
	
	setFilterControlRelation: function(filterPanel, oServiceUrl){
		var oForm = filterPanel.getContent()[0];
		var oSBB = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "SBB")[0];
		var oPlant = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		var oBrand = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var oSubgeo = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Subgeo")[0];
		var oCountry = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		var oFamily = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Family")[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		oSBB.attachChange(function(){
			var sbb = this.getValue();
			var cycle = cycleDropdownBox.getValue();
			$.ajax({
				type: "GET",
				url: oServiceUrl + "/FAMILY_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$format=json",
				dataType: "json",
				success: function(data){
					//console.log("family data", data);
					if(data.d.results.length > 0)
						oFamily.setValue(data.d.results[0].FAMILY);
					else 
						oFamily.setValue("");
				}
			});
			$.ajax({
				type: "GET",
				url: oServiceUrl + "/BRAND_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$format=json", 
				dataType: "json",
				success: function(data){
					if(data.d.results.length > 0)
						oBrand.setValue(data.d.results[0].BRAND);
					else 
						oBrand.setValue("");
				}
			});
			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oPlant, {
				url: function(){
					return oServiceUrl + "/PLANT_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$filter= ITEM_TYPE eq 'PLANT'&$format=json";
				},
				selectedKey: sbb,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oSubgeo, {
				url: function(){
					return oServiceUrl + "/PLANT_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$filter= ITEM_TYPE eq 'SUBGEO'&$$format=json";
				},
				selectedKey: sbb,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
			lenovo.control.commontable.Toolkit.relateDropDwonBox(oSubgeo, oCountry, {
				url: function(subgeo){
					var sbb = oSBB.getValue(); 
					var cycle = cycleDropdownBox.getValue();
					return oServiceUrl + "/COUNTRY_CASCADE(INPUT_CYCLE='" + cycle + "', INPUT_MODEL = '" + sbb + "', INPUT_SUBGEO = '" + subgeo + "')/Results?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json";
				},
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
		});
		
		
		/*****************************
		 * Modified by Chris Gao
		 * 2015-09-14
		 ******************************/
		cycleDropdownBox.attachChange(function(){
			oSBB.setValue("");
			oPlant.setValue("");
			oFamily.setValue("");
			oBrand.setValue("");
//			var cycle = this.getValue();
//			var sbb = oSBB.getValue();
//			$.ajax({
//				type: "GET",
//				url: oServiceUrl + "/FAMILY_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$format=json",
//				dataType: "json",
//				success: function(data){
//					//console.log("family data", data);
//					if(data.d.results.length > 0)
//						oFamily.setValue(data.d.results[0].FAMILY);
//					else 
//						oFamily.setValue("");
//				}
//			});
//			$.ajax({
//				type: "GET",
//				url: oServiceUrl + "/BRAND_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$format=json", 
//				dataType: "json",
//				success: function(data){
//					if(data.d.results.length > 0)
//						oBrand.setValue(data.d.results[0].BRAND);
//					else 
//						oBrand.setValue("");
//				}
//			});
//			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oPlant, {
//				url: function(){
//					return oServiceUrl + "/PLANT_CASCADE(input_cycle='" + cycle + "', input_model = '" + sbb + "')/Results?$format=json";
//				},
//				selectedKey: sbb,
//				transform: function(data){
//					return data.d.results;
//				},
//				bindTextField: "PLANT",
//				bindKeyField: "PLANT"
//			});
		});
		/***************************
		 * End 2015-09-14
		 **************************/
	},
	
	_search: function(filterModel, oTreeTable, oTable, config, filterPanel){
		var isAllValidated = lenovo.control.commontable.Toolkit._getFilterAllValidted(config, filterPanel);
		if(!isAllValidated)
			return;
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		this.cycle = cycle;
		this.filterModel = filterModel;
		
		this.refreshHeader(cycle, oTreeTable);
		oTreeTable.clearSelection();
		this.refreshTreeDataModel(oTreeTable, filterModel);
		if(this.fatherTable) {
			this.fatherTable.destroy();
			this.fatherTable = undefined;
		}
		if(this.childTable) {
			this.childTable.destroy();
			this.childTable = undefined;
		}
		//added by Chris Gao 2015-09-14
		this.displayAllRows(this.treeTable);
		
	},
	
	refreshHeader: function(cycle, oTreeTable, oTable){
		var header = this.getTableHeaderLabel(cycle, this.oServiceUrl);
		this.refreshOTreeTableHeader(oTreeTable, header);
	},
	
	refreshOTreeTableHeader: function(oTreeTable, header){
		var columns = oTreeTable.getColumns();
		var index = 0, label = "", i;
		var startIndex = 7;
		for(i = 1; i <= 18; i++) {
			index = startIndex + i;
			label = header["M" + i] + "E";
			columns[index].setLabel(new sap.ui.commons.Label({
				text: label
			}));
		}
		startIndex += 18;
		for(i = 1; i <= 18; i++) {
			index = startIndex + i;
			label = header["M" + i] + "L";
			columns[index].setLabel(new sap.ui.commons.Label({
				text: label
			}));
		}
	}
	
});