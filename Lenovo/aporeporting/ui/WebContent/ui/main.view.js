sap.ui.jsview("ui.main", {
   
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.main
	*/ 
	getControllerName : function() {
		return "ui.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.main
	*/ 
	createContent : function(oController) {

		var oShell = new sap.ui.ux3.Shell('root-shell', {
			appTitle: 'Lenovo APO Reports',
			showTools: false,
			designType : sap.ui.ux3.ShellDesignType.Crystal,
			logout: oController.logout,
			headerItems : [new sap.ui.commons.Link({text:'Change Password',
											        href: '/sap/hana/xs/formLogin/profile/'})]

		});
		
		return oShell;
		
	}

});