define(function(){
    return {
        render:function(local,option){
            var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                peopleinfodatarid.datagrid({
                    url:'old/search-oldpeople',
                    method:'post',
                    queryParams: {

                    },
                    onDblClickRow: function(){
                        var selected = localDataGrid.datagrid('getSelected');
                        if (selected){
                            var post = localDataGrid.datagrid("getSelected").name;
                            var id = localDataGrid.datagrid("getSelected").lr_id;
//                        alert("ok"+post+"id:"+id);
                            var jq = $;
                            if (jq('#tabs').tabs('exists', post+'详细信息'))
                                jq('#tabs').tabs('select', post+'详细信息');
                            else {
                                var content = '<iframe scrolling="auto" frameborder="0"  src="'+"search?id=" + id+'" style="width:100%;height:100%;"></iframe>';
                                jq('#tabs').tabs('add',{
                                    title:post+'详细信息',
                                    content:content,
                                    closable:true
                                });
                            }
                        }
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
                                            cj.showContent({                                          //详细信息(tab标签)
                                                title:record.name+'详细信息',
                                                htmfile:'text!views/pension/PensionPeopleInfo.htm',
                                                jsfile:'views/pension/PensionPeopleInfo',
                                                queryParams:{
                                                    actiontype:'update',         //（处理）操作方式
                                                    data:record,                   //填充数据
                                                    refresh:peopleinfodatarid                //刷新
                                                }
                                            })
                                            //viewRoleInfo(record);
                                        }else if($(this).attr("action")=='delete'){
                                            //deleteRoleInfo(record);
                                        }else if($(this).attr("action")=='grant'){
                                            //grant(record);
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

            var name = local.find('[opt=name]');                        //姓名
            var identityid = local.find('[opt=identityid]');        //身份证
            /*搜索*/
            local.find('.searchbtn').click(function(){
                peopleinfodatarid.datagrid('load',{
                    name:name.searchbox('getValue'),
                    identityid:identityid.searchbox('getValue')
                })
            })
        }
    }
})