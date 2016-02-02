function isComplete(arr) {
    if (arr.length != 0) {
        return false;
    }
    for (var i = 0, len = arr.length; i < len; i++) {
        if (typeof arr[i] === "undefined") {
            return false;
        }
    }
    return true;
}

function trim (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function checkResult() {
    return $(".incorrect").length == 0;
}

function getQuestionByIndex(i) {
    return $("ul.questionset li:nth-child(" + i + ") ul");
}

function getQuestionOptions(i) {
    texts = [];
    getQuestionByIndex(index).children().slice(0, -1).each(function(i) {
        //texts.push($(this).children().last().html());
        texts.push(trim($(this).children().last().html()));
    });
    return texts;
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

// cb(success)
function chooseVerifyReset(q, opt, cb) {
    // Hopefully completes in the timeout (!!!)
    chooseAnswerByLabelText(q, opt); 
    setTimeout(function() {
        var success = checkResult();
        reset(); // Hopefully completes in the timeout (!!!)
        setTimeout(function() {
            cb(success);
        }, 1000);
    }, 1000);
}

//cb(correctOption)
function tryOptions(q, i, texts, cb) {
    text = texts[i];
    
    chooseVerifyReset(q, text, function(success) {
        if (success) {
            cb(text);
        } else {
            if (i < texts.length) {
                tryOptions(q, i+1, texts, cb);
            }
        }
    });
}

// cb(answers)
function determineAnswer(index, answers, cb) {
    texts = getQuestionOptions(index);
    tryOptions(index, 0, texts, function(ans) {
        answers[index] = ans;
        if (answers.length === texts.length && isComplete(answers)) {
            cb(answers);
        }
    });
}

// cb(answers)
function determineAnswers(qs, cb) {
    answers = [];
    qs.each(function (q) {
        determineAnswer(q, answers, cb);
    });
}

function chooseAnswers(answers) {
}

$(".toggle-study-questions").focus();
$(".toggle-study-questions").trigger("click");

determineAnswers($(".questionset ul"), chooseAnswers);
