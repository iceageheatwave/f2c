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
    
    // Regex returns an array containing:
    // [0] The entire match.
    // [1] Weight value, null if temp.
    // [2] Weight units, null if temp.
    // [3] First temp if a range exists, null if weight or no range.
    // [4] Second temp if a range exists, or the lone temp. null if weight.
    var re = /\b(\d{1,4})\s*(lbs?|#|ozs?)|(?:\b(?:(\d{2,3})\s*(?:-|to)\s*)?(\d{2,3})'?\s*\u00B0?\u00BA?\s*f)\b/gi;

    var nodeText = node.nodeValue;
    var first = 0;
    var newFragment = document.createDocumentFragment();

    // Check for Fahrenheit temperature match.
    for (match = re.exec(nodeText); match != null; match = re.exec(nodeText)) {

        console.log(match);
        
        
        // Attach the text leading up to the first match.
        var leadUp = nodeText.substring(first, re.lastIndex - match[0].length);
        var leadUpNode = document.createTextNode(leadUp);
        newFragment.appendChild(leadUpNode);

        var spanText = convert(match);

        // Create a new span for the converted value.
        var newSpan = document.createElement('span');
        newSpan.setAttribute('class', 'f2c');
        newSpan.setAttribute('title', match[0]);

        var tempInC = document.createTextNode(spanText);
        newSpan.appendChild(tempInC);
        newFragment.appendChild(newSpan);
                    
        first = re.lastIndex;
    }
            
    // Alter the original text node to be the remaining text
    var endText = nodeText.substring(first, nodeText.length);
    node.nodeValue = endText;
            
    // Insert the new nodes before the old text node.
    node.parentNode.insertBefore(newFragment, node);
    
}

function convert(match) {
    
    var replacement = '';
    
    // Determine if the match is for a weight or temperature.
    if (match[2] != null) {
            
        // Weight conversion.
        replacement = convertWeight(match);
        
    } else if (match[4] != null) {
            
        // Temperature conversion.
        var num1 = parseFloat(match[3]);
        if (!isNaN(num1)) {
            replacement += convertTemp(num1) + ' - ';
        }
            
        var num2 = parseFloat(match[4]);
        if (!isNaN(num2)) {
            replacement += convertTemp(num2) + ' \u00B0C';
        }
            
    }
        
    return replacement;
    
}


function convertTemp(temp) {

    return ((temp - 32) * 5/9).toFixed(2);
    
}


function convertWeight(match) {
    
    var replacement = '';
    var value = parseFloat(match[1]);
    
    if (match[2].search(/lb|#/) != -1) {
            
        // Pounds.
        replacement = (value * 0.453592).toFixed(2) + 'kg';
            
    } else {
            
        // Ounces.
        replacement = (value * 28.3495).toFixed(2) + 'g';
            
    }
    
    return replacement;
    
}

