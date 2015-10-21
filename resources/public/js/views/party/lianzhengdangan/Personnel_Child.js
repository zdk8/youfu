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
    /*住房情况*/
    function zfqkFunc(local,option){
        var field1 = ['xy_address','xy_area','xy_property','xy_source','xy_owner'];//本人、配偶及共同生活的子女现有住房情况
        var field2 = ['sf_address','sf_area','sf_property','sf_selltime','sf_money'];//房屋出售情况
        var field3 = ['cz_address','cz_area','cz_property','cz_deadline','cz_annualrent'];//房屋出租情况
        var field4 = ['jz_address','jz_area','jz_unit','jz_totalamount','jz_payment'];//参加集资建房情况
        local.find('[opt=sf_selltime]').datebox();
        /*保存*/
        local.find('[opt=save_zfqk]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            var zfqk_v1 = cj.commonGetValue(local,{field:field1});
            var zfqk_v2 = cj.commonGetValue(local,{field:field2});
            var zfqk_v3 = cj.commonGetValue(local,{field:field3});
            var zfqk_v4 = cj.commonGetValue(local,{field:field4});
            local.find('[opt=form_zfqk]').form('submit', {
                url: 'wwww',
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if (isValid) {
                        layer.load();
                        params.zfqk_v1 = JSON.stringify(zfqk_v1);
                        params.zfqk_v2 = JSON.stringify(zfqk_v2);
                        params.zfqk_v3 = JSON.stringify(zfqk_v3);
                        params.zfqk_v4 = JSON.stringify(zfqk_v4);
                    }else{
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
                        layer.closeAll('loading');
                        cj.showSuccess('保存成功');
                        //option.queryParams.refresh();
                        //layer.close(option.index);
                    } else {
                        layer.closeAll('loading');
                        cj.showFail('保存失败');
                    }
                }
            })
        })
    }
    /*持股情况*/
    function cgqkFunc(local,option){
        var field1 = ['qy_name','qy_businessscope','qy_registercapital','qy_address','qy_legalperson','qy_contact'];//干部经商办企业情况
        var field2 = ['relationship'];//主要社会关系经商办企业情况
        var field3 = ['jz_departname','jz_property','jz_position','jz_docnumber','jz_yearreward'];//在企事业单位、社会团 体或其他营利性组织中兼职情况
        var field4 = ['rg_departname','rg_property','rg_way','rg_money','rg_yearincome'];//干部投资或入股情况
        /*保存*/
        local.find('[opt=save_cgqk]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            var zfqk_v1 = cj.commonGetValue(local,{field:field1});
            var zfqk_v2 = cj.commonGetValue(local,{field:field2});
            var zfqk_v3 = cj.commonGetValue(local,{field:field3});
            var zfqk_v4 = cj.commonGetValue(local,{field:field4});
            local.find('[opt=form_cgqk]').form('submit', {
                url: 'wwww1',
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if (isValid) {
                        layer.load();
                        params.zfqk_v1 = JSON.stringify(zfqk_v1);
                        params.zfqk_v2 = JSON.stringify(zfqk_v2);
                        params.zfqk_v3 = JSON.stringify(zfqk_v3);
                        params.zfqk_v4 = JSON.stringify(zfqk_v4);
                    }else{
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
                        layer.closeAll('loading');
                        cj.showSuccess('保存成功');
                        //option.queryParams.refresh();
                        //layer.close(option.index);
                    } else {
                        layer.closeAll('loading');
                        cj.showFail('保存失败');
                    }
                }
            })
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
    /*出国(境)情况*/
    function cgjqkFunc(local,option){
        var field1 = ['zj_name','zj_number','zj_issuedepart','zj_effectdate','zj_Invaliddate'];//本人持有因私出国(境)证件情况
        var field2 = ['hd_name','hd_rounddate','hd_roundaddress','hd_reason','hd_channel','hd_fundsource'];//本人及其配偶因私出国(境)和在国(境)外活动情况
        var field3 = ['lx_name','lx_appellation','lx_time','lx_place','lx_yeartuition','lx_fundsource'];//配偶、子女及其配偶出国(境)留学情况
        var field4 = ['th_name','th_department','th_position','th_spouse','th_nationality','th_registertime'];//子女与外国人、港澳台居民通婚情况
        var field5 = ['dj_name','dj_appellation','dj_time','dj_place','dj_work'];//配偶、子女及其配偶出国(境)定居情况
        local.find('[opt=zj_effectdate]').datebox();
        local.find('[opt=zj_Invaliddate]').datebox();
        local.find('[opt=hd_rounddate]').datebox();
        local.find('[opt=lx_time]').datebox();
        local.find('[opt=th_registertime]').datebox();
        local.find('[opt=dj_time]').datebox();
        /*保存*/
        local.find('[opt=save_cgjqk]').click(function () {
            var $this = $(this);
            $this.attr("disabled",true);//按钮禁用
            var zfqk_v1 = cj.commonGetValue(local,{field:field1});
            var zfqk_v2 = cj.commonGetValue(local,{field:field2});
            var zfqk_v3 = cj.commonGetValue(local,{field:field3});
            var zfqk_v4 = cj.commonGetValue(local,{field:field4});
            var zfqk_v5 = cj.commonGetValue(local,{field:field5});
            local.find('[opt=form_cgjqk]').form('submit', {
                url: 'wwww1',
                onSubmit: function (params) {
                    var isValid = $(this).form('validate');
                    if (isValid) {
                        layer.load();
                        params.zfqk_v1 = JSON.stringify(zfqk_v1);
                        params.zfqk_v2 = JSON.stringify(zfqk_v2);
                        params.zfqk_v3 = JSON.stringify(zfqk_v3);
                        params.zfqk_v4 = JSON.stringify(zfqk_v4);
                        params.zfqk_v5 = JSON.stringify(zfqk_v5);
                    }else{
                        layer.closeAll('loading');
                    }
                    return isValid;
                },
                success: function (data) {
                    $this.attr("disabled",false);//按钮启用
                    if (data == "true") {
                        layer.closeAll('loading');
                        cj.showSuccess('保存成功');
                        //option.queryParams.refresh();
                        //layer.close(option.index);
                    } else {
                        layer.closeAll('loading');
                        cj.showFail('保存失败');
                    }
                }
            })
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
    /*刑事处分数据加载*/
    var loadXSCFData = function (local,option) {
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
                require(['text!views/party/lianzhengdangan/xscfform.htm','views/party/lianzhengdangan/xscfform'],
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

        /*local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - 35);
            }
        });

        local.find('[opt=cancel]').click(function(){
            layer.close(option.index);
        });
*/
        /*cj.common_listFunc(local);//表单动态增减行
        var record = option.queryParams.record;
        local.find('[name=name]').val(record.name);
        local.find('[name=workunit]').val(record.workunit);
        local.find('[name=incumbent]').val(record.incumbent);*/

        initAddFunc(local,option);
        hjqkFunc(local, option);//首先加载获奖情况

        //zfqkFunc(local, option);//住房情况
        //cgqkFunc(local, option);//持股情况
        //cgjqkFunc(local, option);//出国情况
        //xscfFunc(local, option);//亲属受党政纪刑事处分

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
                        //zfqkFunc(local, option);
                        loadZFQKData(local,option);//住房情况数据加载
                        break;
                    case 'cgqk':        //持股情况
                        //cgqkFunc(local, option);
                        loadCGQKData(local,option);
                        break;
                    case 'hyqk':        //婚姻变化情况
                        hyqkFunc(local, option);
                        break;
                    case 'cgjqk':         //出国（境）情况
                        //cgjqkFunc(local, option);
                        loadCGJQKData(local,option);
                        break;
                    case 'xscf':         //亲属受党政纪刑事处分
                        xscfFunc(local, option);
                        //loadXSCFData(local,option);
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