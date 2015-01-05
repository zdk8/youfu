define(function(){


    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '删除',hidden:'hidden',opt:'delete'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    var actionInfo=function(local,option) {
        addToolBar(local);
        local.find('form').form('load',option.queryParams.data)
    };


    function create(local,option){
        addToolBar(local);
        /*为每个label注册收缩事件*/
        local.find('fieldset').find('legend').find('label').each(function(obj,fn,arg){
            var labelopt = fn.attributes[0].value.toString()
            var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
            if(label_talbe != "baseinfo"){
                FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
            }
        }).click(function(e){
                var labelopt = $(this)[0].attributes[0].value.toString();
                var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
                FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
            })
        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);                                          //加载行政区划
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        var familymembersgrid = local.find('[opt=familymembersgrid]');      //老人信息子表
        var dealwith = local.find('[opt=dealwith]');            //处理按钮

        local.find('[name=operators]').val(cj.getUserMsg().username);
        local.find('[opt=setdaytime]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));

        /*if(option.queryParams && option.queryParams.actiontype == "info"){            //处理
            dealwith.show();                                        //显示处理按钮
            local.find('[opt=newfamilymemeradd_btn]').hide()   //隐藏子表新增按钮
            local.find('[opt=delfamilymemer_btn]').hide()      //隐藏子表删除按钮
            for(var i=0;i<pensionform[0].length;i++){             //禁用表单
                var element = pensionform[0].elements[i];
                element.disabled = true
            }
            disabledForm(local);                                //禁用easyui框
            $.ajax({
                url:"searchid",                                //查询老人表
                data:{
                    id:option.queryParams.data.lr_id
                },
                type:"post",
                dataType:"json",
                success:function(data){
                    pensionform.form('load',data)        //填充主表
                    //famillylist(option.queryParams.data.lr_id)     //填充子表
                    dealwithFunc({dealwith:dealwith,data:option.queryParams.data,refresh:option.queryParams.refresh}) //数据处理
                    showProcess(false);
                }
            })
        }else{
            *//*加载地区树*//*
            var divisiontree = local.find('[opt=mydistrictid]') ;
            divisiontree.combotree({
                url:'get-divisionlist?dvhigh=330424',
                method: 'get',
                onBeforeExpand: function (node) {
                    divisiontree.combotree("tree").tree("options").url
                        ="get-divisionlist?dvhigh=" + node.parentid;
                },
                onHidePanel: function () {
                    divisiontree.combotree('setValue',
                        divisiontree.combotree('tree').tree('getSelected').divisionpath);
                }
            });
            require(['commonfuncs/BirthGenderAge'],function(js){
                js.render(local)
            })

            local.find('[opt=save]').show().bind('click',function(){
                local.find('[opt=pensionform]').form('submit', {
                    url:'/saveold',
                    onSubmit: function () {
                        var isValid = $(this).form('validate');
                        cj.slideShow('表单验证结果:' + isValid);
                        return isValid;
                    },
                    success: function (data) {
                        cj.slideShow('操作成功');
                    }
                });


            });
        }*/

    }

    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var savebtn = local.find('[opt=save]');               //保存按钮
        savebtn.show()
        savebtn.click(function(){
            local.find('[opt=mainform]').form('submit', {
                url:"wwwwwwww",
                onSubmit: function(){
                },
                success:function(data){
                    console.log(data)
                }
            });
        })
    }

    /*处理时进入页面(actionType=info)*/
    var dealwithInfoFunc = function(local,option){
        var dealwithbtn = local.find('[opt=dealwith]');            //处理按钮
        dealwithbtn.show()                                            //显示处理按钮
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        for(var i=0;i<pensionform[0].length;i++){             //禁用表单
            var element = pensionform[0].elements[i];
            element.disabled = true
        }
        disabledForm(local);                                //禁用easyui框
        $.ajax({
            url:"searchid",                                //查询老人表
            data:{
                id:option.queryParams.data.lr_id
            },
            type:"post",
            dataType:"json",
            success:function(data){
                pensionform.form('load',data)        //填充主表
                //famillylist(option.queryParams.data.lr_id)     //填充子表
//                dealwithFunc({dealwith:dealwith,data:option.queryParams.data,refresh:option.queryParams.refresh}) //数据处理
//                showProcess(false);
            }
        })
    }


    var render=function(l,o){
        create(l,o);
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'update1':
                    (function(){alert('hahaha')})();
                    break;
                case 'info':
                    dealwithInfoFunc(l,o);
                    break;
                case 'update':
                    actionInfo(l, o);
                    break;
                default :
                    break;
            }
        }else{
            saveFunc(l, o);
        }
    }
    return {
        render:render
    }

})