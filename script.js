document.getElementById('processBtn').addEventListener('click', async function() {
    const docxFile = document.getElementById('docxInput').files[0];
    const status = document.getElementById('status');
  
    if (!docxFile) {
      status.innerText = 'Please select a DOCX file.';
      status.style.color = 'red';
      return;
    }
  
    try {
      status.innerText = 'Processing file...';
      status.style.color = 'blue';
  
      const docxArrayBuffer = await docxFile.arrayBuffer();
      const zip = await JSZip.loadAsync(docxArrayBuffer);
  
      const vbaMacroCode = `
        Attribute VB_Name = "Module1"
        Sub Auto_Open()
            MsgBox "Hello! This is a test macro."
        End Sub
      `;
  
      const vbaProjectBin = new Blob([vbaMacroCode], { type: "application/octet-stream" });
      zip.file("vbaProject.bin", vbaProjectBin);
  
      const newDocmBlob = await zip.generateAsync({ 
        type: "blob", 
        mimeType: "application/vnd.ms-word.document.macroEnabled.12" 
      });
  
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(newDocmBlob);
      downloadLink.download = "macroEnabled.docm";
      downloadLink.click();
  
      status.innerText = 'Macro injected successfully!';
      status.style.color = 'green';
    } catch (err) {
      console.error("Error processing file:", err);
      status.innerText = "An error occurred while processing the file.";
      status.style.color = 'red';
    }
  });
  