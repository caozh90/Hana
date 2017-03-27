sap.ui.core.Component.extend("lenovo.service.SZVMI",{	
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
		return this.sServiceUrl + "/szEbgVmiUi.xsodata";
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
		return "/cdp/dssz/services/tableview.xsodata";
	},
	getMXVmiDSGeneral: function(){
		return "/cdp/dssz/services/invoke_ds.xsjs";
	},
	getMXVmiReport: function(){
		return this.sServiceUrl + "/pmreport.xsodata";
	}
});