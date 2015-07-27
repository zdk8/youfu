define(function(){
    return {
        render:function(local,option){
            var peopleinfodatarid = option.parent.find('.easyui-datagrid-noauto');      //查询界面datagrid
            var refreshGrid=function() {
                peopleinfodatarid.datagrid('reload');
            };
            peopleinfodatarid.datagrid({
                url:'old/getemptydetail',
                method:'post',
                queryParams: {
                    statictype:option.type_tjval,
                    districtid:option.districtidval,
                    gender:option.genderval,
                    minage:option.minage,
                    maxage:option.maxage,
                    staticvalue:option.rowval.staticvalue
                },
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var btns_arr=[viewbtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:record.name+'详细信息',
                                            htmfile:'text!views/pension/pensioninfo/EmptynestOldMan.htm',
                                            jsfile:'views/pension/pensioninfo/EmptynestOldMan',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:peopleinfodatarid                //刷新
                                            }
                                        })
                                    }
                                });
                            })(i);
                        }
                    }
                },
                rowStyler:function(rowIndex,rowData){
                    //console.log("diffDate: "+rowData.diffDate);
                    //return 'color:black;font-family:宋体;font-size:20';
                },
                striped:true
            })

            window.setTimeout(function(){
                refreshGrid();
            },500)

        }
    }
})