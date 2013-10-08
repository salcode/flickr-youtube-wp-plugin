// BEGIN Tooltip Plugin by Flowplayer
/* tools.tooltip 1.0.2 - Tooltips done right.
 * Copyright (c) 2009 Tero Piirainen
 * http://flowplayer.org/tools/tooltip.html
 * Dual licensed under MIT and GPL 2+ licenses http://www.opensource.org/licenses
 * Launch  : November 2008 Date: 2009-06-12 11:02:45 +0000 (Fri, 12 Jun 2009) Revision: 1911
 */
(function(c){c.tools=c.tools||{version:{}};c.tools.version.tooltip="1.0.2";var b={toggle:[function(){this.getTip().show()},function(){this.getTip().hide()}],fade:[function(){this.getTip().fadeIn(this.getConf().fadeInSpeed)},function(){this.getTip().fadeOut(this.getConf().fadeOutSpeed)}]};c.tools.addTipEffect=function(d,f,e){b[d]=[f,e]};c.tools.addTipEffect("slideup",function(){var d=this.getConf();var e=d.slideOffset||10;this.getTip().css({opacity:0}).animate({top:"-="+e,opacity:d.opacity},d.slideInSpeed||200).show()},function(){var d=this.getConf();var e=d.slideOffset||10;this.getTip().animate({top:"-="+e,opacity:0},d.slideOutSpeed||200,function(){c(this).hide().animate({top:"+="+(e*2)},0)})});function a(f,e){var d=this;var h=f.next();if(e.tip){if(e.tip.indexOf("#")!=-1){h=c(e.tip)}else{h=f.nextAll(e.tip).eq(0);if(!h.length){h=f.parent().nextAll(e.tip).eq(0)}}}function j(k,l){c(d).bind(k,function(n,m){if(l&&l.call(this)===false&&m){m.proceed=false}});return d}c.each(e,function(k,l){if(c.isFunction(l)){j(k,l)}});var g=f.is("input, textarea");f.bind(g?"focus":"mouseover",function(k){k.target=this;d.show(k);h.hover(function(){d.show()},function(){d.hide()})});f.bind(g?"blur":"mouseout",function(){d.hide()});h.css("opacity",e.opacity);var i=0;c.extend(d,{show:function(q){if(q){f=c(q.target)}clearTimeout(i);if(h.is(":animated")||h.is(":visible")){return d}var o={proceed:true};c(d).trigger("onBeforeShow",o);if(!o.proceed){return d}var n=f.position().top-h.outerHeight();var k=h.outerHeight()+f.outerHeight();var r=e.position[0];if(r=="center"){n+=k/2}if(r=="bottom"){n+=k}var l=f.outerWidth()+h.outerWidth();var m=f.position().left+f.outerWidth();r=e.position[1];if(r=="center"){m-=l/2}if(r=="left"){m-=l}n+=e.offset[0];m+=e.offset[1];h.css({position:"absolute",top:n,left:m});b[e.effect][0].call(d);c(d).trigger("onShow");return d},hide:function(){clearTimeout(i);i=setTimeout(function(){if(!h.is(":visible")){return d}var k={proceed:true};c(d).trigger("onBeforeHide",k);if(!k.proceed){return d}b[e.effect][1].call(d);c(d).trigger("onHide")},e.delay||1);return d},isShown:function(){return h.is(":visible, :animated")},getConf:function(){return e},getTip:function(){return h},getTrigger:function(){return f},onBeforeShow:function(k){return j("onBeforeShow",k)},onShow:function(k){return j("onShow",k)},onBeforeHide:function(k){return j("onBeforeHide",k)},onHide:function(k){return j("onHide",k)}})}c.prototype.tooltip=function(d){var e=this.eq(typeof d=="number"?d:0).data("tooltip");if(e){return e}var f={tip:null,effect:"slideup",delay:30,opacity:1,position:["top","center"],offset:[0,0],api:false};if(c.isFunction(d)){d={onBeforeShow:d}}c.extend(f,d);this.each(function(){e=new a(c(this),f);c(this).data("tooltip",e)});return f.api?e:this}})(jQuery);
// END Tooltip Plugin by Flowplayer

