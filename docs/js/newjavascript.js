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
            handle: ".iteration",
            cancel: ".epic, .newrelease, .iterationtext",
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

//Save map each time it is updated
    $(document).on("focusout", ".storytext, .activitytext, .releasename, .grouptext", function () {
        var html = $('#board').clone();
        var htmlString = html.html();
        var datauri = btoa(htmlString);
        //Save to local storage
        localStorage.storymap = datauri;
        getGroups();
        createColumnJSON();

        //Save downloadable file
        var downloadfile = "data: application/octet-stream;charset=utf-16le;base64," + datauri;
        $("#downloadmap").attr("href", downloadfile);
        console.log("storymap saved");
        hideaddstory();
    });
    //Create json objects 
    function getGroups() {
        groups = [];
        $(".group .textbox").each(function () {
            var id = $(this).attr("id");
            var title = $(this).text();
            var details = $(this).next();

            item = {}
            item["boxid"] = id;
            item["title"] = title;
            item["details"] = details;

            groups.push(item);
        });
        console.log("groups");
        console.log(groups);
    }
    

    function createColumnJSON() 
    {
        activityObj = []

        $(".activities").each(function () {
            jsonObj = [];
          ($(this).find(".textbox")).each(function () {
                var id = $(this).attr("id");
                var title = $(this).text();
                var details = $(this).next();

                item = {}
                item["boxid"] = id;
                item["title"] = title;
                item["details"] = details;

                jsonObj.push(item);

            });

            activityObj.push(jsonObj);
          
        });
        console.log("activities");
        console.log(activityObj);

        rowsObj = [];
        $(".releaserow").each(function () {
            rowObj = [];
            ($(this).find(".epic")).each(function () {
                epicObj = [];
                ($(this).find(".textbox")).each(function () {
                var id = $(this).attr("id");
                var title = $(this).text();
                var details = $(this).next();

                item = {}
                item["boxid"] = id;
                item["title"] = title;
                item["details"] = details;

                epicObj.push(item);
                });
                rowObj.push(epicObj);
            });
            rowsObj.push(rowObj);
            console.log("rows");
            console.log(rowsObj);
        });
    };

    
    //open new map from html template
    $(document).on("click", "#new", function () {
        $('#board').load('newmap.html #storymap');
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
            $('#board').html(htmlstring);
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
        $('#board').html(htmlstring);
        console.log("window ready");
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
