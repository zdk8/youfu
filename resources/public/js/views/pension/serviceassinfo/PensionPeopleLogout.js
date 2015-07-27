define(function(){
    var render = function(local,option){
        var addToolBar=function(local) {
            var toolBarHeight=30;
            var toolBar=cj.getFormToolBar([
                {text: '提交',hidden:'hidden',opt:'commit',class:'btns'},
                {text: '处理',hidden:'hidden',opt:'dealwith',class:'btns'}
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
            }).prev().hide();     //原来的圆点样式设置为不可见
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
        var pplogoutform = local.find("[opt=pplogoutform]");     //注销表单
        addToolBar(local);
        if(option.queryParams.actiontype == "logout"){         //注销
            local.find('[opt=pplogout_table] input').attr("readonly","true");//表单禁用
            local.find('textarea[name=rm_streetreview]').attr("readonly","true")
            local.find('textarea[name=rm_countyaudit]').attr("readonly","true")
            addRadioCss(local);
            local.find('[opt=dealwith]').hide();
            pplogoutform.form("load",option.queryParams.data);//表单填充
            local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']').attr("checked","checked");
            local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']+label').addClass("checked");
            local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']').attr("checked","checked");
            local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']+label').addClass("checked");
            local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']').attr("checked","checked");
            local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']+label').addClass("checked");
            /*提交*/
            local.find('[opt=commit]').show().click(function(){
                var rm_reasonval = local.find("[name=rm_reason]");
                var rm_communityopinionval = local.find("[name=rm_communityopinion]");
                if(rm_reasonval.val() == "" || rm_communityopinionval.val() == ""){
                    rm_reasonval.val() == "" ? $.messager.alert('温馨提示','请填写注销理由！',"",function(r){
                        rm_reasonval.focus()
                    }) :rm_communityopinionval.val() == "" ? $.messager.alert('温馨提示','请填写村意见！',"",function(r){
                        rm_communityopinionval.focus()
                    }) : null
                }else{
                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    $.ajax({
                        url:"audit/removesubmit",                       //注销
                        type:"post",
                        dataType:"json",
                        data:{
                            jja_id:option.queryParams.data.jja_id,
                            rm_reason:rm_reasonval.val(),
                            rm_communityopinion:rm_communityopinionval.val()
                        },
                        success:function(data){
                            if(data.success){
                                showProcess(false);
                                $.messager.show({
                                    title:'温馨提示',
                                    msg:'提交成功!',
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
            });
        }else if(option.queryParams.actiontype == "logoutdealwith"){   //注销处理
            local.find('[opt=commit]').hide();
            local.find('[opt=pplogout_table] input').attr("readonly","true");//表单禁用
            local.find('textarea[name=rm_reason]').attr("readonly","true")
            local.find('textarea[name=rm_communityopinion]').attr("readonly","true")
            addRadioCss(local);
            pplogoutform.form("load",option.queryParams.data);
            local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']').attr("checked","checked");
            local.find('input[name=life_ability][type=radio][value='+option.queryParams.data.life_ability+']+label').addClass("checked");
            local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']').attr("checked","checked");
            local.find('input[name=live_type][type=radio][value='+option.queryParams.data.live_type+']+label').addClass("checked");
            local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']').attr("checked","checked");
            local.find('input[name=old_type][type=radio][value='+option.queryParams.data.old_type+']+label').addClass("checked");
            var rm_streetreviewval = local.find("[name=rm_streetreview]")   //审核意见
            var rm_countyaudit = local.find("[name=rm_countyaudit]")        //审批意见
            var aulevel = option.queryParams.aulevel;
            if(aulevel == "7"){
                local.find('textarea[name=rm_countyaudit]').attr("readonly","readonly");
                RadioCssEnabel(local,"shenghe");
            }else if(aulevel == "8"){
                local.find('textarea[name=rm_streetreview]').attr("readonly","readonly");
                RadioCssEnabel(local,"shengpi");
            }
            local.find('[opt=dealwith]').show().click(function(){
                if(aulevel == "7"){             //注销审核
                    if(rm_streetreviewval.val() == "" || rm_streetreviewval.val() == null){
                        $.messager.alert('温馨提示','请填写所在镇、街街道审核意见！',"",function(r){
                            rm_streetreviewval.focus();
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
                            auditFunc(local,option,"rm_streetreview",shengheval);
                        }
                    }
                }else if(aulevel == "8"){       //注销审批
                    if(rm_countyaudit.val() == "" || rm_countyaudit.val() == null){
                        $.messager.alert('温馨提示','请填写民政局审批意见！',"",function(r){
                            rm_countyaudit.focus();
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
                            auditFunc(local,option,"rm_countyaudit",shengpival);
                        }
                    }
                }
            })
        }

    }
    /*注销审核*/
    function auditFunc(local,option,optionarea,issuccess){
        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
        $.ajax({
            url:"audit/removeaudit",
            data:{
                audesc:local.find('[name='+optionarea+']').val(),     //意见
                aulevel:option.queryParams.aulevel,            //流程标示
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

    return {
        render:render
    }
})