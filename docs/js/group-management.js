
$(function () {

    //// GLOBAL VARIABLES /////

    var n, htmlstring, boardid, currentBoardID, newboardform,
        dialog, textbox, hiddenblockdetails, board, blocktitlearray,
        groupsObj, groupColumnsObj, groupColumnsArray, columnsArray, rowsObj, itemsObj, itemsArray, blockdetailsarray, selectedBlock, sleft, stop,
        typeItemsObj, statusItemsObj, subsetsObj, settingsBoard, relationshipArray, boardlistobject, boardTypeBoard,
        boardTypeObject, subsetBoard, subsetBoardData, gro, columnsVisible, columnGroupsVisible, rowsVisible;

    function S4() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); }
    function guid() {
        return (S4() + S4() + "-" + S4() + "-4" + S4().substring(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }

///////////////////////////////////// PAGE LOAD MANAGEMENT ////////////////////

    currentBoardID = localStorage.getItem("currentboard");
    console.log("Current board: " + currentBoardID);
    if (currentBoardID) {
        loadJSONobjects(currentBoardID);
    }

    function fetchBin(bin) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("GET", "https://json.extendsclass.com/bin/" + bin, true);
            request.responseType = "json";
            request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
            request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
            request.setRequestHeader('Pragma', 'no-cache');
            request.setRequestHeader("Security-key", "random-brick-diamond");
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    var status = request.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        resolve(JSON.stringify(request.response));
                    } else {
                        reject(Error("json retrieve error " + status));
                    }
                }
            };
            request.send();
        });
    }

    fetchBin("baec30811a60").then(function (result) {
        console.log("Board list retrieved: " + result);
        boardlistobject = JSON.parse(result).data;
        localStorage.setItem("boardlist", JSON.stringify(boardlistobject));
    }, function (err) {
        console.log(err);
        boardlistobject = [];
    });

    fetchBin("9fa536bdf1a5").then(function (result) {
        console.log("Board types retrieved: " + result);
        var localboardtypeobject = JSON.parse(result).data;
        if (localboardtypeobject) {
            boardTypeObject = {};
            boardTypeBoard = localboardtypeobject;
            var gid = boardTypeBoard["groups"][0];
            for (var j = 0; j < boardTypeBoard["groupColumns"][gid].length; ++j) {
                var boardTypeVisibilityObject = [];
                var typename = boardTypeBoard["titles"][boardTypeBoard["groupColumns"][gid][j]];
                console.log(typename);
                var cid = [boardTypeBoard["groupColumns"][gid][j]];
                for (var k = 0; k < boardTypeBoard["rows"].length; ++k) {
                    var rid = boardTypeBoard["rows"][k];
                    var vis = boardTypeBoard["titles"][boardTypeBoard["items"][rid][cid]];
                    boardTypeVisibilityObject.push(vis);
                }
                boardTypeObject[typename] = boardTypeVisibilityObject;
            }
            console.log("Boardtype object: " + JSON.stringify(boardTypeObject));
        } else {
            boardTypeObject = [];
        }
    }, function (err) {
        console.log(err);
        boardlistobject = [];
    });

    makeSortable();

//////////////////////////////////// PAGE LOAD MANAGEMENT OVER ////////////////////////

    function updateboardlistoptions() {
        $('#loadfilename').empty();
        $.each(boardlistobject, function (key, value) {
            $('#loadfilename').append($("<option value=" + value.id + ">" + value.name + "</option>"));
        });
        console.log("Boardlist options updated: " + JSON.stringify(boardlistobject));
    }

