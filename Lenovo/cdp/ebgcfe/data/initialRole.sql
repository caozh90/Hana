--0.1
--0.2
--0.3

--1.1
--1.2
--1.3
--1.4
--1.5
--1.7
--1.8

--2.1
--2.2
--2.3
--2.4
--2.5
--2.6
--2.7
--2.8

--3.1
--3.2
--3.3
--3.4
  
--4.1
--4.2
--4.3
--4.4
--4.5
--4.6
--4.7
--4.8

--5.1
--5.2

--6.1
--6.2
--6.3
--6.4
--6.5
--6.6

/*0.1*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_ondemand_refresh'
 	,'ui_ondemand_refresh Managerment'
	,'cdp.ebgcfe.roles.ui_ondemand_refresh::access'
	,'ui_ondemand_refresh::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_ondemand_refresh'
 	,'ui_ondemand_refresh Managerment'
	,'cdp.ebgcfe.roles.ui_ondemand_refresh::executable'
	,'ui_ondemand_refresh::executable'
 	,'execute role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_ondemand_refresh'
 	,'ui_ondemand_refresh Managerment'
	,'cdp.ebgcfe.roles.ui_ondemand_refresh::exportable'
	,'ui_ondemand_refresh::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ondemandRefresh'  ,'cdp.ebgcfe.roles.ui_ondemand_refresh::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ondemandRefresh'  ,'cdp.ebgcfe.roles.ui_ondemand_refresh::executable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ondemandRefresh'  ,'cdp.ebgcfe.roles.ui_ondemand_refresh::exportable', 'controllor',?);
 
 /*0.2*/
 CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_bake'
 	,'ui_cost_bake Managerment'
	,'cdp.ebgcfe.roles.ui_cost_bake::access'
	,'ui_cost_bake::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_bake'
 	,'ui_cost_bake Managerment'
	,'cdp.ebgcfe.roles.ui_cost_bake::executable'
	,'ui_cost_bake::executable'
 	,'executable role '
	,'EBGCFE'    
	,?
	);
		
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costBake'  ,'cdp.ebgcfe.roles.ui_cost_bake::access', 'view',?);

CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costBake'  ,'cdp.ebgcfe.roles.ui_cost_bake::executable', 'controllor',?);
       
/*0.3*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cycle'
 	,'ui_cycle Managerment'
	,'cdp.ebgcfe.roles.ui_cycle::access'
	,'ui_cycle::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cycle'
 	,'ui_cycle Managerment'
	,'cdp.ebgcfe.roles.ui_cycle::exportable'
	,'ui_cycle::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cycle'
 	,'ui_cycle Managerment'
	,'cdp.ebgcfe.roles.ui_cycle::executable'
	,'ui_cycle::executable'
 	,'executable role '
	,'EBGCFE'    
	,?
	);
		
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'newCycle'  ,'cdp.ebgcfe.roles.ui_cycle::access', 'view',?);     	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'newCycle','cdp.ebgcfe.roles.ui_cycle::exportable', 'controllor',?);       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'newCycle','cdp.ebgcfe.roles.ui_cycle::executable', 'controllor',?);
                           
/*1.1*/
 CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_item'
 	,'ui_item Managerment'
	,'cdp.ebgcfe.roles.ui_item::access'
	,'ui_item::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_item'
 	,'ui_item Managerment'
	,'cdp.ebgcfe.roles.ui_item::editable'
	,'ui_item::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_item'
 	,'ui_item Managerment'
	,'cdp.ebgcfe.roles.ui_item::exportable'
	,'ui_item::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_item'
 	,'ui_item Managerment'
	,'cdp.ebgcfe.roles.ui_item::uploadable'
	,'ui_item::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'itemMaster'  ,'cdp.ebgcfe.roles.ui_item::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'itemMaster'  ,'cdp.ebgcfe.roles.ui_item::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'itemMaster'  ,'cdp.ebgcfe.roles.ui_item::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'itemMaster'  ,'cdp.ebgcfe.roles.ui_item::uploadable', 'controllor',?); 


