sap.ui.jsview("ui.safestk.safestk", {
  
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ui.safestk
	*/ 
	getControllerName : function() {
		return "ui.safestk.safestk";
	},   

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ui.safestk
	*/ 
	createContent : function(oController) {
		
		var oForm = new sap.ui.layout.form.Form({
			layout: new sap.ui.layout.form.ResponsiveLayout(),
			formContainers: [  
			                 new sap.ui.layout.form.FormContainer({
			                	 formElements: [
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'Customer Location',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-locno_to',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Customer Location',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/loc_f4help02',
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
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-matnr',{
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
			                	                	label: 'Supplier',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-locno_fr',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Supplier',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/locfrom_f4help02',
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
			                	                	label: 'Purchase Group',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-ekgrp',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog3.create({
							                	                			label: 'Purchase Group',
							                	                			path: 'EKGRP',
							                	                		    bindingContext: '/ekgrp_f4help',
							                	                		    controller: oController,
							                	                		    self: this
					                	                			    })
						                	                		 }
			                	                			})],

			                	                	layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, margin: false})
			                	                }),
			                	                new sap.ui.layout.form.FormElement({
			                	                	label: 'MRP Controller',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-dispo',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog3.create({
							                	                			label: 'MRP Controller',
							                	                			path: 'DISPO',
							                	                		    bindingContext: '/dispo_f4help',
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
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-locno_to2',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Customer Location',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/loc_f4help02',
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
			                	                	label: 'to',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-matnr2',{
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
			                	                	label: 'To',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-locno_fr2',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog2.create({
							                	                			label: 'Supplier Location',
							                	                			path: 'LOCNO',
							                	                		    bindingContext: '/locfrom_f4help02',
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
			                	                	label: 'Commodity Code',
			                	                	fields: [new sap.ui.commons.ValueHelpField('vf-safestk-stawn',{
						                	                		valueHelpRequest: function(){
						                	                			sapui5.selectionDialog3.create({
							                	                			label: 'Commodity Code',
							                	                			path: 'STAWN',
							                	                		    bindingContext: '/stawn_f4help',
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
		
		
		var oTb = sapui5.table.createTable({id: 'tb-safestk02', 
			                                title: 'Detail',
			                                reportName: 'Safety Stock List Report',
			                                toolbar: true}, 
							                 [
							                  {label: 'MRP Cycle', path: 'MRPCYCL'},
							                  {label: 'Product NO', path: 'MATNR',width: "120px"},
							                  {label: 'Product Name', path: 'MAKTX',width: "120px"},
							                  {label: 'Customer NO', path: 'LOCNO_TO'},
							                  {label: 'Customer Name', path: 'DESCR40_TO',width: "120px"},
							                  {label: 'Supplier No', path: 'LOCNO_FROM',width: "120px"},	
							                  {label: 'Supplier Name', path: 'DESCR40_FR',width: "120px"},	
							                  {label: 'Hub Part', path: 'REPLTYPE'},
							                  {label: 'DGR',  path: 'DGR'},
							                  {label: 'Rev. Sfty DoS',  path: 'SAFEDAYS'},
							                  {label: 'Fin. Sfty Qty',  path: 'SAFESTOCK'},
							                  {label: 'Fin. Sfty Ins Dte',  path: 'FINALINS'},
							                  {label: 'Fin. Sfty Rem Dte',  path: 'FINALREM'},
							                  {label: 'DoS Chngd',  path: 'DOS_FLAG',width: "30px"},
							                  {label: 'Consu. Qty',  path: 'ABS_CONSU_QTY'}
							                  ]) ;
	
		// Create a horizontal scrollbar with size 200 px and content size 500 px
		var oHSB = new sap.ui.core.ScrollBar("horiSB_SF");
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