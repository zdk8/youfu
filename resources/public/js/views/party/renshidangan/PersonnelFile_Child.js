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

        /*附件*/
        local.find('[opt=file_layout]').layout();
        local.find('[opt=file_dg]').datagrid();

        local.find('.filefolder ul li').on('click', function () {
            var $this = $(this);
            $this.addClass("menu_funcV").siblings().removeClass("menu_funcV");
            local.find('[opt=file_dg]').datagrid('reload');
        });
        
        /*附件上传*/
        local.find('[opt=file_up_btn]').click(function () {
            layer.load(2);
            require(['text!views/party/fileupload/FileForm.htm','views/party/fileupload/FileForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'上传附件',
                        type: 1,
                        area: ['400px', '200px'], //宽高
                        content: htmfile,
                        shift: 2,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    //childrecord:data
                                }
                            });
                        }
                    });
                }
            )
        });
    }
    return {
        render:render
    }

})