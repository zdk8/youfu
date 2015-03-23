define(function () {
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
            /*if(s == "agerange"){
                console.log("不操作")
            }else{

            }*/
        })
            .prev().hide();     //原来的圆点样式设置为不可见
    }

    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    function render(local,option){
        var districtid = local.find('[opt=districtid]');      //行政区划值
        getdivision(districtid);                   //加载行政区划
        /*根据身份证获取基本信息*/
        getBaseInfoByIdentityid({identityid:local.find("[opt=identityid]"),birthdate:local.find('[opt=birthdate]'),
            gender:local.find('[opt=gender]'),age:local.find('[opt=tip_age]'),agetype:""})
        addRadioCss(local);
        addToolBar(local);
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=highyearoldform]').form('submit',{
                url:'adb',
                onSubmit: function (param) {

                },
                success: function (data) {
                    console.log(data)
                }
            })
        })
    }

    return {
        render:render
    }
})