define(function(){
    return {
        render:function(local,option){
            var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            peopleinfodatarid.datagrid({
                url:'old/getenpeople',
                method:'post',
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var deletebtns=local.find('[action=delete]');
                    var updatebtns=local.find('[action=update]');
                    var btns_arr=[viewbtns,deletebtns,updatebtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        layer.load();
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:record.name+'详细信息',
                                            htmfile:'text!views/pension/pensioninfo/EmptynestOldMan.htm',
                                            jsfile:'views/pension/pensioninfo/EmptynestOldMan',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:peopleinfodatarid                //刷新
                                            }
                                        });
                                    }else if($(this).attr("action")=='delete'){
                                        layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                            layer.close(index);
                                            layer.load();
                                            $.ajax({
                                                url:'old/delenpeople',
                                                type:'post',
                                                data:{
                                                    kc_id:record.kc_id
                                                },
                                                success: function (data) {
                                                    if(data == "success"){
                                                        layer.closeAll('loading');
                                                        layer.alert('删除成功', {icon: 6});
                                                        peopleinfodatarid.datagrid('reload');
                                                    }else{
                                                        layer.closeAll('loading');
                                                        layer.alert('删除失败', {icon: 5});
                                                    }
                                                }
                                            });
                                        });
                                    }else if($(this).attr("action") == 'update'){
                                        layer.load();
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:record.name+'信息修改',
                                            htmfile:'text!views/pension/pensioninfo/EmptynestOldMan.htm',
                                            jsfile:'views/pension/pensioninfo/EmptynestOldMan',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:peopleinfodatarid                //刷新
                                            }
                                        });
                                    }
                                });
                            })(i);
                        }
                    }
                },
                striped:true,
                toolbar:local.find('div[tb]')
            })



            var name = local.find('[opt=name]');                        //姓名
            var gender = local.find('[opt=gender]');        //性别
            /*搜索*/
            local.find('[opt=query]').click(function(){
                peopleinfodatarid.datagrid('load',{
                    name:name.val(),
                    gender:gender.combobox('getValue'),
                    minage:local.find('[opt=minage]').val(),
                    maxage:local.find('[opt=maxage]').val()
                })
            })
            
            /*空巢老人录入*/
            local.find('[opt=add_emptynest]').click(function () {
                var title = "空巢老人录入";
                if($("#tabs").tabs('getTab',title)){
                    $("#tabs").tabs('select',title)
                }else{
                    cj.showContent({                                          //详细信息(tab标签)
                        title:title,
                        htmfile:'text!views/pension/pensioninfo/EmptynestOldMan.htm',
                        jsfile:'views/pension/pensioninfo/EmptynestOldMan',
                        queryParams:{
                            actiontype:'add',         //（处理）操作方式
                            title:title,
                            datagrid:peopleinfodatarid
                        }
                    })
                }
            });
        }
    }
})