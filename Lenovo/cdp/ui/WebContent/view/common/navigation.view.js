sap.ui.jsview("lenovo.view.common.navigation", {
	getControllerName : function() {
		return "lenovo.view.common.navigation";
	},
	createContent: function(oController){
/*		var oButton = new sap.ui.commons.Button("menu-hide", {
			icon: "sap-icon://navigation-left-arrow",
			press: oController.hideMenu
		});
		var oButton2 = new sap.ui.commons.Button("menu-show", {
			icon: "sap-icon://navigation-right-arrow",
			press: oController.showMenu
		});
		oButton2.addStyleClass("hiddenStyle");*/
		var oTree = new sap.ui.commons.Tree("navigation", {
			showHeader: false,
			showHeaderIcons: false
		});
		var viewHeight = document.documentElement.clientHeight || window.innerHeight;
		var treeHeight = (viewHeight - 48).toString()+"px";
		oTree.setHeight(treeHeight);
		return oTree;
	}
});