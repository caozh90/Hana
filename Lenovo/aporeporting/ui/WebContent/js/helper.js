var sapui5 = sapui5 || {};
   
sapui5.table = {
		createTable : function(args, oColumns){
		  var oTable = new sap.ui.table.Table({
			  id: args.id,
			  title: args.title || "",
			  width : args.width || "100%",
			  visibleRowCount: args.visibleRowCount || 15,
			  selectionMode: args.selectionMode || sap.ui.table.SelectionMode.Single, 
			  showNoData: false,
			  visible: true,
			  rowSelectionChange: args.rowSelectionChange || function(){},
//		      navigationMode: sap.ui.table.NavigationMode.Paginator,
			  navigationMode: args.navigationMode || sap.ui.table.NavigationMode.Paginator,
			  fixedColumnCount: args.fixedColumn , 
		      toolbar: args.toolbar && new sap.ui.commons.Toolbar({items: [ 
		               new sap.ui.commons.Button({text: "Export",
		            	                          style: sap.ui.commons.ButtonStyle.Emph,
		            	                          press: function() {
//		            	                        	  try{
//		            	                        		  oTable.setBusy(true);
//		            	                        		  
//		            	                        		  var oExport = oTable.exportData(); 
//		            	                        		  
//		            	                        		  var oPromise = oExport.saveFile(args.reportName || args.title);
//		            	                        		  
//		            	                        		  oPromise.then(function(arg1){
//		            	                        			  console.log('success');
//		            	                        			  if(oTable.getBusy()){
//		            	                        				 oTable.setBusy(false);
//		            	                        			  }
//		            	                        		  }, function(){
//		            	                        			  console.log('failed');
//		            	                        			  if(oTable.getBusy()){
//			            	                        				 oTable.setBusy(false);
//			            	                        		  }
//		            	                        		  });
//		            	                        	  }catch(e){
//		            	                        		  alert('Table content is empty!');
//		            	                        	  }
		            	                        	  
		            	                        	 try{
		            	                        		 var oBinding = oTable.getBinding(),
		            	                        		     aColumns = oTable.getColumns(),          	                        		 
		            	          
		            	                        		     
		            	                        		     sPath = oBinding.sPath;
		            	                        		 
		            	                        		 	 if ( sPath === '/sup_comt02' || sPath === '/safestk02' )
		            	                        		 		 {sFlag = 'X'}
		            	                        		 	 else
		            	                        		 		 {sFlag = ''}
		            	                        		 			 
		            	                        		 var
		            	                        		     //exceptional case for supplier commitment report
			            	                        	     aFilter = sFlag === 'X' ? oBinding.aApplicationFilters : oBinding.aApplicationFilters[0].aFilters, //multiple filters
			            	                        	     sView = '',
			            	                        	     sParam = '',
			            	                        	     sParamValue = '',
			            	                        	     sFilter= '',
			            	                        	     
			            	                        	     sSqlColumn = '',
			            	                        	     sHeader = '',
			            	                        	     sReq = '/aporeporting/xsjs/download.xsjs',
			            	                        	     sFileName = 'filename='+args.reportName || args.title;
			            	                        	     
			            	                        	 if(sPath.indexOf('(') !== -1){
			            	                        		sView = 'view='+ sPath.split('(')[0].replace('/', '');
			            	                        		// TO-DO: need to consider parameter as array
			            	                        		sParam = 'p='+ sPath.split('(')[1].split(')/')[0].split('=')[0];
			            	                        		sParamValue = 'pv='+ sPath.split('(')[1].split(')/')[0].split('=')[1];
			            	                        	 }else{
			            	                        		sView ='view='+sPath.replace('/','');
			            	                        	 }
			            	                        	 
			            	                        	 // multiple filters
			            	                        	 if(aFilter){
			            	                        		 //exceptional case for supplier commitment report
			            	                        		 if(sFlag === 'X'){
			            	                        			 aFilter.forEach(function(oFilter, index){
				            	                        			 var sF = '';
			            	                        				 if(oFilter.sOperator === 'BT'){
			            	                        					sF = "\""+oFilter.sPath+"\""+' between '+"'"+oFilter.oValue1+"'"+' and '+"'"+oFilter.oValue2+"'";
			            	                        				 }else{
			            	                        					sF = "\""+oFilter.sPath+"\""+'='+ "'"+oFilter.oValue1+"'";
			            	                        				 }
				            	                        			 sFilter = !index ? 'filter='+sF : sFilter+'and'+sF;
				            	                        		 });
			            	                        		 }else{
			            	                        			 aFilter.forEach(function(oFilter, index){
					            	                        		 if(oFilter._bMultiFilter){
					            	                        			 var sMultiF = '';
					            	                        			 oFilter.aFilters.forEach(function(oFilter, i){
					            	                        				 var sF = "\""+oFilter.sPath+"\""+'='+"'"+oFilter.oValue1+"'";
					            	                        				 sMultiF = !i ? sF : sMultiF+'or'+sF;
					            	                        			 });
					            	                        			 sMultiF = '('+sMultiF+')';
					            	                        			 sFilter = !index ? 'filter='+ sMultiF : sFilter+'and'+ sMultiF;
					            	                        		 }else{
					            	                        			 var sSqlFilter = "\""+oFilter.sPath+"\""+'='+"'"+oFilter.oValue1+"'";
							            	                        	 sFilter = !index ? 'filter='+ sSqlFilter : sFilter+'and'+ sSqlFilter;
					            	                        		 }
					            	                        	 }); 
			            	                        		 }
			            	                        	 }

			            	                        	 sSqlColumn = aColumns.map(function(oColumn){
			            	                        		 
			            	                        		 if(oColumn.getTemplate().getBindingInfo('text')){
			            	                        			 return "\""+oColumn.getTemplate().getBindingInfo('text').parts[0].path+"\"";
			            	                        			 //binding.sPath+"\"";
			            	                        		 }else if(oColumn.getTemplate().getContent()){
			            	                        			 return "\""+oColumn.getTemplate().getContent()[0].getBindingInfo('text').parts[0].path+"\"";
			            	                        			 // binding.sPath+"\"";
			            	                        		 }
			            	                        	 }).join();
			            	                        	 
			            	                        	 sHeader = aColumns.map(function(oColumn){
			            	                        		 return "\""+oColumn.getLabel().getText()+"\"";
			            	                        	 }).join();
			            	                        	 
			            	                        	 [sView,sParam,sParamValue,sFilter].forEach(function(v, i){
			            	                        		 if(v){
			            	                        			 sReq = i ? sReq + "&" + v : sReq + "?" + v;
			            	                        		 } 
			            	                        	 });
			            	                        	 
			            	                        	 sReq = sReq+'&column='+sSqlColumn+'&header='+sHeader+'&'+sFileName;
			            	                        	 
			            	                        	 window.open(sReq);
			            	                        	//test for version control
//			            	                        	 sapui5.table.postForm(sReq, {column: 'abc', header: 'bcd'});
			            	                        	
		            	                        	 } catch(e){
		            	                        		alert('Table content is empty!');
		            	                        	 }
		            	                          }}),
		            new sap.ui.commons.TextView({
		            	text: 'Total Record: 0'
		            })
		      ]})
		  });
		  
		  var that = this;
		  
		  //==== To fill label with calendar week ========
		  var oLabelModel = new sap.ui.model.odata.ODataModel('/aporeporting/odata/apo_reporting.xsodata');
		      oLabelModel.setDefaultCountMode('NONE');
		  var oWeek;
		  
		  oLabelModel.read('/calweek', {async: false, success: function(odata, response){
			  oWeek = odata.results[0];
		  }});
		  //==============================================

		  oColumns.forEach(function(v){
			 var p_week = /WEEK[0-9]/,
			     p_week_p = /WEEK_[0-9]/,
			     p_month = /MONTH[0-9]/,
			     p_month_p = /MONTH_[0-9]/,
			     p_q = /Q[0-9]/,
			     p_q_p = /Q_[0-9]/,
			     p_day = /DAY[0-9]/,
				 label = p_week.test(v.label) || p_week_p.test(v.label) || 
				         p_month.test(v.label) ||  p_month_p.test(v.label) || 
				         p_q.test(v.label) || p_q_p.test(v.label) || p_day.test(v.label) ? oWeek[v.label] : v.label,
			
		     oCol = new sap.ui.table.Column({
				label: label,
				width: v.width,
				template: that.getColumnTemplate(v),
				sortProperty: v.sort || v.path,
				filterProperty: v.filter || v.path,
			 }); 
			 oTable.addColumn(oCol);
		  });
		  
		  return oTable;
		},
		
//		postForm: function(url, params){
//			var temp = document.createElement("form");        
//		    temp.action = url;        
//		    temp.method = "post";        
//		    temp.style.display = "none";        
//		    for (var key in params) {        
//		        var opt = document.createElement("textarea");        
//		        opt.name = key;        
//		        opt.value = params[key];        
//		        // alert(opt.name)        
//		        temp.appendChild(opt);        
//		    }        
//		    
//		    temp.attachEvent("onsubmit", function(){window.open(url);});
//		    document.body.appendChild(temp);  
//		    temp.fireEvent("onsubmit");
//		    temp.submit();        
////		    return temp;   
//		    document.body.removeChild(temp);  
//		},

	    getColumnTemplate: function(oColumn){
	    	
	    	var bindingPath = '{'+oColumn.path+'}',
	    	    uomBindingPath = oColumn.uom_path ? '{'+oColumn.uom_path+'}' : '';
	    	
	    	switch(oColumn.type){
	    	case "TextView":
	    		return new sap.ui.commons.TextView({
	    			text: bindingPath
	    		});
	    		break;
	    	case "TextField":
	    		return new sap.ui.commons.TextField({
	    			value: bindingPath
	    		});
	    		break;
	    	case "TextArea":
	    		return new sap.ui.commons.TextArea({
	    			value: bindingPath,
	    			width: oColumn.width,
	    			tooltip: bindingPath,
	    			editable: false
	    		});
	    		break;
	    	case "amount":
	    		var amount = new sap.ui.commons.TextView({
	    				text: bindingPath
	    		    }),
	    		    uom = new sap.ui.commons.TextView({
		    			text: uomBindingPath
		    		}),
		    		layout = new sap.ui.layout.HorizontalLayout({
		    			content: [amount, uom]
		    		});
	    		
	    		amount.addStyleClass('tb-amount');
	    		return layout;
	    		break;
	        default:
	    		return new sap.ui.commons.TextView({
	    			text: bindingPath
	    		});
	    		break;
	    	}	  
	    }
};

