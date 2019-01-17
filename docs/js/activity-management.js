
$(function () {
    var storedactivity
    var activityHtml
    var editableactivity
    var newactivityText
    var newactivity

    //Insert new group
    $(document).on("keypress", ".grouptext", function (event) {

        if (event.which == 13) {
            event.preventDefault();
            var group = $(this).parent().parent();
            var groupstartindex = $(this).parent().parent().index();
            var groupnumber = groupstartindex + 1;
           
            var activitylist = $('#activityrow .cell:nth-child(' + groupnumber + ')');

            var grouptextid = Math.random();
            var htmlData = "<div class='grouprelease cell'><div class='group'><div class='grouptext contenteditable='true' id='" + grouptextid + "'></div></div></div>";
            var activitylisthtml = "<div class='grouprelease cell'><ul class='activities'></ul></div>"
            var groupreleasehtml = "<div class='grouprelease release cell'></div>"

            //Insert releasegroups

            $(".releaserow").each(function (index) {
                $(groupreleasehtml).insertAfter($(this).find(" .cell:nth-child(" + groupnumber + ")"));
            });


            //Insert group
            $(htmlData).insertAfter(group);
            $(activitylisthtml).insertAfter(activitylist);

            document.getElementById(grouptextid).focus();
        }
    });
   
    //Insert new activity (and move along stories)
    $(document).on("keypress", ".activitytext", function (event) {

        if (event.which == 13) {
            event.preventDefault();
            var activity = $(this).parent().parent();
            if (activityempty(activity)) {
                removeactivity(activity)
            }
            else {
                var activitystartindex = $(this).parent().parent().index();
                var groupstartindex = $(this).parent().parent().parent().parent().index();
                var activityindex = activitystartindex + 1;
                var groupnumber = groupstartindex + 1;
                insertNewActivity(activityindex, groupnumber, $(this))
            };
        }
    });

    function insertNewActivity(activityindex, groupnumber, thisObj) {
        var activitytextid = Math.random();
        var htmlData = "<li><div class='activity'><div class='activitytext' contenteditable='true' id='" + activitytextid + "'></div></div></li>";
            
            //Insert activity 
        $(htmlData).insertAfter(thisObj.parent().parent());
            document.getElementById(activitytextid).focus();

            //Insert new epic
       
            var from;
         
        from = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";
          
            $(".releaserow").each(function (index) {
                $(from).insertAfter($(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activityindex + ")"));
            });
         
        thisObj.parent()
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