/*1.2*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_prodfamily'
 	,'ui_prodfamily Managerment'
	,'cdp.ebgcfe.roles.ui_prodfamily::access'
	,'ui_prodfamily::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_prodfamily'
 	,'ui_prodfamily Managerment'
	,'cdp.ebgcfe.roles.ui_prodfamily::createable'
	,'ui_prodfamily::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_prodfamily'
 	,'ui_prodfamily Managerment'
	,'cdp.ebgcfe.roles.ui_prodfamily::deleteable'
	,'ui_prodfamily::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_prodfamily'
 	,'ui_prodfamily Managerment'
	,'cdp.ebgcfe.roles.ui_prodfamily::editable'
	,'ui_prodfamily::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_prodfamily'
 	,'ui_prodfamily Managerment'
	,'cdp.ebgcfe.roles.ui_prodfamily::exportable'
	,'ui_prodfamily::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_prodfamily'
 	,'ui_prodfamily Managerment'
	,'cdp.ebgcfe.roles.ui_prodfamily::uploadable'
	,'ui_prodfamily::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'productFamily'  ,'cdp.ebgcfe.roles.ui_prodfamily::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'productFamily'  ,'cdp.ebgcfe.roles.ui_prodfamily::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'productFamily'  ,'cdp.ebgcfe.roles.ui_prodfamily::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'productFamily'  ,'cdp.ebgcfe.roles.ui_prodfamily::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'productFamily'  ,'cdp.ebgcfe.roles.ui_prodfamily::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'productFamily'  ,'cdp.ebgcfe.roles.ui_prodfamily::uploadable', 'controllor',?);

/*1.3*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sbbcategory'
 	,'ui_sbbcategory Managerment'
	,'cdp.ebgcfe.roles.ui_sbbcategory::access'
	,'ui_sbbcategory::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sbbcategory'
 	,'ui_sbbcategory Managerment'
	,'cdp.ebgcfe.roles.ui_sbbcategory::editable'
	,'ui_sbbcategory::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sbbcategory'
 	,'ui_sbbcategory Managerment'
	,'cdp.ebgcfe.roles.ui_sbbcategory::exportable'
	,'ui_sbbcategory::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sbbcategory'
 	,'ui_sbbcategory Managerment'
	,'cdp.ebgcfe.roles.ui_sbbcategory::uploadable'
	,'ui_sbbcategory::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sbbCategory'  ,'cdp.ebgcfe.roles.ui_sbbcategory::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sbbCategory'  ,'cdp.ebgcfe.roles.ui_sbbcategory::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sbbCategory'  ,'cdp.ebgcfe.roles.ui_sbbcategory::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sbbCategory'  ,'cdp.ebgcfe.roles.ui_sbbcategory::uploadable', 'controllor',?);

/*1.4*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_manual_bom'
 	,'ui_manual_bom Managerment'
	,'cdp.ebgcfe.roles.ui_manual_bom::access'
	,'ui_manual_bom::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_manual_bom'
 	,'ui_manual_bom Managerment'
	,'cdp.ebgcfe.roles.ui_manual_bom::createable'
	,'ui_manual_bom::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_manual_bom'
 	,'ui_manual_bom Managerment'
	,'cdp.ebgcfe.roles.ui_manual_bom::deleteable'
	,'ui_manual_bom::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_manual_bom'
 	,'ui_manual_bom Managerment'
	,'cdp.ebgcfe.roles.ui_manual_bom::editable'
	,'ui_manual_bom::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_manual_bom'
 	,'ui_manual_bom Managerment'
	,'cdp.ebgcfe.roles.ui_manual_bom::exportable'
	,'ui_manual_bom::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_manual_bom'
 	,'ui_manual_bom Managerment'
	,'cdp.ebgcfe.roles.ui_manual_bom::uploadable'
	,'ui_manual_bom::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'manualBom'  ,'cdp.ebgcfe.roles.ui_manual_bom::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'manualBom'  ,'cdp.ebgcfe.roles.ui_manual_bom::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'manualBom'  ,'cdp.ebgcfe.roles.ui_manual_bom::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'manualBom'  ,'cdp.ebgcfe.roles.ui_manual_bom::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'manualBom'  ,'cdp.ebgcfe.roles.ui_manual_bom::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'manualBom'  ,'cdp.ebgcfe.roles.ui_manual_bom::uploadable', 'controllor',?); 
       
/*1.5*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_machine_type'
 	,'ui_machine_type Managerment'
	,'cdp.ebgcfe.roles.ui_machine_type::access'
	,'ui_machine_type::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_machine_type'
 	,'ui_machine_type Managerment'
	,'cdp.ebgcfe.roles.ui_machine_type::editable'
	,'ui_machine_type::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_machine_type'
 	,'ui_machine_type Managerment'
	,'cdp.ebgcfe.roles.ui_machine_type::exportable'
	,'ui_machine_type::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_machine_type'
 	,'ui_machine_type Managerment'
	,'cdp.ebgcfe.roles.ui_machine_type::uploadable'
	,'ui_machine_type::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'mtProdFamily'  ,'cdp.ebgcfe.roles.ui_machine_type::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'mtProdFamily'  ,'cdp.ebgcfe.roles.ui_machine_type::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'mtProdFamily'  ,'cdp.ebgcfe.roles.ui_machine_type::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'mtProdFamily'  ,'cdp.ebgcfe.roles.ui_machine_type::uploadable', 'controllor',?);

/*1.7*/       
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_force_item_type'
 	,'ui_force_item_type Managerment'
	,'cdp.ebgcfe.roles.ui_force_item_type::access'
	,'ui_force_item_type::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_force_item_type'
 	,'ui_force_item_type Managerment'
	,'cdp.ebgcfe.roles.ui_force_item_type::createable'
	,'ui_force_item_type::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_force_item_type'
 	,'ui_force_item_type Managerment'
	,'cdp.ebgcfe.roles.ui_force_item_type::deleteable'
	,'ui_force_item_type::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_force_item_type'
 	,'ui_force_item_type Managerment'
	,'cdp.ebgcfe.roles.ui_force_item_type::editable'
	,'ui_force_item_type::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_force_item_type'
 	,'ui_force_item_type Managerment'
	,'cdp.ebgcfe.roles.ui_force_item_type::exportable'
	,'ui_force_item_type::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_force_item_type'
 	,'ui_force_item_type Managerment'
	,'cdp.ebgcfe.roles.ui_force_item_type::uploadable'
	,'ui_force_item_type::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'forceItemType'  ,'cdp.ebgcfe.roles.ui_force_item_type::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'forceItemType'  ,'cdp.ebgcfe.roles.ui_force_item_type::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'forceItemType'  ,'cdp.ebgcfe.roles.ui_force_item_type::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'forceItemType'  ,'cdp.ebgcfe.roles.ui_force_item_type::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'forceItemType'  ,'cdp.ebgcfe.roles.ui_force_item_type::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'forceItemType'  ,'cdp.ebgcfe.roles.ui_force_item_type::uploadable', 'controllor',?);              


