
$(function () {
    var storedactivity
    var activityHtml
    var editableactivity
    var newactivityText
    var newactivity
    /*
    $(document).on("click", ".activity", function () {
        storedactivity = $(this);
        activityHtml = storedactivity.html();
        editableactivity = $("<textarea />");
        editableactivity.val(activityHtml);
        storedactivity.replaceWith(editableactivity);
        $(editableactivity).focus();
        // setup the blur event for this new textarea
        $(editableactivity).blur(editableactivityBlurred);
    });

    function editableactivityBlurred() {
        newactivity = $(this);
        newactivityText = newactivity.val();
        storedactivity.text(newactivityText);
        newactivity.replaceWith($(storedactivity));
        $("span").text(storedactivity.text);
    };
    */
    $(document).on("click", ".addActivity", function () {
        var htmlData = "<div class='activity cell'><div class='activitytext' contenteditable='true'></div></div>";
        $(this).before(htmlData);
        addNewActivity();
    });
    function addNewActivity() {
        var from;
        var newgroup;
        var lastgroup;

        from = $("<div class='epic cell'><div class='stories'></div><div class='addStory'><strong>+</strong></div></div>");
        toend = $("div .epic:last-child");
        from.insertAfter(toend);
        newgroup = $("<div class='group cell'><div class='grouptext' contenteditable='true'></div></div>");
        lastgroup = $("div .group:last-child");
        newgroup.insertAfter(lastgroup);
    };

    //Insert new activity (and move along stories)
    $(document).on("keypress", ".activitytext", function (event) {

        if (event.which == 13) {
            var activitytextid = Math.random()
            var activitystartindex = $(this).parent().index();
            var htmlData = "<div class='activity cell'><div class='activitytext' contenteditable='true' id='" + activitytextid + "'></div></div>";
            event.preventDefault();
            $(htmlData).insertAfter($(this).parent());
            document.getElementById(activitytextid).focus();

            var from;
            var newgroup;
            var lastgroup;
            var activityindex = activitystartindex;

            from = "<div class='epic cell'><div class='stories'></div><div class='addStory'><strong>+</strong></div></div>";
            //toend = $(".epic:eq(" + activityindex + ")");

            $("div.release").each(function (index) {
                $(from).insertAfter($(this).find(".epic:eq(" + activityindex + ")"));
              
            });

            newgroup = $("<div class='group cell'><div class='grouptext' contenteditable='true'></div></div>");
            lastgroup = $(".group:eq(" + activityindex + ")");
            newgroup.insertAfter(lastgroup);
        };
    });
  

    //Delete activity (If no stories present or group name)
    $(document).on("focusout", ".activitytext", function () {
        var activitydeleteindex = ($(this).parent().index());
        var activityempty = $(this).is(':empty');
        var storycount = 0;
        var groupempty = $(".group:eq(" + activitydeleteindex + ")").children().is(':empty');
       // alert(activitydeleteindex);
        $("div.release").each(function (index) {
            if ($(this).find(".epic:eq(" + activitydeleteindex + ")").children().is(':empty')) {
                storycount = storycount + 0;
                $('span').text = storycount;
            }
            else {
                storycount = storycount + 1;
                $('span').text = storycount;
            }
        });
        if (activityempty && groupempty && storycount === 0)
            {
            $(this).parent().remove();
            $(".group:eq(" + activitydeleteindex + ")").remove();
            $("div.release").each(function (index) {
                $(this).find(".epic:eq(" + activitydeleteindex +")").remove();
            });
        };
    });

    //Mark activity for deletion/move activity (If no stories present or group name)
   /*
        var activitydeleteindex = ($(this).parent().index());
        var activityempty = $(this).is(':empty');
        var storycount = 0;
        var groupempty = $(".group:eq(" + activitydeleteindex + ")").children().is(':empty');
        
        $("div.release").each(function (index) {
            if ($(this).find(".epic:eq(" + activitydeleteindex + ")").children().is(':empty')) {
                storycount = storycount + 0;
                $('span').text = storycount;
            }
            else {
                storycount = storycount + 1;
                $('span').text = storycount;
            }
        });
        if (activityempty && groupempty && storycount === 0) {
            $(this).parent().remove();
            $(".group:eq(" + activitydeleteindex + ")").remove();
            $("div.release").each(function (index) {
                $(this).find(".epic:eq(" + activitydeleteindex + ")").remove();
            });
        };
    });
    */
});