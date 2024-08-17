

//Mongodb app bWoH5fByzkXQkAj7
//$(function () {$(document).getElementById(files).addEventListener('change', handleFileSelect, false);});

$(function () {

    //// GLOBAL VARIABLES /////

    var n, htmlstring, boardid, currentBoardID, newboardform,
        dialog, textbox, hiddenblockdetails, board, blocktitlearray,
        groupsObj, groupColumnsObj, groupColumnsArray, columnsArray, rowsObj, itemsObj, itemsArray, blockdetailsarray, selectedBlock, sleft, stop,
        typeItemsObj, statusItemsObj, subsetsObj, settingsBoard, relationshipArray, boardlistobject, boardTypeBoard,
        boardTypeObject, boardid, subsetBoard, subsetBoardData, gro, columnsVisible, columnGroupsVisible, rowsVisible;
       
    //Build status list from status board items
  
    function S4() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };// Generate GUID variables
    function guid() {
        var id = (S4() + S4() + "-" + S4() + "-4" + S4().substring(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        return id;
    }; // Generate GUID

///////////////////////////////////// PAGE LOAD MANAGEMENT ////////////////////


///////////// Get current board ///       
    
    var currentBoardID = localStorage.getItem("currentboard");
    console.log("Current board: " + currentBoardID);
    if (currentBoardID) {
        loadJSONobjects(currentBoardID);
    };
   
    ///currentBoardID = currentBoardID; ////need to deprecate this

    //var jsonstorageboardlistobject = getboardlist();
    var getjsonboardlist = function (bin) {
        return new Promise(function(resolve, reject){
            var jsonstring;
            const request = new XMLHttpRequest();
            request.open("GET", "https://json.extendsclass.com/bin/" + bin, true);
            request.responseType = "json";

            // disable browser caching in request header
            request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
            request.setRequestHeader('Pragma', 'no-cache');

            request.setRequestHeader("Security-key", "random-brick-diamond");
            request.onreadystatechange = () => {
                   // In local files, status is 0 upon success in Mozilla Firefox
                  if (request.readyState === XMLHttpRequest.DONE) {
                      const status = request.status;
                      if (status === 0 || (status >= 200 && status < 400)) {
                      // The request has been completed successfully
                      jsonstring = request.response;
                      jsonstring = JSON.stringify(jsonstring);
                      console.log("Get boardlist json bin, " + bin + " ="+ jsonstring);
                      resolve(jsonstring);
                      } else {
                      // Oh no! There has been an error with the request!
                      reject(Error("json retrieve error " + status));
                      }
                  }
              };
              request.send();
              
          });
        };
        // Retrieve board list from storage bin ///////

        getjsonboardlist("baec30811a60").then(function(result) {
            console.log("Board list retrieved: " + result); // "Stuff worked!"
            boardlistobject = JSON.parse(result).data;
            var boardlist = JSON.stringify(boardlistobject);
            localStorage.setItem("boardlist", boardlist);
            //console.log("Board list object retrieved: " + boardlistobject);
          }, function(err) {
            console.log(err); // Error: "It broke"
            boardlistobject = [];
          });

      
            /*
                console.log("Board list retrieved: " + jsonstorageboardlistobject);
                if (jsonstorageboardlistobject) {
                    boardlistobject = JSON.parse(jsonstorageboardlistobject);
                    console.log("Board list object retrieved: " + boardlistobject);
                } else { boardlistobject = [] };// If there is a jsonStorage boardlist array, retrieve it
            */
//////////////// get boardtype from json storage /////////////////////////

var getjsonboardtypes= function (bin) {
    return new Promise(function(resolve, reject){
          var jsonstring;
          const request = new XMLHttpRequest();
          request.open("GET", "https://json.extendsclass.com/bin/" + bin, true);
          request.responseType = "json";
          
            // disable browser caching in request header
            request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
            request.setRequestHeader('Pragma', 'no-cache');

          request.setRequestHeader("Security-key", "random-brick-diamond");
          request.onreadystatechange = () => {
               // In local files, status is 0 upon success in Mozilla Firefox
              if (request.readyState === XMLHttpRequest.DONE) {
                  const status = request.status;
                  if (status === 0 || (status >= 200 && status < 400)) {
                  // The request has been completed successfully
                  jsonstring = request.response;
                  jsonstring = JSON.stringify(jsonstring);
                  console.log("Get board type json bin, " + bin + " ="+ jsonstring);
                
                  resolve(jsonstring);
                  } else {
                  // Oh no! There has been an error with the request!
                  reject(Error("json retrieve error " + status));
                  }
              }
          };
          request.send();
          
      });
    };
    // Retrieve board list from storage bin ///////

    getjsonboardtypes("9fa536bdf1a5").then(function(result) {
        console.log("Board types retrieved: " + result); // "Stuff worked!"
        var localboardtypeobject = JSON.parse(result).data;
        localboardtypeobject = JSON.stringify(localboardtypeobject);
       

       // var localboardtypeobject = localStorage.getItem("BoardTypes");
        if (localboardtypeobject) {
            boardTypeObject = {};
            boardTypeBoard = JSON.parse(localboardtypeobject);
            var gid = boardTypeBoard["groups"][0];
                for (j = 0; j < boardTypeBoard["groupColumns"][gid].length; ++j) {
                    var boardTypeVisibilityObject = [];

                var typename = boardTypeBoard["titles"][boardTypeBoard["groupColumns"][gid][j]]; //column title from title array
                console.log(typename);
                //var visibilitytext = boardTypeBoard["titles"][boardTypeBoard["groupColumns"][gid][j]]; //column title from title array
                var cid = [boardTypeBoard["groupColumns"][gid][j]];
                
                for (k = 0; k < boardTypeBoard["rows"].length; ++k) {
                    var rid = boardTypeBoard["rows"][k];
                var vis = boardTypeBoard["titles"][boardTypeBoard["items"][rid][cid]]; // values from rows
                boardTypeVisibilityObject.push(vis);
                };
                    //boardTypeObject.push(tit);
                    boardTypeObject[typename] = boardTypeVisibilityObject;
            };
            console.log("Boardtype object: " + JSON.stringify(boardTypeObject))
        } else { boardTypeObject = [] };// If there is a localStorage boardtype board, retrieve it



      }, function(err) {
        console.log(err); // Error: "It broke"
        boardlistobject = [];
      });



    // If there is a localStorage boarddate array, retrieve it

         

            makeSortable(); //Runs to add sortable fields to the uploaded HTML

 //////////////////////////////////// PAGE LOAD MANAGEMENT OVER  ////////////////////////    

            

    function updateboardlistoptions() {
        //board load options
        $('#loadfilename').empty();//empty board options
        $.each(boardlistobject, function (key, value) {
            $('#loadfilename')
                .append($("<option value=" + value.id + ">" + value.name + "</option>")
                    //.attr("value", key.id)
                    //.text(value.name));
                );
        });//Update board load options
        console.log("Boardlist options updated: " + JSON.stringify(boardlistobject))
    };

   

    ///////////////////////// MENU MANAGEMENT ///////////////////////////////////////////

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
                } else if ($(blockid).hasClass("column")) {
                    var column = $(blockid).parents("li")
                    if (columnempty(column)) {
                        removecolumn(column);
                    }};
                    //saveToLocalStorage(board);
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    }); // Confirm delete block
    $("#delete-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                var index = boardlistobject.indexOf(currentBoardID);
                boardlistobject.splice(index, 1);
                //delete boardlistobject[currentBoardID];
                var boardlist = JSON.stringify(boardlistobject);
                localStorage.setItem("boardlist", boardlist);
                localStorage.removeItem(currentBoardID);
                currentBoardID = "";
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
                var boardname = $("#filename").val();
             //   var fileexists = boardlistobject.indexOf(boardid);
             //   if (fileexists >= 0) {

             //   } else {
                    /// settings board
                    settingsBoard = $("#settingsBoardNew").val();
                    var boardType = $("#boardType").val();
                   
                    newboard(boardname, settingsBoard, boardType);
                    //board["name"] = boardid;
                  
                    // createBoardJSON(boardid.val());
                    $(this).dialog("close");

                   
              //  };
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });// Confirm New board
    dialog = $("#load-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                currentBoardID = $("#loadfilename").val();
                loadJSONobjects(currentBoardID);
                
                localStorage.setItem("currentboard", currentBoardID);
                
                //updateboardlist(currentBoardID.val());
                // createBoardJSON(boardid.val());
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });// Confirm Load board
    dialog = $("#boardSettings").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                settingsBoard = $("#settingsBoard").val();
                board["settings"] = settingsBoard;
                saveToLocalStorage(board);
                console.log("Settings board = " + settingsBoard);
                var patchstr = '{"op": "replace","path": "/data/settings", "value": "' + settingsBoard + '" }';
                console.log(patchstr);
                patchJSON(currentBoardID, patchstr);
               // loadJSONobjects(currentBoardID);
               // htmlfromarray(currentBoardID);
               // localStorage.setItem("currentboard", currentBoardID);
                //updateboardlist(currentBoardID.val());
                // createBoardJSON(boardid.val());
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });// Confirm board settings

    newboardform = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        boardid = $("#boardid");
        createBoardJSON(boardid.val());
    });
    function newboard(boardname, settings, boardType) {  // Generate new board

        columnsVisible = (boardTypeObject[boardType][0].toLowerCase() === 'true');
        columnGroupsVisible = (boardTypeObject[boardType][1].toLowerCase() === 'true');
        rowsVisible = (boardTypeObject[boardType][2].toLowerCase() === 'true');
        console.log("Visibility: " + columnsVisible, columnGroupsVisible, rowsVisible)
        var groupId = guid();
        var groupColumnId = guid();
        var groupColumnsStr = '"' + groupId + '":["' + groupColumnId + '"]';
        var rowId = guid();
      //  board = '{"name":"' + boardname + '","columns":[],"groupColumns":{'+ groupColumnsStr +'},"groups":["' + groupId + '"],"items":{},"rows":["' + rowId + '"],"titles":{},"details":{},"itemtypes":{},"subsets":{},"settings":"' + settings + '","columnsVisible":'+ columnsVisible +',"columnGroupsVisible":'+ columnGroupsVisible +',"rowsVisible":'+ rowsVisible +'}'
        board = '{"name":"' + boardname + '","columns":[],"groupColumns":{'+ groupColumnsStr +'},"groups":["' + groupId + '"],"items":{},"rows":["' + rowId + '"],"details":{},"itemtypes":{},"subsets":{},"settings":"' + settings + '","columnsVisible":'+ columnsVisible +',"columnGroupsVisible":'+ columnGroupsVisible +',"rowsVisible":'+ rowsVisible +'}'

        //var boardobject = JSON.parse(board);
        createJSON(boardname, board);
          
        groupsObj = [];
        groupColumnsObj = {};
        columnsArray = [];
        groupColumnsArray = [];
        rowsObj = [];
        itemsObj = {};
        itemsArray = [];
        blocktitlearray = {};
        blockdetailsarray = {};
        typeItemsObj = {};
        statusItemsObj = {};
        subsetsObj = {};
              
        $("#boardname").text(boardname);


    }; //Generate a new board

    function htmlfromarray(boardarray) {  // Generate board html from locally stored array
        
        console.log("Board data for building HTML: " + boardarray);
        $("#board").empty();
        board = boardarray;
        if(board["titles"] === undefined){
            board["titles"] = {};
        };
       
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

            for (j = 0; j < board["groupColumns"][gid].length; ++j) {
                var tit = board["titles"][board["groupColumns"][gid][j]]; //column title from title array
                cols += boxhtml("column", board["groupColumns"][gid][j], tit);
            };
            //var grouptitle = board["items"].rows[0].groups[i].title;
            var grouptitle = board["titles"][gid]; //group titles from titles array
            groups += boxhtml("group", board["groups"][i], grouptitle, cols);
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
            var iteration = boxhtml("iteration", crowid, rowtitle)
            var newrelease = "<div class='row'><div class='rowheader'>" + iteration + "</div><div class='rowgroups'>";
            var newgroupstart = "<div class='grouprelease'><div class='cell-flex-container'>";
            var newgroupend = "</div></div>";

            do {
                m = k;
                newrelease = newrelease + newgroupstart;
                // column count for group m in the array
                var gid = board["groups"][k];
                var columncount = board["groupColumns"][gid].length;
                console.log("group " + k + " has " + columncount + " columnheader");

                if (columncount > 0) {
                    do {
                        var columnId = board["groupColumns"][gid][i];
                        console.log("Column ID: " + columnId);
                        //create stories
                        if (board["items"][crowid] !== undefined && board["items"][crowid][columnId] !== undefined) {
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
                                   // var type = board["itemtypes"][storyid];
                                   // var status = board["statustypes"][storyid];
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

        boardRowsvisibility(board["rowsVisible"]);
        boardColumnsvisibility(board["columnsVisible"]);
        boardColumnGroupsvisibility(board["columnGroupsVisible"]);

        toggleGroups();
        saveToLocalStorage(board);

        makeSortable(); //Make all objects sortable
    };//Toggle groups

    $(document).on("click", "#menuGroups", function () {
        //  toggleGroups();
        document.getElementById("menuGroups").checked ? $(".group").show() : $(".group").hide()

    });

    //Board settings
    function toggleGroups() {
        $("#group").toggle();
    }
       
   //Toggle rows */
    function toggleRows() {
        $(".rowsheadingtext").toggle();
        $(".iteration").toggle();
        $(".addrelease").toggle();
    };
    function boardRowsHidden() {
        document.getElementById("boardType") == "List" ? $(".rowsheadingtext").hide() : $(".rowsheadingtext").show();
        document.getElementById("boardType") == "List" ? $(".iteration").hide() : $(".iteration").show();
        document.getElementById("boardType") == "List" ? $(".addrelease").hide() : $(".addrelease").show();

    };
    function boardRowsvisibility(visible) {
        console.log("Setting row visibility: " + visible);
        visible == false ? $(".rowsheadingtext").hide() : $(".rowsheadingtext").show();
        visible == false ? $(".iteration").hide() : $(".iteration").show();
        visible == false ? $(".addrelease").hide() : $(".addrelease").show();

    };
    function boardColumnsvisibility(visible) {
        console.log("Setting column visibility: " + visible);
        visible == false ? $(".groupline").hide() : $(".groupline").show();
        visible == false ? $(".group").hide() : $(".group").show();
    };
    function boardColumnGroupsvisibility(visible) {
        console.log("Setting column groups visibility: " + visible);
        visible == false ? $(".groupcolumns").hide() : $(".groupcolumns").show();
        visible == false ? $(".columnheader").hide() : $(".columnheader").show();
       
    };
    $(document).on("click", "#colwidth", function () {

        $("head link#columns").attr("href", function (i, attr) {
            return attr == "singlecolumn.css" ? "twocolumns.css" : (
                attr == "twocolumns.css" ? "threecolumns.css" : (
                    attr == "threecolumns.css" ? "fourcolumns.css" : (
                        attr ==  "fourcolumns.css" ? "transposed.css" : "singlecolumn.css")))
        });
    }); // Update number of columns

    $(document).on("click", "#boardSettingsbutton", function () { //open new map from array
        updateSettingsBoardList();
        if (settingsBoard) {
            $("#settingsBoard").val(settingsBoard);
        } else { $("#settingsBoard").val(null) };
        $("#boardSettings").dialog("open");
        // console.log("array map loaded");
    });
    function updateSettingsBoardList() {
        //board load options
        $('#settingsBoard').empty();//empty board options
        $('#settingsBoardNew').empty();//empty board options

        $.each(boardlistobject, function (key, value) {
            $('#settingsBoard')
                .append($("<option value=" + value.id + ">" + value.name + "</option>"));
            $('#settingsBoardNew')
                .append($("<option value=" + value.id + ">" + value.name + "</option>"));

        });//Update board load options
        
    }
    function updateBoardTypeList() {
        //board load options
        $('#boardType').empty();//empty board options
        $.each(boardTypeObject, function (i, value) {
            $('#boardType')
                .append($("<option></option>")
                    .attr("value", i)
                    .text(i));
        });//Update board load options
    }
       
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

    $(document).on("click", "#toggleBoardMenu", function (event) {
        $("#boardMenu").toggle();
        $("#boardname").toggle();
    });

////////////////////Board menu actions/////////////////

    $(document).on("click", "#new", function () { //open new map from html template
        updateSettingsBoardList();
        updateBoardTypeList();
        $("#settingsBoardNew").val(null);
        $("#boardType").val(null);
        $("#save-confirm").dialog("open");

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
    $(document).on("click", "#savearray", function () { //save board to json storage
       
       //Function disabled till offline functionality re-enabled
        //const jsondata = JSON.stringify(board); 
       //updateJSON(currentBoardID, jsondata); 
       console.log("Save clicked");
    });
    
    ////////////////////////Update block details when editing from the infobox ////////////////
    $(document).on("focusout", ".textbox", function () {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        updateBlockTitle(blockid, currentText);
        if ($(this).not(':empty')) $(this).attr('contenteditable', 'false');
        //saveToLocalStorage(board);
       
    });
    $(document).on("focusout", "#blockname", function () {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        updateBlockTitle(blockid, currentText);
        if ($(this).not(':empty')) $(this).attr('contenteditable', 'false');
        //saveToLocalStorage(board);
    });
    
 /////////////////////////Block menu actions////////////////////

    $(document).on("click", "#toggledetails", function (event) {
        $("#infobox").toggleClass("full");
        $("#manageblock").toggle();
        $("#blockmenu").toggle();
        $("#subsets").toggle();
        //  $("#toggledetails").toggleClass("hidden");
        $('.arrow-down-close').toggleClass('open');
        $('#board').toggleClass("displayinfo");
        hiddenblockdetails = $("#infobox").hasClass("full");
        event.stopPropagation();
    });
    $(document).on("click", "#toggleBlockmenu", function (event) {
        $("#infobox-navbar").toggle();
    });
    $(document).on("click", "#deleteblock", function () {
        $("#deleteblock-confirm").dialog("open");

    });
 ////////////////////Move board item actions//////////////////////////

    $(document).on("click", "#moveright", function () {
        sleft = $("#board").scrollLeft();
        stop = $("#board").scrollTop();
        var blockid = document.getElementById(textbox);
        var gid = $(blockid).parents(".groupcontainer").find(".group").attr("id");
        console.log("group: " + gid);
        var gind = groupsObj.indexOf(gid);
        if ($(blockid).hasClass("column") ) {
            var cols = groupColumnsObj[gid];
            var i = cols.indexOf(textbox);
            console.log("index of column: " + i);
            console.log("array before: " + cols);
            
            if (groupColumnsObj[gid].length > (i + 1) || (groupColumnsObj[gid].length === (i + 1) && groupsObj[gind + 1])) {
                if (groupColumnsObj[gid].length > (i + 1)) {
                    var j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                    var k = i + 1;

                } else if (groupColumnsObj[gid].length === (i + 1) && groupsObj[gind + 1]) {
                    var j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                    var k = 0;
                    groupColumnsObj[gid] = cols;

                    gid = groupsObj[gind + 1];
                    cols = groupColumnsObj[gid];
                    //  cols.splice(k, 0, j);
                    //   console.log("array after: " + cols);
                    //   columnsObj[gid] = cols;
                }
                cols.splice(k, 0, j);
                console.log("array after: " + cols);
                groupColumnsObj[gid] = cols;
                board["groupColumns"] = groupColumnsObj;
                columnsArray = Object.values(groupColumnsObj).flat();
                board["columns"] = columnsArray;
                groupColumnsArray = Object.values(groupColumnsObj);
                board["groupColumnsArray"] = groupColumnsArray;
                saveToLocalStorage(board);
                htmlfromarray(board);
                // location.reload();
            };

        };
        
        $("#board").scrollLeft(sleft);
        $("#board").scrollTop(stop);
    });
    $(document).on("click", "#movedown", function () {
        var blockid = document.getElementById(textbox);
        sleft = $("#board").scrollLeft();
        stop = $("#board").scrollTop();

        var rowscount = rowsObj.length;
        var rowid = $(blockid).parents(".row").find(".iteration").attr("id");
        console.log("rowid: " + rowid);
        console.log("rowsobj: " + rowsObj);
        var rowindex = rowsObj.indexOf(rowid);
        console.log("row: " + rowindex);
        if ((rowindex +1) < rowscount) {
            var rowdownid = rowsObj[rowindex + 1]
            console.log("row: " + rowdownid);
            if ($(blockid).hasClass("story")) {
                var gindex = $(blockid).parents(".grouprelease").index();
                var gid = groupsObj[gindex];
                console.log("group index: " + gindex);
                var colindex = $(blockid).parents(".epic").index();
                var colid = groupColumnsObj[gid][colindex];
                var stories = itemsObj[rowid][colid];
                var i = stories.indexOf(textbox);
                console.log("index of story: " + i);
                
                //    console.log("array before: " + cols);
                    var j = stories.splice(i, 1).toString();
                    console.log("story spliced: " + j);
                // carry on from here to splice a story to the correct epic
                var trowid = rowsObj[rowindex+1];
                var tstories = itemsObj[trowid][colid];
                    tstories.splice(0, 0, j);
                  //  console.log("array after: " + cols);
                    //columnsObj[gid] = tstories;
                board["items"] = itemsObj;
                saveToLocalStorage(board);
                htmlfromarray(board);

                var blockid = document.getElementById(textbox);
                blockid.scrollIntoView(false);
                    // location.reload();
                
            };
            if ($(blockid).hasClass("iteration")) {
                var cols = rowsObj;
                var i = cols.indexOf(textbox);
                console.log("index of row: " + i);
                if (rowsObj.length > (i + 1)) {
                    console.log("array before: " + cols);
                    var j = cols.splice(i, 1).toString();
                    console.log("row spliced: " + j);
                    var k = i + 1;
                    cols.splice(k, 0, j);
                    console.log("array after: " + cols);
                    rowsObj = cols;
                    board["rows"] = rowsObj;
                    saveToLocalStorage(board);
                    htmlfromarray(board);
                    // location.reload();
                }

                var blockid = document.getElementById(textbox);
                blockid.scrollIntoView(true);
                // location.reload();

            };
        }
        $("#board").scrollLeft(sleft);
        $("#board").scrollTop(stop);
    });
    $(document).on("click", "#moveup", function () {
        var blockid = document.getElementById(textbox);
        
        sleft = $("#board").scrollLeft();
        stop = $("#board").scrollTop();
        console.log("scroll: " + sleft + ", " + stop);

        var rowscount = rowsObj.length;
        var rowid = $(blockid).parents(".row").find(".iteration").attr("id");
        console.log("rowid: " + rowid);
        console.log("rowsobj: " + rowsObj);
        var rowindex = rowsObj.indexOf(rowid);
        console.log("row: " + rowindex);
        
          //  var rowdownid = rowsObj[rowindex - 1]
           // console.log("row: " + rowdownid);
            if ($(blockid).hasClass("story")) {
                var gindex = $(blockid).parents(".grouprelease").index();
                var gid = groupsObj[gindex];
                console.log("group index: " + gindex);
                var colindex = $(blockid).parents(".epic").index();
                var colid = groupColumnsObj[gid][colindex];
                var stories = itemsObj[rowid][colid];
                var i = stories.indexOf(textbox);
                console.log("index of story: " + i);
                if ((i === 0 && rowsObj[rowindex - 1]) || i > 0) {
                    //    console.log("array before: " + cols);
                    var j = stories.splice(i, 1).toString();
                    console.log("story spliced: " + j);
                    // carry on from here to splice a story to the correct epic
                    if (i === 0) {
                        var trowid = rowsObj[rowindex - 1];
                        var tstories = itemsObj[trowid][colid];
                        tstories.push(j);
                    } else {
                        stories.splice(i - 1, 0, j)
                    };
                    // tstories.splice(0, 0, j);
                    //  console.log("array after: " + cols);
                    //columnsObj[gid] = tstories;
                    board["items"] = itemsObj;
                    saveToLocalStorage(board);
                    htmlfromarray(board);

                    blockid = document.getElementById(textbox);
                    
                    //blockid.scrollIntoView(true);
                    // location.reload();
                }
            };
            if ($(blockid).hasClass("iteration") && rowindex > 0) {
                var cols = rowsObj;
                var i = cols.indexOf(textbox);
                console.log("index of row: " + i);
                if (i > 0) {
                    console.log("array before: " + cols);
                    var j = cols.splice(i, 1).toString();
                    console.log("row spliced: " + j);
                    var k = i - 1;
                    cols.splice(k, 0, j);
                    console.log("array after: " + cols);
                    rowsObj = cols;
                    board["rows"] = rowsObj;
                    saveToLocalStorage(board);
                    htmlfromarray(board);

                    blockid = document.getElementById(textbox);
               
                    // location.reload();

                }

            };
        $("#board").scrollLeft(sleft);
        $("#board").scrollTop(stop);
        console.log("scroll: " + sleft + ", " + stop);  
    });
    $(document).on("click", "#moveleft", function () {
        var blockid = document.getElementById(textbox);

        sleft = $("#board").scrollLeft();
        stop = $("#board").scrollTop();

        var gid = $(blockid).parents(".groupcontainer").find(".group").attr("id");
        console.log("group: " + gid);
        var gind = groupsObj.indexOf(gid);
        if ($(blockid).hasClass("column")) {
            var cols = groupColumnsObj[gid];
            var i = cols.indexOf(textbox);
            console.log("index of column: " + i);
            console.log("array before: " + cols);

            if (i > 0 || (i === 0 && groupsObj[gind - 1])) {
                if (i > 0) {
                    var j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                    var k = i - 1;
                    cols.splice(k, 0, j);

                } else if (i === 0 && groupsObj[gind - 1]) {
                    var j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                               
                    groupColumnsObj[gid] = cols;

                    gid = groupsObj[gind - 1];

                    cols = groupColumnsObj[gid];

                    cols.push(j);
                }
               
                console.log("array after: " + cols);
                groupColumnsObj[gid] = cols;
                board["groupColumns"] = groupColumnsObj;

                columnsArray = Object.values(groupColumnsObj).flat();
                board["columns"] = columnsArray;

                groupColumnsArray = Object.values(groupColumnsObj);
                board["groupColumnsArray"] = groupColumnsArray;

                saveToLocalStorage(board);
                htmlfromarray(board);

            };

        };
        $("#board").scrollLeft(sleft);
        $("#board").scrollTop(stop);
        console.log("scroll: " + sleft + ", " + stop);
    });
    
 
  ////////////////////////////JSON OBJECTS////////////////////

    function loadJSONobjects(boardid) {
        console.log("Load boardid: " + boardid);
        var boarddata; //= localStorage.getItem(boardid);

        //Get boarddata from jsonstorage instead
        ///*
        var retrievebin = function (bin) {
            return new Promise(function(resolve, reject){
                //  function getboardlist() {
              var jsonstring;
              //boardlistobject = [];
              const request = new XMLHttpRequest();
              request.open("GET", "https://json.extendsclass.com/bin/" + bin, true);
              request.responseType = "json";
              
            // disable browser caching in request header
            request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
            request.setRequestHeader('Pragma', 'no-cache');

              request.setRequestHeader("Security-key", "random-brick-diamond");
              request.onreadystatechange = () => {
                   // In local files, status is 0 upon success in Mozilla Firefox
                  if (request.readyState === XMLHttpRequest.DONE) {
                      const status = request.status;
                      if (status === 0 || (status >= 200 && status < 400)) {
                      // The request has been completed successfully
                      jsonstring = request.response;
                      jsonstring = JSON.stringify(jsonstring);
                      //alert("Bin: " + bin + ", JSON: " +jsonstring);
                      console.log("Get json bin, " + bin + " = "+ jsonstring);
                      resolve(jsonstring);
                      } else {
                      
                      reject(Error("json retrieve error " + status));
                      }
                  }
              };
              request.send();
              
          });
        };


        retrievebin(boardid).then(function(result) {
            
            // Clear subsets and hide infobox
            $("#infobox").toggleClass("hide");
            $("#subsetsfieldset").html("");

            console.log("Boarddata retrieved: " + result); // "Stuff worked!"
            boarddata = JSON.parse(result);
            boarddata = boarddata.data;
            board = boarddata;
  
               
                groupsObj = board["groups"];
                groupColumnsObj = board["groupColumns"];
                rowsObj = board["rows"];
                itemsObj = board["items"];
                blocktitlearray = board["titles"];
                blockdetailsarray = board["details"];
                if (board["subsets"]) { subsetsObj = board["subsets"] } else {
                    subsetsObj = {};
                };
                if (board["settings"] !== "null" ) { 
                    settingsBoard = board["settings"];
                    getsettingsboarddata(board["settings"]);
             };
    
                $("#boardname").text(board["name"]);

                saveToLocalStorage(board);
                htmlfromarray(board);
                              

                /// Show/hide board sections
                

                          
        }, function(err) {
            console.log(err); // Error: "It broke"
            boarddata = [];
        });
        //*/

      
    };

  ////////////////////////////////////SUBSETS/////////////////////////////////

    //var boardlistobject = [];
   // /*
    
   function getsettingsboarddata(settingsboardid){
        

        var getsettingsboard = function (bin) {
            return new Promise(function(resolve, reject){
                //  function getboardlist() {
                var jsonstring;
                //boardlistobject = [];
                const request = new XMLHttpRequest();
                request.open("GET", "https://json.extendsclass.com/bin/" + bin, true);
                request.responseType = "json";

            // disable browser caching in request header
            request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
            request.setRequestHeader('Pragma', 'no-cache');

                request.setRequestHeader("Security-key", "random-brick-diamond");
                request.onreadystatechange = () => {
                    // In local files, status is 0 upon success in Mozilla Firefox
                    if (request.readyState === XMLHttpRequest.DONE) {
                        const status = request.status;
                        if (status === 0 || (status >= 200 && status < 400)) {
                        // The request has been completed successfully
                        jsonstring = request.response;
                        jsonstring = JSON.stringify(jsonstring);
                        //alert("Bin: " + bin + ", JSON: " +jsonstring);
                        console.log("Get json bin, " + bin + " ="+ jsonstring);
                        resolve(jsonstring);
                        } else {
                        
                        reject(Error("json retrieve error " + status));
                        }
                    }
                };
                request.send();
            
            });
        };


        getsettingsboard(settingsboardid).then(function(result) 
        {
            console.log("Serttings Boarddata retrieved: " + result); // "Stuff worked!"
          
                    subsetBoard = JSON.parse(result);
            
                    console.log("Settings board: " + subsetBoard);
                    if (subsetBoard) {
                    var subsetlist = [];
                    subsetBoardData = subsetBoard.data;
                    gro = subsetBoardData["groups"][0];
                    for (i = 0; i < subsetBoardData["groupColumns"][gro].length; i++) {
                        var subsetvalues = [];
                        var row = subsetBoardData["rows"][0];
            
                        var col = subsetBoardData["groupColumns"][gro][i];
                        var boarditemstatuskeys = subsetBoardData["items"][row][col];
                        var label = subsetBoardData["titles"][subsetBoardData["groupColumns"][gro][i]];
                        //  $("label[for='subset" + i + "']").html(label);
                        console.log("row:" + row + ",col," + col + ", " + boarditemstatuskeys);
            
                        boarditemstatuskeys.forEach(setItemStatus)
                        function setItemStatus(item) {
                            subsetvalues.push(item);
                            console.log("set subset value:" + item + "," + subsetBoardData["titles"][item]);
                        };
                        subsetlist.push(subsetvalues);
            
                        if (subsetsObj[col]) { } else {
                            
                            subsetsObj[col] = {};
                        }; //create board object if it does not exist
            
                        //var listname = "subset" + i;
                        var listname = subsetBoardData["groupColumns"][gro][i]
                        //  <label for="subset1">Type</label>
                        //     <select id="subset1"></select>
                        var subsetSelect = document.createElement('select');
                        subsetSelect.id = listname;
                        subsetSelect.name = label;
            
                        var subsetLabel = document.createElement('label');
                        subsetLabel.setAttribute("for", subsetSelect);
                        subsetLabel.innerHTML = label;
            
                        $("#subsetsfieldset").append(subsetLabel);
                        $("#subsetsfieldset").append(subsetSelect);
            
                        subsetSelect.onchange = subsetChange; //add onchange event
            
                        console.log(subsetLabel + "," + subsetSelect);
            
                        $("#" + listname).empty();//empty board options
                        $.each(subsetlist[i], function (j, value) {
                            var text = subsetBoardData["titles"][value];
                            $("#" + listname)
                                .append($("<option></option>")
                                    .attr("value", value)
                                    .text(text));
                        });//Update subset list options
            
                    };
                };// If there is a localStorage boardlist array, retrieve it
                 //  */
                
                
                            
        }, function(err) {
                console.log(err); // Error: "It broke"
                boarddata = [];
                });
             //*/

  
    };

    
  
    function subsetChange() {

        console.log("Subset " + this.id + " changed to:" + this.value);
        updatesubsetObj(textbox, this.value, this.id);
        // updateTypeItemsObj(textbox, this.value);

    };
    function updatesubsets() {
        console.log("Update subsets from " + subsetBoardData["name"]);
        //fetch block subsets
        for (j = 0; j < subsetBoardData["groupColumns"][gro].length; j++) {
            //var listname = "subset" + j;
            var listname = subsetBoardData["groupColumns"][gro][j];
            //var label = $("#" + listname).attr("name");
            var label = $("#" + listname).attr("id");
            console.log("LabelID of changed item:" + label);
            if (subsetsObj[label]) {
                $("#" + listname).val(subsetsObj[label][textbox]);
            };
        };

    };

    function saveToLocalStorage(boarddata) { //  SAVE BOARD 
     
        var boardobject = JSON.stringify(boarddata);
        localStorage.setItem("currentboarddata", boardobject);
        console.log(currentBoardID + " Board saved locally");
         
     };
    function updateBlockTitle(blockid, title) {  // Update block title
        //update attributes
        if (title){

        var patchstr = '{"data":{"titles":{"'+ blockid +'":"' + title + '"}}}';
        //patchstr = JSON.stringify(patchstr);

       /* Replaced with merge-patch      
       if (blocktitlearray[blockid]){
        var patchstr = '{"op": "replace","path": "/data/titles/'+blockid+'", "value": "' + title + '" }';
      
       } else
       {
        var patchstr = '{"op": "add","path": "/data/titles/'+blockid+'", "value": "' + title + '" }';
      
       };

       */
       console.log(patchstr);
       patchJSON(currentBoardID, patchstr);
        //    updateItemsObj();
/* Removed code for reading from JSON after patch
         $("#"+ blockid).attr({ 'title': title });
         blocktitlearray[blockid] = title;
         board["titles"] = blocktitlearray;
         console.log("Titles:");

            saveToLocalStorage(board);
         */ 
        };

    };
    function updateBlockDetails(blockid, text) {
 /*    
        if (blockdetailsarray[blockid]){
            var patchstr = '{"op": "replace","path": "/data/details/'+blockid+'", "value": "' + text + '" }';
          
           } else
           {
            var patchstr = '{"op": "add","path": "/data/details/'+blockid+'", "value": "' + text + '" }';
          
           };
*/
        var patchstr = '{"data":{"details":{"'+ blockid +'":"' + text + '"}}}';

           console.log(patchstr);
           patchJSON(currentBoardID, patchstr,"","details", blockid);
/* Removed code for reading from JSON after patch
           blockdetailsarray[blockid] = text;
           board["details"] = blockdetailsarray;
           console.log("Details:");
   */

      //  console.log(blockdetailsarray);
      saveToLocalStorage(board);
     };

    ///////////////////////////// JSON calls //////////////////////////
    
    function createJSON(name, newjson) {
      
        // function createJSON(name, newjson) {
        const request = new XMLHttpRequest();
        var jsonID
        var jsonparsed = {};
        request.open("POST", "https://json.extendsclass.com/bin", true);
        request.responseType = "json";
        
            // disable browser caching in request header
            request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
            request.setRequestHeader('Pragma', 'no-cache');

        request.setRequestHeader("Api-key", "2e9badc3-1630-11ec-8e13-0242ac110002");
        request.setRequestHeader("Security-key", "random-brick-diamond");
        request.setRequestHeader("Private", "true");
        request.onreadystatechange = () => {
             // In local files, status is 0 upon success in Mozilla Firefox
             if (request.readyState === XMLHttpRequest.DONE) {
                const status = request.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                // The request has been completed successfully
            var jsonstring = request.response;
            jsonstring = JSON.stringify(jsonstring);
            // alert(jsonstring);
            console.log("Create JSON: " + jsonstring);
            jsonparsed = JSON.parse(jsonstring);
            jsonID = jsonparsed.id;
            console.log("Create JSON ID: " + jsonID + " with value: " + newjson);
            //localStorage.setItem(jsonID, newjson);
            localStorage.setItem("currentboard", jsonID);
            //localStorage.setItem(boardid, boarddata);
    
            currentBoardID = jsonID;
            updateboardlist(jsonID, name);
            loadJSONobjects(jsonID);

            } else {
            // Oh no! There has been an error with the request!
            }
            }
        };
        request.send('{"data": ' + newjson + '}');
        return jsonID;
        
        
        
    };
    

    function updateJSON(jsonID, jsonValue) {
        const request = new XMLHttpRequest();
        var jsonstring;
        var jsonparsed = {};
        request.open("PUT", "https://json.extendsclass.com/bin/" + jsonID , true);
        request.setRequestHeader("Security-key", "random-brick-diamond");

         // disable browser caching in request header
         request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
         request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
         request.setRequestHeader('Pragma', 'no-cache');

        request.onreadystatechange = () => {
            // In local files, status is 0 upon success in Mozilla Firefox
            if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
            jsonstring = request.response;
            jsonstring = JSON.stringify(jsonstring);
           
           
            jsonparsed = JSON.parse(jsonstring);

            console.log('Update JSONstorage ' + jsonID + ' with {"data": ' + jsonValue + '}');

            
        } else {
            // Oh no! There has been an error with the request!
            }
        }
        };
        request.send('{"data": ' + jsonValue + '}');
       
       
    };

    function patchJSON(jsonID, jsonValue, thisObj, boardObj, objId, objId2) {
        //jsonValue = JSON.stringify(jsonValue);
        const request = new XMLHttpRequest();
        //var jsonstring;
        //var jsonparsed;
       
        request.open("PATCH", "https://json.extendsclass.com/bin/" + jsonID, true);

        // disable browser caching in request header
        request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
        request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
        request.setRequestHeader('Pragma', 'no-cache');
        
        if (jsonValue.includes('{"op":')){
            request.setRequestHeader("Content-type", "application/json-patch+json");
            console.log("json-patch: " + jsonValue);
        } else {
            request.setRequestHeader("Content-type", "application/merge-patch+json");
            console.log("merge-patch: " + jsonValue);
        };
        
        //request.setRequestHeader("Content-type", "application/json-patch+json");
        request.setRequestHeader("Security-key", "random-brick-diamond");
        request.onreadystatechange = () => {
            // In local files, status is 0 upon success in Mozilla Firefox
            if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
           //jsonstring = request.response;
           //jsonstring = JSON.stringify(jsonstring);
           //jsonparsed = JSON.parse(jsonstring);

            console.log(jsonID + ' Patch: ' + jsonValue +' - status: ' + status);
            console.log(' thisObj: ' + thisObj + ' boardObj: ' + boardObj +' - objId: ' + objId);
            boardPatchUpdate(thisObj,boardObj,objId,objId2);
           
           //loadJSONobjects(jsonID); //Implement this line once all pacthes are updated
            
        } else {
            // Oh no! There has been an error with the request!
            console.log(jsonID + ' Patch: ' + jsonValue + ' - ERROR status: ' + status);
            }
        }
        };
       
        if (jsonValue.includes('{"op":')){
            request.send("[" + jsonValue + "]");
            console.log("Request send json-patch: [" + jsonValue + "]");
        } else {
            request.send(jsonValue);
            console.log("Request send merge-patch: " + jsonValue);
        };
       
    };

    function updateboardlist(fileid, boardid) {       

       var newboarditem;
       newboarditem = {};
       newboarditem.id  =  fileid;
       newboarditem.name = boardid;
        boardlistobject.push(newboarditem);
        console.log("Local Boardlist updated: " + boardlistobject)
        var boardlist = JSON.stringify(boardlistobject);
        localStorage.setItem("boardlist", boardlist);
        patchstr = '{"op": "add", "path": "/data/-",  "value": { "id": "' + fileid + '", "name":"' + boardid + '"}}';
        console.log(patchstr);
        patchJSON("baec30811a60",patchstr)

        //localStorage.setItem(boardid, boardlist);
     
    };
    function createBoardJSON(boardname) {
        board["name"] = boardname;
        updateGroupsObj();
        updateColumnsObj();
        console.log("createBoardJSON update column object");
        updateRowsObj;
        updateItemsObj();
       // saveToLocalStorage();
    };
/////////////////// UPDATE board from visible board //////////////////////

    function updateGroupsObj() {
       
        groupsObj = [];
        $(".group").each(function () {
            var id = $(this).attr("id");
            groupsObj.push(id);
        });
        console.log("groups updated:");
        console.log(groupsObj);
  
        board["groups"] = groupsObj;

        var groupstr = JSON.stringify(groupsObj);
        var patchstr = '{"op": "replace","path": "/data/groups", "value": ' + groupstr + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);

        saveToLocalStorage(board);
       
    };
    function updateColumnsObj() {
        groupColumnsObj = {};
        columnsArray = [];
        
        $(".columnheader").each(function () {
            columngroupObj = [];
            var groupId = $(this).parent().parent().find(".group").attr("id");
            ($(this).find(".column")).each(function () {
                var columnid = $(this).attr("id");
                columngroupObj.push(columnid);
                columnsArray.push(columnid);
             });
           
            groupColumnsObj[groupId] = columngroupObj;
            
           
        });
        console.log("Columns updated:");
        console.log(groupColumnsObj);
        board["groupColumns"] = groupColumnsObj;

        var gcolstr = JSON.stringify(groupColumnsObj);
        var patchstr = '{"op": "replace","path": "/data/groupColumns", "value": ' + gcolstr + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);
    
        saveToLocalStorage(board);
  
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

        var rowsstr = JSON.stringify(rowsObj);
        var patchstr = '{"op": "replace","path": "/data/rows", "value": ' + rowsstr + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);

        saveToLocalStorage(board);
  
    };
    function updateItemsObj() {
        itemsObj = {};
      //  rowsObj = [];

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
                      
                        storyObj.push(itemId);
                        x++;
                    });
                  
                    colObj["" + columnId + ""] = storyObj //colDetails;
                    y++;

                });
             
                z++;
            });
       
            itemsObj[rowId] = colObj;
            w++;
        });
    
        console.log(itemsObj);
        board["items"] = itemsObj;
        var itemsstr = JSON.stringify(itemsObj);
        var patchstr = '{"op": "replace","path": "/data/items", "value":' + itemsstr + '}';
        patchJSON(currentBoardID, patchstr);
        saveToLocalStorage(board);
        
    
    };
    function updatesubsetObj(blockid, value, label) {
        console.log("update subset (id, value, label):" + blockid + ", " + value + "," + label);
        if (subsetsObj[label]) {
            subsetsObj[label][blockid] = value
        } else {
            subsetsObj[label] = {};
            subsetsObj[label][blockid] = value;
        };

        var subsetstr = JSON.stringify(subsetsObj);
        var patchstr = '{"op": "replace","path": "/data/subsets", "value": ' + subsetstr + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);

        board["subsets"] = subsetsObj;
        console.log("subsets object saved:" + subsetsObj);
        //  console.log(blockdetailsarray);
        saveToLocalStorage(board);
    };
    function updateTypeItemsObj(blockid,type) {
        typeItemsObj[blockid] = type;
        board["itemtypes"] = typeItemsObj;
        
        console.log("Type items:" + typeItemsObj);
        //  console.log(blockdetailsarray);
        saveToLocalStorage(board);       
    };
    function updateStatusItemsObj(blockid, status) {
        statusItemsObj[blockid] = status;
        board["itemstatus"] = statusItemsObj;
        console.log("Status items:" + statusItemsObj);
        //  console.log(blockdetailsarray);
        saveToLocalStorage(board);
    };