/*1.8*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_dummy_part'
 	,'ui_dummy_part Managerment'
	,'cdp.ebgcfe.roles.ui_dummy_part::access'
	,'ui_dummy_part::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_dummy_part'
 	,'ui_dummy_part Managerment'
	,'cdp.ebgcfe.roles.ui_dummy_part::createable'
	,'ui_dummy_part::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_dummy_part'
 	,'ui_dummy_part Managerment'
	,'cdp.ebgcfe.roles.ui_dummy_part::deleteable'
	,'ui_dummy_part::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);
	
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_dummy_part'
 	,'ui_dummy_part Managerment'
	,'cdp.ebgcfe.roles.ui_dummy_part::editable'
	,'ui_dummy_part::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_dummy_part'
 	,'ui_dummy_part Managerment'
	,'cdp.ebgcfe.roles.ui_dummy_part::exportable'
	,'ui_dummy_part::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_dummy_part'
 	,'ui_dummy_part Managerment'
	,'cdp.ebgcfe.roles.ui_dummy_part::uploadable'
	,'ui_dummy_part::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'dummyPart'  ,'cdp.ebgcfe.roles.ui_dummy_part::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'dummyPart'  ,'cdp.ebgcfe.roles.ui_dummy_part::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'dummyPart'  ,'cdp.ebgcfe.roles.ui_dummy_part::deleteable', 'controllor',?);       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'dummyPart'  ,'cdp.ebgcfe.roles.ui_dummy_part::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'dummyPart'  ,'cdp.ebgcfe.roles.ui_dummy_part::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'dummyPart'  ,'cdp.ebgcfe.roles.ui_dummy_part::uploadable', 'controllor',?);

/*2.1*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'biz_cost_model_list'
 	,'biz_cost_model_list Managerment'
	,'cdp.ebgcfe.roles.biz_cost_model_list::access'
	,'biz_cost_model_list::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'biz_cost_model_list'
 	,'biz_cost_model_list Managerment'
	,'cdp.ebgcfe.roles.biz_cost_model_list::editable'
	,'biz_cost_model_list::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'biz_cost_model_list'
 	,'biz_cost_model_list Managerment'
	,'cdp.ebgcfe.roles.biz_cost_model_list::exportable'
	,'biz_cost_model_list::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'biz_cost_model_list'
 	,'biz_cost_model_list Managerment'
	,'cdp.ebgcfe.roles.biz_cost_model_list::uploadable'
	,'biz_cost_model_list::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costModelList'  ,'cdp.ebgcfe.roles.biz_cost_model_list::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costModelList'  ,'cdp.ebgcfe.roles.biz_cost_model_list::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costModelList'  ,'cdp.ebgcfe.roles.biz_cost_model_list::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costModelList'  ,'cdp.ebgcfe.roles.biz_cost_model_list::uploadable', 'controllor',?);

/*2.2*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_plant'
 	,'ui_plant Managerment'
	,'cdp.ebgcfe.roles.ui_plant::access'
	,'ui_plant::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_plant'
 	,'ui_plant Managerment'
	,'cdp.ebgcfe.roles.ui_plant::createable'
	,'ui_plant::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_plant'
 	,'ui_plant Managerment'
	,'cdp.ebgcfe.roles.ui_plant::deleteable'
	,'ui_plant::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_plant'
 	,'ui_plant Managerment'
	,'cdp.ebgcfe.roles.ui_plant::editable'
	,'ui_plant::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_plant'
 	,'ui_plant Managerment'
	,'cdp.ebgcfe.roles.ui_plant::exportable'
	,'ui_plant::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'plantMaintenance'  ,'cdp.ebgcfe.roles.ui_plant::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'plantMaintenance'  ,'cdp.ebgcfe.roles.ui_plant::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'plantMaintenance'  ,'cdp.ebgcfe.roles.ui_plant::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'plantMaintenance'  ,'cdp.ebgcfe.roles.ui_plant::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'plantMaintenance'  ,'cdp.ebgcfe.roles.ui_plant::exportable', 'controllor',?);

/*2.3*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sos'
 	,'ui_sos Managerment'
	,'cdp.ebgcfe.roles.ui_sos::access'
	,'ui_sos::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sos'
 	,'ui_sos Managerment'
	,'cdp.ebgcfe.roles.ui_sos::createable'
	,'ui_sos::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sos'
 	,'ui_sos Managerment'
	,'cdp.ebgcfe.roles.ui_sos::deleteable'
	,'ui_sos::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sos'
 	,'ui_sos Managerment'
	,'cdp.ebgcfe.roles.ui_sos::editable'
	,'ui_sos::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sos'
 	,'ui_sos Managerment'
	,'cdp.ebgcfe.roles.ui_sos::exportable'
	,'ui_sos::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_sos'
 	,'ui_sos Managerment'
	,'cdp.ebgcfe.roles.ui_sos::uploadable'
	,'ui_sos::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sourceOfSupply'  ,'cdp.ebgcfe.roles.ui_sos::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sourceOfSupply'  ,'cdp.ebgcfe.roles.ui_sos::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sourceOfSupply'  ,'cdp.ebgcfe.roles.ui_sos::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sourceOfSupply'  ,'cdp.ebgcfe.roles.ui_sos::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sourceOfSupply'  ,'cdp.ebgcfe.roles.ui_sos::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'sourceOfSupply'  ,'cdp.ebgcfe.roles.ui_sos::uploadable', 'controllor',?);
 
 
 /*2.4*/
 CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_calcu_formu'
 	,'ui_cost_calcu_formu Managerment'
	,'cdp.ebgcfe.roles.ui_cost_calcu_formu::access'
	,'ui_cost_calcu_formu::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_calcu_formu'
 	,'ui_cost_calcu_formu Managerment'
	,'cdp.ebgcfe.roles.ui_cost_calcu_formu::createable'
	,'ui_cost_calcu_formu::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_calcu_formu'
 	,'ui_cost_calcu_formu Managerment'
	,'cdp.ebgcfe.roles.ui_cost_calcu_formu::deleteable'
	,'ui_cost_calcu_formu::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_calcu_formu'
 	,'ui_cost_calcu_formu Managerment'
	,'cdp.ebgcfe.roles.ui_cost_calcu_formu::editable'
	,'ui_cost_calcu_formu::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_calcu_formu'
 	,'ui_cost_calcu_formu Managerment'
	,'cdp.ebgcfe.roles.ui_cost_calcu_formu::exportable'
	,'ui_cost_calcu_formu::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_calcu_formu'
 	,'ui_cost_calcu_formu Managerment'
	,'cdp.ebgcfe.roles.ui_cost_calcu_formu::uploadable'
	,'ui_cost_calcu_formu::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'formula'  ,'cdp.ebgcfe.roles.ui_cost_calcu_formu::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'formula'  ,'cdp.ebgcfe.roles.ui_cost_calcu_formu::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'formula'  ,'cdp.ebgcfe.roles.ui_cost_calcu_formu::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'formula'  ,'cdp.ebgcfe.roles.ui_cost_calcu_formu::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'formula'  ,'cdp.ebgcfe.roles.ui_cost_calcu_formu::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'formula'  ,'cdp.ebgcfe.roles.ui_cost_calcu_formu::uploadable', 'controllor',?);      
 
 /*2.5*/
 CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'biz_fcsbbmap'
 	,'biz_fcsbbmap Managerment'
	,'cdp.ebgcfe.roles.biz_fcsbbmap::access'
	,'biz_fcsbbmap::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'biz_fcsbbmap'
 	,'biz_fcsbbmap Managerment'
	,'cdp.ebgcfe.roles.biz_fcsbbmap::exportable'
	,'biz_fcsbbmap::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'fcsbbMapping'  ,'cdp.ebgcfe.roles.biz_fcsbbmap::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'fcsbbMapping'  ,'cdp.ebgcfe.roles.biz_fcsbbmap::exportable', 'controllor',?); 
       
 /*2.6*/      
 CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_region'
 	,'ui_region Managerment'
	,'cdp.ebgcfe.roles.ui_region::access'
	,'ui_region::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_region'
 	,'ui_region Managerment'
	,'cdp.ebgcfe.roles.ui_region::createable'
	,'ui_region::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_region'
 	,'ui_region Managerment'
	,'cdp.ebgcfe.roles.ui_region::deleteable'
	,'ui_region::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_region'
 	,'ui_region Managerment'
	,'cdp.ebgcfe.roles.ui_region::editable'
	,'ui_region::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_region'
 	,'ui_region Managerment'
	,'cdp.ebgcfe.roles.ui_region::exportable'
	,'ui_region::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_region'
 	,'ui_region Managerment'
	,'cdp.ebgcfe.roles.ui_region::uploadable'
	,'ui_region::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'region'  ,'cdp.ebgcfe.roles.ui_region::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'region'  ,'cdp.ebgcfe.roles.ui_region::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'region'  ,'cdp.ebgcfe.roles.ui_region::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'region'  ,'cdp.ebgcfe.roles.ui_region::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'region'  ,'cdp.ebgcfe.roles.ui_region::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'region'  ,'cdp.ebgcfe.roles.ui_region::uploadable', 'controllor',?);
 
