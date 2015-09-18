//文件预览功能
define([], function () {


    var viewImage=function(record){
        layer.photos({
            area: ['860px', '490px'],
            shade: [0.5, '#000'],
            photos: {
                "status": 1,
                "title": record.file_name,
                "id": 8,
                "start": 0,
                "data": [
                    {
                        "name": "越来越喜欢观察微小的事物",
                        "src": 'get-touch?filename='+encodeURI(record.fie_path)
                    }
                ]
            }
        });

        /*联查*/
        /*$.getJSON('data/photos.json', {}, function(json){
            layer.photos({
                photos:json
            })
        });*/
    }
    var viewAsHtml=function(record){
            $.layer({
                type: 2,
                border: [0],
                title: false,
                iframe: {src : 'fileview?filename='+encodeURI(record.fie_path)},
                area: ['860px', '490px']
            });
    }
    var viewText=function(record){
        $.layer({
            type: 2,
            border: [0],
            title: false,
            iframe: {src : 'mzfile/preview2?filename='+encodeURI(record.filepath)},
            area: ['860px', '490px']
        });
    }
    var render = function (opt, record) {

        var filepath=record.fie_path;
        var FileExt=filepath.replace(/.+\./,"").toLowerCase();   //正则表达式获取后缀
        switch (FileExt){
            case "jpg":
            case "png":
                viewImage(record);break;
            case "doc":
            case "docx":
            case "xls":
            case "xlsx":
                viewAsHtml(record);break;
            case "txt":
                viewText(record);break;
            default :break;

        }

    }
    return {
        render: render
    }
})