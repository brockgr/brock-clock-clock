jQuery( document ).ready(function($) {

    // Disable if using multiple screens on https://code.google.com/p/websaver/
    if (window.location.search.match(/\bscreen=[^0]\b/)) {
        window.document.body.innerHTML="";
        return;
    }

    var segments = [ 'a','b','c','d','e','f' ];
        angles = {
            0: { a:{h:180,m:90},  b:{h:180,m:270}, c:{h:0,m:180},   d:{h:180,m:0},  e:{h:0,m:90},    f:{h:0,m:270}   },
            1: { a:{h:225,m:225}, b:{h:180,m:180}, c:{h:225,m:225}, d:{h:180,m:0},  e:{h:225,m:225}, f:{h:0,m:0}     },
            2: { a:{h:90,m:90},   b:{h:270,m:180}, c:{h:180,m:90},  d:{h:0,m:270},  e:{h:0,m:90},    f:{h:270,m:270} },
            3: { a:{h:90,m:90},   b:{h:270,m:180}, c:{h:90,m:90},   d:{h:270,m:0},  e:{h:90,m:90},   f:{h:270,m:0}   },
            4: { a:{h:180,m:180}, b:{h:180,m:180}, c:{h:0,m:90},    d:{h:180,m:0},  e:{h:225,m:225}, f:{h:0,m:0}     },
            5: { a:{h:180,m:90},  b:{h:270,m:270}, c:{h:0,m:90},    d:{h:180,m:270}, e:{h:90,m:90},  f:{h:0,m:270}   },
            6: { a:{h:180,m:90},  b:{h:270,m:270}, c:{h:0,m:180},   d:{h:180,m:270}, e:{h:0,m:90},   f:{h:270,m:0}   },
            7: { a:{h:90,m:90},   b:{h:270,m:180}, c:{h:225,m:225}, d:{h:180,m:0},  e:{h:225,m:225}, f:{h:0,m:0}     },
            8: { a:{h:180,m:90},  b:{h:180,m:270}, c:{h:90,m:0},    d:{h:270,m:0},  e:{h:90,m:0},    f:{h:270,m:0}   },
            9: { a:{h:180,m:90},  b:{h:180,m:270}, c:{h:0,m:90},    d:{h:0,m:180},  e:{h:90,m:90},   f:{h:0,m:270}   },
        },
        minutes_rotation_time = 1.5;

    $.fn.clock = function() {
        var $this = $(this), i;

        for (i=0; i<60; i++) {
            $("<div class=\"tick tick-"+i+(i%5?"":" major-tick")+"\"></div>").css({
                "left": ""+(49.0+48.0*Math.cos(Math.PI * i / 30))+"%",
                "top": ""+(49.0+48.0*Math.sin(Math.PI * i / 30))+"%",
                "transform": "rotate("+(90+i*6)+"deg)"
            }).appendTo($this);
        }
    
        $("<div class=\"minute-hand\"></div>").css({
            "transform": "rotate(270deg)",
        }).data('angle',270).appendTo($this);
    
        $("<div class=\"hour-hand\"></div>").css({
            "transform": "rotate(90deg)",
        }).data('angle',90).appendTo($this);
    
    };
    
    $.fn.clockSetAngle = function(degs) {
        var $this=$(this),
            $min_hand = $this.find(".minute-hand"),
            $hour_hand = $this.find(".hour-hand"),
            curr_hour_deg = ($hour_hand.data('angle')%360)-360,
            curr_min_deg = ($min_hand.data('angle')%360)-360,
            hour_deg_delta = degs.h - curr_hour_deg,
            min_deg = Math.ceil(hour_deg_delta*4/360)*360 + degs.m,
            transition_time = minutes_rotation_time * (min_deg - curr_min_deg) / 360;
    
        $hour_hand.css({
            "transition-duration": "0s",
            "transform": "rotate("+curr_hour_deg+"deg)"
        });
        $min_hand.css({
            "transition-duration": "0s",
            "transform": "rotate("+curr_min_deg+"deg)"
        });

        $hour_hand.data('angle', degs.h);
        $min_hand.data('angle', min_deg);

        setTimeout(function() {
            $hour_hand.css({"transition-duration": ""+transition_time+"s"});
            $min_hand.css({"transition-duration": ""+transition_time+"s"});
            $hour_hand.css({"transform": "rotate("+degs.h+"deg)"});
            $min_hand.css({"transform": "rotate("+min_deg+"deg)"});
        }, 0);
    };

    $.fn.clockSetDigit = function(num) {
        var $this=$(this);

        $.each(segments, function(n,segment) {
            var $clock = $this.filter('.segment-'+segment);
            $clock.clockSetAngle(angles[num][segment])
        });
    }

    function setTime() {
         var today = new Date();
         var h = today.getHours();
         var m = today.getMinutes();
         var w = (60 - today.getSeconds()) || 60;

         // Only render if we are sure we have time to finish
         if (w > minutes_rotation_time * 6) {
             $('.digit-1').clockSetDigit(Math.floor(h/10))
             $('.digit-2').clockSetDigit(h%10)
             $('.digit-3').clockSetDigit(Math.floor(m/10))
             $('.digit-4').clockSetDigit(m%10)
         }

         setTimeout(setTime,w*1000);
    }

    $('.clock').clock();
    setTimeout(setTime,0);

});
