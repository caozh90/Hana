var invoke = $.import('cdp.szebgvmi.service.invoke', 'invoke');


function validationBefore(param,oper_type){
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,MO_TYPE,WAREHOUSE_NUMBER,STORAGE_LOCATION,STORAGE_TYPE;
	var PRIORITY,OWNER,INVENTORY_TYPE;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	MO_TYPE = rs.getNString(2);
    	WAREHOUSE_NUMBER = rs.getNString(3);
    	STORAGE_LOCATION = rs.getNString(4);
    	STORAGE_TYPE = rs.getNString(5);
    	PRIORITY = rs.getInteger(6);
    	OWNER = rs.getNString(7);
    	INVENTORY_TYPE = rs.getNString(8);
    }
    
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_source_priority::validationSourcePriority"(?,?,?,?,?,?,?,?,?,?)');
	pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,MO_TYPE);
	pStmt.setNString(3,WAREHOUSE_NUMBER);
	pStmt.setNString(4,STORAGE_LOCATION);
	pStmt.setNString(5,STORAGE_TYPE);
	pStmt.setInteger(6,PRIORITY);
	
	if( OWNER!== null){
		pStmt.setNString(7,OWNER);
	}else{
		pStmt.setNull(7);
	}
	
	pStmt.setNString(8,INVENTORY_TYPE);
	pStmt.setNString(9,oper_type);
    pStmt.execute();
	var error = pStmt.getNString(10);
	if(error !== ''){
		throw error;
	}
}



function insert(param){
	var result=invoke.checkPrivilege('sourcingpriority::createable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'insert');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,MO_TYPE,WAREHOUSE_NUMBER,STORAGE_LOCATION,STORAGE_TYPE;
	var PRIORITY,OWNER,INVENTORY_TYPE;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	MO_TYPE = rs.getNString(2);
    	WAREHOUSE_NUMBER = rs.getNString(3);
    	STORAGE_LOCATION = rs.getNString(4);
    	STORAGE_TYPE = rs.getNString(5);
    	PRIORITY = rs.getInteger(6);
    	OWNER = rs.getNString(7);
    	INVENTORY_TYPE = rs.getNString(8);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_source_priority::createSourcePriority"(?,?,?,?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,MO_TYPE);
	pStmt.setNString(3,WAREHOUSE_NUMBER);
	pStmt.setNString(4,STORAGE_LOCATION);
	pStmt.setNString(5,STORAGE_TYPE);
	pStmt.setInteger(6,PRIORITY);
	
	if( OWNER!== null){
		pStmt.setNString(7,OWNER);
	}else{
		pStmt.setNull(7);
	}
	pStmt.setNString(8,INVENTORY_TYPE);
    pStmt.execute();
}

function update(param){
	var result=invoke.checkPrivilege('sourcingpriority::editable');
	if(result!== 'OK' ){
		throw result;
		
	}
	validationBefore(param,'update');
	var after = param.afterTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,MO_TYPE,WAREHOUSE_NUMBER,STORAGE_LOCATION,STORAGE_TYPE;
	var PRIORITY,OWNER,INVENTORY_TYPE;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	MO_TYPE = rs.getNString(2);
    	WAREHOUSE_NUMBER = rs.getNString(3);
    	STORAGE_LOCATION = rs.getNString(4);
    	STORAGE_TYPE = rs.getNString(5);
    	PRIORITY = rs.getInteger(6);
    	OWNER = rs.getNString(7);
    	INVENTORY_TYPE = rs.getNString(8);
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_source_priority::updateSourcePriority"(?,?,?,?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,MO_TYPE);
	pStmt.setNString(3,WAREHOUSE_NUMBER);
	pStmt.setNString(4,STORAGE_LOCATION);
	pStmt.setNString(5,STORAGE_TYPE);
	pStmt.setInteger(6,PRIORITY);
	pStmt.setNString(7,OWNER);
	pStmt.setNString(8,INVENTORY_TYPE);
    pStmt.execute();
}

function remove(param){
	var result=invoke.checkPrivilege('sourcingpriority::deleteable');
	if(result!== 'OK' ){
		throw result;
		
	}
	var after = param.beforeTableName;
	var pStmt = param.connection.prepareStatement('select * from "' + after + '"');
    var rs = pStmt.executeQuery();
    var LOGICAL_PLANT,MO_TYPE,WAREHOUSE_NUMBER,STORAGE_LOCATION,STORAGE_TYPE;
    while (rs.next()) {
    	LOGICAL_PLANT = rs.getNString(1);
    	MO_TYPE = rs.getNString(2);
    	WAREHOUSE_NUMBER = rs.getNString(3);
    	STORAGE_LOCATION = rs.getNString(4);
    	STORAGE_TYPE = rs.getNString(5);   	
    }
    pStmt = param.connection.prepareCall('call "cdp.szebgvmi.procedures.pkg_ui.ui_source_priority::deleteSourcePriority"(?,?,?,?,?)');
    pStmt.setNString(1,LOGICAL_PLANT);
	pStmt.setNString(2,MO_TYPE);
	pStmt.setNString(3,WAREHOUSE_NUMBER);
	pStmt.setNString(4,STORAGE_LOCATION);
	pStmt.setNString(5,STORAGE_TYPE);
    pStmt.execute();
}
