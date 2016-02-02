function trim (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function checkResult() {
    return $(".incorrect").length == 0;
}

function getQuestionByIndex(i) {
    return $("ul.questionset li:nth-child(" + i + ") ul");
}


function chooseAnswer(li) {
    li.children().last().click(); // label
    li.children().first().trigger("click"); //input
}

function chooseAnswerByLabelText(index, text) {
    var match;
    getQuestionByIndex(index).children().slice(0, -1)
        .each(function() {
        if (trim($(this).children().last().html()) == text) {
            chooseAnswer($(this));
            match = $(this);
        }
    });
    return match;
}

function reset() {
    $("div.clear-answers > form > a.submit").trigger("click");
}

function tryAnswers(q, i, texts, agg) {
    setTimeout(function () {
        text = texts[i];
        
        chooseVerifyReset(q, text, );
        chooseAnswerByLabelText(q, text);

        if (i < texts.length) {
            tryAnswers(q, i+1, texts, agg);
        } else {
        }
    }, 1000)
}

function determineAnswer(index) {
    texts = [];
    getQuestionByIndex(index).children().slice(0, -1).each(function(i) {
        texts.push(trim($(this).children().last().html()));
    });
    //console.dir(texts);
    agg = []
    tryAnswers(index, 0, texts, agg);
    return agg;
}

function determineAnswers(qs, cb) {
    answers = [];
    qs.each(function (i) {
        answers.push($(this).determineAnswer(i));
    });
    
    // Possibly busy wait here
    // possibly have [i, answer] pairs?

    cb(answers);
}

$(".toggle-study-questions").focus();
$(".toggle-study-questions").trigger("click");

determineAnswers($(".questionset ul"), chooseAnswers);
