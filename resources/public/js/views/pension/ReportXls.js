define(function(){
    function render(local,option){
        yearAndMonthsInit(local);
        var tabchange = local.find('[opt=tabchange]');
        var reportsummary = local.find('[opt=reportsummary]'); //汇总表
        var reportmonths = local.find('[opt=reportmonths]'); //月份表
        var month_span = local.find('[opt=month_span]'); //月份条件
        tabchange.change(function(){
            if(tabchange.val() == "0"){         //汇总表
                month_span.hide();
                reportmonths.hide();
                reportsummary.show();
            }else if(tabchange.val() == "1"){   //月份表
                month_span.show();
                reportmonths.show();
                reportsummary.hide();
            }
        });
        var date = new Date();
        /*年*/
        var yearvalue = local.find('[opt=yearvalue]');
        var monthvaluenum = local.find('[opt=monthvaluenum]');
        var monthvalue = local.find('[opt=monthvalue]');
        var reportmonthstab = local.find("[opt=reportmonthstab]");
        var reportsummarytab = local.find("[opt=reportsummarytab]");
        reportmonthstab.datagrid({
            url:'audit/getmoneyreport',
            queryParams:{
                months:"",
                nums:"",
                year:yearvalue.val()
            },
            columns: [[
                { title: '被服务对象',colspan:3},
                { title: '服务人员',colspan:3},
                { field: 'economy1',title: '服务等级', rowspan:2,width: 90},
                { field: 'economy',title: '人员类型', rowspan:2,width: 90},
                { field: 'servicetime',title: '服务<br>时间', rowspan:2,width: 50},
                { field: 'subsidy_money',title: '住院补助', rowspan:2,width: 90},
                { field: 'address1',title: '补助金额', rowspan:2,width: 90}
            ],[
                { field: 'name',title: '姓名', width: 70 },
                { field: 'identityid',title: '身份证号', width: 170 },
                { field: 'address',title: '家庭地址', width: 200 },
                { field: 'servicername',title: '姓名', width: 70 },
                { field: 'servicephone',title: '身份证号', width: 170 },
                { field: 'serviceaddress',title: '家庭地址', width: 200 }
            ]],
            onLoadSuccess:function(data){
            }
        });
        reportsummarytab.datagrid({
            url:'audit/getyearmoneyreport',
            queryParams:{
                year:date.getFullYear()
            },
            onLoadSuccess:function(data){
            }
        });

        /*查询*/
        local.find('[opt=query]').click(function () {
            if(tabchange.val() == "0"){         //汇总表
                reportsummarytab.datagrid("reload",{
                    year:yearvalue.val()
                })
            }else if(tabchange.val() == "1"){   //月份表
                reportmonthstab.datagrid("reload",{
                    months:monthvalue.val(),
                    nums:monthvaluenum.val(),
                    year:yearvalue.val()
                })
            }

        })
        /*导出报表*/
        local.find('[opt=exportexcel]').click(function(){
            if(tabchange.val() == "0"){         //汇总表
                window.location.href="report-xls-summary?year="+yearvalue.val();
            }else if(tabchange.val() == "1"){   //月份表
                window.location.href="report-xls-months?year="+yearvalue.val()+
                    "&months="+monthvalue.val()+
                    "&nums="+monthvaluenum.val();
            }
        })
    }

    /*年月初始化*/
    function yearAndMonthsInit(local){
        var reportmonthstab = local.find("[opt=reportmonthstab]");
        var month = ['','一','二','三','四','五','六','七','八','九','十','十一','十二']
        var monthnum = ['','01','02','03','04','05','06','07','08','09','10','11','12']
        var month1 = local.find('[opt=month1]');
        var month2 = local.find('[opt=month2]');
        var monthvalue = local.find('[opt=monthvalue]');
        var monthvaluenum = local.find('[opt=monthvaluenum]');
        var isfirst = true
        /*月份改变事件*/
        month1.change(function(){
            month2[0].length = 1; //清空选择月份2
            if(month1.val() != "none"){
                /*month2从几月开始*/
                for(var i=parseInt(month1.val());i<=12;i++){
                    month2.append('<option value="'+i+'">'+month[i]+'</option>')
                }
            }else{
                month2[0].length = 1;
            }
        })
        month2.change(function(){
            var poorval = parseInt(month2.val())-parseInt(month1.val())
            var str = new Array();
            var strnum = new Array();
            var strmonth = new Array();         //table表头的动态变换
            strmonth.push({ title: '被服务对象',colspan:3})
            strmonth.push({ title: '服务人员',colspan:3})
            for(var i=0;i<=poorval;i++){
                str.push(month[parseInt(month1.val())+i])
                strnum.push(monthnum[parseInt(month1.val())+i])
                strmonth.push({ field: month[parseInt(month1.val())+i],title: month[parseInt(month1.val())+i]+'月', rowspan:2,width: 60})
            }
            monthvalue.val(str.toString());
            monthvaluenum.val(strnum.toString());
            strmonth.push({ field: 'economy1',title: '服务等级', rowspan:2,width: 90})
            strmonth.push({ field: 'economy',title: '人员类型', rowspan:2,width: 90})
            strmonth.push({ field: 'servicetime',title: '服务<br>时间', rowspan:2,width: 50})
            strmonth.push({ field: 'subsidy_money',title: '住院补助', rowspan:2,width: 90})

            reportmonthstab.datagrid({
                url:'audit/getmoneyreport',
                queryParams:{
                    months:monthvalue.val(),
                    nums:monthvaluenum.val(),
                    year:yearvalue.val()
                },
                columns: [strmonth,[
                    { field: 'name',title: '姓名', width: 70 },
                    { field: 'identityid',title: '身份证号', width: 170 },
                    { field: 'address',title: '家庭地址', width: 200 },
                    { field: 'servicername',title: '姓名', width: 70 },
                    { field: 'servicephone',title: '身份证号', width: 170 },
                    { field: 'serviceaddress',title: '家庭地址', width: 200 }
                ]],
                onLoadSuccess:function(data){
                    //console.log(data)
                }
            });
        })
        /*年*/
        var yearvalue = local.find("[opt=yearvalue]");
        yearvalue.val(new Date().getFullYear());
        local.find('[opt=yeardel]').click(function () {
            var year=yearvalue.val();
            year=Number(year)-1;
            yearvalue.val(year);
        });
        local.find('[opt=yearadd]').click(function(){
            var year=yearvalue.val();
            year=Number(year)+1;
            yearvalue.val(year);
        });
    }


    return {
        render:render
    }

})