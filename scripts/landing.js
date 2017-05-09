var pointsArray = document.getElementsByClassName('point');

    var animatePoints = function(points) {
      var revealPoint = function(i) {
         points[i].style.opacity = 1;
         points[i].style.transform = "scaleX(1) translateY(0)";
         points[i].style.msTransform = "scaleX(1) translateY(0)";
         points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
      };

      for (var i = 0; i < points.length; i++) {
        revealPoint(i);
      }

    };

  // adding $() to convert all instances of *window* into jQuery object
  $(window).load(function() {
    
    //  updating *.innerHeight* property to jQuery *height()* method (which gets or sets object height)
    // since no arguments are passed to function, will *get* the height
    if ($(window).height() > 950) {
      animatePoints();
    }

    // now that jQuery can select element with fewer characters, there is no need for a separate variable to hold the *.selling-points* element
    // replacing *getBoundingClientRect()* with the jQuery *.offset()* method
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

    // *addEventListener()* method change to jQuery *scroll()* method (so function can be taken as argument)
    // jQuery *scroll()* "method" still event handler (like *addEventListener()*), but jQuery wrapper obscures the appearance of events
    // function will execute when the indow scrolls
    $(window).scroll(function(event) {

      // lengthy *document.documentElement..* replaced with concise jQuery equivalent => $(window).scrollTop()
      if ($(window).scrollTop() >= scrollDistance) {
        animatePoints();
      }
    });
  });
