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
                layer.confirm('确定要删除么？', {icon: 3,title:'温馨提示'}, function(index){
                    layer.close(index);
                    layer.load();
                    $.post('deluserbyid', {id:record.userid}, function (data) {
                        if(data == 1){
                            layer.closeAll('loading');
                            refreshGrid();
                        }else{
                            layer.alert('该用户已经分配了角色，请先将用户与角色的关系解除再进行删除!', {icon: 6,title:'温馨提示'});
                            layer.closeAll('loading');
                        }
                    }, 'json');
                });
            };
            var viewUserInfo=function(record){
                require(['commonfuncs/popwin/win','text!views/manager/UserForm.htm','views/manager/UserForm'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:'用户信息',
                            width:524,
                            html:/*$(htmfile).eq(0)*/htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {text:'保存',handler:function(html,parent){ }}
                            ],
                            renderHtml:function(poplocal,submitbtn,parent){
                                var regionid;
                                if(record) {
                                    $.post('getuserbyid',{
                                        id:record.userid
                                    },function(data){
                                        poplocal.find('form').form('load', data);//加载数据到表单
                                        var districtnameval = getDivistionTotalname(data.regionid)
                                        regionid = data.regionid;
                                        poplocal.find('[opt=districtidmanager]').combotree("setValue",districtnameval)
                                        //poplocal.find('[opt=tip]').text(data.totalname);
                                    },'json')
                                }
                                if(mynode){
                                    poplocal.find('[opt=tip]').text(mynode.totalname);
                                    poplocal.find('[name=regionid]').val(mynode.dvcode);


                                    $(submitbtn).bind('click', function () {
                                        layer.load();
                                        poplocal.find('form').form('submit', {
                                            url: 'saveuser',
                                            onSubmit: function (param) {
                                                var isValid = $(this).form('validate');
                                                if (!isValid) {
                                                    //$.messager.progress('close');
                                                    layer.closeAll('loading');
                                                }
                                                if(!poplocal.find('[name=userid]').val()){
                                                    param.flag=-1;
                                                }
                                                if(!isNaN(poplocal.find("[opt=districtidmanager]").combotree("getValue"))){          //是否是数字
                                                    param.regionid = poplocal.find("[opt=districtidmanager]").combotree("getValue")
                                                }else{
                                                    param.regionid = regionid
                                                }
                                                return isValid;
                                            },
                                            success: function (data) {
                                                var obj = eval('('+data+')');
                                                if(obj.success) {
                                                    parent.trigger('close');
                                                    layer.closeAll('loading');
                                                    refreshGrid();
                                                }
                                            }
                                        })
                                    });
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
                            title:'添加角色',
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
                checkbox:false,
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
                    striped:true
                })

            //添加用户的弹出表单
            local.find('[opt=adduser]').bind('click',function(){
                viewUserInfo();
            })
            
            local.find('[opt=query]').click(function () {
                localDataGrid.datagrid('load',{
                    username:local.find('[opt=username]').val(),
                    node:mynode.dvcode.substr(mynode.dvcode.length-2,mynode.dvcode.length-1)=="00"?mynode.dvcode.substr(0,mynode.dvcode.length-2):mynode.dvcode
                });
            });
        }
    }
})