define(function(){
    var render = function(local,option){
        var addToolBar=function(local) {
            var toolBarHeight=30;
            var toolBar=cj.getFormToolBar([
                {text: '提交',hidden:'hidden',opt:'commit'},
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

        var pplogoutform = local.find("[opt=pplogoutform]");     //注销表单
        pplogoutform.form("load",option.queryParams.data)
        /*for ( var i = 0; i < $("[opt=pplogoutform]")[0].length; i++) {
            $("[opt=pplogoutform]")[0].elements[i].disabled = true
        }*/
        addToolBar(local);
        local.find('[opt=commit]').show().click(function(){
            var rm_reasonval = local.find("[name=rm_reason]");
            var rm_communityopinionval = local.find("[name=rm_communityopinion]");
            if(rm_reasonval.val() == "" || rm_communityopinionval.val() == ""){
                alert("请填写注销理由！")
            }else{
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
                        console.log(data)
                        /*$("#tabs").tabs("close",option.queryParams.title)   //关闭节点
                        var refreshfun = option.queryParams.refresh;
                        refreshfun();                                   //刷新*/
                    }
                })
            }


            /*pplogoutform.form("submit",{
                url:"qqqqqq",
                onSubmit: function(){
                    var isvalidate = $(this).form('validate');
                    if (isvalidate) {
//                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    }
                    return isvalidate
                },
                success:function(data){
                    var data = eval('(' + data + ')');

                },
                onLoadError: function () {
//                    showProcess(false);
                    $.messager.alert('温馨提示', '由于网络或服务器太忙，提交失败，请重试！');
                }
            })*/
        });
    }

    return {
        render:render
    }
})