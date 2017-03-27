/*
develop by Alex Liu @ 2014/12/17
Tip:lack upload function;download filename hasn't be determined
*/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.SZVMI");

sap.ui.jsview("lenovo.view.szvmi.control.mobomLocation", {
	getControllerName: function() {
 
	},

	setConfig: function(config,sServiceUrl,uServiceUrl,dSchema) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var auth =  lenovo.control.commontable.Table.getViewAuth("mobomLocation");
		//var headerHeight = 250;
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(0);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "ITEM",
			label: "Item",
			type: "TextField"
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			type: "TextField"
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "TextField"
		}, {
			field: "SYS_CREATED_BY",
			label: "Sys Created By",
			type: "TextField"
		}, {
			field: "SYS_CREATED_DATE",
			label: "Sys Created Date",
			type: "TextField"
		}, {
			field: "SYS_LAST_MODIFIED_BY",
			label: "Sys Last Modified By",
			type: "TextField"
		}, {
			field: "SYS_LAST_MODIFIED_DATE",
			label: "Sys Last Modified Date",
			type: "TextField"
		}];

		config.bindRowUrl = "/UI_MOBOM_LOCATION";
		config.defaultSort = [{
			field: "ITEM",
			bDescending: false
		}];

		config.filtersRaw = [{
			field: "ITEM",
			label: "Item",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/MOBOM_ITEM",
				field: "ITEM",
				columns: [{
					label: "Item",
					field: "ITEM",
					type: "TextField"
				}],
				filters: [
					[{
						label: "Item",
						field: "ITEM",
						type: "TextField"
					}]
				],
				visibleRowCount: 10
			}
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "DropdownTable",
			width: "150px",
			dropdowntable: {
				url: sServiceUrl,
				bindRowUrl: "/MOBOM_LOCATION",
				field: "STORAGE_LOCATION",
				columns: [{
					field: "STORAGE_LOCATION",
					label: "Storage Location",
					type: "TextField"
				}],
				filters: [
					[{
						field: "STORAGE_LOCATION",
						label: "Storage Location",
						type: "TextField"
					}]
				],
				visibleRowCount: 10
			}
		}];

		config.filters = lenovo.control.commontable.Toolkit.splitChunck(2, config.filtersRaw);

		//download
		config.download.filename = "data_export";
		config.download.table = '"_SYS_BIC"."cdp.szebgvmi.models.mobomLocation/AT_MOBOM_LOCATION"';
		config.download.columns = ["ITEM","LOGICAL_PLANT","STORAGE_LOCATION","SYS_CREATED_BY","SYS_CREATED_DATE","SYS_LAST_MODIFIED_BY","SYS_LAST_MODIFIED_DATE"];
		config.download.roleName = auth.exportableRoleName;
		//create
		config.create.url = "/UI_MOBOM_LOCATION";
		config.insertRaw = [{
			field: "ITEM",
			label: "Item",
			type: "TextField",
			required: true
		}, {
			field: "LOGICAL_PLANT",
			label: "Logical Plant",
			required: true,
			type: "TextField"
		}, {
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			required: true,
			type: "TextField"
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "STORAGE_LOCATION",
			label: "Storage Location",
			type: "TextField"
		}];
		//delete
		config.deleteable.url = "/UI_MOBOM_LOCATION";
		//upload
		config.upload = {
			visible: true,
			url: uServiceUrl + "/ui_mobom_location.xsjs",
			excelUrl: "szvmi/control/mobom_location.xlsx"
		};
		config.upload.roleName =  auth.uploadableRoleName;
		config.viewstatus = {
			visible: true,
			viewUploadHistory: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_BUSINESS_INFO?$filter=TABLE_NAME eq 'UI_MOBOM_LOCATION'",
				selectionMode: sap.ui.table.SelectionMode.Single,
				visibleRowCount: 10
			},
			viewErrorInfo: {
				url: uServiceUrl + "/upload.xsodata",
				bindRowUrl: "/UPLOAD_ERR_INFO",
				visibleRowCount: 10
			},
			viewUploadErrorDetail: {
				url: uServiceUrl + "/upload.xsodata/UI_MOBOM_LOCATION_ERR_DETAIL?$format=json",
				//addSingleQuotes: true,
				columns: [[{
					field: "ITEM",
					label: "Item",
					type: "TextField"
				}, {
					field: "LOGICAL_PLANT",
					label: "Logical Plant",
					type: "TextField"
				}, {
					field: "STORAGE_LOCATION",
					label: "Storage Location",
					type: "TextField"
				}]],
				resubmit: {
					url: uServiceUrl + "/ui_mobom_location.xsjs" 
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
		this.setConfig(config,sServiceUrl,uServiceUrl,dSchema);
		var header = lenovo.control.commontable.Table.createHeader("control", "MOBOM Location Modify");
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