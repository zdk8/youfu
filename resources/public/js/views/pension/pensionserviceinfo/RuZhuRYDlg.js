define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '修改',hidden:'hidden',opt:'update'},
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
        var selectRadio = ":input[type=checkbox] + label";
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
            })
            .prev().hide();     //原来的圆点样式设置为不可见
    }
    function render(local,option){
        addToolBar(local);
        local.find('[opt=save]').hide();
        local.find('[opt=update]').hide();
        addRadioCss(local);

        var divisiontree = local.find('[opt=districtid]'); //行政区划id
        getdivision(divisiontree);                                 //加载行政区划
        var rzrydlg = local.find('[opt=rzrydlg]');      //表单
//        var determine = option.submitbtn                //确定按钮
        var actiontype = option.queryParams.actiontype;             //操作方式

        if(actiontype == "addrzry"){                     //添加入住人员
//            rzrydlg.form('load', {departname:option.queryParams.data.departname,dep_id:option.queryParams.data.dep_id});  //填充机构名称、机构id
            local.find("[opt=update]").hide();
            local.find("[opt=save]").show().click(function(){
                rzrydlg.form('submit',{
                    url:"pension/addoldpeopledepart",
                    onSubmit:function(params){
                        params.deptype = option.queryParams.data.deptype
                        params.dep_id = option.queryParams.data.dep_id
                        params.departname = option.queryParams.data.departname
                        params.districtid = divisiontree.combobox("getValue")
                    },
                    success:function(data){
                        if(data == "true"){
                            cj.slideShow("成功添加入住人员！")
                            $("#tabs").tabs("close",option.queryParams.title)
                            var ref = option.queryParams.refresh
                            ref();
                        }else{
                            cj.slideShow("<label style='color: red'>添加失败！老人已入住！</label>")
                        }
                    }
                })
            });
//            determinefunc({determine:determine,rzrydlg:rzrydlg,actiontype:actiontype,option:option})
        }else if(actiontype == "view"){                                  //查看并修改
            local.find("[opt=save]").hide();
            var datas = option.queryParams.record;
            rzrydlg.form('load',datas);
            var districtnameval = getDivistionTotalname(option.queryParams.record.districtid)   //获取行政区划全名
            divisiontree.combotree("setValue",districtnameval)  //填充行政区划
            var jjzkarr = ['jjzk_baofang','jjzk_lixiu','jjzk_baomu'];
            for(var i=0;i<jjzkarr.length;i++){
                local.find('input[name='+jjzkarr[i]+'][type=checkbox][value='+datas[jjzkarr[i]]+']').attr("checked","checked");
                local.find('input[name='+jjzkarr[i]+'][type=checkbox][value='+datas[jjzkarr[i]]+']+label').addClass("checked");
            }
            local.find("[opt=update]").show().click(function(){
                rzrydlg.form('submit',{
                    url:"pension/updateopdepbyid",
                    onSubmit:function(params){
                        params.opd_id = option.queryParams.record.opd_id
                        if(!isNaN(divisiontree.combobox("getValue"))){          //是否是数字
                            params.districtid = divisiontree.combobox("getValue")
                        }else{
                            params.districtid = option.queryParams.record.districtid
                        }
                    },
                    success:function(data){
                        console.log(data)
                        if(data == "true"){
                            cj.slideShow("修改成功！")
                            $("#tabs").tabs("close",option.queryParams.title)
                            var ref = option.queryParams.refresh
                            ref();
                        }else{
                            cj.slideShow("<label style='color: red'>修改失败！</label>")
                        }
                    }
                })
            })
        }

        /*取消*/
       /* local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })*/
        /*根据身份证获取基本信息*/
        /*local.find("[name=identityid]").change(function(){
            var val = local.find("[name=identityid]").val();
            var sex;
            var birthdayValue;
            var age;
            var sexcode;
            if (15 == val.length) { //15位身份证号码
                birthdayValue = val.charAt(6) + val.charAt(7);
                if (parseInt(birthdayValue) < 10) {
                    birthdayValue = '20' + birthdayValue;
                }
                else {
                    birthdayValue = '19' + birthdayValue;
                }
                age = Date.getFullYear()-parseInt(birthdayValue); //年龄
                birthdayValue = birthdayValue + '-' + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11);
                if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14)) {
                    sex = '男';
                    sexcode = '1';
                }
                else{
                    sex = '女';
                    sexcode = '0';
                }

            }
            if (18 == val.length) { //18位身份证号码
                birthdayValue = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11)

                    + '-' + val.charAt(12) + val.charAt(13);
                if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16)){
                    sex = '男';
                    sexcode = '1';
                }
                else{
                    sex = '女';
                    sexcode = '0';
                }
                age =(new Date()).getFullYear()-parseInt((val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9)));
            }
            if(birthdayValue == "" || birthdayValue == null){
                alert("请输入正确的身份证!")
            }else{
                *//*根据身份证从老年人表中带出老年人信息*//*
                $.ajax({
                    url:'pension/checkidentityid',
                    type:'post',
                    data:{
                        identityid:local.find("[name=identityid]").val()
                    },
                    success:function(data){
                        if(data.message){
                            console.log(data.opdate[0])
                            rzrydlg.form('load', data.opdate[0]);  //填充
                        }
                    },
                    dataType:'json'
                })
            }
        });*/
    }


    /*确定按钮*/
    /*var determinefunc = function(params){
        params.determine.click(function(e){
            if(params.actiontype == "addrzry"){         //新增入住人员
                params.rzrydlg.form('submit',{
                    url:'pension/addoldpeopledepart',
                    onSubmit: function (param) {
                        var flag = $(this).form('validate');
                        if (flag) {
                            param.deptype = params.option.data.deptype
                            param.dep_id = params.option.data.dep_id
                            param.departname = params.option.data.departname
                            showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                        }
                        return flag
                    },
                    success:function(data){
                        showProcess(false);
                        if(data == "true"){
                            cj.slideShow('成功添加入住人员');
                            params.option.parent.trigger('close');
//                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            cj.slideShow('添加失败！老人已入住');
                        }
                    },
                    onLoadError: function () {
                        showProcess(false);
                        cj.slideShow('温馨提示', '由于网络或服务器太忙，提交失败，请重试！');
                    }
                });
            }else if(params.actiontype == "update"){     //修改
                params.rzrydlg.form('submit',{
                    url:'pension/updatedepartmentbyid',
                    success:function(data){
                        var data = eval('(' + data + ')');
                        if(data.success){
                            cj.slideShow("修改成功！")
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            cj.slideShow("修改失败！")
                        }
                    }
                });
            }
        });
    }*/

    return {
        render:render
    }

})