define(function(){
    function render(local,option){
        var month = ['','一','二','三','四','五','六','七','八','九','十','十一','十二']
        var monthnum = ['','01','02','03','04','05','06','07','08','09','10','11','12']
        var month1 = local.find('[opt=month1]');
        var month2 = local.find('[opt=month2]');
        var monthvalue = local.find('[opt=monthvalue]');
        var monthvaluenum = local.find('[opt=monthvaluenum]');
        var isfirst = true
        month1.change(function(){
            month2[0].length = 1; //清空选择月份2
            if(isfirst){
                if(month1.val() != "none"){
                    /*month2从几月开始*/
                    for(var i=parseInt(month1.val());i<=12;i++){
                        month2.append('<option value="'+i+'">'+month[i]+'</option>')
                    }

                }else{
                    month2[0].length = 1;
                }
                isfirst = false;
            }else{
                if(month1.val() != "none"){
                    /*month2从几月开始*/
                    for(var i=parseInt(month1.val());i<=12;i++){
                        month2.append('<option value="'+i+'">'+month[i]+'</option>')
                    }

                }else{
                    month2[0].length = 1;
                    monthvalue.val("")
                    monthvaluenum.val("")
                }
//                isfirst = true;
            }
        })
        month2.change(function(){
            var poorval = parseInt(month2.val())-parseInt(month1.val())
            var str = new Array();
            var strnum = new Array();
            for(var i=0;i<=poorval;i++){
                str.push(month[parseInt(month1.val())+i])
                strnum.push(monthnum[parseInt(month1.val())+i])
            }
            monthvalue.val(str.toString())
            monthvaluenum.val(strnum.toString())
        })
    }


    return {
        render:render
    }

})