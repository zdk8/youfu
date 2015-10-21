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

             datas = option.queryParams.datas;

            var field1 = ['zj_name','zj_number','zj_issuedepart','zj_effectdate','zj_invaliddate'];//本人持有因私出国(境)证件情况
            var field2 = ['hd_name','hd_rounddate','hd_roundaddress','hd_reason','hd_channel','hd_fundsource'];//本人及其配偶因私出国(境)和在国(境)外活动情况
            var field3 = ['lx_name','lx_appellation','lx_time','lx_place','lx_yeartuition','lx_fundsource'];//配偶、子女及其配偶出国(境)留学情况
            var field4 = ['th_name','th_department','th_position','th_spouse','th_nationality','th_registertime'];//子女与外国人、港澳台居民通婚情况
            var field5 = ['dj_name','dj_appellation','dj_time','dj_place','dj_work'];//配偶、子女及其配偶出国(境)定居情况

            local.find('[name=cg_id]').val(datas[0].cg_id);
            if(datas != "false"){
                var data = datas[0];
                for(var i=0;i<field1.length;i++){
                    if(data.field1[0] && data.field1[0][field1[i]]){
                        if(local.find('[opt='+field1[i]+']').hasClass('easyui-datebox')){
                            local.find('[opt='+field1[i]+']').datebox('setValue',datas[0].field1[0][field1[i]]);
                        }else{
                            local.find('[opt='+field1[i]+']').val(datas[0].field1[0][field1[i]]);
                        }
                    }
                }
                for(var j=0;j<field2.length;j++){
                    if(data.field2[0] && data.field2[0][field2[j]]){
                        if(local.find('[opt='+field2[j]+']').hasClass('easyui-datebox')){
                            local.find('[opt='+field2[j]+']').datebox('setValue',datas[0].field2[0][field2[j]]);
                        }else{
                            local.find('[opt='+field2[j]+']').val(datas[0].field2[0][field2[j]]);
                        }
                    }
                }
                for(var k=0;k<field3.length;k++){
                    if(data.field3[0] && data.field3[0][field3[k]]){
                        if(local.find('[opt='+field3[k]+']').hasClass('easyui-datebox')){
                            local.find('[opt='+field3[k]+']').datebox('setValue',datas[0].field3[0][field3[k]]);
                        }else{
                            local.find('[opt='+field3[k]+']').val(datas[0].field3[0][field3[k]]);
                        }
                    }
                }
                for(var l=0;l<field4.length;l++){
                    if(data.field4[0] && data.field4[0][field4[l]]){
                        if(local.find('[opt='+field4[l]+']').hasClass('easyui-datebox')){
                            local.find('[opt='+field4[l]+']').datebox('setValue',datas[0].field4[0][field4[l]]);
                        }else{
                            local.find('[opt='+field4[l]+']').val(datas[0].field4[0][field4[l]]);
                        }
                    }
                }
                for(var a=0;a<field5.length;a++){
                    if(data.field5[0] && data.field5[0][field5[a]]){
                        if(local.find('[opt='+field5[a]+']').hasClass('easyui-datebox')){
                            local.find('[opt='+field5[a]+']').datebox('setValue',datas[0].field5[0][field5[a]]);
                        }else{
                            local.find('[opt='+field5[a]+']').val(datas[0].field5[0][field5[a]]);
                        }
                    }
                }
                var childdata_zj = data.field1;
                var childdata_hd = data.field2;
                var childdata_cg = data.field3;
                var childdata_hy = data.field4;
                var childdata_dj = data.field5;
                cj.initTrData(local,'cgjqk_zj',childdata_zj,field1);
                cj.initTrData(local,'cgjqk_hd',childdata_hd,field2);
                cj.initTrData(local,'cgjqk_cg',childdata_cg,field3);
                cj.initTrData(local,'cgjqk_hy',childdata_hy,field4);
                cj.initTrData(local,'cgjqk_dj',childdata_dj,field5);
            }

            /*保存*/
            local.find('[opt=save_cgjqk]').click(function () {
                var $this = $(this);
                $this.attr("disabled",true);//按钮禁用
                var cgjqk_v1 = cj.commonGetValue(local,{field:field1});
                var cgjqk_v2 = cj.commonGetValue(local,{field:field2});
                var cgjqk_v3 = cj.commonGetValue(local,{field:field3});
                var cgjqk_v4 = cj.commonGetValue(local,{field:field4});
                var cgjqk_v5 = cj.commonGetValue(local,{field:field5});
                local.find('[opt=form_cgjqk]').form('submit', {
                    url: 'party/addgoabroad',
                    onSubmit: function (params) {
                        var isValid = $(this).form('validate');
                        if (isValid) {
                            layer.load();
                            params.pr_id = record.pr_id;
                            params.field1 = JSON.stringify(cgjqk_v1);
                            params.field2 = JSON.stringify(cgjqk_v2);
                            params.field3 = JSON.stringify(cgjqk_v3);
                            params.field4 = JSON.stringify(cgjqk_v4);
                            params.field5 = JSON.stringify(cgjqk_v5);
                        }else{
                            layer.closeAll('loading');
                            $this.attr("disabled",false);//按钮启用
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
            });
        }
    }
})