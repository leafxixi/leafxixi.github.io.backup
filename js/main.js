$(document).ready(function() {


  $('#main-button').click(function() {
     $('#left-panel').toggleClass('in');
  });
  $('#left-panel').perfectScrollbar();
  $('.category-list-container > a, .tag-list-container > a, .archive-list-container > a').click(function(e){
     $(this).next().slideToggle('fast');
  });
  // $('#right-panel').perfectScrollbar();
  // $('#rightbody').perfectScrollbar();
});
