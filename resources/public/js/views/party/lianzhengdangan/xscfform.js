define(function () {
    return {
        render: function (local,option) {
            layer.closeAll('loading');
            local.find('div[opt=formcontentpanel]').panel({
                onResize: function (width, height) {
                    $(this).height($(this).height() - 35);
                }
            });
            local.find('[opt=cancel]').click(function(){
                layer.close(option.queryParams.poption.index);
            });
            cj.common_listFunc(local);//表单动态增减行


            var record = option.queryParams.poption.queryParams.record;
            local.find('[name=name]').val(record.name);
            local.find('[name=workunit]').val(record.workunit);
            local.find('[name=incumbent]').val(record.incumbent);

            var datas = option.queryParams.datas;
            local.find('[name=cf_comments]').val(datas[0].cf_comments);

            var field1 = ['cf_name','cf_relation','cf_position','cf_punishtype'];//配偶、子女及其配偶受到执纪执法机关查处或涉嫌犯罪情况

            for(var i=0;i<field1.length;i++){
                local.find('[opt='+field1[i]+']').val(datas[0].field1[0][field1[i]]);
            }

            local.find('[name=zf_id]').val(datas[0].zf_id);
            if(datas != "false"){
                var data = datas[0];
                var childdata_cc = data.field1;
                cj.initTrData(local,'xscf_cc',childdata_cc,field1);
            }

            /*保存*/
            local.find('[opt=save_xscf]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var xscf_v1 = cj.commonGetValue(local,{field:field1});
                local.find('[opt=form_xscf]').form('submit', {
                    url: 'wwww1',
                    onSubmit: function (params) {
                        var isValid = $(this).form('validate');
                        if (isValid) {
                            layer.load();
                            params.pr_id = record.pr_id;
                            params.field1 = JSON.stringify(xscf_v1);
                        }else{
                            layer.closeAll('loading');
                        }
                        return isValid;
                    },
                    success: function (data) {
                        $this.attr("disabled",false);//按钮启用
                        layer.closeAll('loading');
                        if (data == "true") {
                            cj.showSuccess('保存成功');
                        } else {
                            cj.showFail('保存失败');
                        }
                    }
                })
            })
        }
    }
})