sapui5.selectionDialog = {
		create: function(args){
			
//			args  = {label : 'Planning Version',
//                   path : 'VERSIOD',
//                   bindingContext: '/hub_stock',
//			         controller: oController,
//			         self: this}
			
			var aFilter = [], argValueUpperCase;
			
			var oDTb = sapui5.table.createTable({title: 'Selection',
//												 rowSelectionChange: function(oEvt){
//													
//													selectedValue = selectedValue ? selectedValue +','+oEvt.getParameter('rowContext').getProperty(args.path)
//															                      : oEvt.getParameter('rowContext').getProperty(args.path);
//													
//													oEvt.getSource().getContextByIndex(0).getProperty(args.path)
//													oEvt.getSource().getSelectedIndices()
//													
//												 },
												 selectionMode: sap.ui.table.SelectionMode.MultiToggle,
				                                 visibleRowCount: 5}, 
                                               [{label: args.label, path: args.path}]);
			
            // Capitalize the input values
			if(args.self.getValue()){
				argValueUpperCase = args.self.getValue().toUpperCase();
				args.self.setValue(argValueUpperCase);
				aFilter.push(new sap.ui.model.Filter(args.path, sap.ui.model.FilterOperator.Contains, "'" + argValueUpperCase+ "'"));
			}
			
			aFilter.length ? 
			  oDTb.bindRows(args.bindingContext+'?$select='+ args.path, null, null, aFilter).setModel(args.controller.oDataModel()) :
			  oDTb.bindRows(args.bindingContext+'?$select='+ args.path).setModel(args.controller.oDataModel());
				
			var oBtnOK = new sap.ui.commons.Button({
				text: 'OK',
				width: '50px',
				style: sap.ui.commons.ButtonStyle.Accept,
				press: function(oEvt){
					// multiple selection 
					var selectedValue = oDTb.getSelectedIndices().map(function(i){
											return oDTb.getContextByIndex(i).getProperty(args.path)
										}).join();
						
					args.self.setValue(selectedValue);
					oD.close();
				}
			});
			var oM = new sap.ui.commons.layout.MatrixLayout({});
			
			var oMCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content: [oBtnOK],
				hAlign: sap.ui.commons.layout.HAlign.Right
			})
			
			oM.createRow(oDTb);
            oM.createRow(oMCell);

			var oD = new sap.ui.ux3.OverlayDialog({
				width: '50%',
				height: '35%',
				content: [oM]
			});
			
			oD.open();
		}
}

