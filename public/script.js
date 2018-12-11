$(function onReady() {
  var popups = null;
  $.getJSON('popups.json', function onSuccess(data) {
    popups = data;
  });

  var $sideText = $('.side-text');
  var $sideTextContainer = $('.side-text-container');
  var $closeButton = $('.close-button');
  var $letter = $('.letter-container');

  $letter.on('click', '.aside', function onClick(event) {
    var $this = $(this);
    var wasActive = $this.hasClass('active');

    $sideTextContainer.fadeOut('fast', function fadeDone() {
      $sideText.empty();
      $letter.find('.aside').removeClass('active');

      $('body').css('overflow', '');
      $sideTextContainer.css('overflow', '');

      if (popups == null || wasActive) {
        return;
      }

      var text = $this.text().trim();
      var popup = popups[text];

      if (popup == null) {
        return;
      }

      $this.addClass('active');

      $sideText.append($('<h6>').html(popup.title));
      $sideText.append($('<p>').html(popup.content));

      var top = $this.offset().top - $letter.offset().top;
      var offset = 100; // $sideText.height() / 2;
      $sideText.css('margin-top', Math.max(0, top - offset));

      $sideTextContainer.fadeIn('fast');
      $closeButton.fadeIn('fast');

      if ($sideTextContainer.css('position') === 'fixed') {
        $('body').css('overflow', 'hidden');
        $sideTextContainer.css('overflow', 'scroll');
      }
    });
  });

  $('.close-button').on('click', function onClick() {
    $sideTextContainer.fadeOut('fast');
    $closeButton.fadeOut('fast', function fadeDone() {
      $sideText.empty();
      $letter.find('.aside').removeClass('active');

      $('body').css('overflow', '');
      $sideTextContainer.css('overflow', '');
    });
  });
});
