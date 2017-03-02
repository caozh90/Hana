sap.ui.define(
		["sap/ui/core/mvc/Controller",
		 "sap/ui/model/json/JSONModel",
		 "demo/model/formatter",
		 "sap/ui/model/Filter",
		 "sap/ui/model/FilterOperator"
		 ],
		function(Controller, JSONModel, formatter, Filter, FilterOperator){
			"use strict";
			return Controller.extend("demo.controller.InvoiceList",{
				formatter: formatter,
				onInit: function(){
					var oViewModel = new JSONModel({
						currency: "EUR"
					});
					this.getView().setModel(oViewModel, "view");
				},
				onFilterInvoices: function(oEvent){
					var aFilter = [];
					var squery = oEvent.getParameter("query");
					if(squery){
						aFilter.push(new Filter("ProductName", FilterOperator.Contains, squery));
					}
					var oList = this.getView().byId("invoiceList");
					var oBinding = oList.getBinding("items");
					oBinding.filter(aFilter);
				}
			});
		}
);