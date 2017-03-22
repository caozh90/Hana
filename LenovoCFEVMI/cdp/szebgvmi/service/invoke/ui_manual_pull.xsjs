/***
 * function：执行MANUAL_PULL相关三个页面的create和update逻辑
 */
var json=JSON.parse(decodeURI($.request.body.asString()));

//var columns = json.columns;
var data = json.data;
//预留字段，用来判断是create或update操作
var OP_TYPE = json.OP_TYPE;
var result="";
var error_message = '';

var PULL_HEADER_ID;
var PULL_LINE_ID;
var DEST_STORAGE_LOC;
var DEST_STORAGE_TYPE;
var DEST_STORAGE_BIN;
var SRC_WERKS;
var PHYSICAL_PLANT;
var INVENTORY_TYPE;
var PRODUCTION_LINE;
var HEAD_SUPPLIERID;
var DELIVERY_DATE;
var MATNR;
var PULL_QTY;
var SRC_STORAGE_TYPE;
var SRC_STORAGE_BIN;
var SRC_STORAGE_LOC;
var LINE_SUPPLIERID;
var REMARK;
var SYS_CREATED_DATE;
var STATUS;
//根据PULL_TYPE的值区分请求的页面
var PULL_TYPE;

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

function create_manual_pull()
{
	seq_query = 'call "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_manual_pull::generate_pull_header_id"(?)';
	pcall_seq = conn.prepareCall(seq_query);
	pcall_seq.execute();
	PULL_HEADER_ID = pcall_seq.getNString(1);
	
	for(i=0;i<data.length;i++)
	{
		DEST_STORAGE_LOC = data[i].DEST_STORAGE_LOC;
		DEST_STORAGE_TYPE = data[i].DEST_STORAGE_TYPE;
		DEST_STORAGE_BIN = data[i].DEST_STORAGE_BIN;
		SRC_WERKS = data[i].SRC_WERKS;
		PHYSICAL_PLANT = data[i].PHYSICAL_PLANT;
		INVENTORY_TYPE = data[i].INVENTORY_TYPE;
		PRODUCTION_LINE = data[i].PRODUCTION_LINE;
		HEAD_SUPPLIERID = data[i].HEAD_SUPPLIERID;
		DELIVERY_DATE = data[i].DELIVERY_DATE;
		MATNR = data[i].MATNR;
		PULL_QTY = data[i].PULL_QTY;
		SRC_STORAGE_TYPE = data[i].SRC_STORAGE_TYPE;
		SRC_STORAGE_BIN = data[i].SRC_STORAGE_BIN;
		SRC_STORAGE_LOC = data[i].SRC_STORAGE_LOC;
		LINE_SUPPLIERID = data[i].LINE_SUPPLIERID;
		REMARK = data[i].REMARK;
		PULL_TYPE = data[i].PULL_TYPE;
		STATUS = data[i].STATUS;
		SYS_CREATED_DATE = data[i].SYS_CREATED_DATE;
		

		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_manual_pull::createUiManualPull"'
			    + '(\''
			    + DEST_STORAGE_LOC+'\',\''
			    + DEST_STORAGE_TYPE+'\',\''
			    + DEST_STORAGE_BIN+'\',\''
			    + SRC_WERKS+'\',\''
			    + PHYSICAL_PLANT+'\',\''
			    + INVENTORY_TYPE+'\',\''
			    + PRODUCTION_LINE+'\',\''
			    + HEAD_SUPPLIERID+'\',\''
			    + DELIVERY_DATE+'\',\''
			    + MATNR+'\',\''
			    + PULL_QTY+'\',\''
			    + SRC_STORAGE_TYPE+'\',\''
			    + SRC_STORAGE_BIN+'\',\''
			    + SRC_STORAGE_LOC+'\',\''
			    + LINE_SUPPLIERID+'\',\''
			    + REMARK+'\',\''
			    + PULL_TYPE+'\',\''
			    + SYS_CREATED_DATE+ '\',\''
			    + PULL_HEADER_ID + '\',\''
			    + STATUS + '\''
			    + ',?,?)';
		
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_manual_pull::createUiManualPull"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		try
		{
			pcall = conn.prepareCall(query);
			pcall.setString(1,DEST_STORAGE_LOC);
			pcall.setString(2,DEST_STORAGE_TYPE);
			pcall.setString(3,DEST_STORAGE_BIN);
			pcall.setString(4,SRC_WERKS);
			pcall.setString(5,PHYSICAL_PLANT);
			pcall.setString(6,INVENTORY_TYPE);
			pcall.setString(7,PRODUCTION_LINE);
			pcall.setString(8,HEAD_SUPPLIERID);
			pcall.setString(9,DELIVERY_DATE);
			pcall.setString(10,MATNR);
			pcall.setString(11,PULL_QTY);
			pcall.setString(12,SRC_STORAGE_TYPE);
			pcall.setString(13,SRC_STORAGE_BIN);
			pcall.setString(14,SRC_STORAGE_LOC);
			pcall.setString(15,LINE_SUPPLIERID);
			pcall.setString(16,REMARK);
			pcall.setString(17,PULL_TYPE);
			pcall.setString(18,SYS_CREATED_DATE);
			pcall.setString(19,PULL_HEADER_ID);
			pcall.setString(20,STATUS);
		
			pcall.execute();
			result_status = pcall.getInteger(21);
			$.response.contentType = "application/json; charset=UTF-8";
			//$.response.setBody("Result Status::"+result_status);
			if(result_status === 0)
			{
				error_message = pcall.getNString(22);
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
//			conn.commit();		"commented by caozh4
			
		}
		catch(e)
		{	
			error_message = e.message;
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody("Exception::"+error_message);
		}
	}
	try{
		conn.commit();	//add by caozh4
	}catch(e){
		error_message = e.message;
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody("Exception::"+error_message);	
	}	
}

function update_manual_pull()
{
	for(i=0;i<data.length;i++)
	{
		DEST_STORAGE_LOC = data[i].DEST_STORAGE_LOC;
		DEST_STORAGE_TYPE = data[i].DEST_STORAGE_TYPE;
		DEST_STORAGE_BIN = data[i].DEST_STORAGE_BIN;
		SRC_WERKS = data[i].SRC_WERKS;
		PHYSICAL_PLANT = data[i].PHYSICAL_PLANT;
		INVENTORY_TYPE = data[i].INVENTORY_TYPE;
		PRODUCTION_LINE = data[i].PRODUCTION_LINE;
		HEAD_SUPPLIERID = data[i].HEAD_SUPPLIERID;
		DELIVERY_DATE = data[i].DELIVERY_DATE;
		MATNR = data[i].MATNR;
		PULL_QTY = data[i].PULL_QTY;
		SRC_STORAGE_TYPE = data[i].SRC_STORAGE_TYPE;
		SRC_STORAGE_BIN = data[i].SRC_STORAGE_BIN;
		SRC_STORAGE_LOC = data[i].SRC_STORAGE_LOC;
		LINE_SUPPLIERID = data[i].LINE_SUPPLIERID;
		REMARK = data[i].REMARK;
		PULL_TYPE = data[i].PULL_TYPE;
		SYS_CREATED_DATE = data[i].SYS_CREATED_DATE;
		STATUS = data[i].STATUS;
		PULL_HEADER_ID = data[i].PULL_HEADER_ID;
		PULL_LINE_ID = data[i].PULL_LINE_ID;
		
		if(PULL_HEADER_ID === undefined)
		{
				error_message = 'PULL_HEADER_ID cannot be null!';
				$.response.setBody("Error::"+error_message);
				$.response.status = $.net.http.BAD_REQUEST;
				break;
		}
			
		if(PULL_LINE_ID === undefined || PULL_LINE_ID.length<=0)
		{
				PULL_LINE_ID='NEW';
		}
			
	/*	query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_manual_pull::editUiManualPull"'
			    + '(\''
			    
			    + PULL_HEADER_ID+'\',\''
			    + PULL_LINE_ID+'\',\''
			    + DEST_STORAGE_LOC+'\',\''
			    + DEST_STORAGE_TYPE+'\',\''
			    + DEST_STORAGE_BIN+'\',\''
			    + SRC_WERKS+'\',\''
			    + PHYSICAL_PLANT+'\',\''
			    + INVENTORY_TYPE+'\',\''
			    + PRODUCTION_LINE+'\',\''
			    + HEAD_SUPPLIERID+'\',\''
			    + DELIVERY_DATE+'\',\''
			    + MATNR+'\',\''
			    + PULL_QTY+'\',\''
			    + SRC_STORAGE_TYPE+'\',\''
			    + SRC_STORAGE_BIN+'\',\''
			    + SRC_STORAGE_LOC+'\',\''
			    + LINE_SUPPLIERID+'\',\''
			    + REMARK+'\',\''
			    + PULL_TYPE+'\',\''
			    + SYS_CREATED_DATE+'\',\''
			    + STATUS +'\''
			    + ',?,?)';*/
		query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_manual_pull::editUiManualPull"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

		try
		{
			pcall = conn.prepareCall(query);
			pcall = conn.prepareCall(query);
			pcall.setString(1,PULL_HEADER_ID);
			pcall.setString(2,PULL_LINE_ID);
			pcall.setString(3,DEST_STORAGE_LOC);
			pcall.setString(4,DEST_STORAGE_TYPE);
			pcall.setString(5,DEST_STORAGE_BIN);
			pcall.setString(6,SRC_WERKS);
			pcall.setString(7,PHYSICAL_PLANT);
			pcall.setString(8,INVENTORY_TYPE);
			pcall.setString(9,PRODUCTION_LINE);
			pcall.setString(10,HEAD_SUPPLIERID);
			pcall.setString(11,DELIVERY_DATE);
			pcall.setString(12,MATNR);
			pcall.setString(13,PULL_QTY);
			pcall.setString(14,SRC_STORAGE_TYPE);
			pcall.setString(15,SRC_STORAGE_BIN);
			pcall.setString(16,SRC_STORAGE_LOC);
			pcall.setString(17,LINE_SUPPLIERID);
			pcall.setString(18,REMARK);
			pcall.setString(19,PULL_TYPE);
			pcall.setString(20,SYS_CREATED_DATE);
			pcall.setString(21,STATUS);
			pcall.execute();
			result_status = pcall.getInteger(22);
			$.response.contentType = "application/json; charset=UTF-8";
			//$.response.setBody("Result Status::"+result_status);
			if(result_status === 0)
			{
				error_message = pcall.getNString(23);
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
			conn.commit();	
		}
		catch(e)
		{	
			error_message = e.message;
			$.response.status = $.net.http.BAD_REQUEST;
			$.response.setBody("Exception::"+error_message);
		}
		
	}
}

//XSJS start

if(data.length>0)
{
	/**
	 * manual pull:"MANUAL";
	 * pull from supplier:"SHIPPING_GROUP";
	 * manual packaging:"MANUAL_PACKAGING";
	 */
	PULL_TYPE = data[0].PULL_TYPE;
	if(OP_TYPE === 'CREATE')
	{
		//验证权限.针对不同页面验证
		if(PULL_TYPE === 'MANUAL')
		{
			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
				+'\'manualpull::createable\',?)';
			pcall_privilege = conn.prepareCall(query);
			pcall_privilege.execute();
			privilegeExists = pcall_privilege.getNString(1);
		}
		else if(PULL_TYPE === 'SHIPPING_GROUP')
		{
			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
				+'\'pullfromsupplier::createable\',?)';
			pcall_privilege = conn.prepareCall(query);
			pcall_privilege.execute(); 
			privilegeExists = pcall_privilege.getNString(1);
		}
		else if(PULL_TYPE === 'MANUAL_PACKAGING')
		{
			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
				+'\'manualpackaging::createable\',?)';
			pcall_privilege = conn.prepareCall(query);
			pcall_privilege.execute();
			privilegeExists = pcall_privilege.getNString(1);
		}


		if(privilegeExists === 'OK')
		{
			create_manual_pull();
		}
		else
		{
			$.response.setBody("Insufficient privilege!");
			$.response.status = $.net.http.BAD_REQUEST;
		}
		
	}
	else if(OP_TYPE === 'UPDATE')
	{
		/**
		 * manual pull:"MANUAL";
		 * pull from supplier:"SHIPPING_GROUP";
		 * manual packaging:"MANUAL_PACKAGING";
		 */
		//验证权限.针对不同页面验证
		if(PULL_TYPE === 'MANUAL')
		{
			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
				+'\'manualpull::editable\',?)';
			pcall_privilege = conn.prepareCall(query);
			pcall_privilege.execute();
			privilegeExists = pcall_privilege.getNString(1);
		}
		else if(PULL_TYPE === 'SHIPPING_GROUP')
		{
			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
				+'\'pullfromsupplier::editable\',?)';
			pcall_privilege = conn.prepareCall(query);
			pcall_privilege.execute();
			privilegeExists = pcall_privilege.getNString(1);
		}
		else if(PULL_TYPE === 'MANUAL_PACKAGING')
		{
			query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
				+'\'manualpackaging::editable\',?)';
			pcall_privilege = conn.prepareCall(query);
			pcall_privilege.execute();
			privilegeExists = pcall_privilege.getNString(1);
		}

		if(privilegeExists === 'OK')
		{
			update_manual_pull();
		}
		else
		{
			$.response.setBody("Insufficient privilege!");
			$.response.status = $.net.http.BAD_REQUEST;
		}
		
	}

}
else
{
	$.response.setBody("No data!");
	$.response.status = $.net.http.BAD_REQUEST;
}