///////////////// GENERATE new block objects /////////////////////////////////////////////

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
        console.log(boxtype + " created: " + textboxid);
        return htmlData;
    };  //Generate object html
 
    ////////// BLOCK MOVEMENT MANAGEMENT ////////////////
 /*       
   // $("body").on("DOMNodeInserted", "#board", makeSortable);//Listen out for newly created blocks and make sortable

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("board");

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true, CharacterData: false };

    // Callback function to execute when mutations are observed
 
    const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        makeSortable();
        console.log("A subtree node has been added or removed.");
      }
    }
 
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
   /* 
  // Later, you can stop observing
  observer.disconnect();

*/

    function makeSortable() {
        console.log(
            "Make sortable"
        );
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
             
                ui.item.data('originIndex', ui.item.index());
           
            },

            update: function (event, ui) {
                            
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
                //saveToLocalStorage(board);
                updateGroupsObj();  // Update group array
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
                updateRowsObj();
                //saveToLocalStorage(board);
            },
        });
    }
    function makeActivitiesSortable() {
        $(".columnheader").sortable({
       

            connectWith: ".columnheader",
            cursor: "move",
            cancel: ".columntext",

            start: function (event, ui) {
              
                ui.item.data('originIndex', ui.item.index());
                ui.item.data('originGroup', ui.item.parents(".groupcontainer").index());
                ui.item.data('originGroupId', ui.item.parents(".groupcontainer").find(".group").attr("id"));
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
                //Update rows array
                
                // saveToLocalStorage();

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
                var stopindex = ui.item.index();
                var targetGroupId = (ui.item.parents(".groupcontainer").find(".group").attr("id"));

                var fromIndex = ui.item.data('originIndex');
                var fromGroupId = ui.item.data('originGroupId');
                
                if(ui.item.data('originblocktype') === "story"){
                } else {
                console.log("Column header: update column object");
                var patchstr = '{"op": "move", "from":  "/data/groupColumns/'+ fromGroupId +'/' + fromIndex + '", "path": "/data/groupColumns/'+ targetGroupId +'/' + stopindex + '"}';
                patchJSON(currentBoardID, patchstr,"","column");
               
                //updateColumnsObj();
                //saveToLocalStorage(board);
                };
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

       // console.log("Move epics: update column object");
      //  updateColumnsObj();  //Update board columns object with column movement

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
            console.log("Column delete: update column object");
            updateColumnsObj();  //Update board columns object with column deletion

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
                    
                    var fromgroupindex =  ui.item.parents('.grouprelease').index();
                    var fromcolumnIndex =  ui.item.parents('.epic').index();
                    var fromcolumnId = $('.groupcontainer:eq(' + fromgroupindex + ') .columnheader li:eq('+ fromcolumnIndex + ') .column').attr("id");
                    ui.item.data('originColumnIndex', fromcolumnIndex);
                    ui.item.data('originColumnId', fromcolumnId);
                    ui.item.data('originItemIndex', ui.item.index());
                    ui.item.data('originRow', ui.item.parents(".row").find(".iteration").attr("id"));
                    
                    console.log("groupIndex: " +  fromgroupindex);
                    console.log("ColumnIndex: " +  fromcolumnIndex);
                    console.log("ColumnId: " +  fromcolumnId);
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
            update: function(event,ui)   {
                var fromItemIndex = ui.item.data('originItemIndex');
                var fromColumnId = ui.item.data('originColumnId');
                var fromRowId = ui.item.data('originRow');
                
                var toItemIndex = ui.item.index();
                var togroupindex =  ui.item.parents('.grouprelease').index();
                var tocolumnIndex =  ui.item.parents('.epic').index();
                var tocolumnId = $('.groupcontainer:eq(' + togroupindex + ') .columnheader li:eq('+ tocolumnIndex + ') .column').attr("id");
                var toRowId = ui.item.parents(".row").find(".iteration").attr("id");
    
            if (fromColumnId === tocolumnId && fromRowId === toRowId) {
           
            var patchstr = '{"op": "move", "from": "/data/items/'+ fromRowId +'/'+ fromColumnId +'/' + fromItemIndex + '", "path": "/data/items/'+ toRowId +'/'+ tocolumnId +'/' + toItemIndex + '"}';
            patchJSON(currentBoardID, patchstr,"","item");
           
            console.log("Item moved internally: " + ui.item.index());
            }
        },
            remove: function (event, ui) {

                var movedtocolumnheader = ui.item.parents().hasClass("columnheader");
              //  hideaddstory(); //update add story buttons
                if (movedtocolumnheader == true) {
                    var newepic = boxhtml("epic");
                    var stopindex = ui.item.index();
                    var targetgroupindex = (ui.item.parents(".groupcontainer").index());
                    var targetGroupId = (ui.item.parents(".groupcontainer").find(".group").attr("id"));
                    var targetgroup = targetgroupindex + 1;
                    var targetepic = stopindex + 1;
                    var targetepicindex = stopindex;
                    
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
                //update column and items array as item has resulted in a new column
                var fromItemIndex = ui.item.data('originItemIndex');
                var fromColumnId = ui.item.data('originColumnId');
                var fromRowId = ui.item.data('originRow');

                var patchstr = '{"op": "move", "from": "/data/items/'+ fromRowId +'/'+ fromColumnId +'/' + fromItemIndex + '", "path": "/data/groupColumns/'+ targetGroupId +'/' + stopindex + '"}';
                patchJSON(currentBoardID, patchstr,"","item");
               
                console.log("Item moved to columns: " + ui.item.index());


                  //  updateColumnsObj();
                  //  updateItemsObj();
                } else 
                {
                    var fromItemIndex = ui.item.data('originItemIndex');
                    var fromColumnId = ui.item.data('originColumnId');
                    var fromRowId = ui.item.data('originRow');
                    
                    var toItemIndex = ui.item.index();
                    var togroupindex =  ui.item.parents('.grouprelease').index();
                    var tocolumnIndex =  ui.item.parents('.epic').index();
                    var tocolumnId = $('.groupcontainer:eq(' + togroupindex + ') .columnheader li:eq('+ tocolumnIndex + ') .column').attr("id");
                    var toRowId = ui.item.parents(".row").find(".iteration").attr("id");
    
                    var patchstr = '{"op": "move", "from": "/data/items/'+ fromRowId +'/'+ fromColumnId +'/' + fromItemIndex + '", "path": "/data/items/'+ toRowId +'/'+ tocolumnId +'/' + toItemIndex + '"}';
                    patchJSON(currentBoardID, patchstr,"","item");
                   
                    console.log("Item moved: " + ui.item.index());
                };
                //update items array as item has moved between columns
                              
                //updateItemsObj();
                //saveToLocalStorage(board);
                
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
        $("#infobox").removeClass("hide");
        // Set block selected style
        //$(".textbox").parent().removeClass('blockselected');
        //$(this).parent().addClass('blockselected')
        textbox = $(this).parent().attr("id");
      
        // Display infobox if hidden
        $("#infobox").removeClass("full");
        $('.arrow-down-close').addClass('open');
        $('#board').addClass("displayinfo");
        $("#infobox").focus();
        // Update infobox data
        
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");

        var bgcolour = $(this).parent().css("background-color");
        $("#infobox-title").css("background-color", bgcolour);
        $("#infobox-navbar").css("background-color", bgcolour);

        var tcolour = $(this).css("color");
        $("#infobox-title").css("color", tcolour);
        $("#infobox-navbar").css("color", tcolour);

        if (subsetBoard) {
            updatesubsets(); //Display status
        }

        $("#blockname").val(currentText);
        console.log("Click on " + blockid);
        $("#blockdetails").html("");
        var detailsText = blockdetailsarray[blockid]; //Get details from JSON
        $("#blockdetails").html(detailsText);
        event.stopPropagation();
    });
    $(document).on("click", ".story", function (event) {
          event.stopPropagation();
    });
    $(document).on("keydown", ".textbox", function (event) {
        if (event.shiftKey && event.ctrlKey && event.which == 13) {
           // $("#infobox").removeClass("full");
           // $('.arrow-down-close').addClass('open');
           // $('#board').addClass("displayinfo");
            $('#blockdetails').focus();
            //hiddenblockdetails = $("#infobox").hasClass("full");
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
                console.log("Remove group on enter: update column object");
                updateColumnsObj();// Update column array

                //Remove releaserow containers
                $(".row").each(function (index) {

                    $(this).find(" .grouprelease.eq(" + groupstartindex + ")").remove();

                });

            } else { insertGroup(groupstartindex) };
        }
    });  //Insert new group from group
    function insertGroup(groupindex) {

        // Add Group, Add ColumnGroup, reload JSON
     var groupId = guid();
     var groupColumnId = guid();
    // var gcolstr = JSON.stringify(groupColumnsObj);
    /*
     var patchstr = '{"op": "add","path": "/data/groups/-", "value":"' + groupId + '"}';
     console.log(patchstr);
     patchJSON(currentBoardID, patchstr);

     var patchstr = '{"op": "add","path": "/data/groupColumns/' + groupId + '", "value":["' + groupColumnId + '"]}';
     console.log(patchstr);
     patchJSON(currentBoardID, patchstr);
*/
     var patchstr = '{"op": "add","path": "/data/groups/-", "value":"' + groupId + '"}, {"op": "add","path": "/data/groupColumns/' + groupId + '", "value":["' + groupColumnId + '"]}';
     console.log(patchstr);
     patchJSON(currentBoardID, patchstr,null,"group",groupId,groupColumnId);

       
       /* removing original code
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
          console.log('Added .grouprelease:eq(' + (groupindex) + ')')
        });

        //Insert group
        
        //Update groups array
        updateGroupsObj();
        updateColumnsObj();

        //appendNewcolumn(grouptextid);
       
        //Add columnheader
       // $(columnlisthtml).insertAfter(columnlist);
        // Update columns array
               
        var block = document.getElementById(grouptextid);
        $(block).find(".textbox").focus();
        */
    }; //Insert new group
    function appendNewcolumn(groupindex) {
    //    /* Previous code to be removed
        var columntextid = guid();
        var columnhtml = boxhtml("column", columntextid);
        var columnlist = $('.groupcontainer:eq(' + groupindex + ') .columnheader');
        console.log("groupindex to append column: " + groupindex)
        //Insert column 
        $(columnhtml).appendTo(columnlist);
        var block = document.getElementById(columntextid);
        $(block).find(".textbox").focus();
        //Update columns array    
        console.log("Append new column: update column object");
        updateColumnsObj();
     // */
     //New code for manipulating JSON and THEN updating HTML
     
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
        var htmlData = boxhtml("column", columntextid);
        var columnli = $('.groupcontainer:eq(' + groupindex + ') .columnheader li:eq('+ columnindex + ')');
        //Insert column 
        $(htmlData).insertAfter($(columnli));
        var block = document.getElementById(columntextid);
        $(block).find(".textbox").focus();
        //Update columns array
        console.log("Insert new column: update column object");
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
        console.log("Remove Column: update column object");
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
    
    ///////////// ITEM MANAGEMENT /////////////////

    var storedStory
    var storyHtml
    var editableStory
    var newStory
    var newStoryText
        
    $(document).on("click", ".epic", function () {
        var storytextid = guid();

        var rowId = $(this).closest('.row').find('.iteration').attr('id');
        var itemId = storytextid;
        var groupIndex = $(this).closest('.grouprelease').index();
        var epicIndex = $(this).index();
        var hasItems =  $(this).find('li').index();
        //var itemIndex = thisObj.parent().parent().index();
        var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + epicIndex + ") .column").attr("id");
        console.log("rowid:  "+  rowId + ", itemid:  "+  itemId  + ", columnId: "+  columnId + ", hasItems: " + hasItems);
        var patchstr 
        if( hasItems >= 0){
        patchstr = '{"op": "add", "path": "/data/items/' + rowId + '/' + columnId + '/-",  "value": "' + itemId + '"}';
        } else
        {
       // patchstr = '{"op": "add", "path": "/data/items/' + rowId + '/' + columnId + '",  "value": ["' + itemId + '"]}';
        patchstr = '{"data":{"items":{"' + rowId + '":{"' + columnId + '":["' + itemId + '"]}}}}'
        };
        patchJSON(currentBoardID,patchstr,$(this),"addItem",storytextid);
    });//Create new story when addStory clicked

    function boardPatchUpdate(thisObj,boardObj,objId,objId2){

        if(boardObj === "addItem"){
        var htmlData = boxhtml("story", objId);

        if (thisObj.find("li .story") === true) {
            $(htmlData).insertAfter(thisObj.find("li:last-child"));
        }
        else {
            (thisObj.children(".stories")).append(htmlData);
        };
        var block = document.getElementById(objId);
        $(block).find(".textbox").focus();
        console.log('Adding board items after epic click');
        } else
        if(boardObj === "deleteItem"){
           var deleteitem = thisObj.closest('li')    
           deleteitem.remove();
           console.log('Item removed');
           
        } else
        if(boardObj === "group"){

        var grouptextid = objId;
        var newgrouphtml = boxhtml("group", grouptextid);
        var groupreleasehtml = "<div class='grouprelease'><div class='cell-flex-container'></div></div>";
        $(newgrouphtml).appendTo($("#grouparraycontainer"));
      
        //Insert releasegroups

        $(".rowgroups").each(function (index) {
            $(groupreleasehtml).appendTo('.rowgroups');
          console.log('Added .grouprelease');
        });

        //Insert group
        
       
        //Add columnheader
       // $(columnlisthtml).insertAfter(columnlist);
        // Update columns array
               
        var block = document.getElementById(grouptextid);
        $(block).find(".textbox").focus();

        };

    };  
   

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
            if ($(this).is(':empty')) { 
                console.log("Double return, empty story delete");
                deletestory($(this)) }
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
        //var stories = thisObj.parent().parent().parent();
        //var laststory = $(stories).length;
       // thisObj.parent().parent().empty();
       // thisObj.parent().parent().remove();
       // itemId = thisObj.parent().id;
        var rowId = thisObj.closest('.row').find('.iteration').attr('id');
        var itemId = thisObj.closest('.story').attr('id');
        var groupIndex = thisObj.closest('.grouprelease').index();
        var epicIndex = thisObj.closest('.epic').index();
        var itemIndex = thisObj.parent().parent().index();
        var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + epicIndex + ") .column").attr("id");
        console.log("Delete rowid:  "+  rowId + ", itemid:  "+  itemId  + ", columnId: "+  columnId + ", itemIndex: " + itemIndex);
        var patchstr = '{"op": "remove","path": "/data/items/' + rowId + '/' + columnId + '/' + itemIndex + '"}';
        patchJSON(currentBoardID,patchstr,thisObj,"deleteItem",itemId)
                   
             // columnIdId = thisObj.parent().id;

        //Show "add story" if it was the last story in the epic
        //if (laststory == 1) {
  //          $(stories).parent().children('.addStory').show();
        //};
        //update array
       // updateItemsObj();
       //var patchstr = '{"op": "add","path": "/data/items/' + rowId + '/' + columnId + '/'+ itemIndex +'", "value":' + itemsstr + '}';
       //patchJSON(currentBoardID,patchstr)

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

    /////////// ROW MANAGEMENT ////////////////
          
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

        if (subsetBoard) {
            updatesubsets(); //Display status
        }
                
    });//Display description in description panel
    $(document).on("keyup", ".textbox", function (event) {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        $("#blockname").val(currentText);
       // updateBlockTitle(blockid, currentText); 
        
    });
    $(document).on("focusout", "#blockname", function (event) {
        var currentText = $(this).val();
        var blockid = document.getElementById(textbox);
        $(blockid).find(".textbox").text(currentText);
      //  updateBlockTitle(textbox, currentText);
    });
    $(document).on("focusout", "#blockname", function (event) {
        var currentText = $(this).val();
        updateBlockTitle(textbox, currentText);
        //saveToLocalStorage(board);
    });
    $(document).on("focusout", "#blockdetails", function (event) {
        var detailsText = $(this).html();
        updateBlockDetails(textbox, detailsText); 
        //saveToLocalStorage(board);
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
 