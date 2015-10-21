define(function(){
    var arr_combobox = ['hy_formernation','hy_nation','hy_formerpolitical','hy_politicalstatus'];
    var arr_datebox = ['hy_formerregister','hy_divorcedate','hy_register'];
    var arr_validatebox = [];

    /*添加功能按钮*/
    var addToolBar=function(local,option,li) {
        var li_func = ' <li>' +
            '<input type="button" value="取消" class="btns" opt="cancel">' +
            '</li>' +'&nbsp;'+li;

        var functool = local.find('.layui-layer-setwin');
        functool.after('<div class="funcmenu"><ul></ul></div>');
        var _toolbar = local.find('.funcmenu');
        _toolbar.css('display','block');
        _toolbar.find('ul').html(li_func);
        /*取消*/
        local.find('[opt=cancel]').click(function () {
            layer.close(option.index);
        });
    };
    /*easyui控件初始化*/
    var initControls = function (local) {
        for(var i=0;i<arr_combobox.length;i++){
            local.find('[opt='+arr_combobox[i]+']').combobox();
        }
        for(var i=0;i<arr_datebox.length;i++){
            local.find('[opt='+arr_datebox[i]+']').datebox();
        }
        for(var i=0;i<arr_validatebox.length;i++){
            local.find('[name='+arr_validatebox[i]+']').validatebox();
        }

    }

    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {
        initControls(local);//控件初始化
        var record = option.queryParams.record;
        local.find('[name=name]').val(record.name);
        local.find('[name=workunit]').val(record.workunit);
        local.find('[name=incumbent]').val(record.incumbent);
    }
    
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>';
        addToolBar(local,option,li);
        /*保存*/
        local.find('[opt=save]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'party/addcadremarriage',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.pr_id = option.queryParams.record.pr_id;
                    if (!isValid) {
                        layer.closeAll('loading');
                        $this.attr("disabled",false);//按钮启用
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
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
    /*数据修改*/
    var updateFunc = function(local,option){
        var li = '<li><input type="button" value="修改" class="btns" opt="update"></li>';
        addToolBar(local,option,li);
        var record = option.queryParams.data; //主表信息
        local.find('form').form('load',record);//主表数据填充

        local.find('[opt=update]').click(function () {
            local.find('form').form('submit', {
                url: 'party/updatemarriage',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.hy_id = record.hy_id;
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    if (data == "true") {
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
        layer.closeAll('loading');
        initFunc(l,o);//初始化
        if(o && o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'add':
                    saveFunc(l, o);
                    break;
                case 'update':
                    updateFunc(l, o);
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