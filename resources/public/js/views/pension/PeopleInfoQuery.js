define(function(){
    function searcholdpeople(local,func,oldtype){
        var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
        peopleinfodatarid.datagrid({
            url:func,
            method:'post',
            queryParams: {
                oldtype:oldtype
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
                }
            },
            striped:true,
            toolbar:local.find('div[tb]')
        })
    }
    return {
        render:function(local,option){
            var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            localDataGrid=searcholdpeople(local,'old/search-oldpeople','');



            /*老人类型选择*/
            var ppselect = local.find('[opt=ppselect]');
            ppselect.change(function () {
                if(ppselect.val() == ""){         //所有老人
                    /*''*/
                    console.log("所有老人");
                }else if(ppselect.val() == "f"){  //服务评估老人
                    /*f*/
                    console.log("服务评估老人");
                }else if(ppselect.val() == "j"){  //养老机构老人
                    /*j*/
                    console.log("养老机构老人");
                }else if(ppselect.val() == "s"){  //养老机构老人
                    /*s*/
                    console.log("三低老人");
                }
            })

            var name = local.find('[opt=name]');                        //姓名
            var identityid = local.find('[opt=identityid]');        //身份证
            /*搜索*/
            local.find('.searchbtn').click(function(){
                peopleinfodatarid.datagrid('load',{
                    oldtype:ppselect.val(),
                    name:name.searchbox('getValue'),
                    identityid:identityid.searchbox('getValue')
                })
            })
        }
    }
})