define(function () {
    var render = function (f) {
        $("#file_upload").uploadify({
            buttonClass: 'some-wclass', buttonText: '选择文件...',
            auto: false,
            height: 30,
            uploadLimit: 4,
            swf: 'js/jqueryplugin/upload/uploadify.swf',
            uploader: 'http://192.168.2.2:8080/jasper/upload',
            onUploadSuccess: function (file, data, response) {
                var d = eval('(' + data + ')');
                if (d.filepath) {
                    $('#file_upload_message').text(d.filepath)
                }
                f(data)
            }
        });
    }

    return {show0: function (f) {
        require(['text!commonfuncs/Upload.htm'], function (uploadhtm) {
            $.webox({
                height: 250,
                width: 450,
                bgvisibel: true,
                title: '<<span style="color: green;">上传</span>>',
                html: uploadhtm
            });
            render(f);
        })
    },show: function (f) {
        $.webox({
            height: 320,
            width: 370,
            bgvisibel: true,
            title: '<<span style="color: green;">上传</span>>',
            iframe:uploadBase+'upload.jsp'
        });
        $('.webox iframe').bind('callfn',f);
        $('.webox iframe').bind('callfn',function(){
            $('.webox').css({display:'none'});
            $('.background').css({display:'none'});
        });
    }}
})