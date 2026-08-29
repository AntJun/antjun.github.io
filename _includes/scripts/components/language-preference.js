(function(window, document) {
  var configElement = document.getElementById('site-language-config');
  var config;
  if (!configElement) {
    return;
  }

  try {
    config = JSON.parse(configElement.textContent);
  } catch (error) { // eslint-disable-line no-unused-vars
    return;
  }
  if (!config || typeof config !== 'object') {
    return;
  }

  var languages = Array.isArray(config.languages) ? config.languages : [];
  var baseUrl = configElement.getAttribute('data-baseurl') || '';

  function findLanguage(code) {
    for (var i = 0; i < languages.length; i++) {
      if (languages[i]
          && typeof languages[i].language === 'string'
          && languages[i].language === code) {
        return languages[i];
      }
    }
    return null;
  }

  function getLanguageUrl(language) {
    if (!language || typeof language.url !== 'string'
        || language.url.charAt(0) !== '/'
        || language.url.charAt(1) === '/'
        || language.url.indexOf('\\') !== -1) {
      return null;
    }
    var url = language.url;
    if (baseUrl && url.charAt(0) === '/' && url.indexOf(baseUrl + '/') !== 0) {
      return baseUrl + url;
    }
    return url;
  }

  function getStoredLanguage() {
    try {
      var language = window.sessionStorage.getItem(config.storage_key);
      return findLanguage(language) ? language : null;
    } catch (error) { // eslint-disable-line no-unused-vars
      return null;
    }
  }

  function setStoredLanguage(language) {
    if (!findLanguage(language)) {
      return;
    }
    try {
      window.sessionStorage.setItem(config.storage_key, language);
    } catch (error) { // eslint-disable-line no-unused-vars
      // Fall back to browser language when session storage is unavailable.
    }
  }

  function localeMatches(locale, prefix) {
    if (typeof locale !== 'string' || typeof prefix !== 'string') {
      return false;
    }
    locale = locale.toLowerCase().replace('_', '-');
    prefix = prefix.toLowerCase().replace('_', '-');
    return locale === prefix || locale.indexOf(prefix + '-') === 0;
  }

  function getBrowserLanguage() {
    var browserLanguages = window.navigator.languages;
    if (!Array.isArray(browserLanguages) || !browserLanguages.length) {
      browserLanguages = [window.navigator.language || ''];
    }

    for (var i = 0; i < browserLanguages.length; i++) {
      for (var j = 0; j < languages.length; j++) {
        if (!languages[j] || typeof languages[j].language !== 'string') {
          continue;
        }
        var prefixes = Array.isArray(languages[j].browser)
          ? languages[j].browser
          : [languages[j].language];
        for (var k = 0; k < prefixes.length; k++) {
          if (localeMatches(browserLanguages[i], prefixes[k])) {
            return languages[j].language;
          }
        }
      }
    }
    var defaultLanguage = findLanguage(config.default);
    if (defaultLanguage) {
      return defaultLanguage.language;
    }
    for (var fallbackIndex = 0; fallbackIndex < languages.length; fallbackIndex++) {
      if (languages[fallbackIndex]
          && typeof languages[fallbackIndex].language === 'string') {
        return languages[fallbackIndex].language;
      }
    }
    return null;
  }

  function isEntryHome() {
    var entryLanguage = findLanguage(config.entry);
    if (!entryLanguage) {
      return false;
    }
    var entryPath = getLanguageUrl(entryLanguage);
    return entryPath !== null && (window.location.pathname === entryPath
      || window.location.pathname === entryPath + 'index.html');
  }

  function redirectFromEntryHome() {
    if (!languages.length || !isEntryHome()) {
      return;
    }

    var language = findLanguage(getStoredLanguage() || getBrowserLanguage());
    var entryLanguage = findLanguage(config.entry);
    if (language && language.language !== entryLanguage.language) {
      var languageUrl = getLanguageUrl(language);
      if (languageUrl === null) {
        return;
      }
      window.location.replace(
        languageUrl + window.location.search + window.location.hash
      );
    }
  }

  function bindLanguageLinks() {
    var links = document.querySelectorAll('[data-site-language]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        setStoredLanguage(this.getAttribute('data-site-language'));
      });
    }
  }

  redirectFromEntryHome();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindLanguageLinks);
  } else {
    bindLanguageLinks();
  }
})(window, document);
