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
            var deleteRoleInfo=function(record) {
                $.post('delrolebyid', {id:record.roleid}, function (data) {
                    refreshGrid();
                }, 'json');
            };
            var viewRoleInfo=function(record){
                require(['commonfuncs/popwin/win','text!views/manager/RoleForm.htm'],
                    function(win,htmfile){
                        win.render({
                            title:'角色信息',
                            width:524,
                            height:200,
                            html:$(htmfile).eq(0),
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {text:'保存',handler:function(html,parent){ }}
                            ],
                            renderHtml:function(poplocal,submitbtn,parent){
                                if(true){
                                    $(submitbtn).bind('click', function () {
                                        poplocal.find('form').form('submit', {
                                            url: 'saverole',
                                            onSubmit: function (param) {
                                                var isValid = $(this).form('validate');
                                                if (!isValid) {
                                                    $.messager.progress('close');
                                                }
                                                if(!poplocal.find('[name=roleid]').val()){
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
                                    $.post('getrolebyid',{
                                        id:record.roleid
                                    },function(data){
                                        poplocal.find('form').form('load', data);//加载数据到表单
                                    },'json')
                                }
                            }
                        })
                    })
            }
            var grant=function(record){
                require(['commonfuncs/popwin/win','text!views/manager/Grant.htm','views/manager/Grant'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'授权信息',
                            width:524,
                            height:500,
                            html:$(htmfile).eq(0),
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
                                    parent:parent,
                                    onCreateSuccess:function(data){
                                        refreshGrid();
                                    }
                                })
                            }
                        })
                    })
            }

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'getrole',
                    queryParams: {
                        intelligentsp:null,
                        userid:option.queryParams?option.queryParams.userid:null
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
                                            viewRoleInfo(record);
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
                    striped:true,
                    toolbar:local.find('div[tb]')
                })

            //添加用户的弹出表单
            local.find('[opt=addrole]').bind('click',function(){
                viewRoleInfo();
            })

            if(option.submitbtn) {
                option.submitbtn.bind('click',function(){
                    var checkedrows=localDataGrid.datagrid('getChecked');
                    var ids=""
                    for(var i= 0,len=checkedrows.length;i<len;i++) {
                        if (ids != '') ids += ',';
                        ids += checkedrows[i].roleid;
                    }
                    $.post('saveroleuser', {userid:option.queryParams.userid,roleids:ids}, function (data) {
                        option.parent.trigger('close');
                    }, 'json');
                })
            }

        }
    }
})