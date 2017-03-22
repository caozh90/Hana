sap.ui.controller("lenovo.view.common.app", {
	onInit: function(){
		
	},

	onOpenDialog: function(){
		var _this = this;
		var layout = new sap.ui.layout.VerticalLayout();		
		var oDialog = new sap.ui.commons.Dialog("moduleSelectorDialog",{
			title:"Switch to other module",
			content:[layout],
			showCloseButton:true,
			applyContentPadding:false,
			modal:true,
			width:"400px",
			maxHeight:"300px",
			closed:function(){
				this.destroy();
			}
		}).addStyleClass("selectModule");
		// var oModelModule = sap.ui.getCore().getModel("module");
		// var module = oModelModule.getProperty("NAME");
		var service = new lenovo.service.Common();
		service.mapModuleUser().done($.proxy(function(data){
			var data = data["d"]["results"];
			$.each(data, function(index, value) {
				var oItem = new sap.ui.commons.Button({
					text:value["MODULE_NAME"],
					// enabled:value["MODULE_NAME"] == module ? false : true,
					press: _this.onModuleSelected					
				}).data("LOGINNAME", value["LOGINNAME"]).data("MODULE_ID", value["MODULE_ID"]);						
				layout.addContent(oItem);
			});			
		}, _this));	
		oDialog.open();
	},

	onModuleSelected: function(e){
		var moduleName = e.getSource().getText();
		var oEntry = {
			"MODULE_ID": e.getSource().data("MODULE_ID"),
			"XSSESSION_ID": "",
			"COMMENT": ""
		}
		var oModel = new sap.ui.model.odata.ODataModel("/cdp/security/services/userInfo.xsodata", true);     			
		oModel.setHeaders({
            "content-type": "application/json;charset=utf-8"
        });
		oModel.create("/MAP_MODULEUSER",  oEntry, null, 
        	function(){
				localStorage.NAME = e.getSource().data("LOGINNAME");
        		location.href = location.href.split("index")[0] + "index.html?m=" + moduleName;
        	},
        	console.log("error")
        );
		
	},

	toggleMenu: function(){
		if(this.hasStyleClass("hideMenu")){
			this.removeStyleClass("hideMenu");
			var list = $("#oVmi .sapUiTreeNode");
			list.removeClass("leftMenuItemPadding");
			var span = $("#oVmi .sapUiTreeNode>span");
			span.removeClass("leftMenuSpanPadding");
			var oSplitter = sap.ui.getCore().byId("oVmi");
			oSplitter.setSplitterPosition("16%");
		}else{
			this.addStyleClass("hideMenu");
			var list = $("#oVmi .sapUiTreeNode");
			list.addClass("leftMenuItemPadding");
			var span = $("#oVmi .sapUiTreeNode>span");
			span.addClass("leftMenuSpanPadding");
			$("#oVmi_firstPane").css("width","0px");
			$("#oVmi_secondPane").css("width","100%");
			var oTree = sap.ui.getCore().byId("oVmi").getFirstPaneContent()[0].getContent()[2];
			oTree.collapseAll()
		}
	}
});