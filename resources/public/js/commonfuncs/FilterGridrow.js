/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        ByFields:function(rows,fieldnames,fieldvalues){
            var filter_arr=[];
            for(var i=0;i<rows.length;i++){
                var isfind=false;
                for(var j=0;j<fieldvalues.length;j++){
                    if(isfind) break;
                    for(var m=0;m<fieldnames.length;m++){
                        if(rows[i][fieldnames[m]]==fieldvalues[j]){
                            filter_arr.push(rows[i]);
                            isfind=true;
                            break;
                        }
                    }

                }

            }
            return filter_arr;
        }

    }

    return a;
});
