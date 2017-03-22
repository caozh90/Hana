/*
 *  function:  从ds_info.ds_email_conf读取收件人列表
 *       input:  EmailType = 'test'
 *  by xwu, 2015/9/8
 */
var v_notfound;
var arr_mail = new Array();
var i = 0;
var EmailType = $.request.parameters.get('EMAILTYPE').toString();

// 拼写emailytyple 带' '
var whereSql = "where email_type =" + "'" + EmailType + "'";
var sql = "select recipient from ds_info_sz.ds_email_conf " + whereSql;

//console.log(sql);


var conn = $.db.getConnection();
var psmt = conn.prepareStatement(sql);

psmt.execute();
var rs = psmt.getResultSet();

// get mail list
while (rs.next()) 
{	
	arr_mail[i] = String(rs.getString(1));
	i = i+1;
}
//---------------------------------------------------------------------------
if (i === 0)
{
    v_notfound = "can't found mail list, Please check ds_email_conf table.";
}

if (conn)
{	
	conn.close();
}


var emailsubject;
var emailtext;
var filename;
var attachment;
var currentdate= new Date();
var returnValue;
var response;

//每一个EmailType 都是一个if， emailsubject 都需要带currendate
if(EmailType==='LOIGR')
{
	
	emailsubject='Notice: EBGX86 ShenZhen VMI LOIGR Failed Notice At '+currentdate;
    emailtext='Dear :'+'\n'+'\t'+'\t'+'This is email for LOIGR FAILED';
    filename='LOIGRFAILED.xls';
    
    var conn = $.hdb.getConnection();  
    var query = 'SELECT RECEIPT_ID,TPL_RECEIPT_ID,TPL_RECEIPT_LINE_ID,MATNR,WERKS,QTY,LIFNR,DEST_TYPE,RECEIPT_DATE,REASON_CODE,SYS_LAST_MODIFIED_BY'
    	        +' FROM SZEBGVMI.LOI_GR A'
   	            +' WHERE EXISTS (SELECT 1' 
   	            +' FROM SZEBGVMI.Z_PCDW_RSP_LOI_GR B'
           	    +' WHERE b.status ='+"'ERROR'"
   	            +' AND a.TPL_RECEIPT_ID = b.TPL_RECEIPT_ID' 
   	            +' AND a.TPL_RECEIPT_LINE_ID = b.TPL_RECEIPT_LINE_ID)';
    
    var rs = conn.executeQuery(query);
    
    attachment = ''; 
    attachment +="RECEIPT_ID"+"\t"+"TPL_RECEIPT_ID"+"\t"+"TPL_RECEIPT_LINE_ID"+"\t"+"PART_NUMBER"+"\t"+"PLANT"+"\t"
                  +"QTY"+"\t"+"SUPPLIER"+"\t"+"DEST_TYPE"+"\t"+"RECEIPT_DATE"+"\t"+"REASON_CODE"+"\t"+"SYS_LAST_MODIFIED_BY"+"\n";
	for(var i = 0; i < rs.length; i++){  
	   
	   attachment += rs[i]["RECEIPT_ID"] + "\t" + rs[i]["TPL_RECEIPT_ID"] + "\t" + rs[i]["TPL_RECEIPT_LINE_ID"] +"\t" + rs[i]["MATNR"] +"\t"
	                 +rs[i]["WERKS"]+ "\t" +rs[i]["QTY"]+ "\t" +rs[i]["LIFNR"]+ "\t" + rs[i]["DEST_TYPE"]+ "\t" +rs[i]["RECEIPT_DATE"] +"\t"
	                 +rs[i]["REASON_CODE"] +"\t" + rs[i]["SYS_LAST_MODIFIED_BY"]+"\n";  
	    
	}
	
	
	var mail = new $.net.Mail({  
	    sender: {address: "SZEBGVMIEMAIL@lenovo.com"},  
	    //to: [{ address: "wxlai2008@163.com"}, { address: "wxlai2008@hotmail.com" }],
	    to:  arr_mail ,      
	    subject: emailsubject ,  
	    parts: [ new $.net.Mail.Part({  
	        type: $.net.Mail.Part.TYPE_TEXT,  
	        text : emailtext,  
	        contentType: "text/plain"  
	    })]  
	});  

	mail.parts.push(new $.net.Mail.Part({  
		  type: $.net.Mail.Part.TYPE_ATTACHMENT,  
		  data: attachment,  
		   contentType: "application/vnd.ms-excel",  
		  fileName: filename}));
	
	 returnValue = mail.send();  
	 response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
}

