/*根据当前页面元素和easyui插件的值生成页面保存到后台*/

define(function(){
    var parse=function(local){
        var selections='.easyui-combobox';
        var selectiontrees='.easyui-combotree';
        var selectiondatas='.easyui-datebox'; //easyui-datebox
        var eobj={};
        dd = local;
        var extid=1;
        local.find('textarea,:input').each(function(){    //获得元素input的value
            if($(this).val()){
                var name=$(this).attr('name');
                if(!name&&!$(this).attr('comboname')){
                    name="extname"+(extid++);
                    $(this).attr('name',name);

                }
                eobj[name]=$(this).val();
            }
        })

        local.find(selections).each(function(){
            var comboname=$(this).attr('comboname');
            if(comboname){
                eobj[comboname]=$(this).combo('getText');
            }
        })
        local.find(selectiontrees).each(function(){
            var comboname=$(this).attr('comboname');
            if(comboname){
                eobj[comboname]=$(this).combo('getText');
            }
        })
        local.find(selectiondatas).each(function(){
            var comboname=$(this).attr('comboname');
            if(comboname){
                eobj[comboname]=$(this).combo('getText');
            }
        })

        var myclone=$('<div class="newRadio"></div>').append($(local.find('div.panel-body')[0]).clone());
        myclone.find(selections).each(function(){   //删除easyui-combobox样式
            $(this).removeAttr('data-options').css('display','inline')
                .removeClass('easyui-combobox').attr('comboname');
        })
        myclone.find(selectiontrees).each(function(){   //删除easyui-combotree样式
            $(this).removeAttr('data-options').css('display','inline')
                .removeClass('easyui-combotree').attr('comboname');
        })
        myclone.find(selectiondatas).each(function(){   //删除easyui-datebox样式
            $(this).removeAttr('data-options').css('display','inline')
                .removeClass('easyui-datebox').attr('comboname');
        })

        myclone.find('input').each(function(){
            $(this).removeClass('combogrid-f')
            $(this).removeClass('combo-f')
            $(this).removeClass('easyui-validatebox')
        })
       /* myclone.find('span').each(function(){                             //删除datebox的span标签
            $(this).removeClass('combo')
            $(this).removeClass('datebox')
        })*/
        myclone.find('textarea,:input').each(function(){      //为input元素赋值
            var name=$(this).attr('name');

            var tagName=$(this).prop('tagName');
            if(tagName=="INPUT"){
                if(name){
                    $(this).attr('value',eobj[name]);
                }
            }else if(tagName=="TEXTAREA"){
                $(this).text(eobj[name]);
            }

            var comboname=$(this).attr('comboname')
            if(comboname){
                $(this).attr('value',eobj[comboname]);
            }
        })
        myclone.find('span[class=combo]').remove();
       // myclone.find('span').hasClass('combo').remove();

        myclone.find('span[class*=datebox]').remove();
       /* $('#tabs').tabs('add',{
            title:'原始页面',
            content:myclone.html(),
            closable:true
        })*/

        /*var options=myclone.find('.easyui-datagrid').datagrid('options');
        var clumns=options.columns;
        for(var i in clumns){
            if(clumns[i].editor.type=='combobox'){
                var data=myclone.find('.easyui-datagrid').datagrid('getData');
                for(var j in data){
                    for(var p in data[j]){
                        if(p==clumns[i].editor.field){
                            data[j][p]='100';
                        }
                    }
                }
            }
        }*/


        //console.log(eobj)
        return myclone.html();
    }
    function toJsonString(local){
        var obj={};
        var formdata=local.find('form').serializeArray();
        var formObj={};
        for(var j in formdata){
            formObj[formdata[j].name]=formdata[j].value;
        }
        var i=0;
        local.find('.easyui-datagrid').each(function(){
             var gridname=$(this).attr('gridname')||'defaultgrid'+(i++);
             obj[gridname]=$(this).datagrid('getData');
        })
        obj.formdata=formObj;
        return JSON.stringify(obj);
    }

    return {parse:toJsonString}
})