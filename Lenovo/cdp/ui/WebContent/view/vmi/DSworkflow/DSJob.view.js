/********************************
*develop by Alex Liu @ 2015/1/13
* Modified by Chris Gao @2015-09-10
*********************************/
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.control.Validation");
jQuery.sap.require("lenovo.service.VMI");

sap.ui.jsview("lenovo.view.vmi.DSworkflow.DSJob", {
	getControllerName: function() {

	},

	setConfig: function(config,config1,sServiceUrl) {

		config.visibleRowCount = 3;

		config.columns = [{
			field: "HOST",
			label: "Host",
			type: "TextField",
			width: "100px"
		}, {
			field: "WEBSERVER_PORT",
			label: "Webserver Port",
			type: "TextField",
			width: "150px"
		}, {
			field: "URL_PATH_POSTFIX",
			label: "URL Path Postfix",
			type: "TextField",
			width: "200px"
		}, {
			field: "CMS_PORT",
			label: "CMS Port",
			type: "TextField",
			width: "100px"
		}, {
			field: "USER_NAME",
			label: "User Name",
			type: "TextField",
			width: "100px"
		}, {
			field: "PASSWORD",
			label: "Password",
			type: "PasswordField",
			width: "100px"
		}, {
			field: "CMS_AUTHENTICATION",
			label: "CMS Authentication",
			type: "DropdownBox",
			width: "180px",
			dropdownbox: {
				data:[{
					text: "secEnterprise",
					key: "secEnterprise"
				},{
					text: "secLDAP",
					key: "secLDAP"
				},{
					text: "secWinAD",
					key: "secWinAD"
				},{
					text: "secSAPR3",
					key: "secSAPR3"
				}]
			}
		}, {
			field: "REPONAME",
			label: "Reponame",
			type: "TextField",
			width: "100px"
		}, {
			field: "JOBSERVER",
			label: "Jobserver",
			type: "TextField",
			width: "100px"
		}, {
			field: "SERVERGROUP",
			label: "Servergroup",
			type: "TextField",
			width: "100px"
		}];

		config.bindRowUrl = "/HANA_DS_CON_INFO";

		//create
		config.create.url = "/HANA_DS_CON_INFO";
		config.insertRaw = [{
			field: "HOST",
			label: "Host",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "WEBSERVER_PORT",
			label: "Webserver Port",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "URL_PATH_POSTFIX",
			label: "URL Path Postfix",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "CMS_PORT",
			label: "CMS Port",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "USER_NAME",
			label: "User Name",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "PASSWORD",
			label: "Password",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "PasswordField",
			required: true,
			width: "100px",
			passwordfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				/*validType: lenovo.control.Validation.isPassword,
				errMsg: "Password format is wrong!"*/
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "CMS_AUTHENTICATION",
			label: "CMS Authentication",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "DropdownBox",
			required: true,
			width: "200px",
			dropdownbox: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				}),
				data: [{
					text: "secEnterprise",
					key: "secEnterprise"
				},{
					text: "secLDAP",
					key: "secLDAP"
				},{
					text: "secWinAD",
					key: "secWinAD"
				},{
					text: "secSAPR3",
					key: "secSAPR3"
				}]
			},
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "REPONAME",
			label: "Reponame",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			width: "100px",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "JOBSERVER",
			label: "Jobserver",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			width: "100px",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "SERVERGROUP",
			label: "Servergroup",
			labelLayout: new sap.ui.layout.GridData({
				span: "L5 M5 S5",
				linebreak: true
			}),
			type: "TextField",
			required: true,
			width: "100px",
			textfield: {
				layout: new sap.ui.layout.GridData({
					span: "L7 M7 S7"
				})
			},
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		config.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config.insertRaw);
		//edit
		config.editRaw = [{
			field: "CMS_PORT",
			label: "CMS Port",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "USER_NAME",
			label: "User Name",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "PASSWORD",
			label: "Password",
			type: "PasswordField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.isPassword,
				errMsg: "Password format is wrong!"
			}]
		}, {
			field: "CMS_AUTHENTICATION",
			label: "CMS Authentication",
			type: "DropdownBox",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "JOBSERVER",
			label: "Jobserver",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "SERVERGROUP",
			label: "Servergroup",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}];
		//delete
		config.deleteable.url = "/HANA_DS_CON_INFO";
		//upload
		config.upload.visible = false;

		//new table
		var windowHeight = lenovo.control.commontable.Toolkit.getWindowHeight();
		var headerHeight = lenovo.control.commontable.Toolkit.getDefaultHeaderHeight(6);
		var rowHeight = 30;
		config1.visibleRowCount = lenovo.control.commontable.Toolkit.getDefaultVisibleRowCount(rowHeight, windowHeight - headerHeight);

		config1.columns = [{
			field: "PROCESS_NAME",
			label: "Process Name",
			type: "TextField",
			width: "100px"
		}, {
			field: "JOB_NAME",
			label: "Job Name",
			type: "TextField",
			width: "150px"
		}, {
			field: "G_JOB_INIT_FLAG",
			label: "Job Init Flag",
			type: "TextField",
			width: "100px"
		}, {
			field: "G_DEBUG",
			label: "Debug",
			type: "TextField",
			width: "100px"
		}, {
			field: "G_STARTFROMSTEP",
			label: "Start from step",
			type: "TextField",
			width: "150px"
		}, {
			field: "G_IVID",
			label: "Ivid",
			type: "TextField",
			width: "100px"
		}, {
			field: "G_WFNAME",
			label: "Wfname",
			type: "TextField",
			width: "100px"
		}, {
			field: "WAITING_TIME",
			label: "Waiting Time",
			type: "TextField",
			width: "150px"
		}];

		config1.bindRowUrl = "/HANA_DS_JOB_INFO?$filter=TARGET eq '" + localStorage.MODULE_NAME + "'";

		//create
		config1.create.url = "/HANA_DS_JOB_INFO";
		config1.insertRaw = [{
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
			field: "JOB_NAME",
			label: "Job Name",
			required: true,
			type: "DropdownBox",
			width: "100px",
			dropdownbox: {
				odata: {
					url: sServiceUrl + "/DS_JOB_INFO?$format=json&$filter=TARGET eq '" + localStorage.MODULE_NAME + "'",
					bindKeyField: "JOBNAME",
					bindTextField: "JOBNAME",
					defaultSelectAll: true
				}
			}
		}, {
			field: "G_JOB_INIT_FLAG",
			label: "Job Init Flag",
			type: "TextField",
			required: true,
			width: "150px",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "G_DEBUG",
			label: "Debug",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "G_STARTFROMSTEP",
			label: "Start from step",
			type: "TextField",
			required: true,
			width: "150px",
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "G_IVID",
			label: "Ivid",
			type: "TextField",
			required: true,
			width: "100px"
			// validation: [{
			// 	validType: lenovo.control.Validation.isInteger,
			// 	errMsg: "Input content must be integer!"
			// }]
		}, {
			field: "G_WFNAME",
			label: "Wfname",
			type: "TextField",
			required: true,
			width: "100px",
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "WAITING_TIME",
			label: "Waiting Time",
			type: "TextField",
			required: true,
			width: "150px",
			validation: [{
				validType: lenovo.control.Validation.isNumber,
				errMsg: "Input content must be integer!"
			}]
		}];

		config1.create.columns = lenovo.control.commontable.Toolkit.splitChunck(2, config1.insertRaw);
		config1.create.fakeData = {
			TARGET : localStorage.MODULE_NAME
		};
		//edit
		config1.editRaw = [{
			field: "G_DEBUG",
			label: "Debug",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.isInteger,
				errMsg: "Input content must be integer!"
			}]
		}, {
			field: "G_IVID",
			label: "Ivid",
			type: "TextField",
			required: true
			// validation: [{
			// 	validType: lenovo.control.Validation.isInteger,
			// 	errMsg: "Input content must be integer!"
			// }]
		}, {
			field: "G_WFNAME",
			label: "Wfname",
			type: "TextField",
			required: true,
			validation: [{
				validType: lenovo.control.Validation.require,
				errMsg: "Required!"
			}]
		}, {
			field: "WAITING_TIME",
			label: "Waiting Time",
			type: "TextField",
			required: true,
			width: "150px",
			validation: [{
				validType: lenovo.control.Validation.isNumber,
				errMsg: "Input content must be integer!"
			}]
		}];
		//delete
		config1.deleteable.url = "/HANA_DS_JOB_INFO";
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

		var header = lenovo.control.commontable.Table.createHeader("DS Management", "DS configuration");

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
			
		var oInsertUpload = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config, table);
		oInsertUpload.addContent((new sap.ui.commons.TextView({text:"DS Configuration Info"})).addStyleClass("dstitle"));
		oInsertUpload.addStyleClass("dsposition");
		var oInsertUpload1 = lenovo.control.commontable.Table.createInsertEditDeleteUploadDownload(config1, table1);
		oInsertUpload1.addContent((new sap.ui.commons.TextView({text:"DS Job Info"})).addStyleClass("dstitle"));
		oInsertUpload1.addStyleClass("dsposition");
          
		return [header, oInsertUpload, table, oInsertUpload1, table1];
	}

});
