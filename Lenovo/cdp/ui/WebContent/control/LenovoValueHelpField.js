/****************************************
 * Created by Chris Gao
 * 2015-09-19
 * to set the disable for value help field
 *****************************************/
sap.ui.commons.ValueHelpField.extend("lenovo.control.LenovoValueHelpField", { 
	// call the new Control type "LenovoValueHelpField"                                                
	// and let it inherit from sap.ui.commons.ValueHelpField
		renderer: {
	        // note that NO render() function is given here! The TextField's render() function is used. 
	        // But one function is overwritten:
	        renderInnerAttributes: function(rm, oControl) {
	        	
	        	if (!oControl.getVisible()) {
	                return;
	            }
	        	rm.writeAttribute("readonly","readonly");	
	        }
		}
  });