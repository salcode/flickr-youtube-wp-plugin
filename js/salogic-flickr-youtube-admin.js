// BEGIN: flickr
(function() {
    var sets
        , setPos
        , setsLength
        , i
        , increment = typeof flickrAdminSetsPerPage === 'number' ? flickrAdminSetsPerPage : 5;

    jQuery(document).ready(function($) {
        $('#salogic-flickr-photosets-load-more').on('click', function(e) {
            // currently, simply revealing hidden items
            // due to flickr api 3.1 photosets_getList does NOT support $page and $perPage parameters on api call
            // ultimatley, this will be an ajax call

            e.preventDefault();
            e.stopImmediatePropagation();

            if (
                typeof sets           !== 'object'
                || typeof setPos      !== 'number'
                || typeof setsLength  !== 'number'
            ) {
                // first time called, initialize values

                // load sets
                sets = jQuery('#salogic-flickr-photosets').find('>li');
                setsLength = sets.length;

                setPos = 0;
                while (
                    // increment to the first NON-visible set
                    !$(sets[setPos]).hasClass('hidden')
                    // without going past the end of the list
                    && setPos < setsLength
                ) {
                    setPos++;
                }
            } // if first time called

            // make visible next increment number of sets
            for (i=0; i<increment && (setPos+i<setsLength); i++) {
                $(sets[setPos + i]).removeClass('hidden');
            }

            if (setPos+increment >= setsLength) {
                // we are at the end of the sets,
                // hide load more button (preventing this function from being called again)
                $(this).hide();
            }
            setPos += increment;

        }); // click #salogic-flickr-photosets-load-more
    }); // document.ready
} )();
// END: flickr

