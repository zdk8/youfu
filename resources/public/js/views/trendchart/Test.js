define(function(){
    var af=function(d){
        var Doc=window.frames["trendchart"].document;
        function timeFmt(d){
            return d.getDate()+" "+d.getHours()+":"+d.getMinutes();
        }
        function timeFmt2(d){
            return d.getHours()+":"+d.getMinutes()+":"+ d.getSeconds();
        }
        function attrs(attrs) {
            for (var attr in attrs)
                this.setAttribute(attr, attrs[attr]);
        }
        function makeCircle(dest,config,ext) {
            var c = Doc.createElementNS("http://www.w3.org/2000/svg", "circle");
            c.constructor.prototype.attr = attrs;
            c.attr({
                cx: config.cx,
                cy: config.cy,
                r:config.r,
                fill:config.fill,
                style:config.style,
                class:config.class
            });
            c.attr(ext)
            Doc.getElementById(dest).appendChild(c);
        }
        function makeText(dest,config,ext) {
            var c = Doc.createElementNS("http://www.w3.org/2000/svg", "text");
            c.constructor.prototype.attr = attrs;
            c.attr({
                x:config.x,
                y:config.y,
                fill:config.fill,
                style:config.style,
                class:config.class
            });
            c.attr(ext)
            $(c).text(config.text)
            Doc.getElementById(dest).appendChild(c);
        }
        function makeLine(dest,config,ext) {
            var c = Doc.createElementNS("http://www.w3.org/2000/svg", "line");
            c.constructor.prototype.attr = attrs;
            c.attr({
                x1:config.x1,
                y1:config.y1,
                x2:config.x2,y2:config.y2,
                style:config.style
            });
            c.attr(ext)
            $(c).text(config.text)
            Doc.getElementById(dest).appendChild(c);
        }
        function makeOther(dest,config,ext) {
            var c = Doc.createElementNS("http://www.w3.org/2000/svg", "rect");
            c.constructor.prototype.attr = attrs;
            c.attr({
                x1:config.x1,
                y1:config.y1,
                x2:config.x2,y2:config.y2,
                style:config.style
            });
            c.attr(ext)
            $(c).text(config.text)
            Doc.getElementById(dest).appendChild(c);
        }

        var sdata=d||[
            {time:'2014/06/20 22:22:22',value:'59'},
            {time:'2014/06/21 09:52:22',value:'66'},
            {time:'2014/06/21 12:52:22',value:'96'},
            {time:'2014/06/21 22:52:22',value:'66'},
            {time:'2014/06/22 22:22:22',value:'50'},
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
            {time:'2014/06/24 19:39:22',value:'50'},
            {time:'2014/06/26 19:39:22',value:'60'},
            {time:'2014/06/27 19:39:22',value:'80'}
        ];


        $svg=$(Doc).find('svg');
        var viewbox=eval('(['+($svg.attr('viewBox')+'').replace(/ /g,',')+'])');
        var stdUnitX=$svg.attr('width')/viewbox[2];
        var stdUnitY=$svg.attr('height')/viewbox[3];
        var baseline=100*stdUnitY;
        var totalWidth=1000*stdUnitX;

        $(Doc).find('#colorrect').attr({
            x:0,y:0,width:totalWidth,height:baseline
        })

        $(Doc).find('#line2').attr({
            x1:0,y1:baseline,x2:totalWidth,y2:baseline
        })
        $(Doc).find('#line0').attr({
            x1:0,y1:0,x2:totalWidth,y2:0
        })
        $(Doc).find('#linered').attr({
            x1:0,y1:baseline-80,x2:totalWidth,y2:baseline-80
        })
        $(Doc).find('svg circle').attr({
            cx: baseline,
            cy: baseline
        })


        var $bsp=$(Doc).find('#bloodSugerPath');
        var juli=Math.round

        (new Date(sdata[sdata.length-1].time).getTime()-new Date(sdata[0].time).getTime());
        var start=new Date(sdata[0].time).getTime();

        var bottomRule=[];
        bottomRule.push(new Date(sdata[0].time).getTime());

        var rulexlen=10;
        for(var i=0;i<rulexlen;i++){
            var j=i+1;
            bottomRule.push(bottomRule[0]+(juli/rulexlen)*j);
        }

        var temparr=[];
        for(var i in bottomRule){
            var x=(bottomRule[i]-bottomRule[0])*totalWidth/juli;
            temparr.push({
                x:x,
                text:timeFmt(new Date(bottomRule[i]))
            })
        }
        for(var i in temparr){
            makeText('svgroot',{
                style:"font-size:10px",
                x:temparr[i].x,y:baseline+10,
                text:temparr[i].text
            })
            makeLine('svgroot',{
                x1:temparr[i].x,y1:baseline,
                x2:temparr[i].x,y2:baseline+10,
                style:'stroke:red;stroke-width:1'
            })
        }

        for(var i=1;i<sdata.length;i++){
            var x=(new Date(sdata[i].time).getTime()-start)*totalWidth/juli;
            sdata[i].x=x;
            sdata[i].y=sdata[i].value;
        }


        var len=sdata.length;
        var count=0;
        sdata[0].x=0;
        sdata[0].y=sdata[0].value;
        var timer=window.setInterval(function(){
            var i=count;
            var y=baseline-sdata[i].y*40
            if(i==0){
                $bsp.attr('d'," M "+sdata[i].x+","+y);
            }
            $bsp.attr('d',$bsp.attr('d')+" L "+sdata[i].x+","+y);

            makeCircle('svgroot',{
                cx:sdata[i].x,cy:y,r:4,fill:'blue',class:'nodecircle'
            },sdata[i])

            count++;
            if(count>=len){
                window.clearInterval(timer);
                $(Doc).find('circle[class=nodecircle]').on('mouseover',function(e){
                    var $target=$(this);
                    var text=timeFmt2(new Date($target.attr('time')))+",血氧:"+$target.attr('value');
                    var x=$target.attr('cx')*1>850?850:$target.attr('cx');
                    $(Doc).find('#zuobiao').attr({
                        x:x,y:$target.attr('cy')-20
                    }).text(text);

                    $(Doc).find('#movablecircle').attr({
                        cx: $target.attr('cx'),
                        cy: $target.attr('cy')
                    })
                    $(Doc).find('#line3').attr({
                        x1:e.pageX,y1:0,x2:e.pageX,y2:baseline
                    })
                })
            }
        },100);

        tt=sdata;


    }
    return {

        render:function(){
            $.ajax({
                url:preFixUrl+'pension/selectbloodoxybyid',
                data:{
                  sys_micard:'341282195606197360'
                },
                type:'post',
                success:function(res){
                    var d= $.evalJSON(res);
                    for(var i in d){
                        d[i].time=d[i].sys_bomtime.replace('-','/');
                        d[i].value=d[i].sys_bovalue;
                    }
                    window.setTimeout(function(){
                        af(d)
                    },1000);
                }
            })

        }
    }
})