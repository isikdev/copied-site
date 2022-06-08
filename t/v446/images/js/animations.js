;(function($, undefined) {
	
	/***/
	var objs = {
	'.title-page .block-6' : 'fadeIn d2',
	'.title-page .blocklist-19 .item' : 'zoomIn d2',
	'.title-page .blocklist-25 .item' : 'zoomIn d2',
	'.title-page .block-18' : 'fadeIn d2',
	'.title-page .block-20' : 'fadeInUp'
	};
	/***/
	
	
	$(function() {
		for (var i in objs) {
			$(i).attr('data-s3-animator', objs[i]);
		}
	})
	var url = '/g/s3/misc/animator/1.0.0/css/s3.animator.scss.css';
	$.get(url, function(){
                    $('<link>', {rel:'stylesheet', type:'text/css', 'href':url}).appendTo('head');
                    if (!window.s3Animator) {
					$.getScript('/g/s3/misc/animator/1.1.0/js/s3.animator.js').done(function() {
						window.s3Animator.once = true;
					});
	}
    });
})(jQuery)