// BEGIN on document ready
jQuery(document).ready(function($){
    // BEGIN: single photoset (php load), js enhancements (lightbox and tooltip)
    $('.salogicphotoset').each(function() {
        $(this)
        .find('a.trigger')
            .colorbox({
                maxWidth: '100%',
                maxHeight: '100%',
                transition:'elastic'
            }) // init lightbox (colorbox)
            .tooltip({
                offset: [-45, 0]
            })
        .end()
        .find('a.youtubetrigger')
            .each(function() {
                // convert youtube url to embed url
                var result_regex =  // find youtube id
                    /watch\?v=([\d\w-]*)/i.exec(
                        $(this).attr('href')
                    );
                if (result_regex.length > 1) { // verify youtube id was found
                    // replace url
                    $(this).attr(
                        'href',
                        "http://www.youtube.com/embed/"+result_regex[1] // new url
                    );
                } // if youtube id found
            }) // each
            .colorbox({
                iframe:true,
                innerWidth:425,
                innerHeight:344
            })
            .tooltip({
                offset: [-45, 0]
            });
    }); // each salogicphotoset

    $('#singleslideshow').colorbox({
            maxWidth: '100%',
            maxHeight: '100%',
            transition:'elastic'
    }); // init lightbox (colorbox)

    // END: single photoset (php load), js enhancements (lightbox and tooltip)

    // links with rel='external' open in new window
    jQuery('a[rel*=external]').attr('target', '_blank');

    // break us out of any containing iframes
    if (top != self) { top.location.replace(self.location.href); }

    jQuery('html').removeClass('no-js');

/*
    // BEGIN: photoset list javascript ajax load (used on homepage and media page)
    var photosetlist = function(target) {
         $(target)
            .delegate("a.arrow", "click", function() {
                var arrow = this,
                    photoset_id =  // find flickr id
                        /[\d\w-]*$/i.exec(
                        $(this).attr('href')
                    )[0];
                $(this).toggleClass('open');
                container = $(this).parent().parent();
                if($(this).hasClass('open')) {
                    // open gallery
                    if ($(this).hasClass('loaded')) {
                        // gallery was previously loaded
                        $(container).find('div.photoset').show();
                    } else {
                        // first time gallery is loaded
                        $.ajax({
                            url: 'photoset.php',
                            data: "id="+photoset_id,
                            datatype: 'html',
                            context: '#photoset',
                            beforeSend: function() {
                                var photoset_slideshow;

                                // display loading screen
                                $(container).append("<div class='loadingmsg'>Loading...</div>");


                            },
                            success: function(html) {
                                // pull only photoset info, remove id, add classes
                                var photoset = $(html).find('#photoset');
                                $(photoset).attr('id', '').addClass('photoset jsme');

                                // display slideshow link
                                photoset_slideshow =
                                    $("<a class='slideshow' href='slideshow_ajax.php?width=650&amp;height=490&amp;id="+ photoset_id + "'>Slideshow</a>")
                                    .colorbox({
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        transition: 'elastic'
                                    });
                                $(photoset).prepend(photoset_slideshow);

                                $(container)
                                    .append(photoset)
                                    .find('a.trigger')
                                        .addClass('lbme')
                                        .colorbox({
                                           maxWidth: '100%',
                                            maxHeight: '100%',
                                            transition:'elastic'
                                        }) // init lightbox (colorbox)
                                        .tooltip({
                                            offset: [30, 0]
                                        }).end()
                                    .find('a.youtubetrigger')
                                        .each(function() {
                                            // convert youtube url to embed url
                                            var result_regex =  // find youtube id
                                                /watch\?v=([\d\w-]*)/i.exec(
                                                    $(this).attr('href')
                                                );
                                            if (result_regex.length > 1) { // verify youtube id was found
                                                // replace url
                                                $(this).attr(
                                                    'href',
                                                    "http://www.youtube.com/embed/"+result_regex[1] // new url
                                                );
                                            } // if youtube id found
                                        })
                                        .colorbox({
                                            iframe:true,
                                            innerWidth:425,
                                            innerHeight:344
                                        })
                                        .tooltip({
                                            offset: [30, 0]
                                        });

                                // hide loading msg
                                $(container).find('div.loadingmsg').hide();

                                $(arrow).addClass('loaded');
                            },
                            error: function() {
                                alert('an error occurred');
                            }

                        });
                    } // if / else (prev loaded / virgin gallery)

                } else {
                    // close gallery
                    $(container).find('div.photoset').hide();
                }
                return false;
            });
    }; // function photosetlist
    var list_of_photosets = $('#photosetlist');
    if (list_of_photosets.length) {
        // #photosetlist exists
        photosetlist(list_of_photosets);
    } // if #photosetlist exists
    // END: photoset list javascript ajax load
    */

});
// END on document ready