///////////////////////// MENU MANAGEMENT ///////////////////////////////////////////

    $("#deleteblock-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                var blockid = document.getElementById(textbox);
                if ($(blockid).hasClass("story")) {
                    deletestory($(blockid).find(".textbox"));
                    console.log("block deleted");
                    $(this).dialog("close");
                } else if ($(blockid).hasClass("column")) {
                    var column = $(blockid).parents("li");
                    if (columnempty(column)) {
                        removecolumn(column);
                    }
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

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
                localStorage.setItem("boardlist", JSON.stringify(boardlistobject));
                localStorage.removeItem(currentBoardID);
                currentBoardID = "";
                localStorage.setItem("currentboard", "");
                $("#board").empty();
                console.log("map deleted");
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    dialog = $("#save-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Continue": function () {
                var boardname = $("#filename").val();
                settingsBoard = $("#settingsBoardNew").val();
                var boardType = $("#boardType").val();
                newboard(boardname, settingsBoard, boardType);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

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
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

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
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    newboardform = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        boardid = $("#boardid");
        createBoardJSON(boardid.val());
    });

    function newboard(boardname, settings, boardType) {
        columnsVisible = (boardTypeObject[boardType][0].toLowerCase() === 'true');
        columnGroupsVisible = (boardTypeObject[boardType][1].toLowerCase() === 'true');
        rowsVisible = (boardTypeObject[boardType][2].toLowerCase() === 'true');
        console.log("Visibility: " + columnsVisible, columnGroupsVisible, rowsVisible);
        var groupId = guid();
        var groupColumnId = guid();
        var groupColumnsStr = '"' + groupId + '":["' + groupColumnId + '"]';
        var rowId = guid();
        board = '{"name":"' + boardname + '","columns":[],"groupColumns":{' + groupColumnsStr + '},"groups":["' + groupId + '"],"items":{},"rows":["' + rowId + '"],"details":{},"itemtypes":{},"subsets":{},"settings":"' + settings + '","columnsVisible":' + columnsVisible + ',"columnGroupsVisible":' + columnGroupsVisible + ',"rowsVisible":' + rowsVisible + '}';
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
    }

    function htmlfromarray(boardarray) {
        console.log("Board data for building HTML: " + boardarray);
        $("#board").empty();
        board = boardarray;
        if (board["titles"] === undefined) {
            board["titles"] = {};
        }

        var boardheader = "<div id='boardheader'></div>";
        var groups = "<div id='headingcontainer'>" +
            "<div class='groupsheading' id='groupsheading'><div class='groupsheadingtext textbox'>Groups</div></div>" +
            "<div class='columnheaderheading' id='columnheader1'><div class='columnheaderheadingtext textbox'>Activities</div></div>" +
            "</div><div id='grouparraycontainer'>";

        var i;
        for (i = 0; i < board["groups"].length; ++i) {
            var j;
            var cols = "";
            var gid = board["groups"][i];
            for (j = 0; j < board["groupColumns"][gid].length; ++j) {
                var tit = board["titles"][board["groupColumns"][gid][j]];
                cols += boxhtml("column", board["groupColumns"][gid][j], tit);
            }
            var grouptitle = board["titles"][gid];
            groups += boxhtml("group", board["groups"][i], grouptitle, cols);
        }
        groups += "</div>";

        var rows = "<div id='rows'>";
        var rowscount = board["rows"].length;
        console.log("Row count: " + rowscount);
        var crownum = 0;
        do {
            i = 0;
            var k = 0;
            var crowid = board["rows"][crownum];
            var rowtitle;
            if (board["titles"][crowid]) {
                rowtitle = board["titles"][crowid];
            } else {
                rowtitle = "";
            }

            var groupcount = board["groups"].length;
            var iteration = boxhtml("iteration", crowid, rowtitle);
            var newrelease = "<div class='row'><div class='rowheader'>" + iteration + "<div class='row-collapse-btn' title='Collapse row'><i class='fa fa-chevron-up'></i></div></div><div class='rowgroups'>";
            var newgroupstart = "<div class='grouprelease'><div class='cell-flex-container'>";
            var newgroupend = "</div></div>";

            do {
                var m = k;
                newrelease = newrelease + newgroupstart;
                var gid = board["groups"][k];
                var columncount = board["groupColumns"][gid].length;
                console.log("group " + k + " has " + columncount + " columnheader");

                if (columncount > 0) {
                    do {
                        var columnId = board["groupColumns"][gid][i];
                        console.log("Column ID: " + columnId);
                        var storieshtml = "";
                        if (board["items"][crowid] !== undefined && board["items"][crowid][columnId] !== undefined) {
                            var storiescount = board["items"][crowid][columnId].length;
                            console.log("Story count: " + storiescount);
                            var si = 0;
                            if (storiescount > 0) {
                                do {
                                    var storyid = board["items"][crowid][columnId][si];
                                    var storytitle = board["titles"][storyid];
                                    storieshtml += boxhtml("story", storyid, storytitle);
                                    si++;
                                } while (si < storiescount);
                            }
                        }
                        var epic = boxhtml("epic", null, null, storieshtml);
                        newrelease = newrelease + epic;
                        i++;
                    } while (i < columncount);
                }
                i = 0;
                newrelease = newrelease + newgroupend;
                k++;
            } while (k < groupcount);
            newrelease = newrelease + "</div></div>";

            rows += newrelease;
            crownum++;
        } while (crownum < rowscount);

        rows += "</div>";

        var addrow = "<div class='newrelease'><div class='addrelease cell'>Add release</div></div>";
        $("#board").prepend(boardheader);
        $("#boardheader").prepend(groups);
        $("#board").append(rows);
        $("#board").append(addrow);

        boardRowsvisibility(board["rowsVisible"]);
        boardColumnsvisibility(board["columnsVisible"]);
        boardColumnGroupsvisibility(board["columnGroupsVisible"]);

        toggleGroups();
        saveToLocalStorage(board);
        makeSortable();
    }

    $(document).on("click", "#menuGroups", function () {
        document.getElementById("menuGroups").checked ? $(".group").show() : $(".group").hide();
    });

    function toggleGroups() {
        $("#group").toggle();
    }

    function boardRowsvisibility(visible) {
        console.log("Setting row visibility: " + visible);
        visible == false ? $(".rowsheadingtext").hide() : $(".rowsheadingtext").show();
        visible == false ? $(".iteration").hide() : $(".iteration").show();
        visible == false ? $(".addrelease").hide() : $(".addrelease").show();
    }

    function boardColumnsvisibility(visible) {
        console.log("Setting column visibility: " + visible);
        visible == false ? $(".groupline").hide() : $(".groupline").show();
        visible == false ? $(".group").hide() : $(".group").show();
    }

    function boardColumnGroupsvisibility(visible) {
        console.log("Setting column groups visibility: " + visible);
        visible == false ? $(".groupcolumns").hide() : $(".groupcolumns").show();
        visible == false ? $(".columnheader").hide() : $(".columnheader").show();
    }

    $(document).on("click", "#colwidth", function () {
        $("head link#columns").attr("href", function (i, attr) {
            return attr == "singlecolumn.css" ? "twocolumns.css" : (
                attr == "twocolumns.css" ? "threecolumns.css" : (
                    attr == "threecolumns.css" ? "fourcolumns.css" : (
                        attr == "fourcolumns.css" ? "transposed.css" : "singlecolumn.css")));
        });
    });

    $(document).on("click", "#boardSettingsbutton", function () {
        updateSettingsBoardList();
        if (settingsBoard) {
            $("#settingsBoard").val(settingsBoard);
        } else {
            $("#settingsBoard").val(null);
        }
        $("#boardSettings").dialog("open");
    });

    function updateSettingsBoardList() {
        $('#settingsBoard').empty();
        $('#settingsBoardNew').empty();
        $.each(boardlistobject, function (key, value) {
            $('#settingsBoard').append($("<option value=" + value.id + ">" + value.name + "</option>"));
            $('#settingsBoardNew').append($("<option value=" + value.id + ">" + value.name + "</option>"));
        });
    }

    function updateBoardTypeList() {
        $('#boardType').empty();
        $.each(boardTypeObject, function (i, value) {
            $('#boardType').append($("<option></option>").attr("value", i).text(i));
        });
    }

    $(document).on("click", "#toggleBoardMenu", function (event) {
        $("#boardMenu").toggle();
        $("#boardname").toggle();
    });

//////////////////// Board menu actions /////////////////

    $(document).on("click", "#new", function () {
        updateSettingsBoardList();
        updateBoardTypeList();
        $("#settingsBoardNew").val(null);
        $("#boardType").val(null);
        $("#save-confirm").dialog("open");
    });

    $(document).on("click", "#deleteboard", function () {
        $("#delete-confirm").dialog("open");
    });

    $(document).on("click", "#loadarray", function () {
        updateboardlistoptions();
        $("#load-confirm").dialog("open");
    });

    $(document).on("click", "#savearray", function () {
        console.log("Save clicked");
    });

    //////////////////////// Update block details when editing from the infobox ////////////////

    $(document).on("focusout", ".textbox", function () {
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        updateBlockTitle(blockid, currentText);
        if ($(this).not(':empty')) $(this).attr('contenteditable', 'false');
    });

    ///////////////////////// Block menu actions ////////////////////

    $(document).on("click", "#toggledetails", function (event) {
        $("#infobox").toggleClass("full");
        $("#manageblock").toggle();
        $("#blockmenu").toggle();
        $("#subsets").toggle();
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

//////////////////// Move board item actions //////////////////////////

    $(document).on("click", "#moveright", function () {
        sleft = $("#board").scrollLeft();
        stop = $("#board").scrollTop();
        var blockid = document.getElementById(textbox);
        var gid = $(blockid).parents(".groupcontainer").find(".group").attr("id");
        console.log("group: " + gid);
        var gind = groupsObj.indexOf(gid);
        if ($(blockid).hasClass("column")) {
            var cols = groupColumnsObj[gid];
            var i = cols.indexOf(textbox);
            console.log("index of column: " + i);
            console.log("array before: " + cols);

            if (groupColumnsObj[gid].length > (i + 1) || (groupColumnsObj[gid].length === (i + 1) && groupsObj[gind + 1])) {
                var j, k;
                if (groupColumnsObj[gid].length > (i + 1)) {
                    j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                    k = i + 1;
                } else if (groupColumnsObj[gid].length === (i + 1) && groupsObj[gind + 1]) {
                    j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                    k = 0;
                    groupColumnsObj[gid] = cols;
                    gid = groupsObj[gind + 1];
                    cols = groupColumnsObj[gid];
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
            }
        }
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
        if ((rowindex + 1) < rowscount) {
            var rowdownid = rowsObj[rowindex + 1];
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
                var j = stories.splice(i, 1).toString();
                console.log("story spliced: " + j);
                var trowid = rowsObj[rowindex + 1];
                var tstories = itemsObj[trowid][colid];
                tstories.splice(0, 0, j);
                board["items"] = itemsObj;
                saveToLocalStorage(board);
                htmlfromarray(board);
                blockid = document.getElementById(textbox);
                blockid.scrollIntoView(false);
            }
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
                }
                blockid = document.getElementById(textbox);
                blockid.scrollIntoView(true);
            }
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
                var j = stories.splice(i, 1).toString();
                console.log("story spliced: " + j);
                if (i === 0) {
                    var trowid = rowsObj[rowindex - 1];
                    var tstories = itemsObj[trowid][colid];
                    tstories.push(j);
                } else {
                    stories.splice(i - 1, 0, j);
                }
                board["items"] = itemsObj;
                saveToLocalStorage(board);
                htmlfromarray(board);
                blockid = document.getElementById(textbox);
            }
        }
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
            }
        }
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
                var j;
                if (i > 0) {
                    j = cols.splice(i, 1).toString();
                    console.log("column spliced: " + j);
                    var k = i - 1;
                    cols.splice(k, 0, j);
                } else if (i === 0 && groupsObj[gind - 1]) {
                    j = cols.splice(i, 1).toString();
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
            }
        }
        $("#board").scrollLeft(sleft);
        $("#board").scrollTop(stop);
        console.log("scroll: " + sleft + ", " + stop);
    });