// BEGIN: youtube
(function() {
    var youTubeIds
        , $videos
        // youTubeApiIndex - starting index value (one-based index) 
        // https://developers.google.com/youtube/2.0/developers_guide_protocol_api_query_parameters#start-indexsp
        , youTubeApiIndex = 1
        , htmlRowsToAdd = '';


    // getYouTubeIds that were loaded from WP and need to be replaced with titles/imgs
    var getYouTubeIds = function($videos) {
        var youTubeIds = []; // note: same variable name as "global" variable
        $videos.find('>li').each( function() {
            youTubeIds.push( jQuery(this).attr('data-youtube-id') );
        });
        return youTubeIds;
    }; // getYouTubeIds()

    var getVideoObjectFromEntry = function(entry) {
        return {
            'title': getYouTubeTitleFromEntry( entry )
            , 'id': getYouTubeIdFromEntry( entry )
        };
    }; // getVideoObjectFromEntry()
    var getYouTubeIdFromEntry       = function(entry) { return entry.media$group.yt$videoid.$t; };
    var getYouTubeTitleFromEntry    = function(entry) { return entry.title.$t; };

    var getAjaxObj = function(ajaxObj) {
        // merge parater object with default object
        return jQuery.extend(
            true // deep (recursive) merge
            // defaults
            , {
                type: 'POST'
                , dataType: 'jsonp'
                , data: {
                    'alt': 'json'
                    // version 2 of the api https://developers.google.com/youtube/2.0/developers_guide_protocol_video_feeds
                    , 'v': 2
                }
            },
            ajaxObj
        );
    }; // getDefaultAjaxObj()

    var ajaxVideoLoadByYouTubeIds = function(args) {
        if (!args.youTubeIds) {
            return;
        }
        var ajaxObj = getAjaxObj({ success: ajaxVideoSingleLoadSuccess });

        jQuery.each(args.youTubeIds, function(index, youTubeId) {
            ajaxObj.url = 'https://gdata.youtube.com/feeds/api/videos/'+youTubeId;
            jQuery.ajax( ajaxObj );
        }); // each youTubeId

    }; // ajaxVideoLoadByYouTubeIds()

    var ajaxVideoBatchLoad = function(args) {
        var args = jQuery.extend({
                // default args
                'max-results': (typeof youTubeAdminSetsPerPage=='number' ? youTubeAdminSetsPerPage : 5)
                , 'start-index': 1
                , 'userId':  (typeof youTubeUserName=='string' ? youTubeUserName : 'youtube')
            }, args)

            , ajaxObj = getAjaxObj({
                url: 'http://gdata.youtube.com/feeds/api/users/'+args['userId']+'/uploads'
                , data: {
                    'max-results': args['max-results']
                    , 'start-index': args['start-index']
                }
                , success: ajaxVideoBatchLoadSuccess
            });

        // load videos from the designated user
        jQuery.ajax( ajaxObj );

        // increment youTubeApiIndex, in preparation for the user
        // clicking to manually load more videos
        youTubeApiIndex += args['start-index']+args['max-results']

    }; // ajaxVideoBatchLoad()

    // when data is loaded from database it ONLY has the YouTube ID
    // we use that information as a placeholder, waiting for the actual data to be loaded
    var replaceYouTubePlaceholder = function(video) {
        $videos.find('>li[data-youtube-id='+video.id+']').find('.title').text( video.title );
    }; // replaceYouTubePlaceholder()

    var markupToAppendToYouTubeList = function(video) {
        return '<li data-youtube-id="' + video.id + '">'
            + '<label class="selectit salogic-image-preview-label">'
            + '<input type="checkbox" value="' + video.id + '" name="salogic_youtube_list[]"> '
            + '<span class="title">' + video.title + '</span>'
            + '<img alt="' + video.id + '" src="http://img.youtube.com/vi/' + video.id + '/default.jpg">'
            + '</label>'
            + '</li>';
    };

    var ajaxVideoSingleLoadSuccess = function(response, textStatus, XMLHttpRequest) {
        var htmlToAppend = ''
            , video = getVideoObjectFromEntry(response.entry)
            , youTubeIdsIndex = jQuery.inArray(video.id, youTubeIds);
        if ( youTubeIdsIndex !== -1 ) {
            // this video is already listed
            // (e.g. it appears in youTubeIds)
            // replace placeholder for it
            replaceYouTubePlaceholder(video);
        } else {
            // this video is NOT already listed
            // append to list
            htmlToAppend += markupToAppendToYouTubeList(video);
        }
        // append any new items we've calculated the javascript for
        $videos.append(htmlToAppend);
    }; // ajaxVideoSingleLoadSuccess()

    var ajaxVideoBatchLoadSuccess = function(response, textStatus, XMLHttpRequest) {
        var htmlToAppend = '';

        jQuery.each(response.feed.entry, function(index, entry) {
            // NOTE / TODO? : this code is very similar to ajaxVideoSingleLoadSuccess
            // and should probably be combined
            // currently kept separate so we can create all the of the new
            // html as text and insert it into the DOM all at once
            var video = getVideoObjectFromEntry(entry)
                , youTubeIdsIndex = jQuery.inArray(video.id, youTubeIds);

            if ( youTubeIdsIndex !== -1 ) {
                // this video is already listed
                // (e.g. it appears in youTubeIds)
                // replace placeholder for it
                replaceYouTubePlaceholder(video);
            } else {
                // this video is NOT already listed
                // append to list
                htmlToAppend += markupToAppendToYouTubeList(video);
            }
        }); // each entry

        // append any new items for which we've calculated the html
        $videos.append(htmlToAppend);

        // load video details for any video not loaded as a recent video
        // i.e. if we have any placeholders that have not been replaced,
        // look them up and replace them
        ajaxVideoLoadByYouTubeIds({'youTubeIds': youTubeIds});

    }; // ajaxVideoBatchLoadSuccess()

    jQuery(document).ready(function($) {
        $videos = $('#salogic-youtube-videos');

        $('#salogic-youtube-videos-load-more').on('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            ajaxVideoBatchLoad({
                'start-index': youTubeApiIndex
            });
        }); // on click load more youtube videos


        // getYouTubeIds
        youTubeIds = getYouTubeIds( $videos );

        // load n most recent videos
        // (in the callback we load any videos that were loaded from WordPress but are still placeholders)
        ajaxVideoBatchLoad();

    }); // document.ready
} )();
// END: youtube

