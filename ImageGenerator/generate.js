const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "#";
let isImageGenerating = false ;


const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".image-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        // Set the image source to the AI Generated image data
        const aiGeneratingImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratingImg;

        // When the image is loaded, remove the loading class and set download attributes
        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratingImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);

        }
    })
    }

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        // Send a request to OpenAI API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
            });

            if(!response.ok) throw new Error("Oops! Image generation is currently unavailable due to API access limits. Stay tuned - we'll be back with magical images soon!");

            const { data } = await response.json();  // Get data from the response
            updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }finally{
        isImageGenerating = false;
    }
}


const handelFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;
    
    // Get user input & image quantity from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity},
        () =>
            `<div class="image-card loading">
            <img src="./images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="./images/download.svg" 
                alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;

    generateAiImages(userPrompt, userImgQuantity);

}

generateForm.addEventListener("submit", handelFormSubmission);