// SOIGR
if(EmailType==='SOIGR')
{
	emailsubject='Notice: EBGX86 ShenZhen VMI SOIGR Failed Notice At '+currentdate;
    emailtext='Dear :'+'\n'+'\t'+'\t'+'This is email for SOIGR FAILED';
    filename='SOIGRFAILED.xls';
    
    var conn = $.hdb.getConnection();  
    var query = 'SELECT RECEIPT_ID,TPL_RECEIPT_ID,TPL_RECEIPT_LINE_ID,MATNR,WERKS,QTY,LIFNR,DEST_TYPE,RECEIPT_DATE,REASON_CODE,SYS_LAST_MODIFIED_BY'
    	        +' FROM SZEBGVMI.SOI_GR A '
   	            +' WHERE EXISTS (SELECT 1' 
   	            +' FROM SZEBGVMI.Z_PCDW_RSP_SOI_GR B '
           	    +' WHERE b.status ='+"'ERROR'"
   	            +' AND a.TPL_RECEIPT_ID = b.TPL_RECEIPT_ID' 
   	            +' AND a.TPL_RECEIPT_LINE_ID = b.TPL_RECEIPT_LINE_ID)';
    
    var rs = conn.executeQuery(query);
    
    attachment = ''; 
    attachment +="RECEIPT_ID"+"\t"+"TPL_RECEIPT_ID"+"\t"+"TPL_RECEIPT_LINE_ID"+"\t"+"PART_NUMBER"+"\t"+"PLANT"+"\t"
                  +"QTY"+"\t"+"SUPPLIER"+"\t"+"DEST_TYPE"+"\t"+"RECEIPT_DATE"+"\t"+"REASON_CODE"+"\t"+"SYS_LAST_MODIFIED_BY"+"\n";
	for(var i = 0; i < rs.length; i++){  
	   
	   attachment += rs[i]["RECEIPT_ID"] + "\t" + rs[i]["TPL_RECEIPT_ID"] + "\t" + rs[i]["TPL_RECEIPT_LINE_ID"] +"\t" + rs[i]["MATNR"] +"\t"
	                 +rs[i]["WERKS"]+ "\t" +rs[i]["QTY"]+ "\t" +rs[i]["LIFNR"]+ "\t" + rs[i]["DEST_TYPE"]+ "\t" +rs[i]["RECEIPT_DATE"] +"\t"
	                 +rs[i]["REASON_CODE"] +"\t" + rs[i]["SYS_LAST_MODIFIED_BY"]+"\n";  
	    
	}
	
	
	var mail = new $.net.Mail({  
	    sender: {address: "SZEBGVMIEMAIL@lenovo.com"},  
	    //to: [{ address: "wxlai2008@163.com"}, { address: "wxlai2008@hotmail.com" }],
	    to:  arr_mail ,      
	    subject: emailsubject ,  
	    parts: [ new $.net.Mail.Part({  
	        type: $.net.Mail.Part.TYPE_TEXT,  
	        text : emailtext,  
	        contentType: "text/plain"  
	    })]  
	});  

	mail.parts.push(new $.net.Mail.Part({  
		  type: $.net.Mail.Part.TYPE_ATTACHMENT,  
		  data: attachment,  
		   contentType: "application/vnd.ms-excel",  
		  fileName: filename}));
	
	 returnValue = mail.send();  
	 response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;

}

