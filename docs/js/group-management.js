
board = {"columns": [], "groups": [], "items": [], "rows": [], "titles": {}, "details": {}};
groupsObj = [];
columnsObj = [];
rowsObj = [];
itemsObj = [];
blocktitlearray = {};
blockdetailsarray = {};

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

    $("body").prepend("<div class='ui-menu'><label class='container' id = new>New</label></label>" +
        "<label class='container'>Groups<input type='checkbox' id='menuGroups'><span class='checkmark'></span></label>" +
        "<label class='container'>Rows<input type='checkbox' id='menuRows'><span class='checkmark'></span></label>" +
      //  "<label class='container'>Block details<input type='checkbox' id='toggledetails'><span class='checkmark'></span></label>" +
        "<label class='container' id='colwidth'>Column width</label></div > ");
    $("body").append("<div id ='board'></div>");
    $("body").append("<div id='toggledetails' class='hidden'>Details</div>");
    $("body").append("<div id='infobox' class='hidden'>" +
        "<textarea id='blockname' class='title' maxlength='50'></textarea>" +
        "<div id='blockdetails' contenteditable='true'></div>" +
        "<div><label class='container' id='savedetails'>Save</label><label class='container' id='canceldetails'>Cancel</label></div>" +
        "</div > ");

    var n = localStorage.getItem('board');
    var htmlstring = atob(n)
    $('#board').html(htmlstring);

    var boarddata = localStorage.getItem("boarddata");
    if (boarddata) {
        board = JSON.parse(boarddata);
    }
    blockdetailsarray = board["details"];
    blocktitlesarray = board["titles"];
    console.log("Local storage board loaded");
    console.log(board);
    makeSortable();

    // Generate new board
    function newboard() {
        
        $("#board").empty();

        board = { "columns": [], "groups": [], "items": [], "rows": [], "titles": {}, "details": {} };
        groupsObj = [];
        columnsObj = [];
        rowsObj = [];
        itemsObj = [];
        blocktitlearray = {};
        blockdetailsarray = {};2 

        var boardheader = "<div id='boardheader'></div>";
        var groups = "<div id='headingcontainer'>" +
                        "<div class='groupsheading' id='groupsheading'><div class='groupsheadingtext textbox'>Groups</div></div>" +
                        "<div class='columnheaderheading' id='columnheader1'><div class='columnheaderheadingtext textbox'>Activities</div></div>" +
                        "</div><div id='grouparraycontainer'></div>";
        var rowheading = "<div id='headingrow'><div class='rowsheading' id='rows1'><div class='rowsheadingtext textbox'>Rows</div></div><div class='itemsheadingtext textbox' id='items1'>Stories</div></div>";

        var rows = "<div id='rows'></div>";
        var addrow = "<div class='newrelease'><div class='addrelease cell'>Add release</div></div>";
        $("#board").prepend(boardheader);
        $("#boardheader").prepend(groups);
        $("#board").append(rowheading);
        $("#board").append(rows);
        $("#board").append(addrow);

        insertGroup("-1");
        addNewRelease();
        appendNewcolumn("0");
        toggleGroups();
     //   toggleRows();



    }

    //Toggle groups
    $(document).on("click", "#menuGroups", function () {
      //  toggleGroups();
        document.getElementById("menuGroups").checked ? $(".group").show() : $(".group").hide()
        
    });
    function toggleGroups() {
        $("#group").toggle();
    }
    //Toggle rows
    $(document).on("click", "#menuRows", function () {
      //  toggleRows();
        document.getElementById("menuRows").checked ? $(".rowsheadingtext").show() : $(".rowsheadingtext").hide();
        document.getElementById("menuRows").checked ? $(".iteration").show() : $(".iteration").hide();
        document.getElementById("menuRows").checked ? $(".addrelease").show() : $(".addrelease").hide();
    });
    function toggleRows() {
        $(".rowsheadingtext").toggle();
        $(".iteration").toggle();
        $(".addrelease").toggle();
    }

    // Update number of column columns
  
    $(document).on("click", "#colwidth", function () {

        $("head link#columns").attr("href", function (i, attr) {
            return attr == "singlecolumn.css" ? "twocolumns.css" : (
                attr == "twocolumns.css" ? "threecolumns.css" : (
                    attr == "threecolumns.css" ? "fourcolumns.css" : "singlecolumn.css"))
        });
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


    
    $(document).on("click", "#new", function () { //open new map from html template
        newboard();
        console.log("new map loaded");
    });

    //////////  SAVE BOARD /////////////////

    //Save map each time it is updated
    $(document).on("focusout", ".textbox", function () {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        updateBlockTitle(blockid, currentText);

        if ($(this).not(':empty')) $(this).attr('contenteditable', 'false');
    });

    function saveToLocalStorage() {
        var html = $('#board').clone();
        var htmlString = html.html();
        var datauri = btoa(htmlString);
       
        localStorage.board = datauri;

       
        //createBoardJSON();
     //   board["items"] = itemsObj;
     //   board["rows"] = rowsObj;
     //   board["columns"] = columnsObj;
      //  board["groups"] = groupsObj;
       // board["titles"] = blocktitlearray;
      //  board["details"] = blockdetailsarray;
        var boarddata = JSON.stringify(board);
        localStorage.setItem("boarddata", boarddata);
        console.log("board saved");
        console.log(JSON.parse(boarddata));
        console.log(boarddata);
        //Save downloadable file
        //var downloadfile = "data: application/octet-stream;charset=utf-16le;base64," + datauri;
        //$("#downloadmap").attr("href", downloadfile);
  
    };

  
    /// Update block title
    function updateBlockTitle(blockid, title) { 

        blocktitlearray[blockid] = title;
        board["titles"] = blocktitlearray;
        console.log("Titles:");
       // console.log(blocktitlearray);
        saveToLocalStorage();
    }
    /// Update block details
    function updateBlockDetails(blockid, text) {
        blockdetailsarray[blockid] = text;
        board["details"] = blockdetailsarray;
        console.log("Details:");
      //  console.log(blockdetailsarray);
        saveToLocalStorage();
    }
   
    //Create json objects /////

    function createBoardJSON(){
        updateGroupsObj();
        updateColumnsObj();
        updateRowsObj;
        updateItemsObj();
    }
    function updateGroupsObj() {
        groupsObj = [];
        $(".group").each(function () {
            var id = $(this).attr("id");
            groupsObj.push(id);
        });
        console.log("groups updated:");
        console.log(groupsObj);
  
        board["groups"] = groupsObj;
      
        saveToLocalStorage();
    }
    function updateColumnsObj() {
        columnsObj = []
        $(".columnheader").each(function () {
            columngroupObj = [];
            var groupId = $(this).parent().parent().find(".group").attr("id");
            ($(this).find(".column")).each(function () {
                var columnid = $(this).attr("id");
                columngroupObj.push(columnid);
             });
            item = {}
            item[groupId] = columngroupObj;
            columnsObj.push(item);
        });
        console.log("Columns updated:");
        console.log(columnsObj);

        board["columns"] = columnsObj;
  
        saveToLocalStorage();
      
    };
    function updateRowsObj() {
        rowsObj = [];
        $(".row").each(function () {
            var iteration = ($(this).find(".iteration"));
            var blockid = $(iteration).attr("id");
            rowsObj.push(blockid);
        });
        console.log("Rows updated:");
        console.log(rowsObj);

        board["rows"] = rowsObj;
  
        saveToLocalStorage();
       
     }
    function updateItemsObj() {
        itemsObj = [];
        $(".row").each(function () {
            var iteration = ($(this).find(".iteration"));
            var rowid = $(iteration).attr("id");
            epicObj = [];
            ($(this).find(".grouprelease")).each(function () {
                var groupIndex = $(this).index();
                ($(this).find(".epic")).each(function () {
                    var columnindex = $(this).index();
                    storyObj = [];
                    var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + columnindex + ") .column").attr("id");
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
        console.log("Items updated:");
        console.log(itemsObj);

        board["items"] = itemsObj;

        saveToLocalStorage();
        
       // console.log("board");
        //console.log(board);
    };
   
    //Generate object html
    function boxhtml(boxtype, textboxid) {
        var htmlData = "";
        if (textboxid == null) { textboxid = guid() };
        if (boxtype == "group" || boxtype == "column" || boxtype == "story" || boxtype == "iteration") {
            htmlData = "<div class='" + boxtype + "' id='" + textboxid + "'><div class='" + boxtype + "text textbox' contenteditable='true'></div></div>";
            if (boxtype == "group") {
                htmlData = "<div class='groupcontainer'><div class='groupline'>" + htmlData + "<i class='far fa-plus-square addGroup'></i></div>" +
                    "<div class='groupcolumns'><ul class='columnheader'></ul><i class='far fa-plus-square addColumn'></i></div></div>";
            } else if (boxtype == "column" || boxtype == "story") {
                htmlData = "<li>" + htmlData + "</li>";
                console.log(boxtype + " created (li)");
            } else { };
        } else if (boxtype == "epic") {
            htmlData = "<div class='epic'><ul class='stories'></ul></div>";
        } else { };
        console.log(boxtype + " created");
        return htmlData;
    }

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
        $("#boardheader").sortable({
            connectWith: "#boardheader",
            cursor: "move",
            cancel: ".textbox, .groupcolumns",
            items: ".groupcontainer",

            start: function (event, ui) {

              //  clone = $(ui.item[0].outerHTML).clone();
               // startgroup = (ui.item.index()) + 1;
                ui.item.data('originIndex', ui.item.index());
               // var startgroupindex = ui.item.data('startgroupindex')
               // startgroupindex = ui.item.index();
            },
/*
            placeholder: {
                element: function (clone, ui) {
                    return $('<div class="selected"></div>');
                },
                update: function () {
                    return;
                }
            },
            */
            stop: function (event, ui) {
                updateGroupsObj();  // Update group array
               // var targetgroup = (ui.item.index()) + 1;
                var startgroupindex = ui.item.data('originIndex');
                var targetgroupindex = ui.item.index();
                if (targetgroupindex < startgroupindex) {

                    $(".rowgroups").each(function (index) {
                        ($(this).find(" .grouprelease:eq(" + startgroupindex + ")")).insertBefore($(this).find(" .grouprelease:eq(" + targetgroupindex + ")"));
                    });

                } else if (targetgroupindex >= startgroupindex) {


                    $(".rowgroups").each(function (index) {
                        ($(this).find(" .grouprelease:eq(" + startgroupindex + ")")).insertAfter($(this).find(" .grouprelease:eq(" + targetgroupindex + ")"));
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

            connectWith: ".columnheader",
            cursor: "move",
            cancel: ".columntext",
       

            start: function (event, ui) {
                // clone = $(ui.item[0].outerHTML).clone();
               // columnstartindex = ui.item.index();
                //columnstartplaceholderindex = ui.placeholder.index();
                ui.item.data('originIndex', ui.item.index());
                ui.item.data('originGroup', ui.item.parents(".groupcontainer").index());
                ui.item.data('changeFromGroup', ui.item.parents(".groupcontainer").index());
                ui.item.data('changeFromIndex', ui.item.index());
              
                //columnstartgroupindex = ui.item.parents(".groupcontainer").index();
                ui.placeholder.width('150px');
            },
            // /*          
            change: function (event, ui) {
                console.log("Change executed");
                var stayedincolumnheader = ui.placeholder.parents().hasClass("columnheader");
                if (stayedincolumnheader == true) { 
                    moveEpics(event, ui);   
                } else { //if column moved to item
                   // removeEpics(event, ui);
                };  
               
            },
        
              
            placeholder: {
                element: function (clone, ui) {
                    //   return $('<li class="selected">' + clone[0].innerHTML + '</li>');
                    return $('<li class="selected"></li>');
                },
                update: function () {
                    return;
                }
            },
                  
            beforeStop: function (event, ui) {                
                var stayedincolumnheader = ui.item.parents().hasClass("columnheader");                
                if (stayedincolumnheader == true) { //move epics in line with column movement
                  //  moveEpics(event,ui);              
                } else { //if column moved to item
                   // removeEpics(event, ui);    
                   // moveEpics(event, ui, true);
                };               
            },
        });
    }

    function moveEpics(event, ui, cancel) {
      //  var columntargetindex = ui.placeholder.index();
      
        var actcount;
        var lastcolumn = false;

        var changeFromGroup = ui.item.data('changeFromGroup')
        var originIndex = ui.item.data('originIndex');
        var changeFromIndex = ui.item.data('changeFromIndex');
        var originGroup = ui.item.data('originGroup');
        if (cancel === true) {
            var currentIndex = originIndex;
            var currentGroup = originGroup;
        } else {
            var currentIndex = ui.placeholder.index();
            var currentGroup = ui.placeholder.parents(".groupcontainer").index();
        };
        if ((originGroup === currentGroup) && (currentIndex > originIndex)) {
            currentIndex -= 1;
        };
        var targetepic = currentIndex + 1;
        if (originGroup === currentGroup) {
            actcount = groupcolumncount(currentGroup);
        } else { actcount = groupcolumncount(currentGroup) + 1 };

        if (targetepic === actcount) { lastcolumn = true };

        $(".rowgroups").each(function (index) {
            var startepic = $(this).find(".grouprelease:eq(" + changeFromGroup + ") .epic:eq(" + changeFromIndex + ")");
            var targetepic = $(this).find(".grouprelease:eq(" + currentGroup + ") .epic:eq(" + currentIndex  + ")");
            var targetgroup = $(this).find(".grouprelease:eq(" + currentGroup + ") .cell-flex-container");

            if (currentGroup === changeFromGroup && currentIndex > changeFromIndex ) { //column moved within same group / higher up
                startepic.insertAfter(targetepic);
                console.log("column moved within same group / higher up");
            }
            else if (currentGroup === changeFromGroup && currentIndex <= changeFromIndex ) { //column moved within same group / Lower down
                startepic.insertBefore(targetepic);
                console.log("column moved within same group / Lower down");
            }
            else if ((currentGroup != changeFromGroup) && lastcolumn == false) { //column to different group / NOT To last column
                startepic.insertBefore(targetepic);
                console.log("column to different group / NOT To last column");
            }
            else if ((currentGroup != changeFromGroup) && lastcolumn && actcount > 1) {  //column to different group / last column
                startepic.appendTo(targetgroup);
                console.log("column to different group / last column");
            }
            else if ((currentGroup != changeFromGroup) && actcount == 1) { //column to different group / No columnheader exist
                startepic.appendTo(targetgroup);
                console.log("column to different group / No columnheader exist");
            }
        });
        console.log("From group:" + changeFromGroup + " Current group: " + currentGroup + " From index:" + changeFromIndex + " Current index:" + currentIndex);
        ui.item.data('changeFromIndex', currentIndex);
        ui.item.data('changeFromGroup', currentGroup);

    };
    function removeEpics(event, ui) {
        var originGroup = ui.item.data('originGroup');
        var originIndex = ui.item.data('originIndex');
        var storycount = 0;
        var childtext = ui.item.find(".textbox");
        $(".rowgroups").each(function (index) {
            var startepic = $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")");
            if (startepic.find(".stories").is(':empty')) {
                storycount = storycount + 0;
            }
            else {
                storycount = storycount + 1;
            }
        });
        //Only allow to convert a column to a story if it nas no stories
        console.log("Total story count: " + storycount);

        if (storycount === 0) {

            $(".rowgroups").each(function (index) {
                $(this).find(" .grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").remove();
            });
            //Change class from column to story
            ui.item.find(".column").addClass('story').removeClass('column');
            childtext.addClass('storytext').removeClass('columntext');

        } else if (storycount > 0) {
            $(".columnheader").sortable("cancel");

        }
    };
    function makeEpicsSortable() {
        $(".stories").sortable({
       //     placeholder: "ui-sortable-placeholder",
            cursor: "move",
            cancel: ".storytext",
            connectWith: ".stories, .columnheader",
          
            start: function (event, ui) {
             //   ui.placeholder.html("<li class='selected'></li>");
             //   clone = $(ui.item[0].outerHTML).clone();
               
                    ui.placeholder.width(ui.item.width());
                
            },

 //    /*       
            placeholder: {
                element: function () {
                    return $('<li class="selected"></li>');
                },
                update: function () {
                    return;
                }
            },
  //         */
            stop: function (event, ui) {

                var newepic = boxhtml("epic")
                var stopindex = ui.item.index();
                var targetgroupindex = (ui.item.parents(".groupcontainer").index());
                var targetgroup = targetgroupindex + 1;
                var targetepic = stopindex + 1;
                var targetepicindex = stopindex;

                var movedtocolumnheader = ui.item.parents().hasClass("columnheader");
              //  hideaddstory(); //update add story buttons
                if (movedtocolumnheader == true) {

                    var childtext = ui.item.children().children();
                    var actcount = groupcolumncount(targetgroupindex);

                    if (actcount > 1 && targetepic <= actcount) {
                        ui.item.children().addClass('column').removeClass('story');
                        childtext.addClass('columntext').removeClass('storytext');

                        $(".rowgroups").each(function (index) {
                            $(newepic).insertBefore($(this).find(" .grouprelease:eq(" + targetgroupindex + ") .epic:eq(" + targetepicindex + ")"));
                        });


                    } else if (actcount > 1 && targetepic > actcount) {
                        ui.item.children().addClass('column').removeClass('story');
                        childtext.addClass('columntext').removeClass('storytext');
                        $(".rowgroups").each(function (index) {
                            $(newepic).insertAfter($(this).find(" .grouprelease:eq(" + targetgroupindex + ") .epic:last-child"));
                        });

                    } else if (actcount == 1) {
                        ui.item.children().addClass('column').removeClass('story');
                        childtext.addClass('columntext').removeClass('storytext');
                        $(".rowgroups").each(function (index) {
                            $(newepic).appendTo($(this).find(" .grouprelease:eq(" + targetgroupindex + ") .cell-flex-container"));
                        });
                    }
                }
            }
        });
    }
    function makeeditable() { 
            $(".stories").sortable({ cancel: "" });
            $(".columnheader").sortable({ cancel: "" });
            $("#boardheader").sortable({ cancel: "" });
        $("#rows").sortable({ cancel: "" });

            console.log("make editable");

    };

    $(document).on("click", ".textbox", function (event) {
        console.log("textbox clicked");
        $(".textbox").parent().removeClass('blockselected');
        $(this).parent().addClass('blockselected')
        textbox = $(this).parent().attr("id");
        var bgcolour = $(this).parent().css("background-color");
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");

        $("#blockname").css("background-color", bgcolour);
        $("#blockname").val(currentText);
        console.log("Click on " + blockid);
        $("#blockdetails").html("");
     
        var detailsText = blockdetailsarray[blockid];
        $("#blockdetails").html(detailsText);
        event.stopPropagation();
    });
    $(document).on("dblclick", ".textbox", function (event) {
        $("#infobox").removeClass("hidden");
        $("#toggledetails").removeClass("hidden");
        $("#blockdetails").focus();
    });
    $(document).on("click", ".story", function (event) {
          event.stopPropagation();
    });
   // $(document).on("click", "#quick", function (event) {
    //    makeSortable()
   // });
    $(document).on("keydown", ".textbox", function (event) {
        if (event.shiftKey && event.ctrlKey && event.which == 13) {
         //   hiddenblockdetails = $("#blockdetails").hasClass("hidden");
            $("#infobox").removeClass("hidden");
            $("#toggledetails").removeClass("hidden");
            $('#blockdetails').focus();
            hiddenblockdetails = $("#infobox").hasClass("hidden");
           // $("#toggledetails").prop('checked',true);
            event.stopPropagation();

        }
    });  //Edit textbox details

    function groupcolumncount(groupindex) {       
        var columncount = $('.groupcontainer:eq(' + groupindex + ') .column').length;
        console.log("Column count: " + columncount);
        return columncount
    }
    ///////////// GROUP MANAGEMENT //////////////////

    //Insert new group from group
    $(document).on("keydown", ".grouptext", function (event) {
        console.log("Group return key");
        var group = $(this).parents('.groupcontainer');
        var groupstartindex = $(this).parents('.groupcontainer').index();
        //var groupnumber = groupstartindex + 1;
        var columnlist = $('.groupcontainer:eq(' + groupstartindex + ') .columnheader');

        if (event.which == 13 && event.ctrlKey && (event.shiftKey == false)) {
            event.preventDefault();
            appendNewcolumn(groupstartindex);
            event.stopPropagation();
        }
        else if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) {
            event.preventDefault();
            //Remove group
            if (groupcolumncount(groupstartindex) == 0 && $(this).is(':empty')) { 
                console.log("delete group: " + groupstartindex);
                $(this).parents('.groupcontainer').remove(); //Remove group
                updateGroupsObj();//Update group array
                updateColumnsObj();// Update column array

                //Remove releaserow containers
                $(".row").each(function (index) {

                    $(this).find(" .grouprelease.eq(" + groupstartindex + ")").remove();

                });

            } else { insertGroup(groupstartindex) };
        }
    });

     //Insert new group
    function insertGroup(groupindex) {
        //var groupindex = groupnumber - 1
        var grouptextid = guid();
        var newgrouphtml = boxhtml("group", grouptextid);
        var groupreleasehtml = "<div class='grouprelease'><div class='cell-flex-container'></div></div>";

        if (groupindex >= 0) {
            var previousgroup = $(".groupcontainer").eq(groupindex);
            $(newgrouphtml).insertAfter(previousgroup);
        } else
        {
            $(newgrouphtml).prependTo($("#grouparraycontainer"));
        };
        //Insert releasegroups

        $(".rowgroups").each(function (index) {
            $(groupreleasehtml).insertAfter($(this).find('.grouprelease:eq(' + (groupindex) + ')' ));
          
        });

        //Insert group
        
        //Update groups array
        updateGroupsObj();
        updateColumnsObj();
       
        //Add columnheader
       // $(columnlisthtml).insertAfter(columnlist);
        // Update columns array
               
        var block = document.getElementById(grouptextid);
        $(block).find(".textbox").focus();
    }

    //Append new column
    function appendNewcolumn(groupindex) {
        var columntextid = guid();
        var columnhtml = boxhtml("column", columntextid);
        var columnlist = $('.groupcontainer:eq(' + groupindex + ') .columnheader');
        console.log("groupindex to append column: " + groupindex)
        //Insert column 
        $(columnhtml).appendTo(columnlist);
        var block = document.getElementById(columntextid);
        $(block).find(".textbox").focus();
        //Update columns array    
        updateColumnsObj();
      
        //Append new epic


        $(".rowgroups").each(function (index) {

            var from = boxhtml("epic");
            var flexcontainer = $(this).find('.grouprelease:eq(' + groupindex + ') .cell-flex-container');
            $(from).appendTo(flexcontainer);

        });

    //    hideaddColumn();
    };

    //////////// column MANAGEMENT /////////////////

    var storedcolumn
    var columnHtml
    var editablecolumn
    var newcolumnText
    var newcolumn

    //Hide addColumn
    function hideaddColumn() {

        //hide the add story button when stories exist
        $(".columnheader").each(function (index) {
          //  if ($(this).is(':empty')) {
          //      $(this).parent().children('.addColumn').show();
          
          //  } else {

          //      $(this).parent().children('.addColumn').hide();
         //   }

        });

    }

    //column text return functions
    $(document).on("keydown", ".columntext", function (event) {
        console.log("column return key");
        var column = $(this).parents("li");
        var columnindex = $(this).parents("li").index();
        var groupindex = $(this).parents('.groupcontainer').index();
        var columnnumber = columnindex + 1;
        var groupnumber = groupindex + 1;
        if (event.ctrlKey && event.which == 13 && (event.shiftKey == false)) { //Append new story
            event.preventDefault();
            appendNewStory(columnindex, groupindex);
            event.stopPropagation();
        } else if (event.shiftKey && event.which == 13 && $(".group").is(":visible") && (event.ctrlKey == false)) { //Insert new group (if groups visible)
            event.preventDefault();
            insertGroup(groupindex);
            event.stopPropagation();
        } else if (event.which == 13 && (event.shiftKey && event.ctrlKey) == false) { //Insert new column
            event.preventDefault();
            if (columnempty(column)) {
                removecolumn(column)
            }
            else {
                insertNewcolumn(columnindex, groupindex)
            };
        };
    });

    function insertNewcolumn(columnindex, groupindex) {
        var columntextid = guid();
       // var groupindex = groupnumber - 1;
       // var columnindex = columnnumber - 1;
        var htmlData = boxhtml("column", columntextid);
        var columnli = $('.groupcontainer:eq(' + groupindex + ') .columnheader li:eq('+ columnindex + ')');
        //Insert column 
        $(htmlData).insertAfter($(columnli));
        var block = document.getElementById(columntextid);
        $(block).find(".textbox").focus();
        //Update columns array
        updateColumnsObj();

        //Insert new epic
        
        $(".row").each(function (index) {
            var previousepic = ($(this).find('.rowgroups .grouprelease:eq(' + groupindex + ') .cell-flex-container .epic:eq(' + columnindex + ')'));

            $(boxhtml("epic")).insertAfter($(previousepic));
            console.log("row: " + index + " group: " + groupindex + " column: " + columnindex);
            console.log(previousepic);
        });

        console.log("InsertNewcolumn"); 
    };
    function appendNewStory(column, groupindex, rowindex) {

        var storytextid = guid();
     //   var groupindex = groupnumber - 1;
      //  var column = columnnumber - 1;
        var htmlData = boxhtml("story", storytextid);
        if (rowindex == null) rowindex = 0; 
        var stories = $(".rowgroups").eq(rowindex).find('.grouprelease:eq(' + groupindex + ') .epic:eq(' + column + ') .stories');

        $(htmlData).appendTo(stories);
        
        /* Might need this for different table type e.g. grid
        $(".releaserow").each(function (index) {
            $(htmlData).appendTo($(this).find(" .cell:nth-child(" + groupnumber + ") .epic:nth-child(" + columnnumber + ") .stories"));
        });
        */
        var block = document.getElementById(storytextid);
        $(block).find(".textbox").focus();
        //Hide "add story"
     //   $(stories).parent().children('.addStory').hide();

        //update arrays
        updateItemsObj();
    };
    //Delete empty column when focus lost
    $(document).on("focusout", ".columntext", function () {
        var columnli = $(this).parents("li");
        if (columnempty(columnli)) {
            removecolumn(columnli)
        }

    });
    //Check column li has no text or underlying stories
    function columnempty(columnline) {
        var columnstartindex = columnline.index();
        //var groupstartindex = columnline.parent().parent().index();
        var groupstartindex = $(columnline).parents('.groupcontainer').index();
        var columnnumber = columnstartindex + 1;
       // var groupnumber = groupstartindex;

        var columnempty = $(columnline).find(" .column .columntext").is(':empty');
        var storycount = 0;

        //See if any stories exist in any of the releases
        $(".row").each(function (index) {
            
            if (epicEmpty(index, groupstartindex, columnnumber)) {
                storycount = storycount + 0;
            }
            else {
                storycount = storycount + 1;
            }

        });
        if (columnempty && storycount === 0) { return true }
        console.log('column text empty?: ' + columnempty + 'storycount: ' + storycount);
    }
    //Check Epic has no stories
    function epicEmpty(rowindex, groupindex, columnnumber) {
        var empty = false
       // groupnumber = groupnumber
        console.log("Rowindex:" + rowindex + " groupcell:" + groupindex + " columnnumber:" + columnnumber);
        columnindex = columnnumber - 1;
        var columncount = groupcolumncount(groupindex);
       // if (columncount == 0 || $($(".releaserow").eq(rowindex)).find(" .grouprelease:eq(" + groupindex + ") .epic:nth-child(" + columnnumber + ") .stories").is(':empty')) empty = true;
        if (columncount == 0 || $(".row").eq(rowindex).find('.grouprelease:eq(' + groupindex + ') .epic:eq(' + columnindex + ') .stories').is(':empty')) empty = true;
        console.log(empty);
        return empty;
    };
    //Remove column li and underlying epics
    function removecolumn(columnli) {
        var columnindex = columnli.index();
       // var groupindex = columnli.parents().index();
        var groupindex = $('.groupcontainer').index($(columnli).parents('.groupcontainer'));
        var columnnumber = columnindex + 1;
        var groupnumber = groupindex + 1;

        //Remove column
        columnli.remove();
        // Update columns array
        updateColumnsObj();
       // hideaddColumn();

        //Remove epics
        $(".rowgroups").each(function (index) {

          //  $(this).find(" .grouprelease:nth-child(" + groupnumber + ") .epic:nth-child(" + columnnumber + ")").remove();
            $(this).find('.grouprelease:eq(' + groupindex + ') .epic:eq(' + columnindex + ')').remove();
            console.log("epic removed, " + groupindex + ", " + columnindex)
        });
    };
    //Create new column when addColumn clicked
    $(document).on("click", ".addColumn", function () {
        var groupindex = $(this).parents('.groupcontainer').index();
        appendNewcolumn(groupindex);
     //   $(this).hide();
    });

    ///////////// STORY MANAGEMENT /////////////////

    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText

    //Create new story when addStory clicked
    $(document).on("click", ".epic", function () {
        var storytextid = guid();
        var htmlData = boxhtml("story", storytextid);

        if (($(this).find("li .story").length > 0)) {
            $(htmlData).insertAfter($(this).find("li:last-child"));
        }
        else {
            ($(this).children(".stories")).append(htmlData);
        };

        var block = document.getElementById(storytextid);
        $(block).find(".textbox").focus();
    //    $(this).hide();
    });

    //Create new story when enter key pressed
    $(document).on("keydown", ".storytext", function (event) {
        var columnindex = $(this).parents(".epic").index();
        var groupindex = $(this).parents(".grouprelease").index();
        var rowindex = $(this).parents(".row").index();
        var ctrlrowindex = rowindex + 1;
       // var columnnumber = columnindex + 1;
       // var groupnumber = groupindex + 1;

        if (event.shiftKey && event.which == 13 && (event.ctrlKey == false)) { //Insert new column
            event.preventDefault();
            insertNewcolumn(columnindex, groupindex);
            event.stopPropagation();
        } else if (event.ctrlKey && event.which == 13 && (event.shiftKey == false)) { //Append new story to next release
            event.preventDefault();
            appendNewStory(columnindex, groupindex, ctrlrowindex);
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
  //          $(stories).parent().children('.addStory').show();
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

        var groupcount = $(".group").length;
        var iteration = boxhtml("iteration",iterationtextid)
        var newrelease = "<div class='row'><div class='rowheader'>" + iteration + "</div><div class='rowgroups'>";
        var newgroupstart = "<div class='grouprelease'><div class='cell-flex-container'>";
        var newgroupend = "</div></div>";
        var newepic = boxhtml("epic");

        do {
            m = k;
            newrelease = newrelease + newgroupstart;

            var columncount = groupcolumncount(m);
            console.log("group " + k + " has " + columncount + " columnheader");
            if (columncount > 0) {
                do {
                    newrelease = newrelease + newepic;
                    i++;
                }
                while (i < columncount);
            };
            i = 0;
            newrelease = newrelease + newgroupend;
            k++;
        }
        while (k < groupcount);
        newrelease = newrelease + newgroupend + "</div></div>";

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
                $($(".row").eq(rowindex)).remove();
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
        var columnnumber = 1;
        var groupnumber = 1;
        var m;

        var groupcount = $(".group").length;
        
        do {
            m = groupnumber;
            
            var columncount = groupcolumncount(m);

            do {
                if (epicEmpty(rowindex, groupnumber, columnnumber)) {
                    console.log("No story at - Rowindex:" + rowindex + " groupnumber:" + groupnumber + " columnnumber:" + columnnumber);
                    storycount = storycount + 0;
                } else
                {
                    console.log("Story found at - Rowindex:" + rowindex + " groupnumber:" + groupnumber + " columnnumber:" + columnnumber);
                    storycount = storycount + 1
                };
                console.log("Storycount:" + storycount);

                columnnumber++;
            }
            while (columnnumber <= columncount);

            columnnumber = 1;
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
        $("#blockname").val(currentText);
        console.log("Focus on " + blockid);

        //var detailsText = $(this).next().val();
        var detailsText = blockdetailsarray[blockid]; 
        $(".textbox").parent().removeClass('blockselected');
        $(this).parent().addClass('blockselected')
        textbox = $(this).parent().attr("id");
        var bgcolor = $(this).parent().css('background-color');
        $("#blockdetails").html(detailsText);
        $("#blockname").css('background-color', bgcolor); //make title colour the same as the block type
                
    });
    $(document).on("keyup", ".textbox", function (event) {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        $("#blockname").val(currentText);
       // updateBlockTitle(blockid, currentText); 
        
    });
    $(document).on("keyup", "#blockname", function (event) {
        var currentText = $(this).val();
        var blockid = document.getElementById(textbox);
        $(blockid).find(".textbox").text(currentText);
      //  updateBlockTitle(textbox, currentText);
    });
/*
    $(document).on("keyup", ".grouptext", function (event) {
        var currentText = $(this).text();
        var groupnumber = $(this).parent().parent().index();

    });

    $(document).on("keyup", ".columntext", function (event) {
        var currentText = $(this).text();
        var groupnumber = $($(this).parent().parent().parent().parent()).length;
        var groupindex = groupnumber - 1;

    });

*/
    $(document).on("click", "#savedetails", function (event) {
        var detailsText = $("#blockdetails").html();
        updateBlockDetails(textbox, detailsText); 
    });
    $(document).on("click", "#toggledetails", function (event) {
        $("#infobox").toggleClass("hidden");
        $("#toggledetails").toggleClass("hidden");
        hiddenblockdetails = $("#infobox").hasClass("hidden");
    });

    $(document).on("keydown", "#blockdetails", function (event) {

        if (event.shiftKey && event.ctrlKey && event.which == 13) { //back to home block
            var detailsText = $(this).html();
            updateBlockDetails(textbox, detailsText);
            var block = document.getElementById(textbox);
            $(block).find(".textbox").attr('contenteditable', 'true');
            $(block).find(".textbox").focus();
           // if ($("#toggledetails").prop('checked') === false) $("#infobox").toggleClass("hidden");
            
        }
    });

    $(document).on("focusout", "#infobox", function (event) {
        if ($("#toggledetails").prop('checked') === false && $(event.target).closest('#infobox').length == 0) {
            $("#infobox").toggleClass("hidden");
        }
    });
   
 });
 