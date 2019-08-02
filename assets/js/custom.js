document.addEventListener('DOMContentLoaded', function() {
  Turbolinks.setProgressBarDelay(100);
});

document.addEventListener('turbolinks:load', function() {
  initSearch();
});
