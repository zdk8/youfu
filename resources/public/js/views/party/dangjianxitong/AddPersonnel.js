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

    var render=function(local,option){
        layer.closeAll('loading');
        local.find('[opt=addpersonnel]').layout();//初始化
        addToolBar(local,option,'');

        var not_p_datagrid = local.find('[opt=not_p]');//未添加的人员
        var has_p_datagrid = local.find('[opt=has_p]');//已添加的人员

        not_p_datagrid.datagrid({
            url:"record/getrecordlist",
            type:'post',
            queryParams:{
                group:'0',
                idtype:option.params.idtype,
                id:option.params.id
            },
            onLoadSuccess:function(data){}
        });
        has_p_datagrid.datagrid({
            url:"record/getrecordlist",
            type:'post',
            queryParams:{
                group:'1',
                idtype:option.params.idtype,
                id:option.params.id
            },
            onLoadSuccess:function(data){}
        });

        /*>*/
        var add_p2 = local.find('[opt=add_p2]');
        local.find('[opt=add_p]').click(function () {
            var $this = $(this);
            var checkedItems = not_p_datagrid.datagrid('getChecked');
            var names = [];
            if(checkedItems.length == 0){
                layer.alert('请选择要添加的人员', {icon: 6,title:'温馨提示'});
            }else{
                layer.load();
                $this.hide();
                add_p2.show();
                $.each(checkedItems, function(index, item){
                    names.push(item.pr_id);
                });
                $.ajax({
                    url:option.params.add_p_url,
                    type:'post',
                    data:{
                        id:option.params.id,
                        pr_ids:names.join(",")
                    },
                    success: function (data) {
                        layer.closeAll('loading');
                        $this.show();
                        add_p2.hide();
                        if(data == "true"){
                            layer.alert('人员添加成功', {icon: 6,title:'温馨提示',shift:2});
                            not_p_datagrid.datagrid('reload');
                            has_p_datagrid.datagrid('reload');
                        }
                    }
                });
            }
        });
        /*>>*/
        var add_p_all2 = local.find('[opt=add_p_all2]');
        local.find('[opt=add_p_all]').click(function () {
            var $this = $(this);
            layer.confirm('是否需要添加所有人员？', {icon: 3,shift: 6,title:'温馨提示'}, function(index){
                layer.close(index);
                layer.load();
                $this.hide();
                add_p_all2.show();
                $.ajax({
                    url:option.params.add_p_url,
                    type:'post',
                    data:{
                        id:option.params.id,
                        pr_ids:'all'
                    },
                    success: function (data) {
                        layer.closeAll('loading');
                        $this.show();
                        add_p_all2.hide();
                        if(data == "true"){
                            layer.alert('人员添加成功', {icon: 6,title:'温馨提示',shift:2});
                            not_p_datagrid.datagrid('reload');
                            has_p_datagrid.datagrid('reload');
                        }
                    }
                });
            });
        });
        /*<*/
        var reduce_p2 = local.find('[opt=reduce_p2]');
        local.find('[opt=reduce_p]').click(function () {
            var $this = $(this);
            var checkedItems = has_p_datagrid.datagrid('getChecked');
            var names = [];
            if(checkedItems.length == 0){
                layer.alert('请选择要移除的人员', {icon: 6});
            }else{
                layer.load();
                $this.hide();
                reduce_p2.show();
                $.each(checkedItems, function(index, item){
                    names.push(item.pr_id);
                });
                $.ajax({
                    url:option.params.reduce_p_url,
                    type:'post',
                    data:{
                        id:option.params.id,
                        pr_ids:names.join(",")
                    },
                    success: function (data) {
                        layer.closeAll('loading');
                        $this.show();
                        reduce_p2.hide();
                        if(data == "true"){
                            layer.alert('人员移除成功', {icon: 6,title:'温馨提示',shift:2});
                            not_p_datagrid.datagrid('reload');
                            has_p_datagrid.datagrid('reload');
                        }
                    }
                });
            }
        });
        /*<<*/
        var reduce_p_all2 = local.find('[opt=reduce_p_all2]');
        local.find('[opt=reduce_p_all]').click(function () {
            var $this = $(this);
            layer.confirm('是否移除所有人员？', {icon: 3,shift: 6,title:'温馨提示'}, function(index){
                layer.close(index);
                layer.load();
                $this.hide();
                reduce_p_all2.show();
                $.ajax({
                    url:option.params.reduce_p_url,
                    type:'post',
                    data:{
                        id:option.params.id,
                        pr_ids:'all'
                    },
                    success: function (data) {
                        layer.closeAll('loading');
                        $this.show();
                        reduce_p_all2.hide();
                        if(data == "true"){
                            layer.alert('人员移除成功', {icon: 6,title:'温馨提示',shift:2});
                            not_p_datagrid.datagrid('reload');
                            has_p_datagrid.datagrid('reload');
                        }
                    }
                });
            });
        });
    }
    return {
        render:render
    }

})