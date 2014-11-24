/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        initbusinessgrid:function(type,businesstype,columns,customparamfunc){
            $('#businessgrid').datagrid(
                {
                    singleSelect: true,
                    collapsible: true,
                    rownumbers: true,
                    method:'post',
                    columns:columns,
                    remoteSort: false,
                    sortName:'time',
                    sortOrder:'desc',
                    fit:true,
                    toolbar:'#businesstb',
                    pagination:true,
                    pageSize:10,
                    rowStyler:function(index,row){
                        var processstatus=row['processstatus'];
                        var vprocessstatustype=row['processstatustype'];
                        var rowclass='';
                        switch (processstatus){
                            case  processdiction.stepzero:rowclass='color: #33CC33;';break;
                            case  processdiction.stepone:rowclass='color: darkgreen;';break;
                            case  processdiction.steptwo:rowclass='color: #CC0000;';break;
                            case  processdiction.stepthree:
                                rowclass='color: #000099;';
                                if(vprocessstatustype==processstatustype.change){
                                    rowclass='color: #aa0099; ';
                                }else if(vprocessstatustype==processstatustype.logout){
                                    rowclass='color: #FF9900; ';
                                }
                                break;
                            case  processdiction.stepback:rowclass='';break;
                        }

                        return rowclass;
                        /*if (row.processstatus===processdiction.stepthree){
                            if(row.processstatustype===processstatustype.logout){
                                return 'color:red;font-weight:bold;';
                            }
                            return 'color:green;font-weight:bold;';
                        }else if(row.processstatus===processdiction.steptwo){
                            return 'color:blue;font-weight:bold;';
                        }else if(row.processstatus===processdiction.stepone){
                            return 'color:gray;font-weight:bold;';
                        }else{
                            return 'color:pink;font-weight:bold;';
                        }*/
                    },
                    onBeforeLoad: function (params) {
                        var options = $('#businessgrid').datagrid('options');
                        params.businesstype = businesstype;
                        params.type=type;
                        params.divisionpath = divisionpath;
                        params.start = (options.pageNumber - 1) * options.pageSize;
                        params.limit = options.pageSize;
                        params.totalname = "total";
                        params.rowsname = "rows";
                        params.roleid = roleid;
                        params.userid = userid;
                        if(customparamfunc){
                            customparamfunc(params);
                        }

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=$('#tabs .viewbtn');
                        var alterbtns=$('#tabs .alterbtn');
                        var processbtns=$('#tabs .processbtn');
                        var submitbtns=$('#tabs .submitbtn');
                        var delbtns=$('#tabs .delbtn');
                        var canceltns=$('#tabs .cancelbtn');
                        var cancelsteptwobtn=$('#tabs .cancelsteptwobtn');
                        var cancelstepthreebtn=$('#tabs .cancelstepthreebtn');
                        //var propertycheckbtns=$('#tabs .propertycheckbtn');
                        var btns_arr=[viewbtns,alterbtns,processbtns,submitbtns,delbtns,canceltns,cancelsteptwobtn,cancelstepthreebtn];
                        require(['commonfuncs/LookupItemName'], function(LookupItemName){
                            var rows=data.rows;
                            for(var i=0;i<rows.length;i++){

                                for(var j=0;j<btns_arr.length;j++){
                                    if(btns_arr[j].length>0){
                                        var isfind=false;
                                        if(rows[i]['processstatus']!=processdiction.noprocess){
                                            isfind=LookupItemName.lookup(LookupItemName.lookup(processRoleBtn,
                                                {name:'name',value:rows[i]['processstatus']}).children,
                                                {name:'name',value:$(btns_arr[j][i]).text()});

                                        }
                                        if(isfind||$(btns_arr[j][i]).attr("isshow")==='true'){
                                            var classname=$(btns_arr[j][i]).attr("class");
                                            if($(btns_arr[j][i]).attr("istext")!=='true'){
                                                $(btns_arr[j][i]).linkbutton({
                                                    iconCls: 'icon-'+classname
                                                });
                                            }

                                            (function(index){
                                                $(btns_arr[j][i]).click(function(){
                                                    var clickitem=this;
                                                    var record=rows[index];
                                                    require(['commonfuncs/ButtonsEvent'],function(ButtonsEvent){
                                                        var data={record:record};
                                                        ButtonsEvent.approvl_btns(clickitem,data);
                                                    });
                                                });
                                            })(i);

                                            $(btns_arr[j][i]).show();
                                        }
                                    }

                                }


                            }
                            $('#mainlayoutpanel').layout('resize');

                        });
                    }

                });


            var options=$('#businessgrid').datagrid('options');
            options.search_params={
                businesstype:businesstype,
                type:type,
                divisionpath:divisionpath
            };

            if(options.type==='month'){
                options.search_params.name=['time'];
                options.search_params.compare=['month'];
                options.search_params.value=[$('#businesstb .year').combobox('getValue')+"-"+
                    ($('#businesstb .month').combobox('getValue')<10?'0'+
                        $('#businesstb .month').combobox('getValue'):$('#businesstb .month').combobox('getValue'))];
                options.search_params.logic =['and'];
            }

            $('#businesstb .search,#businesstb .keyword').bind('click keypress',function(e){
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if($(this).attr("type")==='keyword'&&keycode!=13)return;
                var search_params={
                    bgdate:$('#businesstb .bgdate').length>0?$('#businesstb .bgdate').datebox('getValue'):null,
                    eddate:$('#businesstb .eddate').length>0?$('#businesstb .eddate').datebox('getValue'):null,
                    keyword:$('#businesstb .keyword').val()
                };
                $('#businessgrid').datagrid('load',search_params);
                for(var item in search_params){
                    var options=$('#businessgrid').datagrid('options');
                    options.search_params[item]=search_params[item];
                }


            });

            require(['commonfuncs/LookupItemName'],function(lookjs){
                var isfind=lookjs.lookup(processRoleBtn,
                        {name:"name",value:"资金发放"});
                if(isfind){
                    $('#businesstb .newgrant').bind('click',function(e){
                        require(['views/dbgl/addnewgrantwin','jqueryplugin/jquery-formatDateTime'],function(js){
                            js.render();
                        });
                    });
                }else{
                    $('#businesstb .newgrant').hide();
                }
            });

            $('#businesstb .moresearch').bind('click',function(e){
                var searchtype=$(this).attr('searchtype');
                require(['views/dbgl/moresearchwin','jqueryplugin/jquery-formatDateTime'],function(js){
                    js.render(searchtype);
                });
            });

            $('#excelmenu_btn').menubutton({
                iconCls: 'icon-excel',
                menu: '#excelmenu'
            });
            $('#excelmenu').menu({
                onClick:function(item){
                    require(['commonfuncs/ExcelExport'],function(excel){
                        //console.log(item);
                        excel.exportbygrid($('#businessgrid'),item);
                    });

                }
            });


            var squarediv='<div class="yw-block">'+
                '<div class="yw-stepzerobgcolor"></div><span>申请</span>'+
                '<div class="yw-steponebgcolor"></div><span>提交</span>'+
                '<div class="yw-steptwobgcolor"></div><span>审核</span>'+
                '<div class="yw-stepthreebgcolor"></div><span>审批</span>'+
                '<div class="yw-changebgcolor"></div><span>变更</span>'+
                '<div class="yw-logoutbgcolor"></div><span>注销</span>'+
                '</div>';
            $('#businesstb').delay(5*1000,function(){$(this).append(squarediv)})
        }
    }
    return a;
});
