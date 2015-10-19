//date extended
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "日",
        "1" : "一",
        "2" : "二",
        "3" : "三",
        "4" : "四",
        "5" : "五",
        "6" : "六"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

String.prototype.getBytes = function () {
    var cArr = this.match(/[^\x00-\xff]/ig);
    return this.length + (cArr == null ? 0 : cArr.length);
}
//****************************************************************************************
if(!window.console){
    window.console={
        log:function(){

        }
    }
}
//****************************************************************************************

/**
 * Created by weipan on 3/31/14.
 */
var ajaxv = {};
ajaxv.ajax = function (url,data,_success,_error) {
    $.ajax({
        type:'post',
        url:url,
        data:data,
        success: function (data) {
            if(data.length > 0){
                _success(data[0].aaa103);
            }
        },
        error: function () {
            _error();
        }
    })
}
ajaxv.successf = function (info) {
    //return info;
    alert(info)
}
ajaxv.errorf = function () {

}
var cjEnum={};//和cj中的Enums一样，只是便于调试，在代码中不用
var cj=(function(){
    var pz=15;
    var dataGridAttr={ pageSize:pz, pageList: [pz, 30,50]}
    var Enums={};
    var Enums2={};

    function  indexOf(a,p,v){
        for(var i in a){
            if(a[i][p]==v){
                return a[i];
            }
        }
    }

    var getLoader = function(type,param,success,error){
        return function(param,success,error){
            param.q="10000";
            $.ajax({
                url: 'getenumbytype',
                dataType: 'jsonp',
                data: {
                    type:type
                },
                success: function(data){
                    var items = $.map(data, function(item){
                        return {
                            id: item.enumeratevalue,
                            text: item.enumeratelabel
                        };
                    });
                    //console.log(items)
                    /*if(!Enums[type]){
                        cjEnum[type]=Enums[type]=items;
                    }*/
                    success(items);
                },
                error: function(){
                    error.apply(this, arguments);
                }
            });
        }
    }

    var getUrl=function(filepath,action,costomPreFixUrl){
        var u=filepath.replace(/\//g,'@');
        var myu=indexOf(urls,'name',u);
        var a=myu?myu.url:[];
        for(var i in a){
            for(var p in a[i]){
                if(p==action){
                    var result= (costomPreFixUrl||preFixUrl)+a[i][p];
                    return result;
                }
            }
        }
        return 'noactionfound'
    }
//***************************

    var singleFun=function(type){
        /*if(cbdata){
            var d=cbdata;
            Enums= d.rows
            cjEnum= d.rows;
            return Enums;  //一次性全部加载过来
        }
        $.ajax({
            url:'jsondata/cb.json',
            type:'post',
            data:{searchtype:'no1'},
            success:function(res){
                var d = eval('(' + res + ')');
                if (!!d && (d.success == true || d.success == 'true')) {
                    Enums= d.rows
                    cjEnum= d.rows;
                    return Enums;  //一次性全部加载过来
                }
            }
        }) */
        $.ajax({
            url:'getenumbytype',
            dataType: 'jsonp',
            data:{skeyword:'',type:type},
            success: function(data){
                var items = $.map(data, function(item){
                    return {
                        id: item.enumeratevalue,
                        text: item.enumeratelabel
                    };
                });
                if(!Enums[type]){
                    cjEnum[type]=Enums[type]=items;
                }
            }
        })
    }
    window.setTimeout(function () {
        var enumarr = ['gender','oldnation'];
        for(var i=0;i<enumarr.length;i++){
            singleFun(enumarr[i]);
        }
    },1000);

    var getEnumlower=function(searchtype){
        return Enums[searchtype];
    }
    var enfmt=function(ef){
        return function(value,recode,index){
            if(ef){
                for (var i = 0; i < ef.length; i++) {
                    if (ef[i].id == value) {
                        return ef[i].text;
                    }
                }
                return value;
            }
        }
    }
    /*枚举*/
    /*统计类型*/
    var type_tj = [{"id":"xzqh","text":"行政区划","selected":true},{"id":"xb","text":"性别"},{"id":"nl","text":"年龄"},
        /*{"id":"mz","text":"民族"},*/{"id":"lb","text":"类别"},{"id":"hy","text":"婚姻状况"},{"id":"zn","text":"有无子女"},
        {"id":"wh","text":"文化程度"},{"id":"kcyy","text":"空巢原因"},{"id":"xqah","text":"兴趣爱好"},
        {"id":"twpl","text":"子女探望频率"},{"id":"jjly","text":"经济来源"},{"id":"grysr","text":"个人月收入"},
        {"id":"knhd","text":"近期活动"},{"id":"xyfw","text":"需要服务"},{"id":"shzq","text":"晚年最缺"}];
    /*子类型*/
    var lb = [{"id":1,"text":"低保"},{"id":2,"text":"低保边缘户"},{"id":3,"text":"低收入户"},{"id":4,"text":"失独"},
        {"id":5,"text":"重残"},{"id":6,"text":"其他"}];
    var hyzk = [{"id":1,"text":"未婚"},{"id":2,"text":"已婚"},{"id":3,"text":"离婚"},{"id":4,"text":"分居"},
        {"id":5,"text":"丧偶"},{"id":6,"text":"其他"}];
    var whchd = [{"id":1,"text":"文盲"},{"id":2,"text":"小学"},{"id":3,"text":"初中"},{"id":4,"text":"高中"},
        {"id":5,"text":"大专以上"}];
    var kchyy = [{"id":1,"text":"经济原因"},{"id":2,"text":"家庭成员关系原因"},{"id":3,"text":"生活习惯"},{"id":4,"text":"其他"}];
    var zntw = [{"id":1,"text":"一两天"},{"id":2,"text":"一周"},{"id":3,"text":"两周"},{"id":4,"text":"一个月"},
        {"id":5,"text":"二个月"},{"id":6,"text":"一个季度"},{"id":7,"text":"半年"},{"id":8,"text":"一年及以上"}];
    var yshr = [{"id":1,"text":"没有"},{"id":2,"text":"不足200"},{"id":3,"text":"200~499"},{"id":4,"text":"500~999"},
        {"id":5,"text":"1000~1499"},{"id":6,"text":"1500~2000"},{"id":7,"text":"2000及以上"}];
    var emnumap = {};
    emnumap['type_tj'] = type_tj;
    emnumap['lb'] = lb;
    emnumap['hyzk'] = hyzk;
    emnumap['whchd'] = whchd;
    emnumap['kchyy'] = kchyy;
    emnumap['zntw'] = zntw;
    emnumap['yshr'] = yshr;
    function getEnum(type){
        return emnumap[type];
    }
    var commonj = {
        version: '1.0',
        defaultTitle: '提示',
        ajaxaSynchronous: false,
        calert: function (res) {
            var d = eval('(' + res + ')');
            if (!!d && (d.success == true || d.success == 'true')) {
                $.messager.alert(cj.defaultTitle, '操作成功!', 'info');
            } else {
                $.messager.alert(cj.defaultTitle, '操作失败!', 'info');
            }
        },
        question: function (info, fun, title) {
            var boxtitle = cj.defaultTitle;
            if (title) {
                boxtitle = title;
            }
            $.messager.confirm(boxtitle, info, function (r) {
                if (r) {
                    fun()
                }
            });
        },

        ifSuccQest: function (res, info, fun, title) {
            var d = eval('(' + res + ')');
            if (!d||d.success == true || d.success == 'true') {
                cj.question(info, fun, title)
            }
        },
        csumbitQest:function(res,info,fun,title){
            var d= $.evalJSON(res);
            if(d){
                if(d.success == true || d.success == 'true'){
                    cj.question((d.message||info||'操作成功')+',是否关闭', fun,title)
                }else{
                    cj.question(( d.message||'操作失败')+',是否关闭', fun,title)
                }
            }else{
                $.messager.alert(cj.defaultTitle, '操作失败!', 'info');
            }
        },
        slideShow:function(message,title){
            $.messager.show({
                title:title||'温馨提示',
                msg:message||'',
                timeout:3000,
                showType:'slide'
            });
        },
        getByteLen: function (val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                if (val[i].match(/[^x00-xff]/ig) != null) //全角
                    len += 2;
                else
                    len += 1;
            }
            ;
            return len;
        },
        getDataGridAttr:function(name){
            return dataGridAttr[name]
        },
        enumFormatter:function(ename){
            return enfmt(getEnumlower(ename.toLowerCase()))
        },
        enumFormatter2: function (ename,value) {
            return function(value,recode,index){
                if(ename && value){
                    /*ajaxv.ajax({
                        url:'getenumbytypeandv',
                        type:'post',
                        data:{
                            aaa100:ename,
                            aaa102:value
                        },
                        success: function (data) {
                            if(data.length > 0){
                                console.log(data[0].aaa103)
                                return data[0].aaa103;
                            }
                        }

                    })*/

                    var rs = ajaxv.ajax(
                        'getenumbytypeandv',
                        {aaa100:ename,aaa102:value},
                        ajaxv.successf,
                        ajaxv.errorf
                    );

                    /*for (var i = 0; i < ef.length; i++) {
                        if (ef[i].id == value) {
                            return ef[i].text;
                        }
                    }*/
                    //return value;
                    console.log(rs)
                }
            }
            /*var v;
            if(ename && value){
                $.ajax({
                    url:'getenumbytypeandv',
                    type:'post',
                    data:{
                        aaa100:ename,
                        aaa102:value
                    },
                    success: function (data) {
                        if(data.length > 0){
                            console.log(data[0].aaa103)
                            //return data[0].aaa103;
                            v = data[0].aaa103;
                        }
                    }

                })
                return "nan";
            }*/
        },
        getEnum:function(ename){
            return getEnumlower(ename.toLowerCase())
        },
        getSelected:function(){
            require(['commonfuncs/TreeClickEvent'],function(js){
                return js.getSelected();
            })
        },
        showContent:function(option){
            var f=function(show){
                if(option.forceclose==true){
                    show.closeTabByTitle(option.title);
                }

                show.ShowContent(option)
            }
            require(['commonfuncs/TreeClickEvent'],f)
        },
        showHtmlIframe:function(value){
            var f=function(show){
                show.ShowHtmlIframe(value)
            }
            require(['commonfuncs/TreeClickEvent'],f)
        },
        showIframe:function(value,jsfile,title,customparam){
            var f=function(show){
                show.ShowIframe(value,jsfile,title,customparam)
            }
            require(['commonfuncs/TreeClickEvent'],f)
        },
        showHtml:function(title,texthtml){
            require(['commonfuncs/TreeClickEvent'],function(js){
                js.closeTabByTitle(title);
                js.showHtml(title,texthtml);
            })
        },
        searchLog:function(functionid,isAuditLog){
            require(['commonfuncs/TreeClickEvent'],function(js){
                var location='log.do?method='+functionid;
                if(isAuditLog){
                    location+='&isAuditLog='+isAuditLog
                }
                var title='操作日志';
                js.closeTabByTitle(title)
                js.ShowIframe(location,'',title)
            })
        },
        getCurrTab:function(){
            return $('#tabs').tabs('getSelected');
        } ,
        rowStyler:function(index,row){
            if(index%2==1){
                return 'background:#e7ffe7';
            }
        },dateFormatter:function(fmt){
            return function(v,r,i){
                var d=v;
                if(!d){return}
                d= new Date(d.replace(/-/g,'/'));
                return d.pattern(fmt||'yyyy-MM-dd hh:mm')
            }

        },getUrl:getUrl,
        ajaxdata:function(url,data,success,type){
            var atype=type;
            if(!type){
                atype='post';
            }
            $.ajax({
                url:url,data:data,type:atype,success:success
            })
        },getLoader:getLoader,
        dataGridLoadMsg:function(){return ''},

        /**
         * 生成工具条
         * @param btns
         */
        getFormToolBar:function(btns){
            var $btnarea=$('<div class="form-foot-btns"><ul></ul></div>');
            var $ul = $btnarea.find('ul');
            for( var i in btns){
                var btn = btns[i];
                var $li=$('<li><a>'+btn.text+'</a></li>');
                var $a = $li.find('a');
                for(var p in btn) {
                    $a.attr(p,btn[p]);
                }
                $ul.append($li);
            }
            return $btnarea;
        },getUserMsg:function(){
            return usermsg;
        },
        getLocalEnum: function (type) {
            return function(param,success,error){
                success(getEnum(type));
            }
        },showSuccess: function (msg) {
            var index = layer.open({
                type: 1, //page层
                area: ['200px', '100px'],
                title: '温馨提示',
                offset: 'rb', //右下角弹出
                shade: false, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: 4, //0-6的动画形式，-1不开启
                content: '<div style="padding:5px;text-align: center;">'+msg+'</div>'
            });
            window.setTimeout(function () {
                layer.close(index);
            },3000);
        },showFail: function (msg) {
            var index = layer.open({
                type: 1, //page层
                area: ['200px', '100px'],
                title: '温馨提示',
                offset: 'rb', //右下角弹出
                shade: false, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: 4, //0-6的动画形式，-1不开启
                content: '<div style="padding:5px;text-align: center;color: red;">'+msg+'</div>'
            });
            window.setTimeout(function () {
                layer.close(index);
            },3000);
        },imgView: function (file,local) {      //照片预览
            var prevDiv = local.find('[opt=personimg]');
            if (file.files){
                if(file.files[0]){
                    var reader = new FileReader();
                    reader.onload = function(evt){
                        var imghtm = '<img style="width:150px;height:120px;" src="' + evt.target.result + '" />';
                        prevDiv.html(imghtm);
                    }
                    reader.readAsDataURL(file.files[0]);
                }else{
                    var noperson = '<img name="photo" src="images/noperson.gif" value="" alt="用户照片" width="150px" height="120px">';
                    prevDiv.html(noperson);
                }
            }else{//ie下实现
                var imghtmie = '<div class="img" style="width:150px;height:120px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
                prevDiv.html(imghtmie);
            }

        },common_listFunc:function(local){  //表单动态增减行
            local.find('[opt=addlist]').click(function () {
                var $this =$(this);
                var $tr = $this.parents('.list_min').find('tbody');
                var td1 = $this.parents('tr').next().find('td').has('input');
                var td = '<td><a opt="dellist" style="cursor: pointer;"><img src="images/reduce.png"></a></td>';
                var tds = "";
                for(var i=0;i<td1.length;i++){
                    var hasdatebox = $(td1[i].outerHTML).find('span').hasClass('datebox');
                    if(hasdatebox){
                        var opt_td = $($(td1[i].outerHTML).find('input')[0]).attr('opt');
                        var width_td = $($(td1[i].outerHTML).find('input')[0]).width();
                        var datebox_td = '<td align="center"><input class="input-text easyui-datebox" opt="'+opt_td+'" style="width: '+width_td+'px"'+'></td>';
                        tds += datebox_td;

                    }else{
                        tds += td1[i].outerHTML.toString();
                    }
                }
                tds += td;
                $tr.append('<tr>'+tds+'</tr>');
                /*控件初始化*/
                $(tds).find('input').each(function () {
                    var $this1 = $(this);
                    if($this1.hasClass('easyui-datebox')){
                        local.find('[opt='+$this1.attr('opt')+']').last().datebox();
                    }
                })
                //local.find('[opt=jc_date]').datebox();
                var lasttr = $tr.find('tr')[$tr.find('tr').length-1];
                $($($(lasttr).find('td')[0]).find('span.combo')[1]).remove();
                local.find('[opt=dellist]').each(function () {
                }).click(function () {
                    var _tr = $(this).parents('tr');
                    if (_tr.attr('class') != "demo") {
                        var pp_id = _tr.find('[opt=pp_id]').val()
                        if(!pp_id){
                            _tr.remove();
                        }
                    }
                })
            });
        },commonGetValue:function(local,option){  //动态表单提交时值获取
            var field = option.field;
            var arr = new Array();
            for(var i=0;i<field.length;i++){
                var arr_1 = new Array();
                var code = local.find('[opt='+field[i]+']');
                code.each(function () {
                    var $this = $(this);
                    if($this.hasClass('easyui-combobox')){
                        arr_1.push($this.combobox('getValue'));
                    }else if($this.hasClass('easyui-datebox')){
                        arr_1.push($this.datebox('getValue'));
                    }else{
                        arr_1.push($this.val())
                    }
                });
                arr.push(arr_1);
            }

            var arrall = new Array();
            var arr2 = arr[0];
            for(var i=0;i<arr2.length;i++){
                var maparr = {};
                for(var j=0;j<field.length;j++){
                    maparr[field[j]]=arr[j][i];
                }
                arrall.push(maparr);
            }
            return arrall;
        },initTrData: function (local,tabopt,childdata,fields) {    //多行表单的值填充，动态加载
            var $tbody = local.find('[opt='+tabopt+'] tbody');
            var $tds = $tbody.find('tr').last().find('td').has('input');
            var td_reduce = '<td><a opt="dellist" style="cursor: pointer;"><img src="images/reduce.png"></a></td>';
            var $tr = "";
            for(var i=0;i<$tds.length;i++){
                var hasdatebox = $($tds[i].outerHTML).find('span').hasClass('datebox');
                if(hasdatebox){
                    var opt_td = $($($tds[i].outerHTML).find('input')[0]).attr('opt');
                    var width_td = $($($tds[i].outerHTML).find('input')[0]).width();
                    var datebox_td = '<td align="center"><input class="input-text easyui-datebox" opt="'+opt_td+'" style="width: '+width_td+'px"'+'></td>';
                    $tr += datebox_td;

                }else{
                    $tr += $tds[i].outerHTML.toString();
                }
            }
            $tr += td_reduce;
            for(var i=1;i<childdata.length;i++){
                $tbody.append('<tr>'+$tr+'</tr>');
                for(var j=0;j<fields.length;j++){
                    if(local.find('[opt='+fields[j]+']').last().hasClass('easyui-datebox')){
                        local.find('[opt='+fields[j]+']').last().datebox();
                        local.find('[opt='+fields[j]+']').last().datebox('setValue',childdata[i][fields[j]]);
                    }else{
                        local.find('[opt='+fields[j]+']').last().val(childdata[i][fields[j]]);
                    }
                }
            }

            var lasttr = $tbody.find('tr')[$tbody.find('tr').length-1];
            $($($(lasttr).find('td')[0]).find('span.combo')[1]).remove();
            local.find('[opt=dellist]').each(function () {
            }).click(function () {
                var _tr = $(this).parents('tr');
                if (_tr.attr('class') != "demo") {
                    var pp_id = _tr.find('[opt=pp_id]').val()
                    if(!pp_id){
                        _tr.remove();
                    }
                }
            })
        }
    }


    return commonj;
})()


