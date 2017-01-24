
"use strict";

//init spinner
var opts = {
    lines: 13, // The number of lines to draw
    length: 28, // The length of each line
    width: 14, // The line thickness
    radius: 42, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#000', // #rgb or #rrggbb or array of colors
    opacity: 0.25, // Opacity of the lines
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    position: 'absolute', // Element positioning
};
var spinner;

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

    $('#calendar').fullCalendar({
          timeFormat: 'H:mm',
          height: 'auto',
          header: {
              left:   'title',
              center: '',
              right:  'prev,next'
          },
          eventRender: function(event, el) {
              el.find('.fc-content').attr("contenteditable", "true");
              el.find('.fc-content').attr("onclick", "$(this).focus();");
              el.find('.fc-time').attr("contenteditable", "true");
              el.find('.fc-time').attr("onclick", "$(this).focus();");
              el.find('.fc-title').attr("contenteditable", "true");
              el.find('.fc-title').attr("onclick", "$(this).focus();");
          }
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
    console.log("start loading Calendar(s) ...");

    var calDiv = $('#calendar');
    spinner = new Spinner(opts).spin();
    calDiv.append(spinner.el);
    calDiv.fullCalendar( 'removeEvents' );

    var icalURL = $('#cal1').val();

        if($('#cal1').val() !== "") {
            try{
                new ical_parser("http://cors-anywhere.herokuapp.com/" +$('#cal1').val(),
                                renderEvents,
                                loadFailed);
            } catch (e) {
                console.log("Exception: " + e);
                spinner.stop();
            }
        }
        if($('#cal2').val() !== "") {
                new ical_parser(
                    "http://cors-anywhere.herokuapp.com/" +$('#cal2').val(),
                    renderEvents,
                    loadFailed);

        }
        if($('#cal3').val() !== "") {
            try{
                new ical_parser("http://cors-anywhere.herokuapp.com/" +$('#cal3').val(),renderEvents);
            } catch (e) {
                console.log("Exception: " + e);
                spinner.stop();
            }
        }
        if($('#cal4').val() !== "") {
            try{
                new ical_parser("http://cors-anywhere.herokuapp.com/" +$('#cal4').val(),renderEvents);
            } catch (e) {
                console.log("Exception: " + e);
                spinner.stop();
            }
        }

}

/**
 * Render the calendar events.
 */
function renderEvents(cal){
  console.log("cal: " + cal);
  var calDiv = $('#calendar');
  spinner.spin();
  var icalEvents = cal.getEvents();
  var events = [];
  icalEvents.forEach(function (icalEv) {
      //console.log("event: title="+ icalEv.SUMMARY + ", start=" + icalEv.DTSTART + ", end=" + icalEv.DTEND );
      events.push({
          id: icalEv.UID,
          title: icalEv.SUMMARY + ' \n' + icalEv.LOCATION + ' ',
          start: icalEv.DTSTART, // will be parsed
          end: icalEv.DTEND
      });
  });
  calDiv.fullCalendar( 'renderEvents', events, true );

  spinner.stop();
  console.log("done loading Calendar ...");
}

/**
 * Failed loading iCal data.
 */
function loadFailed(e) {
    console.log("Exception: " + e);
    spinner.stop();
}


/** HTML to Microsoft Word Export Demo
 * This code demonstrates how to export an html element to Microsoft Word
 * with CSS styles to set page orientation and paper size.
 * Tested with Word 2010, 2013 and FireFox, Chrome, Opera, IE10-11
 * Fails in legacy browsers (IE<10) that lack window.Blob object
 * see: http://stackoverflow.com/questions/36330859/export-html-table-as-word-file-and-change-file-orientation
 */
function export2Word(element) {

  if (!window.Blob) {
    alert('Ihr Browser ist leider veraltet und unterstützt diese Funktion nicht.');
    return;
  }

  convertImagesToBase64(element);

  var cssRules = {
    'propertyGroups' : {
        'block' : ['margin', 'padding', 'float'],
        'inline' : ['color'],
        'headings' : ['font-size', 'font-family',],
        'tables': ['width'],
        'images': ['width', 'height', 'margin', 'padding', 'float', 'display']
    },
    'elementGroups' : {
        'block' : ['DIV', 'P', 'H1', 'H2'],
        'inline' : ['SPAN'],
        'headings' : ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
        'tables' : ['TABLE', 'TR', 'TH', 'TD'],
        'images': ['img']
    }
  };
  //$(element).inlineStyler( cssRules );
  $(element).inlineStyler();
  var html, link, url;

  var css = '<style>';
  $.get('../css/fullcalendar.min.css', function(data) {
    css = css + data;
  });
  $.get('../css/fullcalendar.print.min.css', function(data) {
    css = css + data;
  });
    $.get('../css/sheets-of-paper-a4.css', function(data) {
    css = css + data;
  });
  $.get('../css/style.css', function(data) {
      css = css + data;
  });
  $.get('../css/print.css', function(data) {
      css = css + data;
  });
  $.get('../css/print_cal.css', function(data) {
      css = css + data;
  });
  css = css + '</style>';
  var head = '<!DOCTYPE html> <html><head>' + css + '</head>';

   html = element.innerHTML;

   $(html).contents().each(function() {
    if(this.nodeType === Node.COMMENT_NODE) {
        $(this).remove();
    }
   });
   var doc = head + '<body>' + html +  '</body>';

  console.info("HTML: " + doc);
    var converted = htmlDocx.asBlob(doc, {
        orientation: 'portrait',
        margins: { top: 720, bottom: 720, left: 720, right: 720}
    });

    saveAs(converted, 'Termine.docx');
/*
   url = URL.createObjectURL(converted);
   link = document.createElement('A');
   link.href = url;
   // Set default file name.
   // Word will append file extension - do not add an extension here.
   link.download = 'Termine';
   document.body.appendChild(link);
   if (navigator.msSaveOrOpenBlob ) {
     navigator.msSaveOrOpenBlob( blob, 'Termine.docx'); // IE10-11
   } else {
     link.click();  // other browsers
   }
   document.body.removeChild(link);
   */
 }

/**
 * Convert refered Image to inline.
 */
function convertImagesToBase64 (element) {

  var regularImages = $(element).find('img');
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  [].forEach.call(regularImages, function (imgElement) {
	// preparing canvas for drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = imgElement.naturalWidth;
	canvas.height = imgElement.naturalHeight;
	ctx.drawImage(imgElement, 0, 0);
	// by default toDataURL() produces png image, but you can also export to jpeg
	// checkout function's documentation for more details
	var dataURL = canvas.toDataURL();
	imgElement.setAttribute('src', dataURL);
  });
  canvas.remove();

  return element;
}
