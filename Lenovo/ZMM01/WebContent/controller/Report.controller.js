sap.ui.define([
	"lenovo/mtm/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/m/Table",
	"sap/m/MessageToast",
	"jquery.sap.global",
	'sap/ui/core/Fragment',
	"sap/ui/model/odata/ODataModel",
	"sap/m/TablePersoController",
	"sap/ui/model/resource/ResourceModel",
], function(BaseController, JSONModel, Export, ExportTypeCSV, Filter, FilterOperator, Device,Table, MessageToast,jQuery,Fragment,ODataModel,TablePersoController,ResourceModel) {
	"use strict";
	return BaseController.extend("lenovo.mtm.controller.Report", {
		oPersonalizationDialog : null,
		onInit: function() {
			
			//Get user id
			var userID = this.onGetUserID();

			//Process ComboBox data
		    this.oSearchModel = new JSONModel({
				data: []
			});
			//Limit the input line 
			this.oSearchModel.setSizeLimit(5000);
			this.setModel(this.oSearchModel, "SearchData");
			this.oDroplist(userID);
			this.onSetVisible();
		},	
		onSetVisible: function(){
			if (sap.ui.Device.system.phone==true){
				var DL = this.getView().byId("Download");//Download
				DL.setVisible(false);
				var oTable1 = this.getView().byId("ReportTable");//ReportTable
				oTable1.setVisible(false);
			}else{
				var oTable2 = this.getView().byId("ReportTable_m");//ReportTable
				oTable2.setVisible(false);
			}
		},
		onBeforeRendering: function() {
			this.oConfig = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView())).getMetadata().getConfig();
			//计算table显示的行数
			var oHeight = window.screen.height;
			if(oHeight >= "1080"){
				var oRows = Math.floor((oHeight*20)/1080);
			} else {
				var oRows = Math.floor((oHeight*20)/1080) - 2;
			};
			this.getView().byId("ReportTable").setVisibleRowCount(oRows);
		},
		onAfterRendering: function(){
			// Initialize Busy Dialog
			this.getOwnerComponent().Dialog.onInit(this.getView());
		},
		//Navigator Function
		handlePressConfiguration: function(oEvent) {
		    var oItem = oEvent.getSource();
		    var oShell = this.getView().byId("myShell");
		    var bState = oShell.getShowPane();
		    oShell.setShowPane(!bState);
		    oItem.setShowMarker(!bState);
		    oItem.setSelected(!bState);
		  },
		//Get User ID
		onGetUserID: function(){
			var userID = new sap.ushell.Container.getService("UserInfo").getId().toString();
			return userID;
		},
		//Get ComboBox data
        oDroplist:function(userID){
        	var that = this;
        	var filter = [];
        	var oFilter = new Filter({
				path : "Zuser",
				operator : FilterOperator.EQ,
				value1 : userID
			});
        	filter.push(oFilter);
        	var oConfig = this.getOwnerComponent().getMetadata().getConfig();
		    var sUrl = oConfig.serviceUrl;
        	this.oDataModel = new ODataModel(sUrl,true);
			this.oDataModel.read("/ZMTM_SEARCHSet", {
				filters : filter,
				async : false,
				success : function(oData, response){
					var SearchData = that.oSearchModel.getData();
					var Entries = SearchData.data;
					var child = {};
					for( var j = 0; j < oData.results.length; j++){
						var k= Entries.length;
						child = {							    
								Zseries: oData.results[j].Zseries,
								Zvalue: oData.results[j].Zvalue,
							};
						Entries[k] = child;
					}
					that.oSearchModel.setData(SearchData);
				},
				error : function(error) {
					MessageToast.show(oConfig.msgs[6].text);
					return;
				}
			});
        },
        handleChange: function (oEvent){
        	var s05 = this.getModel("i18n").getProperty("S05");
        	var oDP = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			if (bValid) {
				this.oValue = 0;
				oDP.setValueState(sap.ui.core.ValueState.None);
					if ((oDP.getId() == 'application-ZMM_MTM001-DISPLAY-component---Report--Zdatemfgf') && (oDP.getId() != '')){
						var oDP1 = this.getView().byId("Zdatemfgt").getValue();
						if((sValue > oDP1) && (oDP1 != '')){
							this.oValue = 1;
							MessageToast.show(s05);
						}
					}
					if ((oDP.getId() == 'application-ZMM_MTM001-DISPLAY-component---Report--Zdatemfgt') && (oDP.getId() != '')){
						var oDP2 = this.getView().byId("Zdatemfgf").getValue();
						if(sValue < oDP2){
							this.oValue = 1;
							MessageToast.show(s05);
						}
					}
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
				oDP.focus(); 
				this.oValue = 1;
			}
        },
      //Read data from back-end
        onSearch: function (oEvent){
        	this.onOpenDialog("Search");
        	
        	this.oReaddataModel = new JSONModel({
			     data: []
		    });
			this.setModel(this.oReaddataModel, "ItemData");
			
			var sUrl = "/sap/opu/odata/sap/ZMMPP_MTM_001_SRV/";
			var sRead = "/ZMTM_REPORTSet";
			this.oDataModel = new ODataModel(sUrl,true);
			var that = this;
			var aFilter = [];
	     	var oView = this.getView();
	           // Vendor
	    	   var oSearchField = oView.byId("VendorC");
	     	   var Vendor = oSearchField.getValue();
	     	   var oFilter1 = new Filter("Zvendor",FilterOperator.EQ, Vendor);
	     	   if (Vendor != ''){aFilter.push(oFilter1);}
	     	   // Custom Model FLag
	    	   var oSearchField = oView.byId("Zcmf");
	     	   var Zcmf = oSearchField.getValue();
	     	   var oFilter7 = new Filter("Zcmf",FilterOperator.EQ, Zcmf);
	     	   if (Zcmf != ''){aFilter.push(oFilter7);}
	     	   // Brand     				
	     	   var oSearchField = oView.byId("BrandC");
	     	   var Brand = oSearchField.getValue();
	     	   var oFilter2 = new Filter("Zbrand",FilterOperator.EQ, Brand);
	     	   if (Brand != ''){aFilter.push(oFilter2);}
	     	   // Group     	
	     	   var oSearchField = oView.byId("GroupC");
	     	   var Group = oSearchField.getValue();
	     	   var oFilter3 = new Filter("Zbugr",FilterOperator.EQ, Group);
	     	   if (Group != ''){aFilter.push(oFilter3);}
	     	   // Zdatemfgf
	     	   var Zdatemfgf = oView.byId("Zdatemfgf").getValue();
	     	   var oFilter4 = new Filter("Zdatemfgf",FilterOperator.EQ, Zdatemfgf);
	     	   if (Zdatemfgf != ''){aFilter.push(oFilter4);}
	     	   // Zdatemfgt
	     	   var Zdatemfgt = oView.byId("Zdatemfgt").getValue();
	     	     //check date from and date to
	     	     var s05 = this.getModel("i18n").getProperty("S05");
	     	     if (Zdatemfgt < Zdatemfgf){
	     	    	MessageToast.show(s05);
	     	    	that.onCloseDialog();
	     	    	return;
	     	        };
	     	   var oFilter5 = new Filter("Zdatemfgt",FilterOperator.EQ, Zdatemfgt);
	     	   if (Zdatemfgt != ''){aFilter.push(oFilter5);}
	     	   
	     	   var userID = this.onGetUserID();
	     	   var oFilter6 = new Filter("Zuser",FilterOperator.EQ, userID);
	     	   if (userID != ''){aFilter.push(oFilter6);}
	     	   // Urgent     	
	     	   var oSearchField = oView.byId("Zumf_fb");
	     	   var Zumf = oSearchField.getValue();
	     	   var oFilter7 = new Filter("Zumf",FilterOperator.EQ, Zumf);
	     	   if (Zumf != ''){aFilter.push(oFilter7);} 
	     	   // Zproduct     	
	     	   var oSearchField = oView.byId("Zproduct");
	     	   var Zproduct = oSearchField.getValue();
	     	   var oFilter8 = new Filter("Zproduct",FilterOperator.EQ, Zproduct);
	     	   if (Zproduct != ''){aFilter.push(oFilter8);}

			var ItemData = this.oReaddataModel.getData();
			var ReadEntries = ItemData.data;
			var child = {};
			that.oDataModel.read(sRead, {
				filters : aFilter,
				async : false,
				success : function(oData, response){
					for( var j = 0; j < oData.results.length; j++){
						//if have Date type field,pls convert data type
						//var d = new Date( oData.results[j].Aedat );
						//var oAedat = d.oFormatOptions.getFullYear() + '-' + (d.oFormatOptions.getMonth() + 1) + '-' + d.oFormatOptions.getDate();

						var k= ReadEntries.length;
						child = {							    
								Lifnr: oData.results[j].Zvendor,
								Zbrand: oData.results[j].Zbrand,
								Zbugr: oData.results[j].Zbugr,								
								Zmfgd: oData.results[j].Zmfgd,
								Zwk: oData.results[j].Zwk,
								Ztotal: oData.results[j].Ztotal,
								Zclosed: oData.results[j].Zclosed,
								Zopen: oData.results[j].Zopen,
								Ze2ein: oData.results[j].Ze2ein,
								Ze2ekpi: oData.results[j].Ze2ekpi,
								Zbomin: oData.results[j].Zbomin,
								Zbomkpi: oData.results[j].Zbomkpi,
								Zquoin: oData.results[j].Zquoin,
								Zquokpi: oData.results[j].Zquokpi,
								Zcontin: oData.results[j].Zcontin,
								Zcontkpi: oData.results[j].Zcontkpi,
							};
						ReadEntries[k] = child;
					  }		
					that.oReaddataModel.setData(ItemData);
					that.onCloseDialog();
				      },
				error : function(error) {
					that.onCloseDialog();
					var s04 = that.getModel("i18n").getProperty("S04");
		       	      MessageToast.show(s04);
				} , 
			});	
			that.getView().byId("Panel1").setExpanded(false);
        },
        onOpenDialog: function(iv_action) {
			this.getOwnerComponent().Dialog.open(this.getView(), this.oConfig, iv_action);
		},
		onCloseDialog: function() {
			this.getOwnerComponent().Dialog.onCloseDialog();
		},
		//Download data
		onDownloadExcel: function(){
        var oModel = this.getView().byId("ReportTable").getModel("ItemData");
    	if(oModel == undefined ){
    		MessageToast.show("No data to download !!!");
    		this.onCloseDialog();
    		return;
    	} 
    	var DownloadData = this.getView().byId("ReportTable").getModel("ItemData").getData();
        this.onDataExport(DownloadData , oModel);
        },
        onDataExport: function(DownloadData , oModel){
			
			jQuery.sap.require("sap.ui.core.util.Export");
			jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
	         var json = {}; 
	         var colArray = []; 
	         var itemsArray= [];
	         
	         //push header column names to array
	         json={name: "Vendor"};
	         colArray.push(json);
	         json={name: "Brand"};
	         colArray.push(json);
	         json={name: "Business Group"};
	         colArray.push(json);
	         json={name: "WK"};
	         colArray.push(json);
	         json={name: "Total"};
	         colArray.push(json);
	         json={name: "Closed"};
	         colArray.push(json);
	         json={name: "Open"};
	         colArray.push(json);
	         json={name: "E2E IN"};
	         colArray.push(json);
	         json={name: "E2E KPI"};
	         colArray.push(json);
	         json={name: "BOM IN"};
	         colArray.push(json);
	         json={name: "BOM KPI"};
	         colArray.push(json);
	         json={name: "QUO IN"};
	         colArray.push(json);
	         json={name: "QUO KPI"};
	         colArray.push(json);
	         json={name: "CONT IN"};
	         colArray.push(json);
	         json={name: "CONT KPI"};
	         colArray.push(json);
	         
	         itemsArray.push(colArray);
	         
	          //push table cell values to array
	          for (i = 0; i < DownloadData.data.length; i++) {
	              colArray = [];
	              
	              json={name: "\r"+DownloadData.data[i].Lifnr};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zbrand};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zbugr};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zwk};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Ztotal};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zclosed};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zopen};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Ze2ein};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Ze2ekpi};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zbomin};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zbomkpi};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zquoin};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zquokpi};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zcontin};
	       	      colArray.push(json);
	       	      json={name: DownloadData.data[i].Zcontkpi};
	       	      colArray.push(json);
	       	      
	       	      itemsArray.push(colArray);  
	            }
	         //export json array to csv file
	          var oExport = new sap.ui.core.util.Export({
	                // Type that will be used to generate the content. Own ExportType’s can be created to support other formats
	                exportType: new sap.ui.core.util.ExportTypeCSV({
	                    separatorChar: ","
	                }),
	                // Pass in the model created above
	                models: oModel,
	                // binding information for the rows aggregation
	                rows: {
	                    path: "/"
	                },
	                // column definitions with column name and binding info for the content
	                columns: [itemsArray]
	            });
	          //File name
	          oExport.saveFile("MTM-DATA").always(function() {
	                this.destroy();
	            });
	          this.onCloseDialog();
             
		},		
	});

});