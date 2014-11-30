approvalProcess=['打回重审','提交未审核','审核未审批','审批通过','保存未提交'];    //流程状态
/*流程状态*/
/*getApprovalProcess = function(value){
    var approvalProcess = ['保存','提交未审核','审核未审批','审批通过'];
//    var approvalProcessNull = ['保存'];
    if(value == "" || value == null){
        return approvalProcess[0]
    }else{
        return approvalProcess
    }
}*/
//approvalProcess=['自由','提交','审核','审批'];    //流程状态
getGender=['男','女']             //性别
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