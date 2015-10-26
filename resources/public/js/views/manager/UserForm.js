define(function(){
    function initFunc(local,option){
        layer.closeAll('loading');
        cj.getdivision(local.find('[opt=division]'));
    }
    function saveFunc(local,option){
        var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>';
        cj.addToolBar(local,option,li);

        /*保存*/
        local.find('[opt=save]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'saveuser',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    if(!local.find('[name=userid]').val()){
                        params.flag=-1; //新增
                    }
                    params.regionid = local.find("[opt=division]").combotree("getValue");
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
        var districtnameval = cj.getDivisionTotalname(record.regionid);
        local.find('[opt=division]').combotree("setValue",districtnameval);  //填充行政区划

        /*修改*/
        local.find('[opt=update]').click(function () {
            local.find('form').form('submit', {
                url: 'saveuser',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    if(!local.find('[name=userid]').val()){
                        params.flag=-1;
                    }
                    if(!isNaN(local.find("[opt=division]").combotree("getValue"))){          //是否是数字
                        params.regionid = local.find("[opt=division]").combotree("getValue");
                    }else{
                        params.regionid = record.regionid;
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