sapui5.checkUserPrivilege = function(oNavItems){
	if(typeof oNavItems === 'object' && oNavItems){
		$.ajax({
    		type: "POST",	
    		headers:{
    			"Content-Type": "application/json"
    		},
    		async: false,
    		data: JSON.stringify(oNavItems),
    		url: '/aporeporting/xsjs/checkUserPrivilege.xsjs',
    	}).done(function(data){
    		oNavItems = data;
    	}).fail(function(data){
    		alert('User Privilege Check Failed!');
    	});
		
		return oNavItems;
	}
}


sapui5.selectionDialog2 = {
		create: function(args){
			
//			args  = {label : 'Planning Version',
//                   path : 'VERSIOD',
//                   bindingContext: '/hub_stock',
//			         controller: oController,
//			         self: this,
//					 label2: 'Desc',
//					 path2: 'LOCNO'}
			
			var selectedValue, aFilter = [], argValueUpperCase;
			
			var oDTb = sapui5.table.createTable({title: 'Selection',
												 rowSelectionChange: function(oEvt){
													 selectedValue = oEvt.getParameter('rowContext').getProperty(args.path);
												 },
				                                 visibleRowCount: 5}, 
            
				                                 [{label: args.label, path: args.path},{label: args.label1, path: args.path1}]);
		    
			// Capitalize the input values
			if(args.self.getValue()){
				argValueUpperCase = args.self.getValue().toUpperCase();
				args.self.setValue(argValueUpperCase);
				aFilter.push(new sap.ui.model.Filter(args.path, sap.ui.model.FilterOperator.Contains, "'" + argValueUpperCase+ "'"));
			}
			
			aFilter.length ? 
					  oDTb.bindRows(args.bindingContext+'?$select='+ args.path+','+args.path1, null, null, aFilter).setModel(args.controller.oDataModel()) :
					  oDTb.bindRows(args.bindingContext+'?$select='+ args.path+','+args.path1).setModel(args.controller.oDataModel());

			var oBtnOK = new sap.ui.commons.Button({
				text: 'OK',
				width: '50px',
				style: sap.ui.commons.ButtonStyle.Accept,
				press: function(){
					var val = selectedValue;
					args.self.setValue(val);
					oD.close();
				}
			});
			var oM = new sap.ui.commons.layout.MatrixLayout({});
			
			var oMCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content: [oBtnOK],
				hAlign: sap.ui.commons.layout.HAlign.Right
			})
			
			oM.createRow(oDTb);
            oM.createRow(oMCell);

			var oD = new sap.ui.ux3.OverlayDialog({
				width: '50%',
				height: '35%',
				content: [oM]
			});
			
			oD.open();
		}
}


