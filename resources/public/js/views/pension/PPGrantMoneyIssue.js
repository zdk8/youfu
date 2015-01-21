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
//                                text:'资金发放',
                                text:'发放',
                                handler:function(html,parent){
                                   /* $.messager.alert('提示',
                                        '<label style="color: darkgray">请输入业务期:如2015年01月业务期为-201501</label><br>' +
                                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业务期 :<input opt="datebs" type="text" style="width:100px" value="'+formatterYM(new Date())+'">',
                                        '');*/
                                    dolledata = parent.find("[opt=ppgrantmoneyissuedlg]").datagrid("getSelections");
                                    /*if(rows.length > 0){
                                        for(r=0;r<rows.length;r++){
                                            rowarrs.push(rows)
//                                            var oldpg_id = rows[r].pg_id;
//                                            var oldmoney = jq("#money").val();
                                            *//*$.post(
                                                'insert-grantmoney',
                                                {
                                                    grantid:grantmoney_key++,
                                                    bsnyue:jq("#bsnyue").val(),
                                                    pg_id:oldpg_id,
                                                    money:oldmoney
                                                },
                                                function(data){
                                                    lazgrantold(jq("#bsnyue").val())
                                                    lazgrantoldready();
                                                }
                                            )*//*
                                        }
                                    }*/
                                    var bsnyueval = parent.find('[opt=bsnyue]').datebox('getValue')
//                                    if(isNaN(bsnyueval) != ""){
//                                        console.log(111)
//                                    }
                                    $.messager.confirm('提示', '<label style="color: darkgray">当前发放的业务是 :'+bsnyueval+'</label>', function(r){
                                        if (r){
                                            $.ajax({
                                                url:"searchid11111",
                                                data:{
                                                    dolledata:JSON.stringify(dolledata),
                                                    bsnyue:bsnyueval
                                                },
                                                type:"post",
                                                dataType:"json",
                                                success:function(data){
                                                    console.log(data)
                                                }
                                            })
                                        }
                                    });
                                    console.log("资金发放")
                                }
                            },,{
//                                text:'重新发放',
                                text:'重发',
                                handler:function(html,parent){
                                    console.log("重新发放")
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
//            url:'get-grantmoney',
            url:'audit/getcompleteqop',
            onLoadSuccess:function(data){
            },
            toolbar:local.find('div[tb]')
        });
    }

    return {
        render:render
    }

})