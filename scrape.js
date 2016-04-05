function copyToClipboard(text) {
    window.prompt("Copy:", text); // TODO: modal include
}

function getParagraphTexts() {
    return $("#main-column")
        .children("p")
        .map(function(){
        return $(this).text();
    }).get().join("\n");
}

copyToClipboard(getParagraphTexts());
