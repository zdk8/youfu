/**
 * Created by Administrator on 2014/10/16.
 */
define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    var filepath='manager/CodeMaintenance/combo';

    return {
        render:function(local,option){
            addToolBar(local);
            if(option && option.act){
                if(option.act == 'u'){
                    local.find('[opt=comboform]').form('load',option.queryParams);
                }
            }
            local.find('[opt=save]').show().click(function () {
                layer.load();
                local.find('[opt=comboform]').form('submit',{
                    url:'savecombo',
                    onSubmit:function(param){
                        var isValid = $(this).form('validate');
                        if(isValid){
                            layer.closeAll('loading');
                            if(option && option.queryParams){   //修改
                                //param.flag = 0;
                            }else{                              //新增
                                param.flag = -1;
                            }
                        }
                        return isValid;
                    },
                    success:function(data){
                        var res = eval('('+data+')');
                        if(res.success){
                            layer.closeAll('loading');
                            option.parent.trigger('close');
                            option.localDataGrid.datagrid('reload');
                        }
                        /*if(config.onCreateSuccess){
                            config.onCreateSuccess(data);
                        }else{
                            cj.csumbitQest(data,'',function(){
                                if(config.parent){
                                    config.parent.trigger('close');
                                }else{
                                    var tab=$('#tabs');
                                    var pp = tab.tabs('getSelected');
                                    var index = tab.tabs('getTabIndex',pp);
                                    tab.tabs('close',index);
                                }
                            })
                        }*/

                    }
                })
            });
            /*require(['commonfuncs/CuRecord'],function(cu){
                cu.cfg({
                    local:local,
                    filepath:filepath,
                    costomPreFixUrl:'/',
                    url:'/savecombo',
                    data:option.queryParams,
                    cparam:{flag:-1},
                    uparam:option.queryParams,
                    onCreateSuccess:option.onCreateSuccess||function(data){
                        option.parent.trigger('close');
                    },
                    onUpdateSuccess:option.onUpdateSuccess,
                    act:option.act
                })
            })*/
        }
    }
})