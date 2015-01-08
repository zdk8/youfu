define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=35;
//        var toolBarHeight=100;
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
    };

    var actionInfo=function(local,option) {
        addToolBar(local);
        local.find('form').form('load',option.queryParams.data)
    };


    function create(local,option){
        addToolBar(local);
        /*为每个label注册收缩事件*/
        local.find('fieldset').find('legend').find('label').each(function(obj,fn,arg){
            var labelopt = fn.attributes[0].value.toString()
            var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
            if(label_talbe != "baseinfo"){
                FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
            }
        }).click(function(e){
                var labelopt = $(this)[0].attributes[0].value.toString();
                var label_talbe = labelopt.substr(0,labelopt.lastIndexOf('_'));
                FieldSetVisual(local,label_talbe+'_table',label_talbe,label_talbe+'_img')
            })
        var districtid = local.find('[opt=districtid]');      //行政区划
        var districtname = local.find('[opt=districtname]');  //行政区划名称
        getdivision(districtid,districtname);                   //加载行政区划
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        var familymembersgrid = local.find('[opt=familymembersgrid]');      //老人信息子表
        var dealwith = local.find('[opt=dealwith]');            //处理按钮
    }

    /*新增数据时进入*/
    var saveFunc = function(local,option){
        local.find('[name=operators]').val(cj.getUserMsg().username);
        local.find('[opt=setdaytime]').datebox('setValue',new Date().pattern('yyyy-MM-dd'));
        /*根据身份证获取基本信息*/
        getBaseInfoByIdentityid({identityid:local.find("[opt=identityid]"),birthdate:local.find('[opt=birthdate]'),
            gender:local.find('[opt=gender]'),age:local.find('[opt=age]'),agetype:null})
        var savebtn = local.find('[opt=save]');               //保存按钮
        savebtn.show().click(function(){
            local.find('[opt=pensionform]').form('submit', {
                url:'/saveold',
                onSubmit: function () {
                    var isValid = $(this).form('validate');
                    return isValid;
                },
                success: function (data) {
                    var data = eval('('+data+')')
                    console.log(data)
                    if(data.success){
                        cj.slideShow('保存成功');
                        $("#tabs").tabs("close","老年基本信息录入")
                    }
                }
            });
        })
    }

    /*处理时进入页面(actionType=info)*/
    var dealwithInfoFunc = function(local,option){
        var pensionform = local.find('[opt=pensionform]');      //老人信息主表
        pensionform.form('load',option.queryParams.data)        //填充表单
        var dealwithbtn = local.find('[opt=dealwith]');            //处理按钮
        dealwithbtn.show().click(function(){
            require(['commonfuncs/popwin/win','text!views/pension/PensionPeopleAuditDlg.htm','views/pension/PensionPeopleAuditDlg'],
                function(win,htmfile,jsfile){
                    win.render({
                        title:'处理',
                        width:395,
                        height:250,
                        html:htmfile,
                        buttons:[
                            {text:'取消',handler:function(html,parent){
                                parent.trigger('close');
                            }},
                            {
                                text:'保存',
                                handler:function(html,parent){ }}
                        ],
                        renderHtml:function(local,submitbtn,parent){
                            jsfile.render(local,{
                                submitbtn:submitbtn,
                                act:'c',
                                refresh:option.queryParams.refresh,
                                data:option.queryParams.record,
                                title:option.queryParams.title,
                                parent:parent,
                                onCreateSuccess:function(data){
                                    parent.trigger('close');
                                }
                            })
                        }
                    })
                }
            )
        })
        /*for(var i=0;i<pensionform[0].length;i++){             //禁用表单
            var element = pensionform[0].elements[i];
            element.disabled = true
        }
        disabledForm(local);*/                                //禁用easyui框
    }


    var render=function(l,o){
        create(l,o);
        if(o.queryParams) {
            switch (o.queryParams.actiontype){
                case 'update1':
                    (function(){alert('hahaha')})();
                    break;
                case 'info':
                    dealwithInfoFunc(l,o);
                    break;
                case 'update':
                    actionInfo(l, o);
                    break;
                default :
                    break;
            }
        }else{
            saveFunc(l, o);
        }
    }
    return {
        render:render
    }

})