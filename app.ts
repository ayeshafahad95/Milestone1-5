// Function to enable inline editing for any clicked element
function makeEditable(element: HTMLElement): void {
    const previousText = element.innerText;
    element.contentEditable = "true";
    element.focus();

    // Save changes on blur (when the user clicks away)
    element.addEventListener("blur", () => {
        element.contentEditable = "false";
        if (element.innerText !== previousText) {
            element.innerText = element.innerText; // Update text without reload
        }
    });
}

// Function to dynamically create the resume and make sections editable
function generateResume(): void {
    const nameElement = document.getElementById('name') as HTMLInputElement;
    const ageElement = document.getElementById('age') as HTMLInputElement;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const phoneElement = document.getElementById('phone') as HTMLInputElement;
    const imageElement = document.getElementById('image') as HTMLInputElement;

    const name = nameElement.value;
    const age = ageElement.value;
    const email = emailElement.value;
    const phone = phoneElement.value;

    const file = imageElement.files ? imageElement.files[0] : null;
    const imageUrl = file ? URL.createObjectURL(file) : 'style/image/resume-img.jpeg';

    const educationInputs = document.querySelectorAll('.educationInput') as NodeListOf<HTMLInputElement>;
    const workInputs = document.querySelectorAll('.workInput') as NodeListOf<HTMLInputElement>;
    const skillsInputs = document.querySelectorAll('.skillsInput') as NodeListOf<HTMLInputElement>;

    const education = Array.from(educationInputs).map(input => input.value).filter(value => value.trim() !== '').join('<br>');
    const work = Array.from(workInputs).map(input => input.value).filter(value => value.trim() !== '').join('<br>');
    const skills = Array.from(skillsInputs).map(input => input.value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)).flat().join('<br>');

    const resumeHTML = `
        <div class="header">
            <div class="img-area">
                <img src="${imageUrl}" alt="Profile Picture">
            </div>
            <h1 id="resumeName">${name}</h1>
            <h3>Full-Stack Web Developer</h3>
        </div>
        <div class="main">
            <div class="left">
                <h2>Personal Information</h2>
                <p><strong>Name:</strong> <span id="editableName">${name}</span></p>
                <p><strong>Age:</strong> <span id="editableAge">${age}</span></p>
                <p><strong>Email:</strong> <span id="editableEmail">${email}</span></p>
                <p><strong>Phone:</strong> <span id="editablePhone">${phone}</span></p>
                <h2>Education</h2>
                <p id="editableEducation">${education}</p>
                <h2>Skills</h2>
                <p id="editableSkills">${skills}</p>
            </div>
            <div class="right">
                <h2>Work Experience</h2>
                <p id="editableWork">${work}</p>
            </div>
        </div>
    `;

    const resumeOutput = document.getElementById('resumeOutput');
    if (resumeOutput) {
        resumeOutput.innerHTML = resumeHTML;

        // Make sections editable
        const editableElements = [
            'editableName',
            'editableAge',
            'editableEmail',
            'editablePhone',
            'editableEducation',
            'editableSkills',
            'editableWork'
        ];

        editableElements.forEach(id => {
            const element = document.getElementById(id) as HTMLElement;
            if (element) {
                element.addEventListener('click', () => makeEditable(element));
            }
        });

        // Generate unique URL
        const uniqueUrl = `https://yourdomain.com/resume/${name.toLowerCase()}`;
        document.getElementById('resumeOutput')!.insertAdjacentHTML('beforeend', `
            <p><strong>Share your resume:</strong> <a href="${uniqueUrl}" target="_blank">${uniqueUrl}</a></p>
            <button onclick="downloadResume()">Download PDF</button>
        `);
    }
}

// Function to download the resume as a PDF using html2pdf

declare var html2pdf: any; // Declare html2pdf
function downloadResume(): void {
    const resume = document.getElementById('resumeOutput');
    if (resume) {
        const opt = {
            margin: 0.5,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(resume).set(opt).save();
    }
}
