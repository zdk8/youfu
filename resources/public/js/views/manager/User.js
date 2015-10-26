/**
 * Created by Administrator on 2014/9/28.
 */
define(function(){
    return {
        render:function(local,option){

            var localDataGrid,mynode;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid= local.find('.easyui-datagrid-noauto').datagrid({
                url:'getuserbyregionid',
                queryParams: {
                    intelligentsp:null
                },
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var deletebtns=local.find('[action=delete]');
                    var addrolebtns=local.find('[action=addrole]');
                    var btns_arr=[viewbtns,deletebtns,addrolebtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        layer.load(2);
                                        require(['text!views/manager/UserForm.htm','views/manager/UserForm'],
                                            function(htmfile,jsfile){
                                                layer.open({
                                                    title:'用户信息',
                                                    type: 1,
                                                    area: ['500px', '300px'], //宽高
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
                                        deleteUserInfo(record);
                                    }else if($(this).attr("action")=='addrole'){
                                        addRole(record);
                                    }
                                });
                            })(i);
                        }
                    }
                },
                striped:true
            })
            var deleteUserInfo=function(record) {
                layer.confirm('确定要删除么？', {icon: 3,title:'温馨提示'}, function(index){
                    layer.close(index);
                    layer.load();
                    $.post('deluserbyid', {id:record.userid}, function (data) {
                        if(data == 1){
                            layer.closeAll('loading');
                            cj.showSuccess('删除成功');
                            refreshGrid();
                        }else{
                            layer.alert('该用户已经分配了角色，请先将用户与角色的关系解除再进行删除!', {icon: 6,title:'温馨提示'});
                            layer.closeAll('loading');
                        }
                    }, 'json');
                });
            };

            var addRole=function(record){
                layer.load(2);
                require(['text!views/manager/UserRole.htm','views/manager/UserRole'],
                    function(htmfile,jsfile){
                        layer.open({
                            title:'添加角色',
                            type: 1,
                            area: ['624px', '500px'], //宽高
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

            //添加用户的弹出表单
            local.find('[opt=adduser]').bind('click',function(){
                layer.load(2);
                require(['text!views/manager/UserForm.htm','views/manager/UserForm'],
                    function(htmfile,jsfile){
                        layer.open({
                            title:'添加用户',
                            type: 1,
                            area: ['500px', '300px'], //宽高
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
            
            local.find('[opt=query]').click(function () {
                localDataGrid.datagrid('load',{
                    username:local.find('[opt=username]').val()
                });
            });
        }
    }
})