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

            local.find('[name=wifename]').val(datas[0].wifename);
            local.find('[name=wifedepartment]').val(datas[0].wifedepartment);
            local.find('[name=wifeposition]').val(datas[0].wifeposition);
            local.find('[name=zf_other]').val(datas[0].zf_other);

            var field1 = ['xy_address','xy_area','xy_property','xy_source','xy_owner'];//本人、配偶及共同生活的子女现有住房情况
            var field2 = ['sf_address','sf_area','sf_property','sf_selltime','sf_money'];//房屋出售情况
            var field3 = ['cz_address','cz_area','cz_property','cz_deadline','cz_annualrent'];//房屋出租情况
            var field4 = ['jz_address','jz_area','jz_unit','jz_totalamount','jz_payment'];//参加集资建房情况

            local.find('[name=zf_id]').val(datas[0].zf_id);
            if(datas != "false"){
                var data = datas[0];
                for(var i=0;i<field1.length;i++){
                    if(data.field1[0] && data.field1[0][field1[i]]){
                        local.find('[opt='+field1[i]+']').val(data.field1[0][field1[i]]);
                    }
                }
                for(var j=0;j<field2.length;j++){
                    if(data.field2[0] && data.field2[0][field2[j]]){
                        if(local.find('[opt='+field2[j]+']').hasClass('easyui-datebox')){
                            local.find('[opt='+field2[j]+']').datebox('setValue',data.field2[0][field2[j]]);
                        }else{
                            local.find('[opt='+field2[j]+']').val(data.field2[0][field2[j]]);
                        }
                    }
                }
                for(var k=0;k<field3.length;k++){
                    if(data.field3[0] && data.field3[0][field3[k]]){
                        local.find('[opt='+field3[k]+']').val(data.field3[0][field3[k]]);
                    }
                }
                for(var l=0;l<field4.length;l++){
                    if(data.field4[0] && data.field4[0][field4[l]]){
                        local.find('[opt='+field4[l]+']').val(data.field4[0][field4[l]]);
                    }
                }
                var childdata_zf = data.field1;
                var childdata_cs = data.field2;
                var childdata_cz = data.field3;
                var childdata_jf = data.field4;
                cj.initTrData(local,'zfqk_zf',childdata_zf,field1);
                cj.initTrData(local,'zfqk_cs',childdata_cs,field2);
                cj.initTrData(local,'zfqk_cz',childdata_cz,field3);
                cj.initTrData(local,'zfqk_jf',childdata_jf,field4);
            }

            /*保存*/
            local.find('[opt=save_zfqk]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var zfqk_v1 = cj.commonGetValue(local,{field:field1});
                var zfqk_v2 = cj.commonGetValue(local,{field:field2});
                var zfqk_v3 = cj.commonGetValue(local,{field:field3});
                var zfqk_v4 = cj.commonGetValue(local,{field:field4});
                local.find('[opt=form_zfqk]').form('submit', {
                    url: 'party/addhousestatus',
                    onSubmit: function (params) {
                        var isValid = $(this).form('validate');
                        if (isValid) {
                            layer.load();
                            params.pr_id = record.pr_id;
                            params.field1 = JSON.stringify(zfqk_v1);
                            params.field2 = JSON.stringify(zfqk_v2);
                            params.field3 = JSON.stringify(zfqk_v3);
                            params.field4 = JSON.stringify(zfqk_v4);
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