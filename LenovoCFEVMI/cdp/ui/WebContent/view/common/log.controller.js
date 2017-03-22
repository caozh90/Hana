jQuery.sap.require("lenovo.control.Controller");
jQuery.sap.require("lenovo.control.commontable.Toolkit");
lenovo.control.Controller.extend("lenovo.view.common.log", {
	onInit: function() {
		this.sServiceUrl = "/cdp/log/service/transactionLog.xsodata";
		this.bindRowUrl = "/transLogs";
	},
	deleteTranscationLog: function(){
		var that = this;
		var param = {
			logs: "TRANS"
		};
		var deleteModel = this.deleteModel;
		var startTime = deleteModel.getProperty("/transactionStartTime");
		var endTime = deleteModel.getProperty("/transactionEndTime");
		if(startTime) {
			param.start_time = lenovo.control.commontable.Toolkit.dateDateFormat.format(startTime);
		}
		if(endTime) {
			param.end_time = lenovo.control.commontable.Toolkit.dateDateFormat.format(endTime);
		}
		$.ajax({
			url: "/cdp/log/service/deleteLogs.xsjs",
			type: "get",
			data: param,
			dataType: "json",
			success: function(data){
				if(data.success) {
					that.tansactionTable.setBusy(true);
					that.oModel.refresh();
					that.tansactionTable.setBusy(false);
					sap.ui.commons.MessageBox.show(data.message, "SUCCESS", "Delete Log");
				} else {
					sap.ui.commons.MessageBox.show(data.message, "ERROR", "Delete Log");
				}
			}
		});
	},
	deleteMonitorLog: function(){
		var that = this;
		var param = {
			logs: "MONITOR"
		};
		var deleteModel = this.deleteModel;
		var startTime = deleteModel.getProperty("/monitorStartTime");
		var endTime = deleteModel.getProperty("/monitorEndTime");
		if(startTime) {
			param.start_time = lenovo.control.commontable.Toolkit.dateDateFormat.format(startTime);
		}
		if(endTime) {
			param.end_time = lenovo.control.commontable.Toolkit.dateDateFormat.format(endTime);
		}
		$.ajax({
			url: "/cdp/log/service/deleteLogs.xsjs",
			type: "get",
			data: param,
			dataType: "json",
			success: function(data){
				if(data.success) {
					that.monitorTable.setBusy(true);
					that.oMonitorModel.refresh();
					that.monitorTable.setBusy(false);
					sap.ui.commons.MessageBox.show(data.message, "SUCCESS", "Delete Log");
				} else {
					sap.ui.commons.MessageBox.alert(data.message, "ERROR", "Delete Log");
				}
			}
		});
	},
	onAfterRendering: function(){
		/*this.oModel = new sap.ui.model.odata.ODataModel(this.sServiceUrl, true);
		var config = this.getDefaultTableConfig();
		this.table = this.initTable(config);
		this.table.setModel(this.oModel);
		this.table.placeAt("table-wrapper");*/
	}
});