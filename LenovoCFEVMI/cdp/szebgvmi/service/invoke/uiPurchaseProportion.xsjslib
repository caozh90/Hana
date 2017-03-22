var invoke = $.import('cdp.szebgvmi.service.invoke', 'invoke');

function validationBefore(param,oper_type){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var ITEM,ITEMDESC,VENDORID,VENDORNAME,LOGICAL_PLANT,PROPORTION,START_DATE,END_DATE;
    while (rs.next()) {    	
    	ITEM = rs.getNString(1);
    	ITEMDESC = rs.getNString(2);
    	VENDORID = rs.getNString(3);
    	VENDORNAME = rs.getNString(4);
    	LOGICAL_PLANT = rs.getNString(5);
    	PROPORTION = rs.getInteger(6);
    	START_DATE = rs.getTimestamp(7);
    	END_DATE = rs.getTimestamp(8);
    }
    
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_purchase_proportion::validationPurchaseProportion"(?,?,?,?,?,?,?,?,?,?)');
	pStmt.setNString(1,ITEM);
	pStmt.setNString(2,ITEMDESC);
	pStmt.setNString(3,VENDORID);
	pStmt.setNString(4,VENDORNAME);
	pStmt.setNString(5,LOGICAL_PLANT);
	pStmt.setInteger(6,PROPORTION);
	pStmt.setTimestamp(7,START_DATE);
	pStmt.setTimestamp(8,END_DATE);
	pStmt.setNString(9,oper_type);
    pStmt.execute();
	var error = pStmt.getNString(10);
	if(error !== ''){
		throw error;
	}
}

function remove(param){
	var result=invoke.checkPrivilege('vmipurchaseproportion::deleteable');
	if(result!== 'OK' ){
		throw result;
		
	}
	var after = param.beforeTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var ITEM,VENDORID,LOGICAL_PLANT,START_DATE;
    while (rs.next()) {
    	ITEM = rs.getNString(1);
    	VENDORID = rs.getNString(3);
    	LOGICAL_PLANT = rs.getNString(5);
    	START_DATE = rs.getTimestamp(7);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_purchase_proportion::deletePurchaseProportion"(?,?,?,?)');
    pStmt.setNString(1,ITEM);
	pStmt.setNString(2,VENDORID);
	pStmt.setNString(3,LOGICAL_PLANT);
	pStmt.setTimestamp(4,START_DATE);
    pStmt.execute();
}