//FAILEDDISPATCH
if(EmailType==='FAILEDDISPATCH')
{
	emailsubject='Notice: EBGX86 ShenZhen VMI  Failed Dispatch NoticeE At '+currentdate;
    emailtext='Dear :'+'\n'+'\t'+'\t'+'This is email for FAILEDDISPATCH FAILED';
    filename='FAILEDDISPATCHFAILED.xls';
    
    var conn = $.hdb.getConnection();
    var query = 'SELECT PULL_HEADER_ID,PULL_LINE_ID,PULL_TYPE, WERKS,MATNR, MATNR_DESCR, DISPATCH_QTY, SRC_STORAGE_TYPE, DEST_STORAGE_TYPE,INVENTORY_TYPE,SHIPPED_DATE,REASON_CODE'
    	        +' FROM SZEBGVMI.DISPATCH_LIST A '
   	            +' WHERE EXISTS (SELECT 1' 
   	            +' FROM SZEBGVMI.Z_PCDW_RSP_DISPATCH_LIST B '
           	    +' WHERE b.status ='+"'ERROR'"
   	            +' AND A.PULL_HEADER_ID=B.PULL_HEADER_ID' 
   	            +' AND A.PULL_LINE_ID=B.PULL_LINE_ID) '
   	            +' AND A.STATUS = '+"'SENT'" ;
    
    var rs = conn.executeQuery(query);
    
    attachment = ''; 
    attachment +="PULL_HEADER_ID"+"\t"+"PULL_LINE_ID"+"\t"+"PULL_TYPE"+"\t" +"PLANT"+"\t"+"PART_NUMBER"+"\t"+"MATNR_DESCR"+"\t"
                       +"DISPATCH_QTY"+"\t"+"SRC_STORAGE_TYPE"+"\t"+"DEST_STORAGE_TYPE"+"\t"+"INVENTORY_TYPE"+"\t"+"SHIPPED_DATE"+"\t"+"REASON_CODE"+"\n";
	for(var i = 0; i < rs.length; i++){  
	   
	   attachment += rs[i]["PULL_HEADER_ID"] + "\t" + rs[i]["PULL_LINE_ID"] + "\t" + rs[i]["PULL_TYPE"] +"\t" + rs[i]["WERKS"] +"\t"
	                 +rs[i]["MATNR"]+ "\t" +rs[i]["MATNR_DESCR"]+ "\t" +rs[i]["DISPATCH_QTY"]+ "\t" + rs[i]["SRC_STORAGE_TYPE"]+ "\t" +rs[i]["DEST_STORAGE_TYPE"] +"\t"
	                 +rs[i]["INVENTORY_TYPE"] +"\t" +rs[i]["SHIPPED_DATE"] +"\t" + rs[i]["REASON_CODE"]+"\n";  
	    
	}
	
	
	var mail = new $.net.Mail({  
	    sender: {address: "SZEBGVMIEMAIL@lenovo.com"},  
	    //to: [{ address: "wxlai2008@163.com"}, { address: "wxlai2008@hotmail.com" }],
	    to:  arr_mail ,      
	    subject: emailsubject ,  
	    parts: [ new $.net.Mail.Part({  
	        type: $.net.Mail.Part.TYPE_TEXT,  
	        text : emailtext,  
	        contentType: "text/plain"  
	    })]  
	});  

	mail.parts.push(new $.net.Mail.Part({  
		  type: $.net.Mail.Part.TYPE_ATTACHMENT,  
		  data: attachment,  
		   contentType: "application/vnd.ms-excel",  
		  fileName: filename}));
	
	 returnValue = mail.send();  
	 response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;

}

