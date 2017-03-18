sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/ui/core/mvc/Controller'],
	function(jQuery, MessageToast, Controller) {
	"use strict";

	var ControllerController = Controller.extend("demo.controller.UploadFile", {
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] == "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2], "SUCCESS", "Upload Success";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2], "ERROR", "Upload Error";
				}

				MessageToast.show(sMsg);
			}
		},
		
		handleUploadPress: function(oEvent) {
			jQuery.sap.require("demo.thirdJS.papaparse");
			console.log(oFileUploader);
			var oFileUploader = this.getView().byId("fileUploader");
			if(!oFileUploader.getValue()) {
				MessageToast.show("Choose a file first");
				return;
			}
			
			var file = oFileUploader.oFileUpload.files[0];
			console.log(oFileUploader);
			//oFileUploader.upload();
			var config = this.buildConfig();
			Papa.parse(file,config);
		},

		handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose one of the following types: " +
									sSupportedFileTypes);
		},

		handleValueChange: function(oEvent) {
			MessageToast.show("Press 'Upload File' to upload file '" +
									oEvent.getParameter("newValue") + "'");
		},
		buildConfig: function(){
			return {
				delimiter: ",",	// auto-detect
				newline: "",	// auto-detect
				quoteChar: '"',
				header: false,
				dynamicTyping: false,
				preview: 0,
				encoding: "",
				worker: false,
				comments: false,
				step: undefined,
				complete: function(results, file){
					console.log("Parsing complete:", results, file);
				},
				error: undefined,
				download: false,
				skipEmptyLines: false,
				chunk: undefined,
				fastMode: undefined,
				beforeFirstChunk: undefined,
				withCredentials: undefined
			}
		}
	});

	return ControllerController;

});
