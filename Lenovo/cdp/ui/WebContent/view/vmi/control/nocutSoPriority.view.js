/*
develop by Alex Liu @ 2014/12/17
Tip:lack upload function;download filename hasn't be determined
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.control.nocutSoPriority", {
	getControllerName: function() {

	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		//var headerHeight = 250;
		var auth =  lenovo.control.commontable.Table.getViewAuth("nocutSoPriority");
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(1);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField"
		}, {
			field: "DELIVERY_PRIORITY",
			label: "Delivery Priority",
			type: "TextField"
		}];

		config.bindRowUrl = "/UI_NOCUT_SO_PRIORITY";//?$orderby=LOGICAL_PLANT,SYS_CREATED_DATE desc";
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
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID",
					defaultSelectAll: true
				}
			}
		},{
			field: "DELIVERY_PRIORITY",
			label: "Delivery Priority",
			type: "TextField",
			textfield: {
  				defaultFilterOp: "EQ"
  			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(3, config.filtersRaw);

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.mxebgvmi.models/AT_UI_NOCUT_SO_PRIORITY"';
		config.download.columns = ["LOGICAL_PLANT", "DELIVERY_PRIORITY"];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_NOCUT_SO_PRIORITY";
		config.insertRaw = [{
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "DropdownBox",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/CONF_SITEMASTER2?$format=json&$select=SITEID,MS",
					bindKeyField: "SITEID",
					bindTextField: "SITEID"
				}
			}
		}, {
			field: "DELIVERY_PRIORITY",
			label: "Delivery Priority",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//delete
		config.deleteable.url = "/UI_NOCUT_SO_PRIORITY";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_nocut_so_priority.xsjs",
			excelUrl: "vmi/control/nocut_so_priority.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_NOCUT_SO_PRIORITY'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_NOCUT_SO_PRIORITY_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					label: "Logical Plant",
					field: "LOGICAL_PLANT",
					type:  "TextField"
				},{
					label: "Delivery Priority",
					field: "DELIVERY_PRIORITY",
					type:  "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_nocut_so_priority.xsjs" 
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
		var header = lenovo.control.commontable.Table.createHeader("control", "nocut so priority");
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