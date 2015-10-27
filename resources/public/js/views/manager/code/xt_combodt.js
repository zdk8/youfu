/**
 * Created by Administrator on 2014/10/16.
 */
define(function(){
    function initFunc(local,option){
        layer.closeAll('loading');
    }

    function saveFunc(local,option){
        var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>';
        cj.addToolBar(local,option,li);

        /*保存*/
        local.find('[opt=save]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('[opt=comboform]').form('submit',{
                url:'savecombodt',
                onSubmit:function(param){
                    var isValid = $(this).form('validate');
                    if(isValid){
                        layer.load();
                        param.flag = -1;
                        param.aae100 = '1';
                        param.aaa104 = '1';
                        param.aaa100 = option.queryParams.record.aaa100;
                    }else{
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    return isValid;
                },
                success:function(data){
                    layer.closeAll('loading');
                    $this.attr("disabled",false);//按钮启用
                    var obj = eval('('+data+')');
                    if(obj.success) {
                        cj.showSuccess('保存成功');
                        option.queryParams.dgrid.datagrid('reload');
                        layer.close(option.index);
                    } else {
                        cj.showFail('保存失败');
                    }
                }
            })
        });
    }

    function updateFunc(local,option){
        var li = '<li><input type="button" value="修改" class="btns" opt="update"></li>';
        cj.addToolBar(local,option,li);
        var record = option.queryParams.record;
        local.find('form').form('load',record);//数据填充

        /*修改*/
        local.find('[opt=update]').click(function () {
            local.find('form').form('submit', {
                url: 'savecombodt',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.aaz093 = option.queryParams.record.aaz093;
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    var obj = eval('('+data+')');
                    if(obj.success) {
                        cj.showSuccess('修改成功');
                        option.queryParams.dgrid.datagrid('reload');
                        layer.close(option.index);
                    } else {
                        cj.showFail('修改失败');
                    }
                }
            })
        });
    }

    var render=function(l,o){
        initFunc(l,o);//初始化
        if(o && o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'update':
                    updateFunc(l, o);
                    break;
                case 'add':
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
    /*return {
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
                                param.aaz093 = option.queryParams.record.aaz093;
                            }else{                              //新增
                                param.flag = -1;
                                param.aae100 = '1';
                                param.aaa104 = '1';
                                param.aaa100 = option.queryParams.record.aaa100;
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

                    }
                })
            });
        }
    }*/
})