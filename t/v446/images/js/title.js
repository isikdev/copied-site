;(function($) {
	// wrap tables in content for swipe on mobile devices
	$(function() {
		var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);

		$('article.content').find('table').wrap('<div class="for-mobile-view"></div>');

		if(isMobile){
			$('html').addClass('mobile');
		}
		var videos = [];
		$('[data-video-src]').each(function(i, e) {
			var video = {
				src: $(e).data('video-src'),
				autoplay: $(e).data('video-autoplay'),
				loop: $(e).data('video-loop'),
				poster: $(e).data('video-poster')
			};
			if (video.src && !$(e).find('>.wm-video').size()) {
				var srcs = video.src.split(';');
				var wrapper = document.createElement('div');
				wrapper.className = 'wm-video';

				var videoEl = document.createElement('video');

				if (video.autoplay) {
					videoEl.autoplay = video.autoplay;
				}
				if (video.loop) {
					videoEl.loop = video.loop;
				}
				if (video.poster) {
					videoEl.poster = video.poster;
				}
				videos.push({
					el: $(e),
					wrapper: $(wrapper),
					video: $(videoEl)
				});
				addEvent(videoEl, i);
				videoEl.src = video.src;
				$(wrapper).append(videoEl);
				$(e).prepend(wrapper);
				if (video.autoplay) {
					try {
						videoEl.play();
					} catch (e) {}
				}
			}
		});
		function addEvent(v, i) {
			v.addEventListener( "loadedmetadata", function () {
				calcPosItem(i);
			}, false );
		}
		function calcPosItem(i) {
			var c = videos[i].video[0].videoWidth/videos[i].video[0].videoHeight;
			var d = videos[i].el.width()/videos[i].el.height();
			if(c > d) {
				videos[i].wrapper.addClass('vertical');
			} else {
				videos[i].wrapper.removeClass('vertical');
			}
		}
		function calcPos() {
			for (var i = 0; i < videos.length; i++) {
				calcPosItem(i);
			}
		}
		$(window).resize(calcPos);
	});
}(jQuery));$(function() {
	$('.up_button').click(function () {
		var up_speed = $(this).data('speed')
		$('body, html').animate({
			scrollTop: 0
		}, up_speed);
	});
});
/*
 *  Menu columns v1.0.0
 *  K.I. 433
 */
;(function ($, window, document, undefined) {
	var $win = $(window);
	var pluginName = 'menuColumns';
	var defaults = {
		menuContainer: '.menu-columns-content',
		itemsWrapClass: 'menu-columns-items',
		colTableClass: 'columns-table',
		colCellClass: 'columns-cell',
		colCellDelimClass: 'columns-cell-delim',
		colDelimClass: 'columns-delimiter',
		columns: '5,4,3,2,1',
		has_delimiters: false,
		onAfterInit: $.noop
	};
	var mediaTypeOld, mediaType, menuTimeoutID;

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options, $(this.element).data());

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {
		init: function() {
			if (window.matchMedia('all and (max-width: 480px)').matches) {
				mediaType = 'mobile_portrait';
			} else if (window.matchMedia('all and (max-width: 640px)').matches) {
				mediaType = 'mobile_landscape';
			} else if (window.matchMedia('all and (max-width: 768px)').matches) {
				mediaType = 'tablet_portrait';
			} else if (window.matchMedia('all and (max-width: 960px)').matches) {
				mediaType = 'tablet_landscape';
			} else {
				mediaType = 'screen';
			}
			var $elem = $(this.element), colTable;
			var menuInPanel = false;
			var widgetClass = $elem.attr('class').match(/widget-\d+/)[0];
			// Проверка на наличие меню в Side panel
			if (window.side_panel_controller && side_panel_controller.inPanel(widgetClass)) {
				menuInPanel = true;
			}

			if (mediaTypeOld !== mediaType || mediaType !== this.element.getAttribute('data-media') || menuInPanel) {
				if (menuInPanel) {
					colTable = this._createMenuColumns($elem, 'inPanel');
				} else {
					colTable = this._createMenuColumns($elem, mediaType);
				}
				this.options.onAfterInit.call(this, colTable);
			}

			mediaTypeOld = mediaType;
		},
		update: function () {
			this.init();
		},
		_createMenuColumns: function(menuWrap, mediaT) {
			var options = this.options;
			var colArr = options.columns.split(',');

			clearTimeout(menuTimeoutID);

			var wrapMedia = menuWrap.attr('data-media');
			if (!wrapMedia) {
				menuWrap.attr('data-media', mediaT);
			}
			// Блок с меню
			var menuContent = menuWrap.find(options.menuContainer).eq(0);
			// Контейнер меню
			var menuItemsWrap = menuWrap.find('.'+options.itemsWrapClass).eq(0);
			var menuItemsWrapClone = menuItemsWrap.clone();

			menuItemsWrapClone.css({
				'display': '',
				'width': ''
			}).removeClass('removed');
			// Пункты меню
			var menuInnerHtml = menuItemsWrap.html();
			var menuItems = menuItemsWrap.children();
			var menuItemsLen = menuItems.length;
			// Делители в меню
			var menuHasDelim = false, delimLi;
			var menuLiDelim = menuItems.filter('.delimiter');
			if (menuWrap.attr('data-menu_delim')) {
				menuHasDelim = true;
			}
			if (menuLiDelim.length || menuHasDelim) {
				menuHasDelim = true;
				menuLiDelim.remove();
				menuItems = menuItemsWrap.children();
				menuItemsLen = menuItems.length;
				delimLi = $('<li class="delimiter"></li>');
			}
			if (wrapMedia !== mediaT) {
				var oldColumnsTable = menuWrap.find('.' + options.colTableClass);
				if (oldColumnsTable) {
					oldColumnsTable.remove();
					menuItemsWrap.css('display', '').removeClass('removed');
				}
				// Количество колонок
				var columnsCount = 1;
				var delimOpt = options.has_delimiters.split(',');
				var delimCount = 0;
				if (mediaT === 'screen') {
					columnsCount = parseInt(colArr[0]);
				} else if (mediaT === 'tablet_landscape') {
					columnsCount = parseInt(colArr[1]);
				} else if (mediaT === 'tablet_portrait') {
					columnsCount = parseInt(colArr[2]);
				} else if (mediaT === 'mobile_landscape') {
					columnsCount = parseInt(colArr[3]);
				} else if (mediaT === 'mobile_portrait') {
					columnsCount = parseInt(colArr[4]);
				} else if (mediaT === 'inPanel') {
					columnsCount = 1;
				}
				if (menuItemsLen < columnsCount) {
					columnsCount = menuItemsLen;
				}
				// Количество делителей
				if (delimOpt[0] === '1') {
					delimCount = columnsCount - 1;
				}
				// Таблица для колонок
				var columnsTable = $('<div class="'+options.colTableClass+'"></div>');
				var itemsWrapArray = [];
				var tableString = '';
				var delimInner = '';
				if (delimOpt[1] === '1') {
					delimInner = '<div class="'+options.colDelimClass+'"></div>';
				}
				// Создание оберток для пунктов меню
				var newMenuUl = $('<ul class="'+options.itemsWrapClass+'"></ul>');
				// Создание колонок
				for (var cellInd = 0; cellInd < columnsCount; cellInd++) {
					if (cellInd > 0 && delimCount) {
						tableString += '<div class="'+options.colCellDelimClass+'">' + delimInner + '</div>';
					}
					tableString += '<div class="'+options.colCellClass+'"></div>';
					if (columnsCount > 1) {
						itemsWrapArray.push(newMenuUl.clone());
					}
				}
				// Колонки
				columnsTable.html(tableString);
				menuContent.append(columnsTable);
				var columnsCells = menuWrap.find('.'+options.colCellClass);
				// Первая колонка
				var firstCell = columnsCells.first();

				if (columnsCount === 1) {
					firstCell.append(menuItemsWrapClone);
				} else {
					// Установка ширины меню
					menuItemsWrap.width(firstCell.width());
					// Параметры для распределения пунктов меню
					var menuHeight = menuItemsWrap.height();
					var avgColumn = Math.ceil(menuHeight / columnsCount);
					var heightCounter = 0;
					var menuArrInd = 0;
					var remColumn, remItems, newAvgColumn;
					// Вычисление и распределение пунктов
					menuItems.each(function(itemInd){
						var currItem = $(this);
						var currHeight = currItem.outerHeight(true);
						var itemClone = currItem.clone();

						var nextItem = currItem.next();
						var nextHeight = 0;
						if (nextItem) {
							nextHeight = nextItem.height();
						}
						if (menuArrInd >= columnsCount) {
							menuArrInd = columnsCount - 1;
						}
						// Добавление делителей в меню
						if (menuHasDelim) {
							itemsWrapArray[menuArrInd].append(delimLi.clone());
						}
						// Добавление клона пункта в колонку
						itemsWrapArray[menuArrInd].append(itemClone);
						// Счетчик
						menuHeight -= currHeight;
						heightCounter += currHeight;

						if (menuHeight) {
							remColumn = columnsCount - (menuArrInd + 1);
							remItems = menuItemsLen - (itemInd + 1);
							newAvgColumn = menuHeight / remColumn;

							var surplus = newAvgColumn - heightCounter;

							var testA = remItems <= remColumn;
							var testB = nextHeight >= newAvgColumn;
							var testC = surplus <= nextHeight/2;
							var testD = avgColumn >= newAvgColumn && heightCounter >= newAvgColumn;

							if (testA || testB || testC || testD) {
								heightCounter = 0;
								menuArrInd++;
							}
						}
					});
					// Вставка распределенных пунктов в таблицу
					columnsCells.each(function(index) {
						var thisColumn = $(this);
						var columnMenu = itemsWrapArray[index];
						var colimnItems = columnMenu.children();
						if (colimnItems.length) {
							if (menuHasDelim) {
								if (colimnItems.first().hasClass('delimiter')) {
									colimnItems.first().remove();
								}
							}
							thisColumn.append(columnMenu);
						}
					});
				}
				// Скрытие меню
				menuItemsWrap.hide();
				if (menuHasDelim) {
					menuItemsWrap.html(menuInnerHtml);
				}
			}
			// Фича для проверки наличия Side panel
			if (mediaT !== 'inPanel') {
				menuTimeoutID = setTimeout(function () {
					$win.trigger('resize');
				}, 0);
			}
			menuWrap.attr('data-media', mediaT);
			// Возвращаем таблицу
			return menuWrap.find('.columns-table');
		}
	};

	$.fn[pluginName] = function(options) {
		var args = arguments;
		if (options === undefined || typeof options === 'object') {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);
				if (instance instanceof Plugin && typeof instance[options] === 'function') {
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
				if (options === 'destroy') {
					$.data(this, 'plugin_' + pluginName, null);
				}
			});
			return returns !== undefined ? returns : this;
		}
	};

	$(function () {
		$('.' + pluginName)[pluginName]({
			onAfterInit: function(colTable) {
				var tableInPanel = !!$('.side-panel-content-inner').find(colTable).length;
				if (tableInPanel) {
					var panelMenuItems = colTable.find('.menu-columns-items ul').parent();

					panelMenuItems.each(function() {
						var thisItem = $(this);

						thisItem.find('> ul').hide();

						thisItem.find('> a').off('click.subMenuOpener');
						thisItem.find('> a').on('click.subMenuOpener', subMenuOpener);
					});

					function subMenuOpener() {
						var currentUl = $(this).parent().find('> ul');

						if (currentUl.is(':visible')) {
							currentUl.hide();
						} else {
							currentUl.css('display', '');
						}
						return false;
					}
				}
			}
		});
	});

	$win.on('resize', function(){
		$('.' + pluginName)[pluginName]('update');
	});

}(jQuery, window, document));
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
			mainSelector = ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
            mainSelector = document.location.pathname == "/" ? ".title-page .side-panel ."+mainClass+" .block-body-drop" : ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
            mainSelector = document.location.pathname == "/" ? ".title-page .side-panel ."+mainClass+" .block-body-drop" : ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
            mainSelector = document.location.pathname == "/" ? ".title-page .side-panel ."+mainClass+" .block-body-drop" : ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
