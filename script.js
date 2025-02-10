document.getElementById("download-btn").addEventListener("click", modifyAndDownload);

async function modifyAndDownload() {
    try {
        // Fetch the original Office document
        const response = await fetch('employee_confidential.docx');
        if (!response.ok) throw new Error("Failed to load the document.");
        
        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);

        // Read document.xml (contains the text content of the .docx file)
        const docXml = await zip.file("word/document.xml").async("string");

        // Modify content by adding custom text
        const newContent = "<w:p><w:r><w:t>Confidential Notice: This document was modified.</w:t></w:r></w:p>";
        const modifiedXml = docXml.replace("</w:body>", `${newContent}</w:body>`);

        // Replace the document.xml inside the ZIP
        zip.file("word/document.xml", modifiedXml);

        // Generate modified .docx file
        const modifiedBlob = await zip.generateAsync({ type: "blob" });

        // Trigger download
        saveAs(modifiedBlob, "modified_employee_confidential.docx");
    } catch (error) {
        console.error("Error modifying document:", error);
        alert("Failed to modify the document.");
    }
}