/*2.7*/      
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_exchange_rate'
 	,'ui_exchange_rate Managerment'
	,'cdp.ebgcfe.roles.ui_exchange_rate::access'
	,'ui_exchange_rate::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_exchange_rate'
 	,'ui_exchange_rate Managerment'
	,'cdp.ebgcfe.roles.ui_exchange_rate::deleteable'
	,'ui_exchange_rate::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_exchange_rate'
 	,'ui_exchange_rate Managerment'
	,'cdp.ebgcfe.roles.ui_exchange_rate::editable'
	,'ui_exchange_rate::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_exchange_rate'
 	,'ui_exchange_rate Managerment'
	,'cdp.ebgcfe.roles.ui_exchange_rate::exportable'
	,'ui_exchange_rate::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_exchange_rate'
 	,'ui_exchange_rate Managerment'
	,'cdp.ebgcfe.roles.ui_exchange_rate::uploadable'
	,'ui_exchange_rate::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'exchangeRate'  ,'cdp.ebgcfe.roles.ui_exchange_rate::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'exchangeRate'  ,'cdp.ebgcfe.roles.ui_exchange_rate::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'exchangeRate'  ,'cdp.ebgcfe.roles.ui_exchange_rate::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'exchangeRate'  ,'cdp.ebgcfe.roles.ui_exchange_rate::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'exchangeRate'  ,'cdp.ebgcfe.roles.ui_exchange_rate::uploadable', 'controllor',?);

/*2.8*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_country_salesorg_mapping'
 	,'ui_country_salesorg_mapping Managerment'
	,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::access'
	,'ui_country_salesorg_mapping::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_country_salesorg_mapping'
 	,'ui_country_salesorg_mapping Managerment'
	,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::deleteable'
	,'ui_country_salesorg_mapping::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_country_salesorg_mapping'
 	,'ui_country_salesorg_mapping Managerment'
	,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::exportable'
	,'ui_country_salesorg_mapping::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);
	
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_country_salesorg_mapping'
 	,'ui_country_salesorg_mapping Managerment'
	,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::uploadable'
	,'ui_country_salesorg_mapping::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'countrySalesorgMapping'  ,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'countrySalesorgMapping'  ,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'countrySalesorgMapping'  ,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::exportable', 'controllor',?);       
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'countrySalesorgMapping'  ,'cdp.ebgcfe.roles.ui_country_salesorg_mapping::uploadable', 'controllor',?);
       
/*3.1*/       
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_elem'
 	,'ui_cost_elem Managerment'
	,'cdp.ebgcfe.roles.ui_cost_elem::access'
	,'ui_cost_elem::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_elem'
 	,'ui_cost_elem Managerment'
	,'cdp.ebgcfe.roles.ui_cost_elem::createable'
	,'ui_cost_elem::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_elem'
 	,'ui_cost_elem Managerment'
	,'cdp.ebgcfe.roles.ui_cost_elem::deleteable'
	,'ui_cost_elem::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_elem'
 	,'ui_cost_elem Managerment'
	,'cdp.ebgcfe.roles.ui_cost_elem::editable'
	,'ui_cost_elem::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_elem'
 	,'ui_cost_elem Managerment'
	,'cdp.ebgcfe.roles.ui_cost_elem::exportable'
	,'ui_cost_elem::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_elem'
 	,'ui_cost_elem Managerment'
	,'cdp.ebgcfe.roles.ui_cost_elem::uploadable'
	,'ui_cost_elem::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costElem'  ,'cdp.ebgcfe.roles.ui_cost_elem::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costElem'  ,'cdp.ebgcfe.roles.ui_cost_elem::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costElem'  ,'cdp.ebgcfe.roles.ui_cost_elem::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costElem'  ,'cdp.ebgcfe.roles.ui_cost_elem::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costElem'  ,'cdp.ebgcfe.roles.ui_cost_elem::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'costElem'  ,'cdp.ebgcfe.roles.ui_cost_elem::uploadable', 'controllor',?); 
                                             
