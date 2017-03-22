//user insert
function createInfoUser(param) {
   //$.trace.debug("entered function");
   //let before = param.beforeTableName;
   var after = param.afterTableName;
	//param.afterTableName
   var pStmt = param.connection.prepareStatement('select * from "' + after +'"');
   var bSuccess = pStmt.execute();
   if(!bSuccess){
		return ;
	 //bSuccess;
	}
   var rs = pStmt.getResultSet();
   rs.next();

   var conn = $.db.getConnection();
	var cstmt;
	//var output = '';
	var query = 'CALL "SECURITY"."cdp.security.procedures::createInfoUser"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	
	cstmt = conn.prepareCall(query);
	cstmt.setString(1,  rs.getString(2));
	cstmt.setString(2, rs.getString(24));	
	cstmt.setString(3, rs.getString(3));
	cstmt.setString(4, rs.getString(4));
	cstmt.setString(5, rs.getString(5));
	cstmt.setString(6, rs.getString(6));
	cstmt.setString(7, rs.getString(7));
	cstmt.setString(8, rs.getString(8));
	cstmt.setString(9, rs.getString(9));
	cstmt.setString(10, rs.getString(16));
	cstmt.setString(11, rs.getString(17));
	cstmt.setString(12, rs.getString(18));
	cstmt.setString(13, rs.getString(19));

	if(rs.getTimestamp(20)) 
		{cstmt.setTimestamp(14, rs.getTimestamp(20));
		}
	else
		{
		cstmt.setNull(14);
		}
	if(rs.getTimestamp(21) ) 
		{
	cstmt.setTimestamp(15, rs.getTimestamp(21));
		}
	else
	{
		cstmt.setNull(15);
	}
	
	cstmt.setString(16, rs.getString(22));
	cstmt.setString(17, rs.getString(23));

	bSuccess = cstmt.execute();
	rs = cstmt.getResultSet();
	var rtn;
	if(!bSuccess){
		
		rs.next();
		rtn = rs.getString(3);
		cstmt.close();
		conn.commit();
		conn.close();
		throw rtn;
	}

	
	if(rs.next()) 
		{
		rtn = rs.getString(3);
		cstmt.close();
	conn.commit();
	conn.close();
		throw rtn;
}
	
	/*
	 * 
	 * 	1<Property Name="ID" Type="Edm.Int64" Nullable="false"/>
	2<Property Name="NAME" Type="Edm.String" MaxLength="256"/>
	3<Property Name="LOGINNAME" Type="Edm.String" MaxLength="256"/>
	4<Property Name="FIRSTNAME" Type="Edm.String" MaxLength="256"/>
	5<Property Name="LASTNAME" Type="Edm.String" MaxLength="256"/>
	6<Property Name="EMAILADDRESS" Type="Edm.String" MaxLength="200"/>
	7<Property Name="STATUS" Type="Edm.String" MaxLength="20"/>
	8<Property Name="LOCALE" Type="Edm.String" MaxLength="16"/>
	9<Property Name="DESIGNATION" Type="Edm.String" MaxLength="256"/>
	0<Property Name="MODULE_NAME" Type="Edm.String" MaxLength="256"/>
	1<Property Name="GROUP_ID" Type="Edm.Int64" Nullable="false"/>
	2<Property Name="COMMENT" Type="Edm.String" MaxLength="256"/>
	3<Property Name="GROUP_NAME" Type="Edm.String" MaxLength="256"/>
	4<Property Name="ID_GROUP_USER" Type="Edm.String" MaxLength="10"/>
	5<Property Name="MODULE_ID" Type="Edm.String" MaxLength="10"/>
	6<Property Name="PHONENUMBER" Type="Edm.String" MaxLength="50"/>
	7<Property Name="DEPARTMENT" Type="Edm.String" MaxLength="256"/>
	8<Property Name="COMPANY" Type="Edm.String" MaxLength="256"/>
	9<Property Name="USER_GROUP" Type="Edm.String" MaxLength="256"/>
	0<Property Name="VALID_FROM" Type="Edm.DateTime"/>
	1<Property Name="VALID_UNTIL" Type="Edm.DateTime"/>
	2<Property Name="INTERNAL_SIGN" Type="Edm.String" MaxLength="256"/>
	3<Property Name="EXTERNAL_SIGN" Type="Edm.String" MaxLength="256"/>
	4<Property Name="PASSWORD" Type="Edm.String" MaxLength="26"/>
	
	 * 
	 * PROCEDURE "SECURITY"."cdp.security.procedures::createInfoUser" (
			1IN USERNAME NVARCHAR(256), 
	        2 IN passwd NVARCHAR(256),
            3 IN LOGINNAME NVARCHAR(256),
            4 IN FIRSTNAME NVARCHAR(256),
            5 IN LASTNAME NVARCHAR(256),
            6 IN EMAILADDRESS NVARCHAR(200),
            7 IN STATUS NVARCHAR(20),
            8 IN LOCALE NVARCHAR(16),
            9 IN DESIGNATION NVARCHAR(200)
            0 ,IN	PHONENUMBER  NVARCHAR(50)
  			1,IN		DEPARTMENT NVARCHAR(256) --//部门
  			2,IN		COMPANY NVARCHAR(256)		--//公司
  			3,IN		USER_GROUP NVARCHAR(256)	--	//用户账户组
  			4,IN		VALID_FROM Timestamp --//Data as of which the user can connect
  			5,IN		VALID_UNTIL Timestamp --//Data as of which the user can no longer connect
  			6,IN		INTERNAL_SIGN NVARCHAR(256) --//内部用户标识
  			7,IN		EXTERNAL_SIGN NVARCHAR(256) --//外部用户标识
             --IN aMODULE_NAME NVARCHAR(200)
,OUT errorInfo "SECURITY"."cdp.security.data::userManagement.HttpError"

	 */

	cstmt.close();
	conn.commit();
	conn.close();
	
	
}