//////////////////////////// JSON OBJECTS ////////////////////

    function loadJSONobjects(boardid) {
        console.log("Load boardid: " + boardid);
        fetchBin(boardid).then(function (result) {
            $("#infobox").toggleClass("hide");
            $("#subsetsfieldset").html("");
            console.log("Boarddata retrieved: " + result);
            var boarddata = JSON.parse(result);
            boarddata = boarddata.data;
            board = boarddata;

            groupsObj = board["groups"];
            groupColumnsObj = board["groupColumns"];
            rowsObj = board["rows"];
            itemsObj = board["items"];
            blocktitlearray = board["titles"];
            blockdetailsarray = board["details"];
            if (board["subsets"]) {
                subsetsObj = board["subsets"];
            } else {
                subsetsObj = {};
            }
            if (board["settings"] !== "null") {
                settingsBoard = board["settings"];
                getsettingsboarddata(board["settings"]);
            }

            $("#boardname").text(board["name"]);
            saveToLocalStorage(board);
            htmlfromarray(board);
        }, function (err) {
            console.log(err);
        });
    }

//////////////////////////////////// SUBSETS /////////////////////////////////

    function getsettingsboarddata(settingsboardid) {
        fetchBin(settingsboardid).then(function (result) {
            console.log("Settings Boarddata retrieved: " + result);
            subsetBoard = JSON.parse(result);
            console.log("Settings board: " + subsetBoard);
            if (subsetBoard) {
                var subsetlist = [];
                subsetBoardData = subsetBoard.data;
                gro = subsetBoardData["groups"][0];
                for (var i = 0; i < subsetBoardData["groupColumns"][gro].length; i++) {
                    var subsetvalues = [];
                    var row = subsetBoardData["rows"][0];
                    var col = subsetBoardData["groupColumns"][gro][i];
                    var boarditemstatuskeys = subsetBoardData["items"][row][col];
                    var label = subsetBoardData["titles"][subsetBoardData["groupColumns"][gro][i]];
                    console.log("row:" + row + ",col," + col + ", " + boarditemstatuskeys);

                    boarditemstatuskeys.forEach(function (item) {
                        subsetvalues.push(item);
                        console.log("set subset value:" + item + "," + subsetBoardData["titles"][item]);
                    });
                    subsetlist.push(subsetvalues);

                    if (!subsetsObj[col]) {
                        subsetsObj[col] = {};
                    }

                    var listname = subsetBoardData["groupColumns"][gro][i];
                    var subsetSelect = document.createElement('select');
                    subsetSelect.id = listname;
                    subsetSelect.name = label;

                    var subsetLabel = document.createElement('label');
                    subsetLabel.setAttribute("for", subsetSelect);
                    subsetLabel.innerHTML = label;

                    $("#subsetsfieldset").append(subsetLabel);
                    $("#subsetsfieldset").append(subsetSelect);
                    subsetSelect.onchange = subsetChange;

                    console.log(subsetLabel + "," + subsetSelect);

                    $("#" + listname).empty();
                    $.each(subsetlist[i], function (j, value) {
                        var text = subsetBoardData["titles"][value];
                        $("#" + listname).append($("<option></option>").attr("value", value).text(text));
                    });
                }
            }
        }, function (err) {
            console.log(err);
        });
    }

    function subsetChange() {
        console.log("Subset " + this.id + " changed to:" + this.value);
        updatesubsetObj(textbox, this.value, this.id);
    }

    function updatesubsets() {
        console.log("Update subsets from " + subsetBoardData["name"]);
        for (var j = 0; j < subsetBoardData["groupColumns"][gro].length; j++) {
            var listname = subsetBoardData["groupColumns"][gro][j];
            var label = $("#" + listname).attr("id");
            console.log("LabelID of changed item:" + label);
            if (subsetsObj[label]) {
                $("#" + listname).val(subsetsObj[label][textbox]);
            }
        }
    }

    function saveToLocalStorage(boarddata) {
        localStorage.setItem("currentboarddata", JSON.stringify(boarddata));
        console.log(currentBoardID + " Board saved locally");
    }

    function updateBlockTitle(blockid, title) {
        if (title) {
            var patchstr = '{"data":{"titles":{"' + blockid + '":"' + title + '"}}}';
            console.log(patchstr);
            patchJSON(currentBoardID, patchstr);
        }
    }

    function updateBlockDetails(blockid, text) {
        if (blockdetailsarray) {
            blockdetailsarray[blockid] = text;
        }
        var patchstr = '{"data":{"details":{"' + blockid + '":"' + text + '"}}}';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr, "", "details", blockid);
        saveToLocalStorage(board);
    }