//NOCUTMOREPORT
if(EmailType==='NOCUTMOREPORT')
{
	
	emailsubject='Notice: EBGX86 ShenZhen VMI NoCutMoReport NoticeE At '+currentdate;
    emailtext='Dear :'+'\n'+'\t'+'\t'+'This is email for NOCUTMOREPORT';
    filename='NOCUTMOREPORT.xls';

     var conn = $.hdb.getConnection();  
     var query = 'SELECT m.werks ,ifnull(m.src_storage_loc,\'N/A\')  as src_storage_loc , m.matnr ,m.productionordid ,MIN(rm.qty) mo_qty ,SUM(b.qty) as bom_qty ,SUM (-m.pull_qty) as request_qty ,SUM(map(i.qty,NULL,0,i.qty)) as inventory_qty ,cancel_reason '
                + ' FROM SZEBGVMI.on_hold_mo_line m '
                + ' INNER JOIN(SELECT productionordid,matnr,werks,SUM(qty) qty FROM SZEBGVMI.z_pcdw_mo_bom GROUP BY productionordid,matnr,werks) b '
                + ' ON m.productionordid=b.productionordid AND m.matnr=b.matnr AND m.werks=b.werks '
                +'  INNER JOIN SZEBGVMI.z_pcdw_mo rm ON m.productionordid=rm.productionordid '
                +'  LEFT OUTER JOIN (SELECT matnr,storage_location,werks,SUM (qty) qty FROM (SELECT inv.matnr,inv.storage_location,qty,inv.werks FROM SZEBGVMI.z_pcdw_inventory inv, SZEBGVMI.ui_sourcing_priority pri, SZEBGVMI.mid_supplier_priority ud WHERE inv.storage_location=pri.storage_location AND inv.storage_type=pri.storage_type AND inv.werks=pri.logical_plant AND pri.mo_type=\'MO\' AND inv.hold_type=\'A\' AND inv.qty > 0 AND inv.matnr=ud.matnr AND inv.werks=ud.werks AND inv.lifnr=ud.lifnr AND inv.lifnr <> \'NONE\' UNION ALL SELECT inv.matnr,inv.storage_location,qty qty, inv.werks FROM SZEBGVMI.z_pcdw_inventory inv,SZEBGVMI.ui_sourcing_priority pri WHERE inv.storage_location=pri.storage_location AND inv.storage_type=pri.storage_type AND inv.werks=pri.logical_plant AND pri.mo_type=\'MO\' AND inv.hold_type=\'A\' AND inv.qty > 0 AND lifnr=\'NONE\') GROUP BY matnr,storage_location,werks) i ON m.matnr=i.matnr AND m.werks=i.werks AND ifnull (m.src_storage_loc,\'N/A\')=i.storage_location '
                +' WHERE m.cancel_reason IS NOT NULL '
                +' AND trim(m.cancel_reason) != \'\' '
                +' AND m.status=\'IN_PROCESS\''
                +' GROUP BY m.productionordid, m.matnr, ifnull (m.src_storage_loc,\'N/A\'), m.werks, m.cancel_reason '
                + 'ORDER BY m.matnr '

    
    var rs = conn.executeQuery(query);
    
    attachment = ''; 
    attachment +="werks"+"\t"+"src_storage_loc"+"\t"+"matnr"+"\t"+"productionordid"+"\t"+"mo_qty"+"\t" +"bom_qty"+"\t" +"request_qty"+"\t" +"inventory_qty"+"\t" +"cancel_reason"
	for(var i = 0; i < rs.length; i++){  
	   
	   attachment += rs[i]["werks"] + "\t" + rs[i]["src_storage_loc"] + "\t" + rs[i]["matnr"] +"\t" + rs[i]["productionordid"] +"\t"
	                 +rs[i]["mo_qty"] +rs[i]["bom_qty"] +rs[i]["request_qty"] +rs[i]["inventory_qty"]+ "\t" +rs[i]["cancel_reason"]+"\n";  	    
	}
	
	
	var mail = new $.net.Mail({  
	    sender: {address: "SZEBGVMIEMAIL@lenovo.com"},  
	    //to: [{ address: "wxlai2008@163.com"}, { address: "wxlai2008@hotmail.com" }],
	    to:  arr_mail ,      
	    subject: emailsubject ,  
	    parts: [ new $.net.Mail.Part({  
	        type: $.net.Mail.Part.TYPE_TEXT,  
	        text : emailtext,  
	        contentType: "text/plain"  
	    })]  
	});  

	mail.parts.push(new $.net.Mail.Part({  
		  type: $.net.Mail.Part.TYPE_ATTACHMENT,  
		  data: attachment,  
		   contentType: "application/vnd.ms-excel",  
		  fileName: filename}));
	
	 returnValue = mail.send();  
	 response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;	

}

