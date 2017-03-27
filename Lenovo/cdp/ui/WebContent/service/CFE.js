sap.ui.core.Component.extend("lenovo.service.CFE",{	
	init: function(){
		var oModelModule = sap.ui.getCore().getModel("module");
		this.sServiceUrl = oModelModule.getProperty("CFE_SERVICE");
		this.module = oModelModule.getProperty("MODULE");
		this.schema = oModelModule.getProperty("EBGCFE");
	},

	getEBGCfe: function(){
		return this.sServiceUrl + "/odata/ebgCfeUi.xsodata";
	},
	
	getEBGCfeUpload: function(){
		return this.sServiceUrl + "/upload";
	},
	 
	getEBGCfeLogic: function(){
		return this.sServiceUrl + "/logic";
	},

	getEBGCfeSchema: function(){
		return this.schema;
	}
});