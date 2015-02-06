define(['views/pension/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getallauditrm',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){

                    },
                    striped:true,
                    toolbar:local.find('div[tb]')
                })


            local.find('.highcharstoolbarbutton').click(function(){
                localDataGrid.datagrid('load',{
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val()
                })
            })
        }
    }
})