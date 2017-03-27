/*********************************
*develop by Alex Liu @ 2015/1/7
* Modified by Chris Gao @2015-09-10
*********************************/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.DSworkflow.configuration", {
	getControllerName: function() {

	},

	setConfig: function(config,config1,sServiceUrl) {
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var rowHeight = 30;
		config.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config.columns = [{
			field: "PROCESS_NAME",
			label: "Process Name",
			type: "TextField",
			width: "100px"
		}, {
			field: "PROCESS_RID",
			label: "Process RID",
			type: "TextField",
			width: "100px"
		}, {
			field: "XML_LOCALPATH",
			label: "Local Path",
			type: "TextField",
			width: "100px"
		}, {
			field: "XML_FTPPATH",
			label: "FTP Path",
			type: "TextField",
			width: "100px"
		}, {
			field: "XML_FTPARCHIVEPATH",
			label: "FTP Archived Path",
			type: "TextField",
			width: "150px"
		}, {
			field: "XML_FTPERRARCHIVEPATH",
			label: "FTP Error Archived Path",
			type: "TextField",
			width: "200px"
		}, {
			field: "XML_FN_WITHWILDCARD",
			label: "FN with Wild Card",
			type: "TextField",
			width: "200px"
		}];

		config.bindRowUrl = "/DS_FTP_CONF?$filter=TARGET eq '" + localStorage.MODULE_NAME + "'";

		//create
		config.create.url = "/DS_FTP_CONF";
		config.insertRaw = [{
			field: "PROCESS_NAME",
			label: "Process Name",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "PROCESS_RID",
			label: "Process RID",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_LOCALPATH",
			label: "Local Path",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_FTPPATH",
			label: "FTP Path",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_FTPARCHIVEPATH",
			label: "FTP Archived Path",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			width: "150px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "XML_FTPERRARCHIVEPATH",
			label: "FTP Error Archived Path",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			width: "200px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}],
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			}
		}, {
			field: "XML_FN_WITHWILDCARD",
			label: "FN with Wild Card",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			width: "200px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
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
			field: "XML_LOCALPATH",
			label: "Local Path",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_FTPPATH",
			label: "FTP Path",
			required: true,
			type: "TextField",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_FTPARCHIVEPATH",
			label: "FTP Archived Path",
			required: true,
			type: "TextField",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_FTPERRARCHIVEPATH",
			label: "FTP Error Archived Path",
			required: true,
			type: "TextField",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "XML_FN_WITHWILDCARD",
			label: "FN with Wild Card",
			required: true,
			type: "TextField",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		//delete
		config.deleteable.url = "/DS_FTP_CONF";
		//upload
		config.upload.visible = false;

		//new table
		config1.visibleRowCount = 3;

		config1.columns = [{
			field: "FTP_SERVER",
			label: "Server",
			type: "TextField",
			width: "150px"
		}, {
			field: "FTP_USER",
			label: "User",
			type: "TextField",
			width: "200px"
		}, {
			field: "FTP_PASSWORD",
			label: "Password",
			type: "PasswordField",
			width: "100px"
		}];
		if(localStorage.MODULE_NAME == "MXEBGVMI"){
			var oTemp = {
				field: "FTP_TYPE",
				label: "Module",
				type: "DropdownBox",
				width: "100px",
				dropdownbox: {
					data:[{
						text: "MXEBGVMI",
						key: "MXEBGVMI"
					}]
				}
			};
			config1.columns.push(oTemp);
			config1.bindRowUrl = "/DS_FTP_INFO?$filter=FTP_TYPE eq 'MXEBGVMI'";
		}
		else if(localStorage.MODULE_NAME == "PCDW"){
			var oTemp = {
				field: "FTP_TYPE",
				label: "Module",
				type: "DropdownBox",
				width: "100px",
				dropdownbox: {
					data:[{
						text: "PCDW_IPC",
						key: "PCDW_IPC"
					},{
						text: "PCDW_ECC",
						key: "PCDW_ECC"
					}]
				}
			};
			config1.columns.push(oTemp);
			config1.bindRowUrl = "/DS_FTP_INFO?$filter=substring(FTP_TYPE,0,4) eq 'PCDW'";
		}
		else {
			var oTemp = {
				field: "FTP_TYPE",
				label: "Module",
				type: "DropdownBox",
				width: "100px",
				dropdownbox: {
					data:[{
						text: "EBGCFE_IPC",
						key: "EBGCFE_IPC"
					},{
						text: "EBGCFE_ECC",
						key: "EBGCFE_ECC"
					}]
				}
			};
			config1.columns.push(oTemp);
			config1.bindRowUrl = "/DS_FTP_INFO?$filter=substring(FTP_TYPE,0,6) eq 'EBGCFE'";
		}

		// config1.bindRowUrl = "/DS_FTP_INFO?$filter=FTP_TYPE eq '" + localStorage.MODULE_NAME + "'";

		//create
		config1.create.url = "/DS_FTP_INFO";
		config1.insertRaw = [{
			field: "FTP_SERVER",
			label: "Server",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "FTP_USER",
			label: "User",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "FTP_PASSWORD",
			label: "Password",
			type: "PasswordField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];

		if(localStorage.MODULE_NAME == "MXEBGVMI"){
			var oTemp = {
				field: "FTP_TYPE",
				label: "Module",
				type: "DropdownBox",
				width: "100px",
				required: true,
				dropdownbox: {
					data:[{
						text: "MXEBGVMI",
						key: "MXEBGVMI"
					}]
				}
			};
			config1.insertRaw.push(oTemp);
		}
		else if(localStorage.MODULE_NAME == "PCDW"){
			var oTemp = {
				field: "FTP_TYPE",
				label: "Module",
				type: "DropdownBox",
				width: "100px",
				required: true,
				dropdownbox: {
					data:[{
						text: "PCDW_IPC",
						key: "PCDW_IPC"
					},{
						text: "PCDW_ECC",
						key: "PCDW_ECC"
					}]
				}
			};
			config1.insertRaw.push(oTemp);
		}
		else {
			var oTemp = {
				field: "FTP_TYPE",
				label: "Module",
				type: "DropdownBox",
				width: "100px",
				required: true,
				dropdownbox: {
					data:[{
						text: "EBGCFE_IPC",
						key: "EBGCFE_IPC"
					},{
						text: "EBGCFE_ECC",
						key: "EBGCFE_ECC"
					}]
				}
			};
			config1.insertRaw.push(oTemp);
		}

		config1.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config1.insertRaw);
		config1.create.fakeData = {
			ID : "1"
		};
		//edit
		config1.editRaw = [{
			field: "FTP_SERVER",
			label: "Server",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "FTP_USER",
			label: "User",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "FTP_PASSWORD",
			label: "Password",
			type: "PasswordField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		},{
			field: "FTP_TYPE",
			label: "Module",
			type: "DropdownBox",
			required: true
		}];
		//delete
		config1.deleteable.url = "/DS_FTP_INFO";
		//upload
		config1.upload.visible = false;
	},

	createContent: function(oController) {

		var that = this;
		var service = new lenovo.service.VMI;
		var sServiceUrl = service.getMXVmiDS();
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		
		/*********************************************************
		 * Added by Chris Gao - 2015-09-10
		 * to close the default count url called by table model
		 * default count model = "Both"
		 * because of the wrong count url with filter 
		 *******************************************************/
		oModel.setDefaultCountMode("None");
		/********************************************************
		 * End by Chris Gao
		 *******************************************************/

		var config = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		var config1 = lenovo.control.commontable.Table.getDefaultTableConfig(oModel);
		this.setConfig(config,config1,sServiceUrl);

		var header = lenovo.control.commontable.Table.createHeader("DS Management", "FTP configuration");

		var table = lenovo.control.commontable.Table.createTable(config);
		table.setBusy(true);
		table.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table.setBusy(false);
		});

		var table1 = lenovo.control.commontable.Table.createTable(config1);
		table1.setBusy(true);
		table1.setModel(oModel);
		oModel.attachRequestCompleted(function() {
			table1.setBusy(false);
		});

		var oInsertUpload1 = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config1, table1);
		oInsertUpload1.addContent((new sap.ui.commons.TextView({text:"DS FTP Info"})).addStyleClass("dstitle"));
		oInsertUpload1.addStyleClass("dsposition");
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		oInsertUpload.addContent((new sap.ui.commons.TextView({text:"DS FTP Configuration"})).addStyleClass("dstitle"));
		oInsertUpload.addStyleClass("dsposition");
          
		return [header, oInsertUpload1, table1, oInsertUpload, table];

	}

});
