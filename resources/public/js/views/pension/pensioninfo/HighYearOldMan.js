define(function () {
    var keyarray = ['son','daughter','grandson','other']
    /*为radio添加样式*/
    var addRadioCss = function(local) {
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).click(function () {               //为第个元素注册点击事件
            var s = $($(this).prev()[0]).attr('name')
            s = ":input[name=" + s + "]+label"
            var isChecked=$(this).prev()[0].checked;
            local.find(s).each(function (i) {
                $(this).prev()[0].checked = false;
                $(this).removeClass("checked");
                $($(this).prev()[0]).removeAttr("checked");
            });
            if(isChecked){
                //如果单选已经为选中状态,则什么都不做
            }else{
                $(this).prev()[0].checked = true;
                $(this).addClass("checked");
                $($(this).prev()[0]).attr("checked","checked");
            }
        }).prev().hide();     //原来的圆点样式设置为不可见
    }
    var addCheckboxCss = function(local) {
        var selectRadio = ":input[type=checkbox] + label";
        local.find(selectRadio).each(function () {
            var f1 = $($(this).prev()[0]).attr('name')+'_num';
            local.find('[name='+f1+']').attr('disabled',true)
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
                local.find('[name='+f1+']').attr('disabled',false)
            }
        }).click(function () {               //为第个元素注册点击事件
            var s = $($(this).prev()[0]).attr('name')
            var f = s+"_num";
            s = ":input[name=" + s + "]+label"
            var isChecked=$(this).prev()[0].checked;
            local.find(s).each(function (i) {
                $(this).prev()[0].checked = false;
                $(this).removeClass("checked");
                $($(this).prev()[0]).removeAttr("checked");
            });
            if(isChecked){
                //如果单选已经为选中状态,则什么都不做
                local.find('[name='+f+']').attr('disabled',true)
            }else{
                local.find('[name='+f+']').attr('disabled',false)
                $(this).prev()[0].checked = true;
                $(this).addClass("checked");
                $($(this).prev()[0]).attr("checked","checked");
            }
        }).prev().hide();     //原来的圆点样式设置为不可见
    }

    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '修改',hidden:'hidden',opt:'update'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    function create(local,option){
        var districtid = local.find('[opt=districtid]');      //行政区划值
        getdivision(districtid);                   //加载行政区划
        /*根据身份证获取基本信息*/
        getBaseInfoByIdentityid({identityid:local.find("[opt=identityid]"),birthdate:local.find('[opt=birthdate]'),
            gender:local.find('[opt=gender]'),age:local.find('[opt=tip_age]'),agetype:""})
        addRadioCss(local);
        addCheckboxCss(local);
        addToolBar(local);
        local.find('[opt=save]').hide();
        local.find('[opt=update]').hide();
    }

    /*保存*/
    function saveFunc(local,option){
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=highyearoldform]').form('submit',{
                url:'old/oldestpeople',
                onSubmit: function (param) {
                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    param.districtid = local.find('[opt=districtid]').combobox("getValue")
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        showProcess(false);
                    }
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        showProcess(false);
                        cj.slideShow('保存成功');
                    }else{
                        cj.slideShow('<label style="color: red">保存失败</label>');
                        showProcess(false);
                    }
                }
            })
        })
    }
    /*修改*/
    function updateFunc(local,option){
        var datas = option.queryParams.data;
        local.find('[opt=highyearoldform]').form('load',datas);
        var districtnameval = getDivistionTotalname(datas.districtid)
        var districtid = local.find('[opt=districtid]');      //行政区划
        districtid.combobox("setValue",districtnameval)  //填充行政区划
        local.find('[opt=update]').show();
        for(var i=0;i<keyarray.length;i++){
            local.find('input[name='+keyarray[i]+'][type=checkbox][value='+datas[keyarray[i]]+']').attr("checked","checked");
            local.find('input[name='+keyarray[i]+'][type=checkbox][value='+datas[keyarray[i]]+']+label').addClass("checked");
        }
        for(var key in datas){
            local.find('input[name='+key+'][type=radio][value='+datas[key]+']').attr("checked","checked");
            local.find('input[name='+key+'][type=radio][value='+datas[key]+']+label').addClass("checked");
        }
    }

    function render(l,o){
        create(l,o);
        if(o && o.queryParams){
            switch (o.queryParams.actiontype){
                case 'update':
                    updateFunc(l, o);
                    break;
                default :
                    break;
            }
        }else{
            saveFunc(l,o);
        }
    }

    return {
        render:render
    }
})