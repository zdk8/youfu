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
    var commonj = {
        version: '1.0',
        defaultTitle: '提示',
        ajaxaSynchronous: false,
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
        },getLocalEnum: function (type) {
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

        }
    }


    return commonj;
})()





