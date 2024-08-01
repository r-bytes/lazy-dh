/**
 * Triggers a browser download of a PDF file.
 * @param {Blob | string} pdfBlob The PDF file data as a Blob or Base64 encoded string.
 * @param {string} filename The name of the file to save.
 */
const downloadPDF = (pdfBlob: string, filename: string) => {
  // Create a Blob from the PDF data
  let blob;
  if (typeof pdfBlob === "string") {
    // If the data is a base64 string, convert it to a Blob
    const byteCharacters = atob(pdfBlob.replace(/^data:application\/pdf;base64,/, ""));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], { type: "application/pdf" });
  } else {
    // If it's already a Blob, use it directly
    blob = pdfBlob;
  }

  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger the download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename || "download.pdf";
  document.body.appendChild(anchor); // Append anchor to the body
  anchor.click(); // Trigger download

  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
};

export default downloadPDF;
