



//*************************************************************
// CkEditor task part
//*************************************************************


var timerId = 0;

$(document).ready(function () {

    if ($("#btnSelectAll").length) {
        $('#btnSelectAll').click(function (e) {
            SelectAll();
        });
    }
    if ($("#btnSelectSecondParagraph").length) {
        $('#btnSelectSecondParagraph').click(function (e) {
            SelectSecondParagraph();
        });
    }

    if ($('#editor1').length) {
        CKEDITOR.on('instanceReady', function (e) {
            LoadCkEditorDataToDiv();
            //UpdateDivCkEditorContent();
            UpdateDivCkEditorContentWithDelay();

        });
    }

});

//retrieve html from ckeditor, remove img tag and load to myDiv
function LoadCkEditorDataToDiv() {
    var editor = CKEDITOR.instances["editor1"];
    var htmldata = editor.document.getBody().getHtml();
    var newHtmlData = RemoveImgElementFromHtml(htmldata);
    document.getElementById("CkEditorData").innerHTML = newHtmlData;
    //$('#CkEditorData').html(newHtmlData);



}

//Remove img 
function RemoveImgElementFromHtml(htmlData) {
    //htmlData = $(htmlData).find("img").remove().end();
    htmlData = htmlData.replace(/<img[^>]*>/g, "");
    return htmlData;
}

//Update my div CkEditor content when CkEditor change event fire
function UpdateDivCkEditorContent() {
    for (var i in CKEDITOR.instances) {
        CKEDITOR.instances[i].on('change', function () {
            LoadCkEditorDataToDiv();
        });
    }
}

//Update new div CkEditor content when CkEditor change event fire
function UpdateDivCkEditorContentWithDelay() {
    CKEDITOR.instances["editor1"].on('change', function () {
        clearTimeout(timerId);
        timerId = 0;
        timerId = setTimeout(function () { LoadCkEditorDataToDiv() }, 500);
    });
}

// Select All text inside CkEditor
function SelectAll() {
    var editor = CKEDITOR.instances["editor1"];
    var range = editor.createRange();
    range.setStartAt(range.root, CKEDITOR.POSITION_AFTER_START);
    range.setEndAt(range.root, CKEDITOR.POSITION_BEFORE_END);
    editor.getSelection().selectRanges([range]);
}

// Select second paragraph inside CkEditor
function SelectSecondParagraph() {
    var editor = CKEDITOR.instances["editor1"];
    var childs = editor.document.getElementsByTag("p");
    var paragraphElement = childs.getItem(1);
    var selection = editor.getSelection();
    selection.selectElement(paragraphElement);

}

//*************************************************************
// JavaScript data manipulation task part
//*************************************************************

var x = {
    "a": {
        "name": "a",
        "set": ["set1", "set2"],
        "permission": "all"
    },
    "b": {
        "name": "b",
        "set": ["set2"],
        "permission": "all"
    },
    "c": {
        "name": "c",
        "set": ["set2", "set3"],
        "permission": "owner"
    }
};

$(document).ready(function () {

    if ($("#btnFilterPermission").length) {
        $('#btnFilterPermission').click(function (e) {
            result = filterPermissions(x, "all");
            //result = filterPermissions(x, "owner");
            for (var prop in result) {
                document.getElementById("task").innerHTML = document.getElementById("task").innerHTML +'"' + prop + '":' + JSON.stringify(result[prop], null, 4) + "<br>";
            }


        });
    }

    if ($("#btnMap").length) {
        $('#btnMap').click(function (e) {
            result = mapX(x, "set");

            // print the mapResult object
            document.getElementById("task").innerHTML = "";
            for (var prop in result) {
                document.getElementById("task").innerHTML = document.getElementById("task").innerHTML + '"' + prop + '":' + JSON.stringify(result[prop], null, 4) + "<br>";
            }
        });
    }
});



//Function filter data structure by permission parameter and return the found objects
function filterPermissions(structToManipulation, perm) {
    var returnSets = {};
    var result = _.mapValues(structToManipulation, function (chr) {
        return chr.permission == perm;
    });
    for (var index in structToManipulation) {
        var object = result[index];
        if (object) {
            returnSets[index] = structToManipulation[index];
        }
    }
    return returnSets;
};



// function that  map/group x values by set 
function mapX(structToMap, mapBy) {
    var returnSets = {};

    for (var setIndex in structToMap) {
        var setObject = structToMap[setIndex];
        for (var i = 0; i < setObject[mapBy].length; i++) {
            var setName = setObject[mapBy][i];

            if (typeof (returnSets[setName]) == "undefined") {
                returnSets[setName] = [];
            }
            returnSets[setName].push(setObject);
        }
    }
    return returnSets;
}