/*3.2*/      
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape_ori'
 	,'ui_cost_tape_ori Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape_ori::access'
	,'ui_cost_tape_ori::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape_ori'
 	,'ui_cost_tape_ori Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape_ori::createable'
	,'ui_cost_tape_ori::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape_ori'
 	,'ui_cost_tape_ori Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape_ori::deleteable'
	,'ui_cost_tape_ori::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape_ori'
 	,'ui_cost_tape_ori Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape_ori::editable'
	,'ui_cost_tape_ori::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape_ori'
 	,'ui_cost_tape_ori Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape_ori::exportable'
	,'ui_cost_tape_ori::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape_ori'
 	,'ui_cost_tape_ori Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape_ori::uploadable'
	,'ui_cost_tape_ori::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostUpload'  ,'cdp.ebgcfe.roles.ui_cost_tape_ori::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostUpload'  ,'cdp.ebgcfe.roles.ui_cost_tape_ori::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostUpload'  ,'cdp.ebgcfe.roles.ui_cost_tape_ori::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostUpload'  ,'cdp.ebgcfe.roles.ui_cost_tape_ori::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostUpload'  ,'cdp.ebgcfe.roles.ui_cost_tape_ori::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostUpload'  ,'cdp.ebgcfe.roles.ui_cost_tape_ori::uploadable', 'controllor',?);

/*3.3*/        
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape'
 	,'ui_cost_tape Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape::access'
	,'ui_cost_tape::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape'
 	,'ui_cost_tape Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape::editable'
	,'ui_cost_tape::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_cost_tape'
 	,'ui_cost_tape Managerment'
	,'cdp.ebgcfe.roles.ui_cost_tape::exportable'
	,'ui_cost_tape::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostTape'  ,'cdp.ebgcfe.roles.ui_cost_tape::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostTape'  ,'cdp.ebgcfe.roles.ui_cost_tape::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'compCostTape'  ,'cdp.ebgcfe.roles.ui_cost_tape::exportable', 'controllor',?);

/*3.4*/ 
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_group_cost'
 	,'ui_group_cost Managerment'
	,'cdp.ebgcfe.roles.ui_group_cost::access'
	,'ui_group_cost::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_group_cost'
 	,'ui_group_cost Managerment'
	,'cdp.ebgcfe.roles.ui_group_cost::createable'
	,'ui_group_cost::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_group_cost'
 	,'ui_group_cost Managerment'
	,'cdp.ebgcfe.roles.ui_group_cost::deleteable'
	,'ui_group_cost::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_group_cost'
 	,'ui_group_cost Managerment'
	,'cdp.ebgcfe.roles.ui_group_cost::editable'
	,'ui_group_cost::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_group_cost'
 	,'ui_group_cost Managerment'
	,'cdp.ebgcfe.roles.ui_group_cost::exportable'
	,'ui_group_cost::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_group_cost'
 	,'ui_group_cost Managerment'
	,'cdp.ebgcfe.roles.ui_group_cost::uploadable'
	,'ui_group_cost::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'groupCost'  ,'cdp.ebgcfe.roles.ui_group_cost::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'groupCost'  ,'cdp.ebgcfe.roles.ui_group_cost::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'groupCost'  ,'cdp.ebgcfe.roles.ui_group_cost::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'groupCost'  ,'cdp.ebgcfe.roles.ui_group_cost::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'groupCost'  ,'cdp.ebgcfe.roles.ui_group_cost::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'groupCost'  ,'cdp.ebgcfe.roles.ui_group_cost::uploadable', 'controllor',?);  
--

--3.5
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'realDummyMapping'
	,'realDummyMapping'
	,'cdp.ebgcfe.roles.realDummyMapping::Access'
	,'realDummyMapping::Access'
 	,'view role '
	,'EBGCFE'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'realDummyMapping'
	,'realDummyMapping'
	,'cdp.ebgcfe.roles.realDummyMapping::createable'
	,'realDummyMapping::createable'
 	,'createable role '
	,'EBGCFE'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'realDummyMapping'
	,'realDummyMapping'
	,'cdp.ebgcfe.roles.realDummyMapping::deleteable'
	,'realDummyMapping::deleteable'
 	,'deleteable role '
	,'EBGCFE'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'realDummyMapping'
	,'realDummyMapping'
	,'cdp.ebgcfe.roles.realDummyMapping::uploadable'
	,'realDummyMapping::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
,?             )           ;

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'realDummyMapping'
	,'realDummyMapping'
	,'cdp.ebgcfe.roles.realDummyMapping::exportable'
	,'realDummyMapping::exportable'
 	,'exportable role '
	,'EBGCFE'    
,?             )           ;


CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'realDummyMapping'  ,'cdp.ebgcfe.roles.realDummyMapping::Access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'realDummyMapping'  ,'cdp.ebgcfe.roles.realDummyMapping::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'realDummyMapping'  ,'cdp.ebgcfe.roles.realDummyMapping::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'realDummyMapping'  ,'cdp.ebgcfe.roles.realDummyMapping::uploadable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'realDummyMapping'  ,'cdp.ebgcfe.roles.realDummyMapping::exportable', 'controllor',?);
       
