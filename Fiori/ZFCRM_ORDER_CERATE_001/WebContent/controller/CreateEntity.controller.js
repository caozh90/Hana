sap.ui.define([
	"Demo/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"Demo/model/formatter",
	"sap/ui/Device"

], function(BaseController, JSONModel, MessageBox, formatter, Device) {
	"use strict";

	return BaseController.extend("Demo.controller.CreateEntity", {
        
		formatter: formatter,
		
		_oBinding: {},

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			var that = this;
			this.getRouter().getTargets().getTarget("create").attachDisplay(null, this._onDisplay, this);
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oResourceBundle = this.getResourceBundle();
			this._oViewModel = new JSONModel({
				enableCreate: false,
				delay: 0,
				busy: false,
				mode: "create",
				viewTitle: "",
				enableAdd:false,
				enableCheck: false,
				enableProduct: false,
				IconTabFilterC: true,
				IconTabFilterE: true,
				ItemChange: "",
				HeaderChange: "",
				count: 0,
				ComboBoxshipto: "{/SaleOrderHeaderSet}"
			});
			this.setModel(this._oViewModel, "viewModel");
			
			//create and set create item model
			this.oCitemModel = new JSONModel({
				entries: [],
				showEditAndProceedButton: false
			});
			this.setModel(this.oCitemModel, "CreateItem");
			
			//create and set create soldto model
			this.soldtoModel = new JSONModel({
				entries: []
			});
			this.setModel(this.soldtoModel, "soldtoSelect");
			
			//set the Change item
			this.ChangeItemModel = new JSONModel({
				entries: [],
				Hentries: [],
				length: 0
			});
			this.setModel(this.ChangeItemModel, "ChangeItem");
			
			
			//init the cancel dialog
			/* this.canceldialog = new sap.m.Dialog({
			      title: 'Warning',
			      type: 'Message',
			      state: 'Warning',
			      content: new sap.m.Text({
			        text: 'If you cancel, You will lost the data you input.'
			      }),
			      beginButton: new sap.m.Button({
			        text: 'OK',
			        press: function () {
			          dialog.destroy();
			          this._navBack();
			        }
			      }),
			      endButton: new sap.m.Button({
				        text: 'Cancel',
				        press: function () {
				          dialog.destroy();
				        }
				  })
			    });*/

			// Register the view with the message manager
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var oMessagesModel = sap.ui.getCore().getMessageManager().getMessageModel();
			this._oBinding = new sap.ui.model.Binding(oMessagesModel, "/", oMessagesModel.getContext("/"));
			this._oBinding.attachChange(function(oEvent) {
				var aMessages = oEvent.getSource().getModel().getData();
				for (var i = 0; i < aMessages.length; i++) {
					if (aMessages[i].type === "Error" && !aMessages[i].technical) {
						that._oViewModel.setProperty("/enableCreate", false);
					}
				}
			});
		},
		
		
		/* =========================================================== */
		/* Update the Item count                                       */
		/* =========================================================== */
		tabelupdatefinish : function(oEvent) {
			var itemData = this.oCitemModel.getData(); 
			var itemEntries = itemData.entries;
		    var oViewModel = this.getModel("viewModel");
		    oViewModel.setProperty("/count", itemEntries.length);
		},	
		
		
		AddTableRow: function(){
			var oEntry = {};
			oEntry = {
				ItemPos : this.getView().byId("ItemPos_id").getValue(),
				Product : this.getView().byId("Product_id").getValue(),
				Description : this.getView().byId("Description_id").getValue(),
				Quantity  :  this.getView().byId("Quantity_id").getValue()
			};

			var itemData = this.oCitemModel.getData();
			var itemEntries = itemData.entries;
			var k= itemEntries.length;
			itemData.entries[k] = oEntry;
			this.oCitemModel.setData(itemData);
			
			var item = this.getView().byId("ItemPos_id").getValue();
			var item2 = parseInt(item) + 10;
			this.getView().byId("ItemPos_id").setValue(item2);
			this._validateSaveEnablement();
		},
		
		onDeletePressed: function(oEvent){
			var Item = oEvent.getParameter("listItem").getBindingContext("CreateItem").sPath;
			var entryId = Item.substring(Item.length-1,Item.length);
			var IntId = parseInt(entryId);
			var itemData = this.oCitemModel.getData(); 
			var itemEntries = itemData.entries;
			var NewEntry = [];
			var k = 0;
			var item3 = 0;
			for (var j = 0; j < itemEntries.length ; j ++) {
				if(j!==IntId){
					if(j > IntId){
				   	  item3 = parseInt(itemData.entries[j].ItemPos) - 10;
				   	  itemData.entries[j].ItemPos = item3;
				    }
				    NewEntry[k] = itemData.entries[j];
			    	k++;
				}
			}
			itemData.entries = NewEntry;
			this.oCitemModel.setData(itemData);
			var item = this.getView().byId("ItemPos_id").getValue();
			var item2 = parseInt(item) - 10;
			this.getView().byId("ItemPos_id").setValue(item2);
			if (itemData.entries.length == 0 ){
				this._oViewModel.setProperty("/enableCheck", false);
				this._oViewModel.setProperty("/enableCreate", false);
			}
		},
		
		SoldToValidation: function(){
			var that = this;
			var messageText;
			var str;
			var soldtoData = this.soldtoModel.getData(); 
			var soldtoEntries = soldtoData.entries;
			var soldto = this.getView().byId("Sold-To_id").getValue();
			var soldtoOdata = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFCRM_ORDER_CREATE_SRV/");
			var oEntity = {Soldto: soldto};
			this.getView().byId("Combo-shipto").removeAllItems();
			
			var filter = "SoldtoSet?$filter= Soldtohelp eq '" + soldto +"'";
			soldtoOdata.read(filter,null,null,false,
				function(oData){
				  for( var j = 0; j < oData.results.length; j++){
					  var oItemTemplate1 = new sap.ui.core.ListItem(j);
					  oItemTemplate1.setText(oData.results[j].Shipto);
					  oItemTemplate1.setAdditionalText(oData.results[j].Saleorgshort);
					  that.getView().byId("Combo-shipto").addItem(oItemTemplate1);
					  that.getView().byId("SaleOrg_id").setValue(oData.results[j].SalesOrg);
					  that.getView().byId("Dischannel_id").setValue(oData.results[j].Dischannel);
				  }
			},
			    function(oEvent){
				str = oEvent.response.body;
		    	 try{
		    		 oMessage = JSON.parse(str);
		    	 }catch(err){
		    	   try{			    		   
		    		   switch (typeof str) {
		    	          case "string": // XML or simple text
		    	            if (str.indexOf("<?xml") == 0) {
		    	              var oXML = jQuery.parseXML(str);
		    	              var oXMLMsg = oXML.querySelector("message");
		    	              if (oXMLMsg) {
		    	                messageText = oXMLMsg.innerHTML;
		    	                alert(messageText);
		    	              }
		    	            } else {
		    	              // Nope just return the string
		    	              messageText = str;
		    	              alert(messageText);
		    	            }
		    	            break;
		    	         
		    	          case "object": // Exception
		    	            messageText = str.toString();
		    	            alert(messageText);
		    	            break;
		    		   }
		    	   }catch(err){
		    		   messageText = "An unknown error occurred";
		    		   alert(messageText);
		    	   } 
		    	 }
			    }
			);
		},
		
		GetProduct: function(){
			var that = this;
			var product = this.getView().byId("Product_id").getValue();
			var saleorg = this.getView().byId("SaleOrg_id").getValue();
			var Dischannel = this.getView().byId("Dischannel_id").getValue();
			this.getView().byId("Description_id").setValue();
			var porductOdata = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFCRM_ORDER_CREATE_SRV/");
			var messageText;
			var str;
			var filter = "ProductSet(Dischannel='" + Dischannel +"',Salesorg='" + saleorg + "',Productid='" + product + "')";
			porductOdata.read(filter,null,null,false,
					function(oData){
				    that.getView().byId("Description_id").setValue(oData.Description);
			},
			    function(oEvent){
				     str = oEvent.response.body;
			    	 try{
			    		 oMessage = JSON.parse(str);
			    	 }catch(err){
			    	   try{			    		   
			    		   switch (typeof str) {
			    	          case "string": // XML or simple text
			    	            if (str.indexOf("<?xml") == 0) {
			    	              var oXML = jQuery.parseXML(str);
			    	              var oXMLMsg = oXML.querySelector("message");
			    	              if (oXMLMsg) {
			    	                messageText = oXMLMsg.innerHTML;
			    	                alert(messageText);
			    	              }
			    	            } else {
			    	              // Nope just return the string
			    	              messageText = str;
			    	              alert(messageText);
			    	            }
			    	            break;
			    	         
			    	          case "object": // Exception
			    	            messageText = str.toString();
			    	            alert(messageText);
			    	            break;
			    		   }
			    	   }catch(err){
			    		   messageText = "An unknown error occurred";
			    		   alert(messageText);
			    	   } 
			    	 }
			    }
			);
		},
		
		
		/* =========================================================== */
		/* check out the input data                                    */
		/* =========================================================== */
		onCheck: function(){
			/*var itemData = this.oCitemModel.getData(); 
			var itemEntries = itemData.entries;
			var grossvalue = 0;
			var taxamount = 0;
			for (var j = 0; j < itemEntries.length ; j ++) {				
				grossvalue = parseFloat(grossvalue) + parseFloat(itemData.entries[j].Price);
				taxamount = parseFloat(taxamount) + parseFloat(itemData.entries[j].Tax);
				
			}
			this.getView().byId("GrossValue_id").setValue(grossvalue);
			this.getView().byId("TaxAmount_id").setValue(taxamount);*/
			this._oViewModel.setProperty("/enableCreate", true);
		},
					

		/* =========================================================== */
		/* event handlers When click Save button                       */
		/* =========================================================== */

		/**
		 * Event handler (attached declaratively) for the view save button. Saves the changes added by the user.
		 * @function
		 * @public
		 */
		onSave: function(oEvent) {
			var that = this,
				oModel = this.getModel();
			var msg;
			var messageText;
			var str;
			var requestBody = {};
			var child = {};
			var child1 = {};
			var CItem = [];
			var EItem = [];
			var itemData = this.oCitemModel.getData();
			var createOdata = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFCRM_ORDER_CREATE_SRV/", false);
						
			var mode  = this._oViewModel.getProperty("/mode");
			if (mode === "edit") {
				
				var Headerchange  = this._oViewModel.getProperty("/HeaderChange");
				var Itemchange  = this._oViewModel.getProperty("/ItemChange");
				var itemChange = this.ChangeItemModel.getData();
				if (Headerchange === "H" || Itemchange === "I" || itemEntries.length != 0) {					
					requestBody = {};
					//Pass the change field of Header to Body
					for (var j = 0; j < itemChange.Hentries.length ; j ++){
						if(itemChange.Hentries[j].Id === "CustomerPo_id"){
						      requestBody.Customerpo = this.getView().byId("CustomerPo_id").getValue();
						}
						
						if(itemChange.Hentries[j].Id === "Sold-To_id"){
							  requestBody.Soldto = this.getView().byId("Sold-To_id").getValue();
						}
						
						if(itemChange.Hentries[j].Id === "Combo-shipto"){
							   requestBody.Shipto = this.getView().byId("Combo-shipto").getValue();
						}
						
						if(itemChange.Hentries[j].Id === "Status_id"){
							   requestBody.Status = this.getView().byId("Status_id").getValue();
						}
						
						if(itemChange.Hentries[j].Id === "SaleOrg_id"){
							   requestBody.Saleorg = this.getView().byId("SaleOrg_id").getValue();
						}
						
						if(itemChange.Hentries[j].Id === "Reqdlvdate_id"){
							   requestBody.Reqdlvdate = this.byId("Reqdlvdate_id").getDateValue();
							   formatter.fnDateTimeFormatter(requestBody.Reqdlvdate);
						}
						
						if(itemChange.Hentries[j].Id === "GrossValue_id"){
							   requestBody.Grossvalue = this.getView().byId("GrossValue_id").getValue();
						}
						
						if(itemChange.Hentries[j].Id === "NetPrice_id"){
							   requestBody.Netprice = this.getView().byId("NetPrice_id").getValue();
						}	
						
						if(itemChange.Hentries[j].Id === "TaxAmount_id"){
							   requestBody.Taxamount = this.getView().byId("TaxAmount_id").getValue();
						}
					}
					requestBody.Orderid = this.getView().byId("OrderID_id").getValue();
					requestBody.Guid = this.getView().byId("HeaderGuid_id").getValue();
					requestBody.SalesOrderToItem = [];
					requestBody.SalesOrderToMessage = [];
					 
					//Create Item Body
					for (var j = 0; j < itemData.entries.length ; j ++) {
						child = {};
						child.Itempos = itemData.entries[j].ItemPos;
						child.Product = itemData.entries[j].Product;
						child.Description = itemData.entries[j].Description; 
						child.Quantity = itemData.entries[j].Quantity;
						requestBody.SalesOrderToItem[j] = child;
					}
					
					//Change the Exist Item Body
					for (var j = 0; j < itemChange.entries.length ; j ++) {
						var selectRow = this.getView().byId("ItemTable").getContextByIndex(itemChange.entries[j].Id);
						var child2 = {};
						child2.Guid = selectRow.getObject().Guid;
						child2.Description = selectRow.getObject().Description;
						child2.Price    = selectRow.getObject().Price;
						child2.Product = selectRow.getObject().Product;
						child2.Quantity = selectRow.getObject().Quantity;
						child2.Tax = selectRow.getObject().Tax;
						child2.Status = selectRow.getObject().Status;
						if(itemChange.entries[j].Col === "2"){
							child2.Product = itemChange.entries[j].Value;
						}						
						if(itemChange.entries[j].Col === "3"){
							child2.Description = itemChange.entries[j].Value;
						}
						if(itemChange.entries[j].Col === "4"){
							child2.Quantity = itemChange.entries[j].Value;
						}
						if(itemChange.entries[j].Col === "5"){
							child2.Price = itemChange.entries[j].Value;
						}
						if(itemChange.entries[j].Col === "6"){
							child2.Tax = itemChange.entries[j].Value;
						}
						if(itemChange.entries[j].Col === "7"){
							child2.Status = itemChange.entries[j].Value;
						}
												
						requestBody.SalesOrderToItem.push(child2);
					}	
					
					child1 = {};
					child1.Type = "E";
					requestBody.SalesOrderToMessage[0] = child1;
					//Call the create deep to update
					createOdata.create("SaleOrderHeaderSet",requestBody,
							{success: function(oEvent){
								  if(oEvent.Orderid != ""){
									  var bReplace = !Device.system.phone;   //On phones a additional history entry is created
									  var Guid = oEvent.Guid;
									  that.getRouter().navTo("object", {
											objectId: Guid
								      }, bReplace);
									  that.ClearInput();
									   
								   }else{
									  messageText = "";
									  for(var i = 0; i< oEvent.SalesOrderToMessage.results.length; i++){
										  messageText = messageText + oEvent.SalesOrderToMessage.results[i].Message + "<br/>";
									  }
									  alert(messageText);
								   }

								},error: function(oEvent){
									str = oEvent.response.body;
							    	 try{
							    		 oMessage = JSON.parse(str);
							    	 }catch(err){
							    	   try{			    		   
							    		   switch (typeof str) {
							    	          case "string": // XML or simple text
							    	            if (str.indexOf("<?xml") == 0) {
							    	              var oXML = jQuery.parseXML(str);
							    	              var oXMLMsg = oXML.querySelector("message");
							    	              if (oXMLMsg) {
							    	                messageText = oXMLMsg.innerHTML;
							    	                alert(messageText);
							    	              }
							    	            } else {
							    	              // Nope just return the string
							    	              messageText = str;
							    	              alert(messageText);
							    	            }
							    	            break;
							    	         
							    	          case "object": // Exception
							    	            messageText = str.toString();
							    	            alert(messageText);
							    	            break;
							    		   }
							    	   }catch(err){
							    		   messageText = "An unknown error occurred";
							    		   alert(messageText);
							    	   } 
							    	 }
									} 
							});
					
				}
								
				
				if (Itemchange === "" && Headerchange ==="" && itemEntries.length === 0) {					
					alert("No Change have been make");
					return;
				}													
								
			} else {					
				
				//Create Header Body
				requestBody.Customerpo = this.getView().byId("CustomerPo_id").getValue();
				requestBody.Soldto = this.getView().byId("Sold-To_id").getValue();
				requestBody.Shipto = this.getView().byId("Combo-shipto").getValue();
				requestBody.Status = this.getView().byId("Status_id").getValue();
				requestBody.Saleorg = this.getView().byId("SaleOrg_id").getValue();
				requestBody.Reqdlvdate = this.byId("Reqdlvdate_id").getDateValue();
				formatter.fnDateTimeFormatter(requestBody.Reqdlvdate);
				requestBody.Grossvalue = this.getView().byId("GrossValue_id").getValue();
				requestBody.Netprice = this.getView().byId("NetPrice_id").getValue();
				requestBody.Taxamount = this.getView().byId("TaxAmount_id").getValue();
				requestBody.SalesOrderToItem = [];
				requestBody.SalesOrderToMessage = [];
				 
				//Create Item Body
				for (var j = 0; j < itemData.entries.length ; j ++) {
					child = {};
					child.Itempos = itemData.entries[j].ItemPos;
					child.Product = itemData.entries[j].Product;
					child.Description = itemData.entries[j].Description; 
					child.Quantity = itemData.entries[j].Quantity;
					requestBody.SalesOrderToItem[j] = child;
				}
				
				child1 = {};
				child1.Type = "E";
				requestBody.SalesOrderToMessage[0] = child1;
				 
				//Call the create deep to create
				createOdata.create("SaleOrderHeaderSet",requestBody,
				{success: function(oEvent){
					
					   if(oEvent.Orderid != ""){
						  var bReplace = !Device.system.phone;   //On phones a additional history entry is created
						  var Guid = oEvent.Guid;
						  that.getRouter().navTo("object", {
								objectId: Guid
					      }, bReplace);
						  that.ClearInput();
						   
					   }else{
						  messageText = "";
						  for(var i = 0; i< oEvent.SalesOrderToMessage.results.length; i++){
							  messageText = messageText + oEvent.SalesOrderToMessage.results[i].Message + "<br/>";
						  }
						  alert(messageText);
					   }
					
					},error: function(oEvent){
						str = oEvent.response.body;
				    	 try{
				    		 oMessage = JSON.parse(str);
				    	 }catch(err){
				    	   try{			    		   
				    		   switch (typeof str) {
				    	          case "string": // XML or simple text
				    	            if (str.indexOf("<?xml") == 0) {
				    	              var oXML = jQuery.parseXML(str);
				    	              var oXMLMsg = oXML.querySelector("message");
				    	              if (oXMLMsg) {
				    	                messageText = oXMLMsg.innerHTML;
				    	                alert(messageText);
				    	              }
				    	            } else {
				    	              // Nope just return the string
				    	              messageText = str;
				    	              alert(messageText);
				    	            }
				    	            break;
				    	         
				    	          case "object": // Exception
				    	            messageText = str.toString();
				    	            alert(messageText);
				    	            break;
				    		   }
				    	   }catch(err){
				    		   messageText = "An unknown error occurred";
				    		   alert(messageText);
				    	   } 
				    	 }
						} 
				});
								
			}
						
		},

		/**
		 * Event handler (attached declaratively) for the view cancel button. Asks the user confirmation to discard the changes.
		 * Clear the input value to Create Order
		 * @function
		 * @public
		 */
		onCancel: function(oEvent) {
			/*// check if the model has been changed
			if (this.getModel().hasPendingChanges()) {
				// get user confirmation first
				this._showConfirmQuitChanges(); // some other thing here....
			} else {
				this.getModel("appView").setProperty("/addEnabled", true);
				// cancel without confirmation
				this._navBack();
			}
			
			var MessageBox = new sap.m.MessageBox;
			var sQuestion = "If you leave the data will lost";
			var that = this;
			MessageBox.show(sQuestion, {
				icon: MessageBox.Icon.WARNING,
				title: this._oResourceBundle.getText("delete"),
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.OK) {
						this.getModel("appView").setProperty("/addEnabled", true);
						this._oViewModel.setProperty("/enableCreate", false);
						// cancel without confirmation
						this._navBack();
					}
				}
			});*/
			

			//this.canceldialog.open();
			    
			var mode  = this._oViewModel.getProperty("/mode");
			var itemData = this.oCitemModel.getData(); 
			var itemChange = this.ChangeItemModel.getData();
			var EnptyEntry = [];
			var EnptyEntry1 = [];
			var EnptyEntry2 = [];
			if (mode === "edit") {
				this._oViewModel.setProperty("/HeaderChange", "");
				this._oViewModel.setProperty("/ItemChange", "");
				itemData.entries = EnptyEntry;
	        	this.oCitemModel.setData(itemData);          //Clear The new Item
	        	itemChange.entries = EnptyEntry1;
	        	itemChange.Hentries = EnptyEntry2;
	        	this.ChangeItemModel.setData(itemChange);    //Clear the change Item select
				this._navBack();
			} else {	
				this._oViewModel.setProperty("/enableCreate", false);
				this._oViewModel.setProperty("/enableCheck", false);
				this._oViewModel.setProperty("/enableProduct", false);
				this._oViewModel.setProperty("/mode", " ");
				
				//init input
	        	itemData.entries = EnptyEntry;
	        	this.oCitemModel.setData(itemData);
				this.getView().byId("Combo-shipto").removeAllItems();
				// clear Header input
				this.getView().byId("CustomerPo_id").setValue();
				this.getView().byId("Sold-To_id").setValue();
				this.getView().byId("Combo-shipto").setValue();
				this.getView().byId("Status_id").setValue();
				this.getView().byId("SaleOrg_id").setValue();
				this.getView().byId("Reqdlvdate_id").setDateValue();
				this.getView().byId("GrossValue_id").setValue();
				this.getView().byId("NetPrice_id").setValue();
				this.getView().byId("TaxAmount_id").setValue();
				this.getView().byId("Dischannel_id").setValue();
				
				//clear Item Input
				this.getView().byId("ItemPos_id").setValue("10");
				this.getView().byId("Product_id").setValue();
				this.getView().byId("Description_id").setValue();
				this.getView().byId("Quantity_id").setValue();
				
				this._navBack();				
			}
			
		},
		
		/* =========================================================== */
		/* Clear the Input after Create
		/* =========================================================== */
		ClearInput: function(){
			var mode  = this._oViewModel.getProperty("/mode");
			var itemData = this.oCitemModel.getData(); 
			var itemChange = this.ChangeItemModel.getData();
			var EnptyEntry = [];
			var EnptyEntry1 = [];
			var EnptyEntry2 = [];
			if (mode === "edit") {
				this._oViewModel.setProperty("/HeaderChange", "");
				this._oViewModel.setProperty("/ItemChange", "");
				itemData.entries = EnptyEntry;
	        	this.oCitemModel.setData(itemData);          //Clear The new Item
	        	itemChange.entries = EnptyEntry1;
	        	itemChange.Hentries = EnptyEntry2;
	        	this.ChangeItemModel.setData(itemChange);    //Clear the change Item select
	        	
	        	//clear Item Input
				this.getView().byId("ItemPos_id").setValue("10");
				this.getView().byId("Product_id").setValue();
				this.getView().byId("Description_id").setValue();
				this.getView().byId("Quantity_id").setValue();
			} else {	
				this._oViewModel.setProperty("/enableCreate", false);
				this._oViewModel.setProperty("/enableCheck", false);
				this._oViewModel.setProperty("/enableProduct", false);
				this._oViewModel.setProperty("/mode", " ");
				
				//init input
	        	this._oViewModel.setProperty("/HeaderChange", "");
				this._oViewModel.setProperty("/ItemChange", "");
				itemData.entries = EnptyEntry;
	        	this.oCitemModel.setData(itemData);          //Clear The new Item
	        	itemChange.entries = EnptyEntry1;
	        	itemChange.Hentries = EnptyEntry2;
	        	this.ChangeItemModel.setData(itemChange);    //Clear the change Item select
				this.getView().byId("Combo-shipto").removeAllItems();
				// clear Header input
				this.getView().byId("CustomerPo_id").setValue();
				this.getView().byId("Sold-To_id").setValue();
				this.getView().byId("Combo-shipto").setValue();
				this.getView().byId("Status_id").setValue();
				this.getView().byId("SaleOrg_id").setValue();
				this.getView().byId("Reqdlvdate_id").setDateValue();
				this.getView().byId("GrossValue_id").setValue();
				this.getView().byId("NetPrice_id").setValue();
				this.getView().byId("TaxAmount_id").setValue();
				this.getView().byId("Dischannel_id").setValue();
				
				//clear Item Input
				this.getView().byId("ItemPos_id").setValue("10");
				this.getView().byId("Product_id").setValue();
				this.getView().byId("Description_id").setValue();
				this.getView().byId("Quantity_id").setValue();
								
			}
		},

		/* =========================================================== */
		/* Internal functions
		/* =========================================================== */
		/**
		 * Navigates back in the browser history, if the entry was created by this app.
		 * If not, it navigates to the Details page
		 * @private
		 */
		_navBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			this.getView().unbindObject();
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				this.getRouter().getTargets().display("object");
			}
		},

		/**
		 * Opens a dialog letting the user either confirm or cancel the quit and discard of changes.
		 * when click ok clear the Item No to default:10 and clear the Item JSON and disable the addItem button
		 * @private
		 */
		_showConfirmQuitChanges: function() {
			var oComponent = this.getOwnerComponent(),
				oModel = this.getModel();
			var that = this;
			var EnptyEntry = [];
			MessageBox.confirm(
				this._oResourceBundle.getText("confirmCancelMessage"), {
					styleClass: oComponent.getContentDensityClass(),
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getModel("appView").setProperty("/addEnabled", true);
							that._oViewModel.setProperty("/enableAdd", false);
			            	that.getView().byId("ItemPos_id").setValue("10");
			            	var itemData = that.oCitemModel.getData(); 
			            	itemData.entries = EnptyEntry;
			            	that.oCitemModel.setData(itemData);
							oModel.resetChanges();
							that._navBack();
						}
					}
				}
			);
		},

		/**
		 * Prepares the view for editing the selected object
		 * @param {sap.ui.base.Event} oEvent the  display event
		 * @private
		 */
		_onEdit: function(oEvent) {
			var oData = oEvent.getParameter("data"),
				oView = this.getView();
			this._oViewModel.setProperty("/mode", "edit");
			this._oViewModel.setProperty("/enableCreate", true);
			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("editViewTitle"));
			this._oViewModel.setProperty("/IconTabFilterC", false);
			this._oViewModel.setProperty("/IconTabFilterE", true);
			this.ClearInput();

			oView.bindElement({
				path: oData.objectPath
			});
		},

		/**
		 * Prepares the view for creating new object
		 * @param {sap.ui.base.Event} oEvent the  display event
		 * @private
		 */

		_onCreate: function(oEvent) {
			if (oEvent.getParameter("name") && oEvent.getParameter("name") !== "create") {
				this._oViewModel.setProperty("/enableCreate", false);
				this.getRouter().getTargets().detachDisplay(null, this._onDisplay, this);
				this.getView().unbindObject();
				return;
			}
			
			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("createViewTitle"));
			this._oViewModel.setProperty("/mode", "create");	
			this._oViewModel.setProperty("/IconTabFilterC", true);
			this._oViewModel.setProperty("/IconTabFilterE", false);
			this.ClearInput();
			
			/*var oContext = this._oODataModel.createEntry("ZOrderCollection", {
				success: this._fnEntityCreated.bind(this),
				error: this._fnEntityCreationFailed.bind(this)
			});
			this.getView().setBindingContext(oContext);*/
		},

		/**
		 * Checks if the save button can be enabled
		 * @private
		 */
		_validateSaveEnablement: function(oEvent) {
			
			var mode  = this._oViewModel.getProperty("/mode");
			if (mode === "edit"){//get the change input
			    this._oViewModel.setProperty("/HeaderChange", "H");	
			    var Id = oEvent.getParameters("Id").id;			    
			    var index = Id.length;
				var SelectId = Id.substring(12,index);
				var itemChange = this.ChangeItemModel.getData();
				var firstEntry = {
					Id : SelectId
				};
				for(var k = 0; k < itemChange.Hentries.length; k++){
			    	if(SelectId === itemChange.Hentries[k].Id){
			    	   return;
			    	}
			    }
			    if(itemChange.Hentries.length === 0){
			    	itemChange.Hentries.push(firstEntry);
			    	this.ChangeItemModel.setData(itemChange);
			    }else{
			    	itemChange.Hentries.push(firstEntry);
			    }
			    
			}else{
				
				var aInputControls = this._getFormFields(this.byId("newEntitySimpleForm"));
				var oControl;
				var product = this.getView().byId("Product_id").getValue();
				var saleorg = this.getView().byId("SaleOrg_id").getValue();
				if(product && saleorg){
				   this._oViewModel.setProperty("/enableProduct", true);
				}else{
					this._oViewModel.setProperty("/enableProduct", false);
				}
				for (var m = 0; m < aInputControls.length; m++) {
					oControl = aInputControls[m].control;
					if (aInputControls[m].required) {
						var sValue = oControl.getValue();
						if (!sValue) {
							this._oViewModel.setProperty("/enableCheck", false);
							return;
						}
					}
				}
				this._checkForErrorMessages();					
			}						
		},
		
		
		/**
		 * Checks if the Item Have been Change and get the input change field
		 * @private
		 */
		_validateItemChange: function(oEvent) {
			
			var mode  = this._oViewModel.getProperty("/mode");
			var Id = oEvent.getParameters("Id").id;
			var value = oEvent.getParameters("newValue").newValue;
			var index = Id.length;
			var SelectId = Id.substring(index-1,index);
			var SelectCol = Id.substring(index-6,index-5);
			var itemChange = this.ChangeItemModel.getData();
			var oEntry = [];
			var firstEntry = {
				Id : SelectId,
				Col : SelectCol,
				Value : value
			};
			if (mode === "edit"){
			    this._oViewModel.setProperty("/ItemChange", "I");
			    for(var k = 0; k < itemChange.entries.length; k++){
			    	if(SelectId === itemChange.entries[k].Id && SelectCol === itemChange.entries[k].Col){
			    	   itemChange.entries[k] = firstEntry;
			    	   return;
			    	}
			    }
			    if(itemChange.entries.length === 0){
			    	itemChange.entries[0] = firstEntry;
			    	this.ChangeItemModel.setData(itemChange);
			    }else{
			    	itemChange.entries[itemChange.entries.length] = firstEntry;
			    }			    
			}						
		},
		
		
		/**
		 * Checks if the add button can be enabled
		 * @private
		 */
		_validateAddEnablement: function() {
			var aInputControls = this._getFormFields(this.byId("newItemSimpleForm"));
			var oControl;
			var product = this.getView().byId("Product_id").getValue();
			var saleorg = this.getView().byId("SaleOrg_id").getValue();
			if(product && saleorg){
				   this._oViewModel.setProperty("/enableProduct", true);
				}else{
					this._oViewModel.setProperty("/enableProduct", false);
				}
			for (var m = 0; m < aInputControls.length; m++) {
				oControl = aInputControls[m].control;
				if (aInputControls[m].required) {
					var sValue = oControl.getValue();
					if (!sValue) {
						this._oViewModel.setProperty("/enableAdd", false);
						return;
					}
				}
			}
			this._checkItemForErrorMessages();
		},

		/**
		 * Checks if there is any wrong inputs that can not be saved.
		 * Checks if item didn't input that can not be saved.
		 * @private
		 */

		_checkForErrorMessages: function() {
			var itemEntries = this.oCitemModel.getData().entries;
			
			if(itemEntries.length!== 0){
               this._oViewModel.setProperty("/enableCheck", true);
		    }			
		},
		
		
		/**
		 * Checks if there is any wrong item inputs that can not be saved.
		 * @private
		 */

		_checkItemForErrorMessages: function() {
			var aMessages = this._oBinding.oModel.oData;
			if (aMessages.length > 0) {
				var bEnableCreate = true;
				for (var i = 0; i < aMessages.length; i++) {
					if (aMessages[i].type === "Error" && !aMessages[i].technical) {
						bEnableCreate = false;
						break;
					}
				}
				this._oViewModel.setProperty("/enableAdd", bEnableCreate);
			} else {
				this._oViewModel.setProperty("/enableAdd", true);
			}
		},

		/**
		 * Handles the success of updating an object
		 * @private
		 */
		_fnUpdateSuccess: function() {
			this.getModel("appView").setProperty("/busy", false);
			this.getView().unbindObject();
			this.getRouter().getTargets().display("object");
		},

		/**
		 * Handles the success of creating an object
		 *@param {object} oData the response of the save action
		 * @private
		 */
		_fnEntityCreated: function(oData) {
			var sObjectPath = this.getModel().createKey("ZOrderCollection", oData);
			this.getModel("appView").setProperty("/itemToSelect", "/" + sObjectPath); //save last created
			this.getModel("appView").setProperty("/busy", false);
			this.getRouter().getTargets().display("object");
		},

		/**
		 * Handles the failure of creating/updating an object
		 * @private
		 */
		_fnEntityCreationFailed: function() {
			this.getModel("appView").setProperty("/busy", false);
		},

		/**
		 * Handles the onDisplay event which is triggered when this view is displayed
		 * @param {sap.ui.base.Event} oEvent the on display event
		 * @private
		 */
		_onDisplay: function(oEvent) {
			var oData = oEvent.getParameter("data");
			if (oData && oData.mode === "update") {
				this._onEdit(oEvent);
			} else {
				this._onCreate(oEvent);
			}
		},

		/**
		 * Gets the form fields
		 * @param {sap.ui.layout.form} oSimpleForm the form in the view.
		 * @private
		 */
		_getFormFields: function(oSimpleForm) {
			var aControls = [];
			var aFormContent = oSimpleForm.getContent();
			var sControlType;
			for (var i = 0; i < aFormContent.length; i++) {
				sControlType = aFormContent[i].getMetadata().getName();
				if (sControlType === "sap.m.Input" || sControlType === "sap.m.DateTimeInput" ||
					sControlType === "sap.m.CheckBox") {
					aControls.push({
						control: aFormContent[i],
						required: aFormContent[i - 1].getRequired && aFormContent[i - 1].getRequired()
					});
				}
			}
			return aControls;
		}
	});

});