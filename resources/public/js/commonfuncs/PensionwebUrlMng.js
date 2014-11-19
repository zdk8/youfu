/**
 * Created with IntelliJ IDEA.
 * User: admin
 * Date: 7/28/14
 * Time: 9:13 AM
 * To change this template use File | Settings | File Templates.
 */

define(function(){
    var urls=[

        {name:"pensionweb@DoctorInfo",url:[
            {c:'pension/addmbhealthbycard'},
            {r:''},
            {u:'pension/updatedoctorbyid'},
            {d:''},
            {mr:'pension/getdoctorbymid'}
        ]},

        {name:"pensionweb@MedicalInstitutionInfo",url:[
            {c:'pension/addmbhealthbycard'},
            {r:''},
            {u:'pension/updatedoctorbyid'},
            {d:''},
            {mr:'pension/getallmdclsinfo'}
        ]}
    ]

    function  indexOf(a,p,v){
        for(var i in a){
           if(a[i][p]==v){
               console.log(a[i])
               return a[i];
           }
        }
    }

    return {
        getUrl:function(filepath,action){
            var u=filepath.replace(/\//g,'@');
            var myu=indexOf(urls,'name',u);
            var a=myu.url;
            for(var i in a){
                for(var p in a[i]){

                    if(p==action){
                        console.log(preFixUrl+a[i][p])
                        return preFixUrl+a[i][p]
                    }
                }
            }
            return 'noactionfound'
        }
    }
})