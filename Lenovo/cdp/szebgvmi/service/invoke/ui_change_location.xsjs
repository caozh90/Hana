/***
 * function：执行change location相关三个页面的create和update逻辑
 */
var json=JSON.parse(decodeURI($.request.body.asString()));

//var columns = json.columns;
var data = json.data;
//预留字段，用来判断是create或update操作
var OP_TYPE = json.OP_TYPE;
var result="";
var error_message = '';

var MATNR;
var MATNR_DESCR;
var MO_NUM;
var LINE_NUM;
var STORAGE_LOC;
var STATUS;
//var SYS_CREATED_DATE;


var position =0;
var i = 0;
var query;
var conn = $.db.getConnection();
var pcall;
var result_status;

var seq_query;
var pcall_seq;

var privilegeExists;

var pcall_privilege;

// CREATE 
function create_change_location()
{
	for(i=0;i<data.length;i++)
	{
		
		MATNR = data[i].MATNR;
		MATNR_DESCR = data[i].MATNR_DESCR;
		MO_NUM = data[i].MO_NUM;
		LINE_NUM = data[i].LINE_NUM;
		STATUS = data[i].STATUS;
		STORAGE_LOC = data[i].STORAGE_LOC;
//		SYS_CREATED_DATE = data[i].SYS_CREATED_DATE;
		

		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_change_location::createUiChangeLocation"'
			    + '(\''
			    + MATNR+'\',\''
			    + MATNR_DESCR+'\',\''
			    + MO_NUM+'\',\''
			    + STORAGE_LOC+'\',\''
			    + LINE_NUM+'\',\''
			    + STATUS+'\''
			    + ',?,?)';
		
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_change_location::createUiChangeLocation"(?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,MATNR);
			pcall.setString(2,MATNR_DESCR);
			pcall.setString(3,MO_NUM);
			pcall.setString(4,STORAGE_LOC);
			pcall.setString(5,LINE_NUM);
			pcall.setString(6,STATUS);
			
//			pcall.setString(7,SYS_CREATED_DATE);
		
			pcall.execute();
			result_status = pcall.getInteger(7);
			$.response.contentType = "application/json; charset=UTF-8";
			//$.response.setBody("Result Status::"+result_status);
			if(result_status === 0)
			{
				error_message = pcall.getNString(1);
				
				$.response.setBody("Error::"+error_message);
				$.response.status = $.net.http.BAD_REQUEST;
				break;
			}
			else if(result_status === 1)
			{
				$.response.setBody("Finished! You can check the result on HANA");
				$.response.status = $.net.http.OK;
			}
			
			pcall.close();
			
		}
		catch(e)
		{	
			error_message = e.message;
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody("Exception::"+error_message);
		}
	}
	try{
		conn.commit();
	}catch(e){
		error_message = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody("Exception::"+error_message);	
	}	
}




//UPDATE 
function edit_change_location()
{
	for(i=0;i<data.length;i++)
	{
	MATNR = data[i].MATNR;
	MATNR_DESCR = data[i].MATNR_DESCR;
	MO_NUM = data[i].MO_NUM;
	LINE_NUM = data[i].LINE_NUM;
	STATUS = data[i].STATUS;
	STORAGE_LOC = data[i].STORAGE_LOC;

	
	query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_change_location::edit_changesl"'
	    + '(\''
	    + MATNR+'\',\''
	    + MATNR_DESCR+'\',\''
	    + MO_NUM+'\',\''
	    + STORAGE_LOC+'\',\''
	    + LINE_NUM+'\',\''
	    + STATUS+'\''
	    + ',?,?)';
	
	query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_change_location::edit_changesl"(?,?,?,?,?,?,?,?)';
	try
	{
		pcall = conn.prepareCall(query);
		pcall.setString(1,MATNR);
		pcall.setString(2,MATNR_DESCR);
		pcall.setString(3,MO_NUM);
		pcall.setString(4,STORAGE_LOC);
		pcall.setString(5,LINE_NUM);
		pcall.setString(6,STATUS);
		
//		pcall.setString(7,SYS_CREATED_DATE);
	
		pcall.execute();
		result_status = pcall.getInteger(7);
		$.response.contentType = "application/json; charset=UTF-8";
		//$.response.setBody("Result Status::"+result_status);
		if(result_status === 0)
		{
			error_message = pcall.getNString(1);
			
			$.response.setBody("Error::"+error_message);
			$.response.status = $.net.http.BAD_REQUEST;
			break;
		}
		else if(result_status === 1)
		{
			$.response.setBody("Finished! You can check the result on HANA");
			$.response.status = $.net.http.OK;
		}
		
		pcall.close();
		
	}
	catch(e)
	{	
		error_message = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody("Exception::"+error_message);
	}
}
	try{
		conn.commit();
	}catch(e){
		error_message = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody("Exception::"+error_message);	
	}	
}





