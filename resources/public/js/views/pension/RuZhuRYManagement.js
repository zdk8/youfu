define(function(){
    var render = function(local,option){
        var rzrygl = local.find('[opt=ruzhurymanagement]');        //入住人员管理
        var refresh = local.find('[opt=refresh]');        //刷新
        rzrygl.datagrid({
            url:'pension/getalloldpeopledepart',
            /*queryParams:{
                deptype:'jigou'
            },*/
            type:'post',
            onLoadSuccess:function(data){
                console.log(data)
               /* var updates = local.find('[action=update]');           //修改
                var del = local.find('[action=delete]');                //删除
                var addrzry = local.find('[action=addrzry]');                //添加入住人员*/
                var cancellation = local.find('[action=cancellation]');     //注销入住人员
                var rows=data.rows;
//                var btns_arr=[updates,del,addrzry];
                var btns_arr=[cancellation];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "cancellation"){             //注销
//                                    console.log(record.departname)
                                    var data = record;
                                    var departname = record.departname;         //机构名称
                                    $.messager.confirm('温馨提示', '是否注销该人员?', function(r){
                                        if (r){
                                            console.log(r)
                                        }
                                    });
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        refresh.click(function(){
            rzrygl.datagrid('reload');
        })
    }

    return {
        render:render
    }
})