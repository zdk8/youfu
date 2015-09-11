define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '修改',hidden:'hidden',opt:'update'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    var initPage = function(local,option){
        addToolBar(local)
    }
    /*保存*/
    function saveFunc(local,option){
        local.find('[opt=update]').hide()
        var serviceagenciesform = local.find("[opt=serviceagenciesform]");
        local.find('[opt=save]').show().click(function(){
            serviceagenciesform.form('submit', {
                url:"audit/addjjyldepart",
                onSubmit: function(){
                    var isValid = $(this).form('validate');
                    if(isValid){
                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    }
                    return isValid;
                },
                success:function(data){
//                    var data = eval('(' + data + ')');
                    if(data == "true"){
                        showProcess(false);
                        cj.slideShow('保存成功');
                        if(showProcess(false)){
                            $("#tabs").tabs("close",option.title)
                            var ref = option.queryParams.refresh;
                            ref();
                        }
                    }
                }
            })
        })
    }
    /*修改*/
    function updateInfoFunc(local,option){
        local.find('[opt=save]').hide()
        var serviceagenciesform = local.find("[opt=serviceagenciesform]");
        serviceagenciesform.form("load",option.queryParams.data)
        local.find('[opt=update]').show().click(function(){
            serviceagenciesform.form('submit', {
                url:"audit/updatejjyldepart",
                onSubmit: function(params){
                    params.jdep_id = option.queryParams.data.jdep_id;
                    var isValid = $(this).form('validate');
                    if(isValid){
                        layer.load();
                    }else{
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success:function(data){
                    if(data == "true"){
                        layer.closeAll('loading');
                        cj.showSuccess('修改完成');
                        /*$("#tabs").tabs("close",option.title)*/
                        var ref = option.queryParams.refresh;
                        ref();
                    }else{
                        layer.closeAll('loading');
                    }
                }
            })
        })
    }

    var render=function(l,o){
        layer.closeAll('loading');
        initPage(l,o);                //初始化页面
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'view':                   //查看详细信息，并且可进行处理
                    viewInfoFunc(l,o);
                    break;
                case 'dealwith':                   //处理
                    dealwithInfoFunc(l,o);
                    break;
                case 'update':                     //修改
                    updateInfoFunc(l, o);
                    break;
                case 'add':              //保存
                    saveFunc(l, o);
                    break;
                default :
                    break;
            }
        }
    }



    return {
        render:render
    }
})