--4.1
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xmva'
 	,'ui_xmva Managerment'
	,'cdp.ebgcfe.roles.ui_xmva::access'
	,'ui_xmva::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xmva'
 	,'ui_xmva Managerment'
	,'cdp.ebgcfe.roles.ui_xmva::createable'
	,'ui_xmva::createable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xmva'
 	,'ui_xmva Managerment'
	,'cdp.ebgcfe.roles.ui_xmva::deleteable'
	,'ui_xmva::deleteable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xmva'
 	,'ui_xmva Managerment'
	,'cdp.ebgcfe.roles.ui_xmva::editable'
	,'ui_xmva::editable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xmva'
 	,'ui_xmva Managerment'
	,'cdp.ebgcfe.roles.ui_xmva::exportable'
	,'ui_xmva::exportable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xmva'
 	,'ui_xmva Managerment'
	,'cdp.ebgcfe.roles.ui_xmva::uploadable'
	,'ui_xmva::uploadable' 	,'view role '	,'EBGCFE'    	,?	);
	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xmva'  ,'cdp.ebgcfe.roles.ui_xmva::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xmva'  ,'cdp.ebgcfe.roles.ui_xmva::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xmva'  ,'cdp.ebgcfe.roles.ui_xmva::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xmva'  ,'cdp.ebgcfe.roles.ui_xmva::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xmva'  ,'cdp.ebgcfe.roles.ui_xmva::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xmva'  ,'cdp.ebgcfe.roles.ui_xmva::uploadable', 'controllor',?);
       
--4.2
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xifrt'
 	,'ui_xifrt Managerment'
	,'cdp.ebgcfe.roles.ui_xifrt::access'
	,'ui_xifrt::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xifrt'
 	,'ui_xifrt Managerment'
	,'cdp.ebgcfe.roles.ui_xifrt::createable'
	,'ui_xifrt::createable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xifrt'
 	,'ui_xifrt Managerment'
	,'cdp.ebgcfe.roles.ui_xifrt::deleteable'
	,'ui_xifrt::deleteable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xifrt'
 	,'ui_xifrt Managerment'
	,'cdp.ebgcfe.roles.ui_xifrt::editable'
	,'ui_xifrt::editable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xifrt'
 	,'ui_xifrt Managerment'
	,'cdp.ebgcfe.roles.ui_xifrt::exportable'
	,'ui_xifrt::exportable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xifrt'
 	,'ui_xifrt Managerment'
	,'cdp.ebgcfe.roles.ui_xifrt::uploadable'
	,'ui_xifrt::uploadable' 	,'view role '	,'EBGCFE'    	,?	);
	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xifrt'  ,'cdp.ebgcfe.roles.ui_xifrt::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xifrt'  ,'cdp.ebgcfe.roles.ui_xifrt::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xifrt'  ,'cdp.ebgcfe.roles.ui_xifrt::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xifrt'  ,'cdp.ebgcfe.roles.ui_xifrt::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xifrt'  ,'cdp.ebgcfe.roles.ui_xifrt::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xifrt'  ,'cdp.ebgcfe.roles.ui_xifrt::uploadable', 'controllor',?);
            
--4.3
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xoutfr'
 	,'ui_xoutfr Managerment'
	,'cdp.ebgcfe.roles.ui_xoutfr::access'
	,'ui_xoutfr::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xoutfr'
 	,'ui_xoutfr Managerment'
	,'cdp.ebgcfe.roles.ui_xoutfr::createable'
	,'ui_xoutfr::createable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xoutfr'
 	,'ui_xoutfr Managerment'
	,'cdp.ebgcfe.roles.ui_xoutfr::deleteable'
	,'ui_xoutfr::deleteable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xoutfr'
 	,'ui_xoutfr Managerment'
	,'cdp.ebgcfe.roles.ui_xoutfr::editable'
	,'ui_xoutfr::editable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xoutfr'
 	,'ui_xoutfr Managerment'
	,'cdp.ebgcfe.roles.ui_xoutfr::exportable'
	,'ui_xoutfr::exportable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xoutfr'
 	,'ui_xoutfr Managerment'
	,'cdp.ebgcfe.roles.ui_xoutfr::uploadable'
	,'ui_xoutfr::uploadable' 	,'view role '	,'EBGCFE'    	,?	);
	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xoutfr'  ,'cdp.ebgcfe.roles.ui_xoutfr::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xoutfr'  ,'cdp.ebgcfe.roles.ui_xoutfr::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xoutfr'  ,'cdp.ebgcfe.roles.ui_xoutfr::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xoutfr'  ,'cdp.ebgcfe.roles.ui_xoutfr::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xoutfr'  ,'cdp.ebgcfe.roles.ui_xoutfr::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xoutfr'  ,'cdp.ebgcfe.roles.ui_xoutfr::uploadable', 'controllor',?);
             
--4.4
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_wwvar'
 	,'ui_wwvar Managerment'
	,'cdp.ebgcfe.roles.ui_wwvar::access'
	,'ui_wwvar::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_wwvar'
 	,'ui_wwvar Managerment'
	,'cdp.ebgcfe.roles.ui_wwvar::createable'
	,'ui_wwvar::createable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_wwvar'
 	,'ui_wwvar Managerment'
	,'cdp.ebgcfe.roles.ui_wwvar::deleteable'
	,'ui_wwvar::deleteable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_wwvar'
 	,'ui_wwvar Managerment'
	,'cdp.ebgcfe.roles.ui_wwvar::editable'
	,'ui_wwvar::editable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_wwvar'
 	,'ui_wwvar Managerment'
	,'cdp.ebgcfe.roles.ui_wwvar::exportable'
	,'ui_wwvar::exportable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_wwvar'
 	,'ui_wwvar Managerment'
	,'cdp.ebgcfe.roles.ui_wwvar::uploadable'
	,'ui_wwvar::uploadable' 	,'view role '	,'EBGCFE'    	,?	);
	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'wwvar'  ,'cdp.ebgcfe.roles.ui_wwvar::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'wwvar'  ,'cdp.ebgcfe.roles.ui_wwvar::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'wwvar'  ,'cdp.ebgcfe.roles.ui_wwvar::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'wwvar'  ,'cdp.ebgcfe.roles.ui_wwvar::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'wwvar'  ,'cdp.ebgcfe.roles.ui_wwvar::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'wwvar'  ,'cdp.ebgcfe.roles.ui_wwvar::uploadable', 'controllor',?);
       
