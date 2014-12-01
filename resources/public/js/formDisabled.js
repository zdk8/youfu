var disabledForm = function(local){
    local.find('[opt=districtid]').combotree('readonly',true);            //行政区划
    local.find('[opt=gender]').combobox('readonly',true);               //性别
    local.find('[opt=birthdate]').datebox('readonly',true);               //出生年月
    local.find('[opt=nation]').combobox('readonly',true);               //民族
    local.find('[opt=type]').combobox('readonly',true);               //人员类型
}