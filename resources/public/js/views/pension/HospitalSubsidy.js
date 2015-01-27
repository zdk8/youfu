define(function(){
    var render = function(local,option){
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

        var hospitalform = local.find("[opt=hospitalform]");     //住院补助
        addToolBar(local);
        if(option.queryParams.actiontype == "zybzdealwith"){   //住院补助处理
            local.find('[opt=commit]').hide()
            hospitalform.form("load",option.queryParams.data)
            var rm_streetreviewval = local.find("[name=rm_streetreview]")   //审核意见
            var rm_countyaudit = local.find("[name=rm_countyaudit]")        //审批意见
            var aulevel = option.queryParams.aulevel;
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