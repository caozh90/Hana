//Created by maggie at 2014-12-17
//Modified by Chris Gao at 2015-10-29
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Validation");
sap.ui.jsview("lenovo.view.cfe.costBom.seoCostBom", {
	createTreeTable: function(initialHeaderInfo){
		var that = this;
		var treeTableConfig = {
			visibleRowCount: 8 //zhaodan1 
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
			field: "LVL",
			width: "100px",
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
		//console.log("treeTableConfig", treeTableConfig);
		var oTreeTable = lenovo.control.commontable.Table.createTreeTable(treeTableConfig);
		// oTreeTable.setFixedColumnCount(8).setShowNoData(false);
		oTreeTable.setFixedColumnCount(2).setShowNoData(false);  // edit by robin @ 2/27
		this.treeTable = oTreeTable;
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
//		var filter = this._getFilterCondition(filterModel); 
		
		//added by Chris Gao 2015-10-30
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var filter = "$filter=CYCLE eq '" + cycle + "'";
		
		//modified by Chris Gao 2015-10-29
		var model = filterModel.getProperty("/MODEL/filterValue");
		var plant = filterModel.getProperty("/PLANT/filterValue");
		var country = filterModel.getProperty("/COUNTRY/filterValue");
		var children = filterModel.getProperty("/CHILDREN/filterValue");
		if(children != undefined && children != '')
		{
			filter = filter + " and CHILDREN eq '" + children + "'";
		}
		
//		var url = this.oServiceUrl + "/INPUT_CV_SEOCOSTBOM_FATHER(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "')/Results?" + filter + "&$orderby=FATHER,CHILDREN asc&$format=json";
		var url = this.oServiceUrl + "/INPUT_CV_SEOCOSTBOM_FATHER(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "')/Results?" + filter +"&$orderby=CHILDREN asc&$format=json";
		oTreeTable.setBusy(true);
		$.ajax({
			url: url ,
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
				that.treeeModel.setData(data);
				that.expendRecord = {};
				for(var i = 0; i < that.treeTableCount; i++) {
					oTreeTable.collapse(i);
				}
				oTreeTable.setFirstVisibleRow(0);
				oTreeTable.setBusy(false);
			},
			error: function(){
				that.treeeModel.setData({root: {}});
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
		var filter = "$filter=CYCLE eq '" + cycle + "' and MODEL eq '" + model + "'" ;
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
	//added by Chris Gao 2015-10-31 to process SEOCOSTBOM_LIST download filter
	_getSeoBottomFilterCondition: function(filterModel){
		var all = lenovo.control.Constants.allDropdownBoxListItem;
		var cycle = filterModel.getProperty("/CYCLE/filterValue");
		var model = filterModel.getProperty("/MODEL/filterValue");
		var plant = filterModel.getProperty("/PLANT/filterValue");
		var subgeo = filterModel.getProperty("/SUBGEO/filterValue");
		var country = filterModel.getProperty("/COUNTRY/filterValue");
//		var oBrand = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Brand")[0];
//		var oFamily = lenovo.control.commontable.Toolkit.getFormElementByLabel(this.oForm, "Family")[0];
		var filter = "seoFilterBottom=CYCLE eq '" + cycle + "' and MODEL eq '" + model + "'" ;
		if(plant && plant !== all) {
			filter += " and PLANT eq '" + plant + "'";
		}
		if(subgeo && subgeo !== all) {
			filter += " and SUBGEO eq '" + subgeo + "'";
		}
		if(country && country !== all) {
			filter += " and COUNTRY eq '" + country + "'";
		}
//		if(oBrand.getValue() && oBrand.getValue() !== all) {
//			filter += " and (substringof('" + oBrand.getValue() + "',MODEL_BRAND )) " ;
//		}
//		if(oFamily.getValue() && oFamily.getValue() !== all) {
//			filter += " and (substringof('" + oFamily.getValue() + "',MODEL_FAMILY )) " ;
//		}
		return filter;
	},
	_transformTreeData: function(data){
		var results = data && data.d && data.d.results || [];
		var obj = {root: {}};
		this.treeTableCount = results.length;
		for(var i = 0; i < results.length; i++) {
			obj.root[i] = results[i];
			obj.root[i][0] = {};
			delete obj.root[i].SEOCOSTBOM_TREETABLE_SHOW;
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
		var url = this.oServiceUrl + "/INPUT_CV_SEOCOSTBOM_CHILDREN_LAST(v_model='" + model + "', v_plant='" + plant + "', v_country='" + country + "', v_sbb='" + father + "')/Results?" + filter + "&$format=json";
//		var url = this.oServiceUrl + "/INPUT_CV_SEOCOSTBOM_CHILDREN2(V_MODEL='" + model + "', V_PLANT='" + plant + "', V_COUNTRY='" + country + "', V_SBB='" + father + "')/Results?" + filter + "&$format=json";
		//var url = this.oServiceUrl + "/CV_SEOCOSTBOM_CHILDREN2?" + filter + "&$format=json";
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

	createTable: function(initialHeaderInfo,firstLoad){
		var config = {};
		config.columns =  [{
			field: "COST_NAME", label: "Cost Name", type: "TextField",width: "100px"
		}, {
			field: "COST_LVL", label: "Cost Lvl", type: "TextField",width: "100px"
		}];
		$.each(initialHeaderInfo, function(key, value){
			config.columns.push({
				field: key,
				label: value + "E",
				type: "TextField",
				width: "100px"
			});
		});
		$.each(initialHeaderInfo, function(key, value){
			config.columns.push({
				field: "L" + key,
				label: value + "L",
				type: "TextField",
				width: "100px"
			});
		});
		config.bindRowUrl = "/CV_SEOCOSTBOM_LIST";
		config.visibleRowCount = 5;
		config.defaultSort = [{
			field: "COST_LVL",
			bDescending: false
		},{
			field: "length(COST_NAME)",
			bDescending: false
		}];
		config.navigationMode = sap.ui.table.NavigationMode.Scrollbar;//added by Chris Gao 2015-11-02
		if(firstLoad){
			config.notRefreshTable = true;
		}
		
		var oTable = this.createTableConfig(config);
		
		this.fatherTable = oTable;
		this.fatherTable.addStyleClass("seo-father-table");
		this.fatherTable.setFixedColumnCount(2);
//		this.fatherTable.setVisibleRowCount(visibleRowCount);
		return oTable;
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
		var bindUrl = "/INPUT_CV_UI_SEOCOSTBOM_MODEL_DDL(IN_CYCLE='"+ cycle +"')/Results?$select=MODEL";
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
				value1: filterValue//filter.filterValue
			});
		}
		var bindUrl = "/INPUT_CV_UI_SEOCOSTBOM_MODEL_DDL(IN_CYCLE='"+ cycle +"')/Results?$select=MODEL";
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
		var bindUrl = "/INPUT_CV_SEOCOSTBOM_SBB_DDL(V_CYCLE='"+ cycle +"', V_MODEL='"+ model +"', V_PLANT='"+ plant +"',V_COUNTRY='"+ country +"')/Results?$select=CHILDREN";
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
		var bindUrl = "/INPUT_CV_SEOCOSTBOM_SBB_DDL(V_CYCLE='"+ cycle +"', V_MODEL='"+ model +"', V_PLANT='"+ plant +"',V_COUNTRY='"+ country +"')/Results?$select=CHILDREN";
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
//					url: oServiceUrl +"/CV_SEOCOSTBOM_DDL?$select=CYCLE&$format=json"
//					url: oServiceUrl +"/CV_SEOCOSTBOM_CYCLE_DDL?$select=CYCLE,MS&$format=json"
					url: oServiceUrl +"/CV_UI_SEOCOSTBOM_CYCLE_DDL?$select=CYCLE&$orderby=CYCLE desc&$format=json"
					
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
			field: "MODEL_BRAND", label: "Brand",type: "TextField", 
			textfield: {
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
				//layout: new sap.ui.layout.GridData({span: "L6 M6 S6"}),
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					key:  lenovo.control.Constants.allDropdownBoxListItem
				}]				
			}
		}, {
			field: "MODEL_FAMILY", label: "Family",type: "TextField", 
			textfield: {
				enabled: false			
			}
		}, {
			field: "SUBGEO", label: "Subgeo",type: "DropdownBox",
//			labelLayout: new sap.ui.layout.GridData({span: "L6 M6 S6", linebreak: true}),  
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Subgeo is required!"
			}],
			dropdownbox : {
//				layout: new sap.ui.layout.GridData({span: "L6 M6 S6"}),
				data: [{
					text: lenovo.control.Constants.allDropdownBoxListItem,
					key:  lenovo.control.Constants.allDropdownBoxListItem
				}]				
			}
		}, {
			field: "CHILDREN",
			label: "SBB",
			type: "DropdownTable",
			dropdowntable : {
				defaultFilterOperator: "EQ", //defaultFilterOp: "EQ",modified by Chris Gao 2015-11-21 changed default contains to eq
				url: oServiceUrl,
				selectionMode: sap.ui.table.SelectionMode.Single,
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
			table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_seocostbom/CV_SEOCOSTBOM_FATHER"',
			columns: ["CHILDREN", "ITEM_DESC", "LVL", "QTYPER", "ALTGRUP", "ALTPRI", "ALTPERCENT", "COST_NAME",/*"WEIGHTED_AVERAGE","LATTEST_PROCUR",*/"M1", "M2", "M3","M4", "M5", "M6","M7", "M8", "M9", "M10", "M11", "M12",
				"M13", "M14", "M15", "M16", "M17", "M18", "LM1", "LM2", "LM3","LM4", "LM5", "LM6","LM7", "LM8", "LM9", "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18"],
			filename: "UI_SEO_COSTBOM",
			roleName: this.auth.exportableRoleName,
			visible: this.auth.exportable
		};
		
		config.batchdownload = {
				header:"SEO Cost Bom",
			    subheader:"Batch Download",
				visible: this.auth.exportable,
				forBatchDownload: true,
				uploadHistoryConfig: {
					url: oServiceUrl,
					bindRowUrl: "/INPUT_CV_SEOCOSTBOM_DOWNLOAD_RECORDS(IN_MODIFIED_BY='" + localStorage.USERNAME + "')/Results",
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
					url: logicServiceUrl + "/ui_seo_costbom_download_delete.xsjs",
					fields:["CYCLE","ITEM","PLANT","COUNTRY"]
				},
				deleteAllConfig:{
					url: logicServiceUrl + "/ui_delete_all.xsjs",
					tablename: "UI_SEO_DOWNLOAD"
				},
				upload: {
						url: uServiceUrl + "/ui_seo_costbom_batch_upload.xsjs",
						excelUrl: "cfe/costBom/ui_costbom_download_template.xlsx"
				},
				download:{
					url: "/cdp/common/services/getBatchData.xsjs",
					type: "SEO", //"SEO","SBB"
					table: '"_SYS_BIC"."cdp.ebgcfe.models.ui_seocostbom/CV_UI_SEO_DOWNLOAD"(placeholder."$$in_user$$"=>\'' + localStorage.USERNAME + '\')',
					filterTable: '"_SYS_BIC"."cdp.ebgcfe.models.ui_seocostbom/CV_UI_SEOCOSTBOM_DOWNLOAD_RECORDS"(placeholder."$$IN_MODIFIED_BY$$"=>\'' + localStorage.USERNAME + '\')',
					filterColumns:["CYCLE","MODEL","PLANT","COUNTRY"],
					columns: ["CHILDREN", "ITEM_DESC", "LVL", "QTYPER", "ALTGRUP", "ALTPRI", "ALTPERCENT", "COST_NAME","M1", "M2", "M3","M4", "M5", "M6","M7", "M8", "M9", "M10", "M11", "M12",
								"M13", "M14", "M15", "M16", "M17", "M18", "LM1", "LM2", "LM3","LM4", "LM5", "LM6","LM7", "LM8", "LM9", "LM10", "LM11", "LM12", "LM13", "LM14", "LM15", "LM16", "LM17", "LM18"],
//					detailcolumns: [{name:"COST_NAME",field:"ITEM_DESC"},{name:"COST_LVL",field:"LVL"}],
					relatedFilter: [{
						name: "BRAND",
						table:'"_SYS_BIC"."cdp.ebgcfe.models.ui_seocostbom/CV_UI_SEOCOSTBOM_SEARCH_DDL"',
						inputParas:[{label:"in_cycle",field:"CYCLE"},{label:"in_model",field:"MODEL"}],
						select: "ITEM_VALUE",
						where: "ITEM_TYPE='BRAND'"
					},{
						name: "FAMILY",
						table:'"_SYS_BIC"."cdp.ebgcfe.models.ui_seocostbom/CV_UI_SEOCOSTBOM_FAMILY_DDL"',
						inputParas:[{label:"IN_CYCLE",field:"CYCLE"},{label:"IN_MODEL",field:"MODEL"}],
						select: "ITEM_VALUE",
						where: "ITEM_TYPE='FAMILY'"
					}],
					filename: "UI_SEO_COSTBOM_BATCH",
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

		var cycle = this.cycleDropdownBox.getValue();
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
		
		//bottom table download columns
		var bottomColumns = "&bottomColumn=COST_NAME&bottomColumn=COST_LVL";
		
		var model = this.filterModel.getProperty("/MODEL/filterValue");
		var plant = this.filterModel.getProperty("/PLANT/filterValue");
		var country = this.filterModel.getProperty("/COUNTRY/filterValue");
		
		var seoFilterBottom = this._getSeoBottomFilterCondition(this.filterModel);
		
		return '&modelIn="$$v_model$$"=>\''+model+'\' and "$$v_plant$$"=>\'' + plant + '\' and "$$v_country$$"=>\'' + country + '\'' + '&childrenModelIn="$$v_model$$"=>\''+model+'\' and "$$v_plant$$"=>\'' + plant + '\' and "$$v_country$$"=>\''+ country + '\'' +"&cycle=" + this.cycle + brandHeaderandValue + familyHeaderandValue + plantHeaderandValue + countryHeaderandValue + "&sortColumn=CHILDREN&headerMapping=true&sortOrder=asc&downloadType=seo&" + filter + "&" + fatherFilter + "&" + seoFilterBottom + "&" + bottomColumns;
		
		
//		return '&modelIn="$$IN_CYCLE$$"=>\''+cycle+'\' and "$$IN_MODEL$$"=>\''
//		        +model +'\' and "$$IN_PLANT$$"=>\'' + plant + '\' and "$$IN_COUNTRY$$"=>\'' + country + '\'' + "&cycle=" + this.cycle + "&headerMapping=true&sortColumn=FATHER,LVL&sortOrder=asc&" + filter;//ZHAODAN1,CHILDREN
	},

	addExpandAllElement: function(filterPanel, oTreeTable){
		var oForm = filterPanel.getContent()[0];
		var that = this;
		var formContainers = oForm.getFormContainers();
		var lastFormContainer = formContainers[formContainers.length - 1];
		var oCollpaseBtn = new sap.ui.commons.Button("sepCollapse", {
			icon: "sap-icon://collapse",
			lite: true,
			tooltip: "collapse",
			press: function(){
				that.collapseTreeTable(oTreeTable);
			}
		});
		var oExpandBtn = new sap.ui.commons.Button("sepExpand", {
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
		oAssembly.attachChange(function(){
			var assembly = this.getValue();
			var cycle = cycleDropdownBox.getValue();
			$.ajax({
				type: "GET",
				// url: oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=MODEL_BRAND&$filter=MODEL eq '" + assembly + "'&$format=json",
				url: oServiceUrl + "/INPUT_CV_UI_SEOCOSTBOM_SEARCH_DDL(in_model='"+ assembly +"', in_cycle='"+ cycle +"')/Results?$filter=ITEM_TYPE eq 'BRAND'&$format=json",  //modified chris Gao 2015-10-26 @ 4/8 by coral 
				dataType: "json",
				success: function(data){
					if(data.d.results.length > 0)
						// oBrand.setValue(data.d.results[0].MODEL_BRAND)
						oBrand.setValue(data.d.results[0].ITEM_VALUE);   //modified @ 2/27 by robin //get 3 results
					else 
						oBrand.setValue("");
				}
			});
			$.ajax({
				type: "GET",
				url: oServiceUrl + "/INPUT_CV_UI_SEOCOSTBOM_FAMILY_DDL(IN_MODEL='" + assembly + "', IN_CYCLE='" + cycle + "')/Results?$filter=ITEM_TYPE eq 'FAMILY'&$format=json",
				dataType: "json",
				success: function(data){
					//console.log("family data", data);
					if(data.d.results.length > 0)
						oFamily.setValue(data.d.results[0].ITEM_VALUE);
					else 
						oFamily.setValue("");
				}
			});
			
			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oPlant, {
				url: function(){
					return oServiceUrl + "/INPUT_CV_UI_SEOCOSTBOM_SEARCH_DDL(in_model='"+ assembly +"', in_cycle='"+ cycle +"')/Results?$filter=ITEM_TYPE eq 'PLANT'&$format=json";
					//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=PLANT&$format=json&$filter=MODEL eq '" + assembly + "'";
				},
				selectedKey: assembly,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
			lenovo.control.commontable.Toolkit.reReloadDropdownBox(oSubgeo, {
				url: function(){
					return oServiceUrl + "/INPUT_CV_UI_SEOCOSTBOM_SEARCH_DDL(in_model='"+ assembly +"', in_cycle='"+ cycle +"')/Results?$filter=ITEM_TYPE eq 'SUBGEO'&$format=json";
					//return oServiceUrl + "/CV_UI_CTO_COSTBOM_DDL?$select=PLANT&$format=json&$filter=MODEL eq '" + assembly + "'";
				},
				selectedKey: assembly,
				transform: function(data){
					return data.d.results;
				},
				bindTextField: "ITEM_VALUE",
				bindKeyField: "ITEM_VALUE"
			});
			
			lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "SBB")[0].setValue("");
		});
		lenovo.control.commontable.Toolkit.relateDropDwonBox(oSubgeo, oCountry, {
			url: function(subgeo){
				var assembly = oAssembly.getValue(); 
				var cycle = cycleDropdownBox.getValue();
				return oServiceUrl + "/INPUT_CV_UI_SEOCOSTBOM_COUNTRY_DDL(IN_MODEL='" + assembly + "', IN_CYCLE='" + cycle + "', IN_SUBGEO='" + subgeo + "')/Results?$filter=ITEM_TYPE eq 'COUNTRY'&$format=json";
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
		var header = this.getTableHeaderLabel(cycle, this.oServiceUrl);
		this.refreshOTreeTableHeader(oTreeTable, header);
		this.filterModel = filterModel;
		oTreeTable.clearSelection();

		this.refreshTreeDataModel(oTreeTable, filterModel);
		//second table
		if(this.fatherTable){
			this.refreshOTableHeader(this.fatherTable, header);
			this.refreshFatherTable(filterModel, config);
		}
		if(this.childTable) {
			this.childTable.destroy();
			this.childTable = undefined;
			var oTable = this.createTable(header, false);
			this.page.addContent(oTable);
			this.refreshFatherTable(filterModel, config);
		}
	},	
	refreshFatherTable: function(filterModel, config){
		var fatherTable = this.fatherTable;
		fatherTable.clearSelection();
		var oTableFilters = this._getAllFilters(filterModel, config);
		var defaultSort = lenovo.control.commontable.Table._getDefaultSort({
			defaultSort: [{
				field: "COST_LVL"
			},{
				field: "length(COST_NAME)",
				bDescending: false
			}]
		});
		fatherTable.setBusy(true);
		this.oTableFilters = oTableFilters;
		fatherTable.bindRows("/CV_SEOCOSTBOM_LIST", null, defaultSort, oTableFilters);
	},
	
	_getAllFilters: function(filterModel, config){
		var filters = JSON.parse(filterModel.getJSON());
		var filterModeldde;
		//console.log("filters", filters);
		var filterModel, filterModelArray = [];
		$.each(filters, function(field, filter){
			switch(filter.type) {
				case "TextField":
					if(field != 'MODEL_BRAND' && field != 'MODEL_FAMILY')
					{
						if(filter.filterValue && filter.filterValue.length > 0) {
							var textFieldFilterModel, textFieldFilterModelArray = [];
							for(var k = 0; k < filter.filterValue.length; k++) {
								textFieldFilterModel = new sap.ui.model.Filter({
									path: field,
									operator:  filter.filterOperator,
									value1: filter.filterValue[k]
								});
								textFieldFilterModelArray.push(textFieldFilterModel);
							}
							filterModel =  new sap.ui.model.Filter({
								filters: textFieldFilterModelArray,
								and: false
							});
							filterModelArray.push(filterModel)
						}	
					}
				break;
				case "AutoComplete":
					if(filter.filterValue && filter.filterValue.length > 0) {
						filterModel =  new sap.ui.model.Filter({
							path: field,
							operator: filter.filterOperator,
							value1: filter.filterValue
						});
						filterModelArray.push(filterModel)
					}
				break;
				case "MultiTextField":
					if(filter.filterValue && filter.filterValue.length > 0) {
						var multiTextFieldFilterModel, multiTextFieldFilterModelArray = [];
						for(var k = 0; k < filter.filterValue.length; k++) {
							multiTextFieldFilterModel = new sap.ui.model.Filter({
								path: field,
								operator:  filter.filterOperator,
								value1: filter.filterValue[k]
							});
							multiTextFieldFilterModelArray.push(multiTextFieldFilterModel);
						}
						filterModel =  new sap.ui.model.Filter({
							filters: multiTextFieldFilterModelArray,
							and: false
						});
						filterModelArray.push(filterModel);
						/*filterModel =  new sap.ui.model.Filter({
							path: field,
							operator: filter.filterOperator,
							value1: filter.filterValue
						});
						filterModelArray.push(filterModel)*/
					}
				break;
				case "MultiEQ":
					if(filter.filterValue && filter.filterValue.length > 0) {
						filterModel =  new sap.ui.model.Filter({
							path: field,
							operator: filter.filterOperator,
							value1: filter.filterValue
						});
						filterModelArray.push(filterModel)
					}
				break;
				case "MultiDatePicker":
					if(filter.filterValue && filter.filterValue.length > 0) {
						filterModel =  new sap.ui.model.Filter({
							path: field,
							operator: filter.filterOperator,
							value1: filter.filterValue
						});
						filterModelArray.push(filterModel)
					}
				break;
				case "DropdownBox":
					if(filter.filterValue !== lenovo.control.Constants.allDropdownBoxListItem) {
						filterModel =  new sap.ui.model.Filter({
							path: field,
							operator: filter.filterOperator,
							value1: filter.filterValue
						});
						filterModelArray.push(filterModel)
					}
				break;
				case "DropdownTable":
					if(field != 'CHILDREN')
					{
						if(filter.filterValue && filter.filterValue.length > 0) {
							var dropTableFilterModel, dropTableFilterModelArray = [];
							for(var k = 0; k < filter.filterValue.length; k++){
								dropTableFilterModel = new sap.ui.model.Filter({
									path: field,
									operator: filter.filterOperator,
									value1: filter.filterValue[k]
								});
								dropTableFilterModelArray.push(dropTableFilterModel);
							}
							filterModel = new sap.ui.model.Filter({
								filters: dropTableFilterModelArray,
								and: false
							});
							filterModelArray.push(filterModel);
						}
					}
					
				break;
				case "ListBox":
					if(filter.filterValue && filter.filterValue.length > 0) {
						var dropTableFilterModel, dropTableFilterModelArray = [];
						for(var k = 0; k < filter.filterValue.length; k++){
							dropTableFilterModel = new sap.ui.model.Filter({
								path: field,
								operator:  sap.ui.model.FilterOperator.EQ,
								value1: filter.filterValue[k]
							});
							dropTableFilterModelArray.push(dropTableFilterModel);
						}
						filterModel = new sap.ui.model.Filter({
							filters: dropTableFilterModelArray,
							and: false
						});
						filterModelArray.push(filterModel);
					}
				break;
				case "TimeRange":
					//var startTime = filterModel.getProperty("/" + field + "/filterValue/start");
					// filter.filterValue.start;
					var startTime = filter.filterValue.start;
					var endTime =  filter.filterValue.end;
					//console.log("start Time", startTime);
					//console.log("start time property" ,);

					if(startTime && startTime != "" && endTime && endTime != "") {
						filterModel = new sap.ui.model.Filter({
							path: field,
							operator:  sap.ui.model.FilterOperator.BT,
							value1: startTime,
							value2: endTime
						});
						filterModelArray.push(filterModel);
					} else if(startTime && startTime != "") {
						filterModel = new sap.ui.model.Filter({
							path: field,
							operator:  sap.ui.model.FilterOperator.GE,
							value1: startTime
						});
						filterModelArray.push(filterModel);
					} else if (endTime && endTime != "") {	
						filterModel = new sap.ui.model.Filter({
							path: field,
							operator:  sap.ui.model.FilterOperator.LE,
							value1: endTime
						});
						filterModelArray.push(filterModel);
					}
				break;
				case "CheckBox":
					if(filter.filterValue) {
						var checkBoxFilterModel, checkBoxFilterModelArray = [];
						for(var k = 0 ; k < filter.checkbox.filters.length; k++) {
							checkBoxFilterModel = new sap.ui.model.Filter({
								path: filter.checkbox.filters[k].field,
								operator: filter.checkbox.filters[k].op,
								value1: filter.checkbox.filters[k].value
							});
							checkBoxFilterModelArray.push(checkBoxFilterModel);
						}
						filterModel = new sap.ui.model.Filter({
							filters: checkBoxFilterModelArray,
							and: true
						});
						filterModelArray.push(filterModel)
					}
				break;
			}
		});
		if(filterModelArray.length > 0 ) {
			filterModel = new  sap.ui.model.Filter({
				filters: filterModelArray,
				and: true
			});
			return filterModel;
			
		} else {
			var defaultFiler = this._getDefaultFilter(config) || [];
			return defaultFiler;
		}

	},
	
	refreshHeader: function(cycle, oTreeTable, oTable){
		var header = this.getTableHeaderLabel(cycle, this.oServiceUrl);
		this.refreshOTreeTableHeader(oTreeTable, header);
		this.refreshOTableHeader(oTable, header);
	},
	refreshOTreeTableHeader: function(oTreeTable, header){
		var columns = oTreeTable.getColumns();
		var index = 0, label = "", i;
		var startIndex = 7;//9;
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
	refreshOTableHeader: function(oTable, header){
		var columns = oTable.getColumns();
		var index = 0, label = "", i;
		var startIndex = 1;//6;
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
	createTableConfig: function(config){	
		var windowHeight =  lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);	
		var rowHeight = 30;
		config.visibleRowCount = 8;//lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight- headerHeight - 250);
		var oModel = new sap.ui.model.odata.ODataModel(this.oServiceUrl, true);
		oModel.setDefaultCountMode("None");
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
		config.notRefreshTable = true;
		
		var childTable = this.createTableConfig(config);
		childTable.setFixedColumnCount(2);
		//childTable.setVisibleRowCount(visibleRowCount);
		childTable.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
		
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
	createTreeTableBar: function(oTreeTable){
		var that = this;
		var layout = new sap.ui.layout.HorizontalLayout().addStyleClass("lenovotable-toolbar");
		var oDetailButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://table-view",
				tooltip: "table view",
				press: function(oEvent) {
					that.detailView(oTreeTable);
					that.oTable.setVisible(true);
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
//		var part = row.getCells()[0].getValue();
		
//		if(level == 1) {
		if(cost_type == "SBB-COST") {
			return;
			
		} else if(cost_type == "COMP-COST") {
			if(this.fatherTable !== undefined) {
				this.fatherTable.destroy();
				this.fatherTable = undefined;
			}
			if(this.childTable === undefined) {
				this.childTable = this.createChildOTable();
				this.page.addContent(this.childTable);
			}
			this.refreshChildOTable(part, this.childTable);
		}
	},
	createContent: function(){
		var service = new lenovo.service.CFE();
		var oServiceUrl = service.getEBGCfe();	
		this.oServiceUrl = oServiceUrl;
		var auth =lenovo.control.commontable.Table.getViewAuth("seoCostBom");
		this.auth = auth;
		var headerInfo = lenovo.control.commontable.Table.createHeader("Cost Bom", "seo cost bom");
		var initialHeaderInfo = this.getTableHeaderLabel("CURRENT", oServiceUrl);
		var oTreeTable = this.createTreeTable(initialHeaderInfo);
		var oTable = this.createTable(initialHeaderInfo, true);//this.createTable(oServiceUrl, initialHeaderInfo);
		this.oTable = oTable;
		var filterConfig = this.setFilterConfig(oTreeTable, oTable);
		var filterPanel = lenovo.control.commontable.Table.createFilter(filterConfig);
		var oForm = filterPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		this.cycleDropdownBox = cycleDropdownBox;
		var modelDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Assembly")[0];
		this.modelDropdownBox = modelDropdownBox;
		var plantDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Plant")[0];
		this.plantDropdownBox = plantDropdownBox;
		var countryDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Country")[0];
		this.countryDropdownBox = countryDropdownBox;
		var treeTableBar = this.createTreeTableBar(oTreeTable);

	//zhaodan1 add start
		
		var oDownUpArrow = new sap.ui.commons.Button("", {
			icon: "sap-icon://navigation-down-arrow",
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
		
		//zhaodan1 add end	
		
		this.oForm = oForm;
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);		
		
		//this.addExpandAllElement(filterPanel, oTreeTable);
		this.setFilterControlRelation(filterPanel, oServiceUrl);
		var app = new sap.m.App();
		var page = new sap.m.Page({
	      	showHeader: false,
	        content :[headerInfo, filterPanel, treeTableBar, oTreeTable,ArrowBar,oTable]// zhaodan1
	    }).addStyleClass("cto-cost-bom");
	    this.page = page;
        app.insertPage(page);
        app.setInitialPage(page);
        return app;	
	},
	onTreeNavigation:function(sChannel, sEvent, oData){
		if(oData.view === "SEO Cost BOM") {
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