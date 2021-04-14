

//Mongodb app bWoH5fByzkXQkAj7
//$(function () {$(document).getElementById(files).addEventListener('change', handleFileSelect, false);});

$(function () {
    
     //// GLOBAL VARIABLES /////

    var n, htmlstring, filename, loadfilename, newboardform,
        dialog, textbox, hiddenblockdetails, board, blocktitlearray,
        groupsObj, columnsObj, rowsObj, itemsObj, selectedBlock;
    var boardlistobject = [];
//blockdetailsarray = {};;
    function S4() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };// Generate GUID variables
    function guid() {
        var id = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        return id;
    }; // Generate GUID

    //// PAGE LOAD MANAGEMENT /////
  
    var currentBoard = localStorage.getItem("currentboard");
 
        loadfilename = currentBoard;
    if (loadfilename) {
        loadJSONobjects(loadfilename);
        htmlfromarray(loadfilename);
    };

       var localboardlistobject = localStorage.getItem("boardlist");
    if (localboardlistobject) {
        boardlistobject = JSON.parse(localboardlistobject);
         };// If there is a localStorage boardlist array, retrieve it
    
    function updateboardlistoptions() {
        //board load options
        $('#loadfilename').empty();//empty board options
        $.each(boardlistobject, function (i, value) {
            $('#loadfilename')
                .append($("<option></option>")
                    .attr("value", value)
                    .text(value));
        });//Update board load options
    };

    makeSortable(); //Runs to add sortable fields to the uploaded HTML

    // If there is a localStorage boarddate array, retrieve it

    //// MENU MANAGEMENT /////

    $("#deleteblock-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                // newboard();
                var blockid = document.getElementById(textbox);
                if ($(blockid).hasClass("story")) {
                    deletestory($(blockid).find(".textbox"));
                    console.log("block deleted");
                    $(this).dialog("close");
                };
        },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    }); // Confirm New board creation 
    $("#delete-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                var index = boardlistobject.indexOf(loadfilename);
                boardlistobject.splice(index, 1);
                //delete boardlistobject[loadfilename];
                var boardlist = JSON.stringify(boardlistobject);
                localStorage.setItem("boardlist", boardlist);
                localStorage.removeItem(loadfilename);
                loadfilename = "";
                localStorage.setItem("currentboard", "");
                $("#board").empty();

               // updateboardlistoptions();
                //newboard();
                console.log("map deleted");
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    }); // Confirm delete board
    dialog = $("#save-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                filename = $("#filename").val();
                var fileexists = boardlistobject.indexOf(filename);
                if (fileexists >= 0) {

                } else {
                    newboard(filename);
                    //board["name"] = filename;

                    // createBoardJSON(filename.val());
                    $(this).dialog("close");
                };
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });// Confirm Save board
    dialog = $("#load-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                loadfilename = $("#loadfilename").val();
                loadJSONobjects(loadfilename);
                htmlfromarray(loadfilename);
                localStorage.setItem("currentboard", loadfilename);
                //updateboardlist(loadfilename.val());
                // createBoardJSON(filename.val());
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });// Confirm Load board
    newboardform = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        filename = $("#filename");
        createBoardJSON(filename.val());
    });
    function newboard(boardname) {  // Generate new board
        
        $("#board").empty(); //Clear current board html

        board = { "name": boardname, "columns": {}, "groups": [], "items": {}, "rows": [], "titles": {}, "details": {} };
        groupsObj = [];
        columnsObj = {};
        rowsObj = [];
        itemsObj = {};
        blocktitlearray = {};
        blockdetailsarray = {};

        localStorage.setItem("currentboard", boardname);
        loadfilename = boardname;

        var boardheader = "<div id='boardheader'></div>";
        var groups = "<div id='headingcontainer'>" +
                        "<div class='groupsheading' id='groupsheading'><div class='groupsheadingtext textbox'>Groups</div></div>" +
                        "<div class='columnheaderheading' id='columnheader1'><div class='columnheaderheadingtext textbox'>Activities</div></div>" +
                        "</div><div id='grouparraycontainer'></div>";
        var rowheading = "";
            //"<div id='headingrow'><div class='rowsheading' id='rows1'><div class='rowsheadingtext textbox'>Rows</div></div><div class='itemsheadingtext textbox' id='items1'>Stories</div></div>";

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
        //Add board to boardlist
        updateboardlist(boardname);
        //updateboardlistoptions();
        localStorage.setItem("currentboard", boardname);
        var boarddata = JSON.stringify(board);
        localStorage.setItem(boardname, boarddata);
    };
    function htmlfromarray(filename) {  // Generate board html from locally stored array

        $("#board").empty();

        //var boarddata = localStorage.getItem("boarddata");
        var boarddata = localStorage.getItem(filename);
        //if (boarddata) {
            board = JSON.parse(boarddata);
            // loadfilename = board["name"]
            loadfilename = filename;
       // };// If there is a localStorage boarddate array, retrieve it

        //count groups
       // numgroups = board["groups"].length;
       // numrows = board["rows"].length;

        var boardheader = "<div id='boardheader'></div>";
        var groups = "<div id='headingcontainer'>" +
            "<div class='groupsheading' id='groupsheading'><div class='groupsheadingtext textbox'>Groups</div></div>" +
            "<div class='columnheaderheading' id='columnheader1'><div class='columnheaderheadingtext textbox'>Activities</div></div>" +
            "</div><div id='grouparraycontainer'>";
        //add groups from array
        var i;
        for (i = 0; i < board["groups"].length; ++i) {     

            var j;
            var cols = "";
            var gid = board["groups"][i];
           
            for (j = 0; j < board["columns"][gid].length; ++j) {
                var tit = board["titles"][board["columns"][gid][j]]; //column title from title array
               cols += boxhtml("column", board["columns"][gid][j],tit);                
            };
            //var grouptitle = board["items"].rows[0].groups[i].title;
            var grouptitle = board["titles"][gid]; //group titles from titles array
           groups += boxhtml("group", board["groups"][i],grouptitle,cols);                                 
        };
        groups += "</div > ";
        //

        var rowheading = "";//"<div id='headingrow'><div class='rowsheading' id='rows1'><div class='rowsheadingtext textbox'>Rows</div></div><div class='itemsheadingtext textbox' id='items1'>Stories</div></div>";

        var rows = "<div id='rows'>"
        //iterate rows

        var rowscount = board["rows"].length;
        console.log("Row count: " + rowscount);
        var crownum = 0
        do {
            //add row
            var i = 0;
            var k = 0;
            var m;

            var crowid = board["rows"][crownum];

      /*      if (board["items"].rows[crownum].title) {
                var rowtitle = board["items"].rows[crownum].title
            } else {
                rowtitle = ""
            };
*/
            if (board["titles"][crowid]) {
                rowtitle = board["titles"][crowid]; //row title from titles array
            } else {
                rowtitle = ""
            };
           
            var groupcount = board["groups"].length;
            var iteration = boxhtml("iteration", crowid,rowtitle)
            var newrelease = "<div class='row'><div class='rowheader'>" + iteration + "</div><div class='rowgroups'>";
            var newgroupstart = "<div class='grouprelease'><div class='cell-flex-container'>";
            var newgroupend = "</div></div>";

            do {
                m = k;
                newrelease = newrelease + newgroupstart;
                // column count for group m in the array
                var gid = board["groups"][k];
                var columncount = board["columns"][gid].length;
                console.log("group " + k + " has " + columncount + " columnheader");

                if (columncount > 0) {
                    do {
                        var columnId = board["columns"][gid][i];
                        console.log("Column ID: " + columnId);
                        //create stories
                        if (board["items"][crowid][columnId] != undefined) {
                           // var storiescount = Object.keys(board["items"].rows[crownum].groups[k].columns[i]["stories"]).length;

                            var storiescount = board["items"][crowid][columnId].length;
                            console.log("Story count: " + storiescount);
                            var si = 0;
                            var storieshtml = "";
                            if (storiescount > 0) {
                                do {
                                    var storyid = board["items"][crowid][columnId][si];
                                    //var storytitle = board["items"].rows[crownum].groups[k].columns[i].stories[si].title;
                                    var storytitle = board["titles"][storyid];
                                    var storyblock = boxhtml("story", storyid, storytitle);
                                    var storieshtml = storieshtml + storyblock;
                                    si++;
                                }
                                while (si < storiescount)
                            };
                        } else { var storieshtml = "" };

                        var epic = boxhtml("epic", null, null, storieshtml);
                        newrelease = newrelease + epic;

                        i++;
                    }
                    while (i < columncount);

                };
                i = 0;
                newrelease = newrelease + newgroupend;
                k++;
            }
            while (k < groupcount);
            newrelease = newrelease + "</div></div>";

            //update html string

            rows += newrelease;
            crownum++;
            
            //Update rows array
            // updateRowsObj();
        } while (crownum < rowscount);

        rows += "</div > ";
        
        var addrow = "<div class='newrelease'><div class='addrelease cell'>Add release</div></div>";
        $("#board").prepend(boardheader);
        $("#boardheader").prepend(groups);
        $("#board").append(rowheading);
        $("#board").append(rows);
        $("#board").append(addrow);

        //UPDATE ARRAYS
        
        toggleGroups();
        saveToLocalStorage();
    };//Toggle groups
    $(document).on("click", "#menuGroups", function () {
      //  toggleGroups();
        document.getElementById("menuGroups").checked ? $(".group").show() : $(".group").hide()
        
    });
    function toggleGroups() {
        $("#group").toggle();
    }
    $(document).on("click", "#menuRows", function () {
      //  toggleRows();
        document.getElementById("menuRows").checked ? $(".rowsheadingtext").show() : $(".rowsheadingtext").hide();
        document.getElementById("menuRows").checked ? $(".iteration").show() : $(".iteration").hide();
        document.getElementById("menuRows").checked ? $(".addrelease").show() : $(".addrelease").hide();
    });//Toggle rows
    function toggleRows() {
        $(".rowsheadingtext").toggle();
        $(".iteration").toggle();
        $(".addrelease").toggle();
    };
    $(document).on("click", "#colwidth", function () {

        $("head link#columns").attr("href", function (i, attr) {
            return attr == "singlecolumn.css" ? "twocolumns.css" : (
                attr == "twocolumns.css" ? "threecolumns.css" : (
                    attr == "threecolumns.css" ? "fourcolumns.css" : "singlecolumn.css"))
        });
    }); // Update number of column columns
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
    }; //upload file
    $(document).on("click", "#new", function () { //open new map from html template
        $("#save-confirm").dialog("open");
        //newboard();
       // $("#dialog-confirm").dialog("open");
       // newboard();
       // console.log("new map loaded");
    });
    $(document).on("click", "#deleteboard", function () { //open new map from html template
        $("#delete-confirm").dialog("open");
        // newboard();
        // console.log("new map loaded");
    });
    $(document).on("click", "#loadarray", function () { //open new map from array
        updateboardlistoptions();
        $("#load-confirm").dialog("open");
        //htmlfromarray();
       // console.log("array map loaded");
    });
    $(document).on("click", "#savearray", function () { //open new map from array
        $("#save-confirm").dialog("open");
    });
    $(document).on("focusout", ".textbox", function () {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        updateBlockTitle(blockid, currentText);

        if ($(this).not(':empty')) $(this).attr('contenteditable', 'false');
    });
    $(document).on("focusout", "#blockname", function () {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        updateBlockTitle(blockid, currentText);

        if ($(this).not(':empty')) $(this).attr('contenteditable', 'false');
    });
    $(document).on("click", "#toggledetails", function (event) {
        $("#infobox").toggleClass("hidden");
        $(".blocksubmenu-item").toggleClass("hidden");
        //  $("#toggledetails").toggleClass("hidden");
        $('.arrow-down-close').toggleClass('open');
        $('#board').toggleClass("displayinfo");
        hiddenblockdetails = $("#infobox").hasClass("hidden");
        event.stopPropagation();
    });
    $(document).on("click", "#deleteblock", function () {
        $("#deleteblock-confirm").dialog("open");
          
    });
    $(document).on("click", "#moveright", function () {
        var blockid = document.getElementById(textbox);
        var gid = $(blockid).parents(".groupcontainer").find(".group").attr("id");
        console.log("group: " + gid);
        if ($(blockid).hasClass("column")) {
            var cols = columnsObj[gid];
            var i = cols.indexOf(textbox);
            console.log("index of column: " + i);
            if (columnsObj[gid].length > (i + 1)) {
                console.log("array before: " + cols);
                var j = cols.splice(i, 1).toString();
                console.log("column spliced: " + j);
                var k = i + 1;
                cols.splice(k, 0, j);
                console.log("array after: " + cols);
                columnsObj[gid] = cols;
                board["columns"] = columnsObj;
                saveToLocalStorage();
                htmlfromarray(loadfilename);
               // location.reload();
            }
            
        };

    });

    //JSON OBJECTS//
    function loadJSONobjects(filename) {
    var boarddata = localStorage.getItem(filename);
    if (boarddata) {
        board = JSON.parse(boarddata);
        //board = boardlistobject[filename];
        // filename = board["name"];
        groupsObj = board["groups"];
        columnsObj = board["columns"];
        rowsObj = board["rows"];
        itemsObj = board["items"];
        blocktitlearray = board["titles"];
        blockdetailsarray = board["details"];
    };
    };
    function saveToLocalStorage() { //  SAVE BOARD 
     
        var boardobject = JSON.stringify(board);
        localStorage.setItem(loadfilename, boardobject);
        console.log("board saved");
         
     };
    function updateBlockTitle(blockid, title) {  // Update block title
        //update attributes
        if (title){
        $("#"+ blockid).attr({ 'title': title });
        blocktitlearray[blockid] = title;
        board["titles"] = blocktitlearray;
        console.log("Titles:");
            updateItemsObj();
        };

    };
    function updateBlockDetails(blockid, text) {
        blockdetailsarray[blockid] = text;
        board["details"] = blockdetailsarray;
        console.log("Details:");
      //  console.log(blockdetailsarray);
        saveToLocalStorage();
    };
    function updateboardlist(filename) {       
       // createBoardJSON(filename);
       // boardlistobject[filename] = board;
        boardlistobject.push(filename);

        var boardlist = JSON.stringify(boardlistobject);
        localStorage.setItem("boardlist", boardlist);
        localStorage.setItem(filename, boardlist);
     
    };
    function createBoardJSON(boardname) {
        board["name"] = boardname;
        updateGroupsObj();
        updateColumnsObj();
        updateRowsObj;
        updateItemsObj();
       // saveToLocalStorage();
    };
    function updateGroupsObj() {
        groupsObj = [];
        $(".group").each(function () {
            var id = $(this).attr("id");
            groupsObj.push(id);
        });
        console.log("groups updated:");
        console.log(groupsObj);
  
        board["groups"] = groupsObj;
    };
    function updateColumnsObj() {
        columnsObj = {}
        $(".columnheader").each(function () {
            columngroupObj = [];
            var groupId = $(this).parent().parent().find(".group").attr("id");
            ($(this).find(".column")).each(function () {
                var columnid = $(this).attr("id");
                columngroupObj.push(columnid);
             });
           
            columnsObj[groupId] = columngroupObj;
        });
        console.log("Columns updated:");
        console.log(columnsObj);

        board["columns"] = columnsObj;
  
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
  
    };
    function updateItemsObj() {
        itemsObj = {};
        rowsObj = {};

        var w = 0;
        $(".row").each(function () {
            var iteration = ($(this).find(".iteration"));
            var rowId = $(iteration).attr("id");
            var rowTitle = $(iteration).attr("title");
            rowDetails = {};
            //groupObj = {};
            colObj = {};
            
            var z = 0;
            ($(this).find(".grouprelease")).each(function () {
                epicObj = {};
              //  colObj = {};
               // groupDetails = {};
                
                var groupIndex = $(this).index();
                var groupId = $(".groupcontainer:eq(" + groupIndex + ")").find(".group").attr("id");
                var grouptitle = $(".groupcontainer:eq(" + groupIndex + ")").find(".group").attr("title");
                var y = 0;
                ($(this).find(".epic")).each(function () {
                    var columnindex = $(this).index();
                    colDetails = {};
                    storyObj = [];
                    var x = 0;
                    var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + columnindex + ") .column").attr("id");
                    ($(this).find(".story")).each(function () {
                        storyDetails = {};
                        var itemId = $(this).attr("id");
                        var title = $(this).attr("title");
                        //storyObj.push(itemid);
                       // storyDetails["id"] = itemId;
                      //  storyDetails["title"] = title;
                       // storyObj["stories"] = epicObj;
                       // storyObj["" + itemid + ""] = storyDetails;
                        storyObj.push(itemId);
                        x++;
                    });
                    //item = {}
                    //item[columnId] = storyObj;
                    //epicObj.push(item);
                 //   colDetails["id"] = columnId;
                 //   colDetails["title"] = "";
                  //  colDetails["stories"] = storyObj;
                    colObj["" + columnId + ""] = storyObj //colDetails;
                    y++;

                });
               // groupDetails["id"] = groupId;
              //  groupDetails["title"] = grouptitle;
              //  groupDetails["columns"] = colObj;
              //  groupObj["" + z + ""] = groupDetails;
                z++;
            });
            //item = {}
            //item[rowid] = epicObj;
            //itemsObj.push(item);
            //itemsObj["id"] = rowId;
           // itemsObj["groups"] = groupObj;

           // rowDetails["id"] = rowId;
          //  rowDetails["title"] = rowTitle;
          //  rowDetails["groups"] = groupObj;
          //  rowsObj["" + rowId + ""] = rowDetails;
            itemsObj[rowId] = colObj;
            w++;
        });
      //  itemsObj["id"] = "id";
      //  itemsObj["title"] = "";
      //  itemsObj["rows"] = rowsObj;
        
        console.log("Items updated:");
        console.log(itemsObj);

        board["items"] = itemsObj;

        saveToLocalStorage();
        
       // console.log("board");
        //console.log(board);
    };
    function boxhtml(boxtype, textboxid, title, childitems) {
        var htmlData = "";
        var groupcount
        var groupnum
        if (textboxid == null) { textboxid = guid() };
        if (title == null) { title = "" };
        if (childitems == null) { childitems = "" };
        if (boxtype == "group" || boxtype == "column" || boxtype == "story" || boxtype == "iteration") {
            htmlData = "<div class='" + boxtype + "' id='" + textboxid + "' title='" + title + "'><div class='" + boxtype + "text textbox' contenteditable='true'>" + title +
                "</div ></div > ";
            if (boxtype == "group") {
                htmlData = "<div class='groupcontainer'><div class='groupline'>" + htmlData + "</div>" +
                    "<div class='groupcolumns'><ul class='columnheader'>" + childitems +
                    "</ul ></div ></div > ";
            } else if (boxtype == "column" || boxtype == "story") {
                htmlData = "<li>" + htmlData + "</li>";
                console.log(boxtype + " created (li)");
            } else { };
        } else if (boxtype == "epic") {
            htmlData = "<div class='epic'><ul class='stories'>" + childitems +
                "</ul ></div > ";
        } else { };
        console.log(boxtype + " created");
        return htmlData;
    };  //Generate object html

    ////////// BLOCK MOVEMENT MANAGEMENT ////////////////
        
    $("body").on("DOMNodeInserted", "#board", makeSortable);//Listen out for newly created blocks and make sortable

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
            update: function (event, ui) {
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
                saveToLocalStorage();
            }
        });
    }
    function makereleasessortable() {
        $("#rows").sortable({
            connectWith: "#rows",
            cursor: "move",
            handle: ".iteration",
            cancel: ".epic, .newrelease, .iterationtext",
            stop: function (event, ui){
                saveToLocalStorage();
            },
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
                ui.item.data('originblocktype', "activity");
                var hs = hasStories(ui.item.data('originGroup'), ui.item.data('originIndex'));
                console.log(hs);
                if (hs === true) {
                    ui.item.data('hasStories', true);
                } else {
                    ui.item.data('hasStories', false);
                }

                //columnstartgroupindex = ui.item.parents(".groupcontainer").index();
                ui.placeholder.width('150px');

            },
            sort: function (event, ui) {
               // unhideEpics(event, ui);
               // totalcolumncount();
               // moveEpics(event, ui);
                console.log("Changed order");
                // saveToLocalStorage();

            },
            /* remove: function (event, ui) {
                 if (ui.placeholder.parents().hasClass("columnheader") === false) {
 
                     console.log("Activity removed");
 
                     removeEpics(event, ui);
                     console.log("Changed to story");
                     saveToLocalStorage();
                 };
             },     
           */
            placeholder: {
                element: function (clone, ui) {
                    //   return $('<li class="selected">' + clone[0].innerHTML + '</li>');
                    return $('<li class="selected"></li>');
                },
                update: function () {
                    return;
                }
            },

            over: function (event, ui) {
                console.log("Moved over");
                unhideEpics(event, ui);
            },
            out: function (event, ui) {
                console.log("Moved out");   
            },
            beforeStop: function (event, ui) {
               
            },
            remove: function (event, ui) {
                console.log("Removed");   
            },
        
            ///*      
            change: function (event, ui) {                
                var stayedincolumnheader = ui.placeholder.parents().hasClass("columnheader"); 
                var columnhasstories = ui.item.data('hasStories');
                if (stayedincolumnheader == true) { //move epics in line with column movement
                    moveEpics(event,ui);              
                } else { //if column moved to item
                   // removeEpics(event, ui);    
                   // moveEpics(event, ui, true);
                    if (columnhasstories === "true") {
                       // $(".columnheader").sortable("cancel");
                       // console.log("Has stories - action cancelled");
                      ///  $(".columnheader").sortable("cancel");
                      ///  console.log("Has stories - action cancelled");
                    };

                };               
            },
           // */
            update: function (event, ui) {
                saveToLocalStorage();
            },
            
        });
    }
    function moveEpics(event, ui, cancel) {
        //var columntargetindex = ui.placeholder.index();
      
        var actcount;
        var lastcolumn = false;

        var changeFromGroup = ui.item.data('changeFromGroup')
        var originIndex = ui.item.data('originIndex');
        var changeFromIndex = ui.item.data('changeFromIndex');
        var originGroup = ui.item.data('originGroup');
        if (cancel === true) {
            var currentIndex = originIndex;
            var currentGroup = originGroup;
            console.log("cancel===true");
        } else {
            var currentIndex = ui.placeholder.index();
            var currentGroup = ui.placeholder.parents(".groupcontainer").index();
            console.log("cancel != true");
        };
        if ((originGroup === currentGroup) && (currentIndex > originIndex)) {
            currentIndex -= 1;
            console.log("currentIndex > originIndex");
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
    function hideEpics(event, ui) {
        var originGroup = ui.item.data('originGroup');
        var originIndex = ui.item.data('originIndex');
      
        $(".rowgroups").each(function (index) {
            $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").hide();
        });
       
        console.log("Epics hidden");     
    };
    function unhideEpics(event, ui) {
        var originGroup = ui.item.data('originGroup');
        var originIndex = ui.item.data('originIndex');

        $(".rowgroups").each(function (index) {
            if ($(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").is(":visible")) {
                ;
            } else {
                $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").toggle();
            }


           // $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").show();
        });

        console.log("Epics unhidden");
    };
    function hasStories(originGroup, originIndex) {
        var stories = false
       
        $(".rowgroups").each(function (index) {
            var startepic = $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")");
            if (startepic.find(".stories").is(':empty')) {
              
            }
            else {
                console.log("Has stories");
                stories = true;
            };
            console.log("Stories checked");
                        
        });
        return stories;
        //Only allow to convert a column to a story if it nas no stories
               
    };
    function makeEpicsSortable() {
        $(".stories").sortable({
            cursor: "move",
            cancel: ".storytext",
            connectWith: ".stories, .columnheader",
            start: function (event, ui) {
                    ui.item.data('originblocktype', "story");
                    ui.placeholder.width(ui.item.width());
            },
            over: function(event,ui) {
                hideEpics(event,ui);
            },
            placeholder: {
                element: function () {
                    return $('<li class="selected"></li>');
                },
                update: function () {
                    return;
                }
            },
            remove: function (event, ui) {
                var newepic = boxhtml("epic");
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

                saveToLocalStorage();
                
            }
        });
    };
    function makeeditable() { 
            $(".stories").sortable({ cancel: "" });
            $(".columnheader").sortable({ cancel: "" });
            $("#boardheader").sortable({ cancel: "" });
        $("#rows").sortable({ cancel: "" });

            console.log("make editable");

    };
    $(document).on("click", ".textbox", function (event) {
        console.log("textbox clicked");
        // Set block selected style
        //$(".textbox").parent().removeClass('blockselected');
        //$(this).parent().addClass('blockselected')
        textbox = $(this).parent().attr("id");
      
        // Display infobox if hidden
        $("#infobox").removeClass("hidden");
        $('.arrow-down-close').addClass('open');
        $('#board').addClass("displayinfo");
        $("#infobox").focus();
        // Update infobox data
        
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");

        var bgcolour = $(this).parent().css("background-color");
        $("#infobox-navbar").css("background-color", bgcolour);

        var tcolour = $(this).css("color");
        $("#infobox-navbar").css("color", tcolour);


        $("#blockname").val(currentText);
        console.log("Click on " + blockid);
        $("#blockdetails").html("");
        var detailsText = blockdetailsarray[blockid];
        $("#blockdetails").html(detailsText);
        event.stopPropagation();
    });
    $(document).on("click", ".story", function (event) {
          event.stopPropagation();
    });
    $(document).on("keydown", ".textbox", function (event) {
        if (event.shiftKey && event.ctrlKey && event.which == 13) {
            $("#infobox").removeClass("hidden");
            $('.arrow-down-close').addClass('open');
            $('#board').addClass("displayinfo");
            $('#blockdetails').focus();
            hiddenblockdetails = $("#infobox").hasClass("hidden");
            event.stopPropagation();
        }
    });  //Edit textbox details
    function groupcolumncount(groupindex) {       
        var columncount = $('.groupcontainer:eq(' + groupindex + ') .column').length;
        console.log("Column count: " + columncount);
        return columncount
    };
    function totalcolumncount(groupindex) {
        var totalcolumns = $('#grouparraycontainer .column').length;
        console.log("Total column count: " + totalcolumns);
        return totalcolumns
    };

    ///////////// GROUP MANAGEMENT //////////////////

    $(document).on("keydown", ".grouptext", function (event) {
        console.log("Group return key");
        var group = $(this).parents('.groupcontainer');
        var groupstartindex = $(this).parents('.groupcontainer').index();
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
    });  //Insert new group from group
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
    }; //Insert new group
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

    };//Append new column

    //////////// COLUMN MANAGEMENT /////////////////

    var storedcolumn
    var columnHtml
    var editablecolumn
    var newcolumnText
    var newcolumn
       
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
    }); //column text return functions
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
    $(document).on("focusout", ".columntext", function () {
        var columnli = $(this).parents("li");
        if (columnempty(columnli)) {
            removecolumn(columnli)
        }

    }); //Delete empty column when focus lost
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
    }; //Check column li has no text or underlying stories
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
    }; //Check Epic has no stories
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
    };//Remove column li and underlying epics
    $(document).on("click", ".groupcolumns", function () {
        var groupindex = $(this).parents('.groupcontainer').index();
        appendNewcolumn(groupindex);
     //   $(this).hide();
    });//Create new column when groupcolumns clicked

    $(document).on("click", "#addblock", function () {
      //  var groupindex = $(this).parents('.groupcontainer').index();
       
        var blockid = document.getElementById(textbox);
        if ($(blockid).hasClass("group")) {
            var groupindex = $(blockid).parents('.groupcontainer').index();
            insertGroup(groupindex);
        } else if ($(blockid).hasClass("column")) {
            var groupindex = $(blockid).parents('.groupcontainer').index();
            appendNewcolumn(groupindex);
        }
        
        //   $(this).hide();
    });//Create new column when addColumn clicked
    
    ///////////// STORY MANAGEMENT /////////////////

    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText
        
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
    });//Create new story when addStory clicked
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

    });//Create new story when enter key pressed
    $(document).on("focusout", ".storytext", function () {
        if ($(this).is(':empty')) { deletestory($(this)) }
    });//Remove empty story
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
    }; //Delete story
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
          
    $(document).on("click", ".addrelease", function () {
        addNewRelease();
    });//Add new release 
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
            // column count for group m in the DOM
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

        //update DOM
        $(newrelease).appendTo($("#rows"));

        //Update rows array
        updateRowsObj();

    }; //Add new release 
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
    });//Create new row when enter key pressed
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

    //////// NOTES PANEL MANAGEMENT ///////////

    $(document).on("focus", ".textbox", function (event) {
        $("#blockdetails").html("");
        var currentText = $(this).text();
       
        var blockid = $(this).parent().attr("id");
        selectedBlock = blockid;
        $("#blockname").val(currentText);
        console.log("Focus on " + blockid);

        //var detailsText = $(this).next().val();
        var detailsText = blockdetailsarray[blockid]; 
        $(".textbox").parent().removeClass('blockselected');
        $(this).parent().addClass('blockselected')
        textbox = $(this).parent().attr("id");

        var bgcolor = $(this).parent().css('background-color');
        $("#blockdetails").html(detailsText);
        $("#infobox-navbar").css('background-color', bgcolor); //make title bgcolour the same as the block type

        var tcolor = $(this).parent().css('color');
        $("#infobox-navbar").css('color', tcolor); //make title colour the same as the block type
                
    });//Display description in description panel
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
    $(document).on("focusout", "#blockname", function (event) {
        var currentText = $(this).val();
        updateBlockTitle(textbox, currentText);
        saveToLocalStorage;
    });
    $(document).on("focusout", "#blockdetails", function (event) {
        var detailsText = $(this).html();
        updateBlockDetails(textbox, detailsText); 
        saveToLocalStorage;
    });
   
    $(document).on("keydown", "#blockdetails", function (event) {

        if (event.shiftKey && event.ctrlKey && event.which == 13) { //back to home block
            var detailsText = $(this).html();
           // updateBlockDetails(textbox, detailsText);
            var block = document.getElementById(textbox);
            $(block).find(".textbox").attr('contenteditable', 'true');
            $(block).find(".textbox").focus();
           // if ($("#toggledetails").prop('checked') === false) $("#infobox").toggleClass("hidden");
            
        }
    });
   
 });
 