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
            var deleteUserInfo=function(record) {
                $.post('deluserbyid', {id:record.userid}, function (data) {
                    refreshGrid();
                }, 'json');
            };
            var viewUserInfo=function(record){
                require(['commonfuncs/popwin/win','text!views/manager/UserForm.htm','views/manager/UserForm'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'用户信息',
                            width:524,
                            html:$(htmfile).eq(0),
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {text:'保存',handler:function(html,parent){ }}
                            ],
                            renderHtml:function(poplocal,submitbtn,parent){
                                if(mynode){
                                    poplocal.find('[opt=tip]').text(mynode.totalname);
                                    poplocal.find('[name=regionid]').val(mynode.dvcode);


                                    $(submitbtn).bind('click', function () {
                                        poplocal.find('form').form('submit', {
                                            url: 'saveuser',
                                            onSubmit: function (param) {
                                                var isValid = $(this).form('validate');
                                                if (!isValid) {
                                                    $.messager.progress('close');
                                                }
                                                if(!poplocal.find('[name=userid]').val()){
                                                    param.flag=-1;
                                                }
                                                return isValid;
                                            },
                                            success: function (data) {
                                                var obj = $.evalJSON(data);
                                                if(obj.success) {
                                                    parent.trigger('close');
                                                    refreshGrid();
                                                }
                                            }
                                        })
                                    });
                                }
                                if(record) {
                                    $.post('getuserbyid',{
                                        id:record.userid
                                    },function(data){
                                        poplocal.find('form').form('load', data);//加载数据到表单
                                        poplocal.find('[opt=tip]').text(data.totalname);
                                    },'json')
                                }

                                jsfile.render(local,{
                                    parent:parent
                                })
                            }
                        })
                    })
            }
            var addRole=function(record){
                require(['commonfuncs/popwin/win','text!views/manager/Role.htm','views/manager/Role'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'添加角色信息',
                            width:524,
                            height:500,
                            html:$(htmfile),
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {text:'保存',handler:function(html,parent){ }}
                            ],
                            renderHtml:function(poplocal,submitbtn,parent){
                                jsfile.render(poplocal,{
                                    submitbtn:submitbtn,
                                    queryParams:record,
                                    parent:parent
                                })
                            }
                        })
                    })
            }


            var $mytree=$('#Divisiontree').tree({
                checkbox:true,
                url:'getdivisiontree',
                animate:true,
                onClick:function(node){
                    var dvcode=node.dvcode;
                    mynode=node;
                    var len=dvcode.length;
                    dvcode=dvcode.substr(len-2,len-1)=="00"?dvcode.substr(0,len-2):dvcode;
                    localDataGrid.datagrid('load',{
                        node: dvcode
                    });
                },onLoadSuccess:function(node, data){
                    if(!mynode){
                        mynode = data[0];
                    }
                }
            });

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
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
                                            viewUserInfo(record);
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
                    striped:true,
                    toolbar:local.find('div[tb]')
                })

            //添加用户的弹出表单
            local.find('[opt=adduser]').bind('click',function(){
                viewUserInfo();
            })
        }
    }
})