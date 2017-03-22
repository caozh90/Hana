jQuery.sap.require("lenovo.control.Controller");
jQuery.sap.require("lenovo.control.TreeNode");
jQuery.sap.require("lenovo.control.Util");

lenovo.control.Controller.extend("lenovo.view.common.navigation", {
	onInit: function() {
		var that = this;
		this.treeModel = new sap.ui.model.json.JSONModel();
		this.tree = sap.ui.getCore().byId("navigation");
		this.tree.setModel(this.treeModel);	
		this.tree.bindNodes("/nodes", new TreeNode({expanded: false, selected: $.proxy(that.onSelect, that)}).bindProperty("text", "text").bindProperty("icon","icon"), new sap.ui.model.Sorter("text", true));
		this.getEventBus().subscribe("RouteData", "Ready", this.onRouteDataReady, this);
		//add by zhaodan1 for ebgdf module start -- remove by Chris Gao	
//		if(jQuery.sap.getUriParameters().get("m") == "EBGDF"){
//			var step_path;
//			$.ajax({
//			url:"config/route/workStep_ebgdf.json",
//			type:"get",
//			async: false,
//			contentType: "application/json",
//			success: function(data){
//						 $.each(data,function(j,val){
//				              step_path = val;
//				              return;
//				      	  })		
//	                 }}
//			);
//			this.step_path = step_path;
//		}
		
		/***********************************
		 * Added by Chris Gao
		 * Standard MVC Controller 
		 * 2015-08-20
		 ***********************************/
		
		/***********************************
		 * Modified by Chris Gao
		 * 2015-08-23
		 * to do the performance enhancement, reduce the number of requests to database 
		 ***********************************/
		//register global model to record the special user session, such as steps
		var _UserEBGDFStepData = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(_UserEBGDFStepData, "UserEBGDFStepData");
		//give the initial steps
		sap.ui.getCore().getModel("UserEBGDFStepData").setData(0);
		
		if(jQuery.sap.getUriParameters().get("m") == "EBGDF")
		{
			$.ajax({
				url:"/cdp/ebgdf/service/getSteps.xsjs",
				type:"get",
				async: false,
				contentType: "application/json",
				success: function(nextStep){
					
					var step = nextStep;
					console.log(step);
					//set data value when module = EBGDF and menu = LCPE Calculation
					sap.ui.getCore().getModel("UserEBGDFStepData").setData(step);
				}
			});
		}
		/*****************************
		 * End by Chris Gao
		 * 2015-08-23
		 ****************************/
		
		this.getView().addEventDelegate({
            // not added the controller as delegate to avoid controller functions with similar names as the events
            onBeforeShow : jQuery.proxy(function(evt) {
                      this.onBeforeShow(evt);
            }, this)
    	});
		//add by zhaodan1 for ebgdf module end

	},
	
	
	/***********************************
	 * Added by Chris Gao
	 * Standard MVC Controller 
	 * 2015-08-20
	 ***********************************/
	onBeforeShow : function(evt) {
        if (evt) {
        	console.log("onBeforShow");
        } 
    },
    
	onAfterRendering: function() {

		if(jQuery.sap.getUriParameters().get("m") == "EBGDF")
		{
			var targetWorkFlowNode = null;
			var treeNavigationList = sap.ui.getCore().byId("navigation");
			var aNodes = treeNavigationList.getNodes();
			
			for(var i=0; i < aNodes.length; i++)
			{
				var aNode = aNodes[i];
				if(aNode.getText() == 'LCPE Calculation')
				{
					targetWorkFlowNode = aNode;
				}
			}
			if(targetWorkFlowNode != null)
			{
				/***********************************
				 * Modified by Chris Gao
				 * 2015-08-23
				 * to do the performance enhancement, reduce the number of requests to database 
				 ***********************************/
				var step = sap.ui.getCore().getModel("UserEBGDFStepData").getData();
				
				for(var i=0;i<targetWorkFlowNode.getNodes().length;i++)
				{	
					if( i > step ) // current step + 1
					{
						var canAccessNode = targetWorkFlowNode.getNodes()[i];
						canAccessNode.getDomRef().className = 'sapUiTreeNode_Gray';										
						canAccessNode.getDomRef().innerHTML = '<span class="sapUiTreeNodeContent_Gray">'+canAccessNode.getText()+'</span>';
					}
				}
				
				/*****************************
				 * End by Chris Gao
				 * 2015-08-23
				 ****************************/
			}
		}
		/***********************************
		 * Added by Chris Gao
		 * 2015-11-10
		 * to do the loading control show 
		 ***********************************/
//		if(jQuery.sap.getUriParameters().get("m") == "EBGCFE")
//		{
//			if(!$("#popLoading").is(":hidden") && !$("#casePourpre").is(":hidden"))
//			{
//				setTimeout(function(){
//					$("#popLoading").fadeOut(1000);
//					$("#casePourpre").fadeOut(1000);
//				},2500);
//			}
//			
//			
//		}
		/*****************************
		 * End by Chris Gao
		 * 2015-11-10
		 ****************************/
		
	},
	
//	onBeforeRendering: function() {
//		console.log("beforeRender");
//	},
	
	/***********************************
	 * End BY Chris Gao
	 * Standard MVC Controller 
	 * 2015-08-20
	 ***********************************/
	
	onRouteDataReady: function(sChannel, sEvent, oData){
		
		this.treeModel.setData(oData.data);
	},
	
	onSelect: function(oEvent) {
//		this.showMenu();
		var node = oEvent.getSource();
		var length =node.getNodes().length;
//		var step_path = this.step_path;
		
		if(length == 0) {
			/***********************************
			 * Added by Chris Gao
			 * 2015-11-10
			 * to do the loading control show 
			 ***********************************/
			var page = node.getText();	
			var router = this.getRouter();
//			console.log(1);
			if(jQuery.sap.getUriParameters().get("m") == "EBGCFE")
			{
//				alert(1); 
//				setTimeout("alert(3)", 0); 
//				alert(2); 
				$("#popLoading").show();
				$("#casePourpre").show();
				
				setTimeout(function(){			
					router.navTo(page);	
					sap.ui.getCore().getEventBus().publish("TreeNavigation", "Ready", { view : page }); 
				},200);
				
				setTimeout(function(){
					$("#popLoading").fadeOut(1000);
					$("#casePourpre").fadeOut(1000);
				},3000);
			}
			else
			{
				router.navTo(page);	
				sap.ui.getCore().getEventBus().publish("TreeNavigation", "Ready", { view : page }); 		
			}
			/*****************************
			 * End by Chris Gao
			 * 2015-11-10
			 ****************************/
						  
		}
		else
		{			
			if(node.getExpanded() == true){
				node.collapse();
				
			}
			else
			{				
				var aNodes = node.getTree().getNodes();
				for(var i=0;i<aNodes.length;i++){
					aNodes[i].collapse(true);
				}
				node.expand();		
				

			}		
		}
		
	},
	navigationTo: function(oEvent){
		var node = oEvent.getSource();
		var page = node.getText();						
		this.getRouter().navTo(page);
	},
	_treeNodesFactory: function(sId, oContext) {       	
		var oTreeNode = new sap.ui.commons.TreeNode(sId)
    		.bindProperty("text","ROLE_NAME");		
		return oTreeNode;
	},
});

