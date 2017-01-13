

//init spinner
var opts = {
    lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
}
var spinner = new Spinner(opts).spin();

/**
 *
 */
function initConfig() {
    
  loadConfig('#congregation');
  var val = $('#congregation').val();
  $('#congregationSpan1').html(val);
  $('#congregationSpan2').html(val);
  loadConfig('#cal1');
  loadConfig('#cal2');
  loadConfig('#cal3');
  loadConfig('#cal4');  

  $('#congregation').keyup( function() {
      var val = $(this).val();
      $('#congregationSpan1').html(val);
      $('#congregationSpan2').html(val);

      localStorage.setItem('#congregation', val);
  });

  $('#cal1').keyup( function() { 
      localStorage.setItem('#cal1', $(this).val());
  });

  $('#cal2').keyup( function() { 
      localStorage.setItem('#cal2', $(this).val());
  });

  $('#cal3').keyup( function() { 
      localStorage.setItem('#cal3', $(this).val());
  });

  $('#cal4').keyup( function() { 
      localStorage.setItem('#cal4', $(this).val());
  });  
}

/**
 *
 */
function loadConfig( fieldId ) {
  $(fieldId)[0].value = localStorage.getItem(fieldId);
}

/**
 *
 */
function storeConfig( fieldId ) {
  var inputField = $(fieldId);
  console.log(inputField);
  localStorage.setItem(fieldId, inputField[0].value);
}

/**
 *
 */
function loadCalendar() {
  console.log("start loading Calendar1 ..."); 

  var calDiv = $('#calendar');

  calDiv.append(spinner.el);
  calDiv.fullCalendar( 'removeEvents' );

  var icalURL = $('#cal1').val();
  new ical_parser("http://cors-anywhere.herokuapp.com/" +icalURL, function(cal){    
      var icalEvents = cal.getEvents();
      var events = [];
      icalEvents.forEach(function (icalEv) {
          //console.log("event: title="+ icalEv.SUMMARY + ", start=" + icalEv.DTSTART + ", end=" + icalEv.DTEND );
          events.push({
              id: icalEv.UID,
              title: icalEv.SUMMARY + ' \n(' + icalEv.LOCATION + ')',
              start: icalEv.DTSTART, // will be parsed
              end: icalEv.DTEND
          });
      });
      calDiv.fullCalendar( 'renderEvents', events );

      spinner.stop();
      console.log("done loading Calendar1 ...");
  });  
}
