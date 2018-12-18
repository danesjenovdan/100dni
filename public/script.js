$(function onReady() {
  var popups = null;
  $.getJSON('popups.json', function onSuccess(data) {
    popups = data;
    if (autoOpenPopup) {
      openPopup({ hash: autoOpenPopup });
      autoOpenPopup = '';
    }
  });

  var $sideText = $('.side-text');
  var $sideTextContainer = $('.side-text-container');
  var $closeButton = $('.close-button');
  var $letter = $('.letter-container');

  var autoOpenPopup = window.location.hash.slice(1).toLowerCase();

  function changeHash(newHash) {
    var scr = $(window).scrollTop();
    window.location.hash = newHash;
    $('html,body').scrollTop(scr);
  }

  function closePopup() {
    $sideText.empty();
    $letter.find('.aside').removeClass('active');

    $('body').css('overflow', '');
    $sideTextContainer.css('overflow', '');

    changeHash('');
  }

  function openPopup(options) {
    var $this = options.el;
    var hash = options.hash;

    if (!$this && !hash) {
      return;
    }

    var text = null;
    var popup = null;

    if ($this) {
      text = $this.text().trim();
      popup = popups[text];
    } else if (!$this && hash) {
      for (prop in popups) {
        if (popups.hasOwnProperty(prop)) {
          if (popups[prop].hash === hash) {
            popup = popups[prop];
            text = prop;
            $letter.find('.aside').filter(function(index) {
              var $el = $(this);
              if ($el.text().trim() === text) {
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

    changeHash(popup.hash || '');
  }

  $letter.on('click', '.aside', function onClick(event) {
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
});
