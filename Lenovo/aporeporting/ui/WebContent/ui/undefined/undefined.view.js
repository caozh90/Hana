sap.ui.jsview("ui.undefined.undefined", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.undefined
	*/ 
	getControllerName : function() {
		return "ui.undefined.undefined";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.undefined
	*/ 
	createContent : function(oController) {
 		return new sap.ui.commons.TextView({
 			text: 'Coming soon!'
 		});
	}

});