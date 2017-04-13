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
	"sap/ui/model/odata/ODataModel",
	"sap/m/TablePersoController",
	"sap/ui/model/resource/ResourceModel"
], function(BaseController, JSONModel, Export, ExportTypeCSV, Filter, FilterOperator, Device,Table, MessageToast,jQuery,ODataModel,TablePersoController,ResourceModel) {
	"use strict";

	return BaseController.extend("lenovo.mtm.controller.Master", {   
		onInit: function() {	
			var data=[];
			// set the SettingFields model
			var oPath = jQuery.sap.getModulePath("lenovo.mtm");
			var oFieldModel = new sap.ui.model.json.JSONModel();
			oFieldModel.loadData(oPath + "/model/SettingFields.json" , {
				bAsync:false
			});
			this.setModel(oFieldModel,'fieldData');	
			//**Begin**Multi Upload**// 
			this.oUploadModel = new JSONModel({
				data: []
			});
			//Limit the input line 
			this.oUploadModel.setSizeLimit(5000);			
			//**End**Multi Upload**// 
			
			//This Model is for Authority Control
			var ouserModel = new JSONModel();
				ouserModel.setData({
					               Field1:true,//Query
					               Field2:true,//Download
					               Field3:true,//Urgent KPI Report
					               Field4:true,//Urgent Model
					               Field5:true,//ODM BOM
					               Field6:true,//ODM Quotation
					               Field7:true,//WW ME
					               Field8:true,//Issue Log Report
					              });
				
			this.setModel(ouserModel, 'userData');
			//get user ID
			var userID = this.onGetUserID();			
			//check user ID Authority though odata
			this.checkUser(userID);
			
			if(sap.ui.Device.system.phone==true){
				//Initialization Event
				this._onMasterMatched();
			}						
			//**Begin**Multi input**//
			var oView = this.getView();
			if (sap.ui.Device.system.phone==true){
				var oMultiInput2 = oView.byId("Matnr_m"); 
			}else{
			    var oMultiInput2 = oView.byId("Matnr");
			};
			
			//******* MultiInput 2 - add asynchronous validator
		    oMultiInput2.addValidator(function(args){
		        jQuery.sap.require("sap.m.MessageBox");
		        sap.m.MessageBox.confirm("Add token \"" + args.text + "\"?", {
			        onClose: function(oAction) {
			          if (oAction === sap.m.MessageBox.Action.OK){
			            var oToken = new sap.m.Token({key: args.text, text: args.text});
			            args.asyncCallback(oToken);
			          }
			          else{
			            args.asyncCallback(null);
			          }
			        },
			        title: "add Token"
			        });
		       
		        return sap.m.MultiInput.WaitForAsyncValidation;
		    });
		    //**End**Multi input**//
		    
		    //Process ComboBox data
		    this.oSearchModel = new JSONModel({
				data: []
			});
			//Limit the input line 
			this.oSearchModel.setSizeLimit(5000);
			this.setModel(this.oSearchModel, "SearchData");
			this.oDroplist(userID);
			//set visible
			this.onSetVisible();
		},
		//if the Device is phone,hide the button
		onSetVisible: function(){
			if (sap.ui.Device.system.phone==true){
				var Qu = this.getView().byId("Query");//Query
				var DL = this.getView().byId("Download");//Download
				var ST = this.getView().byId("Setting");//SettingFields
				var table1 = this.getView().byId("ItemTable");//GridTable
				var filter1 = this.getView().byId("filter1");//MTM No.(tokens)
				var oUpload1 = this.getView().byId("Object1");//Upload1
				var oUpload2 = this.getView().byId("Object2");//Upload2
				var oUpload3 = this.getView().byId("Object3");//Upload3
				var oUpload4 = this.getView().byId("Object4");//Upload4
				Qu.setVisible(false);
				DL.setVisible(false);
				ST.setVisible(false);
				table1.setVisible(false);
				filter1.setVisible(false);
				oUpload1.setVisible(false);
				oUpload2.setVisible(false);
				oUpload3.setVisible(false);
				oUpload4.setVisible(false);
				//防止手机屏幕大小导致文本错行
				var oPanel1 = this.getView().byId("Panel1");//Panel1
				oPanel1.setHeaderText("Search Screen");
				var oPanel2 = this.getView().byId("Panel2");//Panel2
				oPanel2.setHeaderText("Data Display");
				var oSearch = this.getView().byId("Search");//Search Text
				oSearch.setText("");
				}else{
					
					var table2 = this.getView().byId("ItemTable_m");//.M Table
					var filter2 = this.getView().byId("filter2");//MTM No.(Input)
					
					table2.setVisible(false);
					filter2.setVisible(false);
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
			this.getView().byId("ItemTable").setVisibleRowCount(oRows);
			this.onSetColumns();
		},
		onSetColumns: function(){
			var Field2 = "";
			var Field3 = "";
			var Field4 = "";
			var Field5 = "";
			var Field6 = "";
			var Field7 = "";
			var Field8 = "";
			var Field9 = "";
			var Field10 = "";
			var Field11 = "";
			var Field12 = "";
			var Field13 = "";
			var Field14 = "";
			var Field15 = "";
			var Field16 = "";
			var Field17 = "";
			var Field18 = "";
			var Field19 = "";
			var Field20 = "";
			var Field21 = "";
			var Field22 = "";
			var Field23 = "";
			var Field24 = "";
			var Field25 = "";
			var userId = this.onGetUserID();
			var that = this;
			var oConfig = this.getOwnerComponent().getMetadata().getConfig();
		    var sUrl = oConfig.serviceUrl;
			var useridOdata = new sap.ui.model.odata.ODataModel(sUrl,true);
			var filter = "ZMTM_FIELDSet?$filter= Zuser eq '" + userId +"'";
			useridOdata.read(filter,null,null,false,
					function(oData){
				if(oData.results.length !== 0){
					
				  //要与table的显示顺序一致	
				  Field2 = oData.results[0].Zmfgrs;//MFG Status
				  Field3 = oData.results[0].Zors;//Order Status
				  Field4 = oData.results[0].Zepo;//Process Owner
				  Field5 = oData.results[0].Zumf;//Urgent Flag
				  Field6 = oData.results[0].Zorderno;//SO No.
				  Field7 = oData.results[0].Zorderq;//SO QTY
				  Field8 = oData.results[0].Zmfgd;//MFG Date
				  Field9 = oData.results[0].Zmfgtg;//Target Date
				  Field10 = oData.results[0].Zlwc;//ME Comments
				  Field11 = oData.results[0].Zio;//Issue Owner
				  Field12 = oData.results[0].Zvendor;//Vendor
				  Field13 = oData.results[0].Extwg;//Product Name
				  Field14 = oData.results[0].Zmfgps;//Plant Status
				  Field15 = oData.results[0].Zdchains;//Sales Status
				  Field16 = oData.results[0].Zaccountry;//Country
				  Field17 = oData.results[0].Zqd;//QD
				  Field18 = oData.results[0].Zeowdate;//EOW
				  Field19 = oData.results[0].Zad;//AD
				  Field20 = oData.results[0].Zmfgbc;//BOM Comments
				  Field21 = oData.results[0].Zmfgpc;//Price Comments
				  Field22 = oData.results[0].Zrtmd;//Request MFG Date
				  Field23 = oData.results[0].Zmfgbom;//BOM Date
				  Field24 = oData.results[0].Zmfgpcd;//Price Date
				  Field25 = oData.results[0].Zpenday;//Pending Day
				  if(Field2 == "X"){
					  that.getView().byId("ItemTable").getColumns()[1].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[1].setProperty("visible",false);
				  }
				  if(Field3 == "X"){
					  that.getView().byId("ItemTable").getColumns()[2].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[2].setProperty("visible",false);
				  }
				  if(Field4 == "X"){
					  that.getView().byId("ItemTable").getColumns()[3].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[3].setProperty("visible",false);
				  }
				  if(Field5 == "X"){
					  that.getView().byId("ItemTable").getColumns()[4].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[4].setProperty("visible",false);
				  }
				  if(Field6 == "X"){
					  that.getView().byId("ItemTable").getColumns()[5].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[5].setProperty("visible",false);
				  }
				  if(Field7 == "X"){
					  that.getView().byId("ItemTable").getColumns()[6].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[6].setProperty("visible",false);
				  }
				  if(Field8 == "X"){
					  that.getView().byId("ItemTable").getColumns()[7].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[7].setProperty("visible",false);
				  }
				  if(Field9 == "X"){
					  that.getView().byId("ItemTable").getColumns()[8].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[8].setProperty("visible",false);
				  }
				  if(Field10 == "X"){
					  that.getView().byId("ItemTable").getColumns()[9].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[9].setProperty("visible",false);
				  }
				  if(Field11 == "X"){
					  that.getView().byId("ItemTable").getColumns()[10].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[10].setProperty("visible",false);
				  }
				  if(Field12 == "X"){
					  that.getView().byId("ItemTable").getColumns()[11].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[11].setProperty("visible",false);
				  }
				  if(Field13 == "X"){
					  that.getView().byId("ItemTable").getColumns()[12].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[12].setProperty("visible",false);
				  }
				  if(Field14 == "X"){
					  that.getView().byId("ItemTable").getColumns()[13].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[13].setProperty("visible",false);
				  }
				  if(Field15 == "X"){
					  that.getView().byId("ItemTable").getColumns()[14].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[14].setProperty("visible",false);
				  }
				  if(Field16 == "X"){
					  that.getView().byId("ItemTable").getColumns()[15].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[15].setProperty("visible",false);
				  }
				  if(Field17 == "X"){
					  that.getView().byId("ItemTable").getColumns()[16].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[16].setProperty("visible",false);
				  }
				  if(Field18 == "X"){
					  that.getView().byId("ItemTable").getColumns()[17].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[17].setProperty("visible",false);
				  }
				  if(Field19 == "X"){
					  that.getView().byId("ItemTable").getColumns()[18].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[18].setProperty("visible",false);
				  }
				  if(Field20 == "X"){
					  that.getView().byId("ItemTable").getColumns()[19].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[19].setProperty("visible",false);
				  }
				  if(Field21 == "X"){
					  that.getView().byId("ItemTable").getColumns()[20].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[20].setProperty("visible",false);
				  }
				  if(Field22 == "X"){
					  that.getView().byId("ItemTable").getColumns()[21].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[21].setProperty("visible",false);
				  }
				  if(Field23 == "X"){
					  that.getView().byId("ItemTable").getColumns()[22].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[22].setProperty("visible",false);
				  }
				  if(Field24 == "X"){
					  that.getView().byId("ItemTable").getColumns()[23].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[23].setProperty("visible",false);
				  }
				  if(Field25 == "X"){
					  that.getView().byId("ItemTable").getColumns()[24].setProperty("visible",true);
				  } else {
					  that.getView().byId("ItemTable").getColumns()[24].setProperty("visible",false);
				  }
				}else{
					that.getView().byId("ItemTable").getColumns()[1].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[2].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[3].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[4].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[5].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[6].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[7].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[8].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[9].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[10].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[11].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[12].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[13].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[14].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[15].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[16].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[17].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[18].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[19].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[20].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[21].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[22].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[23].setProperty("visible",true);
					that.getView().byId("ItemTable").getColumns()[24].setProperty("visible",true);
				}
			})
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
		checkUser: function(userID){
			//1. sent ID to backend system though odata then get the result,
			//2. then set the property of JSON model DisplayData to maintain the display of the control in view			
			var Field1;
			var Field2;
			var Field3;
			var Field4;
			var Field5;
			var Field6;
			var Field7;
			var Field8;
			
			var oConfig = this.getOwnerComponent().getMetadata().getConfig();
		    var sUrl = oConfig.serviceUrl;
			var useridOdata = new sap.ui.model.odata.ODataModel(sUrl,true);
			var filter = "ZMTM_USERSet?$filter= Userid eq '" + userID +"'";
			useridOdata.read(filter,null,null,false,
					function(oData){
				if(oData.results.length !== 0){
				  Field1 = oData.results[0].Field1;
				  Field2 = oData.results[0].Field2;
				  Field3 = oData.results[0].Field3;
				  Field4 = oData.results[0].Field4;
				  Field5 = oData.results[0].Field5;
				  Field6 = oData.results[0].Field6;
				  Field7 = oData.results[0].Field7;
				  Field8 = oData.results[0].Field8;
				}else{
					MessageToast.show("You have no authority to display data");
					return;
				}
			});
			var ouserModel = this.getModel("userData");
			if(Field1 == "X"){
				ouserModel.setProperty("/Field1", true);
			} else {
				ouserModel.setProperty("/Field1", false);	
			}
			if(Field2 == "X"){
				ouserModel.setProperty("/Field2", true);
			} else {
				ouserModel.setProperty("/Field2", false);	
			}
			if(Field3 == "X"){
				ouserModel.setProperty("/Field3", true);
			} else {
				ouserModel.setProperty("/Field3", false);	
			}
			if(Field4 == "X"){
				ouserModel.setProperty("/Field4", true);
			} else {
				ouserModel.setProperty("/Field4", false);	
			}
			if(Field5 == "X"){
				ouserModel.setProperty("/Field5", true);
			} else {
				ouserModel.setProperty("/Field5", false);	
			}
			if(Field6 == "X"){
				ouserModel.setProperty("/Field6", true);
			} else {
				ouserModel.setProperty("/Field6", false);	
			}
			if(Field7 == "X"){
				ouserModel.setProperty("/Field7", true);
			} else {
				ouserModel.setProperty("/Field7", false);	
			}
			if(Field8 == "X"){
				ouserModel.setProperty("/Field8", true);
			} else {
				ouserModel.setProperty("/Field8", false);	
			}
			
		},
		
		// NavTo upload view
		handlePress1: function(oEvent){
			this.getRouter().navTo("Upload", true);},
		// NavTo upload1 view
		handlePress2: function(oEvent){
			this.getRouter().navTo("Upload1", true);},	
		// NavTo upload2 view
		handlePress3: function(oEvent){
			this.getRouter().navTo("Upload2", true);},
		// NavTo upload3 view
	    handlePress4: function(oEvent){
			this.getRouter().navTo("Upload3", true);},			
		// NavTo Report view
		onDisplay: function(oEvent){
			this.getRouter().navTo("Report", true);},
		// NavTo Report view
		onDisplay1: function(oEvent){
			this.getRouter().navTo("Issue", true);},
		
	    //Get User ID
		onGetUserID: function(){
			var userID = new sap.ushell.Container.getService("UserInfo").getId().toString();
			return userID;	
		},
		//MTM No. Search
		onValueHelp: function(oEvent) {

			if (!this._uploadCard) {
				this._initializeCard();
			}
			this._uploadCard.openBy(oEvent.getSource());		
		},
		_initializeCard: function() {
			var oView = this.getView();
			this._uploadCard = sap.ui.xmlfragment("lenovo.mtm.view.upload",this);
			oView.addDependent(this._uploadCard);
		},
		//Download template for MTM No. Multi
		onDownloadMultiTemplate: function(){
			var oHost = window.location.host;
			var url = "http://" + oHost + "/sap/bc/ui5_ui5/sap/zmm_mtm_001/templates/multiple.csv"
			window.location = url;
		},
		
		//Upload Multiple Template
		handleUploadPress: function(){
			var oFileUploader = sap.ui.getCore().byId("fileUploader");
			// 检查是否选中文件
			if (!oFileUploader.getValue()) {
				var oConfig = this.getOwnerComponent().getMetadata().getConfig();
				MessageToast.show(oConfig.msgs[1].text);
				return;
			}
			// 检查文档是否为空
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			if (file.size == 0) {
				var oConfig = this.getOwnerComponent().getMetadata().getConfig();
				MessageToast.show(oConfig.msgs[2].text);
				return;
			}
			oFileUploader.upload();
		    //clear tabel JSON model
		    var NewEntry = [];
		    var uploadData = this.oUploadModel.getData();
			uploadData.data = NewEntry;
			this.oUploadModel.setData(uploadData);
			var sFlag = this.onCheckFile(file.name);
			if (sFlag !== "E") {

			} else {
				return
			}
			this.onHandleFileUpload(this, file);
		},
		//Check File is CSV or not
		onCheckFile: function(fileName) {
			var aArray = fileName.split(".");
			var sType = aArray[aArray.length - 1];
			if (sType.toUpperCase() !== "CSV") {
				var oConfig = this.getOwnerComponent().getMetadata().getConfig();
				MessageToast.show(oConfig.msgs[0].text);
				aArray = undefined;
				sType = undefined;
				var sFlag = "E";
				return sFlag;
			}
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
		handleUploadComplete: function(){
			//Put the csv data into JSON model
			var uploadData = this.oUploadModel.getData();
			var uploadEntries = uploadData.data;
			var child = {};
			var Input = this.getView().byId("Matnr");    
			var Multi = [];
			for(var i = 1; i< this.pushResult.length-1; i++){
				  var k= uploadEntries.length;
				  child = {
					  Mno: this.pushResult[i][0],
				  };	
				  var Mno = child.Mno;
                Multi.push(new sap.m.Token({text: Mno, key: Mno}));
				uploadEntries[k] = child;
			};
		    var Ebeln = Input.setTokens(
		        Multi
		    );
		},
		//Delete Multi for MTM No.
		onDeletemulti: function(){
			var Input = this.getView().byId("Matnr");
			var Ebeln = Input.removeAllTokens();
		},		
		//取默认的初始化数据
		onQuery: function(oEvent){	
			var data=[];
			
			var sUrl = "/sap/opu/odata/sap/ZMMPP_MTM_001_SRV/";
			var sRead = "/ZMTM_INFOSet";
			this.oDataModel = new ODataModel(sUrl,true);
			var that = this;
			var aFilter = [];
			// Zuser
	     	var Zuser = this.onGetUserID();
	     	var oFilter = new Filter("Zuser",FilterOperator.EQ, Zuser);
	     	if (Zuser != ''){aFilter.push(oFilter);}
	     	
			var child = {};
			
			that.oDataModel.read(sRead, {
				filters : aFilter,
				async : false,
				success : function(oData, response){
					for( var j = 0; j < oData.results.length; j++){
						//if have Date type field,pls convert data type
						//var d = new Date( oData.results[j].Aedat );
						//var oAedat = d.oFormatOptions.getFullYear() + '-' + (d.oFormatOptions.getMonth() + 1) + '-' + d.oFormatOptions.getDate();

						child = {							    
								Zmatnr: oData.results[j].Matnr,
								Zmfgrs: oData.results[j].Zmfgrs,
								Zors: oData.results[j].Zors,
								Zepo: oData.results[j].Zepo,
								Zumf: oData.results[j].Urgentflag,
								Zorderno: oData.results[j].Zorderno,
								Zorderq: oData.results[j].Zorderq,
								Zmfgd: oData.results[j].Zmfgd,
								Zmfgtg: oData.results[j].Zmfgtg,
								Zlwc: oData.results[j].Zlwc,
								Zio: oData.results[j].Zio,
								Zvendor: oData.results[j].Zvendor,								
								Zextwg: oData.results[j].Extwg,
								Zmfgps: oData.results[j].Zmfgps,
								Zdchains: oData.results[j].Zdchains,
								Zaccountry: oData.results[j].Zaccountry,
								Zqd: oData.results[j].Zqd,
								Zeowdate: oData.results[j].Zeowdate,
								Zad: oData.results[j].Zad,
								Zmfgbc: oData.results[j].Zmfgbc,
								Zmfgpc: oData.results[j].Zmfgpc,
								Zrtmd: oData.results[j].Zrtmd,
								Zmfgbom: oData.results[j].Zmfgbom,
								Zmfgpcd: oData.results[j].Zmfgpcd,
								Zpenday: oData.results[j].Zpenday
							};
						data.push(child);
					  }		
		        	var oQueryModel = new JSONModel(data);
					that.setModel(oQueryModel, 'oData');
				      },
				error : function(error) {
					var s04 = that.getModel("i18n").getProperty("S04");
		       	      MessageToast.show(s04);
				} 
			})
        },        
        //Search For data
        onSearch:function(oEvent){
           if (this.oValue == 0 || this.oValue == undefined){
        	  var aFilter = [];
 	     	  var oView = this.getView();
 	     			
 	     	  if (sap.ui.Device.system.phone==true){
 	     		    var oSearchField = oView.byId("Matnr_m");
 				}else{
 					var oSearchField = oView.byId("Matnr");
 				};
 	     	   var Matnr = oSearchField.getTokens();
 	     	   $.each(Matnr, function (i, token) {
 	     		   aFilter.push(
 	     			  new sap.ui.model.Filter({ 
 	     			  path:"Matnr",
 	     			  operator:FilterOperator.EQ,
 	     			  value1:token.getKey(),
 	                  })
 	     			)
 	     			}
 	     		)
 	     	   // Brand     				
 	     	   var oSearchField = oView.byId("Zbrand_fb");
 	     	   var Brand = oSearchField.getValue();
 	     	   var oFilter2 = new Filter("Zbrand",FilterOperator.EQ, Brand);
 	     	   if (Brand != ''){aFilter.push(oFilter2);}
 	     	   // Group     	
 	     	   var oSearchField = oView.byId("Zgroup_fb");
 	     	   var Group = oSearchField.getValue();
 	     	   var oFilter3 = new Filter("Zbugr",FilterOperator.EQ, Group);
 	     	   if (Group != ''){aFilter.push(oFilter3);}
 	     	   // Requestor
 	     	   var oSearchField = oView.byId("Zreid_fb");
 	     	   var Requestor = oSearchField.getValue();
 	     	   var oFilter4 = new Filter("Zreid",FilterOperator.EQ, Requestor);
 	     	   if (Requestor != ''){aFilter.push(oFilter4);}
 	     	   // Geo
 	     	   var oSearchField = oView.byId("Zgeo_fb");
 	    	   var Geo = oSearchField.getValue();
 	    	   var oFilter5 = new Filter("Zgeo",FilterOperator.EQ, Geo);
 	    	   if (Geo != ''){aFilter.push(oFilter5);}
 	     	   // Vendor
 	    	   var oSearchField = oView.byId("Zvendor_fb");
 	     	   var Vendor = oSearchField.getValue();
 	     	   var oFilter6 = new Filter("Zvendor",FilterOperator.EQ, Vendor);
 	     	   if (Vendor != ''){aFilter.push(oFilter6);}
 	     	   // MFGstatus
 	     	   var oSearchField = oView.byId("Zmfgrs_fb");
 	    	   var MFGstatus = oSearchField.getValue();
 	    	   var oFilter7 = new Filter("Zmfgrs",FilterOperator.EQ, MFGstatus);
 	    	   if (MFGstatus != ''){aFilter.push(oFilter7);}
 	     	   // E2Eowner
 	    	   var oSearchField = oView.byId("Zepo_fb");
 	     	   var E2Eowner = oSearchField.getValue();
 	     	   var oFilter8 = new Filter("Zepo",FilterOperator.EQ, E2Eowner);
 	     	   if (E2Eowner != ''){aFilter.push(oFilter8);}
 	     	   // Pendingdays
 	     	   var oSearchField = oView.byId("Zpenday_fb");
 	    	   var Pendingdays = oSearchField.getValue();
 	    	   var oFilter9 = new Filter("Zpenday",FilterOperator.EQ, Pendingdays);
 	    	   if (Pendingdays != ''){aFilter.push(oFilter9);}
 	     	   // ProductName
 	    	   var oSearchField = oView.byId("Zextwg_fb");
 	     	   var ProductName = oSearchField.getValue();
 	     	   var oFilter10 = new Filter("Extwg",FilterOperator.Contains, ProductName);
 	     	   if (ProductName != ''){aFilter.push(oFilter10);}
 	     	   // Zuser
 	     	   var Zuser = this.onGetUserID();
 	     	   var oFilter11 = new Filter("Zuser",FilterOperator.EQ, Zuser);
 	     	   if (Zuser != ''){aFilter.push(oFilter11);}
 	     	   // Zdatef
 	     	   var Zdatef = oView.byId("Zdatef_fb").getValue();
 	     	   var oFilter12 = new Filter("Zdatef",FilterOperator.EQ, Zdatef);
 	     	   if (Zdatef != ''){aFilter.push(oFilter12);}
 	     	   // Zdatet
 	     	   var Zdatet = oView.byId("Zdatet_fb").getValue();
 	     	   var oFilter13 = new Filter("Zdatet",FilterOperator.EQ, Zdatet);
 	     	   if (Zdatet != ''){aFilter.push(oFilter13);}
 	     	   // Urgentflag
 	     	   var Urgentflag = oView.byId("Zumf_fb").getValue();
 	     	   var oFilter14 = new Filter("Urgentflag",FilterOperator.EQ, Urgentflag);
 	     	   if (Urgentflag != ''){aFilter.push(oFilter14);}
 	     	   
 	     	   //check search field 
 	     	   if (aFilter.length == 1){
 	     		  var s03 = this.getModel("i18n").getProperty("S03");
 	       	      MessageToast.show(s03);
 	       	      return;
 	     	   }else{
 	     		// Zuser
 	         	   var Zmode = "Search";
 	         	   var oFilter15 = new Filter("Zmode",FilterOperator.EQ, Zmode);
 	         	   if (Zmode != ''){aFilter.push(oFilter15);}
 	     	   }
     	   //根据选择条件重新查询ECC数据
     	    var data=[];
			
			var sUrl = "/sap/opu/odata/sap/ZMMPP_MTM_001_SRV/";
			var sRead = "/ZMTM_INFOSet";
			this.oDataModel = new ODataModel(sUrl,true);
			var that = this;
	     	
			var child = {};
			
			that.oDataModel.read(sRead, {
				filters : aFilter,
				async : false,
				success : function(oData, response){
					for( var j = 0; j < oData.results.length; j++){
						//if have Date type field,pls convert data type
						//var d = new Date( oData.results[j].Aedat );
						//var oAedat = d.oFormatOptions.getFullYear() + '-' + (d.oFormatOptions.getMonth() + 1) + '-' + d.oFormatOptions.getDate();

						child = {							    
								Zmatnr: oData.results[j].Matnr,
								Zmfgrs: oData.results[j].Zmfgrs,
								Zors: oData.results[j].Zors,
								Zepo: oData.results[j].Zepo,
								Zumf: oData.results[j].Urgentflag,
								Zorderno: oData.results[j].Zorderno,
								Zorderq: oData.results[j].Zorderq,
								Zmfgd: oData.results[j].Zmfgd,
								Zmfgtg: oData.results[j].Zmfgtg,
								Zlwc: oData.results[j].Zlwc,
								Zio: oData.results[j].Zio,
								Zvendor: oData.results[j].Zvendor,								
								Zextwg: oData.results[j].Extwg,
								Zmfgps: oData.results[j].Zmfgps,
								Zdchains: oData.results[j].Zdchains,
								Zaccountry: oData.results[j].Zaccountry,
								Zqd: oData.results[j].Zqd,
								Zeowdate: oData.results[j].Zeowdate,
								Zad: oData.results[j].Zad,
								Zmfgbc: oData.results[j].Zmfgbc,
								Zmfgpc: oData.results[j].Zmfgpc,
								Zrtmd: oData.results[j].Zrtmd,
								Zmfgbom: oData.results[j].Zmfgbom,
								Zmfgpcd: oData.results[j].Zmfgpcd,
								Zpenday: oData.results[j].Zpenday
							};
						data.push(child);
					  }		
		        	var oQueryModel = new JSONModel(data);
					that.setModel(oQueryModel, 'oData');
				      },
				error : function(error) {
					var s04 = that.getModel("i18n").getProperty("S04");
		       	      MessageToast.show(s04);
				} , 
			});	
           }else {
        	   var s02 = this.getModel("i18n").getProperty("S02");
        	   MessageToast.show(s02);
           }
           that.getView().byId("Panel1").setExpanded(false);
           },
     	//Get ComboBox data下拉框取数
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
        //日期检查
        handleChange: function (oEvent){
        	var s02 = this.getModel("i18n").getProperty("S02");
        	var oDP = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			if (bValid) {
				this.oValue = 0;
				oDP.setValueState(sap.ui.core.ValueState.None);
					if ((oDP.getId() == 'application-ZMM_MTM001-DISPLAY-component---master--Zdatef_fb') && (oDP.getId() != '')){
						var oDP1 = this.getView().byId("Zdatet_fb").getValue();
						if((sValue > oDP1) && (oDP1 != '')){
							this.oValue = 1;
							MessageToast.show(s02);
						}
					}
					if ((oDP.getId() == 'application-ZMM_MTM001-DISPLAY-component---master--Zdatet_fb') && (oDP.getId() != '')){
						var oDP2 = this.getView().byId("Zdatef_fb").getValue();
						if(sValue < oDP2){
							this.oValue = 1;
							MessageToast.show(s02);
						}
					}
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
				oDP.focus(); 
				this.oValue = 1;
			}
        },
        onOpenDialog: function(iv_action) {
			this.getOwnerComponent().Dialog.open(this.getView(), this.oConfig, iv_action);
		},
		onCloseDialog: function() {
			this.getOwnerComponent().Dialog.onCloseDialog();
		},
		//针对phone设备
		onPress: function(oEvent) {
			this.getRouter().navTo("Object" , {
				objectId: oEvent.getSource().getBindingContext().getProperty("Matnr")
			});
		},
		//Download Data for Itemtable
        onDownload: function(){	
        	this.onOpenDialog("download");
        	var oModel = this.getView().byId("ItemTable").getModel("oData");
        	if(oModel == undefined ){
        		MessageToast.show("No data to download !!!");
        		this.onCloseDialog();
        		return;
        	} 
        	var DownloadData = this.getView().byId("ItemTable").getModel("oData").getData();
            this.onDataExport(DownloadData , oModel);
        },
		onDataExport: function(DownloadData , oModel){
			
			jQuery.sap.require("sap.ui.core.util.Export");
			jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
	         var json = {}; 
	         var colArray = []; 
	         var itemsArray= [];
	         
	         //push header column names to array
	         json={name: "MTM"};
	         colArray.push(json);
	         json={name: "MFG Status"};
	         colArray.push(json);
	         json={name: "Order Status"};
	         colArray.push(json);
	         json={name: "Process Owner"};
	         colArray.push(json);
	         json={name: "Urgent Flag"};
	         colArray.push(json);
	         json={name: "SO No."};
	         colArray.push(json);
	         json={name: "SO QTY"};
	         colArray.push(json);
	         json={name: "MFG Date"};
	         colArray.push(json);
	         json={name: "Target Date"};
	         colArray.push(json);
	         json={name: "ME Comments"};
	         colArray.push(json);
	         json={name: "Issue Owner"};
	         colArray.push(json);
	         json={name: "Vendor"};
	         colArray.push(json);
	         json={name: "Product Name"};
	         colArray.push(json);
	         json={name: "Plant Status"};
	         colArray.push(json);
	         json={name: "Sales Status"};
	         colArray.push(json);
	         json={name: "Country"};
	         colArray.push(json);
	         json={name: "QD"};
	         colArray.push(json);
	         json={name: "EOW"};
	         colArray.push(json);
	         json={name: "AD"};
	         colArray.push(json);
	         json={name: "BOM Comments"};
	         colArray.push(json);
	         json={name: "Price Comments"};
	         colArray.push(json);
	         json={name: "Request MFG Date"};
	         colArray.push(json);
	         json={name: "BOM Date"};
	         colArray.push(json);
	         json={name: "Price Date"};
	         colArray.push(json);
	         json={name: "Pending Day"};
	         colArray.push(json);
	         
	         itemsArray.push(colArray);
	         
	          //push table cell values to array
	          for (i = 0; i < DownloadData.length; i++) {
	              colArray = [];
	              
	              json={name: "\r"+DownloadData[i].Zmatnr};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgrs};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zors};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zepo};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zumf};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zorderno};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zorderq};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgd};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgtg};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zlwc};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zio};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zvendor};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zextwg};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgps};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zdchains};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zaccountry};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zqd};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zeowdate};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zad};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgbc};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgpc};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zrtmd};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgbom};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zmfgpcd};
	       	      colArray.push(json);
	       	      json={name: DownloadData[i].Zpenday};
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
		onOpenedDialog : function () {
            // create dialog via fragment factory
		if (!this.Dialog) {
        	this.Dialog = sap.ui.xmlfragment("lenovo.mtm.view.Dialog",this);
        	this.getView().addDependent(this.Dialog); 
		      }
         this.Dialog.open();
         //根据后端的Z表来判断列的属性
         var oTable1 = this.getView().byId("ItemTable");
         var oTable2 = sap.ui.getCore().byId('DialogTable');
         for(var i=0; i<oTable2.getMaxItemsCount(); i++){
        	 if(oTable2.getItems()[i] != undefined){
        		 if (oTable2.getItems()[i].getCells()[0].getEditable()==true){
        			 var j = i + 1;
        			 var oSel = oTable1.getColumns()[j].getProperty("visible");
        			 if(oSel == true){
        				 oTable2.getItems()[i].getCells()[0].setSelected(true);
        			 }
        		 }
        	 }
         }
        },
        onSaveDialog : function () {
    	    var that = this;
			var Field2 = "";
			var Field3 = "";
			var Field4 = "";
			var Field5 = "";
			var Field6 = "";
			var Field7 = "";
			var Field8 = "";
			var Field9 = "";
			var Field10 = "";
			var Field11 = "";
			var Field12 = "";
			var Field13 = "";
			var Field14 = "";
			var Field15 = "";
			var Field16 = "";
			var Field17 = "";
			var Field18 = "";
			var Field19 = "";
			var Field20 = "";
			var Field21 = "";
			var Field22 = "";
			var Field23 = "";
			var Field24 = "";
			var Field25 = "";
			var sUrl = this.oConfig.serviceUrl;
			var userId = this.onGetUserID();
			var oTable = sap.ui.getCore().byId('DialogTable');
			for(var i=0; i<oTable.getMaxItemsCount(); i++){
				if(oTable.getItems()[i] != undefined){
					if (oTable.getItems()[i].getCells()[0].getEditable()==true){
						var oSel = oTable.getItems()[i].getCells()[0].getSelected();
						if (oSel == true){
						   var oText = oTable.getItems()[i].getCells()[1].getText();
						   if(oText == "MFG Status"){
							   that.getView().byId("ItemTable").getColumns()[1].setProperty("visible",true);
							   Field2 = "X";
						   }
						   if(oText == "Order Status"){
							   that.getView().byId("ItemTable").getColumns()[2].setProperty("visible",true);
							   Field3 = "X";
						   }
						   if(oText == "Process Owner"){
							   that.getView().byId("ItemTable").getColumns()[3].setProperty("visible",true);
							   Field4 = "X";
						   }
						   if(oText == "Urgent Flag"){
							   that.getView().byId("ItemTable").getColumns()[4].setProperty("visible",true);
							   Field5 = "X";
						   }
						   if(oText == "SO No."){
							   that.getView().byId("ItemTable").getColumns()[5].setProperty("visible",true);
							   Field6 = "X";
						   }
						   if(oText == "SO QTY"){
							   that.getView().byId("ItemTable").getColumns()[6].setProperty("visible",true);
							   Field7 = "X";
						   }
						   if(oText == "MFG Date"){
							   that.getView().byId("ItemTable").getColumns()[7].setProperty("visible",true);
							   Field8 = "X";
						   }
						   if(oText == "Target Date"){
							   that.getView().byId("ItemTable").getColumns()[8].setProperty("visible",true);
							   Field9 = "X";
						   }
						   if(oText == "ME Comments"){
							   that.getView().byId("ItemTable").getColumns()[9].setProperty("visible",true);
							   Field10 = "X";
						   }
						   if(oText == "Issue Owner"){
							   that.getView().byId("ItemTable").getColumns()[10].setProperty("visible",true);
							   Field11 = "X";
						   }
						   if(oText == "Vendor"){
							   that.getView().byId("ItemTable").getColumns()[11].setProperty("visible",true);
							   Field12 = "X";
						   }
						   if(oText == "Product Name"){
							   that.getView().byId("ItemTable").getColumns()[12].setProperty("visible",true);
							   Field13 = "X";
						   }
						   if(oText == "Plant Status"){
							   that.getView().byId("ItemTable").getColumns()[13].setProperty("visible",true);
							   Field14 = "X";
						   }
						   if(oText == "Sales Status"){
							   that.getView().byId("ItemTable").getColumns()[14].setProperty("visible",true);
							   Field15 = "X";
						   }
						   if(oText == "Country"){
							   that.getView().byId("ItemTable").getColumns()[15].setProperty("visible",true);
							   Field16 = "X";
						   }
						   if(oText == "QD"){
							   that.getView().byId("ItemTable").getColumns()[16].setProperty("visible",true);
							   Field17 = "X";
						   }
						   if(oText == "EOW"){
							   that.getView().byId("ItemTable").getColumns()[17].setProperty("visible",true);
							   Field18 = "X";
						   }
						   if(oText == "AD"){
							   that.getView().byId("ItemTable").getColumns()[18].setProperty("visible",true);
							   Field19 = "X";
						   }
						   if(oText == "BOM Comments"){
							   that.getView().byId("ItemTable").getColumns()[19].setProperty("visible",true);
							   Field20 = "X";
						   };
						   if(oText == "Price Comments"){
							   that.getView().byId("ItemTable").getColumns()[20].setProperty("visible",true);
							   Field21 = "X";
						   }
						   if(oText == "Request MFG Date"){
							   that.getView().byId("ItemTable").getColumns()[21].setProperty("visible",true);
							   Field22 = "X";
						   }
						   if(oText == "BOM Date"){
							   that.getView().byId("ItemTable").getColumns()[22].setProperty("visible",true);
							   Field23 = "X";
						   }
						   if(oText == "Price Date"){
							   that.getView().byId("ItemTable").getColumns()[23].setProperty("visible",true);
							   Field24 = "X";
						   }
						   if(oText == "Pending Day"){
							   that.getView().byId("ItemTable").getColumns()[24].setProperty("visible",true);
							   Field25 = "X";
						   }
						} else {
							   var oText = oTable.getItems()[i].getCells()[1].getText();
							   if(oText == "MFG Status"){
								   that.getView().byId("ItemTable").getColumns()[1].setProperty("visible",false);
								   Field2 = "";
							   }
							   if(oText == "Order Status"){
								   that.getView().byId("ItemTable").getColumns()[2].setProperty("visible",false);
								   Field3 = "";
							   }
							   if(oText == "Process Owner"){
								   that.getView().byId("ItemTable").getColumns()[3].setProperty("visible",false);
								   Field4 = "";
							   }
							   if(oText == "Urgent Flag"){
								   that.getView().byId("ItemTable").getColumns()[4].setProperty("visible",false);
								   Field5 = "";
							   }
							   if(oText == "SO No."){
								   that.getView().byId("ItemTable").getColumns()[5].setProperty("visible",false);
								   Field6 = "";
							   }
							   if(oText == "SO QTY"){
								   that.getView().byId("ItemTable").getColumns()[6].setProperty("visible",false);
								   Field7 = "";
							   }
							   if(oText == "MFG Date"){
								   that.getView().byId("ItemTable").getColumns()[7].setProperty("visible",false);
								   Field8 = "";
							   }
							   if(oText == "Target Date"){
								   that.getView().byId("ItemTable").getColumns()[8].setProperty("visible",false);
								   Field9 = "";
							   }
							   if(oText == "ME Comments"){
								   that.getView().byId("ItemTable").getColumns()[9].setProperty("visible",false);
								   Field10 = "";
							   }
							   if(oText == "Issue Owner"){
								   that.getView().byId("ItemTable").getColumns()[10].setProperty("visible",false);
								   Field11 = "";
							   }
							   if(oText == "Vendor"){
								   that.getView().byId("ItemTable").getColumns()[11].setProperty("visible",false);
								   Field12 = "";
							   }
							   if(oText == "Product Name"){
								   that.getView().byId("ItemTable").getColumns()[12].setProperty("visible",false);
								   Field13 = "";
							   }
							   if(oText == "Plant Status"){
								   that.getView().byId("ItemTable").getColumns()[13].setProperty("visible",false);
								   Field14 = "";
							   }
							   if(oText == "Sales Status"){
								   that.getView().byId("ItemTable").getColumns()[14].setProperty("visible",false);
								   Field15 = "";
							   }
							   if(oText == "Country"){
								   that.getView().byId("ItemTable").getColumns()[15].setProperty("visible",false);
								   Field16 = "";
							   }
							   if(oText == "QD"){
								   that.getView().byId("ItemTable").getColumns()[16].setProperty("visible",false);
								   Field17 = "";
							   }
							   if(oText == "EOW"){
								   that.getView().byId("ItemTable").getColumns()[17].setProperty("visible",false);
								   Field18 = "";
							   }
							   if(oText == "AD"){
								   that.getView().byId("ItemTable").getColumns()[18].setProperty("visible",false);
								   Field19 = "";
							   }
							   if(oText == "BOM Comments"){
								   that.getView().byId("ItemTable").getColumns()[19].setProperty("visible",false);
								   Field20 = "";
							   }
							   if(oText == "Price Comments"){
								   that.getView().byId("ItemTable").getColumns()[20].setProperty("visible",false);
								   Field21 = "";
							   }
							   if(oText == "Request MFG Date"){
								   that.getView().byId("ItemTable").getColumns()[21].setProperty("visible",false);
								   Field22 = "";
							   }
							   if(oText == "BOM Date"){
								   that.getView().byId("ItemTable").getColumns()[22].setProperty("visible",false);
								   Field23 = "";
							   }
							   if(oText == "Price Date"){
								   that.getView().byId("ItemTable").getColumns()[23].setProperty("visible",false);
								   Field24 = "";
							   }
							   if(oText == "Pending Day"){
								   that.getView().byId("ItemTable").getColumns()[24].setProperty("visible",false);
								   Field25 = "";
							   }
						}
					}
				}
			}
			var oDataModel = new ODataModel(sUrl,true);
			var oEntry = {Zuser:userId, 
					      Zmfgrs:Field2,
					      Zors:Field3,
					      Zepo:Field4,
					      Zumf:Field5,
					      Zorderno:Field6,
					      Zorderq:Field7,
					      Zmfgd:Field8,
					      Zmfgtg:Field9,
					      Zlwc:Field10,
					      Zio:Field11,
					      Zvendor:Field12,
					      Extwg:Field13,
					      Zmfgps:Field14,
					      Zdchains:Field15,
					      Zaccountry:Field16,
					      Zqd:Field17,
					      Zeowdate:Field18,
					      Zad:Field19,
					      Zmfgbc:Field20,
					      Zmfgpc:Field21,
					      Zrtmd:Field22,
					      Zmfgbom:Field23,
					      Zmfgpcd:Field24,
					      Zpenday:Field25
					      };
			var batchChanges = [];
			batchChanges.push(oDataModel.createBatchOperation("ZMTM_FIELDSet(Zuser='"+userId+"')","PUT",oEntry));
			oDataModel.addBatchChangeOperations(batchChanges);
			oDataModel.submitBatch(function(data, response){
				
			});
			this.Dialog.close();
        },
        onCancelDialog: function(evt){
        	this.Dialog.close();
        },
        onChangedata: function(evt){
			var oTable = sap.ui.getCore().byId('DialogTable');
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
					sap.ui.getCore().byId("selectall").setSelected(true);
				}
			}else{
				sap.ui.getCore().byId("selectall").setSelected(false);
			}

		},
        onChangedataall: function(evt){
			var oTable = sap.ui.getCore().byId('DialogTable');
			var oSela = evt.getSource().getSelected();
			if (oSela == true){
				for(var i=0; i<oTable.getMaxItemsCount(); i++){
					if(oTable.getItems()[i] != undefined){
						if (oTable.getItems()[i].getCells()[0].getEditable()==true){
							var oSel = oTable.getItems()[i].getCells()[0].getSelected();
							if (oSel == false){
								oTable.getItems()[i].getCells()[0].setSelected(true);
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
							}
						}
					}
				}			
			}
		},
		onResetDialog: function(evt){
			var oTable = sap.ui.getCore().byId('DialogTable');
			for(var i=0; i<oTable.getMaxItemsCount(); i++){
				if(oTable.getItems()[i] != undefined){
					if (oTable.getItems()[i].getCells()[0].getEditable()==true){
						var oSel = oTable.getItems()[i].getCells()[0].getSelected();
						if (oSel == true){
							oTable.getItems()[i].getCells()[0].setSelected(false);
						}
					}
				}
			}
		},
		_onMasterMatched :  function(){
			this._oList =  this.getView().byId("ItemTable_m");
			var userID = this.onGetUserID();
			var filters = [];
			filters.push(new sap.ui.model.Filter("Zuser", sap.ui.model.FilterOperator.EQ,userID));
			this._oList.bindItems({
				path : "/ZMTM_INFOSet",
				template : new sap.ui.xmlfragment( "lenovo.mtm.view.TableItems_m", this),
				filters : filters
			});
		}
	});

});