define(function(){
    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {
        local.find('div[opt=panel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - 35);
            }
        });
        local.find('[opt=cancel]').click(function(){
            layer.close(option.poption.index);
        });
        cj.getdivision(local.find('[opt=division]'));

        /*图片上传*/
        local.find('[opt=personimg]').click(function(){
            local.find('[opt=inputVal]').click();
        })
        /*附件选择动态事件*/
        local.find('[opt=inputVal]').bind('change',function(){
            cj.imgView(this,local);
        });
    }
    
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        /*保存*/
        local.find('[opt=save]').show().click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            local.find('form').form('submit', {
                url: 'record/addpensonrecords',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
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
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('保存失败');
                    }
                }
            })
        });
    }
    
    /*修改数据*/
    var updateFunc = function (local,option) {
        var record = option.queryParams.record; //主表信息
        local.find('form').form('load',record);//主表数据填充
        var imgurl;
        record.photo == null ? imgurl = 'images/noperson.gif' : imgurl = record.photo;
        var imghtm = '<img style="width:150px;height:120px;" src="'+imgurl+'" />';//图片填充
        local.find('[opt=personimg]').html(imghtm);

        local.find('[opt=update]').click(function () {
            local.find('form').form('submit', {
                url: 'record/updaterecord21',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    params.pr_id = record.pr_id;
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    if (data == "true") {
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
        layer.closeAll('loading');
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