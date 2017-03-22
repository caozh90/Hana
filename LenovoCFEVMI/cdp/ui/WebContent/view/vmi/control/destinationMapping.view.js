/*
develop by Alex Liu @ 2014/12/17
Tip:lack upload function;download filename hasn't be determined
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.control.destinationMapping", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("destinationMapping");
		//var headerHeight = 250;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(0);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "DS_LINE",
			label: "DS Line",
			type: "TextField"
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "TextField"
		}, {
			field: "FLOOR",
			label: "Floor",
			type: "TextField"
		}];

		config.bindRowUrl = "/UI_LINE_FLOOR_MAPPING";
		config.defaultSort = [{
			field: "DS_LINE",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "DS_LINE",
			label: "DS Line",
			type: "TextField"
		}, {
			field: "FLOOR",
			label: "Floor",
			type: "MultiEQ",
			multieq: {
				defaultFilterOp: "GE"
			}
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER?$format=json&$select=PHYSICALPLANT",
					bindKeyField: "PHYSICALPLANT",
					bindTextField: "PHYSICALPLANT",
					defaultSelectAll: true
				}
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/AT_UI_LINE_FLOOR_MAPPING"';
		config.download.columns = ["DS_LINE", "PHYSICAL_PLANT", "FLOOR"];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_LINE_FLOOR_MAPPING";
		config.insertRaw = [{
			field: "DS_LINE",
			label: "DS Line",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "PHYSICAL_PLANT",
			label: "Physical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER?$format=json",
					bindKeyField: "PHYSICALPLANT",
					bindTextField: "PHYSICALPLANT"
				}
			}
		}, {
			field: "FLOOR",
			label: "Floor",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "FLOOR",
			label: "Floor",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		//delete
		config.deleteable.url = "/UI_LINE_FLOOR_MAPPING";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_line_floor_mapping.xsjs",
			excelUrl: "vmi/control/destination_mapping.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_LINE_FLOOR_MAPPING'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_LINE_FLOOR_MAPPING_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "DS Line",
					field: "DS_LINE",
					type:  "TextField"
				},{
					label: "Physical Plant",
					field: "PHYSICAL_PLANT",
					type:  "TextField"
				},{
					label: "Floor",
					field: "FLOOR",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_line_floor_mapping.xsjs" 
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
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmi();
		var uServiceUrl = service.getMXVmiUpload();
		var dSchema = service.getMXVmiSchema();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("control", "destination mapping");
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