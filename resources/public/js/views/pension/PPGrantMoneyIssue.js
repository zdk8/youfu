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
                        width:450,
                        height:375,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},{
                                text:'资金发放',
                                handler:function(html,parent){
                                    console.log("资金发放")
                                }
                            },,{
                                text:'重新发放',
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
            url:'get-grantmoney',
            onLoadSuccess:function(data){
            }
        });
    }

    return {
        render:render
    }

})