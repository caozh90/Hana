/*
develop by Alex Liu @ 2014/12/17
Tip:lack upload function;download filename hasn't be determined
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.optionDestinationMapping", {
	getControllerName: function() {

	},

	setConfig: function(config, sServiceUrl, uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("optionDestinationMapping");
		//var headerHeight = 300;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(3);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField"
		}, {
			field: "WAREHOUSE_OWNER",
			label: "Warehouse Owner",
			type: "TextField"
		}, {
			field: "SOURCE_LOCATION",
			label: "Source Location",
			type: "TextField"
		}, {
			field: "SOURCE_TYPE",
			label: "Source Type",
			type: "TextField"
		}, {
			field: "SOURCE_BIN",
			label: "Source Bin",
			type: "TextField"
		}, {
			field: "DESTINATION_LOCATION",
			label: "Destination Location",
			type: "TextField"
		}, {
			field: "DESTINATION_TYPE",
			label: "Destination Type",
			type: "TextField"
		}, {
			field: "DESTINATION_BIN",
			label: "Destination Bin",
			type: "TextField"
		}];

		config.bindRowUrl = "/UI_OPTION_DEST_MAPPING";//?$orderby=LOGICAL_PLANT,SYS_CREATED_DATE desc";
		config.defaultSort = [{
			field: "SYS_CREATED_DATE",
			bDescending: true
		},{
			field: "LOGICAL_PLANT",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$select=SITEID,MS&$format=json",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		}, {
			field: "SOURCE_LOCATION",
			label: "Source Location",
			type: "TextField"
			// type: "DropdownBox",
			// dropdownbox: {
			// 	odata: {
			// 		url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=STORAGE_LOCATION&$format=json",
			// 		bindKeyField: "STORAGE_LOCATION",
			// 		bindTextField: "STORAGE_LOCATION",
			// 		defaultSelectAll: true
			// 	}
			// }
		}, {
			field: "SOURCE_BIN",
			label: "Source Bin",
			type: "TextField"
			// type: "DropdownBox",
			// dropdownbox: {
			// 	odata: {
			// 		url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=STORAGE_BIN&$format=json",
			// 		bindKeyField: "STORAGE_BIN",
			// 		bindTextField: "STORAGE_BIN",
			// 		defaultSelectAll: true
			// 	}
			// }
		}, {
			field: "DESTINATION_TYPE",
			label: "Destination Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield:{
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "WAREHOUSE_OWNER",
			label: "Warehouse Owner",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			//type: "DropdownBox",
			//dropdownbox: {
				// odata: {
				// 	url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=TPL_ID&$format=json",
				// 	bindKeyField: "TPL_ID",
				// 	bindTextField: "TPL_ID",
				// 	defaultSelectAll: true
				// },
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "SOURCE_TYPE",
			label: "Source Type",
			//type: "DropdownBox",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			// dropdownbox: {
			// 	odata: {
			// 		url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=STORAGE_TYPE&$format=json",
			// 		bindKeyField: "STORAGE_TYPE",
			// 		bindTextField: "STORAGE_TYPE",
			// 		defaultSelectAll: true
			// 	},
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "DESTINATION_LOCATION",
			label: "Destination Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield:{
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "DESTINATION_BIN",
			label: "Destination Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			textfield:{
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models/AT_OPTION_DEST_MAPPING"';
		config.download.columns = ["LOGICAL_PLANT", "WAREHOUSE_OWNER", "SOURCE_LOCATION", "SOURCE_TYPE", "SOURCE_BIN", "DESTINATION_LOCATION", "DESTINATION_TYPE", "DESTINATION_BIN"];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_OPTION_DEST_MAPPING";
		config.insertRaw = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownBox",
			required: true,
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$select=SITEID,MS&$format=json",
					bindKeyField: "SITEID",
					bindTextField: "SITEID"
				}
			}
		}, {
			field: "WAREHOUSE_OWNER",
			label: "Warehouse Owner",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			//type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Warehouse Owner is required!"
			}],
			//dropdownbox: {
			type: "TextField",
			textfield:{
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
				// odata: {
				// 	url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=TPL_ID&$format=json",
				// 	bindKeyField: "TPL_ID",
				// 	bindTextField: "TPL_ID",
				// 	defaultSelectAll: true
				// }
			}
		}, {
			field: "SOURCE_LOCATION",
			label: "Source Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			//type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Source Location is required!"
			}],
			type: "TextField",
			textfield:{
			//dropdownbox: {
								layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
				// odata: {
				// 	url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=STORAGE_LOCATION&$format=json",
				// 	bindKeyField: "STORAGE_LOCATION",
				// 	bindTextField: "STORAGE_LOCATION",
				// 	defaultSelectAll: true
				// }
			}
		}, {
			field: "SOURCE_TYPE",
			label: "Source Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			//type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Source Type is required!"
			}],
			type: "TextField",
			textfield:{
			//dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
				// odata: {
				// 	url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=STORAGE_TYPE&$format=json",
				// 	bindKeyField: "STORAGE_TYPE",
				// 	bindTextField: "STORAGE_TYPE",
				// 	defaultSelectAll: true
				// }
			}
		}, {
			field: "SOURCE_BIN",
			label: "Source Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			//type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Source Bin is required!"
			}],
			type: "TextField",
			textfield:{
			//dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
				// odata: {
				// 	url: sServiceUrl + "/CONF_WAHREHOUSE_INFO?$select=STORAGE_BIN&$format=json",
				// 	bindKeyField: "STORAGE_BIN",
				// 	bindTextField: "STORAGE_BIN",
				// 	defaultSelectAll: true
				// }
			}
		}, {
			field: "DESTINATION_LOCATION",
			label: "Destination Location",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Destination Location is required!"
			}],
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "DESTINATION_TYPE",
			label: "Destination Type",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Destination Type is required!"
			}],
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "DESTINATION_BIN",
			label: "Destination Bin",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Destination Bin is required!"
			}],
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "DESTINATION_TYPE",
			label: "Destination Type",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "DESTINATION_BIN",
			label: "Destination Bin",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		//delete
		config.deleteable.url = "/UI_OPTION_DEST_MAPPING";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_option_dest_mapping.xsjs",
			excelUrl: "szvmi/control/option_destination_mapping.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_OPTION_DEST_MAPPING'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_OPTION_DEST_MAPPING_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "Logical Plant",
					field: "LOGICAL_PLANT",
					type:  "TextField"
				},{
					label: "Warehouse Owner",
					field: "WAREHOUSE_OWNER",
					type:  "TextField"
				},{
					label: "Source Location",
					field: "SOURCE_LOCATION",
					type:  "TextField"
				},{
					label: "Source Type",
					field: "SOURCE_TYPE",
					type:  "TextField"
				},{
					label: "Source Bin",
					field: "SOURCE_BIN",
					type:  "TextField"
				},{
					label: "Destination Location",
					field: "DESTINATION_LOCATION",
					type:  "TextField"
				},{
					label: "Destination Type",
					field: "DESTINATION_TYPE",
					type:  "TextField"
				},{
					label: "Destination Bin",
					field: "DESTINATION_BIN",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_option_dest_mapping.xsjs" 
				}
			}
		}
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
		var app = new sap.m.App();
		var service = new lenovo.service.SZVMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config, sServiceUrl, uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("control", "option destination mapping");
		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var filterPanel = lenovo.control.commontable.Table.createFilter(config, table);

		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table, app);

		var page = new sap.m.Page({
			showHeader: false,
			content: [header, filterPanel, oInsertUpload, table]
		});
		app.insertPage(page);
		app.setInitialPage(page);
		return app;
	}
});