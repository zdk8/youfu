/**
 * Created by jack on 14-1-22.
 */

define(function(){

    var a={

        exportbygrid:function(grid,btn){
            var rows=[];
            rows=grid.datagrid('getRows');
            if(rows.length==0){
                $.messager.alert('提示信息','无相关数据可导出!');
                return ;
            }
            var headers=this.makecommon_headers(grid);
            //var sum={"totalhelpmoney":store.sum("totalhelpmoney"),"familynum":store.sum("familynum")};
            this.outexcel_common(btn,{},1,rows,headers,null,grid);

        },

        makecommon_headers:function(grid){
            //testobj=grid;
            var options=grid.datagrid('options');
            var columns=options.frozenColumns[0].concat(options.columns[0]);
            var index=1;
            var headers=[
                {name:"序号",value:"index",columns:[],
                    col:[0,0],
                    row:[1,1]}];
            for(var i=0;i<columns.length;i++){
                var column=columns[i];
                if(!(column.hidden||column.title=='操作栏'||column.title=='业务操作')){
                    var item={name:column.title,value:column.field,columns:[],col:[index,index],row:[1,1]};
                    headers.push(item);
                    index++;
                }
            }

            return headers;
        },
        outexcel_common:function(btn,sum,headerheight,rows,headers,headercols,grid){

            var me=this;
            var options=grid.datagrid('options');
            var isall=eval(btn.name);
            var params = {
                rows:isall?$.toJSON([]):$.toJSON(rows),
                sum:$.toJSON(sum),
                title:options.title,
                isall:isall,
                headerheight:headerheight,
                headercols:headercols?headercols:headers.length,
                extraParams:$.toJSON($('#businessgrid').datagrid('options').search_params?$('#businessgrid').datagrid('options').search_params:{}),
                url:window.location.href.split("#")[0]+options.url,
                headers:$.toJSON(headers)
            };
            var successFunc = function (data, action) {
                if(data.isok){
                    window.location.href = data.path;
                }
                else{
                    $.messager.alert('提示信息','导出excel文件失败!');
                }
            };
            var failFunc = function (res, action) {
                $.messager.alert('提示信息','导出excel文件失败!');
            };

            require(['commonfuncs/AjaxForm'],function(ajax){
                ajax.ajaxsend('post','json','ajax/makeexcel.jsp',params,successFunc,null,failFunc);
            });

        }


    }

    return a;
});
