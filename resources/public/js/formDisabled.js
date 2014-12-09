var disabledForm = function(local){
    local.find('[opt=districtid]').combotree('readonly',true);            //行政区划
    local.find('[opt=gender]').combobox('readonly',true);               //性别
    local.find('[opt=birthdate]').datebox('readonly',true);               //出生年月
    local.find('[opt=identityid]').datebox('readonly',true);               //身份证
    local.find('[opt=nation]').combobox('readonly',true);               //民族
    local.find('[opt=type]').combobox('readonly',true);               //人员类型
    local.find('[opt=culture]').combobox('readonly',true);               //文化程度
}