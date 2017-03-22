jQuery.sap.declare("lenovo.control.Route");
lenovo.control.Route = {
	subRoutes: [],
	getNodesRoute: function(nodes, parentNode){
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var path = node.path || node.text;
			node.fullPath = parentNode && parentNode.fullPath ? parentNode.fullPath + "/" + path : path;
			if (node.nodes) {
				this.getNodesRoute(node.nodes, node);
			}
			this.subRoutes.push(this._getNodeRoute(node, parentNode));
		}
	},
	_getNodeRoute: function(node, parentNode) {
		var path = node.path || node.text;
		var obj = {
			pattern: node.fullPath + "/:tab:",
			name: node.text,
			viewType: "JS"
		};
		var module = node.module || parentNode.module;
		switch(module){
			case "common": 
			obj.view = "lenovo.view.common." + node.fullPath.replace(/\//g, '.') /*+ "." + path*/;
			break;
			case "vmi": 
			obj.view = "lenovo.view.vmi." + node.fullPath.replace(/\//g, '.')/* + "." + path*/;
			break;
			case "cfe": 
			obj.view = "lenovo.view.cfe." + node.fullPath.replace(/\//g, '.') /*+ "." + path*/;
			break;
			case "szvmi": 
			obj.view = "lenovo.view.szvmi." + node.fullPath.replace(/\//g, '.') /*+ "." + path*/;
			break;
			case "lcpe": 
			obj.view = "lenovo.view.lcpe." + node.fullPath.replace(/\//g, '.') /*+ "." + path*/;
			break;
			case "ebgdf": 
			obj.view = "lenovo.view.ebgdf." + node.fullPath.replace(/\//g, '.') /*+ "." + path*/;
			break;
		}
		return obj;
	}
};