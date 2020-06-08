export const CopyToClipboard = (text) => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
