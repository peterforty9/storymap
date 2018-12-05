$(function () {
    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText

    
    //Create new story when clicked
    $(document).on("click", ".addStory", function () {
        var storytextid = Math.random()
        var htmlData = "<div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div>";
      
        if (($(this).parent().find("div .story").length > 0)) {
            $(htmlData).insertAfter($(this).parent().find("div .story:last-child"));
        }
        else {
            ($(this).parent().children(".stories")).append(htmlData);
        };

        document.getElementById(storytextid).focus();
        document.getElementById(storytextid).removeAttribute("id");
    });

    //Create new story when enter key pressed
    $(document).on("keypress", ".storytext", function (event) {

        if (event.which == 13) {
            event.preventDefault();
            var storytextid = Math.random()
            var htmlData = "<div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div>";
            $(htmlData).insertAfter($(this).parent());
            document.getElementById(storytextid).focus();
            document.getElementById(storytextid).removeAttribute("id");
            };
                   
       
    });

    //Remove empty story
    $(document).on("focusout", ".storytext", function () {
        if ($(this).is(':empty')) { $(this).parent().remove(); };
    });

  
 });