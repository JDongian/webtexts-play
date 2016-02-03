var TIMEOUT = 800;
var LONG_TIMEOUT = 3000;

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

function getQuestionOptions(index) {
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
    console.log("STATUS: CHOOSING ANSWER (" + opt.slice(0,16) + "...)");
    chooseAnswerByLabelText(q, opt); 
    setTimeout(function() {
        var success = checkResult();
        reset(); // Hopefully completes in the timeout (!!!)
        console.log("STATUS: RESETTING");
        setTimeout(function() {
            cb(success);
        }, TIMEOUT);
    }, TIMEOUT);
}

//cb(correctOption)
function tryOptions(q, i, texts, cb) {
    text = texts[i];
    
    chooseVerifyReset(q, text, function(success) {
        if (success) {
            cb(text);
        } else {
            console.log("STATUS: RETRYING");
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
        console.log("STATUS: SAVING ANSWER");
        answers[index-1] = ans;
        cb(answers, index);
    });
}

function answeringChain(cb, count) {
    return function(answers, index) {
        index++;
        if (index < count) {
            console.log("STATUS: NEXT QUESTION (" + index + ")");
            determineAnswer(index, answers, answeringChain(cb, count));
        } else {
            console.log("STATUS: LAST QUESTION (" + index + ")");
            setTimeout(determineAnswer(index, answers, cb), TIMEOUT);
        }
    }
}

// cb(answers)
function determineAnswers(cb) {
    answers = [];
    var count = $(".questionset ul").length;
    // We need these to be serial.
    determineAnswer(1, answers, answeringChain(cb, count));
}

function chooseAnswers(answers) {
    console.log("STATUS: SENDING ANSWERS");
    answers.forEach(function(answer, index) {
        chooseAnswerByLabelText(index+1, answer);
    });
}

function next() {
    console.log("STATUS: NEXT PAGE");
    $("div.next a span").click(); 
}

function finishCurrent(cb) {
    // Seeing things is nice
    $(".toggle-study-questions").focus();
    $(".toggle-study-questions").trigger("click");

    determineAnswers(function (answers) {
        chooseAnswers(answers);
        setTimeout(cb(), TIMEOUT);
        //cb();
    });
}

function finishAll() {
    finishCurrent(function() {
        next();
        setTimeout(function() {
            finishAll();
        }, LONG_TIMEOUT);
    });
}

//finishAll();
finishCurrent(next);
