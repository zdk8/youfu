define(function(){
    return {
        render:function(local,option){
            lloo = local;
            opt = option;
            console.log(local)
            var peopleinfodatarid = option.parent.find('.easyui-datagrid-noauto');      //查询界面datagrid
            var refreshGrid=function() {
                peopleinfodatarid.datagrid('reload');
            };
            peopleinfodatarid.datagrid({
                url:'old/getemptydetail',
                method:'post',
                queryParams: {
                    type_tjval:option.type_tjval,
                    districtidval:option.districtidval,
                    genderval:option.genderval,
                    minage:option.minage,
                    maxage:option.maxage,
                    rowval:option.rowval
                },
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var deletebtns=local.find('[action=delete]');
                    var grantbtns=local.find('[action=grant]');
                    var mapbtn = local.find('[action=map]');                //地图
                    var btns_arr=[viewbtns,deletebtns,grantbtns,mapbtn];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:record.name+'详细信息',
                                            htmfile:'text!views/pension/EmptynestOldMan.htm',
                                            jsfile:'views/pension/EmptynestOldMan',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:peopleinfodatarid                //刷新
                                            }
                                        })
                                    }else if($(this).attr("action")=='map'){
                                        var ywtype = "PT_LNR"
                                        //var mapguid = record.mapguid;
                                        window.open (mapURL+'map#task?ywtype='+ywtype+'&'+
                                            'mapguid='+record.mapguid,
                                            'newwindow', 'height='+window.screen.availHeight+', width='+window.screen.availWidth+', top=0, left=0, toolbar=no, ' +
                                            'menubar=no, scrollbars=no, resizable=no,location=n o, status=no')

                                    }else if($(this).attr("action")=='delete'){
                                        $.messager.confirm('是否删除',
                                            '确定删除？',
                                            function(r){
                                                if (r){
                                                    $.ajax({
                                                        url:"old/delenpeople",
                                                        data:{
                                                            kc_id:record.kc_id
                                                        },
                                                        type:"post",
                                                        success:function(data){
                                                            if(data == "success"){
                                                                peopleinfodatarid.datagrid('reload');
                                                                cj.slideShow('删除成功!')
                                                            }else{
                                                                cj.slideShow('<label style="color: red">删除失败!</label>')
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        );
                                        //grant(record);
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