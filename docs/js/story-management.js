$(function () {
    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText

    
    //Create new story when addStory clicked
    $(document).on("click", ".addStory", function () {
        var storytextid = Math.random()
        var htmlData = "<li><div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div></li>";
      
        if (($(this).parent().find("li .story").length > 0)) {
            $(htmlData).insertAfter($(this).parent().find("li:last-child"));
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
            if ($(this).is(':empty')) { deletestory($(this)) }
                else {
                var storytextid = Math.random()
                var htmlData = "<li><div class='story'><div class='storytext' contenteditable='true' id='" + storytextid + "'></div></div></li>";
                $(htmlData).insertAfter($(this).parent().parent());
                document.getElementById(storytextid).focus();
                document.getElementById(storytextid).removeAttribute("id");
                };
            };
        
    });

    //Remove empty story
   $(document).on("focusout", ".storytext", function () {
       if ($(this).is(':empty')) {deletestory($(this))}
      
   });

    function deletestory(thisObj){

         thisObj.parent().parent().remove();

    }
  
 });