sap.ui.define([
	"lenovo/mtm/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/m/Table",
	"sap/m/MessageToast",
	"jquery.sap.global",
	"sap/ui/model/odata/ODataModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
], function(BaseController,History,JSONModel, Export, ExportTypeCSV, Filter, FilterOperator, Device,Table, MessageToast,jQuery,ODataModel,Dialog,Button,Text) {
	"use strict";

	return BaseController.extend("lenovo.mtm.controller.Upload", {
		
		oConfig: null,
		bServerConnect: true,
		
		onInit: function() {
			var oViewModel,
			fnSetAppNotBusy,
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
		
		    this.oUploadModel = new JSONModel({
			     data: []
		    });
		    //Limit the input line 
		    this.oUploadModel.setSizeLimit(5001);
		    this.setModel(this.oUploadModel, "uploadData");
            
		},		
		onBeforeRendering: function() {
			this.oConfig = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView())).getMetadata().getConfig();
		},
		onAfterRendering: function(){
			// Initialize Busy Dialog
			this.getOwnerComponent().Dialog.onInit(this.getView());
		},
	    //Download Template
		onDownloadTemplate: function(){
			var oHost = window.location.host;
			var url = "http://" + oHost + "/sap/bc/ui5_ui5/sap/zmm_mtm_001/templates/UrgentModel.csv"
			window.location = url;
		}, 
		//Check File'type is CSV 
		onCheckFile: function(fileName) {
			var aArray = fileName.split(".");
			var sType = aArray[aArray.length - 1];
			if (sType.toUpperCase() !== "CSV") {
				MessageToast.show(this.oConfig.msgs[0].text);
				aArray = undefined;
				sType = undefined;
				var sFlag = "E";
				return sFlag;
			}
		},
		//Upload Complete
		handleUploadComplete: function(oEvent){
		    var sUrl = this.oConfig.serviceUrl;
			//Put the csv data into JSON model
			var uploadData = this.oUploadModel.getData();
			var uploadEntries = uploadData.data;
			// 检查数据上传的条目数(大于5000)
			if (this.pushResult.length-2 > 5000) {
				MessageToast.show(this.oConfig.msgs[9].text);
				this.onCloseDialog();
				return;
			}
			// 检查文档数据是否为空（除去抬头部分）
			if (this.pushResult.length-2 <= 0) {
				MessageToast.show(this.oConfig.msgs[2].text);
				this.onCloseDialog();
				return;
			}
			//检查模板中是否有逗号（逗号和csv文件的格式冲突）
			for(var i = 1; i< this.pushResult.length-1; i++){
				var length = this.pushResult[i].length;
				if(length > 3){
					MessageToast.show("The Comma exists in Template,Pls check it!!!");
					this.onCloseDialog();
					return;
				}
			}
			var child = {};
			for(var i = 1; i< this.pushResult.length-1; i++){
				var k= uploadEntries.length;
				child = {
				    
					Mno: this.pushResult[i][0],
					Order: this.pushResult[i][1],
					Quantity: this.pushResult[i][2],
				};
				var filter = [];
				var oFilter = new Filter({
					path : "Matnr",
					operator : FilterOperator.EQ,
					value1 : child.Mno
				});
				filter.push(oFilter);
				
				var oFilter1 = new Filter({
					path : "Zmode",
					operator : FilterOperator.EQ,
					value1 : "CheckData"
				});
				filter.push(oFilter1);
				
				this.oDataModel = new ODataModel(sUrl,true);
				var that = this;
				that.oDataModel.read("/ZMTM_UPLOADSet", {
					
					filters : filter,
					async : false,
					success : function(data, response){
					  child.Msg = data.results[0].Zmsg;
					  that.onCloseDialog();
					},
					error : function(error) {
						that.bServerConnect = false;
						that.onCloseDialog();
					}
				});
				uploadEntries[k] = child;
			};
			that.oUploadModel.setData(uploadData);
			//After Uploading,display all data
			that.onAll(oEvent);
		},
		//Upload Press
		handleUploadPress: function(){
			var oFileUploader = this.getView().byId("fileUploader");
			// var filename = oFileUploader.getValue();
			// 检查是否选中文件
			if (!oFileUploader.getValue()) {
				MessageToast.show(this.oConfig.msgs[1].text);
				return;
			}

			// 检查文档是否为空
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			if (file.size == 0) {
				MessageToast.show(this.oConfig.msgs[2].text);
				return;
			}

		    oFileUploader.upload();
		    //clear tabel JSON model
		    var NewEntry = [];
		    var uploadData = this.oUploadModel.getData();
			uploadData.data = NewEntry;
			this.oUploadModel.setData(uploadData);
			// Check File Type and File Size************************Begin
			var sFlag = this.onCheckFile(file.name);
			if (sFlag !== "E") {
				this.onOpenDialog("upload");
			} else {
				return
			}
			// Check File Type and File Size**************************End			
		    this.onHandleFileUpload(this, file);
		},
		onOpenDialog: function(iv_action) {
			this.getOwnerComponent().Dialog.open(this.getView(), this.oConfig, iv_action);
		},
		onCloseDialog: function() {
			this.getOwnerComponent().Dialog.onCloseDialog();
		},
		//File Upload		
		onHandleFileUpload: function(im_this, file) {
			var file = file;
			var localData = new Array();
			var tempNull;
			var csvParser = new SimpleExcel.Parser.CSV();
			csvParser.setDelimiter(',');
			
			//get the data form csv file
			csvParser.loadFile(file, function() {
				var that = im_this;
				that.pushResult = [];
				var sheet = csvParser.getSheet();
				var localDataHeader = new Array();
				sheet.forEach(function(el, i) {
					var pushRow = new Array();
					var localDataRow = new Object();
					// generate object header
					var rowNum = i;
					el.forEach(function(el, i) {
						pushRow.push(el.value.replace(/\"|=/g, ""));
						if (rowNum == 0) {
							localDataHeader[i] = el.value;
							tempNull = el.value;
						} else {
							localDataRow[localDataHeader[i]] = el.value.replace(/\"|=/g, "");
						}
					});

					if (localDataRow[tempNull] != undefined) {
						localData.push(localDataRow);
					}
					that.pushResult.push(pushRow);
				});
				
			});
			
		},
        //
		clearSelection: function (evt) {
			this.getView().byId("table1").clearSelection();
		},
		onChangedata: function(evt){
			var oTable = this.getView().byId("table1");
			var oSela = evt.getSource().getSelected();
			if (oSela == true){
				for(var i=0; i<oTable.getMaxItemsCount(); i++){
					if(oTable.getItems()[i] != undefined){
						if (oTable.getItems()[i].getCells()[0].getEditable()==true){
							var oSel = oTable.getItems()[i].getCells()[0].getSelected();
							if (oSel == false){
								var flag = 1;
							}
						}
					}
				}
				if (flag != 1 ){
					this.getView().byId("selectall").setSelected(true);
				}
			}else{
				this.getView().byId("selectall").setSelected(false);
			}

		},
		onChangedataall: function(evt){
			var oTable = this.getView().byId("table1");
			var oSela = evt.getSource().getSelected();
			if (oSela == true){
				for(var i=0; i<oTable.getMaxItemsCount(); i++){
					if(oTable.getItems()[i] != undefined){
						if (oTable.getItems()[i].getCells()[0].getEditable()==true){
							var oSel = oTable.getItems()[i].getCells()[0].getSelected();
							if (oSel == false){
								oTable.getItems()[i].getCells()[0].setSelected(true);
								var flag = 1;
							}
						}
					}
				}
			}else{
				for(var i=0; i<oTable.getMaxItemsCount(); i++){
					if(oTable.getItems()[i] != undefined){
						if (oTable.getItems()[i].getCells()[0].getEditable()==true){
							var oSel = oTable.getItems()[i].getCells()[0].getSelected();
							if (oSel == true){
								oTable.getItems()[i].getCells()[0].setSelected(false);
								var flag = 1;
							}
						}
					}
				}			
			}
		},
		//Send data to BackEnd
		onSubmit: function (evt) {
            var that = this;
			that.onOpenDialog("submit");
            // 判断checkData 时，与后台服务器是否完成正确通讯，如果没有，则不允许更新后台数据表
			if (that.bServerConnect == false) {
				MessageToast.show(this.oConfig.msgs[3].text);
				return;
			}
		    var sUrl = this.oConfig.serviceUrl;
			var oTable = that.getView().byId("table1");
			var oSelectedItems = oTable.getSelectedItems();
			// Check items selected
			var sFlag = "E";
			var vFlag = "S";
			for(var i=0; i<oTable.getMaxItemsCount(); i++){
				if(oTable.getItems()[i] != undefined){
					if (oTable.getItems()[i].getCells()[0].getEditable()==true){
						var oSel = oTable.getItems()[i].getCells()[0].getSelected();
						if (oSel == true){
						   sFlag = "";
						   var oText = oTable.getItems()[i].getCells()[1].getText();
						   if (oText !== ""){
							   vFlag = "";  
						   }
						}
					}
				}
			}
			if (sFlag == "E") {
				that.onCloseDialog();
				MessageToast.show(this.oConfig.msgs[4].text);
				return;
			}
			if (vFlag !== "S") {
				that.onCloseDialog();
				MessageToast.show(this.oConfig.msgs[5].text);
				return;
			}
			var vError;
			var oMess=[];	
			var oDataModel = new ODataModel(sUrl,true);
			for(var i=0; i<oTable.getMaxItemsCount(); i++){
				if(oTable.getItems()[i] != undefined){
					if ((oTable.getItems()[i].getCells()[0].getSelected()) == true){
						var oMatnr = oTable.getItems()[i].getCells()[2].getText().substring(0,18);
						var oZorderno = oTable.getItems()[i].getCells()[3].getText().substring(0,10);
						var oZorderq = oTable.getItems()[i].getCells()[4].getText().substring(0,20);
						var userID = this.onGetUserID();
						var oEntry = {Matnr:oMatnr,Zorderno:oZorderno,Zorderq:oZorderq,Zuser:userID,Zmode:"Urgent"};
						var batchChanges = [];
						batchChanges.push(oDataModel.createBatchOperation("ZMTM_UPLOADSet(Matnr='"+oMatnr+"')","PUT",oEntry));
						oDataModel.addBatchChangeOperations(batchChanges);												
					}
				}
			}
			var s01 = that.getView().getModel("i18n").getProperty("S01");
			oDataModel.submitBatch(function(data, response){				    
				    that.onCloseDialog();
				    for(var i=0; i<response.data.__batchResponses.length; i++){
						if (response.data.__batchResponses[i].response != undefined ){
							vError = 1;
						var sBody = response.data.__batchResponses[i].response.body;
						if(sBody){
							var arr=sBody.split("LENOVO-MTM");
							var Matnr = arr[1];
							var Error = arr[2];
						}else{
							var arr=response.split("LENOVO-MTM");
							var Matnr = arr[1];
							var Error = arr[2];
						}
						oMess.push({matnr:Matnr,mess:Error});
						}					
				    }
				    if (vError == 1){

						var oModel = new JSONModel({
							"data" : oMess
						});

						var oColumns = [
										new sap.m.Column({
											header : new sap.m.Label({
												text : "Error List"
											})
										}),
										new sap.m.Column({
											header : new sap.m.Label({
												text : "Return Message"
											})
										})
								];
								var oTemplate = new sap.m.ColumnListItem({
									cells : [
									     new sap.m.Text({
									    	 text : "{matnr}",
									     }),
									     new sap.m.Text({
									    	 text : "{mess}",
									     }),
									  ] 
								})
								var oMessTable = new sap.m.Table({columns : oColumns});
								oMessTable.setModel(oModel);
								oMessTable.bindItems("/data",oTemplate);
								
								var dialog = new Dialog({
									title: 'Error',
									type: 'Message',
									state: 'Error',
									content: oMessTable,
									beginButton: new Button({
										text: 'OK',
										press: function () {
											dialog.close();
										}
									}),
									afterClose: function() {
										dialog.destroy();
									}
								});
								that.getView().addDependent(dialog);
								dialog.open();
				    }else{
						var dialog = new Dialog({
							title: 'Success',
							type: 'Message',
							state: 'Success',
							content: new Text({
								text: s01
							}),
							beginButton: new Button({
								text: 'OK',
								press: function () {
									dialog.close();
								}
							}),	
							afterClose: function() {
								dialog.destroy();
							}
						});			
						that.getView().addDependent(dialog);
						dialog.open();
					 }
			   },function() {
				    MessageToast.show(that.oConfig.msgs[8].text);
				    that.onCloseDialog();
				    return;
		       },true)
		},
		onShowcorrect: function(oEvent){
			//设置checkbox
			this.getView().byId("selectall").setSelected(false);
			var SORTKEY = "Mno";
			var DESCENDING = false;
	        var GROUP = false;
		    var oList = this.getView().byId("table1");
		    var oBinding = oList.getBinding("items");
	        var aSorter = [];
			// you may use foo.bar.CustomSorter instead:
			aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			oBinding.sort(aSorter);
			
			var oTable = this.getView().byId("table1");
			
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply filters to binding
			var aFilters = [];
			var oFilter = new Filter({
				path : "Msg",
				operator : FilterOperator.EQ,
				value1 : ""
			});
		    aFilters.push(oFilter);
			
		    oBinding.filter(aFilters);
		},
		onShowerror: function(oEvent){
			//设置checkbox
			this.getView().byId("selectall").setSelected(false);
			var SORTKEY = "Mno";
			var DESCENDING = false;
	        var GROUP = false;
		    var oList = this.getView().byId("table1");
		    var oBinding = oList.getBinding("items");
	        var aSorter = [];
			// you may use foo.bar.CustomSorter instead:
			aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			oBinding.sort(aSorter);
			
			var oTable = this.getView().byId("table1");
			
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply filters to binding
			var aFilters = [];
			var oFilter = new Filter({
				path : "Msg",
				operator : FilterOperator.NE,
				value1 : ""
			});
		    aFilters.push(oFilter);
			
		    oBinding.filter(aFilters);
		},
		onAll: function(oEvent){
			//设置checkbox
			this.getView().byId("selectall").setSelected(false);
			//sort data
			var SORTKEY = "Mno";
			var DESCENDING = false;
	        var GROUP = false;
		    var oList = this.getView().byId("table1");
		    var oBinding = oList.getBinding("items");
	        var aSorter = [];
			// you may use foo.bar.CustomSorter instead:
			aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));
			oBinding.sort(aSorter);
			
			var oTable = this.getView().byId("table1");
			
//			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply filters to binding
			var aFilters = [];
			
		    oBinding.filter(aFilters);
		},
		onRefresh : function () {
			this.getView().byId("table1").getBinding("items").isInitial();
		},
		// 控制返回的时候清空fileUploader table1
		onNavBack1 : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			var bReplace = true;
			this.getRouter().navTo("master", {}, bReplace);
		    var FileUploader = this.getView().byId("fileUploader");
		    FileUploader.clear();
		    var Table = this.getView().byId("table1");
		    Table.destroyItems();
		    Table.getModel().refresh(true);
		    //clear the cache when pressing :ShowAll/ShowCorrect/ShowError 
		    var oBinding = Table.getBinding("items");
		    oBinding.oList.length = "0";
		    //返回时，设置checkbox
			this.getView().byId("selectall").setSelected(false);
		},
		//Get User ID
		onGetUserID: function(){
			var userID = new sap.ushell.Container.getService("UserInfo").getId().toString();
			return userID;
		},
		//Download Error Data for Upload 
		onDownload: function(){
	          var table = this.getView().byId("table1");
	          var oModel = table.getModel();
	          this.onDataExport(table, oModel);
	    },
	    onDataExport: function(table, oModel){
			 var cols = table.getColumns();
	         var items = table.getItems();
	         var cellId = null;
	         var cellObj = null;
	         var cellVal = null;
	         var headerColId = null;
	         var headerColObj = null;
	         var headerColVal = null;
	         var column = null;
	         var json = {}; var colArray = []; var itemsArray= [];
	         //push header column names to array
	         for(var j=0; j<cols.length;j++){
	                column = "";
	                column = cols[j];
	                headerColId = column.getAggregation("header").getId();
	                headerColObj = sap.ui.getCore().byId(headerColId);
	                headerColVal = headerColObj.getText();
	                if(headerColObj.getVisible()){
	                    json={name: headerColVal};
	                    colArray.push(json);
	                }
	            }
	            itemsArray.push(colArray);
	          //push table cell values to array
	          for (i = 0; i < items.length; i++) {
	              colArray = [];
	              cellId = "";   cellObj = "";  cellVal = "";
	              headerColId = null; headerColObj = null; headerColVal = null;
	              var item = items[i];
	                for(var j=0; j<cols.length;j++){
	                    cellId = item.getAggregation("cells")[j].getId();
	                    cellObj = sap.ui.getCore().byId(cellId);
	                    if(cellObj.getVisible()){
	                        if(cellObj instanceof sap.m.Text ||cellObj instanceof sap.m.Label ||cellObj instanceof sap.m.Link) cellVal = cellObj.getText();
	                        if(cellObj instanceof sap.m.ObjectNumber){
	                            var k = cellObj.getUnit();
	                            cellVal = cellObj.getNumber()+""+k;
	                        }
	                        if(cellObj instanceof sap.m.ObjectIdentifier){
	                            var objectIdentifierVal = "";
	                            if(cellObj.getTitle() != undefined && cellObj.getTitle() != "" && cellObj.getTitle() != null )
	                                objectIdentifierVal = cellObj.getTitle();
	                            if(cellObj.getText() != undefined && cellObj.getText() != "" && cellObj.getText() != null )
	                                objectIdentifierVal = objectIdentifierVal+" "+cellObj.getText();
	                      
	                            cellVal = objectIdentifierVal;
	                        }
	                        if(cellObj instanceof sap.ui.core.Icon){
	                            if(cellObj.getTooltip() != undefined && cellObj.getTooltip() != "" && cellObj.getTooltip() != null )
	                            cellVal = cellObj.getTooltip();
	                        }
	                        if(j==0){
	                            json={ name:  "\r"+cellVal};
	                        }
	                        else
	                        {
	                            json={ name:  cellVal};
	                        }
	                        colArray.push(json);
	                    }
	                }
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
	          oExport.saveFile("Error-Data").always(function() {
	                this.destroy();
	            });
       },
	});

});