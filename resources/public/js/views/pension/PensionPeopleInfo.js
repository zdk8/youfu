define(function(){
    function render(local,option){
        var pensionform = local.find('[opt=pensionform]');      //老人信息表
        var dealwith = local.find('[opt=dealwith]');
//        showProcess(true, '温馨提示', '数据处理中，请稍后...');   //进度框加载
//        if(pensionform.form('load',option.queryParams.data).length > 0){

//            pensionform.form('load',option.queryParams.data)             //填充form
//            showProcess(false);
//        }
        if(option.queryParams.actiontype == "info"){            //处理
            dealwith.show();                  //显示处理按钮
            pensionform.form('load',option.queryParams.data)        //填充form
        }
//        console.log( pensionform.form('load',option.queryParams.data))

        var dealwithFunc = function(dealwith,ppaudit){
            dealwith.click(function(){
                var data = ppaudit.datagrid("getSelected");
                console.log(ppaudit.datagrid("getSelected"))
                if(ppaudit.datagrid("getSelected") != null){
                    require(['commonfuncs/popwin/win','text!views/pension/PensionPeopleAuditDlg.htm','views/pension/PensionPeopleAuditDlg'],
                        function(win,htmfile,jsfile){
                            win.render({
                                title:'审核',
                                width:395,
                                height:315,
//                        bgvisibel:false,
                                html:htmfile,
                                renderHtml:function(local,submitbtn,parent){
                                    jsfile.render(local,{
                                        submitbtn:submitbtn,
                                        act:'c',
                                        data:data,
                                        parent:parent,
                                        actiontype:'add',       //操作方式
                                        onCreateSuccess:function(data){
                                            parent.trigger('close');
                                        }
                                    })
                                }
                            })
                        }
                    )
                }else{
                    alert("请选择要处理的数据")
                }

            })
        }
    }

    return {
        render:render
    }

})