define(function(){
    var render=function () {


        var sdata=[
            {time:'2014/06/20 22:22:22',value:'0'},
            {time:'2014/06/20 22:22:22',value:'59'},
            {time:'2014/06/21 09:52:22',value:'66'},
            {time:'2014/06/21 12:52:22',value:'76'},
            {time:'2014/06/21 22:52:22',value:'90'},
            {time:'2014/06/22 22:22:22',value:'80'},
            {time:'2014/06/23 12:22:22',value:'53'},
            {time:'2014/06/23 12:52:22',value:'63'},
            {time:'2014/06/23 14:22:22',value:'58'},
            {time:'2014/06/24 09:32:22',value:'60'},
            {time:'2014/06/24 10:52:22',value:'50'},
            {time:'2014/06/24 17:22:22',value:'59'},
            {time:'2014/06/24 17:52:22',value:'53'},
            {time:'2014/06/24 18:22:22',value:'52'},
            {time:'2014/06/24 18:24:22',value:'70'},
            {time:'2014/06/24 18:25:22',value:'69'},
            {time:'2014/06/24 18:35:22',value:'63'},
            {time:'2014/06/24 18:55:22',value:'55'},
            {time:'2014/06/24 19:39:22',value:'100'}
        ];
        var $bsp=$('#bloodSugerPath');
        var avgtimestd=1000;
        var totalWidth=900;
        var juli=Math.round((new Date(sdata[sdata.length-1].time).getTime()-new Date(sdata[0].time).getTime())/avgtimestd);
        var start=new Date(sdata[0].time).getTime();

        for(var i=1;i<sdata.length;i++){
            var x=((new Date(sdata[i].time).getTime()-start)/avgtimestd)*totalWidth/juli;
            sdata[i].x=x;
            sdata[i].y=sdata[i].value;
        }


        var len=sdata.length;
        var count=0;
        var jx=100;
        sdata[0].x=0;
        sdata[0].y=sdata[0].value;
        var timer=window.setInterval(function(){
            var i=count;
            if(i==0){
                $bsp.attr('d'," M "+sdata[i].x+","+(sdata[i].y));
            }
            $bsp.attr('d',$bsp.attr('d')+" L "+sdata[i].x+","+(sdata[i].y));
            count++;
            if(count>=len){
                window.clearInterval(timer);
            }
        },100);

        $('#line2').attr({
            x1:0,y1:jx,x2:totalWidth,y2:jx
        })
        $('#linered').attr({
            x1:0,y1:jx-60,x2:totalWidth,y2:jx-60
        })
        $("svg path").on("hover", function(event){


            $('#zuobiao').text(event.pageX+","+event.pageY)
            $('#mousepoint').attr({
                cx:event.pageX,
                cy:event.pageY
            })
            $('#test').attr({
                top:event.pageY,
                left:event.pageX
            })
        });
        $('#mousepoint').on('click',function(event){
            $('#zuobiaoyuan').text(event.pageX+","+event.pageY)
        })




    }
    return {
        render:render
    }
})