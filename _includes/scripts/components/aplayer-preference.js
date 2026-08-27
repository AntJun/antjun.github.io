(function(window, document) {
  var STORAGE_KEY = 'antjun.aplayer.enabled';
  var memoryEnabled = false;

  function isEnabled() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (error) { // eslint-disable-line no-unused-vars
      return memoryEnabled;
    }
  }

  function setEnabled(enabled) {
    memoryEnabled = enabled;
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch (error) { // eslint-disable-line no-unused-vars
      // Keep the in-memory preference when storage is unavailable.
    }
  }

  function loadScript(src, role, callback) {
    var selector = 'script[data-antjun-aplayer="' + role + '"]';
    var existing = document.querySelector(selector);
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        if (callback) {
          callback();
        }
      } else if (callback) {
        existing.addEventListener('load', callback, { once: true });
      }
      return;
    }

    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.setAttribute('data-antjun-aplayer', role);
    script.addEventListener('load', function() {
      script.setAttribute('data-loaded', 'true');
      if (callback) {
        callback();
      }
    }, { once: true });
    document.head.appendChild(script);
  }

  function loadCore(src, callback) {
    if (window.APlayer) {
      callback();
      return;
    }
    loadScript(src, 'core', callback);
  }

  window.AntJunAPlayer = {
    isEnabled: isEnabled,
    setEnabled: setEnabled,
    loadCore: loadCore,
    loadScript: loadScript
  };
})(window, document);
