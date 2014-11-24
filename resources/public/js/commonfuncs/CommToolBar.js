define(function(){
    var toolbartr=' <div class="datagrid-toolbar" style="border-top: 1px solid yellowgreen;"><table cellspacing="0" cellpadding="0" style="margin: 0 auto;"> <tbody> <tr></tr> </tbody> </table></div>';
    var getToolBar=function(buttons,align){
        var tb=$(toolbartr);
        var tr=tb.find('tr');
        for(var i in buttons){
           var iconCls=buttons[i].iconCls||'';
           var text=buttons[i].text||'';
           var btn='<td><a  class="l-btn l-btn-plain"><span class="l-btn-left">' +
                    '<span class="l-btn-text '+iconCls+' l-btn-icon-left">'+text+'</span></span></a></td>';
           tr.append(btn);
           if(buttons[i].handler){
               $(tr.find('td')[i]).bind('click',buttons[i].handler);
           }
           if(buttons[i].action){
               $(tr.find('td')[i]).find('a').attr('action',buttons[i].action);
               if('searchlog'==buttons[i].action){
                   $(tr.find('td')[i]).find('a').bind('click',function(){
                       $('#tabs').tabs('getSelected').trigger('searchlog');
                   })
               }
           }
        }
        if(align){
            tb.find('table').removeAttr('style');
        }

        return tb.get(0)
    }

    return getToolBar
})