--4.5
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xatt'
 	,'ui_xatt Managerment'
	,'cdp.ebgcfe.roles.ui_xatt::access'
	,'ui_xatt::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xatt'
 	,'ui_xatt Managerment'
	,'cdp.ebgcfe.roles.ui_xatt::createable'
	,'ui_xatt::createable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xatt'
 	,'ui_xatt Managerment'
	,'cdp.ebgcfe.roles.ui_xatt::deleteable'
	,'ui_xatt::deleteable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xatt'
 	,'ui_xatt Managerment'
	,'cdp.ebgcfe.roles.ui_xatt::editable'
	,'ui_xatt::editable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xatt'
 	,'ui_xatt Managerment'
	,'cdp.ebgcfe.roles.ui_xatt::exportable'
	,'ui_xatt::exportable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xatt'
 	,'ui_xatt Managerment'
	,'cdp.ebgcfe.roles.ui_xatt::uploadable'
	,'ui_xatt::uploadable' 	,'view role '	,'EBGCFE'    	,?	);
	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xatt'  ,'cdp.ebgcfe.roles.ui_xatt::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xatt'  ,'cdp.ebgcfe.roles.ui_xatt::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xatt'  ,'cdp.ebgcfe.roles.ui_xatt::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xatt'  ,'cdp.ebgcfe.roles.ui_xatt::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xatt'  ,'cdp.ebgcfe.roles.ui_xatt::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xatt'  ,'cdp.ebgcfe.roles.ui_xatt::uploadable', 'controllor',?);
       
--4.6
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xattc'
 	,'ui_xattc Managerment'
	,'cdp.ebgcfe.roles.ui_xattc::access'
	,'ui_xattc::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xattc'
 	,'ui_xattc Managerment'
	,'cdp.ebgcfe.roles.ui_xattc::createable'
	,'ui_xattc::createable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xattc'
 	,'ui_xattc Managerment'
	,'cdp.ebgcfe.roles.ui_xattc::deleteable'
	,'ui_xattc::deleteable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xattc'
 	,'ui_xattc Managerment'
	,'cdp.ebgcfe.roles.ui_xattc::editable'
	,'ui_xattc::editable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xattc'
 	,'ui_xattc Managerment'
	,'cdp.ebgcfe.roles.ui_xattc::exportable'
	,'ui_xattc::exportable' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_xattc'
 	,'ui_xattc Managerment'
	,'cdp.ebgcfe.roles.ui_xattc::uploadable'
	,'ui_xattc::uploadable' 	,'view role '	,'EBGCFE'    	,?	);
	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xattc'  ,'cdp.ebgcfe.roles.ui_xattc::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xattc'  ,'cdp.ebgcfe.roles.ui_xattc::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xattc'  ,'cdp.ebgcfe.roles.ui_xattc::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xattc'  ,'cdp.ebgcfe.roles.ui_xattc::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xattc'  ,'cdp.ebgcfe.roles.ui_xattc::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'xattc'  ,'cdp.ebgcfe.roles.ui_xattc::uploadable', 'controllor',?);
  
/*4.7*/      
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_adder_conf'
 	,'ui_adder_conf Managerment'
	,'cdp.ebgcfe.roles.ui_adder_conf::access'
	,'ui_adder_conf::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_adder_conf'
 	,'ui_adder_conf Managerment'
	,'cdp.ebgcfe.roles.ui_adder_conf::createable'
	,'ui_adder_conf::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_adder_conf'
 	,'ui_adder_conf Managerment'
	,'cdp.ebgcfe.roles.ui_adder_conf::deleteable'
	,'ui_adder_conf::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_adder_conf'
 	,'ui_adder_conf Managerment'
	,'cdp.ebgcfe.roles.ui_adder_conf::editable'
	,'ui_adder_conf::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_adder_conf'
 	,'ui_adder_conf Managerment'
	,'cdp.ebgcfe.roles.ui_adder_conf::exportable'
	,'ui_adder_conf::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_adder_conf'
 	,'ui_adder_conf Managerment'
	,'cdp.ebgcfe.roles.ui_adder_conf::uploadable'
	,'ui_adder_conf::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'adderConfiguration'  ,'cdp.ebgcfe.roles.ui_adder_conf::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'adderConfiguration'  ,'cdp.ebgcfe.roles.ui_adder_conf::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'adderConfiguration'  ,'cdp.ebgcfe.roles.ui_adder_conf::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'adderConfiguration'  ,'cdp.ebgcfe.roles.ui_adder_conf::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'adderConfiguration'  ,'cdp.ebgcfe.roles.ui_adder_conf::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'adderConfiguration'  ,'cdp.ebgcfe.roles.ui_adder_conf::uploadable', 'controllor',?);
       
