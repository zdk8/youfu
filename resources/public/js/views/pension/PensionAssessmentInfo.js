define(function(){
    function render(local,option){
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '删除',hidden:'hidden',opt:'delete'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
        var dealwithbtn = toolBar.find('[opt=dealwith]');            //处理按钮
        var savebtn = toolBar.find('[opt=save]');            //保存按钮
        var deletebtn = toolBar.find('[opt=delete]');            //删除按钮

        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);                               //加载行政区划

        dealwithbtn.show()
        /*通过身份证号加载老年人*/
        local.find("[opt=identityid]").combogrid({
            panelWidth:350,
            panelHeight:350,
            url:'oldid',
            method:'post',
            idField:'identityid',
            textField:'identityid',
            fitColumns:true,
            pagination:true,
            mode:'remote',
            columns:[[
                {field:'name',title:'姓名',width:60},
                {field:'identityid',title:'身份证',width:80},
                {field:'address',title:'地址',align:'right',width:60}
            ]],
            onClickRow:function(index,row){
                $.ajax({
                    url:'searchid',
                    data:{
                        id:row.lr_id
                    },
                    type:'get',
                    success:function(res){
                        if(res){
                            $('form[opt=mainform]').form('load',res);
                            $('[opt=csrq]').datebox('setValue',res.birthd);
                            var date = $(':input[opt=csrq]').datebox('getValue');
                            var age = res.age;
                            if (age >= 60 && age < 80){
                                $('input[name=nl_fenl]:eq(0)').attr("checked","checked");
                                $('input[name=sum_nl_fenl]:eq(0)').attr("checked","checked");
                                $('input[name=nl_fenl]:eq(0)+label').addClass("checked");
                                $('input[name=sum_nl_fenl]:eq(0)+label').addClass("checked");
                                $('input[name=nl_pingguf]').attr("readonly","readonly").val(0);
                                $('input[name=sum_nl_pingguf]').attr("readonly","readonly").val(0);
                            } else if(age >= 80 && age <= 90){
                                $('input[name=nl_fenl]:eq(1)').attr("checked","checked");
                                $('input[name=sum_nl_fenl]:eq(1)').attr("checked","checked");
                                $('input[name=nl_fenl]:eq(1)+label').addClass("checked");
                                $('input[name=sum_nl_fenl]:eq(1)+label').addClass("checked");
                                $('input[name=nl_pingguf]').attr("readonly","readonly").val(5);
                                $('input[name=sum_nl_pingguf]').attr("readonly","readonly").val(5);
                            }else if(age >90){
                                $('input[name=nl_fenl]:eq(2)').attr("checked","checked");
                                $('input[name=sum_nl_fenl]:eq(2)').attr("checked","checked");
                                $('input[name=nl_fenl]:eq(2)+label').addClass("checked");
                                $('input[name=sum_nl_fenl]:eq(2)+label').addClass("checked");
                                $('input[name=nl_pingguf]').attr("readonly","readonly").val(10);
                                $('input[name=sum_nl_pingguf]').attr("readonly","readonly").val(10);
                            }
                        }else{
                            alert('无数据')
                        }
                    }
                })
            }
        })

    }

    return {
        render:render
    }

})