var pre, post, to;
var newepic = "<div class='epic cell'><div class='stories'></div><div class='addStory'><strong>+</strong></div></div>";
var activitystartindex;

$(function () {

    $("#showgroups").click(function () { $("#groups").toggle() });

    function makeSortable() {

        makeGroupsSortable();
        makeActivitiesSortable();
        makeEpicsSortable();
        makeeditable();

          $(document).on("focusout", ".group", function () {
            if ($(this).children().is(':empty')) {
                $(this).css('background-color', 'antiquewhite');
            }
            else {
                $(this).css('background-color', 'lightsalmon');}
         
        });
     
    };

    function makeGroupsSortable() {
        $("#groups").sortable({
            connectWith: "#groups",
            cursor: "move",
            cancel: ".grouptext",
        });
    }
    function makeActivitiesSortable() {
        $("#activities").sortable({
            connectWith: ".stories, #activities",
            cursor: "move",
            cancel: ".activitytext",
            start: function (event, ui) {
                 activitystartindex   = ui.item.index();
                var activitystart = ($("this").length);
               
            },
            stop: function (event, ui) {
                var activitytargetindex = ui.item.index();
                var post2 = ui.item.parent().attr("id");
                var childtext = ui.item.children();
                //move epics in line with activity movement
                if (post2 === "activities" && activitytargetindex > activitystartindex) {

                    $("div.release").each(function (index) {
                        $(this).find(".epic:eq(" + activitystartindex + ")").insertAfter($(this).find(".epic:eq(" + activitytargetindex + ")"));
                    });

                } else if (post2 === "activities") {

                    $("div.release").each(function (index) {
                        $(this).find(".epic:eq(" + activitystartindex + ")").insertBefore($(this).find(".epic:eq(" + activitytargetindex + ")"));
                    });
                } else if (post2 != "activities"){
                    var storycount = 0;
                    var groupempty = $(".group:eq(" + activitystartindex  + ")").children().is(':empty');

                    $("div.release").each(function (index) {
                        if ($(this).find(".epic:eq(" + activitystartindex  + ")").children().is(':empty')) {
                            storycount = storycount + 0;
                            $('span').text = storycount;
                            }
                        else {
                            storycount = storycount + 1;
                            $('span').text = storycount;
                            }
                    });

                    if (groupempty && storycount === 0) {
                        $(".group:eq(" + activitystartindex + ")").remove();
                        $("div.release").each(function (index) {
                        $(this).find(".epic:eq(" + activitystartindex + ")").remove();
                        });

                        ui.item.addClass('story').removeClass('activity cell');
                        childtext.addClass('storytext').removeClass('activitytext');
                    } else {$("#activities").sortable("cancel");}
                };
            },
            
        });
    }
function makeEpicsSortable() {
    $(".stories").sortable({
        cursor: "move",
        cancel: ".storytext",
        connectWith: ".stories, #activities",
        items: 'div[class!=addStory]',
    start: function(event, ui) {
      pre = ui.item.index();
    },
    stop: function(event, ui) {
      post = ui.item.index();
      var x = 0;
        var post2 = ui.item.parent().attr("id");
        var childtext = ui.item.children();
      var actcount = ($("#activities > div.activity").length);
      to = $(".epic").get(post);
      toend = $(".epic").get(post - 1);
      if (post2 === "activities" && post < actcount) {
          ui.item.addClass('activity cell').removeClass('story');
          childtext.addClass('activitytext').removeClass('storytext');
       
            $( "div.release" ).each(function( index ) {
            
                $(newepic).insertBefore($(this).find(".epic:eq(" + post + ")"));
                
            });
          var newgroup = $("<div class='group cell'><div class='grouptext' contenteditable='true'></div></div>");
          lastgroup = $("div .group:last-child");
          newgroup.insertAfter(lastgroup);

      } else if (post2 === "activities" && post === actcount) {
          ui.item.addClass('activity cell').removeClass('story');
          childtext.addClass('activitytext').removeClass('storytext');
     
          $(newepic).insertAfter($("div .epic:last-child"));
          var newgroup = $("<div class='group cell'><div class='grouptext' contenteditable='true'></div></div>");
          lastgroup = $("div .group:last-child");
          newgroup.insertAfter(lastgroup);
        
              
           // });
      }
      //$("span").text("Count:" + x + " ,To:" + post + ", Count:" + actcount);
    }
  });
}
    function makeeditable() {
        $(".storytext").attr('contenteditable', 'true');
        $(".activitytext").attr('contenteditable', 'true');
        $(".grouptext").attr('contenteditable', 'true');

    };


//Listen out for newly created epics and make sortable
        $("body").on("DOMNodeInserted", ".map", makeSortable);



   
$(document).on("click", ".newrelease", function() {
  addNewRelease(this);
});

    function addNewRelease(clicked){
    
 var i = 0;
 var activitycount = ($("#activities > div.activity").length);
  var newrelease = "<div class='map table'><div class='releasename' contenteditable='true'>Release/Version</div><div class='release row'>";
  var newepic = "<div class='epic cell'><div class='stories'></div><div class='addStory'><strong>+</strong></div></div>";
  do {
    newrelease = newrelease + newepic;
    i++;
    }
    while (i < activitycount);

newrelease = newrelease + "</div><div class='newrelease'>+</div></div>";
  var previousrelease =  $(clicked).parent()
  
  $(newrelease).insertAfter(previousrelease);
  
  
 }
   
//Save map each time it is updated
 
    //update after input
    $(document).on("focusout", ".storytext, .activitytext, .releasename, .grouptext", function () {
        var html = $('#storymap').clone();
        var htmlString = html.html();
        var datauri = btoa(htmlString);
        $("#mapdata").val(datauri);
        localStorage.storymap = datauri;
        var downloadfile = "data: application/octet-stream;charset=utf-16le;base64," + datauri;
        $("#downloadmap").attr("href", downloadfile);
        console.log("storymap saved");
    });
  
    //load from text box
    $(document).on("click", "#load", function () {
        var mapdata = $("#mapdata").val();
        //$("span").text(mapdata);
       var htmlstring = atob(mapdata);
        $('#storymap').html(htmlstring);

    })
    //open new map from html template
    $(document).on("click", "#new", function () {
        $('#storymap').load('newmap.html #storymap');
             });
        
    //upload file
    openFile = function (event) {
       
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function () {
            var text = reader.result;
            var htmlstring = text//atob(text);
            $('#storymap').html(htmlstring);
            $("#mapdata").val(htmlstring);
            // Store
            localStorage.storymap = text;

        };
        reader.readAsText(input.files[0]);
    };

    $(document).getElementById(files).addEventListener('change', handleFileSelect, false);

});
