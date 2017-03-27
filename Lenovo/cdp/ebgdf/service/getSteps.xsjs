var username = $.session.getUsername();

	if (username !== "") {

	username = '';
	
	var query = "SELECT TOP 1 STEP FROM \"_SYS_BIC\".\"cdp.ebgdf.models.ui_getstep/CV_UI_WORK_STEP\"";
	var conn = $.db.getConnection();
	var pcall_STEP = conn.prepareStatement(query);
	var rs_step = pcall_STEP.executeQuery();
	var nextStep = 0;
	
	rs_step.next();
	try{
	 var currStep = rs_step.getInteger(1);//get current work step
	}
	catch(e){ 
		//$.response.setBody(e.message);
		if(e.columnNumber === 0){
			currStep = 0;
		}			
	}

	rs_step.close();
	conn.close();
	
	//nextStep = nextStep + 1;
	nextStep = currStep;
	
	
	
	$.response.contentType = "application/json";//
	$.response.status =  $.net.http.OK;
	$.response.setBody( JSON.stringify(nextStep) );
	
	

}
