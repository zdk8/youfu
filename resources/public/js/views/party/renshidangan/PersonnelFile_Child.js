define(function(){
    var render=function(local,option){
        layer.closeAll('loading');
        local.find('[opt=form_child]').tabs();

        local.find('[opt=edu_datagrid]').datagrid({
            data:option.queryParams.childrecord.educationway
        });
        local.find('[opt=fam_datagrid]').datagrid({
            data:option.queryParams.childrecord.familymembers
        });
    }
    return {
        render:render
    }

})