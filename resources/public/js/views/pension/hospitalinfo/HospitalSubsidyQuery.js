define(['views/pension/serviceassinfo/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getallaudiths',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                    },
                    striped:true,
                    toolbar:local.find('div[tb]')
                })

            /*年*/
            var yearvalue = local.find("[opt=yearvalue]");
            yearvalue.val(new Date().getFullYear());
            local.find('[opt=yeardel]').click(function () {
                var year=yearvalue.val();
                year=Number(year)-1;
                yearvalue.val(year);
            });
            local.find('[opt=yearadd]').click(function(){
                var year=yearvalue.val();
                year=Number(year)+1;
                yearvalue.val(year);
            });
            local.find('[opt=query]').click(function(){
                localDataGrid.datagrid('load',{
                    year:yearvalue.val(),
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val()
                })
            })
        }
    }
})