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
                var signbtn = local.find('[action=sign]');           //签到
                var viewbtn = local.find("[action=view]")
                var rows=data.rows;
                var btns_arr=[signbtn,viewbtn];
                for(var i=0;i<rows.length;i++) {
                    for (var j = 0; j < btns_arr.length; j++) {
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
                                } else if (action == "sign") {
                                    $.ajax({
                                        url:'ddd',
                                        type:'post',
                                        data:{
                                            opd_id:record.opd_id
                                        },
                                        success:function(data){
                                            if(data == "success"){
                                                cj.slideShow('签到成功');
                                            }
                                            console.log(data)
                                        }
                                    })
                                    console.log(record.opd_id)
                                }
                            });
                        })(i)
                    }
                }
            },
            rowStyler:function(index,row){
                if (row.signdate == null){
                    return 'background-color:pink;color:blue;font-weight:bold;';
                }
            },
            toolbar:local.find('div[tb]')
        })

        local.find('[opt=signbtn]').click(function () {
            var opdidarr = new Array();
            var rows = signpp.datagrid('getSelections');
            if (rows){
                for(var i=0; i<rows.length; i++){
                    var row = rows[i];
                    if(!row.singdata){
                        opdidarr.push(row.opd_id)
                    }
                }
                console.log(opdidarr)
            }
        })
    }

    return {
        render:render
    }
})