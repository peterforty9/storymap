
$(function () {
 
    //Insert new group
    $(document).on("keypress", ".grouptext", function (event) {

        if (event.which == 13) {
            event.preventDefault();
            var group = $(this).parent().parent();
            var groupstartindex = $(this).parent().parent().index();
            var groupnumber = groupstartindex + 1;
            var activitylist = $('#activityrow .cell:nth-child(' + groupnumber + ')');

            if (hasactivities(groupnumber) == false && $(this).is(':empty')) {

                //Remove group
                group.remove();

                //remove activity container
                activitylist.remove();

                //Remove releaserow containers
                $(".releaserow").each(function (index) {

                    $(this).find(" .cell:nth-child(" + groupnumber + ")").remove();

                });

            } else {               

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
    
});