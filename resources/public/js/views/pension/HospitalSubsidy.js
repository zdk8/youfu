define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '提交',hidden:'hidden',opt:'commit'},
            {text: '处理',hidden:'hidden',opt:'dealwith'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*为radio添加样式*/
    var addRadioCss = function(local) {
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).click(function () {               //为第个元素注册点击事件
                var s = $($(this).prev()[0]).attr('name')
                if(s == "shenghe" || s == "shengpi"){
                    console.log(s)
                }else{
                    s = ":input[name=" + s + "]+label"
                    var isChecked=$(this).prev()[0].checked;
                    local.find(s).each(function (i) {
                        $(this).prev()[0].checked = false;
                        $(this).removeClass("checked");
                        $($(this).prev()[0]).removeAttr("checked");
                    });
                    if(isChecked){
                        //如果单选已经为选中状态,则什么都不做
                    }else{
                        $(this).prev()[0].checked = true;
                        $(this).addClass("checked");
                        $($(this).prev()[0]).attr("checked","checked");
                    }
                }
            })
            .prev().hide();     //原来的圆点样式设置为不可见
    }
    /*启用Radio*/
    var RadioCssEnabel = function(local,radioname){
        var selectRadio = ":input[name="+radioname+"][type=radio] + label";
        local.find(selectRadio).each(function () {
        }).click(function () {               //为第个元素注册点击事件
                var s = $($(this).prev()[0]).attr('name')
                s = ":input[name=" + s + "]+label"
                var isChecked=$(this).prev()[0].checked;
                local.find(s).each(function (i) {
                    $(this).prev()[0].checked = false;
                    $(this).removeClass("checked");
                    $($(this).prev()[0]).removeAttr("checked");
                });
                if(isChecked){
                    //如果单选已经为选中状态,则什么都不做
                }else{
                    $(this).prev()[0].checked = true;
                    $(this).addClass("checked");
                    $($(this).prev()[0]).attr("checked","checked");
                }
            })
            .prev().hide();
    }
    /*通过身份证获取人员*/
    var getPeopleByIdentityid = function(local){
        local.find("input[opt=identityid]").combogrid({
            panelWidth:350,
            panelHeight:350,
            url:'audit/gethositaldata',
            method:'post',
            idField:'identityid',
            textField:'identityid',
            fitColumns:true,
            pagination:true,
            mode:'remote',
            columns:[[
                {field:'name',title:'姓名',width:40},
                {field:'identityid',title:'身份证号',width:95},
                {field:'address',title:'住址',width:60}
            ]],
            onBeforeLoad:function(params){
                params.identityid = local.find('[opt=identityid]').combobox('getValue')
            },
            onClickRow:function(index,row){
                local.find('[opt=hospitalform]').form('load',row);//填充表单
            }
        })
    }
    /*提交页面*/
    function commitFun(local,option){
        getPeopleByIdentityid(local);
        addRadioCss(local);
        local.find('textarea[name=hstreetreview]').attr("readonly","readonly");
        local.find('textarea[name=hcountyaudit]').attr("readonly","readonly");
        local.find('[opt=dealwith]').hide();
        local.find('[opt=commit]').show().click(function(){
            var hospital_descval = local.find("[name=hospital_desc]");
            var hcommunityopinionval = local.find("[name=hcommunityopinion]");
            if(hospital_descval.val() == "" || hcommunityopinionval.val() == ""){
                hospital_descval.val() == "" ? $.messager.alert('温馨提示','请填写住院情况！',"",function(r){
                    hospital_descval.focus()
                }) :hcommunityopinionval.val() == "" ? $.messager.alert('温馨提示','请填写社区意见！',"",function(r){
                    hcommunityopinionval.focus()
                }) : null
            }else{
                local.find('[opt=hospitalform]').form('submit',{
                    url:"audit/applyhospitalsubsidy",
                    onSubmit: function(params){
                        var isvalidate = $(this).form('validate');
                        if (isvalidate) {
                            showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                            //layer.load('正在提交数据...',0)
                        }
                        return isvalidate
                    },
                    success:function(data){
                        if(data == "true"){
                            showProcess(false);
                            //layer.load('正在提交数据...',1)
                            cj.slideShow("提交成功!")
                            if(showProcess(false)){
                                $("#tabs").tabs('close',"住院补助申请")
                            }
                        }else{
                            showProcess(false);
                            //layer.load('正在提交数据...',1)
                            cj.slideShow('<label style="color: red">提交失败！</label>')
                        }
                    },
                    onLoadError: function () {
                        showProcess(false);
                        cj.slideShow('<label style="color: red">由于网络或服务器太忙，提交失败，请重试！</label>')
                    }
                })
            }
        });

    }
    /*注销审核*/
    function auditFunc(local,option,optionarea,issuccess){
//        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
        $.ajax({
            url:"audit/audithsapply",
            data:{
                audesc:local.find('[name='+optionarea+']').val(),     //意见
                aulevel:option.queryParams.record.aulevel,            //流程标示
                appoperators:option.queryParams.record.appoperators,
                bstablename:option.queryParams.record.bstablename,
                bstablepk:option.queryParams.record.bstablepk,
                bstablepkname:option.queryParams.record.bstablepkname,
                messagebrief:option.queryParams.record.messagebrief,
                sh_id:option.queryParams.record.sh_id,
                dvcode:option.queryParams.record.dvcode,
                issuccess:issuccess == "" ? "":issuccess
            },
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.success){
                    showProcess(false);
                    $.messager.show({
                        title:'温馨提示',
                        msg:'处理成功!',
                        timeout:2000,
                        showType:'slide'
                    });
                    if(showProcess(false)){
                        $("#tabs").tabs('close',option.queryParams.title)
                        var refresh = option.queryParams.refresh;
                        refresh();
                    }
                }
            }
        })
    }
    /*详细信息*/
    function showinfo(local,option){
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).prev().hide();
        local.find('[opt=hospital_table] input').attr("readonly","readonly");//表单不可编辑
        local.find('[opt=hospital_table] textarea').attr("readonly","readonly");//表单不可编辑
        var hospitalform = local.find("[opt=hospitalform]");     //住院补助
        hospitalform.form("load",option.queryParams.data)        //填充表单
        local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']').attr("checked","checked");
        local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']+label').addClass("checked");
        local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']').attr("checked","checked");
        local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']+label').addClass("checked");
        local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']').attr("checked","checked");
        local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']+label').addClass("checked");
        local.find('[opt=commit]').hide();
        local.find('[opt=dealwith]').hide();
    }

    /*住院补助处理*/
    function zybzdealwith(local,option){
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).prev().hide();
        local.find('[opt=hospital_table] input').attr("readonly","readonly");//表单不可编辑
        local.find('[name=hcommunityopinion]').attr("readonly","readonly");
        local.find('[name=hospital_desc]').attr("readonly","readonly");
        var hospitalform = local.find("[opt=hospitalform]");     //住院补助
        hospitalform.form("load",option.queryParams.data)        //填充表单
        local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']').attr("checked","checked");
        local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']+label').addClass("checked");
        local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']').attr("checked","checked");
        local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']+label').addClass("checked");
        local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']').attr("checked","checked");
        local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']+label').addClass("checked");
        local.find('[opt=commit]').hide()
        var hstreetreviewval = local.find("[name=hstreetreview]")   //审核意见
        var hcountyauditval = local.find("[name=hcountyaudit]")        //审批意见
        var aulevel = option.queryParams.record.aulevel;
        if(aulevel == "1"){
            RadioCssEnabel(local,"shenghe");
            hcountyauditval.attr("readonly","readonly");
        }else if(aulevel == "2"){
            RadioCssEnabel(local,"shengpi");
            hstreetreviewval.attr("readonly","readonly");
        }

        local.find('[opt=dealwith]').show().click(function(){
            //layer.load(1);
            if(aulevel == "1"){             //注销审核
                if(hstreetreviewval.val() == "" || hstreetreviewval.val() == null){
                    $.messager.alert('温馨提示','请填写所在镇、街街道审核意见！',"",function(r){
                        hstreetreviewval.focus();
                    });
                }else{
                    var shengheval = "";
                    local.find('[name=shenghe]').each(function(){
                        if($(this)[0].checked){
                            shengheval = $(this)[0].value
                        }
                    })
                    if(shengheval == ""){
                        $.messager.alert('温馨提示','请勾选审核结果！');
                    }else{
                        auditFunc(local,option,"hstreetreview",shengheval);
                    }
                }
            }else if(aulevel == "2"){       //注销审批
                if(hcountyauditval.val() == "" || hcountyauditval.val() == null){
                    $.messager.alert('温馨提示','请填写民政局审批意见！',"",function(r){
                        hcountyauditval.focus();
                    });
                }else{
                    var shengpival = "";
                    local.find('[name=shengpi]').each(function(){
                        if($(this)[0].checked){
                            shengpival = $(this)[0].value
                        }
                    })
                    if(shengpival == ""){
                        $.messager.alert('温馨提示','请勾选审批结果！');
                    }else{
                        auditFunc(local,option,"hcountyaudit",shengpival);
                    }
                }
            }
        })
    }

    var create = function(local,option){
        addToolBar(local);
    }
    var render=function(l,o){
        create(l, o);
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'info':
                    showinfo(l,o);                  //查看详细信息，并可进行修改
                    break;
                case 'update':
                    actionInfo(l, o);
                    break;
                case 'zybzdealwith':                   //处理
                    zybzdealwith(l,o);
                    break;
                default :
                    break;
            }
        }else{
            commitFun(l, o);
        }
    }

    return {
        render:render
    }
})