
	var query =	"SELECT COUNT(1) FROM \"SZEBGVMI\".\"PRODUCTIONORDERS_BOM_ASN\" WHERE STATUS = \'IN_PROCESS\'";
	var conn = $.db.getConnection();
	var pcall_COUNT = conn.prepareStatement(query);
	var rs_process = pcall_COUNT.executeQuery();
	var inprocessCount = 0;
	
	rs_process.next();
	try{
	 var inprocessCount = rs_process.getInteger(1);//get current work step
	}
	catch(e){ 
		//$.response.setBody(e.message);
		if(e.columnNumber === 0){
			inprocessCount = 0;
		}			
	}

	rs_process.close();
	conn.close();
	
	$.response.contentType = "application/json";//
	$.response.status =  $.net.http.OK;
	$.response.setBody( JSON.stringify(inprocessCount) );
	
	

