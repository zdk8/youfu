define(function(){


    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '提交',hidden:'hidden',opt:'save'},
            {text: '提交',hidden:'hidden',opt:'save2'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '变更',hidden:'hidden',opt:'change'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*为radio添加样式*/
    var addRadioCss = function(local) {
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).click(function () {               //为第个元素注册点击事件
                var s = $($(this).prev()[0]).attr('name')
                if(s == "agerange"){
                    console.log("不操作")
                }else{
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
                }
            })
            .prev().hide();     //原来的圆点样式设置为不可见
    }
    var addRadioCssNoOperation = function(local) {
        var selectRadio = ":input[type=radio] + label";
        local.find(selectRadio).each(function () {
            if ($(this).prev()[0].checked){
                $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
            }
        }).prev().hide();     //原来的圆点样式设置为不可见
    }
    var getCheckBox=function(w,enumtype,name,record) {
        $.ajax({
            url: 'getenumbytype',
            dataType: 'jsonp',
            data: {
                type:enumtype
            },
            success: function(data){
                var items = $.map(data, function(item){
                    return {
                        id: item.enumeratevalue,
                        text: item.enumeratelabel
                    };
                });
                var result='';
                var d = items;
                for(var i in d) {
                    var checked='';
                    var myrecord=record||{};
                    if(d[i].id==myrecord[name]){
                        checked+='checked="checked"';
                    }
                    result+='<input type="radio" '+checked+' name="'+name+'" value="'+d[i].id+'"><label>'+d[i].text+'</label>';
                }
                $(w).append(result);
                $(w).find('input[type=radio]+label').each(function(){
                    $(this).bind('click',function(){
                        $(this).prev().attr("checked",'true');

                    })
                });

            }
        });

    };

    var actionInfo=function(local,option) {
        addToolBar(local);
        local.find('form').form('load',option.queryParams.data)
    };

    /*初始化页面*/
    function baseRender(local,record){
        addToolBar(local);
        var districtid = local.find('[opt=districtid]');      //行政区划值
        getdivision(districtid);                   //加载行政区划
        /*根据身份证获取基本信息*/
        getBaseInfoByIdentityid({identityid:local.find("[opt=identityid]"),birthdate:local.find('[opt=birthdate]'),
            gender:local.find('[opt=gender]'),tip_age:local.find('[opt=tip_age]'),agetype:"span"})


        var pensionform = local.find('[opt=pensionform]');
        var familymembersgrid = local.find('[opt=familymembersgrid]');
        var dealwith = local.find('[opt=dealwith]');

        local.find('[name=operators]').val(cj.getUserMsg().username);
        local.find('[opt=applydate]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));
        /*默认籍贯*/
        local.find('[opt=getjiguan]').bind('click',function(){
            var $me = $(this);
            var id=local.find('[opt=identityid]').val();
            if(id) {
                $.ajax({
                    url:'gethometown',
                    data:{
                        identityid:local.find('[opt=identityid]').val()
                    },success:function(res){
                        $me.prev().val(res.totalname);
                    }
                })
            }
        });


        /*var $registration=local.find('[opt=registration]')
        $registration.combotree({
            url:'get-divisionlist?dvhigh=330424',
            method: 'get',
            onBeforeExpand: function (node) {
                $registration.combotree("tree").tree("options").url
                    ="get-divisionlist?dvhigh=" + node.parentid;
            },
            onHidePanel: function () {
                $registration.combotree('setValue',
                    $registration.combotree('tree').tree('getSelected').divisionpath);
            }
        });
        var $address=local.find('[opt=address]')
        $address.combotree({
            url:'get-divisionlist?dvhigh=330424',
            method: 'get',
            onBeforeExpand: function (node) {
                $address.combotree("tree").tree("options").url
                    ="get-divisionlist?dvhigh=" + node.parentid;
            },
            onHidePanel: function () {
                $address.combotree('setValue',
                    $address.combotree('tree').tree('getSelected').divisionpath);
            }
        });*/
        var doinitage_radio=function(age){
            var age=age;
            if(age<80){
                local.find('[opt=a][name=agerange]').attr("checked",'true');
                local.find('[opt=a][name=agerange]+label').addClass("checked");
            }else if(age>=80 && age<90){
                local.find('[opt=b][name=agerange]').attr("checked",'true');
                local.find('[opt=a][name=agerange]+label').addClass("checked");
            }else if(age>=90 && age<100){
                local.find('[opt=c][name=agerange]').attr("checked",'true');
                local.find('[opt=a][name=agerange]+label').addClass("checked");
            }else{
                local.find('[opt=d][name=agerange]').attr("checked",'true');
                local.find('[opt=a][name=agerange]+label').addClass("checked");
            }
            local.find('[opt=tip_age]').text(age+'岁');
        }
        require(['commonfuncs/BirthGenderAge'],function(js){
            js.render(local,{callback:function(result){
                doinitage_radio(result.age);
            }})
        });
        if(record){
            doinitage_radio(record.age);
        }


    }

    function create(local,option){
        baseRender(local);
    }
    /*新增*/
    function addInfo(local,option){
        addRadioCss(local);
        local.find('[opt=update]').hide();
        local.find('[opt=change]').hide();
        local.find('[opt=save2]').hide();
        var districtid = local.find('[opt=districtid]');      //行政区划值
        /*保存*/
        local.find('[opt=save]').show().bind('click',function(){
            local.find('[opt=save]').hide();
            local.find('[opt=save2]').show();
            local.find('[opt=pensionform]').form('submit', {
                url:'audit/addauditapply',
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if(isValid){
                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        params.districtid = districtid.combobox("getValue")
                    }
                    return isValid;
                },
                success: function (data) {
                    if(data == "true"){
                        showProcess(false);
                        cj.slideShow('保存成功');
                        local.find('[opt=save]').show();
                        local.find('[opt=save2]').hide();
                        if(showProcess(false)){
                            $("#tabs").tabs('close',"居家养老服务申请")
                        }
                    }else{
                        showProcess(false);
                        cj.slideShow('<label style="color: red">保存失败</label>');
                    }
                }
            });
        });
    }
    /*修改*/
    function showinfo(local,option){
        addRadioCss(local);
        baseRender(local, option.queryParams.data);
        var districtid = local.find('[opt=districtid]');      //行政区划值
        local.find('form').form('load', option.queryParams.data);
        var districtnameval = getDivistionTotalname(option.queryParams.data.districtid)
        districtid.combotree("setValue",districtnameval)  //填充行政区划
        local.find('input[name=culture][type=radio][value='+option.queryParams.data.culture+']').attr("checked","checked");
        local.find('input[name=culture][type=radio][value='+option.queryParams.data.culture+']+label').addClass("checked");
        local.find('input[name=marriage][type=radio][value='+option.queryParams.data.marriage+']').attr("checked","checked");
        local.find('input[name=marriage][type=radio][value='+option.queryParams.data.marriage+']+label').addClass("checked");
        local.find('input[name=live][type=radio][value='+option.queryParams.data.live+']').attr("checked","checked");
        local.find('input[name=live][type=radio][value='+option.queryParams.data.live+']+label').addClass("checked");
        local.find('input[name=economy][type=radio][value='+option.queryParams.data.economy+']').attr("checked","checked");
        local.find('input[name=economy][type=radio][value='+option.queryParams.data.economy+']+label').addClass("checked");

        local.find('[opt=save]').hide();
        local.find('[opt=save2]').hide();
        local.find('[opt=change]').hide();
        /*修改*/
        local.find('[opt=update]').show().bind('click',function(){
            local.find('[opt=pensionform]').form('submit', {
                url:'audit/updateapply',
                dataType:"json",
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if(isValid){
                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        if(!isNaN(local.find("[opt=districtid]").combobox("getValue"))){          //是否是数字
                            params.districtid = districtid.combobox("getValue")
                        }else{
                            params.districtid = option.queryParams.data.districtid
                        }
                    }
                    return isValid;
                },
                success: function (data) {
                    if(data == "true"){
                        showProcess(false);
                        cj.slideShow('修改成功');
                        if(showProcess(false)){
                            $("#tabs").tabs('close',option.queryParams.title)
                             var ref = option.queryParams.refresh;             //刷新
                             ref();
                        }
                    }
                }
            });
        });
    }
    /*查看详细信息*/
    function showInformation(local,option){
        addRadioCssNoOperation(local);
        baseRender(local, option.queryParams.data);
        local.find('form').form('load', option.queryParams.data);
        var districtidval = option.queryParams.data.districtid;
        local.find('[opt=districtid]').combotree("setValue",getDivistionTotalname(districtidval));
        local.find('input[name=culture][type=radio][value='+option.queryParams.data.culture+']').attr("checked","checked");
        local.find('input[name=culture][type=radio][value='+option.queryParams.data.culture+']+label').addClass("checked");
        local.find('input[name=marriage][type=radio][value='+option.queryParams.data.marriage+']').attr("checked","checked");
        local.find('input[name=marriage][type=radio][value='+option.queryParams.data.marriage+']+label').addClass("checked");
        local.find('input[name=live][type=radio][value='+option.queryParams.data.live+']').attr("checked","checked");
        local.find('input[name=live][type=radio][value='+option.queryParams.data.live+']+label').addClass("checked");
        local.find('input[name=economy][type=radio][value='+option.queryParams.data.economy+']').attr("checked","checked");
        local.find('input[name=economy][type=radio][value='+option.queryParams.data.economy+']+label').addClass("checked");
        local.find('[opt=save]').hide();
        local.find('[opt=save2]').hide();
        local.find('[opt=update]').hide();
        local.find('[opt=change]').hide();
    }
    /*变更人员信息*/
    function changeInfo(local,option){
        addRadioCss(local);
        baseRender(local, option.queryParams.data);
        local.find('form').form('load',option.queryParams.data);
        var districtidval = option.queryParams.data.districtid;
        local.find('[opt=districtid]').combotree("setValue",getDivistionTotalname(districtidval));
        local.find('input[name=culture][type=radio][value='+option.queryParams.data.culture+']').attr("checked","checked");
        local.find('input[name=culture][type=radio][value='+option.queryParams.data.culture+']+label').addClass("checked");
        local.find('input[name=marriage][type=radio][value='+option.queryParams.data.marriage+']').attr("checked","checked");
        local.find('input[name=marriage][type=radio][value='+option.queryParams.data.marriage+']+label').addClass("checked");
        local.find('input[name=live][type=radio][value='+option.queryParams.data.live+']').attr("checked","checked");
        local.find('input[name=live][type=radio][value='+option.queryParams.data.live+']+label').addClass("checked");
        local.find('input[name=economy][type=radio][value='+option.queryParams.data.economy+']').attr("checked","checked");
        local.find('input[name=economy][type=radio][value='+option.queryParams.data.economy+']+label').addClass("checked");
        local.find('[opt=save]').hide();
        local.find('[opt=save2]').hide();
        local.find('[opt=update]').hide();
        /*变更*/
        local.find('[opt=change]').show().click(function(){
            local.find('[opt=pensionform]').form('submit', {
                url:'audit/reassess',
                dataType:"json",
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if(isValid){
//                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        if(!isNaN(local.find("[opt=districtid]").combobox("getValue"))){          //是否是数字
                            params.districtid = local.find('[opt=districtid]').combobox("getValue")
                        }else{
                            params.districtid = districtidval
                        }
                    }
                    return isValid;
                },
                success: function (data) {
//                    var data =  eval('(' + data + ')');
                    if(data == "true"){
                        showProcess(false);
                        cj.slideShow('变更成功');
                        if(showProcess(false)){
                            $("#tabs").tabs('close',option.queryParams.title)
                            var ref = option.queryParams.refresh;             //刷新
                            ref();
                        }
                    }else{
                        showProcess(false);
                        cj.slideShow('<label style="color: red">变更失败</label>');
                    }
                }
            });
        })
    }

    var render=function(l,o){
        create(l, o);
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'info':
                    showinfo(l,o);                  //查看详细信息，并可进行修改
                    break;
                case 'information':
                    showInformation(l,o);           //只查看信息
                    break;
                case 'update':
                    actionInfo(l, o);
                    break;
                case 'change':                   //变更
                    changeInfo(l,o);
                    break;
                default :
                    break;
            }
        }else{
            addInfo(l, o);            //新增态
        }
    }
    return {
        render:render
    }

})