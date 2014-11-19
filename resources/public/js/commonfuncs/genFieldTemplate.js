define(function () {

    var a = {
        render: function (htm) {
            $(htm).find('.fieldTemplateA').each(function () {
                if($(this).find('.fieldtoolbar').length){
                    return;
                }
                var toolbar = $('<div class="fieldtoolbar"></div>')
                var title = $('<div class="fieldtitle">' + $(this).attr('fieldtitle') + '</div>');
                var btns = eval('(' + $(this).attr('btns') + ')');
                var btnsdiv = $('<div class="fieldbtns"></div>');
                if (btns) {
                    for (var j in btns) {
                        btnsdiv.append('<span>' + btns[j].name + '</span>')
                    }
                }


                toolbar.append(title)
                toolbar.append(btnsdiv);
                toolbar.append('<div class="clear"></div>');
                if($(this).find('.easyui-datagrid-noauto').length){
                    $(this).addClass('fieldTemplateAContent');
                }
                $(this).prepend(toolbar);
            })
            $(htm).find('td>label').each(function () {
                var $tdspan = $(this).next();
                if (!$tdspan.length) {
                    $(this).parent().append('<span>&nbsp;</span>')
                }
            });

        }
    }

    return a;
})