jQuery.fn.cssRadioOnly = function (){
    var me = ($(this))
    var selectRadio = ":input[type=radio] + label";
    me.find(selectRadio).each(function () {
        if ($(this).prev()[0].checked)
            $(this).addClass("checked");
    }).prev().hide();
}
jQuery.fn.cssCheckBoxOnly = function () {
    var me = ($(this))
    var selectCheck = ":input[type=checkbox] + label";
    me.find(selectCheck).each(function () {
        if ($(this).prev()[0].checked) {
            $(this).addClass("checked");
        }
    }).prev().hide();
}
jQuery.fn.cssRadio = function (toggle) {
    var me = ($(this))
    var selectRadio = ":input[type=radio] + label";
    me.find(selectRadio).each(function () {
        if ($(this).prev()[0].checked)
            $(this).addClass("checked"); //初始化,如果已经checked了则添加新打勾样式
    }).click(function () {               //为第个元素注册点击事件
            var s = $($(this).prev()[0]).attr('name')
            s = ":input[name=" + s + "]+label"
            var isChecked=$(this).prev()[0].checked;
            me.find(s).each(function (i) {
                $(this).prev()[0].checked = false;
                $(this).prev().removeAttr("checked");
                $(this).removeClass("checked");
            });
            if(isChecked&&toggle){
                //如果单选已经为选中状态并且参数为true,则什么都不做
            }else{
                $(this).prev()[0].checked = true;
                $(this).prev().attr("checked","checked");
                $(this).addClass("checked");
            }

        })
        .prev().hide();     //原来的圆点样式设置为不可见


};
jQuery.fn.cssCheckBox = function () {
    var me = ($(this))
    me.find(":input[type=checkbox] + label").each(function () {
        if ($(this).prev()[0].checked) {
            $(this).addClass("checked");
        }
    }).toggle(function () {
            $(this).prev()[0].checked = true;
            $(this).addClass("checked");
            $($(this).prev()[0]).attr("checked","checked");

        },
        function () {
            $(this).prev()[0].checked = false;
            $(this).removeClass("checked");
            $($(this).prev()[0]).removeAttr("checked");
        }).prev().hide();
}

var lr=(function(){
    return {
        url:function(option,eventName){
           var en='';
            if(eventName){
                en='&eventName='+eventName
            }
           return 'lr.do?model='+option.location+en+'&functionid='+option.functionid;
        }
    }
})() ;



