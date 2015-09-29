define(function(){
    var arr_combobox = ['c_id'];
    var arr_datebox = ['receivedate'];
    var arr_validatebox = ['c_id'];

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
    
    /*新增数据时进入*/
    var saveFunc = function(local,option){
        var li = '<li><input type="button" value="领用" class="btns" opt="save"></li>';
        addToolBar(local,option,li);
        local.find('[opt=receivedate]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));

        /*证件加载*/
        local.find("input[opt=c_id]").combogrid({
            panelWidth:330,
            panelHeight:350,
            url:'party/getcertificatelist',
            queryParams:{
                isreceive:'0'
            },
            method:'post',
            idField:'c_id',
            textField:'name',
            fitColumns:true,
            pagination:true,
            mode:'remote',
            columns:[[
                {field:'name',title:'姓名',width:35,align:'center'},
                {field:'credentialstype',title:'证件类型',width:60,align:'center'},
                {field:'credentialsnumb',title:'证件号码',width:90,align:'center'}
            ]],
            onBeforeLoad:function(params){
                params.name = local.find('[opt=c_id]').combobox('getValue');
            },
            onClickRow:function(index,row){
                local.find('[name=credentialstype]').val(row.credentialstype);
                local.find('[name=credentialsnumb]').val(row.credentialsnumb);
            }
        });
        /*保存*/
        local.find('[opt=save]').click(function () {
            local.find('form').form('submit', {
                url: 'party/addcerreceive',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid) {
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    layer.closeAll('loading');
                    if (data == "true") {
                        cj.showSuccess('证件领用成功');
                        option.queryParams.refresh();
                        layer.close(option.index);
                    } else {
                        cj.showFail('证件领用失败');
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