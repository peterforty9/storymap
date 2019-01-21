
$(function () {
    var textbox;
    var hiddenblockdetails;
   
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
        var htmlData = "<div class='grouprelease cell'><div class='group'><div class='grouptext contenteditable='true' id='" + grouptextid + "'></div><input type='hidden' id='" + grouptextid + "-details'></div></div>";
        var activitylisthtml = "<div class='grouprelease cell'><ul class='activities'></ul></div>"
        var groupreleasehtml = "<div class='grouprelease release cell'></div>"
        var group = $("#groups div.cell:nth-child(" + (groupnumber) + ")")

        //Insert releasegroups

        $(".releaserow").each(function (index) {
            $(groupreleasehtml).insertAfter($(this).find(" .cell:nth-child(" + groupnumber + ")"));
        });

        //Insert group
        $(htmlData).insertAfter(group);
        $(activitylisthtml).insertAfter(activitylist);

        document.getElementById(grouptextid).focus();
    }

    //Append new activity
    function appendNewActivity(groupnumber) {
        var activitytextid = Math.random();
        var htmlData = "<li><div class='activity'><div class='activitytext' contenteditable='true' id='" + activitytextid + "'></div><input type='hidden' id='" + activitytextid + "-details'></div></li>";
        var activitylist = $('#activityrow .cell:nth-child(' + groupnumber + ') .activities');

        //Insert activity 
        $(htmlData).appendTo(activitylist);
        document.getElementById(activitytextid).focus();

        //Insert new epic

        var from;

        from = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";

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
        var htmlData = "<li><div class='activity'><div class='activitytext' contenteditable='true' id='" + activitytextid + "'></div><input type='hidden' id='" + activitytextid + "-details'></div></li>";
        var activity = $("#activityrow").find(".cell:nth-child(" + groupnumber + ") .activities li").eq(activitynumber - 1);
        //Insert activity 
        $(htmlData).insertAfter($(activity));
        document.getElementById(activitytextid).focus();

        //Insert new epic

        var from;

        from = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";

        $(".releaserow").each(function (index) {
            $(from).insertAfter($(this).find($(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ")")));
        });

    };

    function appendNewStory(activitynumber, groupnumber) {

        var storytextid = Math.random()
        var htmlData = "<li><div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div><input type='hidden' id='" + storytextid + "-details'></div></li>";

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
        var groupnumber = groupstartindex + 1;

        var activityempty = $(activityline).find(" .activity .activitytext").is(':empty');
        var storycount = 0;

        //See if any stories exist in any of the releases
        $(".releaserow").each(function (index) {
            if ($(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activityindex + ") .stories").is(':empty')) {
                storycount = storycount + 0;
            }
            else {
                storycount = storycount + 1;
            }

        });
        if (activityempty && storycount === 0) { return true }
    }

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
        var htmlData = "<li><div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div><input type='hidden' id='" + storytextid + "-details'></div></li>";

        if (($(this).parent().find("li .story").length > 0)) {
            $(htmlData).insertAfter($(this).parent().find("li:last-child"));
        }
        else {
            ($(this).parent().children(".stories")).append(htmlData);
        };

        document.getElementById(storytextid).focus();
        //document.getElementById(storytextid).removeAttribute("id");
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
                var htmlData = "<li><div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "' data-details=''></div><input type='hidden' id='" + storytextid + "-details' value=''></div></li>";
                $(htmlData).insertAfter($(this).parent().parent());
                document.getElementById(storytextid).focus();
                //document.getElementById(storytextid).removeAttribute("id");
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
    $(document).on("click", "#blockname", function (event) {
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
 