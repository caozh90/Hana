/*
	develop by Coral Zhang @ 2014/12/18
	update by alex liu @2014/12/26
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.manage.createCycleTime", {
	setConfig: function(config,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var auth =  lenovo.control.commontable.Table.getViewAuth("createCycleTime");
		//var headerHeight = 400;
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);
		config.columns = [{
			field: "TPL_ID",
			label: "3PL ID",
			type: "TextField",
			width: "100px"
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "TextField",
			width: "120px"
		},{
			field: "EVENT_TYPE",
			label: "Event Type",
			type: "TextField",
			width: "200px"
		},{
			field: "CYCLE_TIME",
			label: "Cycle Time Minutes",
			type: "TextField",
			width: "200px"
		},{
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified by",
			type: "TextField",
			width: "150px"
		},{
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Time",
			type: "TextField",
			width: "150px"
		}];

		config.bindRowUrl = "/UI_CREATE_CYCLETIME";
		config.defaultSort = [{
			field: "TPL_ID",
			bDescending: false
		}, {
			field: "PULL_TYPE",
			bDescending: false
		}];
		config.filtersRaw = [{
			field: "TPL_ID",
			label: "3PL Id",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_MATERIAL_MAP?$format=json",
					bindKeyField: "PULL_TYPE",
					bindTextField: "PULL_TYPE",
					defaultSelectAll: true
				}
			}
		},{
			field: "EVENT_TYPE",
			label: "Event Type",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='EVENT_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "CYCLE_TIME",
			label: "Cycle Time Minutes",
			type: "TextField"
		},{
			field: "SYS_LAST_MODIFIED_BY",
			label: "Last Modified by",
			type: "TextField"
		},{
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Last Modified Time",
			type: "MultiDatePicker",
			multidatepicker: {
				defaultFilterOp: "EQ"
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//create
		config.create.url = "/UI_CREATE_CYCLETIME";
		config.insertRaw = [{
			field: "TPL_ID",
			label: "3PL ID",
			required: true,
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='TPL_ID')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "PULL_TYPE",
			label: "Pull Type",
			required: true,
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_MATERIAL_MAP?$format=json",
					bindKeyField: "PULL_TYPE",
					bindTextField: "PULL_TYPE",
					defaultSelectAll: true
				}
			}
		},{
			field: "EVENT_TYPE",
			label: "Event Type",
			required: true,
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/InputParams(P_PTYPE='EVENT_TYPE')/Results?$format=json",
					bindKeyField: "PVALUE",
					bindTextField: "PVALUE",
					defaultSelectAll: true
				}
			}
		},{
			field: "CYCLE_TIME",
			label: "Cycle Time Minutes",
			type: "TextField",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Cycle Time Minutes should be integer!"
			}]
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(1, config.insertRaw);

		//edit
		config.editRaw = [{
			field: "CYCLE_TIME",
			label: "Cycle Time Minutes",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Cycle Time Minutes should be integer!"
			}]
		}];
		//delete
		config.deleteable.url = "/UI_CREATE_CYCLETIME";

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_UI_CREATE_CYCLETIME"';
		config.download.columns = ["TPL_ID","PULL_TYPE","EVENT_TYPE","CYCLE_TIME","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.roleName = auth.exportableRoleName;
		//auth
		config.create.visible=false;
		config.edit.visible=false;
		config.deleteable.visible=false;
		config.upload.visible=false;
		config.download.visible = false;
		
		for (i in auth) {
			switch(i) {
				case "exportable":
					config.download.visible = auth[i];
					break;
				case "createable":
					config.create.visible = auth[i];
					break;
				case "deleteable":
					config.deleteable.visible = auth[i];
					break;
				case "editable":
					config.edit.visible = auth[i];
					break;
				case "uploadable":
					config.upload.visible = auth[i];
					break;
			}
		}
	},

	createContent: function(oController) {
		var service = new lenovo.service.SZVMI;
		
		var sServiceUrl = service.getMXVmi();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl);

		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});
		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		this.table = table;
		this.oModel = oModel;
		this.config = config;
		this.oForm = filterPanel.getContent()[0];
		sap.ui.getCore().getEventBus().subscribe("TreeNavigation", "Ready", this.onTreeNavigation, this);

		
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		var header = lenovo.control.commontable.Table.createHeader("Manage", "Create Cycle Time");

		return [header, filterPanel, oInsertUpload, table];
	},

	onTreeNavigation: function(sChannel, sEvent, oData){
		if(oData.view === "Create Cycle Time") {
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