/*4.8*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_flexible_adder'
 	,'ui_flexible_adder Managerment'
	,'cdp.ebgcfe.roles.ui_flexible_adder::access'
	,'ui_flexible_adder::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_flexible_adder'
 	,'ui_flexible_adder Managerment'
	,'cdp.ebgcfe.roles.ui_flexible_adder::createable'
	,'ui_flexible_adder::createable'
 	,'create role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_flexible_adder'
 	,'ui_flexible_adder Managerment'
	,'cdp.ebgcfe.roles.ui_flexible_adder::deleteable'
	,'ui_flexible_adder::deleteable'
 	,'delete role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_flexible_adder'
 	,'ui_flexible_adder Managerment'
	,'cdp.ebgcfe.roles.ui_flexible_adder::editable'
	,'ui_flexible_adder::editable'
 	,'edit role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_flexible_adder'
 	,'ui_flexible_adder Managerment'
	,'cdp.ebgcfe.roles.ui_flexible_adder::exportable'
	,'ui_flexible_adder::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_flexible_adder'
 	,'ui_flexible_adder Managerment'
	,'cdp.ebgcfe.roles.ui_flexible_adder::uploadable'
	,'ui_flexible_adder::uploadable'
 	,'uploadable role '
	,'EBGCFE'    
	,?
	);


/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'flexibleAdder'  ,'cdp.ebgcfe.roles.ui_flexible_adder::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'flexibleAdder'  ,'cdp.ebgcfe.roles.ui_flexible_adder::createable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'flexibleAdder'  ,'cdp.ebgcfe.roles.ui_flexible_adder::deleteable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'flexibleAdder'  ,'cdp.ebgcfe.roles.ui_flexible_adder::editable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'flexibleAdder'  ,'cdp.ebgcfe.roles.ui_flexible_adder::exportable', 'controllor',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'flexibleAdder'  ,'cdp.ebgcfe.roles.ui_flexible_adder::uploadable', 'controllor',?); 
                   
--5.1
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_seocostbom'
 	,'ui_seocostbom Managerment'
	,'cdp.ebgcfe.roles.ui_seocostbom::access'
	,'ui_seocostbom::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_seocostbom'
 	,'ui_seocostbom Managerment'
	,'cdp.ebgcfe.roles.ui_seocostbom::exportable'
	,'ui_seocostbom::exportable' 	,'view role '	,'EBGCFE'    	,?	);

	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'seoCostBom'  ,'cdp.ebgcfe.roles.ui_seocostbom::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'seoCostBom'  ,'cdp.ebgcfe.roles.ui_seocostbom::exportable', 'controllor',?);

--5.2
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_ctocostbom'
 	,'ui_ctocostbom Managerment'
	,'cdp.ebgcfe.roles.ui_ctocostbom::access'
	,'ui_ctocostbom::access' 	,'view role '	,'EBGCFE'    	,?	);
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'ui_ctocostbom'
 	,'ui_ctocostbom Managerment'
	,'cdp.ebgcfe.roles.ui_ctocostbom::exportable'
	,'ui_ctocostbom::exportable' 	,'view role '	,'EBGCFE'    	,?	);

	
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ctoCostBom'  ,'cdp.ebgcfe.roles.ui_ctocostbom::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ctoCostBom'  ,'cdp.ebgcfe.roles.ui_ctocostbom::exportable', 'controllor',?);


/*6.1*/       
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_where_used'
 	,'rpt_where_used Managerment'
	,'cdp.ebgcfe.roles.rpt_where_used::access'
	,'rpt_where_used::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_where_used'
 	,'rpt_where_used Managerment'
	,'cdp.ebgcfe.roles.rpt_where_used::exportable'
	,'rpt_where_used::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'whereUseReport'  ,'cdp.ebgcfe.roles.rpt_where_used::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'whereUseReport'  ,'cdp.ebgcfe.roles.rpt_where_used::exportable', 'controllor',?);

/*6.2*/       
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_outlook'
 	,'rpt_outlook Managerment'
	,'cdp.ebgcfe.roles.rpt_outlook::access'
	,'rpt_outlook::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_outlook'
 	,'rpt_outlook Managerment'
	,'cdp.ebgcfe.roles.rpt_outlook::exportable'
	,'rpt_outlook::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'outlookReport'  ,'cdp.ebgcfe.roles.rpt_outlook::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'outlookReport'  ,'cdp.ebgcfe.roles.rpt_outlook::exportable', 'controllor',?);
       
/*6.3*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_bom_missing_total'
 	,'rpt_bom_missing_total Managerment'
	,'cdp.ebgcfe.roles.rpt_bom_missing_total::access'
	,'rpt_bom_missing_total::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_bom_missing_total'
 	,'rpt_bom_missing_total Managerment'
	,'cdp.ebgcfe.roles.rpt_bom_missing_total::exportable'
	,'rpt_bom_missing_total::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'missingTotalReport'  ,'cdp.ebgcfe.roles.rpt_bom_missing_total::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'missingTotalReport'  ,'cdp.ebgcfe.roles.rpt_bom_missing_total::exportable', 'controllor',?);
       
       
/*6.4*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_material_margin'
 	,'rpt_material_margin Managerment'
	,'cdp.ebgcfe.roles.rpt_material_margin::access'
	,'rpt_material_margin::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_material_margin'
 	,'rpt_material_margin Managerment'
	,'cdp.ebgcfe.roles.rpt_material_margin::exportable'
	,'rpt_material_margin::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'materialMarginReport'  ,'cdp.ebgcfe.roles.rpt_material_margin::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'materialMarginReport'  ,'cdp.ebgcfe.roles.rpt_material_margin::exportable', 'controllor',?);
       
       
/*6.5*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_ctc'
 	,'rpt_ctc Managerment'
	,'cdp.ebgcfe.roles.rpt_ctc::access'
	,'rpt_ctc::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_ctc'
 	,'rpt_ctc Managerment'
	,'cdp.ebgcfe.roles.rpt_ctc::exportable'
	,'rpt_ctc::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ctcReport'  ,'cdp.ebgcfe.roles.rpt_ctc::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'ctcReport'  ,'cdp.ebgcfe.roles.rpt_ctc::exportable', 'controllor',?);
       
/*6.6*/
CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_cost_type_comparison'
 	,'rpt_cost_type_comparison Managerment'
	,'cdp.ebgcfe.roles.rpt_cost_type_comparison::access'
	,'rpt_cost_type_comparison::access'
 	,'view role '
	,'EBGCFE'    
	,?
	);

CALL "SECURITY"."cdp.security.procedures::createInfoRole" (
	'rpt_cost_type_comparison'
 	,'rpt_cost_type_comparison Managerment'
	,'cdp.ebgcfe.roles.rpt_cost_type_comparison::exportable'
	,'rpt_cost_type_comparison::exportable'
 	,'exportable role '
	,'EBGCFE'    
	,?
	);

/*	CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       <module_name> ,<view_name>  ,<role_name>, IN aMAP_TYPE  NVARCHAR(50),?);
*/
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'assemblyCostTypeComparisonReport'  ,'cdp.ebgcfe.roles.rpt_cost_type_comparison::access', 'view',?);
CALL "SECURITY"."cdp.security.procedures::createMapViewRole" (
       'EBGCFE' ,'assemblyCostTypeComparisonReport'  ,'cdp.ebgcfe.roles.rpt_cost_type_comparison::exportable', 'controllor',?);
