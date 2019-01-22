var pre, stopindex, to;
var newepic = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";
var activitystartindex;
var activitystartgroup;
var startgroup;

$(function () {

   // $("#showgroups").click(function () { $("#groups").toggle() });

    function makeSortable() {
        makeGroupsSortable();
        makeActivitiesSortable();
        makeEpicsSortable();
        makereleasessortable();
        makeeditable();
    };

    function makeGroupsSortable() {
        $("#groups").sortable({
            connectWith: "#groups",
            cursor: "move",
            cancel: ".grouptext",
            items: ".grouprelease",

            start: function (event, ui) {

                clone = $(ui.item[0].outerHTML).clone();
                startgroup = (ui.item.index()) + 1;

            },

            placeholder: {
                element: function (clone, ui) {
                    return $('<div class="selected">' + clone[0].innerHTML + '</div>');
                },
                update: function () {
                    return;
                }
            },
            stop: function (event, ui) {

                stopindex = ui.item.index();

                var targetgroup = (ui.item.index()) + 1;
               
                if (targetgroup < startgroup) {

                    $("#activityrow").each(function (index) {
                        ($(this).find(" .cell:nth-child(" + startgroup + ")")).insertBefore($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                    });

                    $(".releaserow").each(function (index) {
                        ($(this).find(" .cell:nth-child(" + startgroup + ")")).insertBefore($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                    });


                } else if (targetgroup >= startgroup) {

                    $("#activityrow").each(function (index) {
                        ($(this).find(" .cell:nth-child(" + startgroup + ")")).insertAfter($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                    });

                    $(".releaserow").each(function (index) {
                        ($(this).find(" .cell:nth-child(" + startgroup + ")")).insertAfter($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                    });

                    }
                
            }
        });
    }
    function makereleasessortable() {
        $("#releases").sortable({
            connectWith: "#releases",
            cursor: "move",
            handle: ".rowhandle",
            cancel: ".epic, .releasename, .newrelease",
        });
    }
    function makeActivitiesSortable() {
        $(".activities").sortable({

            connectWith: ".stories, .activities",
            cursor: "move",
            cancel: ".activitytext",

            start: function (event, ui) {
                clone = $(ui.item[0].outerHTML).clone();
                activitystartindex = ui.item.index();
                activitystartgroup = (ui.item.parent().parent().index()) + 1;
               
            },
            placeholder: {
                element: function (clone, ui) {
                    return $('<li class="selected">' + clone[0].innerHTML + '</li>');
                },
                update: function () {
                    return;
                }
            },
            stop: function (event, ui) {
                var activitytargetindex = ui.item.index();
                var targetepic = activitytargetindex + 1;
                var fromepic = activitystartindex + 1;
                var activitytargetgroup = (ui.item.parent().parent().index()) + 1;
                var stayedinactivities = ui.item.parent().hasClass("activities");
                var childtext = ui.item.children().children();
                var actcount = ($("#activityrow .cell:nth-child(" + activitytargetgroup + ") .activity").length);
                var lastactivity = false

                if (targetepic == actcount){ lastactivity = true };
               
                //move epics in line with activity movement
                //Activity moved witin same group / Higher up
                if (stayedinactivities == true && activitytargetgroup === activitystartgroup && activitytargetindex > activitystartindex) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertAfter($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + targetepic + ")"));
                    });
                    //Activity moved witin same group / Lower down
                } else if (stayedinactivities == true && ((activitytargetgroup === activitystartgroup && activitytargetindex <= activitystartindex))) {

                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertBefore($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + targetepic + ")"));
                    });
                    //Activity to different group / NOT To last column
                } else if (stayedinactivities == true && (activitytargetgroup != activitystartgroup) && lastactivity == false) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertBefore($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + targetepic  + ")"));
                    });
                     //Activity to different group / last column
                } else if (stayedinactivities == true && (activitytargetgroup != activitystartgroup) && lastactivity && actcount > 1) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertAfter($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + activitytargetindex + ")"));
                    });
                    //Activity to different group / No activities exist
                } else if (stayedinactivities == true && (activitytargetgroup != activitystartgroup) && actcount == 1) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").appendTo($(this).find(" .cell:nth-child(" + activitytargetgroup + ")"));
                    });
                }else if (stayedinactivities != true) {
                    var storycount = 0;
                                    
                    $(".releaserow").each(function (index) {
                    
                        if ($(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ") .stories").is(':empty')) {
                            storycount = storycount + 0;
                            }
                        else {
                            storycount = storycount + 1;
                            }
                    });
                    //Only allow to convert an activity to a story if it nas no stories
                    if (storycount === 0) {
                        
                        $(".releaserow").each(function (index) {
                            $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").remove();
                        });
                        //Change class from activity to story
                        ui.item.children().addClass('story').removeClass('activity');
                        childtext.addClass('storytext').removeClass('activitytext');

                    } else {$(".activities").sortable("cancel");}
                };
            },
            
        });
    }
  
    function makeEpicsSortable() {
    $(".stories").sortable({
        cursor: "move",
        cancel: ".storytext",
        connectWith: ".stories, .activities",
        
    start: function(event, ui) {
     
        clone = $(ui.item[0].outerHTML).clone();
    
        },

        placeholder: {
            element: function (clone, ui) {
                return $('<li class="selected">' + clone[0].innerHTML + '</li>');
            },
            update: function () {
                return;
            }
        },
    stop: function(event, ui) {

        stopindex = ui.item.index();

        var targetgroup = (ui.item.parent().parent().index()) + 1;
        var targetepic = stopindex + 1;

        var movedtoactivities = ui.item.parent().hasClass("activities");

        if (movedtoactivities == true) {

            var childtext = ui.item.children().children();
            var actcount = $("#activityrow .cell:nth-child(" + targetgroup + ") .activities li").length;

            if (actcount > 1 && targetepic < actcount) {
                ui.item.children().addClass('activity').removeClass('story');
                childtext.addClass('activitytext').removeClass('storytext');

                $(".releaserow").each(function (index) {
                    $(newepic).insertBefore($(this).find(" .cell:nth-child(" + targetgroup + ") .epic:nth-child(" + targetepic + ")"));
                });


            } else if (actcount > 1 && targetepic === actcount) {
                ui.item.children().addClass('activity').removeClass('story');
                childtext.addClass('activitytext').removeClass('storytext');
                $(".releaserow").each(function (index) {
                    $(newepic).insertAfter($(this).find(" .cell:nth-child(" + targetgroup + ") .epic:last-child"));
                });

            } else if (actcount == 1) {
                ui.item.children().addClass('activity').removeClass('story');
                childtext.addClass('activitytext').removeClass('storytext');
                $(".releaserow").each(function (index) {
                    $(newepic).appendTo($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                });
            }
        }
    }
  });
}
    function makeeditable() {
        $(".storytext").attr('contenteditable', 'true');
        $(".activitytext").attr('contenteditable', 'true');
        $(".grouptext").attr('contenteditable', 'true');

    };


//Listen out for newly created epics and make sortable
$("body").on("DOMNodeInserted", "#storymap", makeSortable);

//Add new release   
$(document).on("click", ".addrelease", function() {
  addNewRelease(this);
});

function addNewRelease(clicked){
    
    var i = 0;
    var k = 0;
    var m;
   
    var groupcount = (($("#groups div.cell").length)-2);
    var newrelease = "<div class='releaserow row'><div class='rowhandle cell'></div><div class='releasename cell' contenteditable='true'>Release/Version</div>";
    var newgroupstart = "<div class='grouprelease cell'>";
    var newgroupend = "</div>";

    do {
        m = 3 + k;
        newrelease = newrelease + newgroupstart;
        var activitycount = ($("#activityrow .cell:nth-child(" + m + ") .activity").length);
        
        do {
            newrelease = newrelease + newepic;
            i++;
        }
        while (i < activitycount);

        i = 0;
        newrelease = newrelease + newgroupend;
        k++;
    }
    while (k < groupcount);
    newrelease = newrelease + newgroupend + "</div>";
  
    $(newrelease).insertAfter($("div .releaserow:last-of-type"));
    
 }
   
//Save map each time it is updated
    $(document).on("focusout", ".storytext, .activitytext, .releasename, .grouptext", function () {
        var html = $('#storymap').clone();
        var htmlString = html.html();
        var datauri = btoa(htmlString);
        //$("#mapdata").val(datauri);
        localStorage.storymap = datauri;
        var downloadfile = "data: application/octet-stream;charset=utf-16le;base64," + datauri;
        $("#downloadmap").attr("href", downloadfile);
        console.log("storymap saved");
        hideaddstory();
    });
  
    
    //open new map from html template
    $(document).on("click", "#new", function () {
        $('#storymap').load('newmap.html #storymap');
        console.log("new map loaded");
             });

    //toggle details
    //$(document).on("click", "#toggledetails", function () {
     //   $("#blockdetails").toggleClass("hidden");
    //});

    //upload file
    openFile = function (event) {
       
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function () {
            var text = reader.result;
            var htmlstring = text//atob(text);
            $('#storymap').html(htmlstring);
            //$("#mapdata").val(htmlstring);
            // Store
            localStorage.storymap = text;

        };
        reader.readAsText(input.files[0]);
    };

    $(document).getElementById(files).addEventListener('change', handleFileSelect, false);

    //Load HTML from local storage
    $(window).on('ready', function () {

        var mapdata = localStorage.getItem('storymap');
        var htmlstring = atob(mapdata);
        $('#storymap').html(htmlstring);
        console.log("window ready");
    });

    //load from text box
    $(document).on("click", "load", function () {
       
        var mapdata = localStorage.getItem('storymap');
        var htmlstring = atob(mapdata);
        document.getElementById("storymap").innerHTML = htmlstring;
        console.log("load clicked");
       // $('#storymap').html(htmlstring);

    });
    //function saveSettings() {
    //    localStorage.storymap = $('#storymap').val();
    //}

    function hideaddstory() {

        //hide the add story button when stories exist
        $(".stories").each(function (index) {
            if ($(this).is(':empty')) {
                $(this).parent().children('.addStory').show();

            } else {

                $(this).parent().children('.addStory').hide();
            }

        });

    }
});