$(function() {
	if (window.ymaps) {
		ymaps.ready(function () {
			$('.widget-type-map[data-center]').each(function () {
				var self = $(this);
				var id = self.attr('id');
				var data = false;
				if (self.find('[type=hidden]').val()) {
					data = typeof JSON.parse == 'function' ? JSON.parse(self.find('[type=hidden]').val()) : eval(self.find('[type=hidden]').val());
				}
				var params = {
					type: self.data('type') || 'yandex#map',
					center: self.data('center').split(',').map(function (e) {
						return $.trim(e)
					}),
					zoom: self.data('zoom') || 9,
					controls: self.data('controls') ? self.data('controls').split(',').map(function (e) {
						return $.trim(e)
					}) : []
				};
				var myMap = new ymaps.Map(id, params);
				myMap.behaviors.disable('scrollZoom');
				if (data) {
					for (var i in data) {
						var myPlacemark = new ymaps.Placemark(data[i].point.split(',').map(function (e) {
							return $.trim(e);
						}), {
							iconContent: $('<div>').html(data[i].iconContent).text(),
							balloonContent: $('<div>').html(data[i].balloonContent).html()
						}, {
							preset: data[i].preset
						});
						myMap.geoObjects.add(myPlacemark);
					}
				}
			});
		});
	}
});
;(function(window, document) {
    if (!window.photoSwipeSettings) {
        window.photoSwipeSettings = {};
    }

    var psSettings = window.photoSwipeSettings;

    function initPhotoSwipeFunc(settings) {
        if (!settings.preloadImages) {
            settings.preloadImages = false;
        }

        var settingsKeys = Object.keys(psSettings);

        if (settingsKeys.length) {
            settingsKeys.forEach(function(key) {
                if (key !== 'hashData') {
                    psSettings[key].push(settings[key]);
                }
            });
        } else {
            Object.keys(settings).forEach(function(key) {
                psSettings[key] = [];

                psSettings[key].push(settings[key]);
            });
        }

        var galleryIteration = 0;

        psSettings.gallery.forEach(function(str){
            if (str === settings.gallery) {
                galleryIteration++;
            }
            var index = psSettings.gallery.indexOf(settings.gallery);

            if (galleryIteration > 1) {
                settingsKeys.forEach(function(key) {
                    if (key !== 'hashData') {
                        psSettings[key].splice(index, 1);
                    }
                });
                galleryIteration = 0;
            }
        });

        if (!psSettings.hashData) {
            psSettings.hashData = photoswipeParseHash();
        }

        var hashData = psSettings.hashData;
        var hashDataKeys = Object.keys(hashData);

        if (hashDataKeys.length) {
            settings.preloadImages = true;
        }

        var galleryElements = document.querySelectorAll(psSettings.gallery.join(','));
        var galleryLength = galleryElements.length;

        var pswpHTML = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button>';
        var pswpHTMLEnd = '<div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
        var pswpShare = '', pswpFullscreen = '', pswpZoom = '', curGallery;

        for(var i = 0; i < galleryLength; i++) {
            curGallery = galleryElements[i];

            if (curGallery.getAttribute('data-popup-share') === '1') {
                pswpShare = '<button class="pswp__button pswp__button--share" title="Share"></button>'
            }
            if (curGallery.getAttribute('data-popup-fullscreen') === '1') {
                pswpFullscreen = '<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>';
            }
            if (curGallery.getAttribute('data-popup-zoom') === '1') {
                pswpZoom = '<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>';
            }

            curGallery.setAttribute('data-pswp-uid', i+1);
            curGallery.dataGID = i+1;

            if (settings.preloadImages) {
                parseGalleryImages(curGallery);
            } else {
                parseGalleryThumbs(curGallery);

                if (hashData.pid && hashData.gid && hashData.gid === curGallery.dataGID) {
                    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
                }
            }
        }

        var pswpOverlay = document.querySelectorAll('.pswp');

        if (pswpOverlay.length === 0) {
            pswpHTML = pswpHTML + pswpShare + pswpFullscreen + pswpZoom + pswpHTMLEnd;

            var pswpContainer = document.createElement('div');
            pswpContainer.innerHTML = pswpHTML;

            document.body.appendChild(pswpContainer);
        }

        function parseGalleryImages(gallery){
            var images = gallery.querySelectorAll(settings.item + ' img');
            var imagesLen = images.length;
            var loadedArr = [];

            for (var ind = 0; ind < imagesLen; ind++) {
                setDataSize(images[ind]);
            }
            function setDataSize(img) {
                var tempImg = new Image();

                var link = closest(img, function(el) {
                    return (el.tagName && el.tagName === 'A');
                });

				if(link){
                    tempImg.src = link.getAttribute('href');
				}

                if (!link) {return false;}


                tempImg.addEventListener('load', function() {
                    link.setAttribute('data-size', tempImg.naturalWidth + 'x' + tempImg.naturalHeight);
                    tempImg = null;

                    loadedArr.push('loaded');

                    if (loadedArr.length === imagesLen) {
                        parseGalleryThumbs(gallery);

                        if (hashData.pid && hashData.gid && hashData.gid === gallery.dataGID) {
                            openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
                        }
                    }
                });
            }
        }
        function parseGalleryThumbs(gallery) {
            var thumbs = gallery.querySelectorAll(settings.item);
            var thumbsLen = thumbs.length;
            var items = [];
            var item, link, image, title, desc, size, obj;

            for (var i = 0; i < thumbsLen; i++) {
                item = thumbs[i];

                item.dataPSIndex = i;
                item.addEventListener('click', onThumbsClick);

                image = item.querySelector('img');
                link = item.querySelector('a[data-size]');

                title = link.getAttribute('data-title');
                desc = item.querySelector(settings.itemDesc);

                size = link.getAttribute('data-size').split('x');

                obj = {
                    src: link.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if (title) {
                    obj.title = title;
                }

                if (desc && desc.innerHTML) {
                    obj.title += '<br /><small>' + desc.innerHTML + '</small>';
                }

                if (link.children.length > 0) {
                    obj.msrc = image.getAttribute('src');
                }

                obj.el = item;

                items.push(obj);
            }

            return items;
        }
        function onThumbsClick(e) {
            e = e || window.event;

            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            var clickedItem = closest(eTarget, function(el) {
                return ('dataPSIndex' in el);
            });

            var clickedGallery = closest(clickedItem, function(el) {
                return el.getAttribute('data-pswp-uid');
            });

            var index = clickedItem.dataPSIndex;

            openPhotoSwipe(index, clickedGallery);

            return false;
        }
        function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        }
        function openPhotoSwipe(index, gallery, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            if (!gallery) {
                return false;
            }
            var items = parseGalleryThumbs(gallery);
            var options = {
                galleryUID: gallery.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: function(index) {
                    var thumbnail = items[index].el.getElementsByTagName('img')[0];
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                    var rect = thumbnail.getBoundingClientRect();

                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                }
            };
            if (fromURL) {
                if(options['galleryPIDs']) {
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].pid === index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }
            if (isNaN(options.index) ) {
                return;
            }
            if (disableAnimation) {
                options.showAnimationDuration = 0;
                options.hideAnimationDuration = 0;
            }
            var pswpGallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            pswpGallery.init();
            pswpGallery.listen('close', function() {
                setTimeout(function(){
                    pswpElement.classList.remove('pswp--open');
                }, 500);
            });
        }
        function photoswipeParseHash() {
            var hash = location.hash.substring(1), params = {};

            if (hash.length < 5) {
                return params;
            }

            var vars = hash.split('&'), varsL = vars.length, pair;

            for (var i = 0; i < varsL; i++) {
                if (!vars[i]) {continue;}

                pair = vars[i].split('=');

                if (pair.length < 2) {continue;}

                params[pair[0]] = pair[1];
            }

            if (params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        }
    }

    if (!window.initPhotoSwipeFunc) {
        window.initPhotoSwipeFunc = initPhotoSwipeFunc;
    }
}(window, document));

$(function() {

	var $win = $(window);

	var debounce = (function () {
		return function (fn, time) {
			var timer, func;
			func = function() {
				var args = [].slice.call(arguments, 0);
				window.clearTimeout(timer);
				timer = window.setTimeout(function () {
					window.requestAnimationFrame && window.requestAnimationFrame(function() {
						fn.apply(null, args);
					}) || fn.apply(null, args);
				}, time)
			};
			return func;
		}
	}());

	var throttle = (function() {
		return function (fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last,
				deferTimer,
				func;
			func = function () {
				var context = scope || this;
				var now = +new Date,
					args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
			return func;
		}
	}());

	var psSettings = {
		gallery: '.blocklist .body',
		item: '.image',
		itemDesc: '.text',
		preloadImages: true
	};

	$('.blocklist').each(function() {
		var $blocklist = $(this),
			$items = $blocklist.find('.item-outer'),
			$list = $blocklist.find('.list'),
			$body = $blocklist.find('.body'),
			$controls = $blocklist.find('.controls'),
			$pagers = $blocklist.find('.bx-pager-wrap'),
			//$auto_controls = $blocklist.find('.auto_controls'),
			options = {},
			count,
			col_arr, pager_arr, controls_arr,
			bxslider,
			auto_controls_arr,
			containerWidth,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			media_type,
			//id = $blocklist.attr('data-layer_id') ? $blocklist.attr('data-layer_id') : $blocklist.attr('item_id'),
			slider_arr = $blocklist.attr('data-slider').split(","),
			swipe_arr = $blocklist.attr('data-swipe').split(",");

		// Equal height

		var equalizerSelector = $blocklist.attr('data-setting-vertical_aligner'),
			isItemFlex;

		function columnConform() {
			var rowDivs = [],
				currentTallest = 0,
				currentRowStart = 0;

			isItemFlex = $items.find('.item').css('display') == 'flex';

			$items.each(function(index) {
				// Refresh
				$(this).find(equalizerSelector).css('min-height', '');
				$(this).find(equalizerSelector).css('margin-top', '');

				var $itemOuter = $(this),
					$item = $itemOuter.find('.item'),
					itemHeight = sumChildrenHeight($item);

				$item.data("originalHeight", itemHeight);

				if (currentRowStart != $itemOuter.position().top) {
					if (rowDivs.length > 1) {
						for (var currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
							setConformingHeight(rowDivs[currentDiv], currentTallest);
						}
					}

					// set the variables for the new row
					rowDivs = [];
					currentRowStart = $itemOuter.position().top;
					currentTallest = itemHeight;
					rowDivs.push($item);

				} else {
					rowDivs.push($item);

					currentTallest = (currentTallest < itemHeight) ? (itemHeight) : (currentTallest);
				}

			});

			// do the last row
			if (rowDivs.length > 1) {
				for (var currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
					setConformingHeight(rowDivs[currentDiv], currentTallest);
				}
			}
		}

		function setConformingHeight(el, newHeight) {
			var $equalizer = el.find(equalizerSelector);

			if (!$equalizer.length) return;

			var $beforeEqualizer = $equalizer.prev(),
				elHeight = (el.data("originalHeight") == undefined) ? (sumChildrenHeight(el)) : (el.data("originalHeight")),
				differHeight = newHeight - elHeight;

			if (differHeight == 0) return;

			var equalizerMargin = parseInt(document.defaultView.getComputedStyle($equalizer[0], "").marginTop),
				beforeEqualizerMargin = !isItemFlex && $beforeEqualizer.length ? parseInt(document.defaultView.getComputedStyle($beforeEqualizer[0], "").marginBottom) : 0,
				newMargin = equalizerMargin>beforeEqualizerMargin ? equalizerMargin : beforeEqualizerMargin;

			$equalizer.css('margin-top', differHeight+newMargin);
		}

		function sumChildrenHeight(el) {
			var sum = 0;
			el.children().each(function() {
				sum += $(this).outerHeight();
			});
			return sum;
		}

		if (equalizerSelector && equalizerSelector !== "none") {
			setTimeout(function () {
				columnConform();
			}, 0);

			$win.on('resize', debounce(columnConform, 300));
		}

		if (slider_arr.indexOf('1')>-1 && $.fn.bxSlider) {

			options.pagerSelector= $blocklist.attr('data-setting-pager_selector');
			options.prevSelector = $blocklist.attr('data-setting-prev_selector');
			options.nextSelector = $blocklist.attr('data-setting-next_selector');
			options.prevText = $blocklist.attr('data-setting-prev_text') || '';
			options.nextText = $blocklist.attr('data-setting-next_text') || '';
			options.auto = !!parseInt($blocklist.attr('data-setting-auto'));
			options.controls = !!parseInt($blocklist.attr('data-setting-controls'));
			options.pager = !!parseInt($blocklist.attr('data-setting-pager').split(',')[0]);
			options.pause = parseInt($blocklist.attr('data-setting-pause'), 10) || 4000;
			options.useCSS = isMobile;
			options.infiniteLoop = true;
			options.adaptiveHeight = false;
			options.mode = $blocklist.attr('data-setting-mode') || 'horizontal';
			options.touchEnabled = options.mode === 'horizontal';
			options.slideMargin = 0;
			options.maxSlides = parseInt($blocklist.attr('data-setting-count').split(',')[0], 10) || 1;
			options.minSlides = options.mode === 'horizontal' ? 1 : options.maxSlides;
			options.moveSlides = $blocklist.attr('data-setting-move') || 0;
			options.autoControlsSelector = $blocklist.attr('data-setting-auto_controls_selector');
			options.autoControls =  !!parseInt($blocklist.attr('data-setting-auto_controls').split(',')[0]);
			options.autoControlsCombine =  !!parseInt($blocklist.attr('data-setting-autoControlsCombine'));
			options.autoHover = true;

			col_arr = $blocklist.attr('data-setting-columns').split(",");
			pager_arr = $blocklist.attr('data-setting-pager').split(",");
			controls_arr = $blocklist.attr('data-setting-controls').split(",");
			auto_controls_arr = $blocklist.attr('data-setting-auto_controls').split(",");

			if (!options.autoControls && options.auto) {
				options.onSlideAfter = function() {
					bxslider.startAuto();
				}
			}

			$items.removeClass('hidden');
			if ($list.parent().hasClass('bx-viewport')) {
				$list.unwrap();
				$list.unwrap();
			}

			function init(force) {
				var setting_columns,
					isJustify, space_between,
					body_width = $('body').width(),
					mediaList = ["screen", "tablet_landscape", "tablet_portrait", "mobile_landscape", "mobile_portrait"],
					slider_arr = $blocklist.attr('data-slider').split(",");


				if (body_width >= 961) {
					media_type = "screen";
				} else if (body_width <= 960 && body_width >= 769) {
					media_type = "tablet_landscape";
				} else if (body_width <= 768 && body_width >= 641) {
					media_type = "tablet_portrait";
				} else if (body_width <= 640 && body_width >= 481) {
					media_type = "mobile_landscape";
				} else if (body_width <= 480) {
					media_type = "mobile_portrait";
				}
				var media_ind = mediaList.indexOf(media_type);
				var newContainerWidth = $blocklist.width(), itemHeight, viewportHeight;

				if (!$blocklist.is(':visible')) {
					if (bxslider) {
						bxslider.destroySlider();
					}
					return;
				}
				if (force!=='force' && containerWidth && containerWidth === newContainerWidth) {
					return;
				}
				containerWidth = newContainerWidth;

				if (bxslider) {
					bxslider.destroySlider();
				}

				count = parseInt($blocklist.attr('data-setting-count').split(',')[media_ind], 10);
				isJustify = $body.css('justify-content') === "space-between";

				$controls.css("pointer-events","none");
				$controls.find('.prev').css("pointer-events","auto");
				$controls.find('.next').css("pointer-events","auto");

				$list.width('auto');

				$items
					.attr('style', '')
					.slice(1).addClass('hidden').end()
					.width(options.slideWidth = $items.width())
					.removeClass('hidden');

				if (pager_arr.length > 1) {
					options.pager = !!parseInt(pager_arr[media_ind]);
				}
				if (controls_arr.length > 1) {
					options.controls = !!parseInt(controls_arr[media_ind]);
				}
				if (auto_controls_arr.length > 1) {
					options.autoControls = !!parseInt(auto_controls_arr[media_ind]);
				}

				$(options.pagerSelector).css({"display": options.pager == true ? "flex" : "none"});
				$blocklist.find(".controls").css({"display": options.controls == true ? "flex" : "none"});

				if (options.mode === 'vertical') {
					itemHeight = Math.max.apply(Math, $items.map(function() {
						return $(this).height()
					}).get());
					$items.css('min-height', itemHeight);
					viewportHeight = itemHeight * count;
					options.maxSlides = options.minSlides = count;
				} else {
					setting_columns = col_arr[media_ind] == "auto" ? false : parseInt(col_arr[media_ind]);
					if (setting_columns) {
						count = setting_columns;
					}
					options.maxSlides = Math.min(count, Math.ceil($items.parent().width() / $items.width()));
				}

				if (isJustify) {
					if (options.maxSlides > 1) {
						space_between = Math.floor(($body.width() - $items.width() * options.maxSlides)/ (options.maxSlides-1));
						space_between = space_between < 0 ? 0 : space_between;
					} else {
						space_between = 0;
					}
					options.slideMargin = space_between;
				}
				if ($items.length > options.maxSlides && slider_arr[media_ind] == 1) {
					$list.css({'justify-content': 'flex-start'});
					if (bxslider) {
						bxslider.reloadSlider(options);
					} else {
						$list.data('bxslider', (bxslider = $list.bxSlider(options)));
					}
					if(options.pager){
						$pagers.css('display', 'flex');
					}
				} else {
					if(swipe_arr[media_ind]!=1){
                        $list.css({'justify-content': isJustify ? 'space-between' : 'inherit', 'flex-wrap': 'wrap'});
                        if($list.width()/count < $items.width()) {
                            $items.css('width', $items.width()-1);
                        } else {
                            $items.css('width', $items.width());
                        }
					} else {
						$list.css({'flex-wrap': 'nowrap'});
					}
					$pagers.hide();
					$controls.hide();
				}

				/*if (parseInt(slider_arr[media_ind]) === 0 || parseInt(swipe_arr[media_ind]) === 0) {
					$items.css('width', '');
				}*/

				if (viewportHeight && slider_arr[media_ind] == 1) {
					$list.parent().css('min-height', viewportHeight);
				}
				if (options.mode === 'horizontal') {
					var align = {};
					switch ($body.css('justify-content')) {
						case 'flex-end':
							align['margin-left'] = 'auto';
							align['margin-right'] = '0px';
							break;
						case 'center':
							align['margin-left'] = 'auto';
							align['margin-right'] = 'auto';
							break;
						default:
							align['margin-left'] = '0px';
							align['margin-right'] = 'auto';
					}
					$blocklist.find('.bx-wrapper').css(align);
				}

				$blocklist.wm_img_convert();
			}

			$win.on('resize', debounce(init, 300));
			$win.on('load', function(){
				init('force');
				$win.trigger('resize');
			});

			init();
		} else {
			$pagers.hide();
			$controls.hide();
		}

		$win.on('resize', debounce(swipeScrollInit, 300));
		swipeScrollInit();

		function swipeScrollInit() {
			var $shadowLeft = $blocklist.find(".swipe-shadow-left");
			var $shadowRight = $blocklist.find(".swipe-shadow-right");
			if ($list.css("overflow-x") == "auto") {
				var scroll_width = $list.get(0).scrollWidth;
				var view_width = $list.width();
				$shadowLeft.css("pointer-events","none");
				$shadowRight.css("pointer-events","none");

				$list.off('scroll');
				$list.on('scroll', throttle(swipeScrollCheack, 200));

				swipeScrollCheack();

				function swipeScrollCheack() {
					var scroll_left = $list.scrollLeft();

					if (scroll_left > 0) {
						$shadowLeft.show();
					} else {
						$shadowLeft.hide();
					}

					if (scroll_left + view_width >= scroll_width - 1) {
						$shadowRight.hide();
					} else {
						$shadowRight.show();
					}
				}
			} else {
				$shadowLeft.hide();
				$shadowRight.hide();
			}
		}
		if($blocklist.attr('data_photo_swipe') == 1){
            //$('.pswp').appendTo('body');
            initPhotoSwipeFunc(psSettings);
			$win.on('resize', function() {
                initPhotoSwipeFunc(psSettings);
            });
		}

        $(document).on('click', '.shop2-product-btn2', function(e) {

            var $this = $(this),
                $form = $this.closest('form'),
                form = $form.get(0),
                adds = $form.find('.additional-cart-params'),
                len = adds.length,
                i, el,
                a4 = form.amount.value,
                kind_id = form.kind_id.value;

            e.preventDefault();

            if (len) {
                a4 = {
                    amount: a4
                };

                for (i = 0; i < len; i += 1) {
                    el = adds[i];
                    if (el.value) {
                        a4[el.name] = el.value;
                    }
                }
            }

            shop2.cart.add(kind_id, a4, function(d) {

                $('#shop2-cart-preview').replaceWith(d.data);

                if (d.errstr) {
                    shop2.msg(d.errstr, $this);
                } else {
                    shop2.msg(window._s3Lang.JS_ADDED, $this);
                }

                if (d.panel) {
                    $('#shop2-panel').replaceWith(d.panel);
                }
            });

        });

	});

	var blockListBody = document.querySelectorAll('.blocklist .body-outer');

	s3ContentColumns(blockListBody, {
		body: '.list',
		items: '.item-outer'
	});
});
// s3ContentColumns v1.0.0
(function(window, document, undefined) {
	var vendors = ['ms', 'moz', 'webkit', 'o'], vendorsLength = 4;
	var docElem = document.documentElement;
	var winWidth = window.innerWidth || docElem.clientWidth || document.body.clientWidth;
	var classListFlag = ('classList' in docElem);
	var defaults = {
		body: false,
		items: 'random',
		columns: '0,0,0,0,0',
		onBeforeInit: function() {},
		onAfterInit: function() {}
	};
	var elementMethods = {
		sHasClass: function(classN) {
			var elem = this;
			if (classListFlag) {
				return elem.classList.contains(classN);
			} else {
				return elem.className && new RegExp('\\b' + classN + '\\b').test(elem.className);
			}
		},
		sAddClass: function(classes) {
			var elem = this, classArr = classes.split(/\s/g), classLength = classArr.length, clInd;
			if (classListFlag) {
				for (clInd = 0; clInd < classLength; clInd++) {elem.classList.add(classArr[clInd]);}
			} else {
				for (clInd = 0; clInd < classLength; clInd++) {
					if (!elem.sHasClass(classArr[clInd])) {elem.className += ' ' + classArr[clInd];}
				}
			}
			return elem;
		},
		sRemoveClass: function(classes) {
			var elem = this, classArr = classes.split(/\s/g), classLength = classArr.length, clInd;
			if (classListFlag) {
				for (clInd = 0; clInd < classLength; clInd++) {elem.classList.remove(classArr[clInd]);}
			} else {
				var reg;
				for (clInd = 0; clInd < classLength; clInd++) {
					reg = new RegExp('\\b' + classArr[clInd] + '\\b', 'g');
					elem.className = elem.className.replace(reg, ' ').replace(/^\s\s*|\s\s*$/, '');
				}
			}
			return elem;
		},
		sCSS: function(property, value) {
			var elem = this, css3Reg = new RegExp('perspective|transform|box-sizing|user-select', 'g');
			function cssPrefix(prop) {
				if (prop.match(css3Reg) && !(prop in elem.style)) {
					for (var v = 0; v < vendorsLength; v++) {
						if ('-'+vendors[v]+'-'+prop in elem.style) {
							prop = '-'+vendors[v]+'-'+prop;
							break;
						}
					}
				}
				return prop;
			}
			if (typeof property === 'string' && value !== undefined) {
				elem.style[cssPrefix(property)] = value;
			} else if (typeof property === 'string' && value === undefined) {
				return getComputedStyle(elem)[property];
			} else if (typeof property === 'object') {
				for (var cssProp in property) {
					if (property.hasOwnProperty(cssProp)) {
						elem.style[cssPrefix(cssProp)] = property[cssProp];
					}
				}
			}
			return elem;
		},
		sDataset: function(){
			var elem = this, tempData = {};
			function setValue(val) {
				var num = parseInt(val), nanVal = NaN;
				if (val === 'false') {
					return false;
				} else if (val === 'true') {
					return true;
				} else if (!(/\D/.test(val)) && typeof num === 'number' && num !== nanVal) {
					return num;
				} else {
					return val;
				}
			}
			if (elem.dataset) {
				for (var propName in elem.dataset) {
					if (!elem.dataset.hasOwnProperty(propName)) {continue;}
					tempData[propName] = setValue(elem.dataset[propName]);
				}
			} else {
				var elAttr = elem.attributes, attrLen = elAttr.length;
				for (var ati = 0; ati < attrLen; ati++) {
					if (/data-/.test(elAttr[ati].name) === false) {continue;}
					var dOpt = elAttr[ati].name.replace(/data-|-\w/gi, function(str) {
						if (str === 'data-') {return '';}
						return str.replace('-', '').toUpperCase();
					});
					tempData[dOpt] = setValue(elAttr[ati].value);
				}
			}
			return tempData;
		},
		sClosest: function(fn) {
			var elem = this, prnt = elem.parentNode;
			return elem && (fn(elem) ? elem : ('sClosest' in prnt ? prnt.sClosest(fn) : prnt));
		}
	};
	for (var method in elementMethods) {
		if (elementMethods.hasOwnProperty(method) && !Element.prototype[method]) {
			Object.defineProperty(Element.prototype, method, {
				enumerable: false,
				value: elementMethods[method]
			});
		}
	}
	var pluginObj = {
		getDOMEl: function(selector) {
			if (selector && typeof(selector) === 'string' && /[.\-]\b/g.test(selector)) {
				return document.querySelector(selector);
			} else if (selector && typeof(selector) === 'object' && selector.tagName) {
				return selector;
			} else {
				return false;
			}
		},
		extend: function(out) {
			out = out || {};
			var i = 1, argLen = arguments.length;
			for (; i < argLen; i++) {
				if (!arguments[i]) {continue;}
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {out[key] = arguments[i][key];}
				}
			}
			return out;
		},
		getMedia: function() {
			var mediaType = 'screen', mediaIndex = 0;
			if (window.matchMedia('all and (max-width: 480px)').matches) {
				mediaType = 'mobile_portrait';
				mediaIndex = 4;
			} else if (window.matchMedia('all and (max-width: 640px)').matches) {
				mediaType = 'mobile_landscape';
				mediaIndex = 3;
			} else if (window.matchMedia('all and (max-width: 768px)').matches) {
				mediaType = 'tablet_portrait';
				mediaIndex = 2;
			} else if (window.matchMedia('all and (max-width: 960px)').matches) {
				mediaType = 'tablet_landscape';
				mediaIndex = 1;
			}
			return [mediaIndex, mediaType];
		},
		getArray: function(arg) {
			var arr = [], len, ind, tempArr = [];
			function setValue(val) {
				var num = parseInt(val), nanVal = NaN;
				if (val === 'false') {
					return false;
				} else if (val === 'true') {
					return true;
				} else if (!(/\D/.test(val)) && typeof num === 'number' && num !== nanVal) {
					return num;
				} else {
					return val;
				}
			}
			if (typeof arg === 'string') {
				arr = arg.split(',');
			}
			len = arr.length;
			for (ind = 0; ind < len; ind++) {
				tempArr.push(setValue(arr[ind]));
			}
			return tempArr;
		},
		createColumnsTable: function(wrap) {
			var data = wrap.dataColumns, index;

			data.options.onBeforeInit(wrap, data);

			var columnsAmount = data.columnsArr[data.media[0]];
			var columnsTable = wrap.querySelector('.columns-table');

			if (columnsTable) {
				var itemsTable = data.items[0].sClosest(function(elem){return elem.sHasClass('columns-table');});

				if (itemsTable && itemsTable.sHasClass('columns-table')) {
					for (index = 0; index < data.itemsAmount; index++) {
						data.body.appendChild(data.items[index]);
					}
				}
				if (columnsAmount) {
					columnsTable.innerHTML = '';
				} else {
					data.body.removeChild(columnsTable);
				}
			} else {
				if (columnsAmount) {
					columnsTable = document.createElement('div').sAddClass('columns-table');
					data.body.appendChild(columnsTable);
				}
			}

			if (columnsAmount) {
				var cellStr = '';
				if (data.itemsAmount < columnsAmount) {
					columnsAmount = data.itemsAmount;
				}

				for (index = 0; index < columnsAmount; index++) {
					cellStr += '<div class="columns-cell"></div>';
				}

				columnsTable.innerHTML = cellStr;

				var columnsCells = wrap.querySelectorAll('.columns-cell');

				if (columnsAmount === 1) {
					for (index = 0; index < data.itemsAmount; index++) {
						columnsCells[0].appendChild(data.items[index]);
					}
				} else {
					var cellWidth = columnsCells[0].clientWidth || parseFloat(columnsCells[0].sCSS('width'));

					data.body.sCSS('width', cellWidth + 'px');

					var totalHeight = data.body.offsetHeight;
					var avgColumn = Math.ceil(totalHeight / columnsAmount);
					var heightCounter = 0;
					var columnArrInd = 0;
					var remColumn, remItems, newAvgColumn;
					var currItem, currHeight, nextItem, nextHeight;

					for (var itemInd = 0; itemInd < data.itemsAmount; itemInd++) {
						currItem = data.items[itemInd];

						if (currItem === undefined || currItem.sHasClass('columns-table')) {continue;}

						currHeight = currItem.offsetHeight;

						nextItem = data.items[itemInd + 1];
						nextHeight = 0;
						if (nextItem) {
							nextHeight = nextItem.offsetHeight;
						}
						if (columnArrInd >= columnsAmount) {
							columnArrInd = columnsAmount - 1;
						}
						columnsCells[columnArrInd].appendChild(currItem);

						totalHeight -= currHeight;
						heightCounter += currHeight;

						if (totalHeight) {
							remColumn = columnsAmount - (columnArrInd + 1);
							remItems = data.itemsAmount - (itemInd + 1);
							newAvgColumn = totalHeight / remColumn;

							var surplus = newAvgColumn - heightCounter;

							var testA = remItems <= remColumn;
							var testB = nextHeight >= newAvgColumn;
							var testC = surplus <= nextHeight/2;
							var testD = avgColumn >= newAvgColumn && heightCounter >= newAvgColumn;

							if (testA || testB || testC || testD) {
								heightCounter = 0;
								columnArrInd++;
							}
						}
					}

					data.body.sCSS('width', '');
				}
			}

			data.options.onAfterInit(wrap, data);
		}
	};
	var pluginMethods = {
		init: function(element, params) {
			var wrap = pluginObj.getDOMEl(element);

			if (!wrap) {return false;}

			var data = wrap.dataColumns, body, items, itemsAmount;

			if (wrap && typeof(params) === 'string') {
				if (data && data.status === 'inited') {
					return false;
				} else if (data && data.options) {
					params = pluginObj.extend({}, data.options);
				}
			}
			if (wrap && typeof(params) !== 'string') {
				var options = pluginObj.extend({}, defaults, params, wrap.sDataset());

				body = wrap.querySelector(options.body) || wrap;

				items = wrap.querySelectorAll(options.items);
				if (items && !items.length) {
					items = [];
					var contentNodes = body.childNodes;
					var nodesLength = contentNodes.length;
					var tempTag, key, tempArr = [];
					for (key = 0; key < nodesLength; key++) {
						if (!contentNodes[key].tagName && contentNodes[key].nodeValue && /[\wа-яё]+/gi.test(contentNodes[key].nodeValue)) {
							tempTag = document.createElement('span');
							tempTag.innerHTML = contentNodes[key].nodeValue.replace(/^\s+|\s+$/g, '');
							tempArr.push([contentNodes[key], tempTag]);
						}
					}
					nodesLength = tempArr.length;
					for (key = 0; key < nodesLength; key++) {
						body.insertBefore(tempArr[key][1], tempArr[key][0].nextSibling);
						tempArr[key][0].nodeValue = '';
					}
					nodesLength = body.children.length;
					for (key = 0; key < nodesLength; key++) {
						items.push(body.children[key]);
					}
				}
				itemsAmount = items.length;

				data = wrap.dataColumns = {
					options: options,
					status: 'inited',
					media: pluginObj.getMedia(),
					body: body,
					items: items,
					itemsAmount: itemsAmount,
					columnsArr: pluginObj.getArray(options.columns),
					handlers: {
						resizeWindow: function() {
							var newWinWidth = window.innerWidth || docElem.clientWidth || document.body.clientWidth;
							if (newWinWidth !== winWidth) {
								var newMedia = pluginObj.getMedia();
								if (newMedia[1] !== data.media[1]) {
									data.media = newMedia;
									pluginObj.createColumnsTable(wrap);
								}
							}
						}
					}
				};

				var contentImages = wrap.querySelectorAll('img');
				var imagesLength = contentImages.length, hasSVG = false;

				if (imagesLength) {
					var imagesLoadCounter = 0, currentImg, curSrc;

					for (var imgInd = 0; imgInd < imagesLength; imgInd++) {
						currentImg = contentImages[imgInd];
						if (/image\/svg\+xml|\.svg$/g.test(currentImg.getAttribute('src'))) {
							hasSVG = true;
							break;
						}
						if (currentImg.complete || currentImg.complete === undefined){
							curSrc = currentImg.src + '?imgsrc=' + (new Date()).getTime();
							currentImg.src = curSrc;
						}
						currentImg.addEventListener('load', function() {
							imagesLoadCounter++;
							if (imagesLoadCounter === imagesLength) {
								initPlugin();
							}
						});
					}
					if (hasSVG) {
						initPlugin();
					}
				} else {
					initPlugin();
				}
			}

			function initPlugin() {
				if (items && itemsAmount) {
					pluginObj.createColumnsTable(wrap);

					window.addEventListener('resize', data.handlers.resizeWindow);
				}
			}

			return wrap;
		}
	};
	function s3ContentColumnsPlugin(element, method) {
		if (!element) {return false;}
		if (pluginMethods[method]) {
			return pluginMethods[method].apply(this, arguments);
		} else if (typeof method === 'object' || !method) {
			if (pluginObj.getDOMEl(element)) {
				return pluginMethods.init.apply(this, arguments);
			} else if (element.length) {
				var elementsLen = element.length;
				for (var argInd = 0; argInd < elementsLen; argInd++) {
					pluginMethods.init(element[argInd], method);
				}
			}
		} else {
			return console.error('Метод ' +  method + ' не найден в плагине s3ContentColumns');
		}
	}
	if (!window.s3ContentColumns) {
		window.s3ContentColumns = s3ContentColumnsPlugin;
	}
}(window, document));
/*
 *  s3MosaicGallery v1.0.7
 *  K.I. 433
 */
;(function ($, window, document, undefined ) {
	var pluginName = 's3MosaicGallery',
		defaults = {
			lineType: 'horizontal',
			lineHeight: '150,140,130,120,110',
			linesAmount: '5,4,3,2,1',
			linesTableClass: 'lines-table',
			linesCellClass: 'lines-cell',
			alignAll: false,
			item: '.mg-item',
			sizeIncrease: 'default',
			sizeIncreaseWrap: 'mg-increase',
			sizeIncreaseDuration: 400,
			onAfterLoadGallery: $.noop
		};

	var pluginObj = {
		_loadOriginalImages: function(items, links, images, options) {
			// Загрузка картинок и установка дата-атрибута на ссылки
			var loadedArr = [], imgLength = images.length;

			links.each(function() {
				var thisLink = $(this);
				var thisImg = thisLink.find('img');

				thisImg.on('load', function() {
					var imgLoad = this;

					thisLink.attr('data-size', imgLoad.naturalWidth + 'x' + imgLoad.naturalHeight);

					loadedArr.push('loaded');

					if (loadedArr.length === imgLength) {
						pluginObj._afterLoadImages[options.lineType](items, links, images, options);
					}
				});
			});
		},
		_afterLoadImages: {
			horizontal: function(items, links, images, options){
				var mediaT = options.media;
				// Настроки для увеличения картинки
				if (options.sizeIncrease === 'photoswipe') {
					items.parent().addClass('photoswipeContainer').attr({
						'data-popup-share': options.popupShare,
						'data-popup-fullscreen': options.popupFullscreen,
						'data-popup-zoom': options.popupZoom
					});
				}
				var galContent = items.parent();
				// Массив с высотами строк
				var optHeightArr = options.lineHeight.split(',');

				var totalWidth = 0, imgArr = [];
				var galWidth = options.galWidth;
				var maxOptHeight = parseInt(optHeightArr[0]);

				if (mediaT === 'screen') {
					maxOptHeight = parseInt(optHeightArr[0]);
				} else if (mediaT === 'tablet_landscape') {
					maxOptHeight = parseInt(optHeightArr[1]);
				} else if (mediaT === 'tablet_portrait') {
					maxOptHeight = parseInt(optHeightArr[2]);
				} else if (mediaT === 'mobile_landscape') {
					maxOptHeight = parseInt(optHeightArr[3]);
				} else if (mediaT === 'mobile_portrait') {
					maxOptHeight = parseInt(optHeightArr[4]);
				}
				// Значения границ и отступов
				var borderPart = (options.border.left + options.border.right);
				var marginPart = (options.margin.left + options.margin.right);
				// Перебор ссылок
				links.each(function(index){
					var thisLink = $(this);

					var imgSize = thisLink.attr('data-size').split('x');
					var imgWidth = parseInt(imgSize[0]);
					var imgHeight = parseInt(imgSize[1]);

					var minWidth, maxWidth, minHeight, calcPercent;

					minHeight = (maxOptHeight - options.border.top - options.border.bottom).toFixed(2) - 0;

					calcPercent = (minHeight * 100 / imgHeight).toFixed(2) - 0;

					minWidth = (imgWidth * calcPercent / 100).toFixed(2) - 0;
					maxWidth = Math.ceil(minWidth + borderPart);

					thisLink.css('height', minHeight);

					totalWidth += (maxWidth + marginPart);
					// Массив элементов с параметрами
					imgArr.push({
						item: items.eq(index),
						img: images.eq(index),
						widthMin: minWidth,
						widthMax: maxWidth,
						heightMin: minHeight,
						heightMax: maxOptHeight
					});
				});

				var linesArr = [[]], linesAmount;
				var lineArrInd = 0, widthCounter = 0;
				// Вычисление и распределение картинок по строкам
				imgArr.forEach(function(obj, ind){
					var currWidth = obj.widthMax + marginPart;
					var nextImg = imgArr[ind + 1], nextWidth = 0;

					if (nextImg) {
						nextWidth = nextImg.widthMax + marginPart;
					}

					linesArr[lineArrInd].push(obj);
					// Счетчик
					totalWidth -= currWidth;
					widthCounter += currWidth;

					if (totalWidth) {
						var surplus = galWidth - widthCounter;

						if (nextWidth > surplus) {
							widthCounter = 0;
							linesArr.push([]);
							lineArrInd++;
						}
					}
				});
				// Количество строк
				linesAmount = linesArr.length;
				// Перебор строк с картинками
				linesArr.forEach(function(arr, arrInd){
					var arrLength = arr.length;
					var lineWidth = 0, surplus, part;
					var iteration = arrInd + 1;

					var minWidth = galWidth, minArr = [], minAmount;
					var maxWidth = 0, maxArr = [], maxAmount;
					var minObj;
					// Опредение минимальной и максимальной ширины и сумма ширины картинок
					arr.forEach(function(obj){
						lineWidth += obj.widthMax;

						if (obj.widthMax >= maxWidth) {
							maxWidth = obj.widthMax;
						}
						if (obj.widthMax <= minWidth) {
							minWidth = obj.widthMax;
						}
					});
					// Сортировка широких и узких картинок
					arr.forEach(function(obj){
						if (obj.widthMax === maxWidth) {
							maxArr.push(obj);
						} else {
							minArr.push(obj);
						}
						if (obj.widthMax === minWidth) {
							minObj = obj;
						}
					});

					minAmount = minArr.length;
					maxAmount = maxArr.length;
					// Вычисление остатка от общей ширины
					surplus = galWidth - lineWidth;
					lineWidth = 0;
					var widthArr = [];

					if (minAmount) {
						part = surplus / minAmount;
					} else {
						part = surplus / maxAmount;
					}
					// Вычисление ширины элемента
					arr.forEach(function(obj){
						var itemWidth = obj.widthMax;

						if (obj.widthMax !== maxWidth && (iteration !== linesAmount || options.alignAll)) {
							itemWidth += part;
						}

						itemWidth = Math.floor(itemWidth);

						widthArr.push(itemWidth);
						lineWidth += itemWidth;
					});

					part = 0;
					if (lineWidth < galWidth) {
						part = galWidth - lineWidth;
					}
					if (minAmount === 0 && maxAmount !== 0) {
						part = part / maxAmount;
					}
					// Установка ширины на элемент
					widthArr.forEach(function(width, ind) {
						var currObj = arr[ind];

						if (currObj.widthMax === minWidth && part !== 0 && (iteration !== linesAmount || options.alignAll)) {
							width += part;
							if (minAmount) {
								part = 0;
							}
						}

						if (ind + 1 === arrLength) {
							currObj.item.addClass('last-in-line');
							if (options.margin.right) {
								currObj.item.css('margin-right', 0);
							}
						} else {
							width -= marginPart;
						}

						currObj.item.css('width', width).attr('data-line', iteration);
					});
					// Выравнивание картинок
					arr.forEach(function(obj){
						obj.img.css('width', '100%');
					});
					if (/MSIE|rv:1/.test(navigator.userAgent)) {
						arr.forEach(function(obj){
							var imgFullWidth = obj.img[0].naturalWidth;
							var imgFullHeight = obj.img[0].naturalHeight;

							var imgCurWidth = parseInt(obj.img.css('width'));
							var calcPercent  = (imgCurWidth * 100 / imgFullWidth).toFixed(2) - 0;
							var imgHeight = (imgFullHeight * calcPercent / 100).toFixed(2) - 0;

							obj.img.css('height', imgHeight);

							var imgTop = obj.img[0].getBoundingClientRect().top;
							var parentTop = obj.img.parent()[0].getBoundingClientRect().top;

							if (imgHeight > obj.heightMin && imgTop === parentTop) {
								var marginTop = (imgHeight - obj.heightMin) / 2 * (-1);
								obj.img.parent().css('padding-top', '1px');
								obj.img.css('margin-top', marginTop);
							}
						});
					}
				});
				if (options.sizeIncrease !== 'photoswipe') {
					pluginObj._sizeIncrease.horizontal(items, options);
				}
				galContent.removeClass('fix-height');
				options.onAfterLoadGallery();
			},
			vertical: function(items, links, images, options){
				var mediaT = options.media;

				var itemsLength = items.length;
				var colArr = options.linesAmount.split(',');
				var galContent = items.parent();
				// Таблица для колонок
				var columnsTable = galContent.find('.' + options.linesTableClass);
				if (columnsTable.length) {
					columnsTable.empty();
					galContent.find('.' + options.sizeIncreaseWrap + '_wrap').remove();
				} else {
					columnsTable = $('<div class="'+options.linesTableClass+'"></div>');
					galContent.prepend(columnsTable);
				}
				// Количество колонок
				var columnsCount = 1;
				if (mediaT === 'screen') {
					columnsCount = parseInt(colArr[0]);
				} else if (mediaT === 'tablet_landscape') {
					columnsCount = parseInt(colArr[1]);
				} else if (mediaT === 'tablet_portrait') {
					columnsCount = parseInt(colArr[2]);
				} else if (mediaT === 'mobile_landscape') {
					columnsCount = parseInt(colArr[3]);
				} else if (mediaT === 'mobile_portrait') {
					columnsCount = parseInt(colArr[4]);
				}
				if (itemsLength < columnsCount) {
					columnsCount = itemsLength;
				}
				options.colAmount = columnsCount;
				// Параметры для вычислений
				var galWidth = options.galWidth;
				var marginPart = Math.max(options.margin.top, options.margin.bottom);
				var borderPart = (options.border.top + options.border.bottom);

				var itemsWrapArray = [];
				var totalHeight = 0, imgArr = [];
				var maxWidth = Math.round(galWidth / columnsCount - options.margin.right);
				// Создание массива колонок
				for (var cellInd = 0; cellInd < columnsCount; cellInd++) {
					itemsWrapArray.push([]);
				}
				// Перебор ссылок
				links.each(function(index){
					var thisLink = $(this);

					var imgSize = thisLink.attr('data-size').split('x');
					var imgWidth = parseInt(imgSize[0]);
					var imgHeight = parseInt(imgSize[1]);

					var thisItem = items.eq(index);
					if (options.margin.right) {
						thisItem.css('margin-right', 0);
					}

					var minWidth, minHeight, maxHeight, calcPercent;

					minWidth = (maxWidth - options.border.left - options.border.right).toFixed(2) - 0;

					calcPercent = (minWidth * 100 / imgWidth).toFixed(2) - 0;

					minHeight = (imgHeight * calcPercent / 100).toFixed(2) - 0;
					maxHeight = (minHeight + borderPart).toFixed(2) - 0;

					totalHeight += (maxHeight + marginPart);
					// Массив элементов с параметрами
					imgArr.push({
						item: thisItem,
						link: thisLink,
						img: images.eq(index),
						width: imgWidth,
						widthMin: minWidth,
						widthMax: maxWidth,
						height: imgHeight,
						heightMin: minHeight,
						heightMax: maxHeight
					});
				});
				// Параметры для распределения картинок
				totalHeight = Math.ceil(totalHeight);
				var avgColumn = Math.ceil(totalHeight / columnsCount);
				var heightCounter = 0, colArrInd = 0;
				var remColumn, remItems, newAvgColumn;
				// Вычисление и распределение картинок по колонкам
				imgArr.forEach(function(obj, ind){
					var currHeight = obj.heightMax + marginPart;
					var nextImg = imgArr[ind + 1];
					var nextHeight = 0;

					if (nextImg) {
						nextHeight = nextImg.heightMax + marginPart;
					}
					if (colArrInd >= columnsCount) {
						colArrInd = columnsCount - 1;
					}

					itemsWrapArray[colArrInd].push(obj);
					// Счетчик
					totalHeight -= currHeight;
					heightCounter += currHeight;

					if (totalHeight) {
						remColumn = columnsCount - (colArrInd + 1);
						remItems = itemsLength - (ind + 1);
						newAvgColumn = totalHeight / remColumn;

						var surplus = newAvgColumn - heightCounter;

						var testA = remItems <= remColumn;
						var testB = nextHeight >= newAvgColumn;
						var testC = surplus <= nextHeight/2;
						var testD = avgColumn >= newAvgColumn && heightCounter >= newAvgColumn;

						if (testA || testB || testC || testD) {
							heightCounter = 0;
							colArrInd++;
						}
					}
				});

				var maxColHeight = 0, heightArr = [];
				// Вычисление максимальной высоты колонки
				itemsWrapArray.forEach(function(arr){
					var arrHeight = 0;
					arr.forEach(function(obj){
						arrHeight += (obj.heightMax + options.margin.bottom);
					});

					arrHeight = Math.ceil(arrHeight);

					heightArr.push(arrHeight);

					if (arrHeight > maxColHeight) {
						maxColHeight = arrHeight;
					}
				});
				// Перебор по массиву колонок
				itemsWrapArray.forEach(function(arr, arrInd){
					var arrHeight = heightArr[arrInd];

					if (arrHeight < maxColHeight && (arrInd + 1 !== columnsCount || options.alignAll)) {
						var surplus = maxColHeight - arrHeight;
						var part, amendArr;

						var minHeight = maxColHeight, minArr = [], minAmount;
						var maxHeight = 0, maxArr = [], maxAmount;
						// Опредение минимальной и максимальной высоты картинок
						arr.forEach(function(obj){
							if (obj.heightMax >= maxHeight) {
								maxHeight = obj.heightMax;
							}
							if (obj.heightMax <= minHeight) {
								minHeight = obj.heightMax;
							}
						});
						// Сортировка картинок по высоте
						arr.forEach(function(obj){
							if (obj.heightMax === maxHeight) {
								maxArr.push(obj);
							} else {
								minArr.push(obj);
							}
						});

						minAmount = minArr.length;
						maxAmount = maxArr.length;

						if (minAmount) {
							part = surplus / minAmount;
							amendArr = minArr;
						} else {
							part = surplus / maxAmount;
							amendArr = maxArr;
						}
						// Установка параметров клонированным элементам
						amendArr.forEach(function(obj){
							var linkH = Math.ceil(obj.heightMin + part);
							obj.item.addClass('flex-row').find('a').css('height', linkH).find('img').css('height', linkH);
						});
					}
					if (/MSIE|rv:1|Firefox/.test(navigator.userAgent)) {
						arr.forEach(function(obj){
							if (!obj.item.hasClass('flex-row')) {
								obj.item.find('a').css('height', obj.heightMin).find('img').css('height', obj.heightMin);
							}
						});
					}
				});
				// HTML для вставки в таблицу
				var tableString = '', cellPadding = '';
				if (options.margin.right) {
					cellPadding = ' style="padding-right: ' + options.margin.right + 'px;"';
				}

				itemsWrapArray.forEach(function(arr, arrInd){
					if (arrInd + 1 === columnsCount) {
						cellPadding = '';
					}

					tableString += '<div class="' + options.linesCellClass + '"'+cellPadding+'>';

					arr.forEach(function(obj){
						tableString += obj.item[0].outerHTML;
					});

					tableString += '</div>';
				});

				columnsTable.html(tableString);
				// Удаление элементов
				items.remove();
				if (/MSIE|rv:1/.test(navigator.userAgent)) {
					columnsTable.find('img').each(function() {
						var thisImg = $(this);
						var parentImg = thisImg.parent();

						var imgWidth = parseInt(thisImg.css('width'));
						var imgLeft = thisImg[0].getBoundingClientRect().left;

						var parentWidth = parseInt(parentImg.css('width'));
						var parentLeft = parentImg[0].getBoundingClientRect().left;

						if (imgWidth > parentWidth && imgLeft === parentLeft) {
							var marginLeft = (imgWidth - parentWidth) / 2 * (-1);
							thisImg.css('margin-left', marginLeft);
						}
					});
				}
				if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
					columnsTable.find('.flex-row img').each(function(){
						var thisImg = $(this);

						var maxWidth = this.naturalWidth;
						var maxHeight = this.naturalHeight;

						var minHeight = parseInt(thisImg.css('height'));

						var calcPercent = (minHeight * 100 / maxHeight).toFixed(2) - 0;

						var minWidth = (maxWidth * calcPercent / 100).toFixed(2) - 0;

						thisImg.css({'min-width': minWidth, 'width': minWidth});
					});
				}
				if (options.sizeIncrease !== 'photoswipe') {
					pluginObj._sizeIncrease.vertical(columnsTable.find(options.item), options);
				}
				galContent.removeClass('fix-height');
				options.onAfterLoadGallery();
			}
		},
		_sizeIncrease: {
			_wrap: function (options) {
				// Увеличение картинки по умолчанию
				return $('<div class="' + options.sizeIncreaseWrap + '_wrap"><div class="' + options.sizeIncreaseWrap + '_content"><div class="' + options.sizeIncreaseWrap + '_close"></div><div class="' + options.sizeIncreaseWrap + '_image"><img src="" alt="" /></div><div class="' + options.sizeIncreaseWrap + '_title"></div></div></div>');
			},
			horizontal: function(items, options) {
				var links = items.find('a');
				var imageInfo = pluginObj._sizeIncrease._wrap(options);

				var currInfo, scrollHeight;

				var incrDuration = options.sizeIncreaseDuration;
				var halfDuration = incrDuration / 2;

				var docEl = $('html, body');

				function showImage(e){
					e.preventDefault();

					var thisLink = $(this);
					var thisLine = thisLink.closest('[data-line]').attr('data-line');
					var lastInLine = items.filter('.last-in-line[data-line="' + thisLine + '"]');

					if (lastInLine.next().hasClass(options.sizeIncreaseWrap + '_wrap')) {
						currInfo = lastInLine.next();
					} else {
						currInfo = imageInfo.clone();
						lastInLine.after(currInfo);
					}

					var currImage = currInfo.find('img');

					if (currInfo.is(':animated') || currImage.is(':animated') || docEl.is(':animated')) {
						return false;
					}

					currInfo.siblings('.' + options.sizeIncreaseWrap + '_wrap:visible').slideUp(incrDuration, function() {
						$(this).find('img').attr('src', '');
					});

					var imagePath = thisLink.attr('href'), currHeight;

					var currContent = currInfo.find('.' +options.sizeIncreaseWrap + '_content');

					var currTitle = currInfo.find('.' + options.sizeIncreaseWrap + '_title');

					if (currImage.attr('src') === imagePath) {
						currInfo.slideUp(incrDuration, function() {
							currImage.attr('src', '');
						});
					} else {
						if (currInfo.is(':hidden')) {
							currImage.attr('src', imagePath);
							currTitle.text(thisLink.attr('data-title'));

							currInfo.slideDown(incrDuration, function() {
								currHeight = currContent.outerHeight();
								scrollHeight = lastInLine.offset().top;

								currInfo.height(currHeight);
								docEl.animate({scrollTop: scrollHeight}, halfDuration);
							});
						} else {
							currImage.animate({
								opacity: 0
							}, halfDuration, function() {
								currTitle.text(thisLink.attr('data-title'));

								currImage.attr('src', imagePath).animate({
									opacity: 1
								}, halfDuration);

								currHeight = currContent.outerHeight();
								scrollHeight = lastInLine.offset().top;

								currInfo.animate({
									height: currHeight
								}, incrDuration);

								docEl.animate({scrollTop: scrollHeight}, halfDuration);
							});
						}
					}
				}

				links.off('click.s3MosaicGallery', showImage);
				links.on('click.s3MosaicGallery', showImage);
			},
			vertical: function(items, options) {
				var links = items.find('a');
				var selectorSting = '.s3IcrWrap.' + options.galClass + ' .' + options.sizeIncreaseWrap + '_wrap';
				var imageInfo = $(selectorSting);

				if (!imageInfo.length) {
					var imageInfoWrap = $('<div class="s3IcrWrap ' + options.galClass + '"></div>');
					imageInfoWrap.append(pluginObj._sizeIncrease._wrap(options));
					$('body').append(imageInfoWrap);
				}

				imageInfo = $(selectorSting);
				imageInfo.css('text-align', 'center');

				var imageTag = imageInfo.find('img');
				var imageContent = imageInfo.find('.' +options.sizeIncreaseWrap + '_content');
				var imageTitle = imageInfo.find('.' + options.sizeIncreaseWrap + '_title');

				var incrDuration = options.sizeIncreaseDuration;

				imageInfo.addClass('popup-block');

				var imageContentWidth = options.galWidth;
				if (imageContentWidth > 980) {
					function getMaxWidth() {
						var maxImgWidth = 0;
						links.each(function(){
							var linkDataWidth = parseInt($(this).attr('data-size').split('x')[0]);
							if (maxImgWidth < linkDataWidth) {
								maxImgWidth = linkDataWidth;
							}
						});
						return maxImgWidth;
					}
					imageContentWidth = getMaxWidth();
				}

				imageContent.css({
					width: imageContentWidth
				});

				function showImage(e){
					e.preventDefault();

					var thisLink = $(this);

					if (imageInfo.is(':animated')) {
						return false;
					}

					var imagePath = thisLink.attr('href');

					imageTag.attr('src', imagePath);
					imageTitle.text(thisLink.attr('data-title'));

					imageInfo.fadeIn(incrDuration);
				}

				function hideImage(e) {
					var targ = $(e.target);

					if (targ.hasClass(options.sizeIncreaseWrap + '_wrap') || targ.hasClass(options.sizeIncreaseWrap + '_close')) {
						imageInfo.fadeOut(incrDuration, function() {
							imageTag.attr('src', '');
						});
					}
				}

				links.off('click.s3MosaicGallery', showImage);
				links.on('click.s3MosaicGallery', showImage);

				imageInfo.off('click.s3MosaicGallery', hideImage);
				imageInfo.on('click.s3MosaicGallery', hideImage);
			}
		}
	};
	function Plugin(element, options) {
		this.element = element;

		this.options = $.extend({}, defaults, options, $(this.element).data()) ;

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	var resizeCounter = 0;

	Plugin.prototype = {
		init: function () {
			var options = this.options;

			if (window.matchMedia('all and (max-width: 480px)').matches) {
				options.media = 'mobile_portrait';
			} else if (window.matchMedia('all and (max-width: 640px)').matches) {
				options.media = 'mobile_landscape';
			} else if (window.matchMedia('all and (max-width: 768px)').matches) {
				options.media = 'tablet_portrait';
			} else if (window.matchMedia('all and (max-width: 960px)').matches) {
				options.media = 'tablet_landscape';
			} else {
				options.media = 'screen';
			}
			// Ширина галереи
			var galWrap = $(this.element);
			options.galWidth = galWrap.width();
			options.wrap = galWrap;

			options.galClass = galWrap.attr('class').match(/mosaic-gallery-\d+/i)[0];

			var galItems = galWrap.find(options.item);
			var galImgLinks = galItems.find('a');
			var galImg = galItems.find('img');
			var linksLength = galImgLinks.length;
			var linksArr = [], arrLength = 0;

			galImgLinks.each(function(){
				var linkSize = $(this).attr('data-size');
				if (linkSize && linkSize !== '0x0') {
					linksArr.push(linkSize);
				}
				arrLength = linksArr.length;
			});

			if (!pluginObj._afterLoadImages[options.lineType]) {
				options.lineType = 'horizontal';
			}
			function testAttrs() {
				if (galWrap.attr('data-current-media') === options.media && linksLength === arrLength) {
					return false;
				} else {
					galWrap.removeAttr('data-current-media');
					setTimeout(function() {
						if (resizeCounter >= 6) {
							var notAttrSize = galImgLinks.not('[data-size]');
							var notSizeLength = notAttrSize.length;

							notAttrSize.each(function(index){
								var thisLink = $(this);
								var thisImg = thisLink.find('img');

								thisLink.attr('data-size', thisImg[0].naturalWidth + 'x' + thisImg[0].naturalHeight);

								if (index + 1 === notSizeLength) {
									pluginObj._afterLoadImages[options.lineType](galItems, galImgLinks, galImg, options);
								}
							});
						}

						$(window).trigger('resize');

						resizeCounter++;
					}, 200);
				}
			}
			if (options.lineType === 'vertical') {
				var columnsTable = galWrap.find('.' + options.linesTableClass);

				testAttrs();
				// Удаление таблицы
				var itemsContainer = columnsTable.parent();
				if (columnsTable.length) {
					itemsContainer.append(columnsTable.find(options.item));
					columnsTable.remove();
				}
			} else {
				testAttrs();
			}

			// Обнуляем параметры
			galItems.removeClass('flex-row last-in-line').css({
				'display': '',
				'margin-right': ''
			});
			galImgLinks.css({
				'flex-direction': '',
				'height': ''
			}).removeAttr('data-calc-height');
			galImg.css({
				'max-height': '',
				'max-width': '',
				'height': ''
			});

			options.margin = {
				top: parseFloat(galItems.css('margin-top')),
				left: parseFloat(galItems.css('margin-left')),
				right: parseFloat(galItems.css('margin-right')),
				bottom: parseFloat(galItems.css('margin-bottom'))
			};
			options.border = {
				top: parseFloat(galItems.css('border-top-width')),
				left: parseFloat(galItems.css('border-left-width')),
				right: parseFloat(galItems.css('border-right-width')),
				bottom: parseFloat(galItems.css('border-bottom-width'))
			};

			if (linksLength !== arrLength) {
				pluginObj._loadOriginalImages(galItems, galImgLinks, galImg, options);
			} else {
				pluginObj._afterLoadImages[options.lineType](galItems, galImgLinks, galImg, options);
			}

			galWrap.attr('data-current-media', options.media);
		},
		update: function () {
			this.init();
		}
	};
	if (!$.fn[pluginName]) {
		$.fn[pluginName] = function (options) {
			var args = arguments;
			if (options === undefined || typeof options === 'object') {
				return this.each(function () {
					if (!$.data(this, 'plugin_' + pluginName)) {
						$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
					}
				});
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				var returns;
				this.each(function () {
					var instance = $.data(this, 'plugin_' + pluginName);
					if (instance instanceof Plugin && typeof instance[options] === 'function') {
						returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
					if (options === 'destroy') {
						$.data(this, 'plugin_' + pluginName, null);
					}
				});
				return returns !== undefined ? returns : this;
			}
		};
	}
}(jQuery, window, document));

(function(window, document) {
	if (!window.photoSwipeSettings) {
		window.photoSwipeSettings = {};
	}

	var psSettings = window.photoSwipeSettings;

	function initPhotoSwipeFunc(settings) {
		if (!settings.preloadImages) {
			settings.preloadImages = false;
		}

		var settingsKeys = Object.keys(psSettings);

		if (settingsKeys.length) {
			settingsKeys.forEach(function(key) {
				if (key !== 'hashData') {
					psSettings[key].push(settings[key]);
				}
			});
		} else {
			Object.keys(settings).forEach(function(key) {
				psSettings[key] = [];

				psSettings[key].push(settings[key]);
			});
		}

		var galleryIteration = 0;

		psSettings.gallery.forEach(function(str){
			if (str === settings.gallery) {
				galleryIteration++;
			}
			var index = psSettings.gallery.indexOf(settings.gallery);

			if (galleryIteration > 1) {
				settingsKeys.forEach(function(key) {
					if (key !== 'hashData') {
						psSettings[key].splice(index, 1);
					}
				});
				galleryIteration = 0;
			}
		});

		if (!psSettings.hashData) {
			psSettings.hashData = photoswipeParseHash();
		}

		var hashData = psSettings.hashData;
		var hashDataKeys = Object.keys(hashData);

		if (hashDataKeys.length) {
			settings.preloadImages = true;
		}

		var galleryElements = document.querySelectorAll(psSettings.gallery.join(','));
		var galleryLength = galleryElements.length;

		var pswpHTML = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button>';
		var pswpHTMLEnd = '<div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
		var pswpShare = '', pswpFullscreen = '', pswpZoom = '', curGallery;

		for(var i = 0; i < galleryLength; i++) {
			curGallery = galleryElements[i];

			if (curGallery.getAttribute('data-popup-share') === '1') {
				pswpShare = '<button class="pswp__button pswp__button--share" title="Share"></button>'
			}
			if (curGallery.getAttribute('data-popup-fullscreen') === '1') {
				pswpFullscreen = '<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>';
			}
			if (curGallery.getAttribute('data-popup-zoom') === '1') {
				pswpZoom = '<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>';
			}

			curGallery.setAttribute('data-pswp-uid', i+1);
			curGallery.dataGID = i+1;

			if (settings.preloadImages) {
				parseGalleryImages(curGallery);
			} else {
				parseGalleryThumbs(curGallery);

				if (hashData.pid && hashData.gid && hashData.gid === curGallery.dataGID) {
					openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
				}
			}
		}

		var pswpOverlay = document.querySelectorAll('.pswp');

		if (pswpOverlay.length === 0) {
			pswpHTML = pswpHTML + pswpShare + pswpFullscreen + pswpZoom + pswpHTMLEnd;

			var pswpContainer = document.createElement('div');
			pswpContainer.innerHTML = pswpHTML;

			document.body.appendChild(pswpContainer);
		}

		function parseGalleryImages(gallery){
			var images = gallery.querySelectorAll(settings.item + ' img');
			var imagesLen = images.length;
			var loadedArr = [];

			for (var ind = 0; ind < imagesLen; ind++) {
				setDataSize(images[ind]);
			}
			function setDataSize(img) {
				var tempImg = new Image();

				var link = closest(img, function(el) {
					return (el.tagName && el.tagName === 'A');
				});

                if (!link) {return false;}

				tempImg.src = link.getAttribute('href');

				tempImg.addEventListener('load', function() {
					link.setAttribute('data-size', tempImg.naturalWidth + 'x' + tempImg.naturalHeight);
					tempImg = null;

					loadedArr.push('loaded');

					if (loadedArr.length === imagesLen) {
						parseGalleryThumbs(gallery);

						if (hashData.pid && hashData.gid && hashData.gid === gallery.dataGID) {
							openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
						}
					}
				});
			}
		}
		function parseGalleryThumbs(gallery) {
			var thumbs = gallery.querySelectorAll(settings.item);
			var thumbsLen = thumbs.length;
			var items = [];
			var item, link, image, title, desc, size, obj;

			for (var i = 0; i < thumbsLen; i++) {
				item = thumbs[i];

				item.dataPSIndex = i;
				item.addEventListener('click', onThumbsClick);

				image = item.querySelector('img');
				link = item.querySelector('a[data-size]');

				title = link.getAttribute('data-title');
				desc = item.querySelector(settings.itemDesc);

				size = link.getAttribute('data-size').split('x');

				obj = {
					src: link.getAttribute('href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};

				if (title) {
					obj.title = title;
				}

				if (desc && desc.innerHTML) {
					obj.title += '<br /><small>' + desc.innerHTML + '</small>';
				}

				if (link.children.length > 0) {
					obj.msrc = image.getAttribute('src');
				}

				obj.el = item;

				items.push(obj);
			}
			return items;
		}
		function onThumbsClick(e) {
			e = e || window.event;

			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			var clickedItem = closest(eTarget, function(el) {
				return ('dataPSIndex' in el);
			});

			var clickedGallery = closest(clickedItem, function(el) {
				return el.getAttribute('data-pswp-uid');
			});

			var index = clickedItem.dataPSIndex;

			openPhotoSwipe(index, clickedGallery);

			return false;
		}
		function closest(el, fn) {
			return el && (fn(el) ? el : closest(el.parentNode, fn));
		}
		function openPhotoSwipe(index, gallery, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0];
			if (!gallery) {
				return false;
			}
			var items = parseGalleryThumbs(gallery);
			var options = {
				galleryUID: gallery.getAttribute('data-pswp-uid'),
				getThumbBoundsFn: function(index) {
					var thumbnail = items[index].el.getElementsByTagName('img')[0];
					var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
					var rect = thumbnail.getBoundingClientRect();

					return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
				}
			};
			if (fromURL) {
				if(options['galleryPIDs']) {
					for (var j = 0; j < items.length; j++) {
						if (items[j].pid === index) {
							options.index = j;
							break;
						}
					}
				} else {
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}
			if (isNaN(options.index) ) {
				return;
			}
			if (disableAnimation) {
				options.showAnimationDuration = 0;
				options.hideAnimationDuration = 0;
			}
			var pswpGallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			pswpGallery.init();
			pswpGallery.listen('close', function() {
				setTimeout(function(){
					pswpElement.classList.remove('pswp--open');
				}, 500);
			});
		}
		function photoswipeParseHash() {
			var hash = location.hash.substring(1), params = {};

			if (hash.length < 5) {
				return params;
			}

			var vars = hash.split('&'), varsL = vars.length, pair;

			for (var i = 0; i < varsL; i++) {
				if (!vars[i]) {continue;}

				pair = vars[i].split('=');

				if (pair.length < 2) {continue;}

				params[pair[0]] = pair[1];
			}

			if (params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		}
	}

	if (!window.initPhotoSwipeFunc) {
		window.initPhotoSwipeFunc = initPhotoSwipeFunc;
	}
}(window, document));

$(function () {
	var galleryWrap = $('.s3MosaicGallery');
	var psSettings = {
		gallery: '.s3MosaicGallery',
		item: '.mg-item',
		itemDesc: '.mg-image-desc'
	};

	$(window).on('resize', function(){
		galleryWrap.s3MosaicGallery('update');
	});

	function galleryRender() {
		galleryWrap.each(function(){
			var thisGal = $(this);

			if (thisGal.attr('data-size-increase') === 'photoswipe') {
				thisGal.s3MosaicGallery({
					onAfterLoadGallery: function() {
						initPhotoSwipeFunc(psSettings);
					}
				});
			} else {
				thisGal.s3MosaicGallery();
			}
		});
	}

	galleryRender();
});
/*
 *  wmS3Menu v1.0.0
 *  K.I. 433
 */
;(function ($, window, document, undefined ) {
	var pluginName = 'wmS3Menu',
		defaults = {
			screenButton: false,
			responsiveTl: false,
			responsiveTp: false,
			responsiveMl: false,
			moreText: '...',
			childIcons: false,
			childIconsClass: 'has-child-icon'
		};
	// Проверка на касание
	var isTouchable = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	var $win = $(window);
	var winWidth = $win.width();
	var $doc = $(document);

	var pluginObj = {
		_events: {
			hover: function(menuWrap, item, settings){
				var link = item.find('> a');
				var linkIcon = link.find('.' + settings.childIconsClass);
				var iconLen = linkIcon.length;
				var subMenu = item.find('> ul');
				var showTimeout;
				// Отображение
				function menuShow() {
					clearTimeout(showTimeout);
					item.siblings().find('> ul').css('display', '');
					// Определение положения выпадашки чтобы не выводилось за пределы окна
					pluginObj._menuPosition(subMenu);

					link.addClass('hover');
					if (iconLen) {
						linkIcon.addClass('hover');
					}
				}
				// Скрытие
				function menuHide() {
					showTimeout = setTimeout(function(){
						link.removeClass('hover');
						subMenu.css('display', '');
						if (iconLen) {
							linkIcon.removeClass('hover');
						}
					}, 500);
				}
				// Отключение и подключение событий
				item.off({
					'mouseenter.wmS3Menu': menuShow,
					'mouseleave.wmS3Menu': menuHide
				});
				item.on({
					'mouseenter.wmS3Menu': menuShow,
					'mouseleave.wmS3Menu': menuHide
				});
			},
			click: function(menuWrap, item, settings){
				var link = item.find('> a');
				var linkIcon = link.find('.' + settings.childIconsClass);
				var iconLen = linkIcon.length;
				var subMenu = item.find('> ul');
				// Переключение отображения
				function menuToggle() {
					if (subMenu.is(':visible')) {
						if (isTouchable) {
							document.location = link.attr('href');
						}
						link.removeClass('hover');
						subMenu.css('display', '');
						item.removeClass('submenu-opened');
						if (iconLen) {
							linkIcon.removeClass('hover');
						}
					} else {
						item.siblings().find('> ul').css('display', '');
						item.siblings().find('> a').removeClass('hover');
						item.siblings().find('> a .' + settings.childIconsClass).removeClass('hover');
						// Определение положения выпадашки чтобы не выводилось за пределы окна
						pluginObj._menuPosition(subMenu);

						link.addClass('hover');
						item.addClass('submenu-opened');
						if (iconLen) {
							linkIcon.addClass('hover');
						}
					}
					return false;
				}
				// Отключение и подключение событий
				link.off('click.wmS3Menu');
				link.on('click.wmS3Menu', menuToggle);
			},
			click_tree: function(menuWrap, item, settings){
				var link = item.find('> a');
				var linkIcon = link.find('.' + settings.childIconsClass);
				var subMenu = item.find('> ul');
				// Переключение отображения
				function menuToggle(event) {
					var targ = $(event.target);

					if (targ.closest(linkIcon).length) {
						if (subMenu.is(':visible')) {
							link.removeClass('hover');
							subMenu.css('display', '');
							item.removeClass('submenu-opened');
							linkIcon.removeClass('hover');
						} else {
							// Определение положения выпадашки чтобы не выводилось за пределы окна
							pluginObj._menuPosition(subMenu);

							link.addClass('hover');
							item.addClass('submenu-opened');
							linkIcon.addClass('hover');
						}
						return false;
					}
				}
				// Отключение и подключение событий
				link.off('click.wmS3Menu');
				link.on('click.wmS3Menu', menuToggle);
			}
		},
		_menuPosition: function(subMenu) {
			// Определение положения выпадашки чтобы не выводилось за пределы окна
			winWidth = $win.width();

			subMenu.css('display', 'block');

			if (subMenu.parent().hasClass('first-level') === false) {
				subMenu.css({
					'visibility': 'hidden',
					'opacity': 0
				});

				var menuRect = subMenu[0].getBoundingClientRect();
				var marginR = parseInt(subMenu.css('margin-right'));
				var parentWidth = subMenu.parent().width();

				if (marginR > parentWidth) {
					subMenu.css('margin-right', parentWidth);
				}

				if (menuRect.right >= winWidth) {
					subMenu.css({
						'left': '-100%',
						'margin-left': 0
					});
				}
				subMenu.css({
					'visibility': '',
					'opacity': ''
				});
			}
		}
	};
	function Plugin(element, options) {
		this.element = element;

		this.options = $.extend({}, defaults, options, $(this.element).data()) ;

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}
	Plugin.prototype = {
		init: function () {
			var settings = this.options;
			// Определение ширины медиа
			var moreButFlag = false;
			if (window.matchMedia('all and (max-width: 640px)').matches) {
				moreButFlag = settings.responsiveMl;
			} else if (window.matchMedia('all and (max-width: 768px)').matches) {
				//moreButFlag = settings.responsiveTp;
			} else if (window.matchMedia('all and (max-width: 960px)').matches) {
				moreButFlag = settings.responsiveTl;
			} else {
				moreButFlag = settings.screenButton;
			}
			// Обертка меню
			var menuWrap = $(this.element);
			var menuClass = menuWrap.attr('class');
			var menuMainUl = $(this.element.querySelector('ul'));
			var widgetClass = menuClass.match(/widget-\d+/)[0];
			// Проверка на наличие меню в Side panel
			if (window.side_panel_controller && side_panel_controller.inPanel(widgetClass)) {
				moreButFlag = false;
			}

			menuMainUl.children().addClass('first-level');
			// Настройки для горизонтального меню
			if (!!menuClass.match(/horizontal/i)) {
				var menuWidth = menuMainUl.width();
				var itemsWidth = 0, hideArr = [], hideLength;
				// Кнопка More
				var moreBut = menuMainUl.find('.more-button');
				if (!moreBut.length) {
					moreBut = $('<li class="more-button"><a href="#"><span>' + settings.moreText + '</span></a></li>');// data-trigger="click"
					menuMainUl.append(moreBut);
				}
				// Меню More
				var moreMenu = moreBut.find('> ul');
				if (!moreMenu.length) {
					moreMenu = $('<ul></ul>');
					moreBut.append(moreMenu);
				}

				moreBut.removeClass('removed').attr('data-trigger', 'hover');
				menuMainUl.children().css('display', '');

				var firstLevelItems = menuMainUl.children(':visible').not('.more-button');
				moreMenu.html('');

				if (moreButFlag === 'more' || moreButFlag === 'button') {
					moreBut.removeClass('disabled');

					menuWidth -= moreBut.outerWidth();

					firstLevelItems.each(function(){
						var thisItem = $(this);
						itemsWidth += thisItem.outerWidth(true);
						if (itemsWidth > menuWidth) {
							hideArr.push(thisItem.clone());
							thisItem.hide();
						}
					});

					hideLength = hideArr.length;
					if (hideLength) {
						for (var ind = 0; ind < hideLength; ind++) {
							moreMenu.append(hideArr[ind]);
						}
						moreBut.removeClass('disabled');
					} else {
						moreBut.addClass('disabled');
					}
				} else {
					moreBut.addClass('disabled');
				}
			}
			// Вложенные подуровни меню
			var menuInner = menuMainUl.find('ul');
			var menuItems = menuInner.parent();
			var menuLinks = menuItems.find('> a');
			// Стрелочки для подуровней
			var menuLinksIcons = menuLinks.find('.' + settings.childIconsClass);
			var childIconLen = menuLinksIcons.length;
			// Тип отображения меню
			var mShow = 'popup';
			if (!!menuClass.match(/dropdown/i)) {
				mShow = 'dropdown';
			} else if (!!menuClass.match(/treemenu/i)) {
				mShow = 'treemenu';
			}
			if (mShow === 'popup') {
				menuInner.hide();
			}
			if (childIconLen) {
				menuLinksIcons.remove();
			}
			if (!!settings.childIcons) {
				// Добавление стрелочек для подуровней
				var childIconHTML = '<em class="' + settings.childIconsClass + '"></em>';

				if (mShow === 'treemenu') {
					childIconHTML = '<em class="' + settings.childIconsClass + '"><b style="position: absolute; top: 50%; left: 50%; width: 30px; height: 30px; margin: -15px 0 0 -15px;"></b></em>';
				}

				var childIconTag = $(childIconHTML);
				menuLinks.append(childIconTag.clone());

				menuLinksIcons = menuLinks.find('.' + settings.childIconsClass);
				childIconLen = menuLinksIcons.length;
			}
			// Удаление всех событий на ссылках
			menuLinks.removeClass('hover').off('click.wmS3Menu');
			menuInner.css('display', '');
			if (childIconLen) {
				menuLinksIcons.removeClass('hover');
			}

			menuItems.each(function() {
				var thisItem = $(this);
				var trigger = thisItem.data('trigger') || 'hover';

				if (mShow === 'dropdown' || isTouchable) {
					trigger = 'click';
				} else if (mShow === 'treemenu') {
					trigger = 'click_tree';
				}
				pluginObj._events[trigger](menuWrap, thisItem, settings);
			});
			// Клик по документу
			if (isTouchable) {
				function docClick(e) {
					var target = $(e.target);
					if (target.closest(menuWrap).length === 0) {
						menuLinks.removeClass('hover');
						menuInner.css('display', '');
						menuItems.removeClass('submenu-opened');

						if (childIconLen) {
							menuLinksIcons.removeClass('hover');
						}
					}
				}
				$doc.off('touchstart.wmS3Menu', docClick);
				$doc.on('touchstart.wmS3Menu', docClick);
			}
		},
		update: function () {
			this.init();
		}
	};
	if (!$.fn[pluginName]) {
		$.fn[pluginName] = function (options) {
			var args = arguments;
			if (options === undefined || typeof options === 'object') {
				return this.each(function () {
					if (!$.data(this, 'plugin_' + pluginName)) {
						$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
					}
				});
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				var returns;
				this.each(function () {
					var instance = $.data(this, 'plugin_' + pluginName);
					if (instance instanceof Plugin && typeof instance[options] === 'function') {
						returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
					if (options === 'destroy') {
						$.data(this, 'plugin_' + pluginName, null);
					}
				});
				return returns !== undefined ? returns : this;
			}
		};
	}
	$(function () {
		var wmMenuWrap = $('.wm-widget-menu.horizontal');
		wmMenuWrap[pluginName]();

		$win.on('resize.wmS3Menu', function(){
			wmMenuWrap[pluginName]('update');
		});
	});

	setTimeout(function(){
		$win.trigger('resize');
	}, 500);
}(jQuery, window, document));
document.addEventListener('DOMContentLoaded', function() {
	var bodyScrollBarWidth = (function () {
		var widthHidden, widthScroll, currentValue, currentPriority;
		currentValue = document.body.style.getPropertyValue('overflow');
		currentPriority = document.body.style.getPropertyPriority('overflow');
		document.body.style.setProperty('overflow', 'hidden', 'important');
		widthHidden = document.body.clientWidth;
		document.body.style.setProperty('overflow', 'scroll', 'important');
		widthScroll = document.body.clientWidth;
		document.body.style.setProperty('overflow', currentValue ? currentValue : '', currentPriority);
		return widthHidden - widthScroll;
	}());
	var media = {
		'tablet-landscape': 960,
		'tablet-portrait': 768,
		'mobile-landscape': 640,
		'mobile-portrait': 480
	};
	var side_panel = document.querySelector('.side-panel');
	var side_panel_content, side_panel_content_inner, side_panel_top, side_panel_mask, side_panel_button, side_panel_close, side_panel_controller, leftEdge, rightEdge, isPhantom;
	var layers, content_width, flip, full_width, elements = {}, comments = {};

	if (!side_panel || side_panel.classList.contains('removed')) {
		return;
	}

	flip = side_panel.getAttribute('data-position') === 'right';

	try {
		layers = side_panel.getAttribute('data-layers');
		if (layers !== "") {
			layers = JSON.parse(layers.replace(/\[/g, '{').replace(/\]/g, '}').replace(/\'/g, '"'));
		}
	} catch(e) {
		console.error(e);
	}

	if (typeof layers !== 'object' || Object.keys(layers).length === 0) {
		return;
	}

	Object.keys(layers).forEach(function(clss) {
		elements[clss] = document.querySelector('.' + clss);
		comments[clss] = document.createComment(clss);
		if (elements[clss]) {
			elements[clss].parentNode.insertBefore(comments[clss], elements[clss]);
		} else {
			delete layers[clss];
		}
	});

	side_panel_button = side_panel.querySelector('.side-panel-button');
	side_panel_close = side_panel.querySelector('.side-panel-close');
	side_panel_content = side_panel.querySelector('.side-panel-content');
	side_panel_content_inner = side_panel.querySelector('.side-panel-content-inner') || side_panel_content;
	side_panel_mask = side_panel.querySelector('.side-panel-mask');
	side_panel_top = side_panel.querySelector('.side-panel-top-inner');

	side_panel.classList.remove('hidden');
	side_panel_button.classList.remove('hidden');
	side_panel_button.style.display = 'none';
	side_panel_content.classList.remove('hidden');
	side_panel_content.style.display = 'none';
	side_panel_mask.classList.remove('hidden');
	side_panel_mask.style.display = 'none';

	content_width = getComputedStyle(side_panel_content, null).width;

	leftEdge = 0;
	rightEdge = parseInt(content_width) + 50;

	if (content_width === 'auto') {
		rightEdge = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		full_width = true;
	}

	isPhantom = !!parseInt($(side_panel).attr("data-phantom"));

	if (isPhantom) {
		$(side_panel).css({"pointer-events": "none"});
	} else {
		$(side_panel).css({"pointer-events": "auto"});
	}

	if (flip) {
		side_panel_content.style.left = 'auto';
		side_panel_content.style.right = '0';
	}

	if (full_width) {
		side_panel_content.style.left = '0';
		side_panel_content.style.right = '0';
	}

	window.side_panel_controller = side_panel_controller = new DrawerController({
		target: side_panel,
		full_width: full_width,
		left: leftEdge,
		right: rightEdge,
		position: 0,
		flip: flip,
		curve: 'ease-in-out',
		willOpen: function() {
			side_panel_mask.style.display = 'block';
			side_panel_content.style.display = 'block';
			document.body.classList.add('noscroll');
			if (bodyScrollBarWidth && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
				document.body.style.borderRight = bodyScrollBarWidth + 'px solid transparent'
			}
		},
		didClose: function() {
			side_panel_mask.style.display = 'none';
			side_panel_content.style.display = 'none';
			document.body.classList.remove('noscroll');
			if (bodyScrollBarWidth && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
				document.body.style.borderRight = ''
			}
		},
		onAnimate: function(position) {
			side_panel_mask.style.opacity = position / rightEdge;
			side_panel_content.style.transform = 'translate3d(' + (flip ? rightEdge - position : position - rightEdge) + 'px,0,0)';
		}
	});

	side_panel_controller.inPanel = function(clss) {
		var viewportWidth;
		var current_media;

		if (typeof clss !== 'string') {
			return false;
		}

		if (clss.charAt(0) === '.') {
			clss = clss.slice(1);
		}

		viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		Object.keys(media).forEach(function(key) {
			if (viewportWidth <= media[key]) {
				current_media = key;
			}
		});

		if (typeof current_media === 'undefined') {
			current_media = 'screen';
		}

		return layers[clss] && layers[clss][current_media];
	};

	side_panel_button.addEventListener('click', function(e) {
		e.preventDefault();
		side_panel_controller.toggle();
		return false;
	});

	if (side_panel_close) {
		side_panel_close.addEventListener('click', function(e) {
			e.preventDefault();
			side_panel_controller.close();
			return false;
		});
	}

	side_panel_mask.addEventListener('click', function() {
		side_panel_controller.close();
		return false;
	});

	document.addEventListener('keyup', function(e) {
		if (e.keyCode === 27) {
			side_panel_controller.close();
			return false;
		}
	});

	var debounce = (function () {
		return function (fn, time) {
			var timer, func;
			if (window.requestAnimationFrame) {
				func = function() {
					timer && cancelAnimationFrame(timer);
					timer = requestAnimationFrame(fn);
				}
			} else {
				func = function() {
					window.clearTimeout(timer);
					timer = window.setTimeout(function () {
						fn();
					}, time)
				};
			}
			return func;
		}
	}());

	function checkSidePanel() {
		var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var current_media;
		var emptySide = true;
		var emptyTop = true;

		if (checkSidePanel.viewportWidth === viewportWidth) {
			return;
		}

		checkSidePanel.viewportWidth = viewportWidth;

		Object.keys(media).forEach(function(key) {
			if (viewportWidth <= media[key]) {
				current_media = key;
			}
		});

		if (typeof current_media === 'undefined') {
			current_media = 'screen';
		}

		Object.keys(layers).forEach(function(clss){
			var element, comment;

			element = elements[clss];
			comment = comments[clss];

			if (current_media in layers[clss]) {
				if (layers[clss][current_media] === 'onTop') {
					side_panel_top.appendChild(element);
					emptyTop = false;
				} else {
					side_panel_content_inner.appendChild(element);
					emptySide = false;
				}
			} else {
				if (comment) {
					comment.parentNode.insertBefore(element, comment);
				}
			}
		});

		if (emptySide) {
			side_panel_button.style.display = 'none';
		} else {
			side_panel_button.style.display = 'block';
		}

		if (!emptyTop || !emptySide) {
			side_panel.style.display = 'block';
		} else {
			side_panel.style.display = 'none';
			side_panel_controller.close();
		}
	}

	checkSidePanel = debounce(checkSidePanel, 40);

	checkSidePanel();
	window.addEventListener('resize', checkSidePanel);
});
/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

"use strict";

(function (exports) {

	function sign(number) {
		if (number < 0)
			return -1;
		if (number > 0)
			return 1;
		return 0;
	}

	function Animator(delegate) {
		this.delegate = delegate;
		this.startTimeStamp = 0;
		this.request_ = null;
	};

	Animator.prototype.scheduleAnimation = function () {
		if (this.request_)
			return;
		this.request_ = requestAnimationFrame(this.onAnimation_.bind(this));
	};

	Animator.prototype.startAnimation = function () {
		this.startTimeStamp = 0;
		this.scheduleAnimation();
	};

	Animator.prototype.stopAnimation = function () {
		cancelAnimationFrame(this.request_);
		this.startTimeStamp = 0;
		this.request_ = null;
	};

	Animator.prototype.onAnimation_ = function (timeStamp) {
		this.request_ = null;
		if (!this.startTimeStamp)
			this.startTimeStamp = timeStamp;
		if (this.delegate.onAnimation(timeStamp))
			this.scheduleAnimation();
	};

	function VelocityTracker() {
		this.recentTouchMoves_ = [];
		this.velocityX = 0;
		this.velocityY = 0;
	}

	VelocityTracker.kTimeWindow = 50;

	VelocityTracker.prototype.pruneHistory_ = function (timeStamp) {
		for (var i = 0; i < this.recentTouchMoves_.length; ++i) {
			if (this.recentTouchMoves_[i].timeStamp > timeStamp - VelocityTracker.kTimeWindow) {
				this.recentTouchMoves_ = this.recentTouchMoves_.slice(i);
				return;
			}
		}
		// All touchmoves are old.
		this.recentTouchMoves_ = [];
	};

	VelocityTracker.prototype.update_ = function (e) {
		this.pruneHistory_(e.timeStamp);
		this.recentTouchMoves_.push(e);

		var oldestTouchMove = this.recentTouchMoves_[0];

		var deltaX = e.changedTouches[0].clientX - oldestTouchMove.changedTouches[0].clientX;
		var deltaY = e.changedTouches[0].clientY - oldestTouchMove.changedTouches[0].clientY;
		var deltaT = e.timeStamp - oldestTouchMove.timeStamp;

		if (deltaT > 0) {
			this.velocityX = deltaX / deltaT;
			this.velocityY = deltaY / deltaT;
		} else {
			this.velocityX = 0;
			this.velocityY = 0;
		}
	};

	VelocityTracker.prototype.onTouchStart = function (e) {
		this.recentTouchMoves_.push(e);
		this.velocityX = 0;
		this.velocityY = 0;
	};

	VelocityTracker.prototype.onTouchMove = function (e) {
		this.update_(e);
	};

	VelocityTracker.prototype.onTouchEnd = function (e) {
		this.update_(e);
		this.recentTouchMoves_ = [];
	};

	function LinearTimingFunction() {
	};

	LinearTimingFunction.prototype.scaleTime = function (fraction) {
		return fraction;
	};

	function CubicBezierTimingFunction(spec) {
		this.map = [];
		for (var ii = 0; ii <= 100; ii += 1) {
			var i = ii / 100;
			this.map.push([
				3 * i * (1 - i) * (1 - i) * spec[0] +
				3 * i * i * (1 - i) * spec[2] + i * i * i,
				3 * i * (1 - i) * (1 - i) * spec[1] +
				3 * i * i * (1 - i) * spec[3] + i * i * i
			]);
		}
	};

	CubicBezierTimingFunction.prototype.scaleTime = function (fraction) {
		var fst = 0;
		while (fst !== 100 && fraction > this.map[fst][0]) {
			fst += 1;
		}
		if (fraction === this.map[fst][0] || fst === 0) {
			return this.map[fst][1];
		}
		var yDiff = this.map[fst][1] - this.map[fst - 1][1];
		var xDiff = this.map[fst][0] - this.map[fst - 1][0];
		var p = (fraction - this.map[fst - 1][0]) / xDiff;
		return this.map[fst - 1][1] + p * yDiff;
	};

	var presetTimingFunctions = {
		'linear': new LinearTimingFunction(),
		'ease': new CubicBezierTimingFunction([0.25, 0.1, 0.25, 1.0]),
		'ease-in': new CubicBezierTimingFunction([0.42, 0, 1.0, 1.0]),
		'ease-out': new CubicBezierTimingFunction([0, 0, 0.58, 1.0]),
		'ease-in-out': new CubicBezierTimingFunction([0.42, 0, 0.58, 1.0]),
	};

	function DrawerController(options) {
		this.velocityTracker = new VelocityTracker();
		this.animator = new Animator(this);

		this.target = options.target;
		this.left = options.left;
		this.right = options.right;
		this.position = options.position;
		this.flip = options.flip;
		this.full_width = options.full_width;

		this.width = this.right - this.left;
		this.curve = presetTimingFunctions[options.curve || 'linear'];

		this.willOpenCallback = options.willOpen;
		this.didCloseCallback = options.didClose;
		this.animateCallback = options.onAnimate;

		this.state = DrawerController.kClosed;

		this.defaultAnimationSpeed = (this.right - this.left) / DrawerController.kBaseSettleDurationMS;

		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);

		if (!this.full_width) {
			this.target.addEventListener('touchstart', this.onTouchStart.bind(this));
		}
	}

	DrawerController.kOpened = 'opened';
	DrawerController.kClosed = 'closed';
	DrawerController.kOpening = 'opening';
	DrawerController.kClosing = 'closing';
	DrawerController.kDragging = 'dragging';
	DrawerController.kFlinging = 'flinging';

	DrawerController.kBaseSettleDurationMS = 246;
	DrawerController.kMaxSettleDurationMS = 600;

	DrawerController.kMinFlingVelocity = 0.4;  // Matches Android framework.
	DrawerController.kTouchSlop = 5;  // Matches Android framework.
	DrawerController.kTouchSlopSquare = DrawerController.kTouchSlop * DrawerController.kTouchSlop;

	DrawerController.prototype.restrictToCurrent = function (offset) {
		return Math.max(this.left, Math.min(this.position, offset));
	};

	DrawerController.prototype.restrictToBounds = function (offset) {
		return Math.max(this.left, Math.min(this.right, offset));
	};

	DrawerController.prototype.onTouchStart = function (e) {
		this.velocityTracker.onTouchStart(e);

		var touchX;
		if (this.flip) {
			touchX = document.documentElement.clientWidth - e.changedTouches[0].clientX;
		} else {
			touchX = e.changedTouches[0].clientX;
		}
		var touchY = e.changedTouches[0].clientY;

		if (this.state != DrawerController.kOpened) {
			if (touchX != this.restrictToCurrent(touchX))
				return;
			this.state = DrawerController.kDragging;
		}

		this.animator.stopAnimation();
		this.target.addEventListener('touchmove', this.onTouchMove);
		this.target.addEventListener('touchend', this.onTouchEnd);
		// TODO(abarth): Handle touchcancel.

		this.startX = touchX;
		this.startY = touchY;
		this.startPosition = this.position;
		this.touchBaseX = Math.min(touchX, this.startPosition);
	};

	DrawerController.prototype.onTouchMove = function (e) {
		this.velocityTracker.onTouchMove(e);

		if (this.state == DrawerController.kOpened) {
			var deltaX;
			if (this.flip) {
				deltaX = document.documentElement.clientWidth - e.changedTouches[0].clientX - this.startX;
			} else {
				deltaX = e.changedTouches[0].clientX - this.startX;
			}
			var deltaY = e.changedTouches[0].clientY - this.startY;

			if (deltaX * deltaX + deltaY * deltaY < DrawerController.kTouchSlopSquare) {
				e.preventDefault();
				return;
			}

			if (Math.abs(deltaY) > Math.abs(deltaX)) {
				this.target.removeEventListener('touchmove', this.onTouchMove);
				this.target.removeEventListener('touchend', this.onTouchEnd);
				return;
			}

			this.state = DrawerController.kDragging;
		}

		e.preventDefault();
		var touchDeltaX;
		if (this.flip) {
			touchDeltaX = document.documentElement.clientWidth - e.changedTouches[0].clientX - this.touchBaseX;
		} else {
			touchDeltaX = e.changedTouches[0].clientX - this.touchBaseX;
		}
		this.position = this.restrictToBounds(this.startPosition + touchDeltaX);
		this.animator.scheduleAnimation();
	};

	DrawerController.prototype.onTouchEnd = function (e) {
		this.velocityTracker.onTouchEnd(e);
		this.target.removeEventListener('touchmove', this.onTouchMove);
		this.target.removeEventListener('touchend', this.onTouchEnd);

		var velocityX = this.velocityTracker.velocityX;

		if (this.flip) {
			velocityX *= -1;
		}

		if (Math.abs(velocityX) > DrawerController.kMinFlingVelocity) {
			this.fling(velocityX);
		} else if (this.isOpen()) {
			this.open();
		} else {
			this.close();
		}
	};

	DrawerController.prototype.openFraction = function () {
		var width = this.right - this.left;
		var offset = this.position - this.left;
		return offset / width;
	};

	DrawerController.prototype.isOpen = function () {
		return this.openFraction() >= 0.5;
	};

	DrawerController.prototype.isOpening = function () {
		return this.state == DrawerController.kOpening ||
			(this.state == DrawerController.kFlinging && this.animationVelocityX > 0);
	}

	DrawerController.prototype.isClosing = function () {
		return this.state == DrawerController.kClosing ||
			(this.state == DrawerController.kFlinging && this.animationVelocityX < 0);
	}

	DrawerController.prototype.toggle = function () {
		if (this.isOpen())
			this.close();
		else
			this.open();
	};

	DrawerController.prototype.open = function () {
		if (this.full_width) {
			this.willOpenCallback.call(this.target);
			return;
		}
		if (!this.position)
			this.willOpenCallback.call(this.target);

		this.animator.stopAnimation();
		this.animationDuration = 400;
		this.state = DrawerController.kOpening;
		this.animate();
	};

	DrawerController.prototype.close = function () {
		if (this.full_width) {
			this.didCloseCallback.call(this.target);
			return;
		}
		this.animator.stopAnimation();
		this.animationDuration = 400;
		this.state = DrawerController.kClosing;
		this.animate();
	};

	DrawerController.prototype.fling = function (velocityX) {
		this.animator.stopAnimation();
		this.animationVelocityX = velocityX;
		this.state = DrawerController.kFlinging;
		this.animate();
	};

	DrawerController.prototype.animate = function () {
		this.positionAnimationBase = this.position;
		this.animator.startAnimation();
	};

	DrawerController.prototype.targetPosition = function (deltaT) {
		if (this.state == DrawerController.kFlinging)
			return this.positionAnimationBase + this.animationVelocityX * deltaT;
		var targetFraction = this.curve.scaleTime(deltaT / this.animationDuration);
		var animationWidth = this.state == DrawerController.kOpening ?
		this.width - this.positionAnimationBase : -this.positionAnimationBase;
		return this.positionAnimationBase + targetFraction * animationWidth;
	};

	DrawerController.prototype.onAnimation = function (timeStamp) {
		if (this.state == DrawerController.kDragging) {
			this.animateCallback.call(this.target, this.position);
			return false;
		}

		var deltaT = timeStamp - this.animator.startTimeStamp;
		var targetPosition = this.targetPosition(deltaT);
		this.position = this.restrictToBounds(targetPosition);

		this.animateCallback.call(this.target, this.position);

		if (targetPosition <= this.left && this.isClosing()) {
			this.state = DrawerController.kClosed;
			this.didCloseCallback.call(this.target);
			return false;
		}
		if (targetPosition >= this.right && this.isOpening()) {
			this.state = DrawerController.kOpened;
			return false;
		}

		return true;
	};


	exports.DrawerController = DrawerController;

})(window);
