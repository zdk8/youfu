define(function () {
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '关闭',hidden:'hidden',opt:'close'},
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*新增*/
    var addHomeVisit = function (local, option) {
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=homevisitform]').form('submit', {
                url:'depart/addhomevisit',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        layer.closeAll('loading');
                        layer.alert('保存成功!', {icon: 6,title:'温馨提示'});
                        //option.queryParams.refresh();
                    }else{
                        layer.closeAll('loading');
                        layer.alert('保存失败!', {icon: 5,title:'温馨提示'});
                    }
                }
            });
        });
    }
    return {
        render: function (local, option) {
            addToolBar(local);
            local.find('[opt=save]').hide();
            local.find('[opt=update]').hide();
            local.find('[opt=close]').hide();
            /*图片上传*/
            local.find('[opt=personimg]').click(function(){
                require(['commonfuncs/popwin/win','text!views/pension/carecenterinfo/FileForm.htm','views/pension/carecenterinfo/FileForm'],
                    function(win,htmfile,jsfile){
                        win.render({
                            title:"上传图片",
                            width:400,
                            height:200,
                            html:htmfile,
                            buttons:[
                                {text:'取消',handler:function(html,parent){
                                    parent.trigger('close');
                                }},
                                {
                                    text:'保存',
                                    handler:function(html,parent){
                                    }
                                }
                            ],
                            renderHtml:function(localc,submitbtn,parent){
                                jsfile.render(localc,{
                                    submitbtn:submitbtn,
                                    parent:parent,
                                    plocal:local,
                                    //filetype:filetype,
                                    //refresh:refreshDatagrid,
                                    onCreateSuccess:function(data){
                                        parent.trigger('close');
                                    }
                                })
                            }
                        })
                    }
                )
            })

            if(option && option.queryParams){
                switch (option.queryParams.actiontype){
                    case 'add':
                        addHomeVisit(local,option);
                        break;
                    case 'view':
                        viewCareWorker(local,option);
                        break;
                    case 'update':
                        updateCareWorker(local,option);
                        break;
                    default :
                        break;
                }
            }else{
                addHomeVisit(local,option);
            }
        }
    }
})