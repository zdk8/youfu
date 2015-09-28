define(function(){
    var arr_combobox = [];
    var arr_datebox = ['receivedate','returndate'];
    var arr_validatebox = ['returndate'];

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
    }
    
    /*证件归还*/
    var backFunc = function(local,option){
        var li = '<li><input type="button" value="归还" class="btns" opt="save"></li>';
        addToolBar(local,option,li);
        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        local.find('[opt=returndate]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));
        /*保存*/
        local.find('[opt=save]').click(function () {
            local.find('form').form('submit', {
                url: 'party/returncerreceive1',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.cr_id = record.cr_id;
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    if (data == "true") {
                        cj.showSuccess('证件成功归还');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('证件归还失败');
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
                case 'back':        //证件归还
                    backFunc(l, o);
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