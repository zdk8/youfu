define(function(){
    function render(local,option){
        var month = ['','一','二','三','四','五','六','七','八','九','十','十一','十二']
        var xlstable = local.find('[opt=xls_table]');
        var month1 = local.find('[opt=month1]');
        var month2 = local.find('[opt=month2]');
        var isfirst = true
        month1.change(function(){
            month2[0].length = 1; //清空选择月份2
            var colsnum = xlstable.find('[opt=titlename] td').attr("colspan")
            if(isfirst){
                if(month1.val() != "none"){
                    xlstable.find('[opt=titlename] td').attr("colspan",parseInt(colsnum)+1)
                    xlstable.find('[opt=fieldname]').append('<td style="width: 30px">'+month[parseInt(month1.val())]+'月</td>')
                    xlstable.find('[opt=fieldvalue]').append('<td></td>')
                    /*month2从几月开始*/
                    for(var i=parseInt(month1.val())+1;i<=12;i++){
                        month2.append('<option value="'+i+'">'+month[i]+'</option>')
                    }

                }else{
                    month2[0].length = 1;
                }
                isfirst = false;
            }else{
                /*if(month1.val() != "none"){
                     xlstable.find('[opt=titlename] td').attr("colspan",parseInt(colsnum)+1)
                     xlstable.find('[opt=fieldname]').append('<td style="width: 30px">'+month[parseInt(month1.val())]+'月</td>')
                     xlstable.find('[opt=fieldvalue]').append('<td></td>')
                     *//*month2从几月开始*//*
                     for(var i=parseInt(month1.val())+1;i<=12;i++){
                        month2.append('<option value="'+i+'">'+month[i]+'</option>')
                     }
                 }else{
                    month2[0].length = 1;
                 }*/
                /*清空表格组成*/
                /*var namelength = xlstable.find('[opt=fieldname]tr td').length;
                var valuelength = xlstable.find('[opt=fieldvalue]tr td').length;
                var poorname = namelength-1;
                var poorvalue = valuelength-1;
                var colsnum = xlstable.find('[opt=titlename] td').attr("colspan")
                console.log(namelength)
                var poornamel = namelength-6;
                pp = poornamel
                if(poornamel > 1){
                    console.log('加载了..')
                    for(var j=0;j<4;j++){
                        xlstable.find('[opt=titlename] td').attr("colspan",colsnum--)
                        xlstable.find('[opt=fieldname]tr td')[poorname--].remove()
                        xlstable.find('[opt=fieldvalue]tr td')[poorvalue--].remove()
                    }
//                    isfirst = true;
                }*/

                xlstable.find('[opt=titlename] td').attr("colspan",11)
                xlstable.find('[opt=fieldname]tr td')[6].remove()
                xlstable.find('[opt=fieldvalue]tr td')[6].remove()
                if(month1.val() != "none"){
                    xlstable.find('[opt=titlename] td').attr("colspan",parseInt(colsnum)+1)
                    xlstable.find('[opt=fieldname]').append('<td style="width: 30px">'+month[parseInt(month1.val())]+'月</td>')
                    xlstable.find('[opt=fieldvalue]').append('<td></td>')
                    /*month2从几月开始*/
                    for(var i=parseInt(month1.val())+1;i<=12;i++){
                        month2.append('<option value="'+i+'">'+month[i]+'</option>')
                    }

                }else{
                    month2[0].length = 1;
                }
//                isfirst = true;
            }
        })
        month2.change(function(){
            /*xlstable.find('[opt=titlename] td').attr("colspan",11)
            xlstable.find('[opt=fieldname]tr td')[6].remove()
            xlstable.find('[opt=fieldvalue]tr td')[6].remove()
            var colsnum = xlstable.find('[opt=titlename] td').attr("colspan")
            xlstable.find('[opt=titlename] td').attr("colspan",parseInt(colsnum)+1)
            xlstable.find('[opt=fieldname]').append('<td style="width: 30px">'+month[parseInt(month1.val())]+'月</td>')
            xlstable.find('[opt=fieldvalue]').append('<td></td>')*/
            var poorval = parseInt(month2.val())-parseInt(month1.val())
            var monthval = parseInt(month1.val());
            for(var i=0;i<poorval;i++){
                var colsnum = xlstable.find('[opt=titlename] td').attr("colspan")
                xlstable.find('[opt=titlename] td').attr("colspan",parseInt(colsnum)+1)
                xlstable.find('[opt=fieldname]').append('<td style="width: 30px">'+month[++monthval]+'月</td>')
                xlstable.find('[opt=fieldvalue]').append('<td></td>')
            }
        })
    }


    return {
        render:render
    }

})