///////////////////////////// JSON calls //////////////////////////

    function createJSON(name, newjson) {
        var request = new XMLHttpRequest();
        var jsonID;
        var jsonparsed = {};
        request.open("POST", "https://json.extendsclass.com/bin", true);
        request.responseType = "json";
        request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
        request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
        request.setRequestHeader('Pragma', 'no-cache');
        request.setRequestHeader("Api-key", "2e9badc3-1630-11ec-8e13-0242ac110002");
        request.setRequestHeader("Security-key", "random-brick-diamond");
        request.setRequestHeader("Private", "true");
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                var status = request.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    var jsonstring = JSON.stringify(request.response);
                    console.log("Create JSON: " + jsonstring);
                    jsonparsed = JSON.parse(jsonstring);
                    jsonID = jsonparsed.id;
                    console.log("Create JSON ID: " + jsonID + " with value: " + newjson);
                    localStorage.setItem("currentboard", jsonID);
                    currentBoardID = jsonID;
                    updateboardlist(jsonID, name);
                    loadJSONobjects(jsonID);
                }
            }
        };
        request.send('{"data": ' + newjson + '}');
        return jsonID;
    }

    function patchJSON(jsonID, jsonValue, thisObj, boardObj, objId, objId2) {
        var request = new XMLHttpRequest();
        request.open("PATCH", "https://json.extendsclass.com/bin/" + jsonID, true);
        request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
        request.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
        request.setRequestHeader('Pragma', 'no-cache');
        if (jsonValue.includes('{"op":')) {
            request.setRequestHeader("Content-type", "application/json-patch+json");
            console.log("json-patch: " + jsonValue);
        } else {
            request.setRequestHeader("Content-type", "application/merge-patch+json");
            console.log("merge-patch: " + jsonValue);
        }
        request.setRequestHeader("Security-key", "random-brick-diamond");
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                var status = request.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    console.log(jsonID + ' Patch: ' + jsonValue + ' - status: ' + status);
                    console.log(' thisObj: ' + thisObj + ' boardObj: ' + boardObj + ' - objId: ' + objId);
                    boardPatchUpdate(thisObj, boardObj, objId, objId2);
                } else {
                    console.log(jsonID + ' Patch: ' + jsonValue + ' - ERROR status: ' + status);
                }
            }
        };
        if (jsonValue.includes('{"op":')) {
            request.send("[" + jsonValue + "]");
            console.log("Request send json-patch: [" + jsonValue + "]");
        } else {
            request.send(jsonValue);
            console.log("Request send merge-patch: " + jsonValue);
        }
    }

    function updateboardlist(fileid, boardid) {
        var newboarditem = { id: fileid, name: boardid };
        boardlistobject.push(newboarditem);
        console.log("Local Boardlist updated: " + boardlistobject);
        localStorage.setItem("boardlist", JSON.stringify(boardlistobject));
        var patchstr = '{"op": "add", "path": "/data/-",  "value": { "id": "' + fileid + '", "name":"' + boardid + '"}}';
        console.log(patchstr);
        patchJSON("baec30811a60", patchstr);
    }

    function createBoardJSON(boardname) {
        board["name"] = boardname;
        updateGroupsObj();
        updateColumnsObj();
        console.log("createBoardJSON update column object");
        updateRowsObj();
        updateItemsObj();
        console.log("Create board JSON, updating all objects");
    }

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
        var patchstr = '{"op": "replace","path": "/data/groups", "value": ' + JSON.stringify(groupsObj) + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);
        saveToLocalStorage(board);
    }

    function updateColumnsObj(fromGroup, toGroup, fromCol, toCol) {
        groupColumnsObj = {};
        columnsArray = [];
        if (fromGroup == null) {
            $(".columnheader").each(function () {
                var columngroupObj = [];
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
            var patchstr = '{"op": "replace","path": "/data/groupColumns", "value": ' + JSON.stringify(groupColumnsObj) + ' }';
            console.log(patchstr);
            patchJSON(currentBoardID, patchstr);
            saveToLocalStorage(board);
        } else {
            var patchstr = '{"op": "move","from": "/data/groupColumns/' + fromGroup + '/' + fromCol + '", "path": "/data/groupColumns/' + toGroup + '/' + toCol + '" }';
            console.log(patchstr);
            patchJSON(currentBoardID, patchstr);
        }
    }

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
        var patchstr = '{"op": "replace","path": "/data/rows", "value": ' + JSON.stringify(rowsObj) + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);
        saveToLocalStorage(board);
    }

    function updateItemsObj(fromRow, fromCol, fromItemIndex, toRow, toCol, toItemIndex, toGroup, toColIndex) {
        if (fromCol == null) {
            itemsObj = {};
            $(".row").each(function () {
                var iteration = ($(this).find(".iteration"));
                var rowId = $(iteration).attr("id");
                var colObj = {};
                ($(this).find(".grouprelease")).each(function () {
                    var groupIndex = $(this).index();
                    ($(this).find(".epic")).each(function () {
                        var columnindex = $(this).index();
                        var storyObj = [];
                        var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + columnindex + ") .column").attr("id");
                        ($(this).find(".story")).each(function () {
                            var itemId = $(this).attr("id");
                            storyObj.push(itemId);
                        });
                        colObj["" + columnId + ""] = storyObj;
                    });
                });
                itemsObj[rowId] = colObj;
            });

            console.log(itemsObj);
            board["items"] = itemsObj;
            var patchstr = '{"op": "replace","path": "/data/items", "value":' + JSON.stringify(itemsObj) + '}';
            patchJSON(currentBoardID, patchstr);
            saveToLocalStorage(board);
        } else if (toRow !== null) {
            var patchstr = '{"op": "move","from": "/data/items/' + fromRow + '/' + fromCol + '/' + fromItemIndex + '", "path": "/data/items/' + toRow + '/' + toCol + '/' + toItemIndex + '" }';
            console.log(patchstr);
            patchJSON(currentBoardID, patchstr);
        } else if (toGroup !== null) {
            var patchstr = '{"op": "move","from": "/data/items/' + fromRow + '/' + fromCol + '", "path": "/data/groupColumns/' + toRow + '/' + toCol + '" }';
            console.log(patchstr);
            patchJSON(currentBoardID, patchstr);
        }
    }

    function updatesubsetObj(blockid, value, label) {
        console.log("update subset (id, value, label):" + blockid + ", " + value + "," + label);
        if (subsetsObj[label]) {
            subsetsObj[label][blockid] = value;
        } else {
            subsetsObj[label] = {};
            subsetsObj[label][blockid] = value;
        }
        var patchstr = '{"op": "replace","path": "/data/subsets", "value": ' + JSON.stringify(subsetsObj) + ' }';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr);
        board["subsets"] = subsetsObj;
        console.log("subsets object saved:" + subsetsObj);
        saveToLocalStorage(board);
    }

///////////////// GENERATE new block objects /////////////////////////////////////////////

    function boxhtml(boxtype, textboxid, title, childitems) {
        var htmlData = "";
        if (textboxid == null) { textboxid = guid(); }
        if (title == null) { title = ""; }
        if (childitems == null) { childitems = ""; }
        if (boxtype == "group" || boxtype == "column" || boxtype == "story" || boxtype == "iteration") {
            if (boxtype === "story") {
                htmlData = "<div class='story' id='" + textboxid + "' title='" + title + "'><div class='storytext textbox' contenteditable='false'>" + title + "</div></div>";
            } else {
                htmlData = "<div class='" + boxtype + "' id='" + textboxid + "' title='" + title + "'><div class='" + boxtype + "text textbox' contenteditable='false'>" + title + "</div></div>";
            }
            if (boxtype == "group") {
                htmlData = "<div class='groupcontainer'><div class='groupline'>" + htmlData + "</div>" +
                    "<div class='groupcolumns'><ul class='columnheader'>" + childitems + "</ul><div class='add-column-btn' title='Add column'>+</div></div></div>";
            } else if (boxtype == "column" || boxtype == "story") {
                htmlData = "<li>" + htmlData + "</li>";
                console.log(boxtype + " created (li)");
            }
        } else if (boxtype == "epic") {
            htmlData = "<div class='epic'><ul class='stories'>" + childitems + "</ul></div>";
        }
        console.log(boxtype + " created: " + textboxid);
        return htmlData;
    }

