'use strict';

(function () {
  $('.link-controls .btn-delete').on('click', function() {
    var element = $(this);
    var link_id = element.parent().attr('data-link-id');
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', '/links/remove/' + link_id, function(res) {
      element.closest('.link-container').remove();
      $grid.masonry('layout');
    }));
  });
  
  // init Masonry
  var $grid = $('.grid').masonry({
    itemSelector: '.link-container',
    // use element for option
    columnWidth: '.link-container',
    percentPosition: true
  });
  // layout Masonry after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
  });
  
  $('.grid img').on('error', function() {
    $(this).attr('src','https://cdn.glitch.com/5992e15f-3fc7-4965-a584-1a1bdb209c6d%2Funknown_rabbit.jpg?1524712829613');
    $grid.masonry('layout');
  });
  
})();