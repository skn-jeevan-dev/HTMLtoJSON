function toggleInput() {
    var dropdown = document.getElementById('fileOption');
    var fileInput = document.getElementById('htmlFile');

    if (dropdown.value === 'userFile') {
        fileInput.style.display = 'block';
        fileInput.style.margin = '5px';
    } else {
        fileInput.style.display = 'none';
    }
}

    function convertToJson() {
        const fileOption = document.getElementById('fileOption');
        const selectedOption = fileOption.value;

        if (selectedOption === 'userFile') {
            
            const fileInput = document.getElementById('htmlFile');

            
            if (fileInput.files.length > 0) {
               
                handleFile(fileInput.files[0]);
            } else {
                alert('Please select an HTML file.');
            }
        } else {
          
            const sampleFileName = (selectedOption === 'sampleFile1') ? 'html1' : 'html2';

            
            fetch(`./${sampleFileName}.html`)
                .then(response => response.text())
                .then(htmlContent => {
                    
                    handleFileContent(htmlContent);
                })
                .catch(error => console.error('Error fetching sample file:', error));
        }
    }

    function handleFile(file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const htmlContent = e.target.result;
            
            handleFileContent(htmlContent);
        };

        reader.readAsText(file);
    }

    function handleFileContent(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const capitals = [];

        // Get elements with class "state" and "capital"
        const stateElements = doc.getElementsByClassName('state');
        const capitalElements = doc.getElementsByClassName('capital');

        // Ensure equal number of "state" and "capital" elements
        if (stateElements.length === capitalElements.length) {
            for (let i = 0; i < stateElements.length; i++) {
                const state = stateElements[i].textContent.trim();
                const capital = capitalElements[i].textContent.trim();
                capitals.push({ capital, state });
            }

            const numberOfCapitals = capitals.length;

            // Create the JSON object
            const jsonData = {
                capitals,
                summary: {
                    numberOfCapitals
                }
            };

            // Convert object to JSON
            const jsonString = JSON.stringify(jsonData);

            // Create a Blob containing the JSON data
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create a link to download the JSON file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.json';

            // Append the link to the document and trigger the click event
            document.body.appendChild(link);
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
        } else {
            alert('Number of "state" and "capital" elements should be the same.');
        }
    }
