// A simple script to find temperatures in farenheit and convert them to celcius.

walk(document.body);

function walk(node) {
    var child;

    switch (node.nodeType) {
        case 1: // Element
            for (child = node.firstChild;
                child;
                child = child.nextSibling) {
                walk(child);
            }
            break;

        case 3: // Text node

            tempCheck(node);

            break;
    }
}

function tempCheck(node) {
    
    var reTemp = /\b((\d{2,3})\s*\-*(to)*\s*)?(\d{2,3})'*\s*\u00B0*\u00BA*\s*f\b/gi;
    var nodeText = node.nodeValue;
    var first = 0;
    var newFragment = document.createDocumentFragment();

    // Check for Fahrenheit temperature match.
    for (match = reTemp.exec(nodeText); match != null; match = reTemp.exec(nodeText)) {
                
        // Attach the text leading up to the first match.
        var leadUp = nodeText.substring(first, reTemp.lastIndex - match[0].length);
        var leadUpNode = document.createTextNode(leadUp);
        newFragment.appendChild(leadUpNode);
                
        // Convert the matched F temp to C and create a new span for it.
        var newSpan = document.createElement('span');
        newSpan.setAttribute('class', 'f2c_temp');
        newSpan.setAttribute('title', match[0]);

        var tempInC = document.createTextNode(convertTemp(match));
        newSpan.appendChild(tempInC);
        newFragment.appendChild(newSpan);
                    
        first = reTemp.lastIndex;
    }
            
    // Alter the original text node to be the remaining text
    var endText = nodeText.substring(first, nodeText.length);
    node.nodeValue = endText;
            
    // Insert the new nodes before the old text node.
    node.parentNode.insertBefore(newFragment, node);
    
}

function convertTemp(match) {

    var replacement = '';

    var num1 = parseFloat(match[2]);
    if (!isNaN(num1)) {
        replacement += ((num1 - 32) * 5/9).toFixed(2) + ' - ';
    }
            
    var num2 = parseFloat(match[4]);
    if (!isNaN(num2)) {
        replacement += ((num2 - 32) * 5/9).toFixed(2) + ' \u00B0C';
    }

    return replacement;
    
}