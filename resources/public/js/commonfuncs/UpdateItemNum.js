/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={

        updateitemnum: function (item, count,bf,af) {
            var text = '';
            text =item.text();
            var before_str = text.slice(0, text.indexOf(bf) + 1);
            var after_str = text.slice(text.indexOf(af));
            item.text(before_str + count + after_str);

        }

    }

    return a;
});
