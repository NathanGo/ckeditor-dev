
//*************************************************************
// CkEditor task Part
//*************************************************************
var timerId = 0;

$(document).ready(function () {

    $('#btnSelectAll').click(function (e) {
        SelectAll();
    });
    $('#btnSelectSecondParagraph').click(function (e) {
        SelectSecondParagraph();
    });
    CKEDITOR.on('instanceReady', function (e) {
        LoadCkEditorDataToDiv();
        //UpdateDivCkEditorContent();
        UpdateDivCkEditorContentWithDelay();

    });
});

//retrieve html from ckeditor, remove img tag and load to myDiv
function LoadCkEditorDataToDiv() {
    var editor = CKEDITOR.instances["editor1"];
    var htmldata = editor.document.getBody().getHtml();
    var newHtmlData = RemoveImgElementFromHtml(htmldata);
    $('#CkEditorData').html(newHtmlData);



}

//Remove img 
function RemoveImgElementFromHtml(htmlData) {
    htmlData = $(htmlData).find("img").remove().end();
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
// JavaScript objects task Part
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
    $('#btnFilterPermission').click(function (e) {
        result = filterPermissions(x, "owner");
        document.getElementById("task").innerHTML = JSON.stringify(result, null, 4);

    });
    $('#btnMap').click(function (e) {
        result = mapX(x, "set");

        // print the mapResult object
        document.getElementById("task").innerHTML = "";
        for (var prop in result) {
            document.getElementById("task").innerHTML = document.getElementById("task").innerHTML + '"' + prop + '":' + JSON.stringify(result[prop], null, 4) + "<br>";
        }
    });
});



//Function filter data structure by permission parameter and return the found object
function filterPermissions(structToManipulation, perm) {
    var result = _.findKey(structToManipulation, function (chr) {
        return chr.permission == perm;
    });
    var newObject = new Object();
    var d = result.toString();
    newObject[result] = structToManipulation[result];
    return newObject;

};



// function that  map x values by set 
function mapX(structToMap, mapBy) {
    var newObject = new Object;
    //get from original objects existing sets
    var setsArray = getExistingSetsFromObjects(structToMap, mapBy);

    //this block going through all the objects and group the objects by set
    for (var item in setsArray) {
        var tempArray = new Array();
        for (var key in structToMap) {
            var obj = structToMap[key];
            for (var prop in obj) {
                if (prop === mapBy) {
                    for (var s in obj[prop]) {
                        //check if set exist in original object and push to new array
                        if (obj[prop][s] === setsArray[item]) {
                            tempArray.push(obj);
                        }
                    }
                }
            }
        }
        // set new array to new "set" object
        newObject[setsArray[item]] = tempArray;
    }
    return newObject;
}

// get uniq array of existing set
function getExistingSetsFromObjects(struct, getProp) {
    var arr = new Array();
    for (var key in struct) {
        var obj = struct[key];
        for (var prop in obj) {
            if (prop === getProp) {
                for (var s in obj[prop]) {
                    arr.push(obj[prop][s]);
                }
            }
        }
    }
    return _.uniq(arr);
}