sapui5.selectionDialog3 = {
		create: function(args){
			
//			args  = {label : 'Planning Version',
//                   path : 'VERSIOD',
//                   bindingContext: '/hub_stock',
//			         controller: oController,
//			         self: this,
//					 label2: 'Desc',
//					 path2: 'LOCNO'}
			
			var selectedValue, aFilter = [], argValueUpperCase;
			
			var oDTb = sapui5.table.createTable({title: 'Selection',
												 rowSelectionChange: function(oEvt){
													 selectedValue = oEvt.getParameter('rowContext').getProperty(args.path);
												 },
				                                 visibleRowCount: 5}, 
            
				                                 [{label: args.label, path: args.path}]);
		    
			// Capitalize the input values
			if(args.self.getValue()){
				argValueUpperCase = args.self.getValue().toUpperCase();
				args.self.setValue(argValueUpperCase);
				aFilter.push(new sap.ui.model.Filter(args.path, sap.ui.model.FilterOperator.Contains, "'" + argValueUpperCase+ "'"));
			}
			
			aFilter.length ? 
					  oDTb.bindRows(args.bindingContext+'?$select='+ args.path+','+args.path, null, null, aFilter).setModel(args.controller.oDataModel()) :
					  oDTb.bindRows(args.bindingContext+'?$select='+ args.path+','+args.path).setModel(args.controller.oDataModel());

			var oBtnOK = new sap.ui.commons.Button({
				text: 'OK',
				width: '50px',
				style: sap.ui.commons.ButtonStyle.Accept,
				press: function(){
					var val = selectedValue;
					args.self.setValue(val);
					oD.close();
				}
			});
			var oM = new sap.ui.commons.layout.MatrixLayout({});
			
			var oMCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content: [oBtnOK],
				hAlign: sap.ui.commons.layout.HAlign.Right
			})
			
			oM.createRow(oDTb);
            oM.createRow(oMCell);

			var oD = new sap.ui.ux3.OverlayDialog({
				width: '50%',
				height: '35%',
				content: [oM]
			});
			
			oD.open();
		}
}


