define(function(){
    function render(local,option){
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        var familymembersgrid = local.find('[opt=familymembersgrid]');      //老人信息子表
        var dealwith = local.find('[opt=dealwith]');            //处理按钮
//        showProcess(true, '温馨提示', '数据处理中，请稍后...');   //进度框加载
//        if(pensionform.form('load',option.queryParams.data).length > 0){

//            pensionform.form('load',option.queryParams.data)             //填充form
//            showProcess(false);
//        }
        if(option.queryParams.actiontype == "info"){            //处理
            dealwith.show();                  //显示处理按钮
            $.ajax({
                url:"searchid",
                data:{
                    id:option.queryParams.data.lr_id
                },
                type:"get",
                dataType:"json",
                success:function(data){
                    pensionform.form('load',data)        //填充form
//                    famillylist(option.queryParams.data.lr_id,familymembersgrid)     //填充子表
                    dealwithFunc({dealwith:dealwith,data:option.queryParams.data,refresh:option.queryParams.refresh})
                }
            })
        }
    }
    var queryflag = 0;   //存放查询出的家庭成员数据条数
    /*加载家庭成员列表*/
    function famillylist(lr_id,familymembersgrid){
        var familrelfields = familymembersgrid.datagrid("getColumnFields");  //获取全部元素的字段名
        $.post(
            'get-oldsocrel',
            {
                lr_id:lr_id
            },
            function(data){
                var addflag = 0;
                if(data.length >0){
                    for(i=0;i<data.length;i++){
                        familymembersgrid.datagrid('appendRow', {name: "", relationship: ""});
                        var editIndex = familymembersgrid.datagrid('getRows').length-1;
                        familymembersgrid.datagrid('selectRow', editIndex)
                            .datagrid('beginEdit', editIndex);
                        addflag+=1;
                        queryflag+=1;
                    }
                }
                if(addflag > 0){
                    for(d=0;d<data.length;d++){
                        var obj = data[d];
                        for(var key in obj){
                            var value = obj[key];
                            var data1 =  $("#familymembersgrid1").datagrid('getEditor',{index:d,field:key});
                            if(data1.type == "combobox"){
                                $(data1.target).combobox("setValue",value);
                            }else{
                                $(data1.target).val(value);
                            }
                        }
                    }
                }
            });
    }

    var dealwithFunc = function(params){
        params.dealwith.click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/PensionPeopleAuditDlg.htm','views/pension/PensionPeopleAuditDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'处理',
                        width:395,
                        height:250,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {
                                text:'保存',
                                handler:function(html,parent){ }}
                        ],
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                refresh:params.refresh,
                                data:params.data,
                                parent:parent,
//                                actiontype:'add',       //操作方式
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

    return {
        render:render
    }

})