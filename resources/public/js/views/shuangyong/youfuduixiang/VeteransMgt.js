define(function(){
    function render(local,option){
        cj.getdivision(local.find('[opt=districtid]'));

        var datagrid = local.find('.easyui-datagrid-noauto');
        var userlength = cj.getUserMsg().regionid.length;
        var refreshGrid=function() {
            datagrid.datagrid('reload');
        };

        /*退役军人修改*/
        var updateFunc = function (record,refreshGrid,type) {
            var title ='【'+record.name+ '】退役军人';
            var tabname = '';
            if(record.persontype == '211'){ //伤残
                tabname = 'ScryTable';
                title+='[伤残人员]';
            }else if(record.persontype == '212'){ //三属
                tabname = 'SsryTable';
                title+='[三属人员]';
            }else if(record.persontype == '213'){ //两参
                tabname = 'LcryTable';
                title+='[两参人员]';
            }else if(record.persontype == '214'){ //在乡
                tabname = 'ZxlfryTable';
                title+='[在乡老复人员]';
            }else if(record.persontype == '215'){ //带病
                tabname = 'DbhxryTable';
                title+='[带病回乡人员]';
            }else if(record.persontype == '230'){ //一般退役
                tabname = 'YbtyryTable';
                title+='[一般退役军人]';
            }
            title+='信息';
            if(tabname.length > 0){
                layer.load(2);
                require(['text!views/shuangyong/youfuduixiang/childtables/'+tabname+'.htm','views/shuangyong/youfuduixiang/childtables/'+tabname],
                    function(htmfile,jsfile){
                        layer.open({
                            title:title,
                            type: 1,
                            area: ['910px', '500px'], //宽高
                            content: htmfile,
                            success: function(layero, index){
                                jsfile.render(layero,{
                                    index:index,
                                    queryParams:{
                                        actiontype:'update',
                                        type:type,
                                        refresh:refreshGrid,
                                        record:record
                                    }
                                });
                            }
                        });
                    }
                )
            }
        };

        /*加载退役军人*/
        datagrid.datagrid({
            url:"hyshy/getsoilderlist",
            type:'post',
            queryParams:{
                stype:'2'
            },

            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var reportbtns = local.find('[action=report]').hide();           //上报
                var updatebtns = local.find('[action=update]');           //修改
                var delbtns = local.find('[action=del]').hide();           //删除
                var auditbtns = local.find('[action=audit]').hide();           //审核
                var approvebtns = local.find('[action=approve]').hide();           //审批
                var logoutbtns = local.find('[action=logout]').hide();           //注销
                var removebtns = local.find('[action=remove]').hide();           //转移
                var oldtns = local.find('[action=old]').hide();
                //var imgviewbtns = local.find('[action=imgview]');           //预览
                var rows=data.rows;
                var btns_arr=[reportbtns,updatebtns,delbtns,auditbtns,approvebtns,logoutbtns,view,oldtns,removebtns];
                for(var i=0;i<rows.length;i++){
                    if(rows[i].ishandle == '0' || rows[i].ishandle == '-1'){    //保存
                        $(btns_arr[0][i]).show();
                        $(btns_arr[1][i]).show();
                        $(btns_arr[2][i]).show();
                    }else if(rows[i].ishandle == '1' && userlength <= 9 ){
                        $(btns_arr[3][i]).show();
                    }else if(rows[i].ishandle == '2' && userlength == 6){
                        $(btns_arr[4][i]).show();
                    }else if(rows[i].ishandle == '3'){
                        if(rows[i].persontype == '230'){         //一般退役军人转移
                            $(btns_arr[5][i]).show();
                            $(btns_arr[8][i]).show();
                        }else{
                            $(btns_arr[5][i]).show();
                        }
                    }


                   if(rows[i].age>=60 && rows[i].persontype == "230" && rows[i].sixtydeal == null){        //60岁一般退役军人
                       $(btns_arr[7][i]).show().find('span').css('color','red');
                   }

                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];


                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "report"){                                       //详细信息
                                    updateFunc(record,refreshGrid,'report');
                                }else if(action == "del"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'hyshy/deletesoilder',
                                            type:'post',
                                            data:{
                                                sc_id:record.sc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    refreshGrid();
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update"){                   //修改
                                    updateFunc(record,refreshGrid,'update');
                                }else if(action == "audit"){                   //审核
                                    auditFunc(record,refreshGrid);
                                }else if(action == "approve"){                   //审批
                                    approveFunc(record,refreshGrid);
                                }else if(action == "logout"){                   //注销
                                    layer.confirm('确定要注销此数据么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'hyshy/logoutsoilder',
                                            type:'post',
                                            data:{
                                                sc_id:record.sc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('注销成功', {icon: 6});
                                                    refreshGrid();
                                                }else{
                                                    layer.alert('注销失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "imgview"){                   //预览
                                    var FileExt=record.photo.replace(/.+\./,"").toLowerCase();
                                    if(FileExt=='png' || FileExt=='jpg' || FileExt=='gif') {
                                        layer.photos({
                                            photos: {
                                                "title": "图片预览",
                                                "start": 0,
                                                "status": 1,
                                                "data": [{
                                                    area: ['560px', '290px'],
                                                    "alt": record.name,
                                                    "pid": 109,
                                                    "src": record.photo,
                                                    "thumb": ""
                                                }]
                                            },
                                            tab: function (pic, layero) {
                                                layero.find('span.layui-layer-imguide').remove();
                                            }
                                        });
                                    }else{
                                        layer.alert('不是图片类型', {icon: 6});
                                    }
                                }else if(action == "view"){
                                    updateFunc(record,refreshGrid,'chakan');
                                }else if(action=='remove'){
                                    var title='一般退役军人转移确认';
                                    layer.load(2);
                                    require(['text!views/shuangyong/youfuduixiang/ybtyremove.htm','views/shuangyong/youfuduixiang/ybtyremove'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['610px', '200px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'remove',
                                                            record:record
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    )
                                }else if(action=='old'){
                                    var title='60(或以上)人员确认';
                                    layer.load(2);
                                    require(['text!views/shuangyong/youfuduixiang/sixOldDeal.htm','views/shuangyong/youfuduixiang/sixOldDeal'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['910px', '180px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'old',
                                                            record:record
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    )
                                }
                            });
                        })(i)
                    }
                }
            }
        })

        var name = local.find('[opt=name]');                        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        /*搜索*/
        local.find('.querybtn').click(function(){
            datagrid.datagrid('load',{
                name:name.val(),
                identityid:identityid.val(),
                districtid:local.find('[opt=districtid]').combobox('getValue'),
                p_type:local.find('[opt=p_type]').combobox('getValue'),
                //eachtype:local.find('[opt=eachtype]').combobox('getValue'),
                ishandle:local.find('[opt=handle_type]').combobox('getValue'),
                caretype:local.find('[opt=caretype]').combobox('getValue'),
                isdead:local.find('[opt=die_type]').combobox('getValue'),
                photo:local.find('[opt=hasphoto]').combobox('getValue'),
                joindate:local.find('[opt=joindate]').val(),
                retiredate:local.find('[opt=retiredate]').val(),
                birthday1:local.find('[opt=birthday1]').datebox('getValue'),
                birthday2:local.find('[opt=birthday2]').datebox('getValue'),
                household:local.find('[opt=household]').val(),
                train:local.find('[opt=train]').combobox('getValue'),
                employment:local.find('[opt=employment]').combobox('getValue'),
                minage:local.find('[opt=minage]').val(),
                maxage:local.find('[opt=maxage]').val(),
                isremove:local.find('[opt=isremove]').combobox('getValue'),
                stype:'2'
            })
        })

                  /*导入xls*/
      local.find('[opt=importexcel]').click(function(){
        local.find('[opt=importfile]').form('submit',{
            url:"hyshy/soilderimportexcel",
            onSubmit:function(params){
                params.sctype = '230';
            },
            success: function (data) {
            }

          })

      });


        /*导出excel模板*/
        local.find('[opt=excelmuban]').click(function(){
            var downloadurl = 'party/filedown2?filename='+encodeURI("/upload/excel/soldier.xls")+"&convert=1";
            window.location.href=downloadurl;
        });

              /*导出*/
      local.find('.exportbtn').click(function(){
        window.location.href="hyshy/soilderexportexcel?"+$.param({
                name:name.val(),
                identityid:identityid.val(),
                districtid:local.find('[opt=districtid]').combobox('getValue'),
                p_type:local.find('[opt=p_type]').combobox('getValue'),
                //eachtype:local.find('[opt=eachtype]').combobox('getValue'),
                ishandle:local.find('[opt=handle_type]').combobox('getValue'),
                caretype:local.find('[opt=caretype]').combobox('getValue'),
                isdead:local.find('[opt=die_type]').combobox('getValue'),
                photo:local.find('[opt=hasphoto]').combobox('getValue'),
                joindate:local.find('[opt=joindate]').val(),
                retiredate:local.find('[opt=retiredate]').val(),
                birthday1:local.find('[opt=birthday1]').datebox('getValue'),
                birthday2:local.find('[opt=birthday2]').datebox('getValue'),
                household:local.find('[opt=household]').val(),
                train:local.find('[opt=train]').combobox('getValue'),
                employment:local.find('[opt=employment]').combobox('getValue'),
                minage:local.find('[opt=minage]').val(),
                maxage:local.find('[opt=maxage]').val(),
              stype:'2',
              soildertype:'tuiyi'

        })});

        /*添加退役军人*/
        local.find('.addbtn').click(function(){
            layer.load(2);
            require(['text!views/shuangyong/youfuduixiang/VeteransForm.htm','views/shuangyong/youfuduixiang/VeteransForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'添加退役军人',
                        type: 1,
                        area: ['910px', '500px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    refresh:refreshGrid
                                }
                            });
                        }
                    });
                }
            )
        });

        if (option =="ty1") {
            local.find("[opt=handle_type]").combobox('setValue', '0');
            datagrid.datagrid('load',{
                ishandle:0,
                stype:'1'
            })
        }else if(option=="ty2"){
            local.find("[opt=handle_type]").combobox('setValue', '1');
            datagrid.datagrid('load',{
                ishandle:1,
                stype:'1'
            })
        } else if(option=="ty3"){
            local.find("[opt=handle_type]").combobox('setValue', '2');
            datagrid.datagrid('load',{
                ishandle:2,
                stype:'1'
            })
        }else if(option=="ty4"){
            local.find("[opt=die_type]").combobox('setValue', '1');
            datagrid.datagrid('load',{
                isdead:'1',
                stype:'1'
            })
        }
    }


    /*退役军人审核*/
    var auditFunc = function (record,refreshGrid) {
        var title ='【'+record.name+ '】退役军人';
        var tabname = '';
        if(record.persontype == '211'){ //伤残
            tabname = 'ScryTable';
            title+='[伤残人员]';
        }else if(record.persontype == '212'){ //三属
            tabname = 'SsryTable';
            title+='[三属人员]';
        }else if(record.persontype == '213'){ //两参
            tabname = 'LcryTable';
            title+='[两参人员]';
        }else if(record.persontype == '214'){ //在乡
            tabname = 'ZxlfryTable';
            title+='[在乡老复人员]';
        }else if(record.persontype == '215'){ //带病
            tabname = 'DbhxryTable';
            title+='[带病回乡人员]';
        }else if(record.persontype == '230'){ //一般退役
            tabname = 'YbtyryTable';
            title+='[一般退役军人]';
        }
        title+='审核';
        if(tabname.length > 0){
            layer.load(2);
            require(['text!views/shuangyong/youfuduixiang/childtables/'+tabname+'.htm','views/shuangyong/youfuduixiang/childtables/'+tabname],
                function(htmfile,jsfile){
                    layer.open({
                        title:title,
                        type: 1,
                        area: ['910px', '500px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'audit',
                                    refresh:refreshGrid,
                                    record:record
                                }
                            });
                        }
                    });
                }
            )
        }
    }
    /*退役军人审批*/
    var approveFunc = function (record,refreshGrid) {
        var title ='【'+record.name+ '】退役军人';
        var tabname = '';
        if(record.persontype == '211'){ //伤残
            tabname = 'ScryTable';
            title+='[伤残人员]';
        }else if(record.persontype == '212'){ //三属
            tabname = 'SsryTable';
            title+='[三属人员]';
        }else if(record.persontype == '213'){ //两参
            tabname = 'LcryTable';
            title+='[两参人员]';
        }else if(record.persontype == '214'){ //在乡
            tabname = 'ZxlfryTable';
            title+='[在乡老复人员]';
        }else if(record.persontype == '215'){ //带病
            tabname = 'DbhxryTable';
            title+='[带病回乡人员]';
        }else if(record.persontype == '230'){ //一般退役
            tabname = 'YbtyryTable';
            title+='[一般退役军人]';
        }
        title+='审批';
        if(tabname.length > 0){
            layer.load(2);
            require(['text!views/shuangyong/youfuduixiang/childtables/'+tabname+'.htm','views/shuangyong/youfuduixiang/childtables/'+tabname],
                function(htmfile,jsfile){
                    layer.open({
                        title:title,
                        type: 1,
                        area: ['910px', '500px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'approve',
                                    refresh:refreshGrid,
                                    record:record
                                }
                            });
                        }
                    });
                }
            )
        }

    }



    return {
        render:render
    }

})
