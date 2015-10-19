define(function(){
    var arr_combobox = [];
    var arr_datebox = ['sj_date'];
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
        cj.common_listFunc(local);//表单动态增减行
    }
    
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>';
        addToolBar(local,option,li);
        var record = option.queryParams.record;
        var field1 = ['sj_money','sj_gift','sj_number','sj_value','sj_date','sj_department','sj_comments'];//干部拒收或上交礼金、礼品情况
        /*保存*/
        local.find('[opt=save]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            var fields1 = cj.commonGetValue(local,{field:field1});
            local.find('form').form('submit', {
                url: 'party/addhandgift',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.fields1 = JSON.stringify(fields1);
                    params.pr_id = option.queryParams.record.pr_id;
                    if (!isValid) {
                        layer.closeAll('loading');
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
    
    var render=function(l,o){
        layer.closeAll('loading');
        initFunc(l,o);//初始化
        if(o && o.queryParams) {
            switch (o.queryParams.actiontype){
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