//jQuery.sap.require("lenovo.control.Controller");
//jQuery.sap.require("lenovo.control.TreeNode");
//jQuery.sap.require("lenovo.control.Util");
//
//lenovo.control.Controller.extend("lenovo.view.common.navigation", {
//	onInit: function() {
//		var that = this;
//		this.treeModel = new sap.ui.model.json.JSONModel();
//		this.tree = sap.ui.getCore().byId("navigation");
//		this.tree.setModel(this.treeModel);	
//		this.tree.bindNodes("/nodes", new TreeNode({expanded: false, selected: $.proxy(that.onSelect, that)}).bindProperty("text", "text").bindProperty("icon","icon"), new sap.ui.model.Sorter("text", true));
//		this.getEventBus().subscribe("RouteData", "Ready", this.onRouteDataReady, this);
//	},
//	onRouteDataReady: function(sChannel, sEvent, oData){
//		this.treeModel.setData(oData.data);
//	},
//	onSelect: function(oEvent) {
////		this.showMenu();
//		var node = oEvent.getSource();
//		var length =node.getNodes().length;
//		if(length == 0) {
//			var page = node.getText();						
//			this.getRouter().navTo(page);	
//			sap.ui.getCore().getEventBus().publish("TreeNavigation", "Ready", { view : page }); 					  
//		}else{			
//			if(node.getExpanded() == true){
//				node.collapse();
//			}else{				
//				var aNodes = node.getTree().getNodes();
//				for(var i=0;i<aNodes.length;i++){
//					aNodes[i].collapse(true);
//				}
//				node.expand();
//			}		
//		}
//	},
//	navigationTo: function(oEvent){
//		var node = oEvent.getSource();
//		var page = node.getText();						
//		this.getRouter().navTo(page);
//	},
//	_treeNodesFactory: function(sId, oContext) {       	
//		var oTreeNode = new sap.ui.commons.TreeNode(sId)
//    		.bindProperty("text","ROLE_NAME");		
//		return oTreeNode;
//	},
//});