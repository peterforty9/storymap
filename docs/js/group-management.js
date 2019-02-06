var pre, stopindex, to;
var newepic = "<div class='epic'><ul class='stories'></ul><div class='addStory'><strong>+</strong></div></div>";
var groupindex;
var activitystartindex;
var activitystartgroup;
var startgroup;
board = [];
groupsarray = [];
columnsarray = [];
rowsarray = [];
itemsarray = [];
blocktitlearray = [];
blockdetailsarray = [];

$(function () {

    $(document).getElementById(files).addEventListener('change', handleFileSelect, false);

});

$(function () {
    var textbox;
    var hiddenblockdetails;

    ///////////  TOP MENU ///////////

    //// Generate GUID
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        var id = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        return id;
    }


    //generate menu

    $("body").prepend("<div class='ui-menu'><div class='ui-menu-item' width='100'><a href='newmap.txt' id='downloadmap' type='text/plain' download='board'>Save</a></div><div id=new class='ui-menu-item'> New</div><div id='menuGroups' class='ui-menu-item'> Groups </div><div id='menuRows' class='ui-menu-item'> Rows </div><div id='col1' class='ui-menu-item'> 1 Col </div><div id='col2' class='ui-menu-item'> 2 Col </div><div id='col3' class='ui-menu-item'> 3 Col </div><div id='col4' class='ui-menu-item'> 4 Col </div><div id='toggledetails' class='ui-menu-item'> View details </div><div class='ui-menu-item'><input type='file' onchange='openFile(event)' width='150'><output id='list'></output></div></div>")
    $("body").append("<div id ='board'></div>");
    $("body").append("<div id='infobox'><div id='blockname' class='title'></div> <div id='blockdetails' contenteditable='true' class='hidden'></div></div>");

    var n = localStorage.getItem('board');
    var htmlstring = atob(n)
    $('#board').html(htmlstring);

    // Generate new board
    function newboard() {
        groupsarray.length = 0;
        columnsarray.length = 0;
        rowsarray.length = 0;
        itemsarray.length = 0;
        blocktitlearray.length = 0

        $("#board").empty();
        var theader = "<div id='theader'></div>";
        var groups = "<div id='groups' class='row'><div class='cell'><div class='groupsheading' id = 'groupsheading'><div class='groupsheadingtext textbox'>Groups</div><input type='hidden' id='groups1-details'></div></div></div>";
        var columns = "<div class='row' id='columnheaderrow'><div class='cell'><div class='columnheaderheading' id='columnheader1'><div class='columnheaderheadingtext textbox'>Activities</div><input type='hidden' id='columnheader1-details'></div></div></div>";
        var rowheading = "<div class='row' id='headingrow'><div class='rowsheading cell' id='rows1'><div class='rowsheadingtext textbox'>Rows</div><input type='hidden' id='rows1-details'></div><div class='cell'><div class='itemsheadingtext textbox' id='items1'>Stories</div><input type='hidden' id='items1-details'></div></div>";
        var tbody = "<div id='rows'></div>";
        var addrow = "<div class='newrelease'><div class='row'><div class='addrelease cell'>Add release</div></div></div>";
        $("#board").prepend(theader);
        $("#theader").prepend(groups);
        $("#theader").append(columns);
        $("#theader").append(rowheading);
        $("#board").append(tbody);
        $("#board").append(addrow);

        insertGroup("1");
        addNewRelease();
        appendNewActivity("2");
        toggleGroups();

    }

    //Toggle groups
    $(document).on("click", "#menuGroups", function () {
        toggleGroups();
    });
    function toggleGroups() {
        $("#groups").toggle();
    }
    //Toggle rows
    $(document).on("click", "#menuRows", function () {
        toggleRows();
    });
    function toggleRows() {
        $(".rowsheadingtext").toggle();
        $(".iteration").toggle();
        $(".addrelease").toggle();
    }

    // Update number of activity columns
    $(document).on("click", "#col4", function () {
        $("head link#columns").attr("href", "fourcolumns.css");
    });
    $(document).on("click", "#col1", function () {
        $("head link#columns").attr("href", "singlecolumn.css");
    });
    $(document).on("click", "#col3", function () {
        $("head link#columns").attr("href", "threecolumns.css");
    });
    $(document).on("click", "#col2", function () {
        $("head link#columns").attr("href", "twocolumns.css");
    });

    //Load HTML from local storage
    $(window).on('ready', function () {

        var mapdata = localStorage.getItem('board');
        var htmlstring = atob(mapdata);
        $('#board').html(htmlstring);
        console.log("window ready");
    });
    //upload file
    openFile = function (event) {

        var input = event.target;
        var reader = new FileReader();
        reader.onload = function () {
            var text = reader.result;
            var htmlstring = text//atob(text);
            $('#board').html(htmlstring);
            // Store
            localStorage.board = text;

        };
        reader.readAsText(input.files[0]);
    };

    //open new map from html template
    $(document).on("click", "#new", function () {
        newboard();
        //   $('#board').load('newmap.html #storymap');
        //  console.log("new map loaded");
    });

    //////////  SAVE BOARD /////////////////

    //Save map each time it is updated
    $(document).on("focusout", ".textbox", function () {
        var html = $('#board').clone();
        var htmlString = html.html();
        var datauri = btoa(htmlString);
        //Save to local storage
        localStorage.board = datauri;
        //getGroups();
      //  createColumnJSON();

        //Save downloadable file
        var downloadfile = "data: application/octet-stream;charset=utf-16le;base64," + datauri;
        $("#downloadmap").attr("href", downloadfile);
        console.log("board saved");

    });
    /// Update block title
    function updateBlockTitle(blockid, title) { 
        blocktitlearray[blockid] = title;
        console.log("Titles:");
        console.log(blocktitlearray);
    }
    /// Update block details
    function updateBlockDetails(blockid, text) {
        blockdetailsarray[blockid] = text;
        console.log("Details:");
        console.log(blockdetailsarray);
    }
    //Create json objects 

    function createColumnJSON(){
        updateGroupsObj();
        updateColumnsObj();
        updateRowsObj;
        updateItemsObj();
    }
   
        // Create groups

    function updateGroupsObj() {
            groupsarray = [];
            $(".group").each(function () {
                var id = $(this).attr("id");
                groupsarray.push(id);
            });
            console.log("groups:");
            console.log(groupsarray);
        }
    function updateColumnsObj() {
        columnObj = []

        $(".columnheader").each(function () {
            columngroupObj = [];
            var groupIndex = $(this).parent().index();
            var groupId = $("#groups div.cell:nth-child(" + (groupIndex + 1) + ")").children().attr("id");
                   
            ($(this).find(".activity")).each(function () {
                var columnid = $(this).attr("id");
                columngroupObj.push(columnid);
             });

            item = {}
            item[groupId] = columngroupObj;
            
            columnObj.push(item);
            
        });

        console.log("columnheader:");
        console.log(columnObj);
       // board.push({ "columns": columnObj });
    };
    function updateRowsObj() {
        rowsObj = [];
        $(".releaserow").each(function () {
            var iteration = ($(this).find(".iteration"));
            var blockid = $(iteration).attr("id");
            rowsObj.push(blockid);
        });
        console.log("rows:");
        console.log(rowsObj);
        //board.push({ "rows": rowsObj });
     }
    function updateItemsObj() {
      
        itemsObj = [];

        $(".releaserow").each(function () {
           // rowObj = [];
            var iteration = ($(this).find(".iteration"));
            var rowid = $(iteration).attr("id");
            epicObj = [];
            ($(this).find(".grouprelease")).each(function () {
                var groupIndex = $(this).index();
              //  var groupId = $("#groups div.cell:nth-child(" + (groupIndex + 1) + ")").children().attr("id");

              //  rowgroupObj = [];
                
                ($(this).find(".epic")).each(function () {
                var columnnumber = ($(this).index()) + 1;
                    storyObj = [];
                    var columnId = $("#columnheaderrow div.cell:nth-child(" + (groupIndex + 1) + ")").find(".columnheader li:nth-child(" + columnnumber + ") .activity").attr("id");
                    ($(this).find(".story")).each(function () {
                        var itemid = $(this).attr("id");
                        storyObj.push(itemid);
                    });
                    
                    item = {}
                    item[columnId] = storyObj;
                   epicObj.push(item);

                });
            });

            item = {}
            item[rowid] = epicObj;
            itemsObj.push(item);

        });

        //itemsObj.push(rowObj);
        console.log("items:");
        console.log(itemsObj);
        
        //board.push({ "items": itemsObj });
       // console.log("board");
        //console.log(board);

    };
   
//    */

    ////////// BLOCK MOVEMENT ////////////////

    //Listen out for newly created blocks and make sortable
    $("body").on("DOMNodeInserted", "#board", makeSortable);

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
                updateGroupsObj();  // Update group array
                var targetgroup = (ui.item.index()) + 1;
                if (targetgroup < startgroup) {

                    $("#columnheaderrow").each(function (index) {
                        ($(this).find(" .cell:nth-child(" + startgroup + ")")).insertBefore($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                    });

                    $(".releaserow").each(function (index) {
                        ($(this).find(" .cell:nth-child(" + startgroup + ")")).insertBefore($(this).find(" .cell:nth-child(" + targetgroup + ")"));
                    });


                } else if (targetgroup >= startgroup) {

                    $("#columnheaderrow").each(function (index) {
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
        $("#rows").sortable({
            connectWith: "#rows",
            cursor: "move",
            handle: ".iteration",
            cancel: ".epic, .newrelease, .iterationtext",
        });
    }
    function makeActivitiesSortable() {
        $(".columnheader").sortable({

            connectWith: ".stories, .columnheader",
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
                var stayedincolumnheader = ui.item.parent().hasClass("columnheader");
                var childtext = ui.item.children().children();
                var actcount = groupcolumncount(activitytargetgroup);
                var lastactivity = false

                if (targetepic == actcount) { lastactivity = true };

                //move epics in line with activity movement
                //Activity moved witin same group / Higher up
                if (stayedincolumnheader == true && activitytargetgroup === activitystartgroup && activitytargetindex > activitystartindex) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertAfter($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + targetepic + ")"));
                    });
                    //Activity moved witin same group / Lower down
                } else if (stayedincolumnheader == true && ((activitytargetgroup === activitystartgroup && activitytargetindex <= activitystartindex))) {

                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertBefore($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + targetepic + ")"));
                    });
                    //Activity to different group / NOT To last column
                } else if (stayedincolumnheader == true && (activitytargetgroup != activitystartgroup) && lastactivity == false) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertBefore($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + targetepic + ")"));
                    });
                    //Activity to different group / last column
                } else if (stayedincolumnheader == true && (activitytargetgroup != activitystartgroup) && lastactivity && actcount > 1) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").insertAfter($(this).find(" .cell:nth-child(" + activitytargetgroup + ") .epic:nth-child(" + activitytargetindex + ")"));
                    });
                    //Activity to different group / No columnheader exist
                } else if (stayedincolumnheader == true && (activitytargetgroup != activitystartgroup) && actcount == 1) {
                    $(".releaserow").each(function (index) {
                        $(this).find(" .cell:nth-child(" + activitystartgroup + ") .epic:nth-child(" + fromepic + ")").appendTo($(this).find(" .cell:nth-child(" + activitytargetgroup + ")"));
                    });
                } else if (stayedincolumnheader != true) {
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
                        hideaddstory(); //update add story buttons

                    } else { $(".columnheader").sortable("cancel"); }
                };
            },

        });
    }
    function makeEpicsSortable() {
        $(".stories").sortable({
            cursor: "move",
            cancel: ".storytext",
            connectWith: ".stories, .columnheader",

            start: function (event, ui) {

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
            stop: function (event, ui) {

                var newepic = boxhtml("epic")
                stopindex = ui.item.index();

                var targetgroup = (ui.item.parent().parent().index()) + 1;
                var targetepic = stopindex;

                var movedtocolumnheader = ui.item.parent().hasClass("columnheader");
                hideaddstory(); //update add story buttons
                if (movedtocolumnheader == true) {

                    var childtext = ui.item.children().children();
                    var actcount = groupcolumncount(targetgroup);

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
        $(".textbox").attr('contenteditable', 'true');
    };

    //Edit textbox details
    $(document).on("keydown", ".textbox", function (event) {
        if (event.shiftKey && event.ctrlKey && event.which == 13) {
            hiddenblockdetails = $("#blockdetails").hasClass("hidden");
            $("#blockdetails").removeClass("hidden");
            $('#blockdetails').focus();
            event.stopPropagation();

        }
    });

    //Generate object html
    function boxhtml(boxtype, textboxid) {
        var htmlData = "";
        if (textboxid == null) { textboxid = guid() };
        if (boxtype == "group" || boxtype == "activity" || boxtype == "story" || boxtype == "iteration") {
            htmlData = "<div class='" + boxtype + "' id='" + textboxid + "'><div class='" + boxtype + "text textbox' ></div><input type='hidden' id='" + textboxid + "-details'></div>";
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
    function groupcolumncount(group) {
     return  ($("#columnheaderrow .cell:nth-child(" + group + ") .activity").length)
    }
    ///////////// GROUP MANAGEMENT //////////////////

    //Insert new group from group
    $(document).on("keydown", ".grouptext", function (event) {
        console.log("Group return key");
        var group = $(this).parent().parent();
        var groupstartindex = $(this).parent().parent().index();
        var groupnumber = groupstartindex + 1;
        var activitylist = $('#columnheaderrow .cell:nth-child(' + groupnumber + ')');

        if (event.which == 13 && event.ctrlKey && (event.shiftKey == false)) {
            event.preventDefault();
            appendNewActivity(groupnumber);
            event.stopPropagation();
        }
        else if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) {
            event.preventDefault();
            //Remove group
            if (groupcolumncount(groupnumber) == 0 && $(this).is(':empty')) { 

                //Remove group
                group.remove();
                updateGroupsObj();//Update group array
               
                //remove activity container
                activitylist.remove();
              
                updateColumnsObj();// Update column array

                //Remove releaserow containers
                $(".releaserow").each(function (index) {

                    $(this).find(" .cell:nth-child(" + groupnumber + ")").remove();

                });

            } else { insertGroup(groupnumber) };
        }
    });

     //Insert new group
    function insertGroup(groupnumber) {
        var grouptextid = guid();
        var activitylist = $('#columnheaderrow .cell:nth-child(' + groupnumber + ')');
        var newgrouphtml = boxhtml("group", grouptextid);
        var activitylisthtml = "<div class='grouprelease cell'><ul class='columnheader'></ul></div>"
        var groupreleasehtml = "<div class='grouprelease release cell'></div>"
        var group = $("#groups div.cell:nth-child(" + (groupnumber) + ")")

        //Insert releasegroups

        $(".releaserow").each(function (index) {
            $(groupreleasehtml).insertAfter($(this).find(" .cell:nth-child(" + groupnumber + ")"));
          //  gridarray[index].push([groupnumber - 1]);
        //    console.log("epics group added:");
         //   console.log(gridarray);
        });

        //Insert group
        $(newgrouphtml).insertAfter(group);
        var groupindex = groupnumber - 1;
        //Update groups array
        updateGroupsObj();
       
        //Add columnheader
        $(activitylisthtml).insertAfter(activitylist);
        // Update columns array
        updateColumnsObj();
       
        var block = document.getElementById(grouptextid);
        $(block).find(".textbox").focus();
    }

    //Append new column
    function appendNewActivity(groupnumber) {
        var activitytextid = guid();
        var activityhtml = boxhtml("activity", activitytextid);
        var activitylist = $('#columnheaderrow .cell:nth-child(' + groupnumber + ') .columnheader');

        //Insert column 
        $(activityhtml).appendTo(activitylist);
        var block = document.getElementById(activitytextid);
        $(block).find(".textbox").focus();
        //Update columns array    
        updateColumnsObj();
      
        //Append new epic

        var from = boxhtml("epic");

        $(".releaserow").each(function (index) {
            $(from).appendTo($(this).find(" .cell:nth-child(" + groupnumber + ")"));

        });
    };

    //////////// ACTIVITY MANAGEMENT /////////////////

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
        if (event.ctrlKey && event.which == 13 && (event.shiftKey == false)) { //Append new story
            event.preventDefault();
            appendNewStory(activitynumber, groupnumber);
            event.stopPropagation();
        } else if (event.shiftKey && event.which == 13 && $("#groups").is(":visible") && (event.ctrlKey == false)) { //Insert new group (if groups visible)
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
        var activitytextid = guid();
        var columnindex = activitynumber - 1;
        var htmlData = boxhtml("activity", activitytextid)
        var activity = $("#columnheaderrow").find(".cell:nth-child(" + groupnumber + ") .columnheader li").eq(columnindex);
        //Insert activity 
        $(htmlData).insertAfter($(activity));
        var block = document.getElementById(activitytextid);
        $(block).find(".textbox").focus();
        //Update columns array
        updateColumnsObj();

        //Insert new epic

        var from;

        from = boxhtml("epic");

        $(".releaserow").each(function (index) {
            $(from).insertAfter($(this).find($(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ")")));

        });

    };

    function appendNewStory(activitynumber, groupnumber, rowindex) {

        var storytextid = guid();
        var htmlData = boxhtml("story", storytextid);
        if (rowindex == null) rowindex = 0; 
        var stories = ($(".releaserow").eq(rowindex).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ") .stories"));
        $(htmlData).appendTo(stories);
        
        /* Might need this for different table type e.g. grid
        $(".releaserow").each(function (index) {
            $(htmlData).appendTo($(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ") .stories"));
        });
        */
        var block = document.getElementById(storytextid);
        $(block).find(".textbox").focus();
        //Hide "add story"
        $(stories).parent().children('.addStory').hide();

        //update arrays
        updateItemsObj();
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
        var empty
        groupnumber = groupnumber + 1
        console.log("Rowindex:" + rowindex + " groupcell:" + groupnumber + " activitynumber:" + activitynumber);
        var activitycount = groupcolumncount(groupnumber);
        if (activitycount == 0 || $($(".releaserow").eq(rowindex)).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + activitynumber + ") .stories").is(':empty')) empty = true;
        console.log(empty);
        return empty;
    };

    //Remove activity li and underlying epics
    function removeactivity(thisObj) {
        var columnindex = thisObj.index();
        var groupindex = thisObj.parent().parent().index();
        var columnnumber = columnindex + 1;
        var groupnumber = groupindex + 1;

        //Remove activity
        thisObj.remove();
        // Update columns array
        updateColumnsObj();

        //Remove epics
        $(".releaserow").each(function (index) {

            $(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + columnnumber + ")").remove();

        });
    };

    ///////////// STORY MANAGEMENT /////////////////

    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText

    //Create new story when addStory clicked
    $(document).on("click", ".addStory", function () {
        var storytextid = guid();
        var htmlData = boxhtml("story", storytextid);

        if (($(this).parent().find("li .story").length > 0)) {
            $(htmlData).insertAfter($(this).parent().find("li:last-child"));
        }
        else {
            ($(this).parent().children(".stories")).append(htmlData);
        };

        var block = document.getElementById(storytextid);
        $(block).find(".textbox").focus();
        $(this).hide();
    });

    //Create new story when enter key pressed
    $(document).on("keydown", ".storytext", function (event) {
        var activityindex = $(this).parent().parent().parent().parent().index();
        var groupindex = $(this).parent().parent().parent().parent().parent().index();
        var rowindex = $(this).parent().parent().parent().parent().parent().parent().index();
        var ctrlrowindex = rowindex + 1;
        var activitynumber = activityindex + 1;
        var groupnumber = groupindex + 1;

        if (event.shiftKey && event.which == 13 && (event.ctrlKey == false)) { //Insert new activity
            event.preventDefault();
            insertNewActivity(activitynumber, groupnumber);
            event.stopPropagation();
        } else if (event.ctrlKey && event.which == 13 && (event.shiftKey == false)) { //Append new story to next release
            event.preventDefault();
            appendNewStory(activitynumber, groupnumber, ctrlrowindex);
            event.stopPropagation();
        } else if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) { //Insert story
            event.preventDefault();
            if ($(this).is(':empty')) { deletestory($(this)) }
            else {
                var storytextid = guid();
                var htmlData = boxhtml("story", storytextid);
                $(htmlData).insertAfter($(this).parent().parent());
                var block = document.getElementById(storytextid);
                $(block).find(".textbox").focus();
                //Update items array
                updateItemsObj();                         
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
        var stories = thisObj.parent().parent().parent();
        var laststory = $(stories).length;
        thisObj.parent().parent().remove();

        //Show "add story" if it was the last story in the epic
        if (laststory == 1) {
            $(stories).parent().children('.addStory').show();
        };
        //update array
        updateItemsObj();
    }

    //Hide add story
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

    /////////// RELEASE MANAGEMENT ////////////////

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
        var newepic = boxhtml("epic");

        do {
            m = 2 + k;
            newrelease = newrelease + newgroupstart;

            var activitycount = groupcolumncount(m);
            console.log("group " + k + " has " + activitycount + " columnheader");
            if (activitycount > 0) {
                do {
                    newrelease = newrelease + newepic;
                    i++;
                }
                while (i < activitycount);
            };
            i = 0;
            newrelease = newrelease + newgroupend;
            k++;
        }
        while (k < groupcount);
        newrelease = newrelease + newgroupend + "</div>";

        $(newrelease).appendTo($("#rows"));

        //Update rows array
        updateRowsObj();

    }

    //Create new row when enter key pressed
    $(document).on("keydown", ".iterationtext", function (event) {
        var rowindex = $(this).parent().parent().parent().index();
        console.log("on keydown row index:" + rowindex);
        if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) { //Insert row
            event.preventDefault();
            if ($(this).is(':empty') && emptyIteration(rowindex)) {
                $($(".releaserow").eq(rowindex)).remove();
                console.log("row deleted");
        }
            else {
                var iterationtextid = guid()
                addNewRelease(iterationtextid)
                var block = document.getElementById(iterationtextid);
                $(block).find(".textbox").focus();

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
            
            var activitycount = groupcolumncount(m);

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
    $(document).on("focus", ".textbox", function (event) {
        $("#blockdetails").html("");
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        $("#blockname").text(currentText);

        //var detailsText = $(this).next().val();
        var detailsText = blockdetailsarray[blockid]; 
        textbox = $(this).parent().attr("id");
        var bgcolor = $(this).parent().css('background-color');
        $("#blockdetails").html(detailsText);
        $("#blockname").css('background-color', bgcolor); //make title colour the same as the block type
                
    });
    $(document).on("keyup", ".textbox", function (event) {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        $("#blockname").text(currentText);
        updateBlockTitle(blockid, currentText); 
        
    });

    $(document).on("keyup", ".grouptext", function (event) {
        var currentText = $(this).text();
        var groupnumber = $(this).parent().parent().index();

    });

    $(document).on("keyup", ".activitytext", function (event) {
        var currentText = $(this).text();
        var groupnumber = $(this).parent().parent().parent().parent().index();
        var groupindex = groupnumber - 1;

    });


    $(document).on("keyup", "#blockdetails", function (event) {
        var detailsText = $("#blockdetails").html();
        var hiddeninput = textbox + "-details"
        var element2 = document.getElementById(hiddeninput);
        $(element2).val(detailsText);
        updateBlockDetails(textbox, detailsText); 

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
            var block = document.getElementById(textbox);
            $(block).find(".textbox").focus();
            event.stopPropagation();
        }
    });
   
 });
 