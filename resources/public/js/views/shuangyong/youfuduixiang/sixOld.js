/**
 * Created by zmp on 2016/5/6.
 */
define(function(){


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

    /*界面初始化，公共方法*/
    var initFunc = function (local,option) {

        cj.getdivision(local.find('[opt=districtid]'));

        /*图片上传*/
        local.find('[opt=personimg]').click(function(){
            local.find('[opt=inputVal]').click();
        })
        /*附件选择动态事件*/
        local.find('[opt=inputVal]').bind('change',function(){
            cj.imgView(this,local);
        });
    }

    var isAgree= function (num) {
        local.find('form').form('submit', {
            url: 'hyshy/saveolderthansixty',
            onSubmit: function (params) {
                layer.load();

                params.issuccess =num;
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
    }
    
    /*新增数据时进入*/
    var oldFunc = function(local,option){
        console.log('进来了。。')
        local.find('div[opt=panel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - 50);
            }
        });
        var btns = '<div id="ft_ssry1" style="padding:5px;" align="center">' +
            '<input type="button" value="符合" class="btns" opt="agree">&nbsp;' +
            '<input type="button" value="不符合" class="btns" opt="notagree">&nbsp;' +
            '</div>';
        local.find('[opt=foot]').html(btns);
        local.find('div[opt=panel]').panel({
            footer:'#ft_ssry1'
        })

        local.find('[opt=cancel]').click(function(){
            layer.close(option.index);
        });
        cj.shieldingSH(local);
        cj.shieldingSP(local);
        /*保存*/
        
        
        
        local.find('[opt=agree]').click(function () {
           isAgree(0)
        });
        local.find('[opt=notagree]').click(function () {
            isAgree(1)
        });

    }


    var render=function(l,o){
        layer.closeAll('loading');
        initFunc(l,o);//初始化
        if(o && o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'old':
                    oldFunc(l, o);
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