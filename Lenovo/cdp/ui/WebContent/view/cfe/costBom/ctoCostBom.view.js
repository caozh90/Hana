//Created by maggie at 2014-12-17
//modified by Zhao dan
//modified by Chris Gao 
//modified by Chris Gao 2015-10-26

jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.costBom.ctoCostBom", {
	
	displayAllRows: function(oTableTree){ //add by zhaodan1
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);	
		var rowHeight = 30;
		var visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
		oTableTree.setVisibleRowCount(visibleRowCount);	
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
			label: "FC",
			field: "FC",
			width: "80px",
			type: "TextField"
		},{
			label: "Part description",
			field: "ITEM_DESC",
			width: "150px",
			type: "TextField"
		},{
			label: "LV",
			field: "LVL",
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
		}/*,{
			label: "WEIGHTED AVERAGE",
			field: "WEIGHTED_AVERAGE",
			width: "100px",
			type: "TextField"
		},{
			label: "LATTEST PROCUR",
			field: "LATTEST_PROCUR",
			width: "100px",
			type: "TextField"
		}*/];
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
		// oTreeTable.setFixedColumnCount(8).setShowNoData(false);
		oTreeTable.setFixedColumnCount(2).setShowNoData(false);  // edit by robin @ 2/27
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
		oTreeTable.setBusy(true);
		var filter = this._getFilterCondition(filterModel);
		
		var model = filterModel.getProperty("/MODEL/filterValue");
		var plant = filterModel.getProperty("/PLANT/filterValue");
		var country = filterModel.getProperty("/COUNTRY/filterValue");
		
		//added by Chris Gao 2015-10-30
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var fatherFilter = "$filter=CYCLE eq '" + cycle + "'";
		var children = filterModel.getProperty("/CHILDREN/filterValue");
		if(children != undefined && children != '')
		{
			childrenFilterStr = " and (";
			for(var i =0; i < children.length; i++)
			{
				childrenFilterStr = childrenFilterStr + "CHILDREN eq '" + children[i] + "' or ";
			}
			childrenFilterStr = childrenFilterStr.substring(0, childrenFilterStr.length - 3);
			childrenFilterStr = childrenFilterStr + ")";
			
			fatherFilter = fatherFilter + childrenFilterStr;
			
		}
		var fc = filterModel.getProperty("/FC/filterValue");
		if(fc != undefined && fc != '')
		{
			fatherFilter = fatherFilter + " and FC eq '" + fc + "'";
		}
		
		//var url = this.oServiceUrl + "/INPUT_CV_CTO_COSTBOM_FATHER(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "')/Results?" + filter + "&orderby=CHILDREN asc&$format=json";
		var url = this.oServiceUrl + "/INPUT_CV_CTO_COSTBOM_FATHER(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "')/Results?" + fatherFilter +"&orderby=CHILDREN asc&$format=json";
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
			var father = this.treeeModel.getProperty("CHILDREN", oRowContext);
			var childrenData = this.loadTreeTableChildrenData(father, this.treeTable);
			this.treeeModel.setProperty(path + "/0" , childrenData);
			this.treeTable.setBusy(false);
		}
	},
	_getFilterCondition: function(filterModel){
		var all = lenovo.control.Constants.allDropdownBoxListItem;
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var model = filterModel.getProperty("/MODEL/filterValue");
//		var plant = filterModel.getProperty("/PLANT/filterValue");
//		var subgeo = filterModel.getProperty("/SUBGEO/filterValue");
//		var country = filterModel.getProperty("/COUNTRY/filterValue");
//		var filter = "$filter=CYCLE eq '" + cycle + "'";
//		var filter = "$filter=CYCLE eq '" + cycle + "' and CHILDREN eq '" + model + "'" ;
		var filter = "$filter=CYCLE eq '" + cycle + "' and MODEL eq '" + model + "'" ;//
//		if(plant && plant !== all) {
//			filter += " and PLANT eq '" + plant + "'";
//		}
//		if(subgeo && subgeo !== all) {
//			filter += " and SUBGEO eq '" + subgeo + "'";
//		}
//		if(country && country !== all) {
//			filter += " and COUNTRY eq '" + country + "'";
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
//		var that = this;
		var filter = this._getFilterCondition(this.filterModel);
		
		var model = this.filterModel.getProperty("/MODEL/filterValue");
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		
		var childrenData = [];
//		filter += " and FATHER eq '" + father + "'";
		var url = this.oServiceUrl + "/INPUT_CV_CTO_COSTBOM_CHILDREN_LAST(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "', v_sbb='" + father + "')/Results?" + filter + "&$format=json";
		//var url = this.oServiceUrl + "/CV_CTO_COSTBOM_CHILDREN?" + filter + "&$format=json";
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
					that.detailView(oTreeTable);
					oTreeTable.setVisibleRowCount(8);//zhaodan1
					that.oDownUpArrow.setIcon("sap-icon://navigation-down-arrow");
				}
			}).addStyleClass("commontable-toolbar-btn");
			layout.addContent(oDetailButton);
		return layout;
	},
	detailView: function(oTreeTable){
		var selectedIndex = oTreeTable.getSelectedIndex();
		if(selectedIndex == -1) {
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select an item", "ERROR", "View detail");
			return;
		}
		//comment by Chris Gao 2015-12-22
//		var rows = oTreeTable.getRows();
//		var visibleRowCount = oTreeTable.getVisibleRowCount();
//		var row = rows[selectedIndex % visibleRowCount];
		
//		var id = row.$().attr("id");
//		id = id + "-fixed";
//		var level = $("#" + id).attr("aria-level");
		
		//var part = row.getCells()[0].getValue(); //comment by Chris Gao
		
		/**************************************
		 * Modified by Chris Gao
		 * 2015-11-16
		 * to handle father table selected value
		 *************************************/
		var selectedPath = oTreeTable.getContextByIndex(selectedIndex).sPath;
		var selectedModel = oTreeTable.getModel().getProperty(selectedPath);
		var cost_type = selectedModel.COST_NAME; //get Cost Name 
		/**************************************
		 * Modified by Chris Gao
		 * 2015-12-22
		 * to handle father table selected value
		 *************************************/
		var part = selectedModel.CHILDREN; //get Part Number (Father)
		
		
//		if(level == 1) {
		if(cost_type == 'SBB-COST') {
			if(this.childTable !== undefined) {
				this.childTable.destroy();
				this.childTable = undefined;
			}
			if(this.fatherTable === undefined) {
				this.fatherTable = this.createFatherOTable(part);//modified by Chris Gao 2015-10-28
				//add by zhaodan1 start
				if(this.arrowBar === undefined){					
				}else{
					this.arrowBar.destroy();					
				}
				this.arrowBar = this.createArrowBar(oTreeTable,this.fatherTable);				
				this.page.addContent(this.arrowBar);
				//end	
				this.page.addContent(this.fatherTable);
			}
			this.refreshFatherOTable(part, this.fatherTable);
			/********************************
			 * Modified by Chris Gao 2015-09-15
			 ********************************/
			this.fatherTable.setVisible(true);
			/************************************
			 * End by Chris Gao
			 ************************************/

			
		} 
//		else if(level == 2) {	
		else if(cost_type == 'COMP-COST') {
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
	createTable: function(config){	
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(2);	
		var rowHeight = 30;
		config.visibleRowCount = 8;//lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 240);
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
	createFatherOTable: function(father){
		var cycle = this.cycle;
		var headerInfo = this.getTableHeaderLabel(cycle, this.oServiceUrl);
		var columns =  [{
			field: "COST_NAME", label: "Cost Name", type: "TextField",width: "100px"
		},{
			field: "COST_LVL", label: "Cost Lvl", type: "TextField",width: "100px"
		}/*,{
			field: "WEIGHTED_AVERAGE", label: "WEIGHTED AVERAGE", type:"TextField",width: "100px"
		},{
			field: "LATTEST_PROCUR", label: "LATTEST PROCUR", type:"TextField",width: "100px"
		}*/];
		$.each(headerInfo, function(key, value){
			columns.push({
				field: key,
				label: value + "E",
				type: "TextField",
				width: "100px"
			});
		});
		$.each(headerInfo, function(key, value){
			columns.push({
				field: "L" + key,
				label: value + "L",
				type: "TextField",
				width: "100px"
			});
		});
		
		var model = this.filterModel.getProperty("/MODEL/filterValue");
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		
//		var config = {columns: columns, bindRowUrl:"/INPUT_CV_UI_CTO_COSTBOM_LIST(V_MODEL='" + model + "', V_PLANT='" + plant + "', V_COUNTRY='" + country + "', V_SBB='" + father + "')/Results"};
		
		
		var config = {columns: columns, bindRowUrl:"/CV_UI_CTO_COSTBOM_LIST_LAST"};
		var fatherTable = this.createTable(config).addStyleClass("cto-father-table");
		fatherTable.setFixedColumnCount(2);
		//fatherTable.setVisibleRowCount(visibleRowCount);
		
		fatherTable.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		
		/***********************
		 * Modified by Chris Gao
		 * 2015-09-15
		 **********************/
		fatherTable.getModel().setDefaultCountMode("None");
		/***********************
		 * End by Chris Gao
		 **********************/
		
		return fatherTable;
	},
	refreshFatherOTable: function(father, oTable){
		var model = this.filterModel.getProperty("/MODEL/filterValue");
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var cycle = this.filterModel.getProperty("/CYCLE/filterValue");
		var subgeo = this.filterModel.getProperty("/SUBGEO/filterValue");
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		oTable.setBusy(true);
		var filter = "$filter=MODEL eq '" + model + "' and FATHER eq '" + father + "' and CYCLE eq '" + cycle + "'";
		if(plant && plant !== lenovo.control.Constants.allDropdownBoxListItem) {
			filter += " and PLANT eq '" + plant + "'";
		}
		if(subgeo && subgeo !== lenovo.control.Constants.allDropdownBoxListItem) {
			filter += " and SUBGEO eq '" + subgeo + "'";
		}
		if(country && country !== lenovo.control.Constants.allDropdownBoxListItem) {
			filter += " and COUNTRY eq '" + country + "'";
		}
		
		var sort = "&$orderby= COST_LVL, length(COST_NAME) asc";
//		oTable.bindRows("/INPUT_CV_UI_CTO_COSTBOM_LIST(V_MODEL='" + model + "', V_PLANT='" + plant + "', V_COUNTRY='" + country + "', V_SBB='" + father + "')/Results?" + filter + sort);
		oTable.bindRows("/CV_UI_CTO_COSTBOM_LIST_LAST?" + filter + sort);
		
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
		$.each(headerInfo, function(key, value){
			columns.push({
				field: "L" + key,
				label: value + "L",
				type: "TextField",
				width: "100px"
			});
		});
		columns.push({
			field: "LAST_MODIFIED_BY", label: "Last Moddified By", type: "TextField",width: "100px"
		});
		columns.push({
			field: "LAST_MODIFIED_NAME ", label: "Last Moddified Name", type: "TextField",width: "100px"
		});
		var config = {columns: columns, bindRowUrl:"/CFE_UI_COST_TAPE"};
		
		var childTable = this.createTable(config);
		childTable.setFixedColumnCount(2);
		
		childTable.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		
		/***********************
		 * Modified by Chris Gao
		 * 2015-09-15
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
		oTable.bindRows("/CFE_UI_COST_TAPE?" + filter);
		
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
					var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);	
					var rowHeight = 30;
					var visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 10);
					oTreeTable.setVisibleRowCount(visibleRowCount);
					
					//oDownUpArrow.setIcon("sap-icon://navigation-up-arrow");
					//updated by Chris Gao 2015-09-24
					setTimeout(function(){oDownUpArrow.setIcon("sap-icon://navigation-up-arrow")},1000);
				}else{
					
					oTable.setVisible(true);
					oTreeTable.setVisibleRowCount(8);
					
					//oDownUpArrow.setIcon("sap-icon://navigation-down-arrow");
					//updated by Chris Gao 2015-09-24
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
	reloadAssemblyDropdownTable: function(dropdownTable){
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
		var cycle = this.cycleDropdownBox.getValue();
		var bindUrl = "/INPUT_CV_UI_CTO_COSTBOM_MODEL(V_CYCLE='"+ cycle +"')/Results?$select=MODEL";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchAssemblyDropdownTable: function(filterModel, filterPanel, table){
		var cycle = this.cycleDropdownBox.getValue();
		var filter = filterModel.getProperty("/MODEL");
		/*********************************
		 * added by Chris Gao 2015-12-22
		 * process filter value null
		 *******************************/
		var filterValue = filter.filterValue;
		if(filterValue == null || filterValue == '')
		{
			filterValue = "''";
		}
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "MODEL",
				operator: filter.filterOperator,
				value1: filterValue //filter.filterValue
			});
		}
		var bindUrl = "/INPUT_CV_UI_CTO_COSTBOM_MODEL(V_CYCLE='"+ cycle +"')/Results?$select=MODEL";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadSBBDropdownTable: function(dropdownTable){
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
		var cycle = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Cycle")[0].getValue();//this.cycleDropdownBox.getValue();
		var model = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Assembly")[0].getValue();
		var plant = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Plant")[0].getValue();
		var country = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Country")[0].getValue();
		var bindUrl = "/INPUT_CV_UI_CTO_COSTBOM_SBB(V_CYCLE='"+ cycle +"', V_MODEL='"+ model +"', V_PLANT='"+ plant +"',V_COUNTRY='"+ country +"')/Results?$select=CHILDREN";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchSBBDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/CHILDREN");
		/*********************************
		 * added by Chris Gao 2015-12-22
		 * process filter value null
		 *******************************/
		var filterValue = filter.filterValue;
		if(filterValue == null || filterValue == '')
		{
			filterValue = "''";
		}
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "CHILDREN",
				operator: filter.filterOperator,
				value1: filterValue //filter.filterValue
			});
		}
		var cycle = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Cycle")[0].getValue();//this.cycleDropdownBox.getValue();
		var model = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Assembly")[0].getValue();
		var plant = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Plant")[0].getValue();
		var country = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Country")[0].getValue();
		var bindUrl = "/INPUT_CV_UI_CTO_COSTBOM_SBB(V_CYCLE='"+ cycle +"', V_MODEL='"+ model +"', V_PLANT='"+ plant +"',V_COUNTRY='"+ country +"')/Results?$select=CHILDREN";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
	},
	reloadFCDropdownTable: function(dropdownTable){
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
		var cycle = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Cycle")[0].getValue();//this.cycleDropdownBox.getValue();
		var model = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Assembly")[0].getValue();
		var plant = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Plant")[0].getValue();
		var country = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Country")[0].getValue();
		var bindUrl = "/INPUT_CV_UI_CTO_COSTBOM_FC(V_CYCLE='"+ cycle +"', V_MODEL='"+ model +"', V_PLANT='"+ plant +"',V_COUNTRY='"+ country +"')/Results?$select=FC";
		dropdownTable.setBusy(true);
		dropdownTable.clearSelection();
		dropdownTable.bindRows(bindUrl);
	},
	reloadSearchFCDropdownTable: function(filterModel, filterPanel, table){
		
		var filter = filterModel.getProperty("/FC");
		/*********************************
		 * added by Chris Gao 2015-12-22
		 * process filter value null
		 *******************************/
		var filterValue = filter.filterValue;
		if(filterValue == null || filterValue == '')
		{
			filterValue = "''";
		}
		var filterModel = null;
		if(filter.filterValue) {
			filterModel = new sap.ui.model.Filter({
				path: "FC",
				operator: filter.filterOperator,
				value1: filterValue //filter.filterValue
			});
		}
		var cycle = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Cycle")[0].getValue();//this.cycleDropdownBox.getValue();
		var model = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Assembly")[0].getValue();
		var plant = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Plant")[0].getValue();
		var country = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Country")[0].getValue();
		var bindUrl = "/INPUT_CV_UI_CTO_COSTBOM_FC(V_CYCLE='"+ cycle +"', V_MODEL='"+ model +"', V_PLANT='"+ plant +"',V_COUNTRY='"+ country +"')/Results?$select=FC";
		table.setBusy(true);
		table.clearSelection();
		table.bindRows(bindUrl,  null, null, filterModel);
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
			dropdownbox : {
				defaultFilterValue: "CURRENT",
				odata:{
					defaultSelectAll: false,
					bindTextField: "CYCLE",
					bindKeyField: "CYCLE",
					url: oServiceUrl +"/UI_CTO_COSTBOM_CYCLE_DDL?$select=CYCLE&$orderby=CYCLE desc&$format=json"
				}				
			}
		}, {
			field: "COUNTRY", label: "Country",type: "DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Country is required!"
			}],
			dropdownbox : {
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					value:  lenovo.control.Constants.allDropdownBoxListItem
				}]			
			}
		}, {
			field: "MODEL_FAMILY", label: "Family",type: "TextField", 
			textfield: {
				enabled: false			
			}
		}, {
			field: "MODEL",
			label: "Assembly",
			type: "DropdownTable",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Assembly is required!"
			}],
			dropdowntable : {
				defaultFilterOperator: "EQ", //defaultFilterOp: "EQ",modified by Chris Gao 2015-11-21 changed default contains to eq
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "MODEL",	
				columns: [{
					label: "Assembly",
					field: "MODEL",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "MODEL",
					label: "Assembly",
					type: "MultiTextField",
					multitextfield: {
						//defaultFilterOp: "EQ",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}]],
				_search: {
					func: this.reloadSearchAssemblyDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadAssemblyDropdownTable,
					context: this
				}
			}
		}, {
			field: "PLANT", label: "Plant",type: "DropdownBox", 
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Plant is required!"
			}],
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L6 M6 S6"}),
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					key:  lenovo.control.Constants.allDropdownBoxListItem
				}]				
			}
		},{
			field: "CHILDREN",
			label: "SBB",
			type: "DropdownTable",
			dropdowntable : {
				defaultFilterOperator: "EQ",
				url: oServiceUrl,
				//selectionMode: sap.ui.table.SelectionMode.Single,
				field: "CHILDREN",	
				columns: [{
					label: "SBB",
					field: "CHILDREN",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "CHILDREN",
					label: "SBB",
					type: "MultiTextField",
					multitextfield: {
						//defaultFilterOp: "EQ",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}]],
				_search: {
					func: this.reloadSearchSBBDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadSBBDropdownTable,
					context: this
				}
			}
		}, {
			field: "SUBGEO", label: "Subgeo",type: "DropdownBox",
			//labelLayout: new sap.ui.layout.GridData({span: "L4 M4 S4", linebreak: true}),  
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Subgeo is required!"
			}],
			dropdownbox : {
				//layout: new sap.ui.layout.GridData({span: "L8 M8 S8"}),
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					key:  lenovo.control.Constants.allDropdownBoxListItem
				}]				
			}
		}, {
			field: "MODEL_BRAND", label: "Brand",type: "TextField", 
			textfield: {
				enabled: false			
			}
//			dropdownbox : {
//				//layout: new sap.ui.layout.GridData({span: "L6 M6 S6"}),
//				data: [{
//					text: lenovo.control.Constants.allDropdownBoxListItem,
//					key:  lenovo.control.Constants.allDropdownBoxListItem
//				}]				
//			}
		},{
			field: "FC",
			label: "FC",
			type: "DropdownTable",
			dropdowntable : {
				defaultFilterOperator: "EQ", 
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
				field: "FC",	
				columns: [{
					label: "FC",
					field: "FC",
					type: "TextField"
				}],
				notRefreshTable: true,
				filters: [[{
					field: "FC",
					label: "FC",
					type: "MultiTextField",
					multitextfield: {
						//defaultFilterOp: "EQ",
						type: new lenovo.control.commontable.singleQuotes()
					}
				}]],
				_search: {
					func: this.reloadSearchFCDropdownTable,
					context: this
				},
				reload: {
					func: this.reloadFCDropdownTable,
					context: this
				}
			}
		}];
		this.cycle = "CURRENT";
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
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
			//table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/INPUT_CV_CTO_COSTBOM_FATHER(V_MODEL=\'' + model + '\', V_PLANT=\'' + plant + '\', V_COUNTRY=\'' + country + '\')',
			table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM_FATHER"',
			columns: ["CHILDREN", "FC", "ITEM_DESC", "LVL", "QTYPER", "ALTGRUP", "ALTPRI", "ALTPERCENT", "COST_NAME", "M1", "M2", "M3","M4", "M5", "M6","M7", "M8", "M9", "M10", "M11", "M12",
				"M13","M14","M15","M16","M17","M18","LM1", "LM2", "LM3","LM4", "LM5", "LM6","LM7", "LM8", "LM9", "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18"],
			filename: "UI_CTO_COSTBOM",
			roleName: this.auth.exportableRoleName,
			visible: this.auth.exportable
		};
		
		config.batchdownload = {
		    header:"CTO Cost Bom",
		    subheader:"Batch Download",
			visible: this.auth.exportable,
			forBatchDownload: true,
			uploadHistoryConfig: {
				url: oServiceUrl,
				bindRowUrl: "/INPUT_CV_CTO_COSTBOM_DOWNLOAD(IN_MODIFIED_BY='" + localStorage.USERNAME + "')/Results",
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
				},{
					label: "COUNTRY",
					field: "COUNTRY",
					type: "TextField"
				}]
				//selectionMode: sap.ui.table.SelectionMode.Single
			},
			deleteConfig:{
				url: logicServiceUrl + "/ui_cto_costbom_download_delete.xsjs",
				fields:["CYCLE","ITEM","PLANT","COUNTRY"]
			},
			deleteAllConfig:{
				url: logicServiceUrl + "/ui_delete_all.xsjs",
				tablename: "UI_CTO_DOWNLOAD"
			},
			upload: {
					url: uServiceUrl + "/ui_cto_costbom_batch_upload.xsjs",
					excelUrl: "cfe/costBom/ui_costbom_download_template.xlsx"
			},
			download:{
				url: "/cdp/common/services/getBatchData.xsjs",
				type: "CTO", //"SEO","SBB"
				table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_DOWNLOAD"(placeholder."$$in_user$$"=>\'' + localStorage.USERNAME + '\')',
				filterTable: '"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/CV_UI_COSTBOM_DOWNLOAD"(placeholder."$$IN_MODIFIED_BY$$"=>\'' + localStorage.USERNAME + '\')',
				filterColumns:["CYCLE","MODEL","PLANT","COUNTRY"],
				columns: ["CHILDREN", "FC", "ITEM_DESC", "LVL", "QTYPER", "ALTGRUP", "ALTPRI", "ALTPERCENT", "COST_NAME", "M1", "M2", "M3","M4", "M5", "M6","M7", "M8", "M9", "M10", "M11", "M12",
							"M13","M14","M15","M16","M17","M18","LM1", "LM2", "LM3","LM4", "LM5", "LM6","LM7", "LM8", "LM9", "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18"],
				relatedFilter: [{
					name: "BRAND",
					table:'"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM_SEARCH_DDL"',
					inputParas:[{label:"V_CYCLE",field:"CYCLE"},{label:"V_MODEL",field:"MODEL"}],
					select: "ITEM_VALUE",
					where: "ITEM_TYPE='BRAND'"
				},{
					name: "FAMILY",
					table:'"_SYS_BIC"."cdp.ebgcfe.models.ui_cto_costbom/CV_UI_CTO_COSTBOM_S_FAMILY_DDL"',
					inputParas:[{label:"V_CYCLE",field:"CYCLE"},{label:"V_MODEL",field:"MODEL"}],
					select: "ITEM_VALUE",
					where: "ITEM_TYPE='FAMILY'"
				}],
				filename: "UI_CTO_COSTBOM_BATCH",
				roleName: this.auth.exportableRoleName
			}
			
		};
		
		return config;
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
		
		//PLANT AND COUNTRY
		var oPlant = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Plant")[0];
		var oCountry = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Country")[0];
		var plantHeaderandValue = "&plantHeader='Plant'&plantValue='" + oPlant.getValue()+"'";
		var countryHeaderandValue = "&countryHeader='Country'&countryValue='" + oCountry.getValue()+"'";
		
		//SBB AND FC
		var oSBB = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "SBB")[0];
		var oFC = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "FC")[0];
		var sbbHeaderandValue = "";
		var fcHeaderandValue = "";
		if(oSBB.getValue() !== "")
		{
			sbbHeaderandValue = "&sbbHeader='SBB'&sbbValue='" + oSBB.getValue()+"'";
		}
		if(oFC.getValue() !== "")
		{
			fcHeaderandValue = "&fcHeader='FC'&fcValue='" + oFC.getValue()+"'";
		}
		
		var model = this.filterModel.getProperty("/MODEL/filterValue");
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		//INPUT_CV_CTO_COSTBOM_FATHER(V_MODEL='" + model + "', V_PLANT='" + plant + "', V_COUNTRY='" + country + "'
		return '&modelIn="$$v_model$$"=>\''+model+'\' and "$$v_plant$$"=>\'' + plant + '\' and "$$v_country$$"=>\'' + country + '\'' + '&childrenModelIn="$$v_model$$"=>\''+model+'\' and "$$v_plant$$"=>\'' + plant + '\' and "$$v_country$$"=>\''+ country + '\'' +"&cycle=" + this.cycle + brandHeaderandValue + familyHeaderandValue + plantHeaderandValue + countryHeaderandValue + sbbHeaderandValue + fcHeaderandValue + "&sortColumn=CHILDREN&headerMapping=true&sortOrder=asc&downloadType=cto&" + filter + "&" + fatherFilter;
		//return "&cycle=" + this.cycle + "&sortColumn=CHILDREN&headerMapping=true&sortOrder=asc&downloadType=cto&" + filter;
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
		var oAssembly = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Assembly")[0];
		var oPlant = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		var oBrand = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Brand")[0];
		var oFamily = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Family")[0];
		var oSubgeo = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Subgeo")[0];
		var oCountry = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		oCountry.attachChange(function(){
			var country = this.getValue();
			var assembly = oAssembly.getValue();
			var cycle = cycleDropdownBox.getValue();
			
			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oPlant, {
				url: function(){
					return oServiceUrl + "/INPUT_IN_CYCLE_MODEL(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "', V_COUNTRY='" + country  + "')/Results?$filter=ITEM_TYPE eq 'PLANT'&$format=json";

				},
				selectedKey: country,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
		});
		oAssembly.attachChange(function(){
			var assembly = this.getValue();
			var cycle = cycleDropdownBox.getValue();
//			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oBrand, {
//				url: function(){
//					return oServiceUrl + "/INPUT_IN_CYCLE_MODEL(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "')/Results?$filter=ITEM_TYPE eq 'BRAND'&$format=json";
//					//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=PLANT&$format=json&$filter=MODEL eq '" + assembly + "'";
//				},
//				selectedKey: assembly,
//				transform: function(data){
//					return data.d.results;
//				},
//				bindTextField: "ITEM_VALUE",
//				bindKeyField: "ITEM_VALUE"
//			});
			$.ajax({
				type: "GET",
				// url: oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=MODEL_BRAND&$filter=MODEL eq '" + assembly + "'&$format=json",
				url: oServiceUrl + "/INPUT_IN_CYCLE_MODEL(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "', V_COUNTRY='" + 'ALL'  + "')/Results?$filter=ITEM_TYPE eq 'BRAND'&$format=json",  //modified chris Gao 2015-10-26 @ 4/8 by coral 
				dataType: "json",
				success: function(data){
					if(data.d.results.length > 0)
						// oBrand.setValue(data.d.results[0].MODEL_BRAND)
						oBrand.setValue(data.d.results[0].ITEM_VALUE);   //modified @ 2/27 by robin //get 3 results
					else 
						oBrand.setValue("");
				}
			});
//			lenovo.control.commontable.Toolkit.relateDropDwonBox(oBrand, oFamily, {
//				url: function(brand){
//					var assembly = oAssembly.getValue(); 
//					var cycle = cycleDropdownBox.getValue();
//					return oServiceUrl + "/INPUT_IN_FAMILY(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "', V_BRAND='" + brand + "')/Results?$filter=ITEM_TYPE eq 'FAMILY'&$format=json";
//					//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=COUNTRY&$format=json&$filter=MODEL eq '" + assembly + "' and SUBGEO eq '" + subgeo + "'";
//				},
//				transform: function(data){
//					return data.d.results;
//				},
//				bindTextField: "ITEM_VALUE",
//				bindKeyField: "ITEM_VALUE"
//			});
			$.ajax({
				type: "GET",
				url: oServiceUrl + "/INPUT_IN_FAMILY(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "')/Results?$filter=ITEM_TYPE eq 'FAMILY'&$format=json",
				//url: oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=MODEL_FAMILY&$filter=MODEL eq '" + assembly + "' and CYCLE eq '" + cycle + "' &$format=json",  //modified @ 4/8 by coral 
				dataType: "json",
				success: function(data){
					//console.log("family data", data);
					if(data.d.results.length > 0)
						oFamily.setValue(data.d.results[0].ITEM_VALUE);
					else 
						oFamily.setValue("");
				}
			});
/*			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oPlant, {
				url: function(){
					return oServiceUrl + "/INPUT_IN_CYCLE_MODEL(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "' )/Results?$filter=ITEM_TYPE eq 'PLANT'&$format=json";
					//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=PLANT&$format=json&$filter=MODEL eq '" + assembly + "'";
				},
				selectedKey: assembly,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});*/
			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oSubgeo, {
				url: function(){
					return oServiceUrl + "/INPUT_IN_CYCLE_MODEL(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "', V_COUNTRY='" + 'ALL'  + "')/Results?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json";
					//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=SUBGEO&$format=json&$filter=MODEL eq '" + assembly + "'";
				},
				selectedKey: assembly,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
		});
		lenovo.control.commontable.Toolkit.relateDropDwonBox(oSubgeo, oCountry, {
			url: function(subgeo){
				var assembly = oAssembly.getValue(); 
				var cycle = cycleDropdownBox.getValue();
				return oServiceUrl + "/INPUT_IN_COUNTRY(V_MODEL='" + assembly + "', V_CYCLE='" + cycle + "', V_SUBGEO='" + subgeo + "')/Results?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json";
				//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=COUNTRY&$format=json&$filter=MODEL eq '" + assembly + "' and SUBGEO eq '" + subgeo + "'";
			},
			transform: function(data){
				return data.d.results;
			},
			bindTextField: "ITEM_VALUE",
			bindKeyField: "ITEM_VALUE"
		});
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
	},
	createContent: function(){
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();	
		this.oServiceUrl = oServiceUrl;
		var auth =lenovo.control.commontable.Table.getViewAuth("ctoCostBom");
		this.auth = auth;
		var headerInfo = lenovo.control.commontable.Table.createHeader("Cost Bom", "cto cost bom");
		var initialHeaderInfo = this.getTableHeaderLabel("CURRENT", oServiceUrl);
		var oTreeTable = this.createTreeTable(initialHeaderInfo);
		var filterConfig = this.setFilterConfig(oTreeTable);
		var filterPanel = lenovo.control.commontable.Table.createFilter(filterConfig);
		var oForm = filterPanel.getContent()[0];
		this.oForm = oForm;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);		
		
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this.cycleDropdownBox = cycleDropdownBox;
		//this.addExpandAllElement(filterPanel, oTreeTable);
		this.setFilterControlRelation(filterPanel, oServiceUrl);
		var treeTableBar = this.createTreeTableBar(oTreeTable);

		
		var app = new sap.m.App();
//		app.setHeight("950px");
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
		if(oData.view === "CTO Cost BOM") {
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
	}
});