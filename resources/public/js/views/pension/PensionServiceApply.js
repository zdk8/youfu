define(function(){


    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',opt:'save'}/*,
            {text: '操作日志',opt:'log'}*/
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


    function baseRender(local,record){
        addToolBar(local);
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


        if(option.queryParams && option.queryParams.actiontype == "info"){            //处理
            dealwith.show();                                        //显示处理按钮
            local.find('[opt=newfamilymemeradd_btn]').hide()   //隐藏子表新增按钮
            local.find('[opt=delfamilymemer_btn]').hide()      //隐藏子表删除按钮
            for(var i=0;i<pensionform[0].length;i++){             //禁用表单
                var element = pensionform[0].elements[i];
                element.disabled = true
            }
            $.ajax({
                url:"searchid",                                //查询老人表
                data:{
                    id:option.queryParams.data.lr_id
                },
                type:"post",
                dataType:"json",
                success:function(data){
                    pensionform.form('load',data)        //填充主表
                    //famillylist(option.queryParams.data.lr_id)     //填充子表
                    dealwithFunc({dealwith:dealwith,data:option.queryParams.data,refresh:option.queryParams.refresh}) //数据处理
                    showProcess(false);
                }
            })
        }
        else{

            local.find('[opt=save]').show().bind('click',function(){
                local.find('[opt=pensionform]').form('submit', {
                    url:'/audit/addauditapply',
                    onSubmit: function () {
                        var isValid = $(this).form('validate');
                        cj.slideShow('表单验证结果:' + isValid);
                        return isValid;
                    },
                    success: function (data) {
                        cj.slideShow('操作成功');
                    }
                });


            });
        }

    }
    function showinfo(local,option){
        baseRender(local, option.queryParams.data);
        console.log(option.queryParams.data);
        local.find('form').form('load', option.queryParams.data);
        local.find('[opt=save]').show().bind('click',function(){
            local.find('[opt=pensionform]').form('submit', {
                url:'/audit/updateapply',
                onSubmit: function () {
                    var isValid = $(this).form('validate');
                    cj.slideShow('表单验证结果:' + isValid);
                    return isValid;
                },
                success: function (data) {
                    cj.slideShow('操作成功');
                }
            });


        });
    }

    var render=function(l,o){
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'info':
                    showinfo(l,o);
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