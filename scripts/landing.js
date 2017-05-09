// remove DOM selector
var animatePoints = function() {
  var revealPoint = function() {

    // with concise *.point* selection, a variable (previously used to store element) is no longer necessary
    // style property instances replaced with jQuery *css()* method
    // vendor prefixes (on *transform* property) no longer necessary given jQuery's cross-browser compatibility
    // each time jQuery executes *revealPoint()* callback, $(this) will reference a different .point element
    $(this).css({
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  };

    // revealPoint function no longer requires argument; now refers to $(this) rather than a specfic .point element
    // to use *this* with jQuery, must wrap it in jQuery object
    // for loop replaced with jQuery $.each() function // function iterates over each .point element, executing the callback function *revealPoint*
    $.each($('.point'), revealPoint);
};


// adding $() to convert all instances of *window* into jQuery object
$(window).load(function() {

  //  updating *.innerHeight* property to jQuery *height()* method (which gets or sets object height)
  // since no arguments are passed to function, will *get* the height
  if ($(window).height() > 950) {
    animatePoints();
  }

  // making selection process more efficient, jQuery negates previous need to store *.selling-points* element in a variable
  // replacing *getBoundingClientRect()* with the jQuery *.offset()* method
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  // *addEventListener()* method changed to jQuery *scroll()* method (function can now be taken as argument)
  // jQuery *scroll()* "method" is still event handler, but jQuery wrapper obscures appearance of events
  // function will execute when the indow scrolls
  $(window).scroll(function(event) {

    // lengthy *document.documentElement..* replaced with concise jQuery equivalent => $(window).scrollTop()
    if ($(window).scrollTop() >= scrollDistance) {
      animatePoints();

      // *pointsArray* argument removed from *animatePoints()* during *window.onload* update
    }
  });
});
