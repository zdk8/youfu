define(function(){
    var render = function(local,posion){

        var minguanyewufenxi_all = local.find('table[opt=minguanyewufenxi_all]');           //datagrid_all
        var minguanyewufenxi_st = local.find('table[opt=minguanyewufenxi_st]');           //datagrid_st
//        var minguanyewufenxi_st_all = local.find('table[opt=minguanyewufenxi_st_all]');           //datagrid_st_all
        var minguanbilltype = local.find("[opt=minguanbilltype]");           //业务类型
        var minguanfenxi = local.find("[opt=minguanfenxi]");                  //分析条件
        var dateway = local.find('[opt=dateway]');                          //时间方式
        var shijian = local.find('[opt=shijian]');
        var shijian1 = local.find('[opt=shijian1]');
        var shijian2 = local.find('[opt=shijian2]');
        minguanbilltype.combobox({
            onChange:function(newValue, oldValue){
                var options = minguanfenxi.combobox("options")
                if(newValue == "all"){
                    minguanyewufenxi_st.parents("span").hide()
//                    minguanyewufenxi_st_all.parents("span").hide()
                    minguanyewufenxi_all.parents("span").show()
                    local.find("[opt=tongji]").unbind()
                    tongjibtn(local,minguanyewufenxi_all,"all",minguanbilltype,minguanfenxi);    //按条件查询(all)
                    minguanfenxi.combobox({disabled:true})
                    dateway.combobox({disabled:true})
                    local.find("[opt=tongji]").trigger('click');
                }else if(newValue == "st"){
                    minguanfenxi.combobox("setValue","all")
                    if(minguanfenxi.combobox("getValue") == "all"){
                        minguanyewufenxi_st.datagrid("hideColumn","enum_name")
                        minguanyewufenxi_st.datagrid("hideColumn","total")
                        minguanyewufenxi_st.datagrid("showColumn","tname")
                        minguanyewufenxi_st.datagrid("showColumn","tsum")
                        minguanyewufenxi_st.datagrid('fixColumnSize');
                    }
                    minguanyewufenxi_all.parents("span").hide()
                    minguanyewufenxi_st.parents("span").show()
                    options.loader = cj.getLoader('minguanstfenxi');
                    minguanfenxi.combobox({disabled:false});
                    dateway.combobox({disabled:false})
                    local.find("[opt=tongji]").unbind()
                    tongjibtn(local,minguanyewufenxi_st,"",minguanbilltype,minguanfenxi);    //按条件查询(st)
                    local.find("[opt=tongji]").trigger('click');
                }else if(newValue == "mf"){
                    minguanfenxi.combobox("setValue","all")
                    if(minguanfenxi.combobox("getValue") == "all"){
                        minguanyewufenxi_st.datagrid("hideColumn","enum_name")
                        minguanyewufenxi_st.datagrid("hideColumn","total")
                        minguanyewufenxi_st.datagrid("showColumn","tname")
                        minguanyewufenxi_st.datagrid("showColumn","tsum")
                        minguanyewufenxi_st.datagrid('fixColumnSize');
                    }
                    minguanyewufenxi_all.parents("span").hide()
                    minguanyewufenxi_st.parents("span").show()
                    options.loader = cj.getLoader('minguanmffenxi');
                    minguanfenxi.combobox({disabled:false});
                    dateway.combobox({disabled:false})
                    local.find("[opt=tongji]").unbind()
                    tongjibtn(local,minguanyewufenxi_st,"",minguanbilltype,minguanfenxi);    //按条件查询(mf)
                    local.find("[opt=tongji]").trigger('click');
                }
            }
        })
        minguanfenxi.combobox({
            onChange:function(newValue, oldValue){
                if(newValue == "lb" || newValue == "dj"){
                    dateway.combobox({disabled:true})
                    minguanyewufenxi_st.datagrid("hideColumn","tname")
                    minguanyewufenxi_st.datagrid("hideColumn","tsum")
                    minguanyewufenxi_st.datagrid("showColumn","enum_name")
                    minguanyewufenxi_st.datagrid("showColumn","total")
                    minguanyewufenxi_st.datagrid('fixColumnSize');
                    local.find("[opt=tongji]").trigger('click');
                }else{
                    dateway.combobox({disabled:false})
                    minguanyewufenxi_st.datagrid("hideColumn","enum_name")
                    minguanyewufenxi_st.datagrid("hideColumn","total")
                    minguanyewufenxi_st.datagrid("showColumn","tname")
                    minguanyewufenxi_st.datagrid("showColumn","tsum")
                    minguanyewufenxi_st.datagrid('fixColumnSize');
                    local.find("[opt=tongji]").trigger('click');
                }
            }
        })

        getdateway(local);      //时间方式
        tongjibtn(local,minguanyewufenxi_all,"all",minguanbilltype,minguanfenxi);    //按条件查询
        window.setTimeout(function(){
            local.find("[opt=tongji]").trigger('click');
        },1000)


    }


    /*时间格式化*/
    var formatter = function(date,type){
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        if(type != ""){
            if(type == "Y"){
                return y+'';
            }else if(type == "YM"){
                return y+'-'+(m<10?('0'+m):m);
            }
        }else{
            return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
        }
    }
    /*时间方式*/
    var getdateway = function(local){
        var dateway = local.find('[opt=dateway]'); //时间方式
        var dateall1 = local.find('[opt=dateall1]')
        var dateall2 = local.find('[opt=dateall2]')
        dateway.combobox({
            onChange:function(newValue, oldValue){
                var shijian = local.find('[opt=shijian]');
                var shijian1 = local.find('[opt=shijian1]');
                var shijian2 = local.find('[opt=shijian2]');

                if(newValue == "yyyy"){               //按年份
                    dateall1.show();
                    dateall2.hide()
                    shijian.datebox('setValue',null);
                    shijian1.datebox('setValue',null);
                    shijian2.datebox('setValue',null);
                    shijian.datebox({disabled:true})
                }else if(newValue == "md"){         //按具体月份统计
                    dateall1.show();
                    dateall2.hide();
                    shijian1.datebox('setValue',null);
                    shijian2.datebox('setValue',null);
                    shijian.datebox({disabled:false})
                    shijian.datebox({
                        onSelect: function(date){
                            shijian.datebox('setValue',formatter(date,"YM"));
                        }
                    });
                    shijian.datebox('setValue',formatter(new Date(),"YM"));
                }else if(newValue == "dd"){        //按时间段统计
                    dateall1.hide();
                    dateall2.show();
                    shijian.datebox('setValue',null);
                    shijian2.datebox('setValue',formatter(new Date(),""));
                }else{
                    dateall1.show();
                    dateall2.hide();
                    shijian1.datebox('setValue',null);
                    shijian2.datebox('setValue',null);
                    shijian.datebox({disabled:false})
                    shijian.datebox({
                        onSelect: function(date){
                            shijian.datebox('setValue',formatter(date,"Y"));
                        }
                    });
                    shijian.datebox('setValue',formatter(new Date(),"Y"));
                }
            }
        })
    }

    /*统计*/
    var tongjibtn = function(local,minguanyewufenxi,all,minguanbilltype,minguanfenxi){
        var tongji = local.find("[opt=tongji]");
        tongji.bind("click",function(){
            loaddate(local,minguanyewufenxi,all,minguanbilltype,minguanfenxi);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,minguanyewufenxi,all,minguanbilltype,minguanfenxi){
        var dateway = local.find('[opt=dateway]');                          //时间方式
        var shijian = local.find('[opt=shijian]');
        var shijian1 = local.find('[opt=shijian1]');
        var shijian2 = local.find('[opt=shijian2]');
        minguanyewufenxi.datagrid({
            url:preFixUrl+'jcfxs/zsmg',
            queryParams:{
                ywtype: minguanbilltype.combobox("getValue"),
                fxcond:minguanfenxi.combobox("getValue"),
                timefun:dateway.combobox("getValue"),
                timetype:shijian.datebox("getValue"),
                starttime:shijian1.datebox("getValue"),
                endtime:shijian2.datebox("getValue")
            },
            onLoadSuccess:function(data){
                if(all == "all"){
                    var st_nums = 0;         //社团总数
                    var mfb_nums = 0;        //民非办总数
                    var jjh_nums = 0;      //基金会总数
                    for(var i in data["rows"]){
                        st_nums += data["rows"][i]["st"];
                        mfb_nums += data["rows"][i]["mf"];
                        jjh_nums += data["rows"][i]["jjh"];
                    }
                    minguanyewufenxi.datagrid('appendRow',{
                        enum_name: '全市',
                        st: st_nums,
                        mf: mfb_nums,
                        jjh:jjh_nums
                    });
                    var seriesdata = [['社团',st_nums],
                        ['民非办',mfb_nums],
                        ['基金会',jjh_nums]]
                    renderAchart(local,seriesdata);    //加载图形
                }else{
                    var obj=format(data["rows"]);
                    var serarray = new Array();
                    for(i=0;i<obj.data[0]["dvalue"].length;i++){
                        var o=[];
                        o.push(obj.data[1]["dvalue"][i],obj.data[0]["dvalue"][i]);
                        serarray.push(o)
                    }
                    renderAchart(local,serarray);    //加载图形
                }
            },
            onClickRow:function(rowIndex, rowData){
                if(all == "all"){
                    var seriesrowdata = [['社团',rowData["st"]],
                        ['民非办',rowData["mf"]],
                        ['基金会',rowData["jjh"]]]
                    renderAchart(local,seriesrowdata);          //加载图形
                }
            },
            onDblClickRow:function(rowIndex, rowData){
                require(['commonfuncs/popwin/win','text!views/jcfx/MinGuanYeWuFenXiDlg.htm','views/jcfx/MinGuanYeWuFenXiDlg'],
                    function(win,htmfile,jsfile){
                        var obj = new Object();
                        obj = rowData;
                        win.render({
                            title:'详细信息',
                            width:724,
                            height:425,
                            html:htmfile,
                            renderHtml:function(local,submitbtn,parent){
                                jsfile.render(local,{
                                    submitbtn:submitbtn,
                                    parent:parent,
                                    thead:obj,
                                    ywtype:minguanbilltype.combotree("getValue"),    //业务类型
                                    districtid:rowData["districtid"],               //区划代码
                                    fxcond:minguanfenxi.combotree("getValue"),
                                    tablevalue:rowData["enum_name"],
                                    onCreateSuccess:function(data){
                                        parent.trigger('close');
                                    }
                                })
                            }
                        })
                    })
            }
        })
    }

    /*将x、y轴分别装入数组*/
    var existInArray=function(a,p){
        for(var i in a){
            if(a[i]['dname']==p){
                return a[i];
            }
        }
        return false;
    }
    var format=function(d){
        var data=[];
        for(var i in d){
            for(var p in d[i]){
                var obj=existInArray(data,p);
                if(!obj){
                    data.push({dname:p,dvalue:[d[i][p]]})
                }else{
                    obj.dvalue.push(d[i][p])
                }
            }
        }
        return {
            data:data
        }
    }
    /*初始化统计图*/
    function renderAchart(local,series){
        /*饼*/
        local.find('[opt=containerPie]').highcharts({
            chart: {
                type: "pie"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            navigation: {
                buttonOptions: {
                    align: 'left'
                }
            },
            credits:{       //右下角图标
                enabled:false
            },
            title: {
                text: ""
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            series :[{
                data:series
            }]
        });
    }

    return {
        render:render
    }
})