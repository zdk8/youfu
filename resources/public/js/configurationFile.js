approvalProcess=['打回重审','提交未审核','审核未审批','审批通过','保存未提交'];    //流程状态
getGender=['男','女']             //性别
/*日期时间*/
myformatter = function(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
myparser = function(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}
/*进度框*/
showProcess = function(isShow, title, msg) {
    if (!isShow) {
        $.messager.progress('close');
        return;
    }
    var win = $.messager.progress({
        title: title,
        msg: msg
    });
}