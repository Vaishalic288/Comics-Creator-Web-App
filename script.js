const panelGroup = document.querySelector('.panel-group');
const comicForm = document.getElementById('comicForm');
const comicStrip = document.querySelector('.comic-strip');

//show message for waiting while images are loading
const submitButton = document.getElementById('submitButton');
const hiddenDiv = document.getElementById('hiddenDiv');

submitButton.addEventListener('click', () => {
    hiddenDiv.classList.remove('hidden');
});
// Function to generate and append a panel element
function createPanelElement(panelNumber) {
    const panel = document.createElement('div');
    panel.classList.add('panel');

    const label = document.createElement('label');
    label.setAttribute('for', `panel${panelNumber}`);
    label.textContent = `Enter the Text for Image ${panelNumber}:`;
    panel.appendChild(label);

    const textarea = document.createElement('textarea');
    textarea.id = `panel${panelNumber}`;
    textarea.name = `panel${panelNumber}`;
    textarea.rows = 5;
    panel.appendChild(textarea);

    panelGroup.appendChild(panel);
}

// Generate panel elements for all 10 panels
for (let i = 1; i <= 10; i++) {
    createPanelElement(i);
}

comicForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const panelTexts = [];
    for (let i = 1; i <= 10; i++) {
        const panelText = document.getElementById(`panel${i}`).value;
        panelTexts.push(panelText);
    }

    const panelImages = await generateComicPanels(panelTexts);

    // Clear existing comic panels
    comicStrip.innerHTML = '';

    // Add generated comic panels
    for (const panelImage of panelImages) {
        const comicPanel = document.createElement('div');
        comicPanel.classList.add('comic-panel');

        const comicImage = document.createElement('img');
        comicImage.src = panelImage.url;
        comicImage.alt = panelImage.text;

        comicPanel.appendChild(comicImage);
        comicStrip.appendChild(comicPanel);
    }
});

// Function to generate comic panels using the provided API function
async function generateComicPanels(panelTexts) {
    const promises = [];
    for (const panelText of panelTexts) {
        const promise = query({ "inputs": panelText }).then((response) => {
            const imageURL = URL.createObjectURL(response);
            return { text: panelText, url: imageURL };
        });
        promises.push(promise);
    }

    return Promise.all(promises);
}


async function query(data) {
	const response = await fetch(
		"https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
		{
			headers: { 
				"Accept": "image/png",
				"Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM", 
				"Content-Type": "application/json" 
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}