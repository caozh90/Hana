
try{
	if($.net.http.POST){
		
		var oNavItems = JSON.parse($.request.body.asString());
		
		Object.keys(oNavItems).forEach(function(key){ 
		   var subKey = 0;
		   while(subKey < oNavItems[key].subItems.length){
		     if(!$.session.hasAppPrivilege(oNavItems[key].subItems[subKey].privilege)){
		        oNavItems[key].subItems.splice(subKey, 1);
		     }else{
		        subKey++;
		     }
		   }
		});
		
		$.response.setBody(JSON.stringify(oNavItems));
		$.response.contentType = "application/json";
		$.response.status = $.net.http.OK;
	}
}catch(e){
	$.response.setBody(e.toString());
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}