//MOPULLREPORT
if(EmailType==='MOPULLREPORT')
{
	emailsubject='Notice: EBGX86 ShenZhen VMI MoPullReport Notice At '+currentdate;
    emailtext='Dear :'+'\n'+'\t'+'\t'+'This is email for MOPULLREPORT';
    filename='MOPULLREPORT.xls';
    
    var conn = $.hdb.getConnection();  
    
    var query = ' SELECT LOGICAL_PLANT, MO_ID, PLAN_DATE, NORMAL_PULL_ID, EXCESS_PULL_ID, SHIPPING_PULL_ID, KANBAN_PULL_ID, PACKAGING_PULL_ID, MTM, FAMILY, ORDER_TYPE, MO_REMAK, DS_LINE, MRP_CONTROLLER, SYS_DATE, TO_VARCHAR(BOM_QTY) '
			    	+ ' FROM '
			    	+  '( SELECT A.LOGICAL_PLANT, A.PRODUCTIONORDID AS MO_ID, '
			    	+  ' A.DELIVERY_DATE AS PLAN_DATE, '
			    	+  ' A.NORMAL_PULLS AS NORMAL_PULL_ID, ' 
			    	+  ' A.EXCESS_PULLS AS EXCESS_PULL_ID, ' 
			    	+  ' A.SHIPPING_PULLS AS SHIPPING_PULL_ID, ' 
			    	+  ' A.KANBAN_PULLS AS KANBAN_PULL_ID,' 
			    	+  ' A.PACKAGING_PULLS AS PACKAGING_PULL_ID, ' 
			    	+  ' A.MTM, ' 
			    	+  ' A.FAMILY, '
			    	+  ' A.ORDER_TYPE,' 
			    	+  ' A.REMARK AS MO_REMAK, '
			    	+  ' A.PRODUCTION_LINE AS DS_LINE, '
			    	+  ' A.MRP_CONTROLLER, '
			    	+  ' A.SYS_TIMESTAMP AS SYS_DATE, '
			    	+  '  (SUM (A.BOM_QTY)) AS BOM_QTY '
			    	+  '  FROM SZEBGVMI.RPT_PULL_INFO_RUN A '
			    	+  '  GROUP BY A.LOGICAL_PLANT, A.PRODUCTIONORDID, A.DELIVERY_DATE, A.NORMAL_PULLS, A.EXCESS_PULLS, A.SHIPPING_PULLS, A.KANBAN_PULLS, A.PACKAGING_PULLS, A.MTM, A.FAMILY, A.ORDER_TYPE, A.REMARK, A.PRODUCTION_LINE, A.MRP_CONTROLLER, A.SYS_TIMESTAMP )';
    
    var rs = conn.executeQuery(query);
    
    attachment = ''; 
    attachment +="LOGICAL_PLANT"+"\t"+"MO_ID"+"\t"+"PLAN_DATE"+"\t"+"NORMAL_PULL_ID"+"\t"+"EXCESS_PULL_ID"+"\t"
                       +"SHIPPING_PULL_ID"+"\t"+"KANBAN_PULL_ID"+"\t"+"PACKAGING_PULL_ID"+"\t"+"MTM"+"\t"+"FAMILY"+"\t"+"ORDER_TYPE"+"\t"
                       +"MO_REMAK"+"\t"+"DS_LINE"+"\t"+"MRP_CONTROLLER"+"\t"+"SYS_DATE"+"\t"+"BOM_QTY"+"\n"
	for(var i = 0; i < rs.length; i++){  
	   
	   attachment += rs[i]["LOGICAL_PLANT"] + "\t" + rs[i]["MO_ID"] + "\t" + rs[i]["PLAN_DATE"] +"\t" + rs[i]["NORMAL_PULL_ID"] +"\t"
	                 +rs[i]["EXCESS_PULL_ID"]+ "\t" +rs[i]["SHIPPING_PULL_ID"]+ "\t" +rs[i]["KANBAN_PULL_ID"]+ "\t" + rs[i]["PACKAGING_PULL_ID"]+ "\t" +rs[i]["MTM"] +"\t"
	                 +rs[i]["FAMILY"]+ "\t" +rs[i]["ORDER_TYPE"]+ "\t" +rs[i]["MO_REMAK"]+ "\t" + rs[i]["DS_LINE"]+ "\t" +rs[i]["MRP_CONTROLLER"] +"\t"
	                 +rs[i]["SYS_DATE"] +"\t" + rs[i]["BOM_QTY"]+"\n";  
	    
	}
	
	
	var mail = new $.net.Mail({  
	    sender: {address: "SZEBGVMIEMAIL@lenovo.com"},  
	    //to: [{ address: "wxlai2008@163.com"}, { address: "wxlai2008@hotmail.com" }],
	    to:  arr_mail ,      
	    subject: emailsubject ,  
	    parts: [ new $.net.Mail.Part({  
	        type: $.net.Mail.Part.TYPE_TEXT,  
	        text : emailtext,  
	        contentType: "text/plain"  
	    })]  
	});  

	mail.parts.push(new $.net.Mail.Part({  
		  type: $.net.Mail.Part.TYPE_ATTACHMENT,  
		  data: attachment,  
		   contentType: "application/vnd.ms-excel",  
		  fileName: filename}));
	
	 returnValue = mail.send();  
	 response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;	
	 
}

$.response.setBody(response);




