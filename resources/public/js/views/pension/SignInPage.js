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
                signcanclebtn.hide();
                for(var i=0;i<rows.length;i++) {
                    for (var j = 0; j < btns_arr.length; j++) {
                        if(rows[i].signdate != null){
                            console.log(rows[i].signdate)
                            //signcanclebtn.show();
                            $(btns_arr[j][i]).show();
                            var action = $(this).attr("action");
                            console.log(action)
                            //signbtn.hide();
                        }else{
                            //signcanclebtn.hide();
                        }
                        (function (index) {
                            var record = rows[index];
                            $(btns_arr[j][i]).click(function () {
                                var action = $(this).attr("action");
                                if (action == "view") {
                                    console.log(record.opd_id)
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
                                    console.log(index)
                                    console.log(record.opd_id)
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
                                                    //signpp.datagrid("refreshRow",1)
                                                    refreshGrid();
                                                }
                                            }else{
                                                showProcess(false);
                                                if(showProcess(false)){
                                                    cj.slideShow('<label style="color:red">签到失败</label>');
                                                    //refreshGrid();
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
            /*onAfterEdit:function(index,row){
                row.editing = false;
                signpp.datagrid('refreshRow', index);
            },*/
            rowStyler:function(index,row){
                if (row.signdate == null){
                    return 'background-color:pink;color:blue;font-weight:bold;';
                }
            },
            toolbar:local.find('div[tb]')
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
                console.log(opdidarr)
            }
        })
    }

    return {
        render:render
    }
})