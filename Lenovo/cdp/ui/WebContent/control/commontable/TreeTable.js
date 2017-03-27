jQuery.sap.require("lenovo.control.commontable.Toolkit");
jQuery.sap.declare("lenovo.control.commontable.TreeTable");
lenovo.control.commontable.TreeTable = {
	getDefaultTableConfig: function(oModel) {
		var oMeta = oModel.getServiceMetadata();
		var config = {
			columns: [],
			filters: [],
			filtersRaw: []			
		};
		for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
			var property = oMeta.dataServices.schema[0].entityType[0].property[i];
			config.columns.push({
				field: property.name,
				label: property.name,
				filterOperator: property.type == "Edm.DateTime" ? "EQ" : "Contains",
				type: property.type == "Edm.DateTime" ? "DatePicker" : "TextField"
			});
			config.filtersRaw.push({
				field: property.name,
				label: property.name,
				type: property.type == "Edm.DateTime" ? "DatePicker" : "TextField"
			});
		}
		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);
		config.visibleRowCount = config.visibleRowCount ? config.visibleRowCount: 10;
		config.title = "test";
		return config;
	},
	createTable: function(config) {
		var oColumn, oControl, column, table, filter;
		table = new sap.ui.table.TreeTable({
			navigationMode: sap.ui.table.NavigationMode.Paginator,
			//selectionMode: sap.ui.table.SelectionMode.Single,
			visibleRowCount: config.visibleRowCount,
			expandFirstLevel: true
			//visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto
		});
		for (var i = 0; i < config.columns.length; i++) {
			column = config.columns[i];
			oControl = this._createControl(column);
			oColumn = new sap.ui.table.Column({
				label: new sap.ui.commons.Label({
					text: column.label
				}),
				width: column.width? column.width: "auto",
				filterOperator: column.filterOperator,
				template: oControl,
				sortProperty: column.field,
				filterProperty: column.field,
				showFilterMenuEntry: false,
				editable: false
			});
			table.addColumn(oColumn);
		}
		table.bindRows(config.bindRowUrl);
		return table;
	},
	createFilter: function(config, table){
		if(config.filters && config.filters.length > 0) {
			var that = this;
			var filters = config.filters;
			var filterModel = new sap.ui.model.json.JSONModel();
			var oPanel = new sap.ui.commons.Panel({
				title: {
					text: "Filter"
				}
			});
			var oLayout = new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 4,
				labelSpanM: 4,
				emptySpanL: 1,
				columnsL: filters.length,
				olumnsM: filters.length
			});
			var oForm = new sap.ui.layout.form.Form({
				layout: oLayout,
				formContainers: []
			});
			var oFormContainer, oControl, formContainerConfig, obj = {};
			for(var i = 0, len = filters.length; i < len; i++) {
				oFormContainer = new sap.ui.layout.form.FormContainer();
				for(var j = 0; j < filters[i].length; j++) {
					var filter = filters[i][j];
					var filterOperator = lenovo.control.commontable.Toolkit.getColumnByField(filter.field, table).getFilterOperator();
					obj[filter.field] = {
						filterValue: null,
						filterOperator: filter.filterOperator || filterOperator
					}
					oControl = lenovo.control.commontable.Toolkit._createFilterControl(filter, filterModel);
					oFormContainer.addFormElement(oControl);
				}
				oForm.addFormContainer(oFormContainer);
			}
			filterModel.setData(obj);
			oForm.setModel(filterModel);
			oPanel.addContent(oForm);

			var searchButton =  new sap.ui.commons.Button({
				icon: "sap-icon://search",
				lite: true,
				press: function() {
					that._search(filterModel, table);
				}
			}).addStyleClass("commontable-toolbar-btn");
			oPanel.addButton(searchButton);
			//oToobar.addContent(searchButton);
			return oPanel;
		}
	},
	_search: function(filterModel, table) {
		var that = this;
		var filters = JSON.parse(filterModel.getJSON());
		var column;
		$.each(filters, function(key, value) {
			if(value.filterValue != null){
				column = lenovo.control.commontable.Toolkit.getColumnByField(key, table);
				column.setFilterValue(value.filterValue);
				column.setFilterOperator(value.filterOperator);
			}
			
		});
		if (column) {
			console.log(column.getFilterValue());
			table.filter(column, column.getFilterValue());
		}
	},
	
	_createControl: function(column) {
		var oControl;
		var type = column.type || 'TextView';
		var that = this;
		switch (type) {
			case "TextField":
				oControl = new sap.ui.commons.TextField().bindProperty("value", column.field);
				break;
			case "TextView":
				//oControl = new sap.ui.commons.TextView();
				oControl = new sap.ui.commons.TextView().bindProperty("text", column.field, function(value){
					if(value instanceof Date) {
						return lenovo.control.commontable.Toolkit.timeDateFormat.format(value, true);
					}
					return value;
				});
				break;
			case "DatePicker":
				oControl = new sap.ui.commons.DatePicker({
					value: {
						path:  column.field,
						type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
					}
				});
			break;
		}
		return oControl;
	}
}