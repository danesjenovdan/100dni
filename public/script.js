/* eslint-disable */
$(function onReady() {
  var popups = null;
  $.getJSON('popups.json', function onSuccess(data) {
    popups = data;
    if (autoOpenPopup) {
      openPopup({ link: autoOpenPopup });
      autoOpenPopup = '';
    }
  });

  var $sideText = $('.side-text');
  var $sideTextContainer = $('.side-text-container');
  var $closeButton = $('.close-button');
  var $letter = $('.letter-container');

  var hrefParts = window.location.href.split('?')[0].split('/');
  var autoOpenPopup = hrefParts[hrefParts.length - 1].toLowerCase();

  function changeLink(link) {
    if (window.history && window.history.pushState) {
      var url = hrefParts.slice(0, -1).concat([link]).join('/');
      window.history.pushState({}, '', url);
    }
  }

  function closePopup() {
    $sideText.empty();
    $letter.find('strong').removeClass('active');

    $('body').css('overflow', '');
    $sideTextContainer.css('overflow', '');

    changeLink('');
  }

  function openPopup(options) {
    var $this = options.el;
    var link = options.link;

    if (!$this && !link) {
      return;
    }

    var text = null;
    var popup = null;

    if ($this) {
      text = $this.text().replace(/\s\s+/g, ' ').trim();
      popup = popups.filter(p => p.text === text)[0];
    } else if (!$this && link) {
      for (prop in popups) {
        if (popups.hasOwnProperty(prop)) {
          if (popups[prop].link === link) {
            popup = popups[prop];
            text = popup.text;
            $letter.find('strong').filter(function(index) {
              var $el = $(this);
              if ($el.text().replace(/\s\s+/g, ' ').trim() === text) {
                $this = $el;
              }
            });
            break;
          }
        }
      }
    }

    if (!popup || !$this) {
      return;
    }

    $this.addClass('active');

    $sideText.append($('<h6>').html(popup.title));
    $sideText.append($('<p>').html(popup.content));

    var top = $this.offset().top - $letter.offset().top;
    var offset = 50; // $sideText.height() / 2;
    $sideText.css('margin-top', Math.max(0, top - offset));

    $sideTextContainer.fadeIn('fast');
    $closeButton.fadeIn('fast');

    if ($sideTextContainer.css('position') === 'fixed') {
      $('body').css('overflow', 'hidden');
      $sideTextContainer.css('overflow', 'scroll');
    }

    changeLink(popup.link || '');
  }

  $letter.on('click', 'strong', function onClick(event) {
    var $this = $(this);
    var wasActive = $this.hasClass('active');

    $sideTextContainer.fadeOut('fast', function fadeDone() {
      closePopup();

      if (popups == null || wasActive) {
        return;
      }

      openPopup({ el: $this });
    });
  });

  $('.close-button').on('click', function onClick() {
    $sideTextContainer.fadeOut('fast');
    $closeButton.fadeOut('fast', function fadeDone() {
      closePopup();
    });
  });

  $('#select-ministry').on('change', function onChange() {
    console.log('this', this);
  });
});