////////// BLOCK MOVEMENT MANAGEMENT ////////////////

    function makeSortable() {
        console.log("Make sortable");
        makeGroupsSortable();
        makeActivitiesSortable();
        makeEpicsSortable();
        makereleasessortable();
    }

    var storyDragState = {};
    var groupDragState = {};
    var activityDragState = {};

    function makeGroupsSortable() {
        var el = document.getElementById("boardheader");
        if (!el) return;
        Sortable.create(el, {
            draggable: ".groupcontainer",
            filter: ".groupcolumns",
            preventOnFilter: false,
            delay: 500,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            onStart: function (evt) {
                groupDragState.originIndex = evt.oldIndex;
            },
            onEnd: function (evt) {
                var startgroupindex = groupDragState.originIndex;
                var targetgroupindex = evt.newIndex;
                if (targetgroupindex < startgroupindex) {
                    $(".rowgroups").each(function () {
                        $(this).find(".grouprelease:eq(" + startgroupindex + ")").insertBefore($(this).find(".grouprelease:eq(" + targetgroupindex + ")"));
                    });
                } else if (targetgroupindex > startgroupindex) {
                    $(".rowgroups").each(function () {
                        $(this).find(".grouprelease:eq(" + startgroupindex + ")").insertAfter($(this).find(".grouprelease:eq(" + targetgroupindex + ")"));
                    });
                }
                updateGroupsObj();
            }
        });
    }

    function makereleasessortable() {
        var el = document.getElementById("rows");
        if (!el) return;
        Sortable.create(el, {
            handle: ".rowheader",
            filter: ".row-collapse-btn",
            preventOnFilter: false,
            delay: 500,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            onEnd: function (evt) {
                updateRowsObj();
            }
        });
    }

    function makeActivitiesSortable() {
        $(".columnheader").each(function () {
            initColumnHeaderSortable(this);
        });
    }

    function initColumnHeaderSortable(el) {
        if (Sortable.get(el)) return;
        Sortable.create(el, {
            group: { name: "columns", pull: true, put: ["columns", "stories"] },
            delay: 500,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            onStart: function (evt) {
                var item = $(evt.item);
                activityDragState.originIndex = evt.oldIndex;
                activityDragState.originGroup = item.parents(".groupcontainer").index();
                activityDragState.originGroupId = item.parents(".groupcontainer").find(".group").attr("id");
                activityDragState.originblocktype = "activity";
                $(".rowgroups").each(function () {
                    $(this).find(".grouprelease:eq(" + activityDragState.originGroup + ") .epic:eq(" + activityDragState.originIndex + ")").addClass("epic-dragging");
                });
            },
            onMove: function (evt) {
                if (activityDragState.originblocktype !== "activity") return true;
                if (!$(evt.to).hasClass("columnheader")) return true;
                var targetGroup = $(evt.to).parents(".groupcontainer").index();

                // onMove fires before SortableJS updates the DOM, so evt.dragged is still
                // at its original index. Compute the target index from evt.related and
                // evt.willInsertAfter, adjusting for the dragged element still being present
                // in the sibling list (it shifts related's index when it precedes related).
                var originIndex = activityDragState.originIndex;
                var relatedIdx = $(evt.related).index();
                // Use the column's current DOM index (updated by previous onMove events)
                // not originIndex, which only reflects the drag start position.
                var currentColIdx = $(evt.dragged).index();
                var targetIdx;
                if (evt.willInsertAfter) {
                    targetIdx = currentColIdx < relatedIdx ? relatedIdx : relatedIdx + 1;
                } else {
                    targetIdx = currentColIdx < relatedIdx ? relatedIdx - 1 : relatedIdx;
                }

                // With display:none on the origin epic, every epic after originIndex shifts
                // one slot left visually. DOM :eq() still counts the hidden epic, so when
                // the target is to the right of the origin we select one index higher to
                // land the placeholder in the correct visual column slot.
                var epicIdx = targetIdx > originIndex ? targetIdx + 1 : targetIdx;

                $(".epic-drop-placeholder").remove();
                $(".rowgroups").each(function () {
                    var targetContainer = $(this).find(".grouprelease:eq(" + targetGroup + ") .cell-flex-container");
                    var placeholder = $("<div class='epic-drop-placeholder'></div>");
                    var targetEpic = $(this).find(".grouprelease:eq(" + targetGroup + ") .epic:eq(" + epicIdx + ")");
                    if (targetEpic.length) {
                        placeholder.insertBefore(targetEpic);
                    } else {
                        placeholder.appendTo(targetContainer);
                    }
                });
                return true;
            },
            onEnd: function (evt) {
                $(".epic-drop-placeholder").remove();
                $(".epic-dragging").removeClass("epic-dragging");
                if (activityDragState.originblocktype === "story") return;
                var newIndex = evt.newIndex;
                var originIndex = activityDragState.originIndex;
                var originGroup = activityDragState.originGroup;
                var item = $(evt.item);
                var targetGroup = item.parents(".groupcontainer").index();
                var targetGroupId = item.parents(".groupcontainer").find(".group").attr("id");

                $(".rowgroups").each(function () {
                    var startepic = $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")");
                    var targetContainer = $(this).find(".grouprelease:eq(" + targetGroup + ") .cell-flex-container");
                    var targetEpic = $(this).find(".grouprelease:eq(" + targetGroup + ") .epic:eq(" + newIndex + ")");

                    if (originGroup === targetGroup) {
                        if (newIndex > originIndex) {
                            startepic.insertAfter($(this).find(".grouprelease:eq(" + targetGroup + ") .epic:eq(" + newIndex + ")"));
                        } else if (newIndex < originIndex) {
                            startepic.insertBefore($(this).find(".grouprelease:eq(" + targetGroup + ") .epic:eq(" + newIndex + ")"));
                        }
                    } else {
                        if (targetEpic.length) {
                            startepic.insertBefore(targetEpic);
                        } else {
                            startepic.appendTo(targetContainer);
                    }
                    }
                });

                var fromGroupId = activityDragState.originGroupId;
                var patchstr = '{"op": "move", "from": "/data/groupColumns/' + fromGroupId + '/' + originIndex + '", "path": "/data/groupColumns/' + targetGroupId + '/' + newIndex + '"}';
                patchJSON(currentBoardID, patchstr, "", "column");
            }
        });
    }

    function removeEpics(originGroup, originIndex) {
        var storycount = 0;
        $(".rowgroups").each(function () {
            var startepic = $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")");
            if (!startepic.find(".stories").is(':empty')) { storycount++; }
        });
        if (storycount === 0) {
            $(".rowgroups").each(function () {
                $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").remove();
            });
            updateColumnsObj();
        }
        return storycount === 0;
    }

    function hideEpics(originGroup, originIndex) {
        $(".rowgroups").each(function () {
            $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")").hide();
        });
    }

    function unhideEpics(originGroup, originIndex) {
        $(".rowgroups").each(function () {
            var epic = $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")");
            if (!epic.is(":visible")) { epic.toggle(); }
        });
    }

    function hasStories(originGroup, originIndex) {
        var stories = false;
        $(".rowgroups").each(function () {
            var startepic = $(this).find(".grouprelease:eq(" + originGroup + ") .epic:eq(" + originIndex + ")");
            if (!startepic.find(".stories").is(':empty')) { stories = true; }
        });
        return stories;
    }

    function makeEpicsSortable() {
        $(".stories").each(function () {
            initStoriesSortable(this);
        });
    }

    function initStoriesSortable(el) {
        if (Sortable.get(el)) return;
        Sortable.create(el, {
            group: { name: "stories", pull: true, put: ["stories"] },
            delay: 500,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            onStart: function (evt) {
                var item = $(evt.item);
                var fromgroupindex = item.parents('.grouprelease').index();
                var fromcolumnIndex = item.parents('.epic').index();
                var fromcolumnId = $('.groupcontainer:eq(' + fromgroupindex + ') .columnheader li:eq(' + fromcolumnIndex + ') .column').attr("id");
                storyDragState.originColumnIndex = fromcolumnIndex;
                storyDragState.originColumnId = fromcolumnId;
                storyDragState.originItemIndex = evt.oldIndex;
                storyDragState.originRow = item.parents(".row").find(".iteration").attr("id");
                storyDragState.originGroup = fromgroupindex;
                storyDragState.originIndex = fromcolumnIndex;
                storyDragState.originblocktype = "story";
                activityDragState.originblocktype = "story";
            },
            onUpdate: function (evt) {
                var fromItemIndex = storyDragState.originItemIndex;
                var fromColumnId = storyDragState.originColumnId;
                var fromRowId = storyDragState.originRow;
                var toItemIndex = evt.newIndex;
                var patchstr = '{"op": "move", "from": "/data/items/' + fromRowId + '/' + fromColumnId + '/' + fromItemIndex + '", "path": "/data/items/' + fromRowId + '/' + fromColumnId + '/' + toItemIndex + '"}';
                patchJSON(currentBoardID, patchstr, "", "item");
            },
            onAdd: function (evt) {
                updateItemsObj(null, null);
            },
            onRemove: function (evt) {
                if (!$(evt.to).hasClass("columnheader")) return;
                var item = $(evt.item);
                var newepic = boxhtml("epic");
                var stopindex = evt.newIndex;
                var targetgroupindex = $(evt.to).parents(".groupcontainer").index();
                var targetGroupId = $(evt.to).parents(".groupcontainer").find(".group").attr("id");
                var targetepicindex = stopindex;
                var childtext = item.find(".storytext");
                var actcount = groupcolumncount(targetgroupindex);
                var targetepic = stopindex + 1;

                item.find(".story").addClass('column').removeClass('story');
                childtext.addClass('columntext').removeClass('storytext');

                if (actcount > 1 && targetepic <= actcount) {
                    $(".rowgroups").each(function () {
                        $(newepic).insertBefore($(this).find(".grouprelease:eq(" + targetgroupindex + ") .epic:eq(" + targetepicindex + ")"));
                    });
                } else if (actcount > 1 && targetepic > actcount) {
                    $(".rowgroups").each(function () {
                        $(newepic).insertAfter($(this).find(".grouprelease:eq(" + targetgroupindex + ") .epic:last-child"));
                    });
                } else {
                    $(".rowgroups").each(function () {
                        $(newepic).appendTo($(this).find(".grouprelease:eq(" + targetgroupindex + ") .cell-flex-container"));
                    });
                }

                var fromItemIndex = storyDragState.originItemIndex;
                var fromColumnId = storyDragState.originColumnId;
                var fromRowId = storyDragState.originRow;
                var patchstr = '{"op": "move", "from": "/data/items/' + fromRowId + '/' + fromColumnId + '/' + fromItemIndex + '", "path": "/data/groupColumns/' + targetGroupId + '/' + stopindex + '"}';
                patchJSON(currentBoardID, patchstr, "", "item");
                $(newepic).find(".stories").each(function () { initStoriesSortable(this); });
            }
        });
    }

    $(document).on("click", ".textbox", function (event) {
        console.log("textbox clicked");
        $("#infobox").removeClass("hide");
        textbox = $(this).parent().attr("id");
        $("#infobox").removeClass("full");
        $('.arrow-down-close').addClass('open');
        $('#board').addClass("displayinfo");
        $("#infobox").focus();
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        var bgcolour = $(this).parent().css("background-color");
        $("#infobox-title").css("background-color", bgcolour);
        $("#infobox-navbar").css("background-color", bgcolour);
        var tcolour = $(this).css("color");
        $("#infobox-title").css("color", tcolour);
        $("#infobox-navbar").css("color", tcolour);
        if (subsetBoard) {
            updatesubsets();
        }
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
            $('#blockdetails').focus();
            event.stopPropagation();
        }
    });

    function groupcolumncount(groupindex) {
        var columncount = $('.groupcontainer:eq(' + groupindex + ') .column').length;
        console.log("Column count: " + columncount);
        return columncount;
    }

