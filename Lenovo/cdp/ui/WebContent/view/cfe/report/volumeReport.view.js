//Created by zhangzj6 for WO0000000280686(tuyn1) at 2016-07-21
jQuery.sap.require("lenovo.control.commontable.Table");
jQuery.sap.require("lenovo.service.CFE");
sap.ui.jsview("lenovo.view.cfe.report.volumeReport", {	
	execute: function(executePanel, executeModel){
		var oLabel = new sap.ui.commons.Label({
			text: "Do you want to execute?",
			width: "350px",
		});
		sap.ui.commons.MessageBox.confirm(oLabel, function(result){
			if(result) {
				//get the dropdownBox control
				var oForm = executePanel.getContent()[0];
				var exportTime = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Export Time")[0];
				var cycle = executeModel.getProperty("/CYCLE/value");
				var exporttime = exportTime.getYyyymmdd();

				var data = {
						"cycle": cycle,
						"exporttime": exporttime
				};
				
				var service = new lenovo.service.CFE();
				var logicServiceUrl = service.getEBGCfeLogic();	
				executePanel.setBusy(true);
				if(cycle == "HISTORY"){
					executePanel.setBusy(false);
					var url = logicServiceUrl+"/ui_volumereport_export.xsjs?cycle=" + cycle + "&exporttime=" + exporttime;	
					window.open(url);
				}else{
					$.ajax({
						url: logicServiceUrl+"/ui_volumereport_export.xsjs",
						data: data,
						type: "GET",
						contentType: "text",
						success: function(data){
							executePanel.setBusy(false);
							lenovo.control.commontable.Toolkit.showErrorMsg("Successfully execute", "SUCCESS", "Execute");		
						},
						error: function(err){
							executePanel.setBusy(false);
							err = err && err.responseText ;
							if(!(typeof err === "string"))
								err = JSON.stringify(err);
							lenovo.control.commontable.Toolkit.showErrorMsg(err, "ERROR", "Execute");			
						}
					});					
				}		
			}
		}, 	"Confirm");
		
	},
	createContent: function(){
		//declare app
		var app = new sap.m.App(); 
		this.app = app;
		var service = new lenovo.service.CFE();
		
		//declare header
		var header = lenovo.control.commontable.Table.createHeader("Report", "Volume Report");
		
		//declare excute panel
		var executeConfig = {
				formWidth: "66.6%",
				columns: [[{
						field: "CYCLE", label: "Cycle", type: "DropdownBox", 
						dropdownbox : {
							data:[{"text": "CURRENT", "key": "CURRENT"},
						          {"text": "HISTORY", "key": "HISTORY"}
							]					
						}
				}],[{
					field: "TIME", label: "Export Time", type: "DatePicker"
				}]],
				execute: {
					func: this.execute,
					context: this
				}
		};
		var oPanel =  lenovo.control.commontable.Table.createExecutePanel(executeConfig);
		oPanel.addStyleClass("filter-panel ondemandRefresh-dslayout");
		
		//get the dropdownBox control
		var oForm = oPanel.getContent()[0];
		var cycleDropdownBox = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Cycle")[0];
		
		//get the DatePicker control and set the visible 
		var exportTime = lenovo.control.commontable.Toolkit.getFormElementByLabel(oForm, "Export Time")[0];
		exportTime.setVisible(false);
		cycleDropdownBox.attachChange(function(config){
			var selectedKey = this.getSelectedKey();
			if(selectedKey == "HISTORY"){
				exportTime.setVisible(true);
			}else{
				exportTime.setVisible(false);
			}
		});
		
		//declare page for disaply
		var page = new sap.m.Page({
	      	  showHeader: false,
	          content :[header]               
	    });
		page.insertContent(oPanel, 1);
		this.page = page;
		app.insertPage(page);
		return app;
	}
});