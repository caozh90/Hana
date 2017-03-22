
var json=JSON.parse(decodeURI($.request.body.asString()));

var data = json.data;
var result="";
var error_message;

var LOGICAL_PLANT = json.LOGICAL_PLANT;
var ITEM = json.ITEM;
var ITEMDESC = json.ITEMDESC;
var OP_TYPE = json.OP_TYPE;
var START_DATE = json.START_DATE;
var END_DATE = json.END_DATE;
var CREATE_TIME = json.SYS_CREATED_DATE;
var VENDORID ;
var VENDORNAME;
var PROPORTION;

var i=0;
var conn = $.db.getConnection();
var pcall;
var result_status;
var query;
var pcall1;
var privilegeExists;

if(OP_TYPE === 'CREATE')
{
	//验证权限
	query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
		+'\'vmipurchaseproportion::createable\',?)';
	pcall1 = conn.prepareCall(query);
	pcall1.execute();
	privilegeExists = pcall1.getNString(1);
	
	if(privilegeExists === 'OK')
	{
		for(i=0;i<data.length;i++)
		{
			VENDORID = data[i].VENDORID;
			VENDORNAME = data[i].VENDORNAME;
			PROPORTION = data[i].PROPORTION;
			
			if(VENDORNAME === undefined || PROPORTION === undefined || VENDORID=== undefined)
			{
				error_message='not enough values';
				continue;
			}
	/*		query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_purchase_proportion::createUiPurchasePropVmi"'
				    + '(\''
					+LOGICAL_PLANT +'\',\''
					+ITEM +'\',\''
					+ITEMDESC +'\',\''
					+VENDORID +'\',\''
					+START_DATE+'\',\''
					+END_DATE+'\',\''
					+VENDORNAME +'\','
					+PROPORTION+',\''
					+CREATE_TIME+'\''
				    + ',?,?)';
						*/
			query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_purchase_proportion::createUiPurchasePropVmi"(?,?,?,?,?,?,?,?,?,?,?)';
			try
			{				
				pcall = conn.prepareCall(query);
				pcall.setString(1,LOGICAL_PLANT);
				pcall.setString(2,ITEM);
				pcall.setString(3,ITEMDESC);
				pcall.setString(4,VENDORID);
				pcall.setString(5,START_DATE);
				pcall.setString(6,END_DATE);
				pcall.setString(7,VENDORNAME);
				pcall.setString(8,PROPORTION);
				pcall.setString(9,CREATE_TIME);
				
				pcall.execute();
				result_status = pcall.getInteger(10);
				$.response.contentType = "application/json; charset=UTF-8";
				if(result_status === 0)
				{
					error_message = pcall.getNString(11);
					$.response.status = $.net.http.BAD_REQUEST;
					$.response.setBody("Error::"+error_message);

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
		conn.close();
	}
	else
	{
		$.response.setBody("Insufficient privilege!");
		$.response.status = $.net.http.BAD_REQUEST;		
	}
	

}
else if(OP_TYPE === 'UPDATE')
{
	//验证权限
	query ='call "SECURITY"."cdp.security.procedures::checkPrivilege" ('
		+'\'vmipurchaseproportion::editable\',?)';
	pcall1 = conn.prepareCall(query);
	pcall1.execute();
	privilegeExists = pcall1.getNString(1);
	
	if(privilegeExists === 'OK')
	{
		for(i=0;i<data.length;i++)
		{
			VENDORID = data[i].VENDORID;
			VENDORNAME = data[i].VENDORNAME;
			PROPORTION = data[i].PROPORTION;
			
			if(VENDORNAME === undefined || PROPORTION === undefined || VENDORID=== undefined)
			{
				error_message='not enough values';
				continue;
			}
			
		/*	query = 'CALL "MXEBGVMI"."cdp.mxebgvmi.procedures.pkg_ui.ui_purchase_proportion::editUiPurchasePropVmi"'
				    + '(\''
					+LOGICAL_PLANT +'\',\''
					+ITEM +'\',\''
					+ITEMDESC +'\',\''
					+VENDORID +'\',\''
					+START_DATE+'\',\''
					+END_DATE+'\',\''
					+VENDORNAME +'\','
					+PROPORTION+',\''
					+CREATE_TIME+'\''
				    + ',?,?)';*/
			
			query = 'CALL "SZEBGVMI"."cdp.szebgvmi.procedures.pkg_ui.ui_purchase_proportion::editUiPurchasePropVmi"(?,?,?,?,?,?,?,?,?,?,?)';
			
			try
			{				
				pcall = conn.prepareCall(query);
				pcall.setString(1,LOGICAL_PLANT);
				pcall.setString(2,ITEM);
				pcall.setString(3,ITEMDESC);
				pcall.setString(4,VENDORID);
				pcall.setString(5,START_DATE);
				pcall.setString(6,END_DATE);
				pcall.setString(7,VENDORNAME);
				pcall.setString(8,PROPORTION);
				pcall.setString(9,CREATE_TIME);

				pcall.execute();
				result_status = pcall.getInteger(10);
				$.response.contentType = "application/json; charset=UTF-8";
				if(result_status === 0)
				{
					error_message = pcall.getNString(11);
					$.response.status = $.net.http.BAD_REQUEST;
					$.response.setBody("Error::"+error_message);

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
		conn.close();
		
	}
	else
	{
		$.response.setBody("Insufficient privilege!");
		$.response.status = $.net.http.BAD_REQUEST;		
	}


}
