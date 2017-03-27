sap.ui.jsview("ui.supcomt.supcomt", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.supcomt
	*/ 
	getControllerName : function() {
		return "ui.supcomt.supcomt";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.supcomt
	*/ 
	createContent : function(oController) {
		
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Supplier Location',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-supcomt-locno_from',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Supplier Location',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/locfrom_f4help',
							                	                		    controller: oController,
							                	                		    self: this,
							                	                		    label1: 'Desc',
							                	                		    path1: 'DESCR40'
					                	                			    })
						                	                		 }
			                	                			})],

			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),

			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Material No',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-supcomt-matnr',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Material No',
							                	                			path: 'MATNR',
							                	                		    bindingContext: '/mat_f4help',							           
							                	                		    controller: oController,
							                	                		    self: this,
							                	                		    label1: 'Desc',
							                	                		    path1: 'MAKTX'
					                	                			    })
						                	                		 }
			                	                			})],

			                	                			layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),

			                	                
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Location No',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-supcomt-locno',{
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
			                	             


			                	                })]
			                 }),
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'To',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-supcomt-locno_from2',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Supplier Location',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/locfrom_f4help',
							                	                		    controller: oController,
							                	                		    self: this,
							                	                		    label1: 'Desc',
							                	                		    path1: 'DESCR40'
					                	                			    })
						                	                		 }
			                	                			})],

			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),

			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'To',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-supcomt-matnr2',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Material No',
							                	                			path: 'MATNR',
							                	                		    bindingContext: '/mat_f4help',
							                	                		    controller: oController,
							                	                		    self: this,
							                	                		    label1: 'Desc',
							                	                		    path1: 'MAKTX'
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
		var labText01 = oController.getLastPersistSNC() ;
		var oLab01 = new sap.ui.commons.Label( {text: labText01}) ;
		var oTb = sapui5.table.createTable({id: 'tb-supcomt02', 
			                                title: labText01,
			                                reportName: 'Supplier Commitment Status Report',
			                                toolbar: true}, 
							                 [{label: 'Supplier Loc', path: 'LOCNO_FROM',width: "120px"},
							                  {label: 'Supplier Name', path: 'DESCR40_FROM',width: "120px"},
							                  {label: 'Product', path: 'MATNR',width: "120px"},
							                  {label: 'Location', path: 'LOCNO',width: "60px"},
							                  {label: 'VMI Hub stock',  path: 'STOCK_QTY',width: "100px"},
							                  {label: 'Month to-go demand',  path: 'MAT_QTY_MD',width: "110px"},
							                  {label: 'Month supplier Commit',  path: 'MAT_QTY_MC',width: "120px"},
							                  {label: 'Delta Month',  path: 'DELTA_M',width: "80px"},
							                  {label: 'Quarter to-go demand',  path: 'MAT_QTY_QD',width: "110px"},
							                  {label: 'Quarter supplier Commit',  path: 'MAT_QTY_QC',width: "120px"},
							                  {label: 'Delta Quarter',  path: 'DELTA_Q',width: "80px"},
							                  {label: 'Year to-go demand',  path: 'MAT_QTY_YD',width: "110px"},
							                  {label: 'Year supplier Commit',  path: 'MAT_QTY_YC',width: "120px"},
							                  {label: 'Delta Year', path: 'DELTA_Y',width: "80px"}])							                  
							                  
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