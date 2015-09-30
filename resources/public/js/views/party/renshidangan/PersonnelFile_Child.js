define(function(){
    var render=function(local,option){
        layer.closeAll('loading');
        local.find('[opt=form_child]').tabs();

        /*学历学位加载*/
        local.find('[opt=edu_datagrid]').datagrid({
            data:option.queryParams.childrecord.educationway
        });
        /*主要家庭成员加载*/
        local.find('[opt=fam_datagrid]').datagrid({
            data:option.queryParams.childrecord.familymembers
        });

        /*附件*/
        local.find('[opt=file_layout]').layout();
        /*附件加载*/
        local.find('[opt=file_datagrid]').datagrid({
            url:"party/getfileslist",
            queryParams:{
                attach_type:'gbrm',     //附件类型
                pr_id:option.queryParams.record.pr_id
            },
            type:'post',
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var downloadbtns = local.find('[action=download]');           //下载
                var delbtns = local.find('[action=del]');           //删除
                var rows=data.rows;
                var btns_arr=[view,delbtns,downloadbtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "view"){                                       //详细信息
                                    //updateFunc(record,refreshGrid);
                                }else if(action == "del"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/deletefilebyid',
                                            type:'post',
                                            data:{
                                                attach_id:record.attach_id,
                                                fie_path:record.fie_path
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "success"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    local.find('[opt=file_datagrid]').datagrid('reload');
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "download"){                   //下载
                                    var downloadurl = 'party/filedown?filename='+encodeURI(record.fie_path)+"&convert=1";
                                    window.location.href=downloadurl;
                                }
                            });
                        })(i)
                    }
                }
            }
        });

        local.find('.filefolder ul li').on('click', function () {
            var $this = $(this);
            $this.addClass("menu_funcV").siblings().removeClass("menu_funcV");
            local.find('[opt=file_datagrid]').datagrid('load',{
                pr_id:option.queryParams.record.pr_id,
                attach_type:$this.find('span').attr('opt')
            });
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
                                    plocal:local,
                                    pr_id:option.queryParams.record.pr_id,
                                    file_dg:local.find('[opt=file_datagrid]')
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