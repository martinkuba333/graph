$(document).ready(function() {
    var monthInYear = 12;
    var platby = $(".platby .inputs");
    var vyplaty = $(".vyplaty .inputs");

    var platbyGraph = $(".platby .graph");
    var vyplatyGraph = $(".vyplaty .graph");

    var clickButton = $("body > div > h2");
    var additionToId = "In";

    var inputsPlatby = {
        "Jednorázová investícia": ["eur", 200000],
        "Pravidelná investícia": ["eur", 10000],
        "Predpokladaný ročný výnos": ["%", 12],
        "Dĺžka sporenia": ["rok", 50],
        "Vstupný poplatok": ["%", 5]
    };
    var inputsPlatbyKey = [];

    for (var i = 0; i < clickButton.length; i++) {
        clickButton[i].addEventListener("click", showHide);
    }

    for (var key in inputsPlatby) {
        createInputPlatby(platby, key);
        var updateKey = key.replace(/ /g , "_");
        inputsPlatbyKey.push("#" + updateKey + additionToId);
    }

    function showHide() {
        var SHOW_CLASS_NAME = "show";
        var HIGHLIGHT_CLASS_NAME = "highlight";
        var sibling = this.parentNode.getElementsByTagName("div")[0];

        if (sibling.classList.contains(SHOW_CLASS_NAME)) {
            sibling.classList.remove(SHOW_CLASS_NAME);
            this.classList.remove(HIGHLIGHT_CLASS_NAME);
        } else {
            sibling.classList.add(SHOW_CLASS_NAME);
            this.classList.add(HIGHLIGHT_CLASS_NAME);
        }
    }

    function createInputPlatby(ele, key) {
        var updateKey = key.replace(/ /g , "_");
        var updateKeyIn = updateKey + additionToId;

        $(ele)
            .append($("<div>")
                .append($("<h3>").text(key))
                .append($("<input>")
                    .attr({
                        type: "range",
                        class: "slider",
                        value: 0,
                        min: 0,
                        max: inputsPlatby[key][1],
                        name: updateKeyIn,
                        id: updateKeyIn
                    })
                    .on("input", function() {
                        $("#" + updateKey)[0].value = $("#" + updateKeyIn)[0].value;
                        prepareCalculation();
                    }))
                .append($("<input>")
                    .attr({
                        type: "text",
                        name: "updateKey",
                        id: updateKey,
                        value: 0
                    })
                    .on("input", function() {
                        var ele = $("#" + updateKey)[0];
                        if (!isNaN(ele.value)) {
                            $("#" + updateKeyIn)[0].value = parseInt(ele.value, 10);
                            prepareCalculation();
                        }
                    }))
                .append($("<p>")
                    .text(inputsPlatby[key][0]))
                .addClass("inputGroup"))
    }

    function prepareCalculation() {
        var one = $(inputsPlatbyKey[0])[0].value;
        var repeat = $(inputsPlatbyKey[1])[0].value * monthInYear;
        var income = $(inputsPlatbyKey[2])[0].value;
        var time = $(inputsPlatbyKey[3])[0].value;
        var fee = $(inputsPlatbyKey[4])[0].value;

        var result = calculate(one, repeat, income, time, fee);

        createGraph(result, one, repeat, income, time);
    }

    function calculate (one, repeat, income, time, fee) {
        var invested = one - one * (fee / 100);
        var result = [];

        for (var i = 0; i < time; i++) {
            invested += repeat - repeat * (fee / 100);
            invested = invested * (income / 100 + 1);
            result.push(Math.floor(invested));
        }
        return result;
    }

    function calculateHeightOfColumnTime(time, result) {
        var divisionConst = 150;
        var yearConst = 10;
        var basicNum = 100;

        if (time > yearConst * 4) return basicNum * 4 * time + Math.floor(result / divisionConst);
        if (time > yearConst * 3) return basicNum * 3 * time + Math.floor(result / divisionConst);
        if (time > yearConst * 2) return basicNum * 2 * time + Math.floor(result / divisionConst);
        if (time > yearConst) return basicNum * time + Math.floor(result / divisionConst);
        if (result > 200000) return basicNum * time + Math.floor(result / divisionConst);
        if (time == 1 && result > 10000) return 10000;
        return basicNum * time;
    }

    function createGraph(result, one, repeat, income, time) {
        var divisionNum = calculateHeightOfColumnTime(time, result[result.length - 1]);

        platbyGraph.empty();

        for (var i = 0; i < result.length; i++) {
            var columnWidth = Math.floor(parseInt(platbyGraph.css("width"), 10) / (parseInt(time, 10) + 9));

            platbyGraph.append($("<div>")
                .attr({
                    class: "columnGraph"
                })
                .css({
                    "width": columnWidth + "px",
                    "left": i * columnWidth + i * 3 + "px",
                    "height": result[i] / divisionNum + "px"
                })
                .append($("<div>")
                    .attr({
                        class: "infoHover"
                    })
                    .html("Rok " + (i + 1) +
                        "<br>" + "Výsledná suma: " + result[i] +
                        "<br>" + "Pravidelná investícia: " + repeat +
                        "<br>" + "Jednorázová investícia: " + one)
                )
            );
        }
    }
});