if ( OP_TYPE === 'CREATE' ){
	create_change_location();
}
else if ( OP_TYPE === 'UPDATE'){
		edit_change_location();
}


//		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.edit_changesl::editUiManualPull"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
//
//		try
//		{
//			pcall = conn.prepareCall(query);
//			pcall = conn.prepareCall(query);
//			pcall.setString(1,MATNR);
//			pcall.setString(2,MATNR_DESCR);
//			pcall.setString(3,MO_NUM);
//			pcall.setString(4,LINE_NUM);
//			pcall.setString(5,STATUS);
//			pcall.setString(6,STORAGE_LOC);
////			pcall.setString(7,SYS_CREATED_DATE);
//			pcall.execute();
//			result_status = pcall.getInteger(22);
//			$.response.contentType = "application/json; charset=UTF-8";
//			//$.response.setBody("Result Status::"+result_status);
//			if(result_status === 0)
//			{
//				error_message = pcall.getNString(23);
//				$.response.setBody("Error::"+error_message);
//				$.response.status = $.net.http.BAD_REQUEST;
//				break;
//			}
//			else if(result_status === 1)
//			{
//				$.response.setBody("Finished! You can check the result on HANA");
//				$.response.status = $.net.http.OK;
//			}
//			
//			pcall.close();
//			conn.commit();	
//		}
//		catch(e)
//		{	
//			error_message = e.message;
//			$.response.status = $.net.http.BAD_REQUEST;
//			$.response.setBody("Exception::"+error_message);
//		}
//		
//	}


//XSJS start
//
//if(data.length>0)
//{
//	/**
//	 * manual pull:"MANUAL";
//	 * pull from supplier:"SHIPPING_GROUP";
//	 * manual packaging:"MANUAL_PACKAGING";
//	 */
//	PULL_TYPE = data[0].PULL_TYPE;
//	if(OP_TYPE === 'CREATE')
//	{
//		//验证权限.针对不同页面验证
//		if(PULL_TYPE === 'MANUAL')
//		{
//			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
//				+'\'manualpull::createable\',?)';
//			pcall_privilege = conn.prepareCall(query);
//			pcall_privilege.execute();
//			privilegeExists = pcall_privilege.getNString(1);
//		}
//		else if(PULL_TYPE === 'SHIPPING_GROUP')
//		{
//			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
//				+'\'pullfromsupplier::createable\',?)';
//			pcall_privilege = conn.prepareCall(query);
//			pcall_privilege.execute(); 
//			privilegeExists = pcall_privilege.getNString(1);
//		}
//		else if(PULL_TYPE === 'MANUAL_PACKAGING')
//		{
//			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
//				+'\'manualpackaging::createable\',?)';
//			pcall_privilege = conn.prepareCall(query);
//			pcall_privilege.execute();
//			privilegeExists = pcall_privilege.getNString(1);
//		}
//
//
//		if(privilegeExists === 'OK')
//		{
//			create_manual_pull();
//		}
//		else
//		{
//			$.response.setBody("Insufficient privilege!");
//			$.response.status = $.net.http.BAD_REQUEST;
//		}
//		
//	}
//	else if(OP_TYPE === 'UPDATE')
//	{
//		/**
//		 * manual pull:"MANUAL";
//		 * pull from supplier:"SHIPPING_GROUP";
//		 * manual packaging:"MANUAL_PACKAGING";
//		 */
//		//验证权限.针对不同页面验证
//		if(PULL_TYPE === 'MANUAL')
//		{
//			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
//				+'\'manualpull::editable\',?)';
//			pcall_privilege = conn.prepareCall(query);
//			pcall_privilege.execute();
//			privilegeExists = pcall_privilege.getNString(1);
//		}
//		else if(PULL_TYPE === 'SHIPPING_GROUP')
//		{
//			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
//				+'\'pullfromsupplier::editable\',?)';
//			pcall_privilege = conn.prepareCall(query);
//			pcall_privilege.execute();
//			privilegeExists = pcall_privilege.getNString(1);
//		}
//		else if(PULL_TYPE === 'MANUAL_PACKAGING')
//		{
//			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
//				+'\'manualpackaging::editable\',?)';
//			pcall_privilege = conn.prepareCall(query);
//			pcall_privilege.execute();
//			privilegeExists = pcall_privilege.getNString(1);
//		}
//
//		if(privilegeExists === 'OK')
//		{
//			update_manual_pull();
//		}
//		else
//		{
//			$.response.setBody("Insufficient privilege!");
//			$.response.status = $.net.http.BAD_REQUEST;
//		}
//		
//	}
//
//}
//else
//{
//	$.response.setBody("No data!");
//	$.response.status = $.net.http.BAD_REQUEST;
//}



