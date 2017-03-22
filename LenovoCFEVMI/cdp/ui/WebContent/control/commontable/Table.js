jQuery.sap.require("lenovo.control.commontable.Toolkit");
jQuery.sap.require("lenovo.control.LenovoTable");
jQuery.sap.require("lenovo.control.Constants");
jQuery.sap.require("lenovo.control.Dialog");
jQuery.sap.require("lenovo.service.Common");
jQuery.sap.declare("lenovo.control.commontable.Table");

lenovo.control.commontable.Table = {
	service: new lenovo.service.Common(),
	getDefaultTableConfig: function(oModel) {
		var oMeta = oModel.getServiceMetadata();
		var config = {
			columns: [],
			filters: [],
			filtersRaw: [],
			insertRaw: [],
			editRaw: []
		}; 
		for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
			var property = oMeta.dataServices.schema[0].entityType[0].property[i];
			config.columns.push({
				field: property.name,
				label: property.name,
				filterOperator: property.type == "Edm.DateTime" ? "EQ" : "Contains",
				type: property.type == "Edm.DateTime" ? "DatePicker" : "TextField",
				dropdowntable: {selectionMode: sap.ui.table.SelectionMode.Single}//,
				//format: "yyyy-mm-dd"//bianzh1
			});
			config.filtersRaw.push({
				field: property.name,
				label: property.name,
				type: property.type == "Edm.DateTime" ? "TimeRange" : "TextField"
			});
			config.insertRaw.push({
				field: property.name,
				label: property.name,
				type: property.type == "Edm.DateTime" ? "DatePicker" : "TextField"
			});
			config.editRaw.push({
				label: property.name,
				field: property.name,
				type: property.type == "Edm.DateTime" ? "DatePicker" : "TextField",
				validation: [
				// {
				// 	validType: "", //Reg or function, if function, boolean function(columnValue)
				// 	errMsg: ""
				// }
				] 
			});
		}
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.visibleRowCount = config.visibleRowCount ? config.visibleRowCount: 10;
		config.edit = {
			visible: true
		};
		config.create = {
			visible: true,
			columns:  lenovo.control.commontable.Toolkit.splitChunck(3, config.insertRaw),
			url: "",
			baseUrl: ""
		};
		config.deleteable = {
			visible: true,
			url: "",
			fields: []
		};
		config.download = {
			visible: true,
			table: "",
			columns:[],
			filename: "download"
		};
		config.upload = {
			visible: true,
			url: ""
		};
		config.exportSearch = {
			url: ""
		};
		config.title = "test";
		return config;
	},
	getViewAuth: function(viewId){
		var auth = {};
		var regx = /::(.*)/;
		var roleName, match;
		$.ajax({
			url: "/cdp/security/services/userInfo.xsodata/MAP_VIEWROLE?$filter=VIEW_NAME eq '" + viewId + "' and MAP_TYPE eq 'controllor' &$format=json",
			type: "get",
			datatype: "JSON", 
			async: false,
			success: function(data){
				data = data.d.results;
				for(var i = 0 ; i < data.length; i++) {
					roleName = data[i]["ROLE_NAME"];
					match = roleName.match(regx);
					if(match && match.length > 0) {
						auth[match[1]] = true;
						auth[match[1]+ "RoleName"] = roleName;
						//auth.roleName = roleName;
					}
				}
			}
		});
		return auth;
	},
	createHeader: function(parent, view){
		var oHorizontalLayout = new sap.ui.layout.HorizontalLayout().addStyleClass("header-info");
		var oParentLabel, oLabel;
		oLabel = new sap.ui.commons.Label({
			text: view
		}).addStyleClass('header-view');
		if(parent && parent.length > 0) {
			oParentLabel =  new sap.ui.commons.Label({
				text: parent
			}).addStyleClass('header-parent');
			oHorizontalLayout.addContent(oParentLabel);
			oLabel.setIcon("sap-icon://slim-arrow-right");
		}
		oHorizontalLayout.addContent(oLabel);
		return oHorizontalLayout;
	},
	createTable: function(config) {
		var that = this;
		var oColumn, oControl, column, table, filter;
		table = new lenovo.control.LenovoTable({
			navigationMode: config.navigationMode || sap.ui.table.NavigationMode.Paginator,
			selectionMode: config.selectionMode || sap.ui.table.SelectionMode.MultiToggle,
			visibleRowCount: config.visibleRowCount,
			editable: true,
			threshold: 30,
			//selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly 
			//visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto
		});
		for (var i = 0; i < config.columns.length; i++) {
			column = config.columns[i];
			/****************************
			 * Modified by Chris Gao
			 * 2015-08-13
			 * to Add View Status Button
			 ***************************/
			if(column.type == 'SubDownloadButton')
			{
				oControl = this._createDownloadBtnControl(table, column, config);
			}
			else
			{
				oControl = this._createControl(table, column);
			}
			/*************end***************/
			oColumn = new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: column.label
				}),
				width: column.width? column.width: "auto",
				//filterOperator: column.filterOperator,
				template: oControl,
				sortProperty: column.field,
				//filterProperty: column.field,
				showFilterMenuEntry: column.showFilterMenuEntry || false,
				editable: false
			});
			table.addColumn(oColumn);
		}
		if(config.notRefreshTable) {
			return table;
		}	
		else {
			var defaultSort = this._getDefaultSort(config);
			var defaultFilters = this._getDefaultFilter(config);
			table.bindRows(config.bindRowUrl, null, defaultSort, defaultFilters);
			return table;
		}
		
	},
	createTreeTable: function(config){
		var that = this;
		var oColumn, oControl, column, table;
		table = new sap.ui.table.TreeTable({
			title: config.tableTile || "",
            visibleRowCount: config.visibleRowCount || 10, //updated by Chris Gao 2015-08-31
           	showSortMenuEntry: false,
            //navigationMode:sap.ui.table.NavigationMode.Paginator,   //comment by Chris Gao 2015-08-31
            selectionMode: sap.ui.table.SelectionMode.Single       
        });
        for(var i = 0; i < config.columns.length; i++) {
        	column = config.columns[i];
        	oControl = this._createControl(table, column);
        	oColumn = new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: column.label
				}),
				width: column.width? column.width: "150px",
				template: oControl,
				sortProperty: column.field,
				showFilterMenuEntry: column.showFilterMenuEntry || false
			});
			table.addColumn(oColumn);
        }
        return table;
	},
	/*_getDefaultSort: function(config){
		var defaultSort = null;
		if(config.defaultSort) {
			var path = config.defaultSort.field;
			var bDescending = config.defaultSort.bDescending || false;
			defaultSort = new sap.ui.model.Sorter(path, bDescending);
		}
		return defaultSort;
	},*/
	_getDefaultSort: function(config){
		var defaultSort = [];
		/******************************
		 * config with order by
		 * Modified by Chris Gao
		 * 2015-08-30
		 *****************************/
		if(config.defaultSort) {
			//convert to array -- Chris Gao
			if(! $.isArray(config.defaultSort)) {
				config.defaultSort = [config.defaultSort];
			}
			for(var i = 0; i < config.defaultSort.length; i++){
				var path = config.defaultSort[i].field;
				var bDescending = config.defaultSort[i].bDescending || false;
				var sort = new sap.ui.model.Sorter(path, bDescending);
				defaultSort.push(sort);
			}
		}
		/******************************
		 * end by Chris Gao
		 * 2015-08-30
		 *****************************/
		return defaultSort;
	},
	_getDefaultFilter: function(config){
		var filterModel, filterArray=[], filters;
		if(config.filters && config.filters.length > 0){
			for(var i = 0; i < config.filters.length; i++) {
				for(var j = 0; j < config.filters[i].length; j++) {	
					var filter = config.filters[i][j];
					if(filter instanceof Array){
						filter = filter[0];
					}			
					
					var type = filter.type;
					var filterConfig = filter[type.toLowerCase()];
					if(filterConfig) {
						if(!(filterConfig.notAsInitialFilter) && filterConfig.defaultFilterValue) {
							filterModel =  new sap.ui.model.Filter({
								path: filter.field,
								operator: "EQ",
								value1: filterConfig.defaultFilterValue
							});
							filterArray.push(filterModel);
						}
					}	
				}
			}
			if(filterArray.length > 0) {
				filters = new sap.ui.model.Filter({
					filters: filterArray,
					and: true
				});
				return filters;
			}
		}
	},
	createFilter: function(config, table){
		if(config.filters && config.filters.length > 0) {
			var that = this;
			var filters = config.filters;
			var filterModel = new sap.ui.model.json.JSONModel();
			var oPanel = new sap.ui.commons.Panel({
				title: {
					text: "Search",
					tooltip: "search"
				},
				showCollapseIcon: false 
			}).addStyleClass("filter-panel");
			var oLayout = new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 4,
				labelSpanM: 4,
				emptySpanL: 1,
				columnsL: filters.length,
				columnsM: filters.length
			});
			var oForm = new sap.ui.layout.form.Form({
				layout: oLayout,
				formContainers: []
			});
			var oFormContainer, oControl, formContainerConfig, obj = {}, clearObj, formContainerLayout = config.filterLayout;
			formContainerLayout = formContainerLayout || lenovo.control.commontable.Toolkit.getDefaultLayout(filters.length);
			for(var i = 0, len = filters.length; i < len; i++) {
				oFormContainer = new sap.ui.layout.form.FormContainer();
				for(var j = 0; j < filters[i].length; j++) {
					var filter = filters[i][j];
					if(filter instanceof Array){
						filter = filter[0];
					}
					obj[filter.field] = {
						filterValue: null,
						type: filter.type,
						label: filter.label
					};
					switch(filter.type) {
						case "TextField":
							var textfieldDefaultFilterValueModel = [];
							if(filter.textfield && filter.textfield.defaultFilterValue) {	
								if(! $.isArray( filter.textfield.defaultFilterValue)) {
									textfieldDefaultFilterValueModel = filter.textfield.defaultFilterValue.split(",");
								} else {
									textfieldDefaultFilterValueModel =  filter.textfield.defaultFilterValue;
								}
							}
							obj[filter.field].filterValue =  textfieldDefaultFilterValueModel;
							obj[filter.field].filterOperator =(filter.textfield && filter.textfield.defaultFilterOp) || "Contains"
						break;
						case "AutoComplete":
							obj[filter.field].filterValue =  (filter.autocomplete && filter.autocomplete.defaultFilterValue) || null;
							obj[filter.field].filterOperator =(filter.autocomplete && filter.autocomplete.defaultFilterOp) || "Contains"
						break;
						case "ListBox":
							obj[filter.field].filterValue = [];
							obj[filter.field].type = filter.type;
							break;
						case "DropdownTable":
							obj[filter.field].filterValue = [];
							obj[filter.field].filterOperator = (filter.dropdowntable && filter.dropdowntable.defaultFilterOperator) || "Contains";
							obj[filter.field].type = filter.type;
							break;
						case "DropdownBox":
							obj[filter.field].filterValue = (filter.dropdownbox && filter.dropdownbox.defaultFilterValue) || lenovo.control.Constants.allDropdownBoxListItem;
							obj[filter.field].filterOperator = "EQ";
							obj[filter.field].type = filter.type;
							obj[filter.field].defaultFilterValue = filter.dropdownbox && filter.dropdownbox.defaultFilterValue;
							break;
						case "MultiEQ":
							obj[filter.field].filterValue = null;
							obj[filter.field].filterOperator = (filter.multieq &&filter.multieq.defaultFilterOp) || "EQ";
							obj[filter.field].type = filter.type;
							obj[filter.field].multieq = filter.multieq;
							break;
						case "MultiTextField":
							obj[filter.field].filterValue = [];
							obj[filter.field].filterOperator = (filter.multitextfield && filter.multitextfield.defaultFilterOp) || "Contains";
							obj[filter.field].type = filter.type;
							obj[filter.field].multitextfield = filter.multitextfield;
						break;
						case "MultiDatePicker":
							obj[filter.field].filterValue = null;
							obj[filter.field].filterOperator = (filter.multidatepicker && filter.multidatepicker.defaultFilterOp) || "EQ";
							obj[filter.field].type = filter.type;
							obj[filter.field].multidatepicker = filter.multidatepicker;
							break;
						case "TimeRange":
							obj[filter.field].filterValue = {
								start: null,
								end: null
							};
							//obj[filter.field].filterOperator = null;
							obj[filter.field].type = filter.type;
							break;
						case "CheckBox":
							obj[filter.field].filterValue = false;
							obj[filter.field].type = filter.type;
							obj[filter.field].checkbox = filter.checkbox;
						break;
					}
					oControl = lenovo.control.commontable.Toolkit._createFilterControl(filter, filterModel);
					oFormContainer.addFormElement(oControl);
				}
				oFormContainer.setLayoutData(formContainerLayout[i]);
				oForm.addFormContainer(oFormContainer);
			}
			clearObj = JSON.stringify(obj);
			filterModel.setData(obj);
			oForm.setModel(filterModel);
			oForm.data("clearObj",obj);
			/**************
			 * Start
			 * Added by bianzh1
			 * 2015-09-17
			***************/
			if(config.formWidth !== "" && config.formWidth !== undefined)
			{
				oForm.setWidth(config.formWidth);
			}
				
			/**************
			 * End
			 * Added by bianzh1
			 * 2015-09-17
			***************/
			
			oPanel.addContent(oForm);
			
			/**************
			 * to process the batch upload page
			 * Added by Chris Gao
			 * 2016-05-10
			***************/
			if(config.batchdownload && config.batchdownload.visible) {
				var exportSerachButton = new sap.ui.commons.Button({
					icon: "sap-icon://duplicate",
					lite: true,
					tooltip: "batch download",
					press: function() {
						that.service.checkSessionRelogin();
						that._gotoBatchDownloadPage(config.batchdownload, oPanel, table);
					}
				});
				oPanel.addButton(exportSerachButton);
			}
			/**************
			 * End by Chris
			***************/

			if(config.download && config.download.visible) {
				var exportDialog = new sap.ui.commons.Dialog({
					width: "400px",
					height: '400px',
					title: "Download",
					content: [],
					modal: true,
					buttons: [new sap.ui.commons.Button({
						text: "cancel",
						press: function(){
							exportDialog.close();
						}
					})]
				});
				var exportSerachButton = new sap.ui.commons.Button({
					icon: "sap-icon://download",
					lite: true,
					tooltip: "export",
					press: function() {
						if(config.download.batch != undefined && config.download.batch == true)
						{
							that._exportBatchSearch(filterModel, config, table, exportDialog, oPanel);
						}
						else
						{
							that._exportSearch(filterModel, config, table, exportDialog, oPanel);
						}
						
					}
				});
				oPanel.addButton(exportSerachButton);
			}
			
			var clearFilterConditions = new sap.ui.commons.Button({
				icon: "sap-icon://undo",
				tooltip: "clear filter",
				lite: true,
				press: function() {
					that._clearAllFilterCondition(filterModel,oForm, clearObj);
				}
			}).addStyleClass("clearFilter");
			oPanel.addButton(clearFilterConditions);
			var searchButton =  new sap.ui.commons.Button({
				icon: "sap-icon://search",
				tooltip: "search",
				lite: true,
				press: function() {
					that._search(filterModel, table, config, oPanel);
				}
			}).addStyleClass("commontable-toolbar-btn").addStyleClass("searchFilter");
			oPanel.addButton(searchButton);
			return oPanel;
		}
	},
	
	/**************
	 * to process the batch upload page
	 * Added by Chris Gao
	 * 2016-05-10
	***************/
	_gotoBatchDownloadPage: function(batchOption, filterPanel, table){
		//get App level
		var app = filterPanel.getParent().getParent();
		var batchdownloadPage = lenovo.control.commontable.Toolkit._createBatchUploadContent(batchOption, app, table);
//		var table = viewStatusElement.getContent()[1];
//		var oModel = table.getModel();
//		table.setBusy(true);
//		table.setFirstVisibleRow(0);
//		table.clearSelection();
//		oModel.refresh(true);
		app.to(batchdownloadPage);
	},
	/**************
	 * End by Chris
	***************/
	
	/*********************************************
	 * Start
	 * Added by Chris Gao 
	 * 2015-08-12
	 ********************************************/
	_clearMultiFilterCondition: function(filterModel,oForm, clearObj){
		var clear =  JSON.parse(clearObj);
		var defaultSelectedItem;
		filterModel.setData(clear);
		var formContainers = oForm.getFormContainers();
		var formContainer, formElements, formElement, lable;
		for(var i = 0; i < formContainers.length; i++) {
			formContainer = formContainers[i];
			formElements = formContainer.getFormElements();
			for(var j = 0; j < formElements
			.length; j++) {
				defaultSelectedItem = null;	formElement = formElements[j];
				label = formElement.getLabel();
				filter = this._getClearMatched(clear, label);
				if(filter) {
					if(filter.type === 'MultiEQ' || filter.type==='MultiDatePicker' ||  filter.type==='MultiTextField'){
						var operatorDropdownBox = formElement.getFields()[0];
						if(filter[filter.type.toLowerCase()] && filter[filter.type.toLowerCase()].defaultFilterOp) {
							operatorDropdownBox.setSelectedKey(filter[filter.type.toLowerCase()].defaultFilterOp);	
						} else {
							operatorDropdownBox.setSelectedKey(operatorDropdownBox.getItems()[0].getKey());
						}
						var field = formElement.getFields()[1];
						field.setValue("");
					}
				}		
			}
		}
	},
	
	/*********************************************
	 * End
	 * Added by Chris Gao 
	 * 2015-08-12
	 ********************************************/
	
	_clearAllFilterCondition: function(filterModel,oForm, clearObj){
		var clear =  JSON.parse(clearObj);
		var defaultSelectedItem;
		filterModel.setData(clear);
		var formContainers = oForm.getFormContainers();
		var formContainer, formElements, formElement, lable;
		for(var i = 0; i < formContainers.length; i++) {
			formContainer = formContainers[i];
			formElements = formContainer.getFormElements();
			for(var j = 0; j < formElements
			.length; j++) {
				defaultSelectedItem = null;	formElement = formElements[j];
				label = formElement.getLabel();
				filter = this._getClearMatched(clear, label);
				if(filter) {
					if(filter.type === 'DropdownBox') {
						var dropdownBox = formElement.getFields()[0];
						var items = dropdownBox.getItems();
						if(filter.defaultFilterValue){
							for(var k = 0; k < items.length; k++) {
								if(items[k].getKey() == filter.defaultFilterValue) {
									defaultSelectedItem = items[k];
								}
							}
						}
						defaultSelectedItem = defaultSelectedItem ? defaultSelectedItem: items[0] ;
						if(defaultSelectedItem){
							var key = defaultSelectedItem.getKey();
							dropdownBox.setSelectedKey(key);
							dropdownBox.fireChange({
								newValue: key,
								selectedItem: defaultSelectedItem
							});
						}
						
					} else if(filter.type === 'MultiEQ' || filter.type==='MultiDatePicker' ||  filter.type==='MultiTextField'){
						var operatorDropdownBox = formElement.getFields()[0];
						if(filter[filter.type.toLowerCase()] && filter[filter.type.toLowerCase()].defaultFilterOp) {
							operatorDropdownBox.setSelectedKey(filter[filter.type.toLowerCase()].defaultFilterOp);	
						} else {
							operatorDropdownBox.setSelectedKey(operatorDropdownBox.getItems()[0].getKey());
						}
						var field = formElement.getFields()[1];
						field.setValue("");
					} else if(filter.type === "ListBox") {
						var listBox = formElement.getFields()[0];
						listBox.clearSelection();
					} else if(filter.type === "TextField" || filter.type === "DropdownTable") {
						var field = formElement.getFields()[0];
						if(field.getEnabled() == true){
							field.setValue("");
						}						
					} else if(filter.type === "TimeRange"){
						var field = formElement.getFields()[1];
						field.setValue("");
						var field = formElement.getFields()[3];
						field.setValue("");
					} else if(filter.type === "CheckBox"){
						var checkBox = formElement.getFields()[0];
						checkBox.setChecked(false);
					}
				}		
			}
		}
	},
	_getClearMatched: function(clear, label){
		var filter;
		for(var key in clear) {
			filter = clear[key];
			if(filter.label === label && (filter.type === 'MultiEQ' || filter.type==='MultiDatePicker' ||  filter.type==='MultiTextField' || filter.type==='DropdownBox' || filter.type==='ListBox' || filter.type==="DropdownTable" || filter.type==="TextField" || filter.type === "TimeRange" || filter.type === "CheckBox")) {
				return filter;
			}
		}
	},
	
	/**************
	 * to process the mutil-data download more than million data
	 * Added by Chris Gao
	 * 2016-05-10
	***************/
	_exportBatchSearch: function(filterModel, config, table, exportDialog, filterPanel) {
		var that = this;
		
		var isAllValidated = lenovo.control.commontable.Toolkit._getFilterAllValidted(config, filterPanel);
		if(!isAllValidated)
			return;
		
		that.service.checkSessionRelogin();
		
		var oDataListBinding = table.getBinding("rows");
		if(oDataListBinding === undefined) {
			lenovo.control.commontable.Toolkit.showErrorMsg("Please firstly click search button then download", "ERROR", "Download");
			return false;
		}
		
		var countUrl;
		oModel = table.getModel();
		sServiceUrl = oModel.sServiceUrl;
		sPath = oDataListBinding.sPath;
		sFilterParams = oDataListBinding.sFilterParams;
		countUrl = sServiceUrl + sPath + "/$count?";
		if(sFilterParams){
			countUrl = countUrl + sFilterParams;
		}
		
		$.ajax({
			url: countUrl,
			type: "get",
			datatype: "JSON",
			success: function(count){
				openExportDialog(count);
			}
		});
		
		
		var filename = config.download.filename;
		var filters = that._getAllFilters(filterModel, config);
		var where = "";
		var orderby = "";
		var cycle = "";
		var url = "";
		if(config.download.url != undefined)
		{
			url = config.download.url;
		}
		else
		{
			url = "/cdp/common/services/getBatchData.xsjs";
		}
		
		if(filters.aFilters != null && filters.aFilters.length > 0)
		{
			for(var j=0; j<filters.aFilters.length; j++)
			{
				if(filters.aFilters[j]._bMultiFilter == false)
				{
					where = where + filters.aFilters[j].sPath + that._getSqlOperator(filters.aFilters[j].sOperator) + "''" + filters.aFilters[j].oValue1 + "'' AND ";
					if(filters.aFilters[j].sPath == "CYCLE")
					{
						cycle = filters.aFilters[j].oValue1;
					}
				}
				else
				{
					var multiFilterItems = filters.aFilters[j].aFilters;
					var multiFilterItem_field = "";
					var multiFilterItem_value = "(";
					for(var k=0; k<multiFilterItems.length; k++)
					{
						multiFilterItem_field = multiFilterItems[k].sPath;
						multiFilterItem_value = multiFilterItem_value + "''" + multiFilterItems[k].oValue1 + "'',";
					}
					multiFilterItem_value = multiFilterItem_value.substring(0,multiFilterItem_value.length-1);
					where = where +  multiFilterItem_field + " IN " + multiFilterItem_value + ") AND ";
				}
			}
			where = where.substring(0, where.length-4);
		}
		url = url + "?table=" + config.download.table + '(placeholder."$$IN_WHERE$$"=>\'' + where + "')"; 
		var columns = config.download.columns;
		for(var j=0; j<columns.length; j++)
		{
			url = url + "&column="+columns[j];
		}
		url = url + "&cycle=" + cycle;
		
		
		
		
		
		
		//process filter data
		var top = 500000;
		if(config.download.batchrange != undefined && config.download.batchrange > 0)
		{
			top = config.download.batchrange;
		}
		function openExportDialog(total){
			var partNumber = Math.ceil(total/top);
			exportDialog.removeAllContent();
			for(var i=0; i<partNumber;i++)
			{
				var new_url = "";
				new_url = url + "&filename=" + config.download.filename + "_PART_" + (i + 1);
				new_url = new_url + "&limit=" + top;
				new_url = new_url + "&offset=" + top*i;
				
				var verticalLayout = new sap.ui.layout.VerticalLayout({width:"100%"}).addStyleClass("export-verical-layout");
				var oLink = new sap.ui.commons.Link({
					text:  "download "  + filename + "_PART_" + (i + 1),
					width: "270px",
					href: new_url,
					target: "_blank"
				});
				verticalLayout.addContent(oLink);
				exportDialog.addContent(verticalLayout);
			}
			exportDialog.open();
		}
	},
	
	_getSqlOperator: function(opt){
		var operator = "";
		if(opt == 'NE')
		{
			operator = " != ";
		}
		else if(opt == 'GT')
		{
			operator = " > ";
		}
		else if(opt == 'GE')
		{
			operator = " >= ";
		}
		else if(opt == 'LT')
		{
			operator = " < ";
		}
		else if(opt == 'LE')
		{
			operator = " <= ";
		}
		else
		{
			operator = " = ";
		}
		
		return operator;
	},
	
	/*****************
	 * End by Chris Gao
	 *****************/
	_exportSearch: function(filterModel, config, table, exportDialog, filterPanel) {
		var isAllValidated = lenovo.control.commontable.Toolkit._getFilterAllValidted(config, filterPanel);
		if(!isAllValidated)
			return;
		var that = this;
		that.service.checkSessionRelogin();
		var filename = config.download.filename;
		var partFilename = "";
		var oDataListBinding;
		var oModel;
		var sServiceUrl;
		var sPath;
		var sFilterParams;
		var regx = /^\$filter=\((.*)\)$/;
		var match = [];
		var tableName;
		if(config.download.preCheck) {
			var validate = config.download.preCheck.func.apply(config.download.preCheck.context || window, config.download.preCheck.args || []);
			if(!validate) 
				return;
		}
		if(typeof config.download.table === "function") {
			var args = [filterModel];
			if(config.download.tableArgs && config.download.tableArgs.length > 0) {
				for(var i = 0; i < config.download.tableArgs.length; i++) {
					args.push(config.download.tableArgs[i]);
				}
			}
			tableName = config.download.table.apply(window, args);
		}
		else if(typeof config.download.table === 'string') {
			tableName = config.download.table;
		}
		var columns = config.download.columns;
		var roleName = config.download.roleName;
		/************************
		 * added by Chris Gao
		 * to call another download xsjs
		 * to implement download table with input parameters
		 * 2015-08-18
		 **********************/
		var tablewithinputpara = "";
		if(config.download.tablewithinputpara != null)
		{
			tablewithinputpara = config.download.tablewithinputpara;
		}
		//'"_SYS_BIC"."cdp.ebgcfe.models.ui_rpt_whereused/CV_UI_RPT_WHERE_USED2" (placeholder."$$in_cycle$$" => \'CURRENT\', placeholder."$$in_partnumber$$" => \'000000C25127,000000C25128\')'
		
		var inputUrl = "";
		var filters = this._getAllFilters(filterModel, config);
		
		if(config.download.urlInputParas != null &&config.download.urlInputParas.length > 0)
		{
			var inputParas = config.download.urlInputParas;
			for(var i=0; i< inputParas.length; i++)
			{
				var inputItem = inputParas[i];
				var inputValue = inputItem.value != null ? inputItem.value : "";
				
				if(filters.aFilters != null && filters.aFilters.length > 0)
				{
					for(var j=0; j<filters.aFilters.length; j++)
					{
						
						if(filters.aFilters[j]._bMultiFilter == false)
						{
							if(filters.aFilters[j].sPath == inputItem.bindFilterPath)
							{
								inputValue = filters.aFilters[j].oValue1;
							}
						}
						else
						{
							var inputValues = filters.aFilters[j];
							if(inputValues.aFilters[0].sPath == inputItem.bindFilterPath)
							{
								for(var k=0; k < inputValues.aFilters.length; k++)
								{
									inputValue = inputValue + inputValues.aFilters[k].oValue1 + ",";
									
								}
								inputValue = inputValue.substring(0,inputValue.length-1);
							}
						}
						
					}
				}
				
				inputUrl = inputUrl + 'placeholder."$$' +  inputItem.item + '$$" => \'' + inputValue + "',";

			}
			
			inputUrl = inputUrl.substring(0,inputUrl.length-1);
		}
		
		/************************
		 * end Chris Gao
		 * 2015-08-18
		 **********************/
		
		var content = [], partNumber, skip, top= 500000, verticalLayout;//1000000, verticalLayout; //over 100,000 will split the excel
		var countUrl;
		if(config.download.countUrl) {
			args = [filterModel];
			if(config.download.countUrl.args && config.download.countUrl.args.length > 0) {
				for(var i = 0; i < config.download.countUrl.args.length; i++) {
					args.push(config.download.countUrl.args[i]);
				}
			}
			countUrl = config.download.countUrl.func.apply(config.download.countUrl.context || window, args);
		} else {
			oDataListBinding = table.getBinding("rows");
			if(oDataListBinding === undefined) {
				lenovo.control.commontable.Toolkit.showErrorMsg("Please firstly click search button then download", "ERROR", "Download");
				return false;
			}
			oModel = table.getModel();
			sServiceUrl = oModel.sServiceUrl;
			sPath = oDataListBinding.sPath;
			sFilterParams = oDataListBinding.sFilterParams;
			countUrl = sServiceUrl + sPath + "/$count?";
			if(sFilterParams){
				countUrl = countUrl + sFilterParams;
			}
		}
		var url = "";
		if(typeof config.download.url === "string") {
			url = config.download.url;
		} else {
			url = "/cdp/common/services/getFile.xsjs";	
		}
		url += "?table=" + tableName + "&top=" + top;
		if(config.download.urlParam) {
			url += config.download.urlParam.func.apply( config.download.urlParam.context || window, config.download.urlParam.args || []);
		} else {
			match = sFilterParams && sFilterParams.match(regx);
			if(match && match.length > 1) {
				url = url + "&filter=" + match[1];		
			}
		}
		for(var i = 0; i < columns.length; i++) {
			url +="&column="+ columns[i];
		}
		/***************************************************
		 * Added by Chris Gao
		 * 2015-09-23
		 * to do the mapping table header and download header
		 ****************************************************/
		if(config.download !== undefined && config.download.mappingTableHeader !== undefined)
		{
			var mappingheaders = JSON.stringify(config.download.mappingTableHeader);
			url += "&mappingTableHeader=" + mappingheaders;
			
		}
		/**************************************************
		 * End by Chris Gao
		 *************************************************/
		
		/***************************************************
		 * Added by Chris Gao
		 * 2015-09-23
		 * to do download sort and order by
		 ****************************************************/
		if(config.download !== undefined && config.download.defaultOrderColumn !== undefined)
		{
			url += "&sortColumn=" + config.download.defaultOrderColumn;
			
		}
		if(config.download !== undefined && config.download.defaultOrderSort !== undefined)
		{
			url += "&sortOrder=" + config.download.defaultOrderSort;
			
		}
		/**************************************************
		 * End by Chris Gao
		 *************************************************/
		
		if(typeof countUrl === "string") {
			//get count of the Download Table Record -- Chris Gao
			$.ajax({
				url: countUrl,
				type: "get",
				datatype: "JSON",
				success: function(count){
					openExportDialog(count);
				}
			});
		}else if(typeof countUrl === "number") {
			openExportDialog(countUrl);
		}
		function openExportDialog(count){
			partNumber = Math.floor(count/top);
			exportDialog.removeAllContent();	
			verticalLayout = new sap.ui.layout.VerticalLayout().addStyleClass("export-verical-layout");	
			var time = lenovo.control.commontable.Toolkit.yyyy_mm_dd_hh_mm_ssDateFormat.format(new Date()); 
			
			var new_url = "";
			for(var i = 0; i <= partNumber; i++) {
				partFilename = (i == 0 && partNumber == 0 ) ? filename :  filename + " part_" + (i+1);
				/************************
				 * added by Chris Gao
				 * to call another download xsjs
				 * to implement download table with input parameters
				 * 2015-08-18
				 **********************/
				if(tablewithinputpara != "" && inputUrl != "")
				{	
					if (i === 0){
						tablewithinputpara = tablewithinputpara + " (" + inputUrl + ")";
					};
					new_url = url + "&skip=" + (i * top) + "&filename=" + partFilename + " " + time + "&rolename=" + roleName + "&tablewithinputpara=" + tablewithinputpara;
				}
				else
				{
					new_url = url + "&skip=" + (i * top) + "&filename=" + partFilename + " " + time + "&rolename=" + roleName;
				}
				/************************
				 * end Chris Gao
				 * 2015-08-18
				 **********************/
				var oLink = new sap.ui.commons.Link({
					text:  "download "  + partFilename,
					href: new_url,
					target: "_blank",
					/*press: (function(i){
						return function(){
							that._downloadExportFile(url + "&skip=" + (i * top) + "&filename=" + oLink.getText() + " " + time + "&rolename=" + roleName);
						}
					}(i))*/
				});
				oLink.setHref(new_url);
				verticalLayout.addContent(oLink);
				exportDialog.addContent(verticalLayout);
			}
			exportDialog.open();
		}
	}, 
	_downloadExportFile: function(url){
		this.service.checkSessionRelogin();
		window.open(url);
	},
	_search: function(filterModel, table, config, filterPanel) {
		if(config._search) {
			var args = [filterModel];
			if( config._search.args && config._search.args.length > 0) {
				for(var i = 0; i < config._search.args.length; i++) {
					args.push(config._search.args[i]);
				}
			}
			args.push(filterPanel);
			args.push(table);
			this.service.checkSessionRelogin();
			config._search.func.apply(config._search.context || window, args);
		} 
		
		/**************************************
		 * added by Chris Gao
		 * used for search OData with input Parameters
		 * 2015-08-18
		 *************************************/
		else if(config.searchInputs != null && config.searchInputs.hasInputPara == true){
			//config.bindRowUrl = "INPUT_CYCLE_ITEM(in_cycle='CURRENT', in_partnumber='000000C25127,000000C25128')/Results";
//			config.searchInputs = {
//				hasInputPara: true,
//				urlId : "INPUT_CYCLE_ITEM",
//				urlInputParas:[{item: "in_cycle", value:""},
//				               {item: "in_partnumber", value:""}]
//			};
			
			
			
			this.service.checkSessionRelogin();
			var isAllValidated = lenovo.control.commontable.Toolkit._getFilterAllValidted(config, filterPanel);
			if(!isAllValidated)
				return;
			table.clearSelection();
			table.setBusy(true);
			table.setFirstVisibleRow(0);
			var filters = this._getAllFilters(filterModel, config);
			var defaultSort = this._getDefaultSort(config);
			
			/*************************************************
			 * url parsing -- wait for performance enhancement
			 * Chris Gao
			 * 2015-08-19
			 *************************************************/
			var url = config.searchInputs.urlId + "(" ;
			var inputUrl = "";
			var inputParas = config.searchInputs.urlInputParas;
			for(var i=0; i< inputParas.length; i++)
			{
				var inputItem = inputParas[i];
				var inputValue = inputItem.value != null ? inputItem.value : "";
				
				if(filters.aFilters != null && filters.aFilters.length > 0)
				{
					for(var j=0; j<filters.aFilters.length; j++)
					{
						
						if(filters.aFilters[j]._bMultiFilter == false)
						{
							if(filters.aFilters[j].sPath == inputItem.bindFilterPath)
							{
								inputValue = filters.aFilters[j].oValue1;
							}
						}
						else
						{
								var inputValues = filters.aFilters[j];
								if(inputValues.aFilters[0].sPath == inputItem.bindFilterPath)
								{
									for(var k=0; k < inputValues.aFilters.length; k++)
									{
										inputValue = inputValue + inputValues.aFilters[k].oValue1 + ",";
										
									}
									inputValue = inputValue.substring(0,inputValue.length-1);
								}
						}
						
					}
				}
				
				inputUrl = inputUrl + inputItem.item + "='" + inputValue + "',";

			}
			if(inputUrl != "")
			{
				inputUrl = inputUrl.substring(0,inputUrl.length-1);
			}
			
			url = url + inputUrl + ")/Results";
			
//			var service = new lenovo.service.CFE();
//			var oServiceUrl = service.getEBGCfe();
//			var oModel = new sap.ui.model.odata.ODataModel(oServiceUrl + url + "?$format=json", true);
//			table.setModel(oModel);
//			oModel.attachRequestCompleted(function(){
//				table.setBusy(false);
//			});
			//  url max length - abandon filter condition - chris 2016-08-12
			if(config.searchInputs.abandonFilter != undefined && config.searchInputs.abandonFilter == true)
			{
				table.bindRows(url, null, defaultSort, null);
			}
			else
			{
				table.bindRows(url, null, defaultSort, filters);
			}
			table.setBusy(false);
		}
		else {
			this.service.checkSessionRelogin();
			var isAllValidated = lenovo.control.commontable.Toolkit._getFilterAllValidted(config, filterPanel);
			if(!isAllValidated)
				return;
			table.clearSelection();
			table.setBusy(true);
			table.setFirstVisibleRow(0);
			var filters = this._getAllFilters(filterModel, config);
			var defaultSort = this._getDefaultSort(config);
			table.bindRows(config.bindRowUrl, null, defaultSort, filters);
		}	
	},
	_getAllFilters: function(filterModel, config){
		var filters = JSON.parse(filterModel.getJSON());
		var filterModeldde;
		//console.log("filters", filters);
		var filterModel, filterModelArray = [];
		$.each(filters, function(field, filter){
			switch(filter.type) {
				case "TextField":
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
					//chris gao 2016-03-09
					//because table rebind rows will change date time zone to UTC
					//so actual date + time zone offset
					if(config.filterTimeZoneExchange != undefined && config.filterTimeZoneExchange == true)
					{
//						var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-mm-dd HH:mm:ss" });   
						var tzOffsetMs = new Date().getTimezoneOffset()*60*1000;
						var localDate = new Date(new Date(filter.filterValue).getTime() - tzOffsetMs);
						
						if(filter.filterValue && filter.filterValue.length > 0) {
							filterModel =  new sap.ui.model.Filter({
								path: field,
								operator: filter.filterOperator,
								value1: localDate
							});
							filterModelArray.push(filterModel)
						}
					}
					else
					{
						if(filter.filterValue && filter.filterValue.length > 0) {
							filterModel =  new sap.ui.model.Filter({
								path: field,
								operator: filter.filterOperator,
								value1: filter.filterValue
							});
							filterModelArray.push(filterModel)
						}
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
	createExecutePanel: function(config) {
		var that = this;
		var executeModel = new sap.ui.model.json.JSONModel();
		var _executeConfig = {create:{}};
		_executeConfig.create.columns = config.columns;
		var oFormObj = this._createInsertForm(_executeConfig, executeModel);
		var oForm = oFormObj.oForm;
		oForm.setWidth(config.formWidth || "33.3%");
		var oPanel = new sap.ui.commons.Panel({
			title: {
				text: "Execute"
			},
			showCollapseIcon: false 
		}).addStyleClass("filter-panel");
		oPanel.addContent(oForm);
		var executeButton = new sap.ui.commons.Button({
			icon: "sap-icon://begin",
			lite: true,
			tooltip: "execute",
			press: function() {
				var isAllValidated = lenovo.control.commontable.Toolkit._getInsertAllValidted(_executeConfig, oPanel);
				if(!isAllValidated)
					return;
				var args = [oPanel, executeModel];
				if(config.execute.args) {
					for(var i = 0; i < config.execute.args.length; i++) {
						args.push(config.execute.args[i]);
					}
				}		
				config.execute.func.apply(config.execute.context || window, args);
			}
		});
		/**************
		 * to process the batch upload page
		 * Added by Chris Gao
		 * 2016-05-10
		***************/
		if(config.batchexecute && config.batchexecute.visible) {
			var exportSerachButton = new sap.ui.commons.Button({
				icon: "sap-icon://duplicate",
				lite: true,
				tooltip: "Batch Execute",
				press: function() {
					that.service.checkSessionRelogin();
					that._gotoBatchDownloadPage(config.batchexecute, oPanel, null);
				}
			});
			oPanel.addButton(exportSerachButton);
		}
		/**************
		 * End by Chris
		***************/
		oPanel.addButton(executeButton);
		return oPanel;
	},
	createPopupInsert: function(config, table){
		var that = this;
		var insertModel = new sap.ui.model.json.JSONModel();
		var oFormContent = this._createInsertForm(config, insertModel);
		var oForm = oFormContent.oForm;
		var initialInsertModelData = oFormContent.initialInsertModelData;
		var createButton =  new sap.ui.commons.Button({
			text: "Save",
			press: function() {
				that.service.checkSessionRelogin();
				if(config.create.insert) {
					var args = [config, insertModel, table, dialog]
					config.create.insert.func.apply(config.create.insert.context || window, args);
				} else {
					that._create(config, insertModel, table, dialog);
				}
				
			}
		}).addStyleClass("commontable-toolbar-btn");
		var dialog = new sap.ui.commons.Dialog({
			title: config.create.tooltip ||'Create Item',
			modal: true,
			content: [oForm],
			width: "800px",
			buttons: [createButton]
		});
		return {
			dialog: dialog,
			insertModel: insertModel,
			initialInsertModelData: initialInsertModelData
		};
	},
	_createInsertForm: function(config, insertModel){
		var that = this;
		var columns = config.create.columns;
		var oLayout = new sap.ui.layout.form.ResponsiveGridLayout({
			columnsL: columns.length,
			columnsM: columns.length,
			columnsS: columns.length
		});
		var oForm = new sap.ui.layout.form.Form({
			layout: oLayout,
			formContainers: []
		});
		var oFormContainer, oControl, formContainerConfig, obj = {} ;
		//formContainerLayout = formContainerLayout || lenovo.control.commontable.Toolkit.getDefaultLayout(columns.length);
		for(var i = 0, len = columns.length; i < len; i++) {
			oFormContainer = new sap.ui.layout.form.FormContainer();
			for(var j = 0; j < columns[i].length; j++) {
				var column = columns[i][j];
				var type =  column.type;
				oControl = lenovo.control.commontable.Toolkit._createCreateControl(column, insertModel);
				obj[column.field] = {
						value: (column[type.toLowerCase()] && column[type.toLowerCase()].defaultValue) || insertModel.getProperty("/" + column.field + "/value"),
						type: type,
						label: column.label
				};
				oFormContainer.addFormElement(oControl);
			}
			oForm.addFormContainer(oFormContainer);
		}
		var initialInsertModelData = JSON.stringify(obj);
		insertModel.setData(obj);
		oForm.setModel(insertModel);
		return {
			oForm: oForm,
			initialInsertModelData: initialInsertModelData
		};
	},
	_create: function(config, insertModel, table, dialog){
		var isAllValidated = lenovo.control.commontable.Toolkit._getInsertAllValidted(config, dialog);
		if(!isAllValidated)
			return;
		dialog.setBusy(true);
		var oData = {};
		var oEntry = JSON.parse(insertModel.getJSON());
		for(var key in oEntry) {
			if(oEntry[key].value !== null) {
				/**********************************
				* Modified by Chris Gao at 2015-8-26
				* to process initial null value
				* Modified by Chris Gao at 2015-09-21
				* to match N/A ALL default value
				***********************************/
				var value = oEntry[key].value;
				if(config.create.caninitialnull == true && value == undefined)
				{
					if(config.create.initialnullValue != undefined)
					{
						if(config.create.initialnullValue[key] != undefined)
						{
							oData[key] = config.create.initialnullValue[key];
						}
						else
						{
							oData[key] = "";
						}
							
					}	
					else
					{
						oData[key] = "";
					}
					
				}
				else
				{
					oData[key] = value;
				}
				/**********************************
				* End by Chris Gao at 2015-8-26
				* ********************************/
				if(oEntry[key].type == "DatePicker") {
					value = $.trim(value);
					if(value == "") {
						//oData[key] = "/Date(" + lenovo.control.Constants.defaultDate.getTime() + ")/";
					} else {
						oData[key] = "/Date(" + new Date(value).getTime() + ")/";
					}
				}
			}
		}
		//console.log("oEntry", oEntry);
		var url = config.create.url;
        var oModel = table.getModel(); 
        var sServiceUrl = oModel.sServiceUrl;
        var createOModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);  
        var fakeData = config.create.fakeData ? config.create.fakeData : {};
        
        //chris gao 2016-3-10
        if(config.create.relatedfakeDateField != undefined && config.create.relatedfakeDateField != null)
        {
        	var newFakeValue = "";
        	var fakeObject = {};
        	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyyMMdd" });
        	for(var valuenum = 0; valuenum < config.create.relatedfakeDateField.targetFakeValue.length; valuenum++)
        	{
        		newFakeValue = newFakeValue + dateFormat.format(insertModel.getProperty("/"+config.create.relatedfakeDateField.targetFakeValue[valuenum]).value);
        		newFakeValue = newFakeValue + config.create.relatedfakeDateField.opStringMerge;
        	}
        	newFakeValue = newFakeValue.substring(0, newFakeValue.length-1);
        	fakeObject[config.create.relatedfakeDateField.targetFakeField] = newFakeValue;
        	fakeData = fakeObject;
        }
        
        $.extend(oData, fakeData);
        //console.log("insert oData", oData);
   		createOModel.setHeaders({
            "content-type": "application/json"
        });
        createOModel.create(url, oData, {
        	success: function() {	
        		
        		//oModel.refresh(true);
        		
        		/********************************************
				 * Added by Chris Gao 2015-10-17
				 * Upgrade by Chris Gao 2015-11-06
				 * to clear filter data 
				 * when finished create
				 *******************************************/
				//1 clear table filter params
        		var config_Refresh = config;
        		var defaultFilters = lenovo.control.commontable.Table._getDefaultFilter(config_Refresh);
				var sourcePath = table.getBinding().sPath;
				var sourceSort = table.getBinding().aSorters;
				if(sourcePath != undefined && sourcePath != "" )
				{
					if(sourceSort != undefined)
					{
						table.bindRows(sourcePath, null, sourceSort, defaultFilters);
					}
					else
					{
						table.bindRows(sourcePath, null, null, defaultFilters);
					}
					
				}
				//2 clear filter Search Model
				var oPanel = $("#content").find(".filter-panel").control(); //modified at 2015-11-06
				if(oPanel.length > 0)
				{
					var oForm = oPanel[0].getContent()[0];
				}
				else
				{
					var oForm = oPanel[0].getContent();
				}
				var _dfilterModel = oForm.getModel();
				var _dfilterModelData = JSON.stringify(oForm.getModel().getData());
				lenovo.control.commontable.Table._clearAllFilterCondition(_dfilterModel, oForm, _dfilterModelData);
				/******************************************
				 * End by Chris Gao 2015-10-17
				 ******************************************/
  
        		dialog.setBusy(false);
        		lenovo.control.commontable.Toolkit.showErrorMsg("Create an item successfully", "SUCCESS", "Create");
        		dialog.close();
        		//3 refresh dropdown list to refresh data
        		lenovo.control.commontable.Toolkit.refreshDropdownbox();
        	},
        	error: function(e){	
        		dialog.setBusy(false);
        		var msg = e.response.body;
        		var errorObj = JSON.parse(e.response.body);
        		if(errorObj && errorObj.error && errorObj.error.message && errorObj.error.message.value) {
        			if(msg.indexOf("$$") != -1){
        				var e_msg = msg.split("$$")[1];
        				msg = e_msg;
        			}
        			/*************************************
        			 * updated by Chris Gao
        			 * 2015-09-11
        			 * to catch other exception
        			 *************************************/
        			else if(errorObj.error.innererror && errorObj.error.innererror.errordetail && errorObj.error.innererror.errordetail.DETAIL)
        			{
        				msg = errorObj.error.innererror.errordetail.DETAIL;
        				if(msg.lastIndexOf(": ") > -1)
        				{
        					msg_split = msg.split(": ")[1];
        					
        					if(msg_split.lastIndexOf("11000") > -1)
        					{
        						msg = msg_split.split("11000")[1];
        					}
        					else
        					{
        						msg = msg_split;
        					}
        				}
        				else
        				{
        					msg = msg;
        				}
        				
        			}
        			/************************************
        			 * end by Chris Gao
        			 * 2015-09-11
        			 ************************************/
        			else {
        				msg =  errorObj.error.message.value;
        			}
        		} 
        		lenovo.control.commontable.Toolkit.showErrorMsg(msg, "ERROR", "Create");
        	}
        });
	},

	createInsertEditDeleteUploadDownload: function(config, table, app){
		var that = this;
		var layout = new sap.ui.layout.HorizontalLayout().addStyleClass("lenovotable-toolbar");
		var eddulayout = new sap.ui.layout.HorizontalLayout();
		var editRelatedLayout =  new sap.ui.layout.HorizontalLayout();
		layout.addContent(eddulayout);
		if(config.create && config.create.visible) {
			var createConetent = this.createPopupInsert(config, table, eddulayout, editRelatedLayout);
			var insertDialog = createConetent.dialog;
			var insertModel = createConetent.insertModel;
			var initialInsertModelData = createConetent.initialInsertModelData;
			var oCreateButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://add",
				tooltip: config.create.tooltip || "create an item",
				press: function(oEvent) {
					that.service.checkSessionRelogin();
					var initialInsertData = JSON.parse(initialInsertModelData);
					var insertForm = insertDialog.getContent()[0];
					insertModel.setData(initialInsertData);
					that._clearInsert(initialInsertData, insertForm);
					insertDialog.open();
				}
			}).addStyleClass("commontable-toolbar-btn");
			layout.data("insertDialog", insertDialog);
			eddulayout.addContent(oCreateButton);
		}
		if(config.edit && config.edit.visible) {
			var oEditButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://edit",
				tooltip: "edit",
				press: function(oEvent) {
					that._edit(config, table, eddulayout, editRelatedLayout);
				}
			}).addStyleClass("commontable-toolbar-btn");
			eddulayout.addContent(oEditButton);
		}
		if(config.deleteable && config.deleteable.visible) {
			var oDeleteButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://delete",
				tooltip: "delete",
				press: function(){
					that.service.checkSessionRelogin();
					that._delete(config, table);
				}
			}).addStyleClass("commontable-toolbar-btn");
			eddulayout.addContent(oDeleteButton);
		}
		if(config.upload && config.upload.visible) {
			var regx = /\.xlsx$|\.csv$/;
			var files;
			var oDownloadTemplateButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://sys-next-page",
				tooltip: "download upload template",
				press: function() {
					window.open(lenovo.control.Constants.uploadTemplatesBaseUrl + config.upload.excelUrl);
				}
			}).addStyleClass("commontable-toolbar-btn");
			eddulayout.addContent(oDownloadTemplateButton);
			var oUploadButton = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://upload",
				tooltip: "upload, only xlsx and csv files are allowed",
				press: function(oEvent) {
					var uploadDialog = lenovo.control.commontable.Toolkit._createUploadDiaglog(config, table); //updated by Chris Gao 2015-11-06 config.upload->config
					uploadDialog.open();
				}
			}).addStyleClass("commontable-toolbar-btn");
			eddulayout.addContent(oUploadButton);
		}
		if(config.viewstatus && config.viewstatus.visible && config.upload && config.upload.visible) {
			
			var oViewStatus = new sap.ui.commons.Button({
				lite: true,
				icon: "sap-icon://inspect",
				tooltip: "view status",
				press: function(){
					that.service.checkSessionRelogin();
					that._viewstatus(app, config, table);
				}
			}).addStyleClass("commontable-toolbar-btn");
			eddulayout.addContent(oViewStatus);
		}
		var oEditDoneButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://accept",
			tooltip: "save",
			press: function(oEvent) {
				that.editDone(config, table, eddulayout, editRelatedLayout);
			}
		}).addStyleClass("commontable-toolbar-btn");
		// eddulayout.addContent(oEditDoneButton);
		var oEditCancelButton = new sap.ui.commons.Button({
			lite: true,
			icon: "sap-icon://decline",
			tooltip: "cancel",
			press: function(oEvent) {
				that.editCancel(config, table, eddulayout, editRelatedLayout);
			}
		}).addStyleClass("commontable-toolbar-btn");
		// eddulayout.addContent(oEditCancelButton);
		editRelatedLayout.setVisible(false);
		editRelatedLayout.addContent(oEditDoneButton);
		editRelatedLayout.addContent(oEditCancelButton);
		
		layout.addContent(editRelatedLayout);
		var custButton =  new sap.ui.commons.Button({
			lite: true,
			tooltip: "Customize Column",
			icon: "sap-icon://hide",
			press: function(oEvent){
				that.customColumn(table, config);
			}
		}).addStyleClass("commontable-toolbar-btn");
		eddulayout.addContent(custButton);

		var freezeBtn =  new sap.ui.commons.Button({
			lite: true,
			tooltip: "Freeze column",
			icon: "sap-icon://heating-cooling",
			press: function(oEvent){
				that.freezeColumn(table, config);
			}
		}).addStyleClass("commontable-toolbar-btn");
		eddulayout.addContent(freezeBtn);
		return layout;
	},
	_clearInsert: function(initialInsertData, oForm){
		var oDropdownBox;
		$.each(initialInsertData, function(key, insert){
			var type = insert.type;
			if(type === "DropdownBox") {
				var label = insert.label;
				var initialValue = insert.value;
				oDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, label)[0];
				oDropdownBox.setSelectedKey(initialValue);
			}
		});
	},
	_viewstatus: function(app, config, table){
		var viewStatusElement = lenovo.control.commontable.Toolkit._createViewStatusContent(config.viewstatus, app, table);
		var table = viewStatusElement.getContent()[1];
		var oModel = table.getModel();
		table.setBusy(true);
		table.setFirstVisibleRow(0);
		table.clearSelection();
		oModel.refresh(true);
		app.to(viewStatusElement);
	},
	_edit: function(config, table, eddulayout, editRelatedLayout){
		var that = this;
		//table selection change event
		eddulayout.setVisible(false);
		editRelatedLayout.setVisible(true);

		table._aVisibleColumns = [];
		var aCols = table.getColumns();
		for (var i = 0, l = aCols.length; i < l; i++) {
			if (aCols[i].shouldRender()) {
				table._aVisibleColumns.push(i);
			}
		}
		table._updateBindingContexts();
		
		table.attachRowSelectionChange({oTable: table, config: config, that: that}, that._onHandleSelection);
		/************************
		 * added by Chris Gao
		 * 2015-10-28
		 * to process the un-navigation table
		 ******************************/
		if(table.getNavigationMode() == "Paginator") 
		{
			table._oPaginator.attachPage({oTable: table, that: that, eddulayout: eddulayout, editRelatedLayout: editRelatedLayout}, that._onHandlePaging);
		}
		else //Scrollbar
		{
//			table.selectAll();
			var editableColumns = that._getEditableColumns(table, config)[0];
			if(sap.ui.getCore().getModel("ScrollingEditArray") == undefined || sap.ui.getCore().getModel("ScrollingEditArray") == null)
			{
				var _editArray = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(_editArray, "ScrollingEditArray"); //register model for scrolling save -- when edit
			}
			table._oVSb.attachScroll({oTable: table, that: that, eddulayout: eddulayout, editRelatedLayout: editRelatedLayout, editableColumns: editableColumns}, that._onHandleScrolling);
		}
		//table._oPaginator.attachPage({oTable: table, that: that, eddulayout: eddulayout, editRelatedLayout: editRelatedLayout}, that._onHandlePaging);
		that._onTableSelectionChange(table, config);
	},
	_delete: function(config, table){
		var that = this;
	
		var selectedIndices = table.getSelectedIndices();
		if(selectedIndices.length == 0) {
			lenovo.control.commontable.Toolkit.showErrorMsg("Please select an item", "ERROR", "Delete");
			return;
		}
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to delete?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				that.service.checkSessionRelogin();
				that._deleteAction(config, table);
			}
		}, 	"Confirm");
	},
	_deleteAction: function(config, table){
		var selectedIndices = table.getSelectedIndices();
		var oModel = table.getModel();
		var context, rowData, batchOperation, sPath, batchChanges= [], isString, field;
		for(var i = 0; i < selectedIndices.length; i++) {
			context = table.getContextByIndex(selectedIndices[i]);
			if(context){
				sPath = context.getPath();
				/**************************
				 * Added by Chris Gao
				 * 2015-09-18, 2016-03-10
				 * to add fake data for deletion
				 *****************************/
				if(config.deleteExtendKeyText != undefined && config.deleteExtendKeyText != "")
				{
					sPath_pre = sPath.substring(0, sPath.indexOf("'"));
					sPath_aft = sPath.substring(sPath.indexOf("'"), sPath.length);
					sPath = sPath_pre + config.deleteExtendKeyText + "=" + sPath_aft;
				}
				if(config.deleteModel != undefined)
				{
					 var fakeData = config.deleteModel.fakeData ? config.deleteModel.fakeData : "";
//				        $.extend(sPath, fakeData);
					 //--/UI_CFE_ECC_PLANTMAPPING(CFE_PLANT='IDC',ECC_PLANT='LCFC',ITEM_TYPE='111',SUBGEO='ASA',CURRENCY='RMB')
					 if(sPath.indexOf(")") > -1 && fakeData != "")
					 {
						 sPath = sPath.substring(0, sPath.length-1);
						 sPath = sPath + "," + config.deleteModel.fakeData + ")";
					 }
				}
				/**********************
				 * End
				 ***********************/
				
				batchOperation = oModel.createBatchOperation(sPath, "DELETE") //2015-11-08
				batchChanges.push(batchOperation);
			}		
		}
		oModel.addBatchChangeOperations(batchChanges); 
		table.setBusy(true);
		oModel.submitBatch(function(data, response, errResponse){	
			if(errResponse && errResponse.length > 0) {
				var msg;
				msg = errResponse[0].response.body;
				var errorObj = JSON.parse(errResponse[0].response.body);
				if(errorObj && errorObj.error && errorObj.error.message && errorObj.error.message.value) {
					msg = errorObj.error.message.value;
				}
				_handelFail(msg);
			} else {
				_handleSuccess();
			}
		}, function(e){
			console.log("e", e);
			_handelFail(JSON.stringify(e));
		});
		function _handleSuccess(){
			
			oModel.refresh(true);
			/******************************************
			 * Added by Chris Gao
			 * 2015-10-07
			 * as 2.8 requirements changed 
			 * SALES OFFICE PCT Special Check when upload and delete
			 ******************************************/
			if(config.deleteCheckRule !== undefined && config.deleteCheckRule.checkUrl !== undefined)
			{
				$.ajax({
					url: config.deleteCheckRule.checkUrl,
					type: "get",
					async: true,
					dataType: "JSON",
					success: function(data){
						
						var dataResults = data.d.results;
						if(dataResults.length == 0)
						{
							lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete", "SUCCESS", "Delete");
						}
						else
						{
							var dataResultsString = "";
							for(var rI = 0; rI < dataResults.length; rI++)
							{
								dataResultsString = dataResultsString + dataResults[rI].SALES_ORG + " , ";
							}
							dataResultsString = dataResultsString.substring(0, dataResultsString.length - 2);
							
							lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete,\n But the sum of Sales Office PCT from such Sales Office: \n" + dataResultsString + "is not 100%", "INFORMATION", "Delete");
						}
					}
				});
			}
			else
			{
				lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete", "SUCCESS", "Delete");
			}
			/*****************************************
			 * End by Chris Gao
			 ****************************************/
			
//			lenovo.control.commontable.Toolkit.showErrorMsg("Successfully delete", "SUCCESS", "Delete");
			table.setBusy(false);
			table.clearSelection();
			/********************************************
			 * Modified by Chris Gao 2015-10-17
			 * to maintain filter data 
			 *******************************************/
			//lenovo.control.commontable.Toolkit.refreshDropdownbox();
			/*******************************************
			 * End by Chris Gao
			 ******************************************/
			
		}
		function _handelFail(errMsg){
			lenovo.control.commontable.Toolkit.showErrorMsg(errMsg, "ERROR", "Delete");
			table.setBusy(false);
		} 
	},
	/*
		config
		dropdownBox:
		{
			type: "DropdownBox",
			dropdownbox: {
				data: [{key: "gender", text: "value"}],
				or
				odata: {
					url:
					bindItemUrl: 
					bindTextField:
					bindKeyField:
				}
				or
				xsjs: {
					url: 
					bindTextField:
					bindKeyField:
				}
			}
		}
	*/
	
	
	_createControl: function(table, column) {
		var oControl;
		var type = column.type || 'TextView';
		var that = this;
		switch (type) {
			case "TextField":
				oControl = new sap.ui.commons.TextField({
					editable: false
				}).bindProperty("value", column.field, function(value){
					if(value instanceof Date) {
						/**********************************
						 * Modified at 2015-10-15
						 * to process the other date format value
						 *********************************/
						if(column.dateformat != undefined && column.dateformat != "" && column.dateformat == "MM-dd-yyyy") {
							
							return lenovo.control.commontable.Toolkit.timeDateFormatUsa.format(value);
						}
						else if(column.dateformat != undefined && column.dateformat != "" && column.dateformat == "yyyy-mm-dd hh:mm:ss") {
							
							return lenovo.control.commontable.Toolkit.yyyy_mm_dd_hh_mm_ssDateFormat.format(value);//added for date time format changed 2015-10-28
						}
						else
						{
							return lenovo.control.commontable.Toolkit.timeDateFormat.format(value);
						}
					}
					/*********************************
					 * End by Chris Gao
					 ********************************/
					
					/**********************************
					 * Modified by Chris Gao
					 * 2015-10-15
					 * to process the suffix 
					 *********************************/
					if(column.suffix != undefined && column.suffix != "")
					{
						return value + column.suffix; 
					}
					/*********************************
					 * End by Chris Gao
					 ********************************/
					
					return value;
				});
				break;
			case "PasswordField":
				oControl = new sap.ui.commons.PasswordField({
					editable: false
				}).bindProperty("value", column.field);
				break;
			case "TextView":
				//oControl = new sap.ui.commons.TextView();
				oControl = new sap.ui.commons.TextView().bindProperty("text", column.field, function(value){
					if(value instanceof Date) {
						if(value.getTime() - lenovo.control.Constants.date1970.getTime() > 0)
							return lenovo.control.commontable.Toolkit.timeDateFormat.format(value);
						else 
							return "";
					}
					return value;
				});
				break;
			case "DatePicker":
				oControl = new sap.ui.commons.DatePicker({
					editable: false,
					locale: "zh-cn",
					value: {
						path:  column.field,
					/*	type: new sap.ui.model.type.DateTime({
							pattern: (column.datepicker && column.datepicker.format) || "yyyy-MM-dd HH:mm"
						})*/
						type: new sap.ui.model.type.Date({
							pattern: (column.datepicker && column.datepicker.format) || "yyyy-MM-dd HH:mm"
						})
					}
				});
				break;
			case "Link":				
				oControl = new sap.ui.commons.Link({
					press: function(){
						lenovo.control.commontable.Toolkit.openOverlayTable(this.getText(), column.linkConfig)
					}
				}).bindProperty("text", column.field);				
			break;
			case "DropdownTable":
				oControl = new sap.ui.commons.ValueHelpField({
					editable: false,
					valueHelpRequest: function(oEvent){that._editSearchHelp(table, column, oEvent);}
				}).bindProperty("value", column.field);
				break;
			case "DependentDropdown":
				var oTextField = new sap.ui.commons.TextField({
					editable: false
				});
				var dropdownBoxConfig = column.dropdownbox;
				var oDropControl = new sap.ui.commons.DropdownBox();
				oDropControl.addStyleClass("hiddenStyle");
				oTextField.bindProperty("value",  column.field);
				oControl = new sap.ui.layout.HorizontalLayout({
					content: [oTextField, oDropControl]
				});
				break;
			case "DropdownBox":
				var dropdownBoxConfig = column.dropdownbox;
				oControl = new sap.ui.commons.DropdownBox({
					editable: false
				});
				if(dropdownBoxConfig.data) {
					$.each(dropdownBoxConfig.data, function(index, value){
						var oItem = new sap.ui.core.ListItem({
							text: value.text, 
							key: value.key
						});
						oControl.addItem(oItem);
					});
					oControl.bindProperty("value",  column.field);
				} else if(dropdownBoxConfig.odata) {
					var url = dropdownBoxConfig.odata.url;
					var bindKeyField = dropdownBoxConfig.odata.bindKeyField;
					var bindTextField = dropdownBoxConfig.odata.bindTextField;
					$.ajax({
						url: url,
						async: false,
						type: "get",
						datatype: "json",
						success: function(data){			
							var oItem;
							data = data.d.results;
							var results = [];
							$.each(data, function(index, value) {
								oItem = new sap.ui.core.ListItem({
									text: value[bindTextField],
									key: value[bindKeyField]
								});
								oControl.addItem(oItem);
							});
							/***********************************
							 * Modified by Chris Gao 2015-11-2-
							 * to initial null value in edit Condition
							 ****************************************/
							if(dropdownBoxConfig.odata.defaultNullValue != undefined && dropdownBoxConfig.odata.defaultNullValue != null && dropdownBoxConfig.odata.defaultNullValue == true)
							{
								oItem = new sap.ui.core.ListItem({
									text: "",
									key: ""
								});
								oControl.addItem(oItem);
							}
							/*********************************
							 * End by Chris Gao
							 ********************************/
							oControl.bindProperty("value",  column.field);
						}
					})
				} else if(dropdownBoxConfig.xsjs) {
					var url = dropdownBoxConfig.xsjs.url;
					$.getJSON(url, function(data){
						$.each(data, function(index, value){
							var oItem = new sap.ui.core.ListItem();
							oItem.setText({
								text: value.text,
								key: value.key
							});
							oControl.addItem(oItem);
							oControl.bindProperty("value",  column.field);
						});
					});
				}
			break;

		}
		return oControl;
	},
	
	/****************************
	 * Created by Chris Gao
	 * 2015-08-13
	 * to Add View Status Button
	 ***************************/
	_createDownloadBtnControl: function(table, column, config) {
		var oControl;
		var type = column.type || 'TextView';
		var that = this;
		if(column.type == 'SubDownloadButton')
		{
			var exportDialog = new sap.ui.commons.Dialog({
				width: "400px",
				height: '400px',
				title: "Download",
				content: [],
				modal: true,
				buttons: [new sap.ui.commons.Button({
					text: "cancel",
					press: function(){
						exportDialog.close();
					}
				})]
			});
			
			oControl = new sap.ui.commons.Button({
				icon: "sap-icon://download",
				tooltip: "export",
				press: function(oEvent) {
					//console.log(oEvent.getSource().getBindingContext().getProperty("CODE"));
					var costTapeOrId = "";
					var filename = "";
					if(oEvent.getSource().getBindingContext().getProperty("CODE") != null)
					{
						var costTapeOrId = oEvent.getSource().getBindingContext().getProperty("CODE");
						
					}
//					var downloadModel = new sap.ui.model.json.JSONModel("/cdp/ebgcfe/service/ebgCfeUi.xsodata/INPUT_CODE(INPUT_CODE='" + costTapeOrId + "')/Results?$format=json");
//					console.log(downloadModel);
					//downloadModel.getData();
					
					that._subExportSearch(config, table, exportDialog, costTapeOrId);
				}
			});		
		}
		return oControl;
	},
	/****************************
	 * Created by Chris Gao
	 * 2015-08-13
	 * to Add View Status Download function
	 ***************************/
	_subExportSearch: function(config, table, exportDialog, filterName) {
		
		var that = this;
		that.service.checkSessionRelogin();
		var filename = filterName;
		var partFilename = "";
		var modelUrl;
		
		var sPath;
		var sFilterParams;
		var regx = /^\$filter=\((.*)\)$/;
		var match = [];
		var tableName;
		
		if(typeof config.viewUploadHistoryDownload.table === 'string') {
			tableName = config.viewUploadHistoryDownload.table;
		}
		var columns = config.viewUploadHistoryDownload.columns;
		var roleName = config.viewUploadHistoryDownload.rolename;
		var content = [], partNumber, skip, top= 1000000, verticalLayout;
		var countUrl;
		
		modelUrl = config.url;  //xsodata url -- upload.xsodata
		
		
		//set table xsjs url
		var url = "/cdp/common/services/getStatusFile.xsjs";	
		url += "?table=" + tableName + "&top=" + top;
		
		//set table filter paramets
		sFilterParams = config.viewUploadHistoryDownload.bindRowFilterParameter + " eq '" + filterName +"'";
		//set data count url -- should be upgrade -- By Chris Gao
		sPath = "/"+ config.viewUploadHistoryDownload.countServiceUrl + "/$count?$filter=" + sFilterParams;
		countUrl = modelUrl + sPath;
		
		//string parse table xsjs url
		url = url + "&filter=" + sFilterParams;
		for(var i = 0; i < columns.length; i++) {
			url +="&column="+ columns[i];
		}
		if(typeof countUrl === "string") {
			//get count of the Download Table Record -- Chris Gao
			$.ajax({
				url: countUrl,
				type: "get",
				datatype: "JSON",
				success: function(count){
					openSubDownloadExportDialog(count);
				}
			});
			
		}
		//call download window
		function openSubDownloadExportDialog(count){
			partNumber = Math.floor(count/top);
			exportDialog.removeAllContent();	
			verticalLayout = new sap.ui.layout.VerticalLayout().addStyleClass("export-verical-layout");	
			var time = lenovo.control.commontable.Toolkit.yyyy_mm_dd_hh_mm_ssDateFormat.format(new Date()); 
			for(var i = 0; i <= partNumber; i++) {
				partFilename = (i == 0 && partNumber == 0 ) ? filename :  filename + " part_" + (i+1);
				var oLink = new sap.ui.commons.Link({
					text:  "download "  + partFilename,
					href: url + "&skip=" + (i * top) + "&filename=" + partFilename + " " + time + "&rolename=" + roleName,
					target: "_blank",
				});
				var urlabc = url + "&skip=" + (i * top) + "&filename=" + partFilename + " " + time + "&rolename=" + roleName;
				verticalLayout.addContent(oLink);
				exportDialog.addContent(verticalLayout);
				//console.log(urlabc);
			}
			exportDialog.open();
		}
	},
	
	/*********************************************
	 * End
	 * Added by Chris Gao 
	 * 2015-08-12
	 ********************************************/

	_onHandleSelection: function(oEvent, oData){
		oData.that._onTableSelectionChange(oData.oTable, oData.config);
	},

	_onHandlePaging: function(oEvent, oData) {
		var oTable = oData.oTable;
		var that = oData.that;

		oTable.getModel().resetChanges();
		that._resetCells(oTable);

		oTable.detachRowSelectionChange(that._onHandleSelection);
		oTable.clearSelection();

		oTable._oPaginator.detachPage(arguments.callee);
		oData.eddulayout.setVisible(true);
		oData.editRelatedLayout.setVisible(false);
		
	},
	
	/****************************************
	 * Added by Chris Gao
	 * 2015-11-07
	 * to process the edit problem caused by scrolling
	 ***************************************/
	_onHandleScrolling: function(oEvent, oData) {
		var oTable = oData.oTable;
		var that = oData.that;

//		oTable.getModel().resetChanges();
		that._resetScrollingCells(oTable,oData.editableColumns,oData.editRelatedLayout);

//		oTable.detachRowSelectionChange(that._onHandleSelection);
//		oTable.clearSelection();
//
//		oTable._oVSb.detachScroll(arguments.callee);
//		oData.eddulayout.setVisible(true);
//		oData.editRelatedLayout.setVisible(false);
		
	},
	/********************************************
	 * End by Chris Gao
	 *******************************************/

	_onTableSelectionChange: function(oTable, config){
		var that = this;
		var lastSelected = oTable.data("selection");
		var selectedIndices = oTable.getSelectedIndices();

		if(lastSelected != null && lastSelected.length>0){
			that._setColumnEditable(oTable, lastSelected, false, config);
		}
		oTable.data("selection" ,selectedIndices.slice(0));
		that._setColumnEditable(oTable, selectedIndices, true, config);

		if(oTable.getNavigationMode() == "Scrollbar") 
		{
			
			if(sap.ui.getCore().getModel("ScrollingEditArray") != undefined && sap.ui.getCore().getModel("ScrollingEditArray") != null)
			{
				var editFields = config.editRaw;
				var scrollingEditArray = new Array();
				for(var i = 0; i<selectedIndices.length; i++)
				{
					var scollingEditData = new Object(); 
					scollingEditData.key = selectedIndices[i];
					scollingEditData.Pkey = oTable.getContextByIndex(selectedIndices[i]).sPath;
					var editValueArray = new Array();
					for(var k = 0; k < editFields.length; k++)
					{
						var editValueEntry = new Object();
						var key = editFields[k].field;
				        var valueIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField(editFields[k].label, oTable);
				        if(valueIndex == -1)
				        	continue;
				        var value = that._getEditableCellValue(oTable, selectedIndices[i], valueIndex);
				        editValueEntry.key = valueIndex;
				        editValueEntry.Pkey = key;
				        editValueEntry.value = value;
				        editValueArray.push(editValueEntry);
				        
					}
					scollingEditData.PutValue = editValueArray;
					scrollingEditArray.push(scollingEditData);
				}
					
				
				sap.ui.getCore().getModel("ScrollingEditArray").setData(scrollingEditArray);
				console.log(sap.ui.getCore().getModel("ScrollingEditArray").getData());
			}
		}
	},

	_setColumnEditable: function(oTable, array, blnEditable, config){
		var that = this;
		var rows = oTable.getRows();
		var rowCount = rows.length;
		var cells, oItem, index, editableColumns=[];
		var dependentDropdownArray = [];

		if(rowCount < 1){
			//to-do show msg-box "no row is such table"
			return;
		}
		editableColumns = that._getEditableColumns(oTable, config)[0];
		dependentDropdownArray = that._getEditableColumns(oTable, config)[1];
		if(editableColumns.length < 1 && dependentDropdownArray.length < 1){
			//to-do show msg-box "no editable columns set in the config"
			return;
		}
		for(var i = 0; i < array.length; i++){
			//modified by Chris Gao 2015-11-07
			
			if(oTable.getNavigationMode() == "Scrollbar") 
			{
				indexF = that._getRowNumofIndex(rows,array[i]);
				if(indexF >= 0)
				{
					cells = rows[indexF].getCells();
					for(var j = 0; j < editableColumns.length; j++){
						cells[editableColumns[j]].setEditable(blnEditable);
						
						if(blnEditable){
							cells[editableColumns[j]].addStyleClass("editable");
							cells[editableColumns[j]].attachChange({oTable: oTable, config: config, that: that}, that._editValidation);
							that._addValidationForDateRange(oTable, config, rows[indexF]);
						}else{
							cells[editableColumns[j]].removeStyleClass("editable");
							cells[editableColumns[j]].detachChange(that._editValidation);
							that._clearErrorPopup(cells[editableColumns[j]]);
						}
					}
					for(var k = 0; k < dependentDropdownArray.length; k++){
						var oIndex = dependentDropdownArray[k].index;
						var rIndex = dependentDropdownArray[k].referToIndex;
						var textField = cells[oIndex].getContent()[0];
						var oDropDown = cells[oIndex].getContent()[1];

						if(blnEditable){
							
							textField.addStyleClass("hiddenStyle");
							oDropDown.removeStyleClass("hiddenStyle");
							lenovo.control.commontable.Toolkit.relateDropDwonBox(cells[rIndex], oDropDown, {
			                    transform: function (data){
			                            return data.d.results;
			                    },
			                    url: function(selectedKey, aurl){
			                            return aurl + selectedKey + "')/Results?$format=json";
			                    },
			                    args: [dependentDropdownArray[k].url],
			                    bindTextField: dependentDropdownArray[k].bindTextField,
			                    bindKeyField: dependentDropdownArray[k].bindKeyField,
			                    emptyFirstListItem: dependentDropdownArray[k].emptyFirstListItem
			                });

			                var bindTextF = dependentDropdownArray[k].bindTextField;
			                var bindKeyF = dependentDropdownArray[k].bindKeyField;
			                var valueF = cells[rIndex].getValue();
			                var urlF = dependentDropdownArray[k].url;
			               // console.log(urlF + valueF);
			                $.ajax({
								url: urlF + valueF + "')/Results?$format=json",
								type: "get",
								async: false,
								dataType: "JSON",
								success: function(data){
									oDropDown.removeAllItems();
									oItem = new sap.ui.core.ListItem({
											text: "",
											key: ""
										});
									oDropDown.addItem(oItem);
									data = data.d.results;
									$.each(data, function(index, value) {
										oItem = new sap.ui.core.ListItem({
											text: value[bindTextF],
											key: value[bindKeyF]
										});
										oDropDown.addItem(oItem);
									});
									oDropDown.setValue(valueF);
								}
							});

						}else{
							textField.removeStyleClass("hiddenStyle");
							oDropDown.addStyleClass("hiddenStyle");
						}
					}
				}
				
			}
			else
			{
				indexF = array[i] % rowCount;
				cells = rows[indexF].getCells();
				for(var j = 0; j < editableColumns.length; j++){
					cells[editableColumns[j]].setEditable(blnEditable);
					
					if(blnEditable){
						cells[editableColumns[j]].addStyleClass("editable");
						cells[editableColumns[j]].attachChange({oTable: oTable, config: config, that: that}, that._editValidation);
						that._addValidationForDateRange(oTable, config, rows[indexF]);
					}else{
						cells[editableColumns[j]].removeStyleClass("editable");
						cells[editableColumns[j]].detachChange(that._editValidation);
						that._clearErrorPopup(cells[editableColumns[j]]);
					}
				}
				for(var k = 0; k < dependentDropdownArray.length; k++){
					var oIndex = dependentDropdownArray[k].index;
					var rIndex = dependentDropdownArray[k].referToIndex;
					var textField = cells[oIndex].getContent()[0];
					var oDropDown = cells[oIndex].getContent()[1];

					if(blnEditable){
						
						textField.addStyleClass("hiddenStyle");
						oDropDown.removeStyleClass("hiddenStyle");
						lenovo.control.commontable.Toolkit.relateDropDwonBox(cells[rIndex], oDropDown, {
		                    transform: function (data){
		                            return data.d.results;
		                    },
		                    url: function(selectedKey, aurl){
		                            return aurl + selectedKey + "')/Results?$format=json";
		                    },
		                    args: [dependentDropdownArray[k].url],
		                    bindTextField: dependentDropdownArray[k].bindTextField,
		                    bindKeyField: dependentDropdownArray[k].bindKeyField,
		                    emptyFirstListItem: dependentDropdownArray[k].emptyFirstListItem
		                });

		                var bindTextF = dependentDropdownArray[k].bindTextField;
		                var bindKeyF = dependentDropdownArray[k].bindKeyField;
		                var valueF = cells[rIndex].getValue();
		                var urlF = dependentDropdownArray[k].url;
		               // console.log(urlF + valueF);
		                $.ajax({
							url: urlF + valueF + "')/Results?$format=json",
							type: "get",
							async: false,
							dataType: "JSON",
							success: function(data){
								oDropDown.removeAllItems();
								oItem = new sap.ui.core.ListItem({
										text: "",
										key: ""
									});
								oDropDown.addItem(oItem);
								data = data.d.results;
								$.each(data, function(index, value) {
									oItem = new sap.ui.core.ListItem({
										text: value[bindTextF],
										key: value[bindKeyF]
									});
									oDropDown.addItem(oItem);
								});
								oDropDown.setValue(valueF);
							}
						});

					}else{
						textField.removeStyleClass("hiddenStyle");
						oDropDown.addStyleClass("hiddenStyle");
					}
				}
			}
			
		}
	},
	
	
	/*********************
	 * Added by Chris Gao 2015-11-07
	 * to get the selected Row num of this page
	 * to solve scrolling problem
	 *********************/
	_getRowNumofIndex: function(rows, index){
		var rowNum = -1;
		for(var i=0; i<rows.length; i++)
		{
			if(rows[i].getIndex() == index)
			{
				rowNum = i;
			}
		}
		return rowNum;
	},
	/*********************
	 * End by Chris Gao
	 ********************/

	_addValidationForDateRange: function(table, config, row){
		var cells = row.getCells();
		var editRaw = config.editRaw;
		var startPicker, endPicker;
		var startFieldName, endFieldName;
		for(var i = 0, l = editRaw.length; i < l; i++){
			if(editRaw[i].referTo != undefined){
				endFieldName = editRaw[i].label;
				startFieldName = editRaw[i].referTo;
				break;
			}
		}

		startPicker = cells[lenovo.control.commontable.Toolkit.getColumnIndexByField(startFieldName, table)];
		endPicker = cells[lenovo.control.commontable.Toolkit.getColumnIndexByField(endFieldName, table)];
		if(startPicker == undefined || endPicker == undefined){
			return;
		}
		lenovo.control.commontable.Toolkit.validateDatePickerCompare(startPicker, endPicker);
	},

	editCancel: function(config, table, eddulayout, editRelatedLayout){
		var that = this;
		that._clearAllEditErrPP(config, table);
		table.detachRowSelectionChange(that._onHandleSelection);
		that._resetCells(table);
		table.getModel().refresh(true);
		table.clearSelection();
		eddulayout.setVisible(true);
		editRelatedLayout.setVisible(false);
		
		/************************************
		 * added by Chris Gao 2015-11-7
		 * to process scrolling table problem
		 ************************************/
		if(table.getNavigationMode() == "Scrollbar") 
		{
			if(sap.ui.getCore().getModel("ScrollingEditArray") != undefined && sap.ui.getCore().getModel("ScrollingEditArray") != null)
			{
				sap.ui.getCore().setModel(null, "ScrollingEditArray");
			}
		}
		/*****************
		 * End by Chris Gao
		 ****************/

		// that._clearAllEditErrPP(config, table);
	},

	editDone: function(config, table, eddulayout, editRelatedLayout){
		var that = this;
		that._clearAllEditErrPP(config, table);
		if(!that._editValidAll(table, config)){
			return;
		}
		
		that._editService(table, config, eddulayout, editRelatedLayout);
		
		/************************************
		 * added by Chris Gao 2015-11-7
		 * to process scrolling table problem
		 ************************************/
		if(table.getNavigationMode() == "Scrollbar") 
		{
			if(sap.ui.getCore().getModel("ScrollingEditArray") != undefined && sap.ui.getCore().getModel("ScrollingEditArray") != null)
			{
				sap.ui.getCore().setModel(null, "ScrollingEditArray");
			}
		}
		/*****************
		 * End by Chris Gao
		 ****************/
	},

	_editService: function(table, config, eddulayout, editRelatedLayout){
		var that = this;
		var selectedIndices = table.getSelectedIndices();
		var editFields = config.editRaw;
		var oEntry = {};
		var editMap = [];
		var oModel = table.getModel(); 
		var sServiceUrl = oModel.sServiceUrl;
        var batchModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
        var batchChanges = [];

        if(selectedIndices.length < 1){
        	lenovo.control.commontable.Toolkit.showErrorMsg("Please select at least one record", "ERROR", "Edit");
        	return;
        }
        table.setBusy(true);
		for(var i = 0; i < selectedIndices.length; i++){
			var index = table.getContextByIndex(selectedIndices[i]);
			var selectedObject = index.getObject();
			for(var j = 0; j < editFields.length; j++){
				var key = editFields[j].field;
		        var type = editFields[j].type;
		        var valueIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField(editFields[j].label, table);
		        if(valueIndex == -1)
		        	continue;
		        /****************************************
		    	 * Added by Chris Gao
		    	 * 2015-11-09
		    	 * to process the edit problem caused by scrolling
		    	 ***************************************/
		        if(table.getNavigationMode() == "Scrollbar")
		        {
		        	var value = that._getScrollingEditableCellValue(table,selectedIndices[i], key);
		        }
		        else
		        {
		        	var value = that._getEditableCellValue(table, selectedIndices[i], valueIndex);
		        }
		        /***************************************
		         * End by Chris Gao
		         **************************************/
		        // console.log(value);
		        oEntry = $.extend(true, {}, oEntry);
		        oEntry[key] = value;
		        if(type == "DatePicker"){
		        	if(value !== null && value !== ""){
		        		oEntry[key] = "/Date(" + new Date(value).getTime() + ")/";
		        	}else{
		        		//oEntry[key] = "/Date(" + lenovo.control.Constants.defaultDate.getTime() + ")/";
		        		oEntry[key] = null;
		        	}
		        }
			}
			/***********************************
			 * Modified by Chris Gao
			 * 2015-09-29
			 * to change update model index path
			 *********************************/
			if(config.editModelReplaceKey != undefined && config.editModelReplaceKey.length > 0)
			{
				console.log(index.getPath());
				var updateIndexPath = index.getPath();
				for(var keyCount = 0; keyCount < config.editModelReplaceKey.length; keyCount ++)
				{
					var replaceKeyModel = config.editModelReplaceKey[keyCount];
					if(updateIndexPath.indexOf(replaceKeyModel.sourceKey) > -1)
					{
						updateIndexPath = updateIndexPath.replace(replaceKeyModel.sourceKey,replaceKeyModel.targetKey);
					}
				}
				console.log(updateIndexPath);
				batchChanges.push(batchModel.createBatchOperation(updateIndexPath, "PUT", oEntry));
				
			}
			//chris gao 2016-03-09
			else
			{
				var updateIndexPath = index.getPath();
				if(config.editExtend != undefined && config.editExtend.length > 0)
				{
					for(var valueNum = 0; valueNum < config.editExtend.length; valueNum++)
					{
						oEntry[config.editExtend[valueNum].sKey] = config.editExtend[valueNum].sValue;
					}
					
				}
				if(config.editExtendKeyText != undefined && config.editExtendKeyText != "")
				{
					updateIndexPath_pre = updateIndexPath.substring(0, updateIndexPath.indexOf("'"));
					updateIndexPath_aft = updateIndexPath.substring(updateIndexPath.indexOf("'"), updateIndexPath.length);
					updateIndexPath = updateIndexPath_pre + config.editExtendKeyText + "=" + updateIndexPath_aft;
				}
				console.log(index.getPath());
				batchChanges.push(batchModel.createBatchOperation(updateIndexPath, "PUT", oEntry));
			}
		
			
			//console.log(oEntry);
			/*********************************
			 * End by Chris Gao
			 ********************************/
			//batchChanges.push(batchModel.createBatchOperation(index.getPath(), "PUT", oEntry));
		}

		batchModel.addBatchChangeOperations(batchChanges);
        batchModel.submitBatch(function(data, response, errorResponse) {
        	if (errorResponse && errorResponse.length > 0) {
                that._handleEditFailed(table, eddulayout, editRelatedLayout, errorResponse[0]);
            } else {
                that._handleEditSuccess(table, eddulayout, editRelatedLayout);
            }
        }, function(data) {
            that._handleEditFailed(table, eddulayout, editRelatedLayout);
        });
	},

	_getEditableCellValue: function(table, rIndex, cIndex){
		var rows = table.getRows();
		var rowIndex = rIndex % rows.length;
		var cell = rows[rowIndex].getCells()[cIndex];
		if(cell instanceof sap.ui.layout.HorizontalLayout){
			cell = cell.getContent()[1];
		}

		return cell.getValue() || null;
	},
	
	 /****************************************
	 * Added by Chris Gao
	 * 2015-11-09
	 * to process the edit problem caused by scrolling
	 ***************************************/
	_getScrollingEditableCellValue: function(table, rIndex, cField){
//		var cellValue = null;
//		if(sap.ui.getCore().getModel("ScrollingEditArray") != undefined && sap.ui.getCore().getModel("ScrollingEditArray") != null)
//		{
//			var entries = sap.ui.getCore().getModel("ScrollingEditArray").getData();
//			for(var i=0; i < entries.length; i++)
//			{
//				if(entries[i].key == rIndex)
//				{
//					var entryValues = entries[i].PutValue;
//					for(var j=0; j < entryValues.length; j++)
//					{
//						if(entryValues[j].key == cIndex)
//						{
//							cellValue = entryValues[j].value;
//						}
//					}
//				}
//			}
//		}
		var index = table.getContextByIndex(rIndex);
		var selectedObject = index.getObject();	
		
		return selectedObject[cField] || null;
	},
	/*********************************
	 * End by Chris Gao
	 ********************************/

	_handleEditSuccess: function(table, eddulayout, editRelatedLayout){
		var that = this;
		table.setBusy(false);
		that._resetCells(table);	
		table.getModel().refresh();
		table.clearSelection();
		table.detachRowSelectionChange(that._onHandleSelection);
		eddulayout.setVisible(true);
		editRelatedLayout.setVisible(false);
		/*************************************
		 * Modified by Chris Gao
		 * 2015-10-17
		 * to maintain filter value after edit
		 ***************************************/
		//lenovo.control.commontable.Toolkit.refreshDropdownbox();
		/****************************************
		 * End by Chris Gao
		 ***************************************/
	},

	_handleEditFailed: function(table, eddulayout, editRelatedLayout, errorResponse){
		var errorMsg = "";
		if(errorResponse==undefined){
			errorMsg = "Failed, please contact your system admin.";
		}else{
			var body = JSON.parse(errorResponse.response.body);
			errorMsg = body.error.message.value;
		}
		lenovo.control.commontable.Toolkit.showErrorMsg(errorMsg, "ERROR", "Edit");
		console.log("edit failed");
		var that = this;
		table.setBusy(false);
		that._resetCells(table);	
		table.getModel().refresh(true); //coral 2015.4.22
		table.clearSelection();
		table.detachRowSelectionChange(that._onHandleSelection);
		eddulayout.setVisible(true);
		editRelatedLayout.setVisible(false);
	},

	_resetCells: function(oTable){
		var rows = oTable.getRows();
		var cells;
		for(var i = 0; i < rows.length; i++){
			cells = rows[i].getCells();
			for(var j = 0; j < cells.length; j++){
				if(cells[j] instanceof sap.ui.layout.HorizontalLayout){
					cells[j].getContent()[0].removeStyleClass("hiddenStyle");
					cells[j].getContent()[1].addStyleClass("hiddenStyle");
				}else{
					cells[j].setEditable(false);
				}
				cells[j].removeStyleClass("editable");
			}
		}
		
	},
	
	/*************************
	 * Added by Chris Gao
	 * 2015-11-07
	 * to process the edit problem when table scrolling
	 **************************/
	_resetScrollingCells: function(oTable, editableColumns, relatedEditLayout){
		var rows = oTable.getRows();
		var cells;
		var selectedRows = oTable.getSelectedIndices();
//		var selectedBindingKeys = oTable.getBinding().aKeys;
//		console.log("Path:"+selectedBindingKeys[selectedRows[0]]);
		
		
		for(var i = 0; i < rows.length; i++){
			if(!oTable.isIndexSelected(rows[i].getIndex()))//if($.inArray(i, selectedRows) < 0 && $.inArray(rows[i].getIndex(), selectedRows) < 0)
			{
				
				cells = rows[i].getCells();
				for(var j = 0; j < cells.length; j++){
					if(cells[j] instanceof sap.ui.layout.HorizontalLayout){
						cells[j].getContent()[0].removeStyleClass("hiddenStyle");
						cells[j].getContent()[1].addStyleClass("hiddenStyle");
					}else{
						cells[j].setEditable(false);
					}
					cells[j].removeStyleClass("editable");
				}
			}
			else
			{
				console.log("Path:"+oTable.getContextByIndex(rows[i].getIndex()));
				cells = rows[i].getCells();
				for(var j = 0; j < editableColumns.length; j++){
					if(relatedEditLayout.getVisible() == true){
						cells[editableColumns[j]].setEditable(true);
						cells[editableColumns[j]].addStyleClass("editable");
						
					}
				}
			}
			
		}
		
	},
	/**************************
	 * End by Chris Gao
	 ************************/

	_getEditableColumns: function(oTable, config){
		var returnArray = []
		var editableColumns = [];
		var dependentDropdownArray = [];
		var configArray = config.editRaw;
		var arraylength = configArray.length;
		var index;
		var validationColumns = [];
		if(arraylength < 1){
			return [];
		}
		for(var i = 0; i < arraylength; i++){
			index = lenovo.control.commontable.Toolkit.getColumnIndexByField(configArray[i].label, oTable);
			if(index == -1)
				continue;
			//coral 7/16/2015
			if((configArray[i].refer == "" || configArray[i].refer == undefined || configArray[i].refer == null) && configArray[i].editable == undefined)
				editableColumns.push(index);
			else if(configArray[i].editable == false){
				validationColumns.push(index);
			} else{
				var rIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField(configArray[i].refer, oTable);
				dependentDropdownArray.push({
					index: index,
					referToIndex: rIndex,
					url: configArray[i].url,
					bindTextField: configArray[i].bindTextField,
					bindKeyField: configArray[i].bindKeyField,
					emptyFirstListItem: configArray[i].emptyFirstListItem == "" || configArray[i].emptyFirstListItem == undefined? true:configArray[i].emptyFirstListItem
				});
			}
		} 

		returnArray.push(editableColumns);
		returnArray.push(dependentDropdownArray);
		return returnArray;
	},

	_editValidation: function(oEvent, oData){
		var that = oData.that;
		var configEdit = oData.config.editRaw;
		var cell = oEvent.getSource();
		var row = cell.getParent();
		var table = row.getParent();
		var columnIndex = row.indexOfCell(cell);
		var column = table.getColumns()[columnIndex];
		var columnName = column.getLabel().getText();
		var error = [];

		that._clearErrorPopup(cell);

		for(var i = 0, length = configEdit.length; i < length; i++){
			if(configEdit[i].label == columnName){
				error = that._getValidResult(configEdit[i].validation, cell);
				break;
			}
		}
		that._showEditError(error, cell, table);
		
		/*******************************
		 * added by Chris Gao 2015-11-08
		 * to change cell value into model
		 * to process scrolling problem
		 *******************************/
		if(error != undefined && error.length <= 0)
		{
			//change table binding model value
			var index = table.getContextByIndex(row.getIndex());
			var selectedObject = index.getObject();	
			
			if(table.getNavigationMode() == "Scrollbar" && sap.ui.getCore().getModel("ScrollingEditArray") != undefined && sap.ui.getCore().getModel("ScrollingEditArray") != null)
			{
				//recording into internal storage
				var scrollingEidtData = sap.ui.getCore().getModel("ScrollingEditArray").getData();
				for(var i=0; i<scrollingEidtData.length; i++)
				{
					if(scrollingEidtData[i].key == row.getIndex())
					{
						var editValueArray = scrollingEidtData[i].PutValue;
						if(editValueArray.length > 0)
						{
							for(var j=0; j<editValueArray.length; j++)
							{
								if(editValueArray[j].key == columnIndex)
								{
									editValueArray[j].value = cell.getValue();
									//RESET TABLE MODEL VALUE
									selectedObject[editValueArray[j].Pkey] = cell.getValue();
								}
							}
						}
						scrollingEidtData[i].PutValue = editValueArray;
						
					}
				}
				
				
				row.bindObject(index.sPath,selectedObject);
				console.log(table.getContextByIndex(row.getIndex()).getObject());
				sap.ui.getCore().getModel("ScrollingEditArray").setData(scrollingEidtData);
			}
		}
		
		/******************************
		 * End by Chris Gao
		 *****************************/
	},

	_getValidResult: function(validation, cell){
		var that = this;
		if(cell instanceof sap.ui.layout.HorizontalLayout){
			cell = cell.getContent()[1];
		}

		var value = cell.getValue();
		var error = [];
		if(validation == undefined || validation.length == 0){
			return [];
		}
		for(var i = 0, length = validation.length; i < length; i++){
			var validType = validation[i].validType;
			var errMsg = validation[i].errMsg;
			if(validType instanceof Function) {
				if(!validType(value))
					error.push(errMsg);
				continue;
			}
			if(validType instanceof RegExp){
				if(!validType.test(value))
					error.push(errMsg);
				continue;
			}
		}
		return error;
	},

	_setErrorDataForCell: function(cell, error){
		var errPP = cell.data("errorPP");
		
		if(errPP == undefined || errPP == null){
			errPP = new sap.ui.ux3.ToolPopup({
				/*autoClose: true,
				opener : cell,
				closeDuration: 1500*/
				autoClose: true,
				opener : cell,
			});
			var oLayout = new sap.ui.layout.VerticalLayout();

			for(var i = 0, length = error.length; i < length; i++){
				oLayout.addContent(new sap.ui.commons.Label({text:error[i]}));
			}
			errPP.addContent(oLayout);
			/*errPP.attachClosed(function(){
				var errPPArr = $(".sapUiUx3TP");		
				this.destroyContent();		
			});*/
			var errPPArr = $(".sapUiUx3TP:visible");
			if((errPP !== undefined || errPP !== null) && errPPArr.length == 0){
				errPP.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);
			}
			
			
			cell.data("errorPP", errPP);
			cell.attachChange(function(){			
				if(this.getValue() == ""){			
					errPP.open(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);			
				}else{
					if(errPP !== undefined || errPP !== null){
						errPP.close();		
					}					
				}		
			})
		}
		
		// errPP.setOpenDuration(0);
		// errPP.setCloseDuration(2000);
		
	},

	_clearErrorPopup: function(cell){
		var errPP = cell.data("errorPP");
		if(errPP != undefined && errPP != null){
			if(errPP.isOpen()){
				errPP.close();
			}
			errPP = null;
			cell.data("errorPP", null);
		}
	},

	_showEditError: function(errMsg, control){
		if(errMsg.length > 0){
			this._setErrorDataForCell(control, errMsg);
		}
	},

	_clearAllEditErrPP: function(config, table){
		var selectedIndices = table.getSelectedIndices();
		var rows = table.getRows();
		var editFields = config.editRaw;
		var cells;

		for(var i = 0, length = selectedIndices.length; i < length; i++){
			var index = selectedIndices[i] % rows.length;
			cells = rows[index].getCells();
			for(var j = 0, l = editFields.length; j < l; j++){
				var cIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField(editFields[j].label, table);
				if(cIndex == -1)
					continue;
				this._clearErrorPopup(cells[cIndex]);
			}
		}
	},

	_editValidAll: function(table, config){
		var selectedIndices = table.getSelectedIndices();
		var rows = table.getRows();
		var editFields = config.editRaw;
		var cells;
		var error = [];
		var flag = true;
		var rowCount = rows.length;


		for(var i = 0, length = selectedIndices.length; i < length; i++){
			cells = rows[selectedIndices[i] % rowCount].getCells();
			for(var j = 0, l = editFields.length; j < l; j++){
				var cIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField(editFields[j].label, table);
				if(cIndex == -1)
					continue;
				error = this._getValidResult(editFields[j].validation, cells[cIndex]);
				if(error.length > 0){
					this._showEditError(error, cells[cIndex], table);
					flag = false;
				}
			}
		}

		return flag;
	},

	customColumn: function(table, config){
		var that = this;
		// var allColumn = config.columns;
		var viewColumn = table.getColumns();
		var restArray = [];
		var visableArray = [];

		for(var i = 0, l = viewColumn.length; i < l; i++){
			if(lenovo.control.commontable.Toolkit.isContainInArray(config.editRaw, viewColumn[i].getLabel().getText(), "label")){
				continue;
			}

			if(viewColumn[i].getVisible())
				visableArray.push({label: viewColumn[i].getLabel().getText()});
			else
				restArray.push({label: viewColumn[i].getLabel().getText()});
		}
		//console.log(visableArray);
		var _oContent = this._createCustomContent(visableArray, restArray, table);

		table.setFixedColumnCount(0);
		table.setFixedRowCount(0);

		var dialog = new Dialog("custom_column",{
			title: "Customize Table Column",
			contentWidth:"600px",
			resizable: false,
			keepInWindow: true,
			height: "400px",
			modal: true,
			content: _oContent,
			closed:function(){
				this.destroy();
			},
		});
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button("done",{
			text : "Close", 
			press: function(){
				dialog.close();
			}});
		dialog.addButton(oButton);
	},

	_createCustomContent: function(visableArray, restArray, table){
		var that = this;
		//Init the splitter
		var oSplitterV = new sap.ui.commons.Splitter("splitterV"); 
		oSplitterV.setShowScrollBars(false);
		oSplitterV.setSplitterOrientation(sap.ui.commons.Orientation.vertical);
		oSplitterV.setSplitterPosition("50%");
		oSplitterV.setMinSizeFirstPane("50%");
		oSplitterV.setMinSizeSecondPane("50%");
		oSplitterV.setSplitterBarVisible(false);
		oSplitterV.setWidth("600px");
		oSplitterV.setHeight("300px");
		oSplitterV.addStyleClass("userGroup");

		//add user assignment into left bottom panel
		var oVisibleTable = new sap.ui.table.Table("visibleTable",{
			width : "240px",
			visibleRowCount: 9
		});
		oVisibleTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		oVisibleTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "Visible Column"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "label"),
        	width: "200px",
        }));
		this._setCustomDataForTable(oVisibleTable, visableArray);

        // add assign button
        var oUnassignBtn = new sap.ui.commons.Button({
			toolTip: "Unassign",
			width: "100%",
			lite: true,
			icon: "sap-icon://open-command-field",
			press:  function(){that._removeColumn(oSplitterV, table);}
		});
        var oAssignBtn = new sap.ui.commons.Button({
			toolTip: "Assign",
			width: "100%",
			lite: true,
			icon: "sap-icon://close-command-field",
			press: function(){that._addColumn(oSplitterV, table);}
		});
        var oVLayout = new sap.ui.layout.VerticalLayout("vLayout", {
			content: [oUnassignBtn, oAssignBtn]
		});
		oVLayout.addStyleClass("assignUser");
		var oHLayout = new sap.ui.layout.HorizontalLayout("hLayout", {
			content: [oVisibleTable, oVLayout]
		});
		oSplitterV.addFirstPaneContent(oHLayout);

		//add user list into the right panel
		var oRestTable = new sap.ui.table.Table("restTable",{
			width : "280px",
			visibleRowCount: 9
		});
		oRestTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		oRestTable.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "Hidden Column"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "label"),
        	width: "240px",
        }));
		this._setCustomDataForTable(oRestTable, restArray);
		oSplitterV.addSecondPaneContent(oRestTable);	

		return oSplitterV;
	},

	_setCustomDataForTable : function(table, oData){
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({modelData: oData});
		table.setModel(oModel);
		table.bindRows("/modelData");
	},

	_addColumn: function(oContent, table){
		var hTable = oContent.getSecondPaneContent()[0];
		var selectedIndices = hTable.getSelectedIndices();
		if(selectedIndices.length < 1)
			return;
		var vTable = oContent.getFirstPaneContent()[0].getContent()[0];
		var vArray = JSON.parse(vTable.getModel().getJSON()).modelData;
		var hArray = JSON.parse(hTable.getModel().getJSON()).modelData;

		for(var i = 0, l = selectedIndices.length; i < l; i++){
			var so = hTable.getContextByIndex(selectedIndices[i]).getObject();
			this._arrayTransfer(vArray, hArray, so);
		}

		this._setCustomDataForTable(vTable, vArray);
		this._setCustomDataForTable(hTable, hArray);
		vTable.clearSelection();
		hTable.clearSelection();

		this._setColumnVisible(hArray, table);
	},
	_removeColumn: function(oContent, table){
		var vTable = oContent.getFirstPaneContent()[0].getContent()[0];
		var selectedIndices = vTable.getSelectedIndices();
		if(selectedIndices.length < 1)
			return;
		var hTable = oContent.getSecondPaneContent()[0];
		var vArray = JSON.parse(vTable.getModel().getJSON()).modelData;
		var hArray = JSON.parse(hTable.getModel().getJSON()).modelData;

		for(var i = 0, l = selectedIndices.length; i < l; i++){
			var so = vTable.getContextByIndex(selectedIndices[i]).getObject();
			this._arrayTransfer(hArray, vArray, so);
		}

		this._setCustomDataForTable(vTable, vArray);
		this._setCustomDataForTable(hTable, hArray);
		vTable.clearSelection();
		hTable.clearSelection();

		this._setColumnVisible(hArray, table);
	},

	_arrayTransfer: function(target, original, object){
		target.push(object);
		for(var i = 0, l = original.length; i < l; i++){
			if(original[i].label == object.label){
				original.splice(i, 1);
				return;
			}
		}
	},

	_setColumnVisible: function(array, table){
		var columns = table. getColumns();
		for(var i = 0, l = columns.length; i < l; i++){
			var columnName = columns[i].getLabel().getText();
			if(lenovo.control.commontable.Toolkit.isContainInArray(array, columnName, "label"))
				columns[i].setVisible(false);
			else
				columns[i].setVisible(true);
		}

//		console.log(columns);
//		console.log(table.getRows()[0].getCells());
	},

	freezeColumn: function(table, config){
		var _oContent = this._createFreezeContent(table);

		var dialog = new Dialog("freeze_column",{
			title: "Freeze Table Column",
			contentWidth:"600px",
			resizable: false,
			keepInWindow: true,
			height: "220px",
			modal: true,
			content: _oContent,
			closed:function(){
				this.destroy();
			},
		});
		dialog.open();
		dialog.ondragstart = false;

		var oButton = new sap.ui.commons.Button("done",{
			text : "Close", 
			press: function(){
				dialog.close();
			}});
		dialog.addButton(oButton);
	},

	_createFreezeContent: function(table){
		var that = this;
		var columnLabel = new sap.ui.commons.Label({text: "Frozen Column Number: "});
		var rowLabel = new sap.ui.commons.Label({text: "Frozen Row Number: "});
		var oColumnSlider = new sap.ui.commons.Slider({
			height: '500px',
			min: 0,
			max: 4,
			value: table.getFixedColumnCount(),
			totalUnits: 4,
			smallStepWidth: 1,
			stepLabels : true,
			change: function(){that._setColumnFreeze(table, this.getValue())}
		});	
		var oRowSlider = new sap.ui.commons.Slider({
			height: '500px',
			min: 0,
			max: 4,
			value: 0,
			totalUnits: 4,
			smallStepWidth: 1,
			stepLabels : true,
			change: function(){that._setRowFreeze(table, this.getValue())}
		});	
		var oLayout = new sap.ui.layout.VerticalLayout({
			width: "200px",
			content: [columnLabel, oColumnSlider]//, rowLabel, oRowSlider]
		});

		return oLayout; 	
	},

	_setColumnFreeze: function(table, value){
		var columns = table.getColumns();
		var fixedNumber = value;
		if(value > columns.length){
			return;
		}
		for(var i = 0; i < value; i++){
			if(!columns[i].getVisible()){
				fixedNumber += 1;
			}
		}
		if(fixedNumber > columns.length){
			return;
		}

		table.setFixedColumnCount(fixedNumber);
	}, 

	_setRowFreeze: function(table, value){
		table.setFixedRowCount(value);
	},

	_editSearchHelp: function(table, column, oEvent){
		var that = this;
		var oControl = oEvent.getSource();
		var selectIndex = oControl.sId.split("row")[1];
		var selectedRow = table.getRows()[selectIndex];
		/*var index = table.getContextByIndex(selectIndex);
		var selectedObject = index.getObject();	*/	
		var dropdownTableConfig = column.dropdowntable;
		
		if(dropdownTableConfig.relatedFields){
			var url = "";
			url += dropdownTableConfig.relatedUrl + "(";
			for(var i = 0; i < dropdownTableConfig.relatedFields.length; i++){
				// var reLatedValue = selectedObject[dropdownTableConfig.relatedFields[i].field];
				var cell = selectedRow.getCells()[dropdownTableConfig.relatedFields[i].fieldIndex];
				var reLatedValue = cell.getValue();
				url += dropdownTableConfig.relatedFields[i].key + "='" + reLatedValue +"',"
			}
			url = url.substring(0, url.length-1);
			url += ")/Results";
			//console.log(url);
			dropdownTableConfig.bindRowUrl = url;
		}
		
		var table =  lenovo.control.commontable.Table.createTable(dropdownTableConfig);
		var oModel = new sap.ui.model.odata.ODataModel(dropdownTableConfig.url, true);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function(){
			table.setBusy(false);
		});		
		if(dropdownTableConfig.filters.length > 2){
			dropdownTableConfig.filters = lenovo.control.commontable.Toolkit.splitChunck(2, dropdownTableConfig.filters);
		}
		
		var filterPanel =  lenovo.control.commontable.Table.createFilter(dropdownTableConfig, table);
		
		var dialog = new sap.ui.commons.Dialog({
			width: '800px',
			title: 'select',
			modal: true,
			content: [filterPanel, table],
			buttons: [new sap.ui.commons.Button({
				text: "save and return",
				press: function(){
					that._editSaveReturn(oControl, table, dropdownTableConfig, dialog);
				}
			})]
		});
		dialog.open();
		dialog.ondragstart = false;
	},

	_editSaveReturn: function(oControl, table, dropdownTableConfig, dialog){
		var selectedIndices = table.getSelectedIndices();
		var oModel = table.getModel();
		var selectedObject;
		for(var i = 0; i < selectedIndices.length; i++) {
			selectedObject = table.getContextByIndex(selectedIndices[i]).getObject();
			break;
		}

		if(selectedObject != undefined){
			oControl.setValue(selectedObject[dropdownTableConfig.field]);

			var outterRow = oControl.getParent();
			var outterTable = outterRow.getParent();
			var dFs = dropdownTableConfig.dependentFileds;

			if(dFs instanceof Array){
				var key, target, valueIndex;
				for(var j = 0, l = dFs.length; j < l; j++){
					key = dFs[j].field;
					var valueIndex = lenovo.control.commontable.Toolkit.getColumnIndexByField(dFs[j].target, outterTable);
			        if(valueIndex == -1)
			        	continue;
			        outterRow.getCells()[valueIndex].setValue(selectedObject[key]);
				}
			}
		}

		dialog.close();
	}
}