///////////// GROUP MANAGEMENT //////////////////

    $(document).on("keydown", ".grouptext", function (event) {
        console.log("Group return key");
        var groupstartindex = $(this).parents('.groupcontainer').index();

        if (event.which == 13 && event.ctrlKey && (event.shiftKey == false)) {
            event.preventDefault();
            appendNewcolumn(groupstartindex);
            event.stopPropagation();
        } else if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) {
            event.preventDefault();
            if (groupcolumncount(groupstartindex) == 0 && $(this).is(':empty')) {
                console.log("delete group: " + groupstartindex);
                $(this).parents('.groupcontainer').remove();
                updateGroupsObj();
                console.log("Remove group on enter: update column object");
                updateColumnsObj();
                $(".row").each(function (index) {
                    $(this).find(" .grouprelease.eq(" + groupstartindex + ")").remove();
                });
            } else {
                insertGroup(groupstartindex);
            }
        }
    });

    function insertGroup(groupindex) {
        var groupId = guid();
        var groupColumnId = guid();
        var patchstr = '{"op": "add","path": "/data/groups/-", "value":"' + groupId + '"}, {"op": "add","path": "/data/groupColumns/' + groupId + '", "value":["' + groupColumnId + '"]}';
        console.log(patchstr);
        patchJSON(currentBoardID, patchstr, null, "group", groupId, groupColumnId);
    }

    function appendNewcolumn(groupindex) {
        var columntextid = guid();
        var columnhtml = boxhtml("column", columntextid);
        var columnlist = $('.groupcontainer:eq(' + groupindex + ') .columnheader');
        console.log("groupindex to append column: " + groupindex);
        $(columnhtml).appendTo(columnlist);
        var block = document.getElementById(columntextid);
        $(block).find(".textbox").trigger("click"); $("#blockname").focus();
        console.log("Append new column: update column object");
        updateColumnsObj();

        $(".rowgroups").each(function (index) {
            var flexcontainer = $(this).find('.grouprelease:eq(' + groupindex + ') .cell-flex-container');
            var newepic = $(boxhtml("epic")).appendTo(flexcontainer);
            newepic.find(".stories").each(function () { initStoriesSortable(this); });
        });
    }

