sap.ui.core.Component.extend("lenovo.service.LCPE",{	
	init: function(){
		var oModelModule = sap.ui.getCore().getModel("module");
		this.sServiceUrl = oModelModule.getProperty("LCPE_SERVICE");
		this.module = oModelModule.getProperty("MODULE");
		this.schema = oModelModule.getProperty("LCPE");
	},

	getlcpe: function(){
		return this.sServiceUrl + "/lcpeUi.xsodata";
	},
	
	getlcpeUpload: function(){
		return this.sServiceUrl + "/upload";
	},
	 
	getlcpeLogic: function(){
		return this.sServiceUrl + "/logic";
	},

	getlcpeSchema: function(){
		return this.schema;
	}
});