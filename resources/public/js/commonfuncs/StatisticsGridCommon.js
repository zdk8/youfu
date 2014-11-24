/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={

        initbusinessgrid:function(type,businesstype,columns,customparamfunc){

            $('#staticsgrid').treegrid(
                {
                    singleSelect: true,
                    collapsible: true,
                    rownumbers: true,
                    method:'post',
                    columns:columns,
                    remoteSort: false,
                    idField:"id",
                    fit:true,

                    toolbar:'#businesstb',
                    onBeforeLoad: function (rows,params) {
                        //var options = $('#staticsgrid').treegrid('options');

                        params.businesstype = businesstype;
                        params.type=type;
                        params.isonlychild=true;
                        params.divisionpath = divisionpath;
                        params.node=rows?rows.id:0;

                    }

                });
            var year=parseInt($.formatDateTime('yy',new Date()));
            var month=parseInt($.formatDateTime('mm',new Date()));
            var data=[];
            var mdata=[];
            for(var i=0;i<10;i++){
                data.push({
                    label:(year-i)+"年",
                    value:year-i
                });
            }
            for(var i=0;i<12;i++){
                mdata.push({
                    label:(i+1)+"月",
                    value:i+1
                });
            }

            $('#businesstb .year').combobox({
                valueField: 'value',
                textField: 'label',
                value:year,
                data:data
            });

            $('#businesstb .month').combobox({
                valueField: 'value',
                textField: 'label',
                value:month,
                data:mdata
            });

            $('#businesstb .bgmonth,#businesstb .search').bind('click keypress',function(e){

                var keycode = (event.keyCode ? event.keyCode : event.which);
                if($(this).attr("type")==='bgmonth'&&keycode!=13)return;
                $('#staticsgrid').treegrid('load',{
                    bgmonth:$('#businesstb .year').combobox('getValue')+"-"+
                        ($('#businesstb .month').combobox('getValue')<10?'0'+$('#businesstb .month').combobox('getValue'):$('#businesstb .month').combobox('getValue'))
                });
            });






        }

    }

    return a;
});
