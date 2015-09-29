define(function(){
    function render(local,option){
        local.find('[opt=other]').on('click', function () {
            local.find('[opt=func_btn]').animate({"right":'', width : "show"},500);
        });
        local.find('[opt=other_2]').on('click', function () {
            local.find('[opt=func_btn]').animate({"right":'', width : "hide"},500);
        });

        var datagrid = local.find('.easyui-datagrid-noauto');
        var refreshGrid=function() {
            datagrid.datagrid('reload');
        };
        /*加载领用/归还证件*/
        datagrid.datagrid({
            url:"party/getcerreceivelist",
            type:'post',
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var backbtns = local.find('[action=back]');           //归还
                var rows=data.rows;
                var btns_arr=[view,backbtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "back"){
                                    layer.load(2);
                                    require(['text!views/party/zhengjianguanli/PapersBackForm.htm','views/party/zhengjianguanli/PapersBackForm'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:'证件归还',
                                                type: 1,
                                                shift: 2,
                                                area: ['600px', '200px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'back',
                                                            record:record,
                                                            refresh:refreshGrid
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    )
                                }
                            });
                        })(i)
                    }
                }
            },
            rowStyler: function(index,row){
                if (row.returndate == null){
                    return 'color:#A52A2A;';
                }else{
                    return 'color:#20B2AA';
                }
            }
        })

        var name = local.find('[opt=name]');                        //姓名
        var credentialsnumb = local.find('[opt=credentialsnumb]');        //证件号
        var isback = local.find('[opt=isback]');        //是否归还
        /*搜索*/
        local.find('[opt=query]').click(function(){
            datagrid.datagrid('load',{
                name:name.val(),
                credentialsnumb:credentialsnumb.val(),
                isback:isback.combobox('getValue')
            })
        })

        /*领用证件*/
        local.find('[opt=addbtn]').click(function(){
            layer.load(2);
            require(['text!views/party/zhengjianguanli/PapersReceptionForm.htm','views/party/zhengjianguanli/PapersReceptionForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'证件领用',
                        type: 1,
                        area: ['600px', '200px'], //宽高
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
            )
        });


    }

    return {
        render:render
    }

})