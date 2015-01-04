define(function(){


    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    var genCheckBox=function(w,enumtype,name,record) {
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
        /*保存*/
        local.find('[opt=save]').show().bind('click',function(){
            local.find('[opt=pensionform]').form('submit', {
                url:'audit/addauditapply',
                onSubmit: function () {
                    var isValid = $(this).form('validate');
                    if(isValid){
                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    }
                    return isValid;
                },
                success: function (data) {
                    var data =  eval('(' + data + ')');
                    if(data.success){
                        cj.slideShow('操作成功');
                        setTimeout(function(){
                            showProcess(false);
                            $("#tabs").tabs('close',"居家养老服务申请")
                        },1000);
                    }
                }
            });
        });
        var districtid = local.find('[opt=districtid]');
        var pensionform = local.find('[opt=pensionform]');
        var familymembersgrid = local.find('[opt=familymembersgrid]');
        var dealwith = local.find('[opt=dealwith]');

        local.find('[name=operators]').val(cj.getUserMsg().username);
        local.find('[opt=applydate]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));
        local.find('[opt=getjiguan]').bind('click',function(){
            $me = $(this);
            var id=$('[opt=identityid]').val();
            if(id) {
                $.ajax({
                    url:'gethometown',
                    data:{
                        identityid:$('[opt=identityid]').val()
                    },success:function(res){
                        $me.prev().val(res.totalname);
                    }
                })
            }
        });
//        genCheckBox(local.find('[opt=liveplace]'), 'liveplace', 'live',record);
//        genCheckBox(local.find('[opt=hyfwjingji]'), 'hyfwjingji', 'economy',record);
//        genCheckBox(local.find('[opt=culture]'), 'hyculture', 'culture',record);
//        genCheckBox(local.find('[opt=marriage]'), 'marriage', 'marriage',record);

        var $registration=local.find('[opt=registration]')
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
        });
        var doinitage_radio=function(age){
            var age=age;
            if(age<80){
                local.find('[opt=a][name=agerange]').attr("checked",'true');
            }else if(age>=80 && age<90){
                local.find('[opt=b][name=agerange]').attr("checked",'true');
            }else if(age>=90 && age<100){
                local.find('[opt=c][name=agerange]').attr("checked",'true');
            }else{
                local.find('[opt=d][name=agerange]').attr("checked",'true');
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
    function showinfo(local,option){
        baseRender(local, option.queryParams.data);
        local.find('form').form('load', option.queryParams.data);
        local.find('[opt=save]').hide()
        local.find('[opt=update]').show().bind('click',function(){
            local.find('[opt=pensionform]').form('submit', {
                url:'audit/updateapply',
                dataType:"json",
                onSubmit: function () {
                    var isValid = $(this).form('validate');
                    if(isValid){
                        showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    }
                    return isValid;
                },
                success: function (data) {
                    var data =  eval('(' + data + ')');
                    if(data.success){
                        cj.slideShow('操作成功');
                        setTimeout(function(){
                            showProcess(false);
                            $("#tabs").tabs('close',option.queryParams.title)
                        },1000)
                        var ref = option.queryParams.refresh;             //刷新
                        ref();
                    }
                }
            });


        });
    }

    var render=function(l,o){
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'info':
                    showinfo(l,o);                  //查看详细信息，并可进行修改
                    break;
                case 'update':
                    actionInfo(l, o);
                    break;
                default :
                    break;
            }
        }else{
            create(l, o);
        }
    }
    return {
        render:render
    }

})