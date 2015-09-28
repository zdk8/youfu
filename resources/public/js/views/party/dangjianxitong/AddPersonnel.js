define(function(){
    /*添加功能按钮*/
    var addToolBar=function(local,option,li) {
        var li_func = ' <li>' +
            '<input type="button" value="关闭" class="btns" opt="cancel">' +
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


    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {
        local.find('[opt=addpersonnel]').layout();
    }

    /*新增数据时进入*/
    var saveFunc = function(local,option){
        addToolBar(local,option,'');

        var not_p_datagrid = local.find('[opt=not_p]');//未添加的人员
        var has_p_datagrid = local.find('[opt=has_p]');//已添加的人员
        not_p_datagrid.datagrid({
            url:"record/getrecordlist",
            type:'post',
            onLoadSuccess:function(data){}
        });
        has_p_datagrid.datagrid({
            url:"record/getrecordlist",
            type:'post',
            onLoadSuccess:function(data){}
        });

        /*>*/
        var add_p2 = local.find('[opt=add_p2]');
        local.find('[opt=add_p]').click(function () {
            var $this = $(this);
            var checkedItems = not_p_datagrid.datagrid('getChecked');
            var names = [];
            if(checkedItems.length == 0){
                layer.alert('请选择要添加的人员', {icon: 6});
            }else{
                layer.load();
                $this.hide();
                add_p2.show();
                $.each(checkedItems, function(index, item){
                    names.push(item.pr_id);
                });
                console.log(names.join(","));
            }
        });
        /*>>*/
        local.find('[opt=add_p_all]').click(function () {
            console.log('>>')
        });
        /*<*/
        local.find('[opt=reduce_p]').click(function () {
            console.log('<')
        });
        /*<<*/
        local.find('[opt=reduce_p_all]').click(function () {
            console.log('<<')
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