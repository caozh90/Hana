sap.ui.core.Component.extend("lenovo.service.VMI",{	
	init: function(){
		var oModelModule = sap.ui.getCore().getModel("module");
		this.sServiceUrl = oModelModule.getProperty("VMI_SERVICE");
		this.module = oModelModule.getProperty("MODULE");
		this.schema = oModelModule.getProperty("SCHEMA");
	},

	getUserInfo: function(){
		return this.sServiceUrl + "/userInfo.xsodata";
	},

	getMXVmi: function(){
		return this.sServiceUrl + "/mxEbgVmiUi.xsodata";
	},

	getMXVmiUpload: function(){
		return this.sServiceUrl + "/upload";
	},

	getMXVmiInvoke: function(){
		return this.sServiceUrl + "/invoke";
	},
	getMXVmiSchema: function(){
		return this.schema;
	},
	getMXVmiDS: function(){
		return "/cdp/ds/services/tableview.xsodata";
	},
	getMXVmiDSGeneral: function(){
		return "/cdp/ds/services/invoke_ds.xsjs";
	},
	getMXVmiReport: function(){
		return this.sServiceUrl + "/pmreport.xsodata";
	}
});