//////////// COLUMN MANAGEMENT /////////////////

    var storedcolumn, columnHtml, editablecolumn, newcolumnText, newcolumn;

    $(document).on("keydown", ".columntext", function (event) {
        console.log("column return key");
        var column = $(this).parents("li");
        var columnindex = $(this).parents("li").index();
        var groupindex = $(this).parents('.groupcontainer').index();
        if (event.ctrlKey && event.which == 13 && (event.shiftKey == false)) {
            event.preventDefault();
            appendNewStory(columnindex, groupindex);
            event.stopPropagation();
        } else if (event.shiftKey && event.which == 13 && $(".group").is(":visible") && (event.ctrlKey == false)) {
            event.preventDefault();
            insertGroup(groupindex);
            event.stopPropagation();
        } else if (event.which == 13 && (event.shiftKey && event.ctrlKey) == false) {
            event.preventDefault();
            if (columnempty(column)) {
                removecolumn(column);
            } else {
                insertNewcolumn(columnindex, groupindex);
            }
        }
    });

    function insertNewcolumn(columnindex, groupindex) {
        var columntextid = guid();
        var htmlData = boxhtml("column", columntextid);
        var columnli = $('.groupcontainer:eq(' + groupindex + ') .columnheader li:eq(' + columnindex + ')');
        $(htmlData).insertAfter($(columnli));
        var block = document.getElementById(columntextid);
        $(block).find(".textbox").trigger("click"); $("#blockname").focus();
        console.log("Insert new column: update column object");
        updateColumnsObj();

        $(".row").each(function (index) {
            var previousepic = $(this).find('.rowgroups .grouprelease:eq(' + groupindex + ') .cell-flex-container .epic:eq(' + columnindex + ')');
            var newepic = $(boxhtml("epic")).insertAfter($(previousepic));
            newepic.find(".stories").each(function () { initStoriesSortable(this); });
        });

        console.log("InsertNewcolumn");
    }

    function appendNewStory(column, groupindex, rowindex) {
        var storytextid = guid();
        var htmlData = boxhtml("story", storytextid);
        if (rowindex == null) rowindex = 0;
        var stories = $(".rowgroups").eq(rowindex).find('.grouprelease:eq(' + groupindex + ') .epic:eq(' + column + ') .stories');
        $(htmlData).appendTo(stories);
        var block = document.getElementById(storytextid);
        $(block).find(".textbox").trigger("click"); $("#blockname").focus();
        updateItemsObj();
    }

    $(document).on("focusout", ".columntext", function () {
        var columnli = $(this).parents("li");
        if (columnempty(columnli)) {
            removecolumn(columnli);
        }
    });

    function columnempty(columnline) {
        var columnstartindex = columnline.index();
        var groupstartindex = $(columnline).parents('.groupcontainer').index();
        var columnnumber = columnstartindex + 1;
        var columnempty = $(columnline).find(" .column .columntext").is(':empty');
        var storycount = 0;

        $(".row").each(function (index) {
            if (!epicEmpty(index, groupstartindex, columnnumber)) {
                storycount++;
            }
        });
        if (columnempty && storycount === 0) { return true; }
        console.log('column text empty?: ' + columnempty + 'storycount: ' + storycount);
    }

    function epicEmpty(rowindex, groupindex, columnnumber) {
        var empty = false;
        var columnindex = columnnumber - 1;
        var columncount = groupcolumncount(groupindex);
        console.log("Rowindex:" + rowindex + " groupcell:" + groupindex + " columnnumber:" + columnnumber);
        if (columncount == 0 || $(".row").eq(rowindex).find('.grouprelease:eq(' + groupindex + ') .epic:eq(' + columnindex + ') .stories').is(':empty')) empty = true;
        console.log(empty);
        return empty;
    }

    function removecolumn(columnli) {
        var columnindex = columnli.index();
        var groupindex = $('.groupcontainer').index($(columnli).parents('.groupcontainer'));
        var columnnumber = columnindex + 1;

        columnli.remove();
        console.log("Remove Column: update column object");
        updateColumnsObj();

        $(".rowgroups").each(function (index) {
            $(this).find('.grouprelease:eq(' + groupindex + ') .epic:eq(' + columnindex + ')').remove();
            console.log("epic removed, " + groupindex + ", " + columnindex);
        });
    }

    $(document).on("click", ".add-column-btn", function () {
        var groupindex = $(this).parents('.groupcontainer').index();
        appendNewcolumn(groupindex);
    });

    $(document).on("click", "#addblock", function () {
        var blockid = document.getElementById(textbox);
        if ($(blockid).hasClass("group")) {
            var groupindex = $(blockid).parents('.groupcontainer').index();
            insertGroup(groupindex);
        } else if ($(blockid).hasClass("column")) {
            var groupindex = $(blockid).parents('.groupcontainer').index();
            appendNewcolumn(groupindex);
        }
    });

