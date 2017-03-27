/*

ARCH_SEARCH
view name --- ROLE NAME --- COMMENTS
1. archivedPullSignals                  archivedpullsignals        'Archived Pull Signals '
2. archivedPullLines                    archivedpulllines                 'Archived Pull Lines '
3. archivedDispatches                   archiveddispatches                'Archived Dispatches '
4. archivedReceipts                     archivedreceipts                  'Archived Receipts '


*/
/**************************************
1. archivedPullSignals                  archivedpullsignals        'Archived Pull Signals '
'**********************************
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Pull Signals'
 	,'Archived Pull Signals'
	,'cdp.mxebgvmi.roles.archivedpullsignals::access'
	,'archivedpullsignals::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Pull Signals'
 	,'Archived Pull Signals'
	,'cdp.mxebgvmi.roles.archivedpullsignals::exportable'
	,'archivedpullsignals::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedPullSignals'  ,'cdp.mxebgvmi.roles.archivedpullsignals::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedPullSignals'  ,'cdp.mxebgvmi.roles.archivedpullsignals::exportable', 'controllor',?);
       
/**************************************
2. archivedPullLines                    archivedpulllines                 'Archived Pull Lines '
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Pull Lines'
 	,'Archived Pull Lines'
	,'cdp.mxebgvmi.roles.archivedpulllines::access'
	,'archivedpulllines::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Pull Lines'
 	,'Archived Pull Lines'
	,'cdp.mxebgvmi.roles.archivedpulllines::exportable'
	,'archivedpulllines::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;


/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedPullLines'  ,'cdp.mxebgvmi.roles.archivedpulllines::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedPullLines'  ,'cdp.mxebgvmi.roles.archivedpulllines::exportable', 'controllor',?);
       

/**************************************
3. archivedDispatches                   archiveddispatches                'Archived Dispatches '
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Dispatches'
 	,'Archived Dispatches'
	,'cdp.mxebgvmi.roles.archiveddispatches::access'
	,'confirmdispatches::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Dispatches'
 	,'Archived Dispatches'
	,'cdp.mxebgvmi.roles.archiveddispatches::exportable'
	,'confirmdispatches::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;


/*	
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedDispatches'  ,'cdp.mxebgvmi.roles.archiveddispatches::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedDispatches'  ,'cdp.mxebgvmi.roles.archiveddispatches::exportable', 'controllor',?);


/**************************************
4. archivedReceipts                     archivedreceipts                  'Archived Receipts '
************************************************/  
  
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Receipts'
 	,'Archived Receipts'
	,'cdp.mxebgvmi.roles.archivedreceipts::access'
	,'archivedreceipts::access'
 	,'view role '
	,'MXEBGVMI'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'Archived Receipts'
 	,'Archived Receipts'
	,'cdp.mxebgvmi.roles.archivedreceipts::exportable'
	,'archivedreceipts::exportable'
 	,'exportable role '
	,'MXEBGVMI'    
,?             )           ;

/*	
4*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedReceipts'  ,'cdp.mxebgvmi.roles.archivedreceipts::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'MXEBGVMI' ,'archivedReceipts'  ,'cdp.mxebgvmi.roles.archivedreceipts::exportable', 'controllor',?);


