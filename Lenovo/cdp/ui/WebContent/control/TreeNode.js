jQuery.sap.declare("lenovo.control.TreeNode");
sap.ui.commons.TreeNode.extend("TreeNode",{
	// renderer: {}
});
TreeNode.prototype.onclick = function(oEvent){

  var oDomClicked = oEvent.target;

  if(jQuery(oDomClicked).is(".sapUiTreeNode") || jQuery(oDomClicked).is(".sapUiTreeNodeNotSelectable") ){
	  //When user click a Not-Selectable node text, it behaves as clicking on the node itself
	  if(jQuery(oDomClicked).is(".sapUiTreeNodeNotSelectable")){
		  //Get the node itself
		  oDomClicked = jQuery(oDomClicked).closest(".sapUiTreeNode")[0];
	  }

	  //Expand/Collapse
	  if(jQuery(oDomClicked).hasClass("sapUiTreeNodeExpanded")){
		  this.collapse();
	  }
	  else{		  
		var aNodes = this.getTree().getNodes();
		for(var i=0;i<aNodes.length;i++){
			aNodes[i].collapse(true);
		}
		this.expand();
	  }

	  this.getTree().placeFocus(oDomClicked);
	  oDomClicked.focus();

  }
  else if(jQuery(oDomClicked).is(".sapUiTreeNodeContent") || jQuery(oDomClicked).is(".sapUiTreeIcon")){

	  this.getTree().setSelection(this);

	  //Set focus
	  oDomClicked = jQuery(oDomClicked).closest(".sapUiTreeNode")[0];
	  this.getTree().placeFocus(oDomClicked);
	  oDomClicked.focus();
  }

};