///////////// ITEM MANAGEMENT /////////////////

    var storedStory, storyHtml, editableStory, newStory, newStoryText;

    $(document).on("click", ".epic", function () {
        var storytextid = guid();
        var rowId = $(this).closest('.row').find('.iteration').attr('id');
        var itemId = storytextid;
        var groupIndex = $(this).closest('.grouprelease').index();
        var epicIndex = $(this).index();
        var hasItems = $(this).find('li').index();
        var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + epicIndex + ") .column").attr("id");
        console.log("rowid:  " + rowId + ", itemid:  " + itemId + ", columnId: " + columnId + ", hasItems: " + hasItems);
        var patchstr;
        if (hasItems >= 0) {
            patchstr = '{"op": "add", "path": "/data/items/' + rowId + '/' + columnId + '/-",  "value": "' + itemId + '"}';
        } else {
            patchstr = '{"data":{"items":{"' + rowId + '":{"' + columnId + '":["' + itemId + '"]}}}}';
        }
        patchJSON(currentBoardID, patchstr, $(this), "addItem", storytextid);
    });

    function boardPatchUpdate(thisObj, boardObj, objId, objId2) {
        if (boardObj === "addItem") {
            var htmlData = boxhtml("story", objId);
            if (thisObj.find("li .story").length > 0) {
                $(htmlData).insertAfter(thisObj.find("li:last-child"));
            } else {
                (thisObj.children(".stories")).append(htmlData);
            }
            var block = document.getElementById(objId);
            $(block).find(".textbox").trigger("click"); $("#blockname").focus();
            console.log('Adding board items after epic click');
        } else if (boardObj === "deleteItem") {
            var deleteitem = thisObj.closest('li');
            deleteitem.remove();
            console.log('Item removed');
        } else if (boardObj === "group") {
            var grouptextid = objId;
            var newgrouphtml = boxhtml("group", grouptextid);
            var groupreleasehtml = "<div class='grouprelease'><div class='cell-flex-container'></div></div>";
            var $newgroup = $(newgrouphtml).appendTo($("#grouparraycontainer"));
            $newgroup.find(".columnheader").each(function () { initColumnHeaderSortable(this); });
            $(".rowgroups").each(function (index) {
                $(groupreleasehtml).appendTo('.rowgroups');
                console.log('Added .grouprelease');
            });
            var block = document.getElementById(grouptextid);
            $(block).find(".textbox").trigger("click"); $("#blockname").focus();
        }
    }

    $(document).on("keydown", ".storytext", function (event) {
        var columnindex = $(this).parents(".epic").index();
        var groupindex = $(this).parents(".grouprelease").index();
        var rowindex = $(this).parents(".row").index();
        var ctrlrowindex = rowindex + 1;
        var rowId = $(this).closest('.row').find('.iteration').attr('id');
        var columnId = $(".groupcontainer:eq(" + groupindex + ")").find(".columnheader li:eq(" + columnindex + ") .column").attr("id");

        if (event.shiftKey && event.which == 13 && (event.ctrlKey == false)) {
            event.preventDefault();
            insertNewcolumn(columnindex, groupindex);
            event.stopPropagation();
        } else if (event.ctrlKey && event.which == 13 && (event.shiftKey == false)) {
            event.preventDefault();
            appendNewStory(columnindex, groupindex, ctrlrowindex);
            event.stopPropagation();
        } else if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) {
            event.preventDefault();
            if ($(this).is(':empty')) {
                console.log("Double return, empty story delete");
                deletestory($(this));
            } else {
                var storytextid = guid();
                var itemId = storytextid;
                var htmlData = boxhtml("story", storytextid);
                $(htmlData).insertAfter($(this).parent().parent());
                var block = document.getElementById(storytextid);
                $(block).find(".textbox").trigger("click"); $("#blockname").focus();
                var patchstr = '{"op": "add", "path": "/data/items/' + rowId + '/' + columnId + '/-",  "value": "' + itemId + '"}';
                patchJSON(currentBoardID, patchstr, $(this), "addItem", storytextid);
            }
            event.stopPropagation();
        }
    });

    $(document).on("focusout", ".storytext", function () {
        if ($(this).is(':empty')) { deletestory($(this)); }
    });

    function deletestory(thisObj) {
        var rowId = thisObj.closest('.row').find('.iteration').attr('id');
        var itemId = thisObj.closest('.story').attr('id');
        var groupIndex = thisObj.closest('.grouprelease').index();
        var epicIndex = thisObj.closest('.epic').index();
        var itemIndex = thisObj.parent().parent().index();
        var columnId = $(".groupcontainer:eq(" + groupIndex + ")").find(".columnheader li:eq(" + epicIndex + ") .column").attr("id");
        console.log("Delete rowid:  " + rowId + ", itemid:  " + itemId + ", columnId: " + columnId + ", itemIndex: " + itemIndex);
        var patchstr = '{"op": "remove","path": "/data/items/' + rowId + '/' + columnId + '/' + itemIndex + '"}';
        patchJSON(currentBoardID, patchstr, thisObj, "deleteItem", itemId);
    }

///////// ROW MANAGEMENT ////////////////

    $(document).on("click", ".addrelease", function () {
        addNewRelease();
    });

    function addNewRelease(iterationtextid) {
        var i = 0;
        var k = 0;
        var groupcount = $(".group").length;
        var iteration = boxhtml("iteration", iterationtextid);
        var newrelease = "<div class='row'><div class='rowheader'>" + iteration + "<div class='row-collapse-btn' title='Collapse row'><i class='fa fa-chevron-up'></i></div></div><div class='rowgroups'>";
        var newgroupstart = "<div class='grouprelease'><div class='cell-flex-container'>";
        var newgroupend = "</div></div>";
        var newepic = boxhtml("epic");

        do {
            var m = k;
            newrelease = newrelease + newgroupstart;
            var columncount = groupcolumncount(m);
            console.log("group " + k + " has " + columncount + " columnheader");
            if (columncount > 0) {
                do {
                    newrelease = newrelease + newepic;
                    i++;
                } while (i < columncount);
            }
            i = 0;
            newrelease = newrelease + newgroupend;
            k++;
        } while (k < groupcount);
        newrelease = newrelease + newgroupend + "</div></div>";

        var $newrow = $(newrelease).appendTo($("#rows"));
        $newrow.find(".stories").each(function () { initStoriesSortable(this); });
        updateRowsObj();
    }

    $(document).on("keydown", ".iterationtext", function (event) {
        var rowindex = $(this).parent().parent().parent().index();
        console.log("on keydown row index:" + rowindex);
        if (event.which == 13 && ((event.shiftKey && event.ctrlKey) == false)) {
            event.preventDefault();
            if ($(this).is(':empty') && emptyIteration(rowindex)) {
                $($(".row").eq(rowindex)).remove();
                console.log("row deleted");
            } else {
                var iterationtextid = guid();
                addNewRelease(iterationtextid);
                var block = document.getElementById(iterationtextid);
                $(block).find(".textbox").trigger("click"); $("#blockname").focus();
            }
            event.stopPropagation();
        }
    });

    function emptyIteration(rowindex) {
        var storycount = 0;
        var columnnumber = 1;
        var groupnumber = 1;
        var groupcount = $(".group").length;

        do {
            var columncount = groupcolumncount(groupnumber);
            do {
                if (epicEmpty(rowindex, groupnumber, columnnumber)) {
                    console.log("No story at - Rowindex:" + rowindex + " groupnumber:" + groupnumber + " columnnumber:" + columnnumber);
                } else {
                    console.log("Story found at - Rowindex:" + rowindex + " groupnumber:" + groupnumber + " columnnumber:" + columnnumber);
                    storycount++;
                }
                console.log("Storycount:" + storycount);
                columnnumber++;
            } while (columnnumber <= columncount);
            columnnumber = 1;
            groupnumber++;
        } while (groupnumber <= groupcount);
        if (storycount == 0) return true;
    }

//////// NOTES PANEL MANAGEMENT ///////////

    $(document).on("focus", ".textbox", function (event) {
        $("#blockdetails").html("");
        var currentText = $(this).text();
        var blockid = $(this).parent().attr("id");
        selectedBlock = blockid;
        $("#blockname").val(currentText);
        console.log("Focus on " + blockid);
        var detailsText = blockdetailsarray[blockid];
        $(".textbox").parent().removeClass('blockselected');
        $(this).parent().addClass('blockselected');
        textbox = $(this).parent().attr("id");
        var bgcolor = $(this).parent().css('background-color');
        $("#blockdetails").html(detailsText);
        $("#infobox-navbar").css('background-color', bgcolor);
        var tcolor = $(this).parent().css('color');
        $("#infobox-navbar").css('color', tcolor);
        if (subsetBoard) {
            updatesubsets();
        }
    });

    $(document).on("keyup", ".textbox", function (event) {
        var currentText = $(this).text();
        $("#blockname").val(currentText);
    });

    $(document).on("focusout", "#blockname", function (event) {
        var currentText = $(this).val();
        var blockid = document.getElementById(textbox);
        $(blockid).find(".textbox").text(currentText);
        updateBlockTitle(textbox, currentText);
    });

    $(document).on("focusout", "#blockdetails", function (event) {
        var detailsText = $(this).html();
        updateBlockDetails(textbox, detailsText);
    });

    $(document).on("click", ".row-collapse-btn", function (event) {
        event.stopPropagation();
        var $row = $(this).closest(".row");
        $row.find(".rowgroups").toggle();
        $(this).find("i").toggleClass("fa-chevron-up fa-chevron-down");
    });

});
