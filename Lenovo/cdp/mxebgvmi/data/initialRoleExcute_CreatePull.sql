/*

Excute\ create pull
view name
1. manualPull						manualpull					'Manual Pull'
2. manualPackaging					manualpackaging				'Manual Packaging'
3. pullFromSupplier					pullfromsupplier			'Pull From Supplier'

 


*/
/**************************************
1. manualPull						manualpull					'Manual Pull'
**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Pull'
 	,'Manual Pull'
	,'cdp.mxebgvmi.roles.manualpull::access'
	,'manualpull::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Pull'
 	,'Manual Pull'
	,'cdp.mxebgvmi.roles.manualpull::uploadable'
	,'manualpull::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Pull'
 	,'Manual Pull'
	,'cdp.mxebgvmi.roles.manualpull::exportable'
	,'manualpull::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Pull'
 	,'Manual Pull'
	,'cdp.mxebgvmi.roles.manualpull::createable'
	,'manualpull::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Pull'
 	,'Manual Pull'
	,'cdp.mxebgvmi.roles.manualpull::deleteable'
	,'manualpull::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Pull'
 	,'Manual Pull'
	,'cdp.mxebgvmi.roles.manualpull::editable'
	,'manualpull::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPull'  ,'cdp.mxebgvmi.roles.manualpull::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPull'  ,'cdp.mxebgvmi.roles.manualpull::uploadable', 'controllor',?);
       CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPull'  ,'cdp.mxebgvmi.roles.manualpull::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPull'  ,'cdp.mxebgvmi.roles.manualpull::createable', 'controllor',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPull'  ,'cdp.mxebgvmi.roles.manualpull::deleteable', 'controllor',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPull'  ,'cdp.mxebgvmi.roles.manualpull::editable', 'controllor',?);
       
/**************************************
2. manualPackaging					manualpackaging				'Manual Packaging'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Packaging'
 	,'Manual Packaging'
	,'cdp.mxebgvmi.roles.manualpackaging::access'
	,'manualpackaging::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Packaging'
 	,'Manual Packaging'
	,'cdp.mxebgvmi.roles.manualpackaging::createable'
	,'manualpackaging::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Packaging'
 	,'Manual Packaging'
	,'cdp.mxebgvmi.roles.manualpackaging::deleteable'
	,'manualpackaging::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Packaging'
 	,'Manual Packaging'
	,'cdp.mxebgvmi.roles.manualpackaging::editable'
	,'manualpackaging::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Manual Packaging'
 	,'Manual Packaging'
	,'cdp.mxebgvmi.roles.manualpackaging::exportable'
	,'manualpackaging::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPackaging'  ,'cdp.mxebgvmi.roles.manualpackaging::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPackaging'  ,'cdp.mxebgvmi.roles.manualpackaging::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPackaging'  ,'cdp.mxebgvmi.roles.manualpackaging::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPackaging'  ,'cdp.mxebgvmi.roles.manualpackaging::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'manualPackaging'  ,'cdp.mxebgvmi.roles.manualpackaging::exportable', 'controllor',?);
/**************************************
3. pullFromSupplier					pullfromsupplier			'Pull From Supplier'

************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull From Supplier'
 	,'Pull From Supplier'
	,'cdp.mxebgvmi.roles.pullfromsupplier::access'
	,'pullfromsupplier::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull From Supplier'
 	,'Pull From Supplier'
	,'cdp.mxebgvmi.roles.pullfromsupplier::createable'
	,'pullfromsupplier::createable'
 	,'createable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull From Supplier'
 	,'Pull From Supplier'
	,'cdp.mxebgvmi.roles.pullfromsupplier::deleteable'
	,'pullfromsupplier::deleteable'
 	,'deleteable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull From Supplier'
 	,'Pull From Supplier'
	,'cdp.mxebgvmi.roles.pullfromsupplier::editable'
	,'pullfromsupplier::editable'
 	,'editable role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull From Supplier'
 	,'Pull From Supplier'
	,'cdp.mxebgvmi.roles.pullfromsupplier::uploadable'
	,'pullfromsupplier::uploadable'
 	,'uploadable role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Pull From Supplier'
 	,'Pull From Supplier'
	,'cdp.mxebgvmi.roles.pullfromsupplier::exportable'
	,'pullfromsupplier::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullFromSupplier'  ,'cdp.mxebgvmi.roles.pullfromsupplier::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullFromSupplier'  ,'cdp.mxebgvmi.roles.pullfromsupplier::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullFromSupplier'  ,'cdp.mxebgvmi.roles.pullfromsupplier::uploadable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullFromSupplier'  ,'cdp.mxebgvmi.roles.pullfromsupplier::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullFromSupplier'  ,'cdp.mxebgvmi.roles.pullfromsupplier::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'pullFromSupplier'  ,'cdp.mxebgvmi.roles.pullfromsupplier::editable', 'controllor',?);

