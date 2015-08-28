define(function () {
    return{
        render: function (local,option) {
            local.find('[opt=status]');
            var aulevel = option.aulevel;
            var status = '<li class="step-first step-pass"><div class="step-name">新增申请</div><div class="step-no">&nbsp;</div></li>' +
                '<li class="step-pass"><div class="step-name">已评估</div><div class="step-no">&nbsp;</div></li>';


            if(aulevel == "1" || aulevel == "4"){//审核
                status += '<li><div class="step-name step-name-b">待街道审核</div><div class="step-no">3</div></li>' +
                            '<li class="step-last"><div class="step-name ">待民政局审核</div><div class="step-no">4</div></li>';
                local.find('.flowstep-6').html(status);
            }else if(aulevel == "2" || aulevel == "5"){//审批
                status += '<li class="step-pass"><div class="step-name">街道已审核</div><div class="step-no">3</div></li>' +
                        '<li class="step-last "><div class="step-name step-name-b">待民政局审核</div><div class="step-no">4</div></li>';
                local.find('.flowstep-6').html(status);
            }else{
                status += '<li class="step-pass"><div class="step-name">街道已审核</div><div class="step-no">3</div></li>' +
                '<li class="step-last step-pass"><div class="step-name">民政局已审核</div><div class="step-no">4</div></li>';
                local.find('.flowstep-6').html(status);
            }
        }
    }
})