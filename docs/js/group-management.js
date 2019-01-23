
$(function () {
    var textbox;
    var hiddenblockdetails;

    //Generate object html
    function boxhtml(boxtype, textboxid) {
        var htmlData = "";
        if (textboxid == null) { textboxid = Math.random() };
        if (boxtype == "group" || boxtype == "activity" || boxtype == "story" || boxtype == "iteration") {
            htmlData = "<div class='" + boxtype + "'><div class='" + boxtype + "text' contenteditable='true' id='" + textboxid + "'></div><input type='hidden' id='" + textboxid + "-details'></div>";
            if (boxtype == "group") {
                htmlData = "<div class='grouprelease cell'>" + htmlData + "</div>";
            } else if (boxtype == "activity" || boxtype == "story") {
                htmlData = "<li>" + htmlData + "</li>";
                console.log(boxtype + " created (li)");
            } else { };
        } else if (boxtype == "epic") {
            htmlData = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";
        } else { };
        console.log(boxtype + " created");
        return htmlData;
    }
    
    //GROUP MANAGEMENT

    //Toggle groups
    $(document).on("click", "#menuGroups", function () {
        toggleGroups();
    });

    function toggleGroups() {
        $("#groups").toggle();

    }

    //Insert new group from group
    $(document).on("keydown", ".grouptext", function (event) {
        console.log("Group return key");
        var group = $(this).parent().parent();
        var groupstartindex = $(this).parent().parent().index();
        var groupnumber = groupstartindex + 1;
        var activitylist = $('#activityrow .cell:nth-child(' + groupnumber + ')');

        if (event.shiftKey && event.ctrlKey && event.which == 13) {
            hiddenblockdetails = $("#blockdetails").hasClass("hidden");
            $("#blockdetails").removeClass("hidden");
            $('#blockdetails').focus();
            event.stopPropagation();

        } else if (event.which == 13 && event.ctrlKey) {
            event.preventDefault();
            appendNewActivity(groupnumber);
            event.stopPropagation();
        }
        else if (event.which == 13) {
            event.preventDefault();

            if (hasactivities(groupnumber) == false && $(this).is(':empty')) {

                //Remove group
                group.remove();

                //remove activity container
                activitylist.remove();

                //Remove releaserow containers
                $(".releaserow").each(function (index) {

                    $(this).find(" .cell:nth-child(" + groupnumber + ")").remove();

                });

            } else { insertGroup(groupnumber) };
        }
    });

    //See if any activities exist in the group
    function hasactivities(groupnumber) {
        if ($("#activityrow").find(" .cell:nth-child(" + groupnumber + ") .activities").is(':empty')) {
            return false;
        }
        else {
            return true;
        }

    };

    //Insert new group
    function insertGroup(groupnumber) {
        var grouptextid = Math.random();
        var activitylist = $('#activityrow .cell:nth-child(' + groupnumber + ')');
        var newgrouphtml = boxhtml("group", grouptextid);
        var activitylisthtml = "<div class='grouprelease cell'><ul class='activities'></ul></div>"
        var groupreleasehtml = "<div class='grouprelease release cell'></div>"
        var group = $("#groups div.cell:nth-child(" + (groupnumber) + ")")

        //Insert releasegroups

        $(".releaserow").each(function (index) {
            $(groupreleasehtml).insertAfter($(this).find(" .cell:nth-child(" + groupnumber + ")"));
        });

        //Insert group
        $(newgrouphtml).insertAfter(group);
        $(activitylisthtml).insertAfter(activitylist);

        document.getElementById(grouptextid).focus();
    }

    //Append new activity
    function appendNewActivity(groupnumber) {
        var activitytextid = Math.random();
        var activityhtml = boxhtml("activity", activitytextid);
        var activitylist = $('#activityrow .cell:nth-child(' + groupnumber + ') .activities');

        //Insert activity 
        $(activityhtml).appendTo(activitylist);
        document.getElementById(activitytextid).focus();

        //Append new epic

        var from = boxhtml("epic");

        $(".releaserow").each(function (index) {
            $(from).appendTo($(this).find(" .cell:nth-child(" + groupnumber + ")"));
        });
    };

    // ACTIVITY MANAGEMENT

    var storedactivity
    var activityHtml
    var editableactivity
    var newactivityText
    var newactivity

    //Activity text return functions
    $(document).on("keydown", ".activitytext", function (event) {
        console.log("Activity return key");
        var activity = $(this).parent().parent();
        var activitystartindex = $(this).parent().parent().index();
        var groupstartindex = $(this).parent().parent().parent().parent().index();
        var activitynumber = activitystartindex + 1;
        var groupnumber = groupstartindex + 1;
        if (event.shiftKey && event.ctrlKey && event.which == 13) {
            hiddenblockdetails = $("#blockdetails").hasClass("hidden");
            $("#blockdetails").removeClass("hidden");
            $('#blockdetails').focus();
            event.stopPropagation();

        } else if (event.ctrlKey && event.which == 13) { //Append new story
            event.preventDefault();
            appendNewStory(activitynumber, groupnumber);
            event.stopPropagation();
        } else if (event.shiftKey && event.which == 13 && $("#groups").is(":visible")) { //Insert new group (if groups visible)
            event.preventDefault();
            insertGroup(groupnumber);
            event.stopPropagation();
        } else if (event.which == 13 && (event.shiftKey && event.ctrlKey) == false) { //Insert new activity
            event.preventDefault();
            if (activityempty(activity)) {
                removeactivity(activity)
            }
            else {
                insertNewActivity(activitynumber, groupnumber)
            };
        };
    });

    function insertNewActivity(activitynumber, groupnumber) {
        var activitytextid = Math.random();
        var htmlData = boxhtml("activity", activitytextid)
        var activity = $("#activityrow").find(".cell:nth-child(" + groupnumber + ") .activities li").eq(activitynumber - 1);
        //Insert activity 
        $(htmlData).insertAfter($(activity));
        document.getElementById(activitytextid).focus();

        //Insert new epic

        var from;

        from = boxhtml("epic");

        $(".releaserow").each(function (index) {
            $(from).insertAfter($(this).find($(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ")")));
        });

    };

    function appendNewStory(activitynumber, groupnumber) {

        var storytextid = Math.random()
        var htmlData = boxhtml("story", storytextid);
        $(".releaserow").each(function (index) {
            $(htmlData).appendTo($(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ") .stories"));
        });
        document.getElementById(storytextid).focus();
    };

    //Delete empty activity when focus lost
    $(document).on("focusout", ".activitytext", function () {
        var activity = $(this).parent().parent();
        if (activityempty(activity)) {
            removeactivity(activity)
        }

    });

    //Check activity li has no text or underlying stories
    function activityempty(activityline) {
        var activitystartindex = activityline.index();
        var groupstartindex = activityline.parent().parent().index();
        var activityindex = activitystartindex + 1;
        var groupnumber = groupstartindex;

        var activityempty = $(activityline).find(" .activity .activitytext").is(':empty');
        var storycount = 0;

        //See if any stories exist in any of the releases
        $(".releaserow").each(function (index) {
            
            if (epicEmpty(index, groupnumber, activityindex)) {
                storycount = storycount + 0;
            }
            else {
                storycount = storycount + 1;
            }

        });
        if (activityempty && storycount === 0) { return true }
    }

    //Check Epic has no stories
    function epicEmpty(rowindex, groupnumber, activitynumber) {
        groupnumber = groupnumber + 1
        console.log("Rowindex:" + rowindex + " groupcell:" + groupnumber + " activitynumber:" + activitynumber);
        var empty = ($($(".releaserow").eq(rowindex)).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ") .stories").is(':empty')) 
        console.log(empty);
        return empty;
    };

    //Remove activity li and underlying epics
    function removeactivity(thisObj) {
        var activitystartindex = thisObj.index();
        var groupstartindex = thisObj.parent().parent().index();
        var activitynumber = activitystartindex + 1;
        var groupnumber = groupstartindex + 1;

        //Remove activity
        thisObj.remove();

        //Remove epics
        $(".releaserow").each(function (index) {

            $(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ")").remove();

        });
    };

    //STORY MANAGEMENT

    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText

    //Create new story when addStory clicked
    $(document).on("click", ".addStory", function () {
        var storytextid = Math.random()
        var htmlData = boxhtml("story", storytextid);
        if (($(this).parent().find("li .story").length > 0)) {
            $(htmlData).insertAfter($(this).parent().find("li:last-child"));
        }
        else {
            ($(this).parent().children(".stories")).append(htmlData);
        };

        document.getElementById(storytextid).focus();
    });

    //Create new story when enter key pressed
    $(document).on("keydown", ".storytext", function (event) {

        //var activity = $(this).parent().parent();
        var activityindex = $(this).parent().parent().parent().parent().index();
        var groupindex = $(this).parent().parent().parent().parent().parent().index();
        var activitynumber = activityindex + 1;
        var groupnumber = groupindex + 1;

        if (event.shiftKey && event.ctrlKey && event.which == 13) { //edit details
            hiddenblockdetails = $("#blockdetails").hasClass("hidden");
            $("#blockdetails").removeClass("hidden");
            $('#blockdetails').focus();
            event.stopPropagation();

        } else if (event.shiftKey && event.which == 13) { //Insert new activity
            event.preventDefault();
            insertNewActivity(activitynumber, groupnumber);
            event.stopPropagation();
        } else if (event.which == 13) { //Insert story
            event.preventDefault();
            if ($(this).is(':empty')) { deletestory($(this)) }
            else {
                var storytextid = Math.random()
                var htmlData = boxhtml("story", storytextid);
                $(htmlData).insertAfter($(this).parent().parent());
                document.getElementById(storytextid).focus();
               
            };
            event.stopPropagation();
        };

    });

    //Remove empty story
    $(document).on("focusout", ".storytext", function () {
        if ($(this).is(':empty')) { deletestory($(this)) }

    });

    //Delete story
    function deletestory(thisObj) {

        thisObj.parent().parent().remove();

    }

    // RELEASE MANAGEMENT

    //Add new release   
    $(document).on("click", ".addrelease", function () {
        addNewRelease();
    });

    function addNewRelease(iterationtextid) {

        var i = 0;
        var k = 0;
        var m;

        var groupcount = (($("#groups div.cell").length) - 1);
        var iteration = boxhtml("iteration",iterationtextid)
        var newrelease = "<div class='releaserow row'><div class='releasename cell'>" + iteration + "</div>";
        var newgroupstart = "<div class='grouprelease cell'>";
        var newgroupend = "</div>";

        do {
            m = 2 + k;
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

    //Create new row when enter key pressed
    $(document).on("keydown", ".iterationtext", function (event) {
        var rowindex = $(this).parent().parent().parent().index();
        console.log("on keydown row index:" + rowindex);
        if (event.which == 13) { //Insert row
            event.preventDefault();
            if ($(this).is(':empty') && emptyIteration(rowindex)) {
                $($(".releaserow").eq(rowindex)).remove();
                console.log("row deleted");
        }
            else {
                var iterationtextid = Math.random()
                addNewRelease(iterationtextid)
                document.getElementById(iterationtextid).focus();

            };
            event.stopPropagation();
        };
    });

    function emptyIteration(rowindex) {
        var storycount = 0
        var activitynumber = 1;
        var groupnumber = 1;
        var m;

        var groupcount = (($("#groups div.cell").length)-1);
        
        do {
            m = 1 + groupnumber;
            
            var activitycount = ($("#activityrow .cell:nth-child(" + m + ") .activity").length);

            do {
                if (epicEmpty(rowindex, groupnumber, activitynumber)) {
                    console.log("No story at - Rowindex:" + rowindex + " groupnumber:" + groupnumber + " activitynumber:" + activitynumber);
                    storycount = storycount + 0;
                } else
                {
                    console.log("Story found at - Rowindex:" + rowindex + " groupnumber:" + groupnumber + " activitynumber:" + activitynumber);
                    storycount = storycount + 1
                };
                console.log("Storycount:" + storycount);

                activitynumber++;
            }
            while (activitynumber <= activitycount);

            activitynumber = 1;
            groupnumber++;
        }
        while (groupnumber <= groupcount);
        if (storycount == 0) return true; 
       
    };

    //Display description in description panel
    $(document).on("focus", ".storytext, .activitytext, .grouptext", function (event) {
        var currentText = $(this).text();
        $("#blockname").text(currentText);

        var detailsText = $(this).next().val();
        textbox = $(this).attr("id");
        var bgcolor = $(this).css('background-color');
        $("#blockdetails").html(detailsText);
        $("#blockname").css('background-color', bgcolor); //make title colour the same as the block type
                
    });
    $(document).on("keyup", ".storytext, .activitytext, .grouptext", function (event) {
        var currentText = $(this).text();
        $("#blockname").text(currentText);
    });
    $(document).on("keyup", "#blockdetails", function (event) {
        var detailsText = $("#blockdetails").html();
        var hiddeninput = textbox + "-details"
        var element2 = document.getElementById(hiddeninput);
        $(element2).val(detailsText);

    });
    $(document).on("click", "#blockname, #toggledetails", function (event) {
        $("#blockdetails").toggleClass("hidden");
        hiddenblockdetails = $("#blockdetails").hasClass("hidden");
    });
    $(document).on("focusout", "#blockdetails", function (event) {
        $("#infobox").removeClass("edit");
        if (hiddenblockdetails) $("#blockdetails").addClass("hidden");
    });
    $(document).on("focus", "#blockdetails", function (event) {
        $("#infobox").addClass("edit");
    });

    $(document).on("keydown", "#blockdetails", function (event) {

        if (event.shiftKey && event.ctrlKey && event.which == 13) { //back to home block
            var element2 = document.getElementById(textbox);
            $(element2).focus();
            event.stopPropagation();
        }
    });
    /*
    $(document).on("focus", "#blockcomments", function (event) {
        var oldcomments = $("#blockcomments").html()  ;
        var date = new Date($.now());
        oldcomments = oldcomments + " " + date;
        $("#blockcomments").html(oldcomments);
    });
    */
 });
 