$j(document).ready(function () {
    function loadApp() {
        $j('#canvas').fadeIn(1000);
        var flipbook = $j('.magazine');

        // Check if the CSS was already loaded
        if (flipbook.width() == 0 || flipbook.height() == 0) {
            setTimeout(loadApp, 10);
            return;
        }
        // Create the flipbook
        flipbook.turn({
            // Magazine width
            width: 1200,
            // Magazine height
            height: 600,
            // Duration in millisecond
            duration: 1000,
            // Hardware acceleration
            acceleration: !isChrome(),
            // Enables gradients
            gradients: true,
            // Auto center this flipbook
            autoCenter: true,
            // Elevation from the edge of the flipbook when turning a page
            elevation: 50,
            // The number of pages
            pages: 64,
            // Events
            when: {
                turning: function (event, page, view) {
                    var book = $j(this),
                        currentPage = book.turn('page'),
                        pages = book.turn('pages');

                    // Update the current URI
                    Hash.go('page/' + page).update();
                    // Show and hide navigation buttons
                    disableControls(page);
                    $j('.thumbnails .page-' + currentPage).parent().removeClass('current');
                    $j('.thumbnails .page-' + page).parent().addClass('current');
                },

                turned: function (event, page, view) {
                    disableControls(page);
                    $j(this).turn('center');

                    if (page == 1) {
                        $j(this).turn('peel', 'br');
                    }
                },

                missing: function (event, pages) {
                    // Add pages that aren't in the magazine
                    for (var i = 0; i < pages.length; i++) {
                        addPage(pages[i], $j(this));
                    }
                }
            }
        });

        // Zoom.js
        $j('.magazine-viewport').zoom({
            flipbook: $j('.magazine'),

            max: function () {
                return largeMagazineWidth() / $j('.magazine').width();
            },
            when: {
                swipeLeft: function () {
                    $j(this).zoom('flipbook').turn('next');
                },

                swipeRight: function () {
                    $j(this).zoom('flipbook').turn('previous');
                },

                resize: function (event, scale, page, pageElement) {
                    if (scale == 1) {
                        loadSmallPage(page, pageElement);
                    } else {
                        loadLargePage(page, pageElement);
                    }
                },

                zoomIn: function () {
                    $j('.thumbnails').hide();
                    $j('.made').hide();
                    $j('.magazine').removeClass('animated').addClass('zoom-in');
                    $j('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');

                    if (!window.escTip && !$j.isTouch) {
                        escTip = true;
                        $j('<div />', {'class': 'exit-message'}).html('<div>Press ESC to exit</div>').appendTo($j('body')).delay(2000).animate({opacity: 0}, 500, function () {
                            $j(this).remove();
                        });
                    }
                },

                zoomOut: function () {
                    $j('.exit-message').hide();
                    $j('.thumbnails').fadeIn();
                    $j('.made').fadeIn();
                    $j('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

                    setTimeout(function () {
                        $j('.magazine').addClass('animated').removeClass('zoom-in');
                        resizeViewport();
                    }, 0);
                }
            }
        });

        // Zoom event

        if ($j.isTouch) {
            $j('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
        } else {
            $j('.magazine-viewport').bind('zoom.tap', zoomTo);
        }
        // Using arrow keys to turn the page
        $j(document).keydown(function (e) {
            var previous = 37, next = 39, esc = 27;

            switch (e.keyCode) {
                case previous:
                    // left arrow
                    $j('.magazine').turn('previous');
                    e.preventDefault();
                    break;
                case next:
                    //right arrow
                    $j('.magazine').turn('next');
                    e.preventDefault();
                    break;
                case esc:
                    $j('.magazine-viewport').zoom('zoomOut');
                    e.preventDefault();
                    break;
            }
        });

        // URIs - Format #/page/1
        Hash.on('^page\/([0-9]*)$', {
            yep: function (path, parts) {
                var page = parts[1];

                if (page !== undefined) {
                    if ($j('.magazine').turn('is')) {
                        $j('.magazine').turn('page', page);
                    }
                }

            },

            nop: function (path) {
                if ($j('.magazine').turn('is')) {
                    $j('.magazine').turn('page', 1);
                }
            }
        });

        $j(window).resize(function () {
            resizeViewport();
        }).bind('orientationchange', function () {
            resizeViewport();
        });

        // Events for thumbnails
        $j('.thumbnails').click(function (event) {
            var page;

            if (event.target && (page = /page-([0-9]+)/.exec($j(event.target).attr('class')))) {
                $j('.magazine').turn('page', page[1]);
            }
        });

        $j('.thumbnails li').bind($j.mouseEvents.over, function () {
            $j(this).addClass('thumb-hover');
        }).bind($j.mouseEvents.out, function () {
            $j(this).removeClass('thumb-hover');
        });

        if ($j.isTouch) {
            $j('.thumbnails').addClass('thumbanils-touch').bind($j.mouseEvents.move, function (event) {
                event.preventDefault();
            });
        } else {
            $j('.thumbnails ul').mouseover(function () {
                $j('.thumbnails').addClass('thumbnails-hover');
            }).mousedown(function () {
                return false;
            }).mouseout(function () {
                $j('.thumbnails').removeClass('thumbnails-hover');
            });
        }

        // Regions
        if ($j.isTouch) {
            $j('.magazine').bind('touchstart', regionClick);
        } else {
            $j('.magazine').click(regionClick);
        }

        // Events for the next button
        $j('.next-button').bind($j.mouseEvents.over, function () {
            $j(this).addClass('next-button-hover');
        }).bind($j.mouseEvents.out, function () {
            $j(this).removeClass('next-button-hover');
        }).bind($j.mouseEvents.down, function () {
            $j(this).addClass('next-button-down');
        }).bind($j.mouseEvents.up, function () {
            $j(this).removeClass('next-button-down');
        }).click(function () {
            $j('.magazine').turn('next');
        });

        // Events for the next button
        $j('.previous-button').bind($j.mouseEvents.over, function () {
            $j(this).addClass('previous-button-hover');
        }).bind($j.mouseEvents.out, function () {
            $j(this).removeClass('previous-button-hover');
        }).bind($j.mouseEvents.down, function () {
            $j(this).addClass('previous-button-down');
        }).bind($j.mouseEvents.up, function () {
            $j(this).removeClass('previous-button-down');
        }).click(function () {
            $j('.magazine').turn('previous');
        });

        resizeViewport();
        $j('.magazine').addClass('animated');
    }

// Zoom icon
    $j('.zoom-icon').bind('mouseover', function () {

        if ($j(this).hasClass('zoom-icon-in')) {
            $j(this).addClass('zoom-icon-in-hover');
        }

        if ($j(this).hasClass('zoom-icon-out')) {
            $j(this).addClass('zoom-icon-out-hover');
        }
    }).bind('mouseout', function () {

        if ($j(this).hasClass('zoom-icon-in')) {
            $j(this).removeClass('zoom-icon-in-hover');
        }

        if ($j(this).hasClass('zoom-icon-out')) {
            $j(this).removeClass('zoom-icon-out-hover');
        }
    }).bind('click', function () {

        if ($j(this).hasClass('zoom-icon-in')) {
            $j('.magazine-viewport').zoom('zoomIn');
        } else if ($j(this).hasClass('zoom-icon-out')) {
            $j('.magazine-viewport').zoom('zoomOut');
        }
    });

    $j('#canvas').hide();

// Load the HTML4 version if there's not CSS transform
    yepnope({
        test: Modernizr.csstransforms,
        yep: ['../js/catalogue/lib/turn.js'],
        nope: ['../js/catalogue/lib/turn.html4.js'],
        both: ['../js/catalogue/lib/zoom.js', '../js/catalogue/magazine/js/magazine.js', '../js/catalogue/magazine/css/magazine.css'],
        complete: loadApp
    });
});