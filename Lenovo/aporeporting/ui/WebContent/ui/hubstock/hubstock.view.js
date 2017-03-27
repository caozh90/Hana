sap.ui.jsview("ui.hubstock.hubstock", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.hubstock
	*/ 
	getControllerName : function() {
		return "ui.hubstock.hubstock";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.hubstock
	*/ 
	createContent : function(oController) {
 		
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Planning Version',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-version',{
			                	                		            value: '000', //default value
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Planning Version',
							                	                			path: 'Version',
							                	                			label1: 'Planning Version Description',
							                	                			path1: 'VersionText',
							                	                		    bindingContext: '/hub_stock_planning_version',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    });
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Location',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-location',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Location',
							                	                			path: 'Location',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],              	
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Product Family',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-family',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Product Family',
							                	                			path: 'ProductFamily',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                	
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'MRP Controller',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-dispo',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'MRP Controller',
							                	                			path: 'DISPO',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                })]
			                 }),
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Item',    //'Product Number',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-product-number',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Product Number',
							                	                			path: 'ProductNumber',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Material Type',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-material-type',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Material Type',
							                	                			path: 'MaterialType',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Material Group',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-hubstock-material-group',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Material Group',
							                	                			path: 'MaterialGroup',
							                	                		    bindingContext: oController.getBindingContext(),
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                
			                	                new sap.ui.layout.form.FormElement({
			                	                	fields: [new sap.ui.commons.layout.MatrixLayout({	
			                	            			rows: [new sap.ui.commons.layout.MatrixLayoutRow({
			                	            				cells: [new sap.ui.commons.layout.MatrixLayoutCell({
			                	            					content: [new sap.ui.commons.Button({
			                	            								text: 'OK',
			                	            								width: '50px',
			                	            								style: sap.ui.commons.ButtonStyle.Accept,
			                	            								press: oController.confirmSelection
			                	            							 })],
			                	            					hAlign: sap.ui.commons.layout.HAlign.Right 
			                	            				})]
			                	            			})]
			                	            		})],
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                })]
			                 })]
		});
		
		var oPanel = new sap.ui.commons.Panel({
			title: new sap.ui.core.Title({text: 'Selection Criteria'}),
			width: '80%',
			content: [oForm],
		});
		
		
		var oTb = sapui5.table.createTable({id: 'tb-hubstock', 
			                                title: 'Detail',
			                                reportName: 'Hub Stock And Inventory Report',
			                                toolbar: true}, 
							                 [{label: 'Location', path: 'Location'},
							                  {label: 'Product Family', path: 'ProductFamily'},
							                  {label: 'Item', path: 'ProductNumber'},
							                  {label: 'Material Type', path: 'MaterialType'},
							                  {label: 'Material Group', path: 'MaterialGroup'},
							                  {label: 'MRP Controller', path: 'DISPO'},
							                  {label: 'Stock', type: 'amount', path: 'STOCK_QTY', uom_path: 'MEINS'},
							                  {label: 'Hub Stock', type: 'amount', path: 'CON_STO_QTY', uom_path: 'MEINS'},
							                  {label: 'Time Stamp', path: 'TIMESTAMP'}]);
		
		
		//modified by caozh4 20170310
		var oGrid = new sap.ui.layout.Grid({
			defaultSpan: "L12 M12 S12",
			content: [oPanel,oTb]
		});
		return oGrid;
//		var oVertical = new sap.ui.layout.VerticalLayout({
//			content: [oPanel,oTb]
//		})
//		
//		return oVertical;

	}

});