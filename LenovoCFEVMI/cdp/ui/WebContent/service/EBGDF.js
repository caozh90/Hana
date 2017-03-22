sap.ui.core.Component.extend("lenovo.service.EBGDF",{	
	init: function(){
		var oModelModule = sap.ui.getCore().getModel("module");
		this.sServiceUrl = oModelModule.getProperty("EBGDF_SERVICE");
		this.module = oModelModule.getProperty("MODULE");
		this.schema = oModelModule.getProperty("SCHEMA");//EBGDF
	},
	getUserInfo: function(){
		return this.sServiceUrl + "/userInfo.xsodata";
	},
	getebgdfServiceUrl: function(){
		return this.sServiceUrl;
	},
	
	getebgdf: function(){
		return this.sServiceUrl + "/ebgdfUi.xsodata";
	},
	
	getebgdfUpload: function(){
		return this.sServiceUrl + "/upload";
	},
	 
	getebgdfLogic: function(){
		return this.sServiceUrl + "/logic";
	},

	getebgdfSchema: function(){
		return this.schema;
	}
});