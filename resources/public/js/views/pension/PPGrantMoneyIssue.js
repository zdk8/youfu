define(function(){
    function render(local,option){
        lazgrantoldready(local);            //加载已享受资金发放人员
        addgrantmoneyFunc(local);
    }

    /*新增资金方法人员*/
    function addgrantmoneyFunc(local){
        var addgrantmoney = local.find('[opt=addgrantmoney]');
        addgrantmoney.click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/PPGrantMoneyIssueDlg.htm','views/pension/PPGrantMoneyIssueDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'资金发放【月发放】',
                        width:600,
                        height:375,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},{
                                text:'发放',
                                handler:function(html,parent){
                                    var dolledata = parent.find("[opt=ppgrantmoneyissuedlg]").datagrid("getSelections");
                                    var bsnyueval = parent.find('[opt=bsnyue]').datebox('getValue')
//                                    if(isNaN(bsnyueval) != ""){
//                                        console.log(111)
//                                    }
                                    if(dolledata.length){
                                        $.messager.confirm('提示', '<label style="color: darkgray">当前发放的业务期是 :'+bsnyueval+'</label>', function(r){
                                            if (r){
                                                $.ajax({
                                                    url:"audit/sendmoney",
                                                    data:{
                                                        dolledata:JSON.stringify(dolledata),
                                                        bsnyue:bsnyueval
                                                    },
                                                    type:"post",
                                                    dataType:"json",
                                                    success:function(data){
                                                        if(data){
                                                            cj.slideShow('发放完成!')
                                                            parent.find("[opt=ppgrantmoneyissuedlg]").datagrid("reload")
                                                            local.find("[opt=ppgrantmoneyissue]").datagrid('reload')
                                                        }else{
                                                            cj.slideShow('<label style="color: red">发放失败!</label>')
                                                        }
                                                    }
                                                })
                                            }
                                        });
                                    }else{
                                        $.messager.alert('提示','请选择要发放的人员','info')
                                    }
                                }
                            },{
                                text:'重发',
                                handler:function(html,parent){
                                    var bsnyueval = parent.find('[opt=bsnyue]').datebox('getValue')
                                    $.messager.confirm('提示', '<label style="color: darkgray">是否将业务期为【'+bsnyueval+'】的人员全部重发?</label>', function(r){
                                        if (r){
                                            $.ajax({
                                                url:"audit/resendmoney",
                                                data:{
                                                    doleid:'',
                                                    bsnyue:bsnyueval
                                                },
                                                type:"post",
                                                dataType:"json",
                                                success:function(data){
                                                    if(data){
                                                        cj.slideShow('重发成功!')
                                                        parent.find("[opt=ppgrantmoneyissuedlg]").datagrid("reload")
                                                        local.find("[opt=ppgrantmoneyissue]").datagrid('reload')
                                                    }else{
                                                        cj.slideShow('<label style="color: red">重发失败!</label>')
                                                    }
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        ],
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                parent:parent,
//                                refresh:refresh,         //刷新按钮
                                actiontype:'add',       //操作方式
                                onCreateSuccess:function(data){
                                    parent.trigger('close');
                                }
                            })
                        }
                    })
                }
            )
        })
    }
    /*加载已享受资金发放人员*/
    function lazgrantoldready(local){
        var ppgrantmoneyissue = local.find("[opt=ppgrantmoneyissue]");
        ppgrantmoneyissue.datagrid({
            url:'audit/getcompleteqop',
            onLoadSuccess:function(data){
                var resendbtn=local.find('[action=resend]');
                var btns_arr=[resendbtn];
                var rows=data.rows;
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                if($(this).attr("action")=='resend'){
                                    $.messager.confirm('是否重发',
                                        '<label style="color: darkgray">姓名 :'+record.name+'<br>业务期 :'+record.bsnyue+'</label>',
                                        function(r){
                                            if (r){
                                                $.ajax({
                                                    url:"audit/resendmoney",
                                                    data:{
                                                        doleid:record.doleid,
                                                        bsnyue:""
                                                    },
                                                    type:"post",
                                                    dataType:"json",
                                                    success:function(data){
                                                        if(data){
                                                            cj.slideShow('重发成功!')
                                                            ppgrantmoneyissue.datagrid('reload')
                                                        }else{
                                                            cj.slideShow('<label style="color: red">重发失败!</label>')
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    );
                                }
                            });
                        })(i);
                    }
                }
            },
            toolbar:local.find('div[tb]')
        });

        local.find('.searchbtn').click(function(){
            ppgrantmoneyissue.datagrid('load',{
                name:local.find('[opt=name]').searchbox('getValue'),
                identityid:local.find('[opt=identityid]').searchbox('getValue'),
                bsnyue:local.find('[opt=bsnyue]').searchbox('getValue')
            })
        })
        /*导出报表*/
        local.find('[opt=exportexcel]').click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/PPGrantMoneyIssueXls.htm','views/pension/PPGrantMoneyIssueXls'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'excel导出',
                        width:700,
                        height:375,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},{text:'导出',handler:function(html,parent){
//                                parent.trigger('close');

                                window.location.href="report-xls-post?year="+parent.find('[opt=yearvalue]').val()+
                                                        "&months="+parent.find('[opt=monthvalue]').val()+
                                                        "&nums="+parent.find('[opt=monthvaluenum]').val();
                                /*$.ajax({
                                    url:"report-xls-post",
                                    data:{
                                        year:parent.find('[opt=yearvalue]').val(),
                                        months:parent.find('[opt=monthvalue]').val(),
                                        nums:parent.find('[opt=monthvaluenum]').val()
                                    },
                                    type:"get",
                                    success:function(data){
                                        if(data == "true"){
                                            window.location.href="report-xls-post?year="+parent.find('[opt=yearvalue]').val()+
                                            "&months="+parent.find('[opt=monthvalue]').val()+
                                            "&nums="+parent.find('[opt=monthvaluenum]').val();
                                            cj.slideShow("导出成功")
                                        }else{
                                            cj.slideShow('<label style="color: red">导出失败</label>')
                                        }
                                    }
                                })*/
                            }}
                        ],
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                parent:parent,
//                                refresh:refresh,         //刷新按钮
                                actiontype:'add',       //操作方式
                                onCreateSuccess:function(data){
                                    parent.trigger('close');
                                }
                            })
                        }
                    })
                }
            )
//            window.location.href= "report-xls/my-test2";
            /*$.ajax({
                url:"report-xls/my-test2",
                type:"get",
                data:{

                },
                onLoadSuccess:function(data){
                    console.log(11)
                }
            })*/
        })
    }

    return {
        render:render
    }

})