$(function () {
    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText
    /*
    $(document).on("click", ".story", function () {
        storedStory = $(this);
        storyHtml = storedStory.html();
        $("span").text(storyHtml);
        editableStory = $("<textarea />");
        editableStory.val(storyHtml);
        storedStory.replaceWith(editableStory);
        $(editableStory).focus();
        // setup the blur event for this new textarea
        $(editableStory).focusout(editableStoryBlurred);
    });
    
    function editableStoryBlurred() {
        newStory = $(this);
        newStoryText = newStory.val();
        storedStory.text(newStoryText);
        newStory.replaceWith($(storedStory));
    }
    */
   //$(document).on('DOMNodeInserted', '.story', function () { $(this).focus(); });

    $(document).on("click", ".addStory", function () {
        var storytextid = Math.random()
        var htmlData = "<div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div>";
        //$(this).before(htmlData);
        // $("span").text($(this).parent().find("div .story").length);
        if (($(this).parent().find("div .story").length > 0)) {
            $(htmlData).insertAfter($(this).parent().find("div .story:last-child"));
        }
        else {
            ($(this).parent().children(".stories")).append(htmlData);
        };

        document.getElementById(storytextid).focus();
    });

    $(document).on("keypress", ".storytext", function (event) {

        if (event.which == 13) {
            event.preventDefault();
            var storytextid = Math.random()
            var htmlData = "<div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div>";
            $(htmlData).insertAfter($(this).parent());
            document.getElementById(storytextid).focus();
            };
                   
       
    });

    $(document).on("focusout", ".storytext", function () {
        if ($(this).is(':empty')) { $(this).parent().remove();};
    });


});