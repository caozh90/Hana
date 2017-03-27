jQuery.sap.declare("lenovo.control.Controller");
sap.ui.core.mvc.Controller.extend("lenovo.control.Controller", {
	getEventBus: function() {
		 return sap.ui.getCore().getEventBus();
	},
	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
	// delete an item
	//export an item
});