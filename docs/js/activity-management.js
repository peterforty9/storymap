
$(function () {
    var storedactivity
    var activityHtml
    var editableactivity
    var newactivityText
    var newactivity

    //Insert new activity (and move along stories)
    $(document).on("keypress", ".activitytext", function (event) {

        if (event.which == 13) {
            event.preventDefault();
            var activity = $(this).parent().parent();
            var activitystartindex = $(this).parent().parent().index();
            var groupstartindex = $(this).parent().parent().parent().parent().index();
            var activitynumber = activitystartindex + 1;
            var groupnumber = groupstartindex + 1;

            if (event.shiftKey) {
                appendNewStory(activitynumber, groupnumber);

                event.stopPropagation();
            } else {

                if (activityempty(activity)) {
                    removeactivity(activity)
                }
                else {
                   
                    insertNewActivity(activitynumber, groupnumber, $(this))
                };
            };
        }
    });

    function insertNewActivity(activitynumber, groupnumber, thisObj) {
        var activitytextid = Math.random();
        var htmlData = "<li><div class='activity'><div class='activitytext' contenteditable='true' id='" + activitytextid + "'></div></div></li>";
            
            //Insert activity 
        $(htmlData).insertAfter(thisObj.parent().parent());
            document.getElementById(activitytextid).focus();

            //Insert new epic
       
            var from;
         
        from = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";
          
            $(".releaserow").each(function (index) {
                $(from).insertAfter($(this).find($(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ")")));
            });
         
       // thisObj.parent()
        };

    function appendNewStory(activitynumber, groupnumber) {
       
        var storytextid = Math.random()
        var htmlData = "<li><div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div></li>";

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
    function activityempty(thisObj) {
        var activitystartindex = thisObj.index();
        var groupstartindex = thisObj.parent().parent().index();
        var activityindex = activitystartindex + 1;
        var groupnumber = groupstartindex + 1;
       
        var activityempty = thisObj.children().children().is(':empty');
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
    function removeactivity(thisObj)
    {
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

});