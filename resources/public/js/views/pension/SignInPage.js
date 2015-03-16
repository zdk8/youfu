define(function(){
    function render(local){
        /*var date1=new Date("2015/03/2 15:18:00");  //开始时间
        var date2=new Date();    //结束时间
        var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数

        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000))

        //计算出小时数
        var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000))
        //计算相差分钟数
        var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000))


        //计算相差秒数
        var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000)

        alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")

        if(days >= 2){
            if(hours+minutes+seconds > 0){
                alert("未签到")
            }
        }*/
        var signpp = local.find('[opt=signpp]');
        var refreshGrid = function(){
            signpp.datagrid("reload")
        }

        signpp.datagrid({
            url:'depart/getopdsigin',
            type:'post',
            queryParams:{
                dep_id:''
            },
            onLoadSuccess:function(data){
                var signbtn = local.find("[action=sign]");           //签到
                var viewbtn = local.find("[action=view]")
                var signcanclebtn = local.find("[action=signcancle]");     //签到取消
                var rows=data.rows;
                var btns_arr=[signbtn,viewbtn,signcanclebtn];
                signbtn.hide();
                signbtn.attr('hiden',true)
                signcanclebtn.hide();
                for(var i=0;i<rows.length;i++) {
                    for (var j = 0; j < btns_arr.length; j++) {
                        if(rows[i].signdate != null){
                            if($(btns_arr[j][i]).attr("action") == "signcancle"){
                                $(btns_arr[j][i]).show();
                            }
                        }else{
                            if($(btns_arr[j][i]).attr("action") == "sign"){
                                $(btns_arr[j][i]).show();
                            }
                        }
                        (function (index) {
                            var record = rows[index];
                            $(btns_arr[j][i]).click(function () {
                                var action = $(this).attr("action");
                                if (action == "view") {
                                    var title = "【" + record.name + '】详细信息';
                                    if ($("#tabs").tabs('getTab', title)) {
                                        $("#tabs").tabs('select', title)
                                    } else {
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title: title,
                                            htmfile: 'text!views/pension/RuZhuRYDlg.htm',
                                            jsfile: 'views/pension/RuZhuRYDlg',
                                            queryParams: {
                                                actiontype: 'view',         //（处理）操作方式
                                                record: record,
                                                title: title,
                                                refresh: refreshGrid                //刷新
                                            }
                                        })
                                    }
                                }else if (action == "sign") {
                                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                    $.ajax({
                                        url:'depart/opdsign',
                                        type:'post',
                                        data:{
                                            opd_id:record.opd_id
                                        },
                                        success:function(data){
                                            if(data == "success"){
                                                showProcess(false);
                                                if(showProcess(false)){
                                                    cj.slideShow('签到成功');
                                                    refreshGrid();
                                                }
                                            }else{
                                                showProcess(false);
                                                if(showProcess(false)){
                                                    cj.slideShow('<label style="color:red">签到失败</label>');
                                                    refreshGrid();
                                                }
                                            }
                                        },
                                        error:function(a,b,c){
                                            showProcess(false);
                                            cj.slideShow('<label style="color:red">服务器错误</label>');
                                        }
                                    })
                                }else if (action == "signcancle") {
                                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                    $.ajax({
                                        url:'depart/opddesigncancle',
                                        type:'post',
                                        data:{
                                            os_id:record.os_id
                                        },
                                        success:function(data){
                                            if(data == "success"){
                                                showProcess(false);
                                                if(showProcess(false)){
                                                    cj.slideShow('取消签到');
                                                    refreshGrid();
                                                }
                                            }else{
                                                showProcess(false);
                                                if(showProcess(false)){
                                                    cj.slideShow('<label style="color:red">取消失败</label>');
                                                    refreshGrid();
                                                }
                                            }
                                        },
                                        error:function(a,b,c){
                                            showProcess(false);
                                            cj.slideShow('<label style="color:red">服务器错误</label>');
                                        }
                                    })
                                }
                            });
                        })(i)
                    }
                }
            },
            rowStyler:function(index,row){
                if (row.warn == "1"){  //预警
                    return 'color:red;';
                }else if(row.signdate == null){  //未签到
                    //return 'color:#1c22ff;';
                }else{              //正常
                    return 'color:#1c22ff;';
                }
            },
            toolbar:local.find('div[tb]')
        })

        local.find('[opt=refresh]').click(function(){
            signpp.datagrid('load',{
                name:local.find('[opt=name]').val(),
                identityid:local.find('[opt=identityid]').val()
            });
        })
        /*批量签到*/
        local.find('[opt=signbtn]').click(function () {
            var opdidarr = new Array();
            var rows = signpp.datagrid('getSelections');
            if (rows){
                for(var i=0; i<rows.length; i++){
                    var row = rows[i];
                    if(!row.signdate){
                        opdidarr.push(row.opd_id)
                    }
                }
                if(opdidarr.length > 0){
                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    $.ajax({
                        url:'depart/opdselectsign',
                        type:'post',
                        data:{
                            os_id:opdidarr
                        },
                        success:function(data){
                            if(data == "success"){
                                showProcess(false);
                                if(showProcess(false)){
                                    cj.slideShow('签到完成');
                                    refreshGrid();
                                }
                            }else{
                                showProcess(false);
                                if(showProcess(false)){
                                    cj.slideShow('<label style="color:red">签到失败</label>');
                                    refreshGrid();
                                }
                            }
                        },
                        error:function(a,b,c){
                            showProcess(false);
                            cj.slideShow('<label style="color:red">服务器错误</label>');
                        }
                    })
                }
            }
        })
        /*一键签到*/
        local.find('[opt=signallbtn]').click(function () {
            $.messager.confirm('温馨提示', '确定要全部签到么?', function(r){
                if (r){
                    showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                    $.ajax({
                        url:'depart/opddesignall',
                        type:'post',
                        data:{
                            dep_id:90
                        },
                        success:function(data){
                            if(data == "success"){
                                showProcess(false);
                                if(showProcess(false)){
                                    cj.slideShow('签到完成');
                                    refreshGrid();
                                }
                            }else{
                                showProcess(false);
                                if(showProcess(false)){
                                    cj.slideShow('<label style="color:red">签到失败</label>');
                                    refreshGrid();
                                }
                            }
                        },
                        error:function(a,b,c){
                            showProcess(false);
                            cj.slideShow('<label style="color:red">服务器错误</label>');
                        }
                    })
                }
            });
        })
        /*导出xls*/
        local.find('[opt=exportexcel]').click(function(){
            var closobj = signpp.datagrid('options').columns[0];
            var colsfieldarr = new Array();     //列头字段
            var colstxtarr = new Array();       //列头文本
            for(var o=0;o<closobj.length;o++){
                if(closobj[o].field != "ro" && closobj[o].field != "warn" &&
                    closobj[o].field != "signdate" && closobj[o].field != "ck"){
                    if(!closobj[o].hidden){
                        colsfieldarr.push(closobj[o].field);
                        colstxtarr.push(closobj[o].title);
                    }
                }
            }
            layer.load(1);
            window.location.href="report-xls-auto?colstxt="+colstxtarr+"&colsfield="+colsfieldarr+
            "&datatype=jigou"+
            "&departname="+""+
            "&identityid="+local.find('[opt=identityid]').val()+
            "&name="+""+
            "&title=入住人员"+
            "&implfunc=rzry";
        });
    }

    return {
        render:render
    }
})