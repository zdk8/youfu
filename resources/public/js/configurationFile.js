getGender=['男','女'];             //性别
getStatus=['保存','已上报','已审核','已审批'];             //状态
getEachtype=['义务兵(零年)','义务兵(第一年)','义务兵(第二年)','士官(义务兵转)','军官(提升)','军官(军校)'];             //类别(现役军人)

String.prototype.trim = function () {
    return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
}
/*日期时间*/
var myformatter = function(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
var myparser = function(s){
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
/*取当前年月为业务期*/
function formatterYM(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    return y+''+(m<10?('0'+m):m);
}