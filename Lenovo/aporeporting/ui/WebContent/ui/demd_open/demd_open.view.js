sap.ui.jsview("ui.demd_open.demd_open", {
  
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.demd_open
	*/ 
	getControllerName : function() {
		return "ui.demd_open.demd_open";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.demd_open
	*/ 
	createContent : function(oController) {
		
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Planning Version',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-demd_open-plan_ver',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog3.create({
							                	                			label: 'Planning Version',
							                	                			path: 'VRSIOEX',
							                	                		    bindingContext: '/plan_ver',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],

			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Plant',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-demd_open-locno',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Location No',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/loc_f4help',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],              	
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	             


			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'MRP Controller',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-demd_open-dispo',{
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
			                	                }),
						                	     ]
			                 }),
   			                 new sap.ui.layout.form.FormContainer({ 
    			                	formElements: [			                 
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Item', //'Material',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-demd_open-matnr',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog.create({
							                	                			label: 'Material No',
							                	                			path: 'MATNR',
							                	                		    bindingContext: '/mat_f4help',							           
							                	                		    controller: oController,
							                	                		    self: this
							                	                		    //,
							                	                		    //label1: 'Desc',
							                	                		    //path1: 'MAKTX'
					                	                			    })
						                	                		 }
			                	                			})],

			                	                			layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                })
			                	                
			                	                ,
              	                
//			                	                new sap.ui.layout.form.FormElement({
//			                	                	label: 'Stock Type',
//			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-demd_open-stocktype',{
//						                	                		valueHelpRequest: function(){
//						                	                			sapui5.selectionDialog3.create({
//							                	                			label: 'Stock Type',
//							                	                			path: 'KZKRI',
//							                	                		    bindingContext: '/demd_open02',
//							                	                		    controller: oController,
//							                	                		    self: this
//					                	                			    })
//						                	                		 }
//			                	                			})],              	
//			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
//			                	             
//
//
//			                	                })	,
   			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Hub/None Hub',
			                	                	fields: [ new sap.ui.commons.DropdownBox( 
			                	                			"db-demd_open-stocktype1",{
			                	                				tooltip: "Hub/None Hub Type",
			                	                				value: 'None Hub Part',
			                	                				items: [new sap.ui.core.ListItem("yes",{text: "Hub Part", key: "yes"}),
			                	                				        new sap.ui.core.ListItem("no",{text: "None Hub Part", key: "no"}),
			                	                				        new sap.ui.core.ListItem("all",{text: "All Type", key: "all"})
			                	                				]
			                	                			       } ) 
			                	                	         ],
			         	         
			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                	
			                	                })	,				                	                
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
			                	                
			                	                
			                 })
			                 ]
		});
		
		var oPanel = new sap.ui.commons.Panel({
			title: new sap.ui.core.Title({text: 'Selection Criteria'}),
			width: '80%',
			content: [oForm],
		});
		
		
		var oTb = sapui5.table.createTable({id: 'tb-demd_open02', 
			                                title: 'Detail',
			                                reportName: 'Supplier Commitment Status Report',
			                                toolbar: true}, 
							                 [
							                  {label: 'Plant', path: 'LOCNO_PLT',width: "60px"},
							                  {label: 'Item', path: 'MATNR',width: "120px"},  //Product
							                  {label: 'Item Desc', path: 'MAKTX',width: "120px"},	
							                  {label: 'MRP Controller', path: 'DISPO',width: "120px"},	
							                  {label: 'Supplier Loc', path: 'LOCNO_SPL',width: "120px"},
							                  {label: 'Supplier Name', path: 'DESCR40_SPL',width: "120px"},
							                  {label: 'Part LT', path: 'PLIFZ'},
							                  {label: 'Lenovo Inventory', path: 'STOCK_QTY'},
							                  {label: 'Cur demand in LT', path: 'RC_DMD_LT'},
							                  {label: 'Open PO Qty',  path: 'REAL_QUANTITY'},
							                  {label: 'Delta', path: 'DELTA_QTY'}])							                  
							                  
							                  ;
	
		// Create a horizontal scrollbar with size 200 px and content size 500 px
		var oHSB = new sap.ui.core.ScrollBar("horiSB");
		oHSB.setVertical(false);
		oHSB.setSize("1024px");
		//oHSB.setContentSize("500px");
		// Initial scroll position in px
		oHSB.setScrollPosition(0);

		// attach it to some other element in the page
		oHSB.placeAt(oTb);
		

			
		//oHSB.placeAt(oPanelTB);
		//modified by caozh4 20170310
		var oGrid = new sap.ui.layout.Grid({
			defaultSpan: "L12 M12 S12",
			content: [oPanel,oTb]
		});
		return oGrid;
//		var oVertical = new sap.ui.layout.VerticalLayout({
//			content: [oPanel, oTb]
//		})
//
//		return oVertical;

	}

});