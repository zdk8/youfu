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
    var filepath='manager/CodeMaintenance/combodt';

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
                    url:'savecombodt',
                    onSubmit:function(param){
                        var isValid = $(this).form('validate');
                        if(isValid){
                            layer.closeAll('loading');
                            if(option && option.act == "u"){   //修改
                                //param.flag = 0;
                                param.aaz093 = option.queryParams.aaz093;
                            }else{                              //新增
                                param.flag = -1;
                                param.aae100 = '1';
                                param.aaa104 = '1';
                                param.aaa100 = option.queryParams.aaa100;
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
                            //option.onCreateSuccess();
                        }

                    }
                })
            });
            /*require(['commonfuncs/CuRecord'],function(cu){
                cu.cfg({
                    local:local,
                    filepath:filepath,
                    costomPreFixUrl:'/',
                    url:'/savecombodt',
                    data:option.queryParams,
                    cparam: $.extend({flag:-1},option.queryParams),
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