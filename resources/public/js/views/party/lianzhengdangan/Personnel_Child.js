define(function(){
    /*布局和操作按钮初始化*/
    function layoutBtnInit(local,option){
        local.find('[opt='+option.layout+']').layout();
        local.find('[opt='+option.other+']').on('click', function () {
            local.find('[opt='+option.func_btn+']').animate({"right":'', width : "show"},500);
        });
        local.find('[opt='+option.other2+']').on('click', function () {
            local.find('[opt='+option.func_btn+']').animate({"right":'', width : "hide"},500);
        });
    }
    /*获奖情况*/
    function hjqkFunc(local,option){
        layoutBtnInit(local,{
            layout:'layout_hjqk',
            other:'other_hjqk',
            func_btn:'func_btn_hjqk',
            other2:'other2_hjqk'
        });
        local.find('[opt=date_hjqk]').datebox();
        var grid_hjqk = local.find('[opt=datagrid_hjqk]');
        grid_hjqk.datagrid({
            url:"party/getawardpunishlist",
            queryParams:{
                mode:'j',
                pr_id:option.queryParams.record.pr_id
            },
            type:'post',
            onLoadSuccess:function(data){
                var updatebtns = local.find('[action=update_hjqk]');           //修改
                var delbtns = local.find('[action=del_hjqk]');           //删除
                var rows=data.rows;
                var btns_arr=[delbtns,updatebtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "del_hjqk"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/deleteawardpunish',
                                            type:'post',
                                            data:{
                                                jc_id:record.jc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    grid_hjqk.datagrid('reload');
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update_hjqk"){                   //修改
                                    layer.load(2);
                                    var title = record.jc_name+'-获奖情况修改';
                                    require(['text!views/party/lianzhengdangan/hjqkform_update.htm','views/party/lianzhengdangan/hjqkform_update'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['600px', '300px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'update',
                                                            record:record,
                                                            dgrid:grid_hjqk
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
        });
    }
    /*受惩处情况*/
    function ccqkFunc(local,option){
        layoutBtnInit(local,{
            layout:'layout_ccqk',
            other:'other_ccqk',
            func_btn:'func_btn_ccqk',
            other2:'other2_ccqk'
        });
        local.find('[opt=date_ccqk]').datebox();
        var grid_ccqk = local.find('[opt=datagrid_ccqk]');
        grid_ccqk.datagrid({
            url:"party/getawardpunishlist",
            queryParams:{
                mode:'c',
                pr_id:option.queryParams.record.pr_id
            },
            type:'post',
            onLoadSuccess:function(data){
                var updatebtns = local.find('[action=update_ccqk]');           //修改
                var delbtns = local.find('[action=del_ccqk]');           //删除
                var rows=data.rows;
                var btns_arr=[delbtns,updatebtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "del_ccqk"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/deleteawardpunish',
                                            type:'post',
                                            data:{
                                                jc_id:record.jc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    grid_ccqk.datagrid('reload');
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update_ccqk"){                   //修改
                                    layer.load(2);
                                    var title = record.jc_name+'-惩处情况修改';
                                    require(['text!views/party/lianzhengdangan/ccqkform_update.htm','views/party/lianzhengdangan/ccqkform_update'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['600px', '300px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'update',
                                                            record:record,
                                                            dgrid:grid_ccqk
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
        });
    }
    /*拒收或上交情况*/
    function jssjqkFunc(local,option){
        layoutBtnInit(local,{
            layout:'layout_jssjqk',
            other:'other_jssjqk',
            func_btn:'func_btn_jssjqk',
            other2:'other2_jssjqk'
        });
        var grid_jssjqk = local.find('[opt=datagrid_jssjqk]');
        grid_jssjqk.datagrid({
            url:"party/gethandgiftlist",
            type:'post',
            onLoadSuccess:function(data){
                var updatebtns = local.find('[action=update_jssjqk]');           //修改
                var delbtns = local.find('[action=del_jssjqk]');           //删除
                var rows=data.rows;
                var btns_arr=[delbtns,updatebtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "del_jssjqk"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/deletehandgift',
                                            type:'post',
                                            data:{
                                                sj_id:record.sj_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    grid_jssjqk.datagrid('reload');
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update_jssjqk"){                   //修改
                                    layer.load(2);
                                    var title = record.sj_gift+'-干部拒收或上交礼金、礼品情况修改';
                                    require(['text!views/party/lianzhengdangan/jssjqkform_update.htm','views/party/lianzhengdangan/jssjqkform_update'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['600px', '300px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'update',
                                                            record:record,
                                                            dgrid:grid_jssjqk
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
        });
    }
    /*婚姻变化情况*/
    function hyqkFunc(local,option){
        layoutBtnInit(local,{
            layout:'layout_hyqk',
            other:'other_hyqk',
            func_btn:'func_btn_hyqk',
            other2:'other2_hyqk'
        });
        var grid_hyqk = local.find('[opt=datagrid_hyqk]');
        grid_hyqk.datagrid({
            url:"party/getmarriagelist",
            queryParams:{
                hpr_id:option.queryParams.record.pr_id
            },
            type:'post',
            onLoadSuccess:function(data){
                var updatebtns = local.find('[action=update_hyqk]');           //修改
                var delbtns = local.find('[action=del_hyqk]');           //删除
                var rows=data.rows;
                var btns_arr=[delbtns,updatebtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "del_hyqk"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/deletemarriage',
                                            type:'post',
                                            data:{
                                                hy_id:record.hy_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    grid_hyqk.datagrid('reload');
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update_hyqk"){                   //修改
                                    layer.load(2);
                                    var title = record.jc_name+'-婚姻情况修改';
                                    require(['text!views/party/lianzhengdangan/hyqkform.htm','views/party/lianzhengdangan/hyqkform'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['800px', '450px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'update',
                                                            record:option.queryParams.record,
                                                            data:record,
                                                            dgrid:grid_hyqk
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
        });
    }
    /*刑事处分*/
    function xscfFunc(local,option){
        layoutBtnInit(local,{
            layout:'layout_xscf',
            other:'other_sxcf',
            func_btn:'func_btn_xscf',
            other2:'other2_xscf'
        });
        var grid_xscf = local.find('[opt=datagrid_xscf]');
        grid_xscf.datagrid({
            url:"party/getqshpunishlist",
            queryParams:{
                pr_id:option.queryParams.record.pr_id
            },
            type:'post',
            onLoadSuccess:function(data){
                var updatebtns = local.find('[action=update_xscf]');           //修改
                var delbtns = local.find('[action=del_xscf]');           //删除
                var rows=data.rows;
                var btns_arr=[delbtns,updatebtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "del_xscf"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/deleteqshpunish',
                                            type:'post',
                                            data:{
                                                cf_id:record.cf_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    grid_xscf.datagrid('reload');
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update_xscf"){                   //修改
                                    layer.load(2);
                                    var title = record.cf_name+'-刑事处分修改';
                                    require(['text!views/party/lianzhengdangan/xscfform.htm','views/party/lianzhengdangan/xscfform'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['700px', '300px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'update',
                                                            record:record,
                                                            precord:option.queryParams.record,
                                                            dgrid:grid_xscf
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
        });
    }
    function initAddFunc(local,option){
        /*获奖情况增加、查询*/
        local.find('[opt=addbtn_hjqk]').click(function () {
            layer.load(2);
            require(['text!views/party/lianzhengdangan/hjqkform.htm','views/party/lianzhengdangan/hjqkform'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'获奖情况添加',
                        type: 1,
                        area: ['800px', '450px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'add',
                                    record:option.queryParams.record,
                                    dgrid:local.find('[opt=datagrid_hjqk]')
                                }
                            });
                        }
                    });
                }
            )
        });
        /*查询*/
        local.find('[opt=query_hjqk]').click(function () {
            var date_hjqk = local.find('[opt=date_hjqk]').datebox('getValue');
            var name_hjqk = local.find('[opt=name_hjqk]').val();
            console.log('查询')
        });

        /*惩处情况增加、查询*/
        local.find('[opt=addbtn_ccqk]').click(function () {
            layer.load(2);
            require(['text!views/party/lianzhengdangan/ccqkform.htm', 'views/party/lianzhengdangan/ccqkform'],
                function (htmfile, jsfile) {
                    layer.open({
                        title: '惩处情况添加',
                        type: 1,
                        area: ['800px', '450px'], //宽高
                        content: htmfile,
                        success: function (layero, index) {
                            jsfile.render(layero, {
                                index: index,
                                queryParams: {
                                    actiontype: 'add',
                                    record: option.queryParams.record,
                                    dgrid: local.find('[opt=grid_ccqk]')
                                }
                            });
                        }
                    });
                }
            )
        });
        /*查询*/
        local.find('[opt=query_ccqk]').click(function () {
            var date_ccqk = local.find('[opt=date_ccqk]').datebox('getValue');
            var name_ccqk = local.find('[opt=name_ccqk]').val();
            console.log('查询')
        });

        /*拒或上交情况增加、查询*/
        local.find('[opt=addbtn_jssjqk]').click(function () {
            layer.load(2);
            require(['text!views/party/lianzhengdangan/jssjqkform.htm', 'views/party/lianzhengdangan/jssjqkform'],
                function (htmfile, jsfile) {
                    layer.open({
                        title: '拒收或上交情况添加',
                        type: 1,
                        area: ['800px', '450px'], //宽高
                        content: htmfile,
                        success: function (layero, index) {
                            jsfile.render(layero, {
                                index: index,
                                queryParams: {
                                    actiontype: 'add',
                                    record: option.queryParams.record,
                                    dgrid: local.find('[opt=datagrid_jssjqk]')
                                }
                            });
                        }
                    });
                }
            )
        });
        /*查询*/
        local.find('[opt=query_jssjqk]').click(function () {
            var name_jssjqk = local.find('[opt=name_jssjqk]').val();
            console.log('查询')
        });

        /*婚姻变化情况增加、查询*/
        local.find('[opt=addbtn_hyqk]').click(function () {
            layer.load(2);
            require(['text!views/party/lianzhengdangan/hyqkform.htm','views/party/lianzhengdangan/hyqkform'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'婚姻情况添加',
                        type: 1,
                        area: ['800px', '450px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'add',
                                    record:option.queryParams.record,
                                    dgrid:local.find('[opt=datagrid_hyqk]')
                                }
                            });
                        }
                    });
                }
            )
        });
        /*查询*/
        local.find('[opt=query_hyqk]').click(function () {
            var name_jssjqk = local.find('[opt=name_jssjqk]').val();
            console.log('查询')
        });

        /*刑事处分增加、查询*/
        local.find('[opt=addbtn_xscf]').click(function () {
            layer.load(2);
            require(['text!views/party/lianzhengdangan/xscfform.htm','views/party/lianzhengdangan/xscfform'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'刑事处分添加',
                        type: 1,
                        area: ['700px', '300px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'add',
                                    precord:option.queryParams.record,
                                    dgrid:local.find('[opt=datagrid_xscf]')
                                }
                            });
                        }
                    });
                }
            )
        });
        /*查询*/
        local.find('[opt=query_xscf]').click(function () {
            var name_xscf = local.find('[opt=name_xscf]').val();
            local.find('[opt=datagrid_xscf]').datagrid('load',{
                cf_name:name_xscf
            });
        });
    }

    /*住房情况数据加载*/
    var loadZFQKData = function (local,option) {
        layer.load(1);
        $.ajax({
            url:'party/gethousestatus',
            type:'post',
            data:{
                pr_id:option.queryParams.record.pr_id
            },
            success: function (data) {
                //更新当前tab
                var currTab =  local.find('[opt=tabs_child]').tabs('getSelected'); //获得当前tab
                require(['text!views/party/lianzhengdangan/zfqkform.htm','views/party/lianzhengdangan/zfqkform'],
                    function (htmfile,jsfile) {
                        local.find('[opt=tabs_child]').tabs('update', {
                            tab : currTab,
                            options : {
                                content : htmfile
                            }
                        });
                        jsfile.render(currTab,{
                            queryParams:{
                                actiontype:'add',
                                poption:option,
                                datas:data
                            }
                        });
                    }
                )
            }
        });
    }
    /*持股情况数据加载*/
    var loadCGQKData = function (local,option) {
        layer.load(1);
        $.ajax({
            url:'party/getprofitstatus',
            type:'post',
            data:{
                pr_id:option.queryParams.record.pr_id
            },
            success: function (data) {
                //更新当前tab
                var currTab =  local.find('[opt=tabs_child]').tabs('getSelected'); //获得当前tab
                require(['text!views/party/lianzhengdangan/cgqkform.htm','views/party/lianzhengdangan/cgqkform'],
                    function (htmfile,jsfile) {
                        local.find('[opt=tabs_child]').tabs('update', {
                            tab : currTab,
                            options : {
                                content : htmfile
                            }
                        });
                        jsfile.render(currTab,{
                            queryParams:{
                                actiontype:'add',
                                poption:option,
                                datas:data
                            }
                        });
                    }
                )
            }
        });

    }
    /*出国(境)情况数据加载*/
    var loadCGJQKData = function (local,option) {
        layer.load(1);
        $.ajax({
            url:'party/getgoabroad',
            type:'post',
            data:{
                pr_id:option.queryParams.record.pr_id
            },
            success: function (data) {
                //更新当前tab
                var currTab =  local.find('[opt=tabs_child]').tabs('getSelected'); //获得当前tab
                require(['text!views/party/lianzhengdangan/cgjqkform.htm','views/party/lianzhengdangan/cgjqkform'],
                    function (htmfile,jsfile) {
                        local.find('[opt=tabs_child]').tabs('update', {
                            tab : currTab,
                            options : {
                                content : htmfile
                            }
                        });
                        jsfile.render(currTab,{
                            queryParams:{
                                actiontype:'add',
                                poption:option,
                                datas:data
                            }
                        });
                    }
                )
            }
        });

    }

    var render=function(local,option){
        layer.closeAll('loading');
        local.find('[opt=tabs_child]').tabs({tabPosition:'left'});
        initAddFunc(local,option);
        hjqkFunc(local, option);//首先加载获奖情况

        /*tabs选择事件*/
        local.find('[opt=tabs_child]').tabs({
            onSelect: function (title,index) {
                var $title = $(title);
                var sige = $title.attr('opt');
                switch (sige){
                    case 'hjqk':        //获奖情况
                        hjqkFunc(local, option);
                        break;
                    case 'ccqk':        //受惩处情况
                        ccqkFunc(local, option);
                        break;
                    case 'jssjqk':        //拒收或上交情况
                        jssjqkFunc(local, option);
                        break;
                    case 'zfqk':        //住房情况
                        loadZFQKData(local,option);//住房情况数据加载
                        break;
                    case 'cgqk':        //持股情况
                        loadCGQKData(local,option);
                        break;
                    case 'hyqk':        //婚姻变化情况
                        hyqkFunc(local, option);
                        break;
                    case 'cgjqk':         //出国（境）情况
                        loadCGJQKData(local,option);
                        break;
                    case 'xscf':         //亲属受党政纪刑事处分
                        xscfFunc(local, option);
                        break;
                    default :
                        break;
                }
            }
        });
    }
    return {
        render:render
    }

})