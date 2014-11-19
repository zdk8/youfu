/**
 * Created by Administrator on 2014/9/28.
 */


define(function(){

   var myformatter =  function (date){
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
    }

    return {
        render:function(local,option){
            require(['text!views/placetype/'+option.queryParams.tablename+'.htm',
                'text!views/dmxt/SuoZaiZhengQuA.htm','text!views/dmxt/SuoZaiZhengQuB.htm'],function(htm,htmA,htmB){
                local.find('input[name=tablename]').val(option.queryParams.wholename); //加载表名
                local.find('span[opt=differentname]').append(option.queryParams.headname); //加载地名名称
                var placecode = option.queryParams.placecommon_id_first+option.queryParams.placecommon_id_second+
                    option.queryParams.placecommon_id_three;//地名代码
                local.find('input[name=placecode]').val(placecode);//加载地名代码
                local.find('input[name=biaozhunmingcheng]').val(option.queryParams.biaozhunmingcheng);//加载标准名称专名
                local.find('input[name=tongming]').val(option.queryParams.tongming);//加载标准名称通名
                local.find('input[name=romezhuanming]').val(option.queryParams.romezhuanming);//加载专名罗马字母拼写
                local.find('input[name=rometongming]').val(option.queryParams.rometongming);//加载通名罗马字母拼写
                var noname = option.queryParams.biaozhunmingcheng+option.queryParams.tongming;//标准名称
                local.find('input[name=noname]').val(noname);//加载标准名称
                local.find('input[name=shenbaomingcheng]').val(noname);//加载申报名称
                var romepinxie = option.queryParams.romezhuanming+option.queryParams.rometongming;//罗马拼写
                local.find('input[name=romepinxie]').val(romepinxie);//加载罗马拼写
                local.find('input[name=leibiemingcheng]').val(option.queryParams.headname);//加载类型名称
                $("#dengjishijian").datebox("setValue",myformatter(new Date()));//加载当前时间
                $("#shenbaoshijian").datebox("setValue",myformatter(new Date()));//加载申报时间
                local.find('input[name=dengjiren]').val("111");//加载登记人
                local.find('div[opt=child]').append(htm);

                if(local.find('tr[opt=suozaizhengqu]').length){
                    local.find('tr[opt=suozaizhengqu]').append(htmB);
                }else if(local.find('table[opt=suozaizhengqu]').length){
                    local.find('table[opt=suozaizhengqu]').append(htmA);
                }
                /*滚动条(存放按钮)*/
                local.scroll(function(){
                    var offsetTop = local.scrollTop() + 0 +"px";
                    $("#Float").animate({top : offsetTop },{ duration:300 , queue:false });
                })
                /*按钮样式变换*/
                local.find('input[action=changebutton]').bind("mouseover",function(){
                    this.style.background="url(../../../img/button2.jpg)";
                });
                local.find('input[action=changebutton]').bind("mouseout",function(){
                    this.style.background="url(../../../img/button1.jpg)";
                });
                /*提交表单*/
                local.find('input[action=changebutton]').bind("click",function(){
                    local.find('form[opt=placecommon_from]').form({
                        success:function(data){
                            console.log(data);
//                            alert("添加成功");
                        }
                    });
                    local.find('form[opt=placecommon_from]').attr("action",preFixUrl+"/civil/adddivision");
                    local.find('form[opt=placecommon_from]').submit();
                });
            })
        }
    }

})