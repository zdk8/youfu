/**
 * Time: 下午2:46
 * 初始化所有自定义校验
 */
define(function(){
    var validateDesc={
        identityid:'通用身份证号码校验',
            exists:'是否已经存在',
        minLength:'最小长度',
        maxLength:'最DA长度',
        ispostalcode:'邮政编码'/*,
        method_datagrid_editCell:'datagrid 单元格编辑扩展方法'*/
    }
    var validates=(function(a){
       var arr=[];
       for(var p in a){
           arr.push('commonfuncs/validate/'+p);
       }
       return arr;
    })(validateDesc);

    var init=function(){
        require(validates,function(){})
    }
    return init;
})
