sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller ,History) {
	"use strict";

	return Controller.extend("lenovo.mtm.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		//
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			//*注释掉之后，直接返回指定View，反之返回上一层
			//if (sPreviousHash !== undefined) {
			// The history contains a previous entry
			//history.go(-1);
			//} else {
			// Otherwise we go backwards with a forward history
			var bReplace = true;
			this.getRouter().navTo("master", {}, bReplace);
			//}
		},
		onNavBack_o : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			//*注释掉之后，直接返回指定View，反之返回上一层
			if (sPreviousHash !== undefined) {
			// The history contains a previous entry
			history.go(-1);
			} else {
			// Otherwise we go backwards with a forward history
			var bReplace = true;
			//this.getRouter().navTo("master", {}, bReplace);
			}
		},


	});

});