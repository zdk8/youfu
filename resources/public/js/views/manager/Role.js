define(function(){
    function initFunc(local,option){
        layer.closeAll('loading');
        var localDataGrid,mynode;
        var refreshGrid=function() {
            localDataGrid.datagrid('reload');
        };
        var deleteRoleInfo=function(record) {
            layer.confirm('确定要删除么？', {icon: 3,title:'温馨提示'}, function(index){
                layer.close(index);
                layer.load();
                $.post('delrolebyid', {id:record.roleid}, function (data) {
                    layer.closeAll('loading');
                    cj.showSuccess('删除成功');
                    refreshGrid();
                }, 'json');
            });

        };

        var grant=function(record){
            layer.load(2);
            require(['text!views/manager/Grant.htm','views/manager/Grant'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'授权信息',
                        type: 1,
                        area: ['524px', '400px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    record:record,
                                    refresh:refreshGrid
                                }
                            });
                        }
                    });
                }
            );
        }

        localDataGrid=
            local.find('.easyui-datagrid-noauto').datagrid({
                url:'getrole',
                queryParams: {
                    intelligentsp:null,
                    userid:option && option.queryParams?option.queryParams.userid:null
                },
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var deletebtns=local.find('[action=delete]');
                    var grantbtns=local.find('[action=grant]');
                    var btns_arr=[viewbtns,deletebtns,grantbtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        layer.load(2);
                                        require(['text!views/manager/RoleForm.htm','views/manager/RoleForm'],
                                            function(htmfile,jsfile){
                                                layer.open({
                                                    title:'角色信息',
                                                    type: 1,
                                                    area: ['400px', '200px'], //宽高
                                                    content: htmfile,
                                                    success: function(layero, index){
                                                        jsfile.render(layero,{
                                                            index:index,
                                                            queryParams:{
                                                                actiontype:'update',
                                                                record:record,
                                                                refresh:refreshGrid
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        );
                                    }else if($(this).attr("action")=='delete'){
                                        deleteRoleInfo(record);
                                    }else if($(this).attr("action")=='grant'){
                                        grant(record);
                                    }
                                });
                            })(i);
                        }

                        //check
                        if(rows[i].userid) {
                            localDataGrid.datagrid('checkRow', i);
                        }
                    }
                },
                striped:true
            })

        //添加角色的弹出表单
        local.find('[opt=addrole]').bind('click',function(){
            layer.load(2);
            require(['text!views/manager/RoleForm.htm','views/manager/RoleForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'添加角色',
                        type: 1,
                        area: ['400px', '200px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'add',
                                    refresh:refreshGrid
                                }
                            });
                        }
                    });
                }
            );
        })

        /*if(option && option.submitbtn) {
            option.submitbtn.bind('click',function(){
                layer.load();
                var checkedrows=localDataGrid.datagrid('getChecked');
                var ids=""
                for(var i= 0,len=checkedrows.length;i<len;i++) {
                    if (ids != '') ids += ',';
                    ids += checkedrows[i].roleid;
                }
                $.post('saveroleuser', {userid:option.queryParams.userid,roleids:ids}, function (data) {
                    layer.closeAll('loading');
                    option.parent.trigger('close');
                }, 'json');
            })
        }*/

        local.find('[opt=query]').click(function () {
            localDataGrid.datagrid('load',{
                rolename:local.find('[opt=rolename]').val()
            });
        });

    }




    var render=function(l,o){
        initFunc(l,o);//初始化
    }

    return {
        render:render
    }
})