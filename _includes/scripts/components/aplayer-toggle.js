(function() {
  var manager = window.AntJunAPlayer;
  var buttons = document.querySelectorAll('.js-aplayer-toggle');
  if (!manager || !buttons.length) {
    return;
  }

  function updateButton(button) {
    var enabled = manager.isEnabled();
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    button.textContent = enabled
      ? button.getAttribute('data-label-on')
      : button.getAttribute('data-label-off');
  }

  function updateButtons() {
    for (var i = 0; i < buttons.length; i++) {
      updateButton(buttons[i]);
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      manager.setEnabled(!manager.isEnabled());
      updateButtons();
      if (document.querySelector('[data-aplayer-page]')) {
        window.location.reload();
      }
    });
  }

  updateButtons();
})();
