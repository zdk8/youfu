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
            local.find('form').form('submit', {
                url: 'saverole',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    if(!local.find('[name=roleid]').val()){
                        params.flag=-1; //新增
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    $this.attr("disabled",false);//按钮启用
                    var obj = eval('('+data+')');
                    if(obj.success) {
                        cj.showSuccess('保存成功');
                        option.queryParams.refresh();
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
                url: 'saverole',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    if(!local.find('[name=roleid]').val()){
                        params.flag=-1;
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    var obj = eval('('+data+')');
                    if(obj.success) {
                        cj.showSuccess('修改成功');
                        option.queryParams.refresh();
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
})