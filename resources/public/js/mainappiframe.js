/**
 * Created by weipan on 14-10-24.
 */
requirejs.config({

    urlArgs: "dc_=" +  (new Date()).getTime()

});
var widgetcmp=pagename.replace(/\./g,'/');
require(['text!views/'+widgetcmp+'.htm','views/'+widgetcmp],function(htm,js){
    var localtab = $('body').append(htm);
    $.parser.parse(localtab.find('div[opt=pensionbutton]').parent())
    js.render(localtab,{act:'c'})
})
