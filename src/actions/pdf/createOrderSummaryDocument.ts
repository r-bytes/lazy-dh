import { InvoiceDetails } from "@/lib/types/invoice";
import Product from "@/lib/types/product";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function createOrderSummaryDocument(orderItemsData: Product[], invoiceDetails: InvoiceDetails) {
  console.log("==========>", orderItemsData);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const { width, height } = page.getSize();

  const red = 250 / 255;
  const green = 204 / 255;
  const blue = 21 / 255;

  // Fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // const startY = height - 500;

  // Fetch and place the logo image
  const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`;
  const logoImageResponse = await fetch(logoUrl);
  const logoImageBytes = new Uint8Array(await logoImageResponse.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);

  // Calculate dimensions for the logo placement (smaller and on the left)
  const logoWidth = 60; // Reduced size
  const logoHeight = logoImage.height * (logoWidth / logoImage.width);
  const logoX = 50; // Left side of the page
  const logoY = height - logoHeight - 20; // 20 points padding from the top edge

  // Place the logo image
  page.drawImage(logoImage, {
    x: logoX,
    y: logoY,
    width: logoWidth,
    height: logoHeight,
  });

  // Company name and slogan
  const companyNameX = (width - logoWidth - 150) / 2 + logoWidth - 100; // Center between logo and right edge
  const companyNameY = height - 80; // Slightly lower on the page

  page.drawText("Lazo Den Haag Spirits", {
    x: companyNameX,
    y: companyNameY,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Authentieke Smaken uit Griekenland en Bulgarije", {
    x: companyNameX,
    y: companyNameY - 20,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Title (Factuur) on the right
  page.drawText("Factuur", {
    x: width - 150,
    y: logoY + logoHeight - 30,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Address Blocks
  const addressBlockY = companyNameY - 100; // Adjust this value to move both address blocks down
  const addressDetails = `
    ${invoiceDetails.companyName ? invoiceDetails.companyName : invoiceDetails.invoiceCustomerName}
    ${invoiceDetails.invoiceCustomerAddress}
    ${invoiceDetails.invoiceCustomerPostal} ${invoiceDetails.invoiceCustomerCity}
    ${invoiceDetails.invoiceCustomerCountry}`;

  const lazoDetails = `
    Kaapseplein 76
    2572NG Den Haag
    info@lazodenhaagspirits.nl
    070-380 4724 / 06-55 174 175
    KvK: 71.114.041
    Btw: NL002364298B87
    Bank: NL 06 INGB0004 7737 67`;

  page.drawText("Factuuradres:", {
    x: 50,
    y: addressBlockY + 50,
    size: 8,
    font: boldFont,
    lineHeight: 4,
  });
  page.drawText(addressDetails, {
    x: 40,
    y: addressBlockY + 50,
    size: 8,
    font: regularFont,
    lineHeight: 10,
  });

  const lazoBlockX = width / 2 + 50; // Center the Lazo block more to the right

  page.drawText(lazoDetails, {
    x: lazoBlockX + 55,
    y: addressBlockY + 50,
    size: 8,
    font: regularFont,
    lineHeight: 10,
  });

  // Additional Info Blocks
  const referenceY = addressBlockY - 150;

  page.drawText("Referentie:", {
    x: 50,
    y: referenceY + 80,
    size: 8,
    font: boldFont,
  });
  page.drawText(invoiceDetails.invoiceNumber, {
    x: 50,
    y: referenceY + 70,
    size: 8,
    font: regularFont,
  });

  const referenceInfoRight = `
    Opdracht: ${invoiceDetails.orderNumber}
    Factuur: ${invoiceDetails.invoiceNumber}
    Factuurdatum: ${invoiceDetails.date}
  `;

  page.drawText(referenceInfoRight, {
    x: 405,
    y: referenceY + 90,
    size: 8,
    font: regularFont,
    lineHeight: 10,
  });

  // Table Offset and Styles
  const tableStartY = height - 300; // Adjust based on your layout
  const summaryStartY = tableStartY - 300; // Adjust based on content
  const footerStartY = 70; // Increased to accommodate new text

  const fontSize = 8;
  const lineSpacing = 15;

  // Headers for the table (new order)
  const headers = ["Aantal", "Omschrijving", "Prijs per stuk", "Aantal in doos", "Totaal"];

  // Define the starting positions for each column
  const columnPositions = [50, 100, 300, 400, 500];

  // Draw headers in bold
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: columnPositions[index],
      y: tableStartY,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  });

  // Draw a horizontal line after headers
  page.drawLine({
    start: { x: 50, y: tableStartY - 5 },
    end: { x: width - 50, y: tableStartY - 5 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  let currentY = tableStartY - lineSpacing;
  let totalExVAT = 0;

  // Draw each item row in the table
  orderItemsData.forEach((item: Product) => {
    const pricePerPiece = item.price;
    const totalPrice = pricePerPiece * item.quantity * item.quantityInBox;
    totalExVAT += totalPrice;

    const rowData = [
      item.quantity.toString(),
      item.name,
      `€ ${pricePerPiece.toFixed(2).replace(".", ",")}`,
      item.quantityInBox.toString(),
      `€ ${totalPrice.toFixed(2).replace(".", ",")}`,
    ];

    rowData.forEach((text, colIndex) => {
      page.drawText(text, {
        x: columnPositions[colIndex],
        y: currentY,
        size: fontSize,
        font: regularFont,
        color: rgb(0, 0, 0),
      });
    });

    currentY -= lineSpacing;
  });

  // Summary below the table
  // Constants for layout
  const verticalSpacing = 12; // Adjust space between lines
  const xOffset = 500; // X position for right alignment
  const startY = summaryStartY; // Starting Y position for the summary section
  
  // Draw price excluding VAT (Subtotal)
  page.drawText(`Subtotaal:`, {
    x: xOffset - 100,
    y: startY,
    size: 8,
    font: regularFont,
  });
  page.drawText(`€ ${totalExVAT.toFixed(2).replace(".", ",")}`, {
    x: xOffset,
    y: startY,
    size: 8,
    font: regularFont,
  });

  // Draw BTW (VAT) amount
  const vatAmount = totalExVAT * 0.21;
  page.drawText(`BTW 21%:`, {
    x: xOffset - 100,
    y: startY - verticalSpacing,
    size: 8,
    font: regularFont,
  });
  page.drawText(`€ ${vatAmount.toFixed(2).replace(".", ",")}`, {
    x: xOffset,
    y: startY - verticalSpacing,
    size: 8,
    font: regularFont,
  });

  // Draw total amount to be paid including VAT
  const totalIncVAT = totalExVAT * 1.21;
  page.drawText(`Totaal:`, {
    x: xOffset - 100,
    y: startY - 2 * verticalSpacing,
    size: 8,
    font: boldFont,
  });
  page.drawText(`€ ${totalIncVAT.toFixed(2).replace(".", ",")}`, {
    x: xOffset,
    y: startY - 2 * verticalSpacing,
    size: 8,
    font: boldFont,
  });

  // page.drawText("Betalingstermijn: Betaling binnen 7 dagen", { x: 50, y: summaryStartY - 48, size: 8, font: boldFont });

  // Page number
  const pageNumber = "Pagina 1"; // Simple static example
  page.drawText(pageNumber, { x: width / 2 - 25, y: footerStartY + 20, size: 8, font: regularFont });

  // Payment request text
  const paymentRequest = `We verzoeken u vriendelijk het bovenstaande totaalbedrag binnen 7 dagen over te maken op rekening: ${process.env.COMPANY_IBAN!}`;
  const paymentRequestWidth = regularFont.widthOfTextAtSize(paymentRequest, 8);
  page.drawText(paymentRequest, {
    x: (width - paymentRequestWidth) / 2,
    y: footerStartY + - 15,
    size: 8,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  const paymentReference = `t.n.v. ${process.env.COMPANY_NAME!}, onder vermelding van het factuurnummer: ${invoiceDetails.invoiceNumber}`;
  const paymentReferenceWidth = regularFont.widthOfTextAtSize(paymentReference, 8);
  page.drawText(paymentReference, {
    x: (width - paymentReferenceWidth) / 2,
    y: footerStartY - 25,
    size: 8,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Draw a horizontal line after payment info
  page.drawLine({
    start: { x: 50, y: footerStartY + 15 },
    end: { x: width - 50, y: footerStartY + 15 },
    thickness: 1,
    color: rgb(red, green, blue),
  });

  // Yellow Banner
  const bannerHeight = 20;
  const bannerY = -1; // Near the very bottom

  page.drawRectangle({
    x: 0,
    y: bannerY,
    width: width,
    height: bannerHeight,
    color: rgb(red, green, blue), // Yellow color
  });
  const bannerText = process.env.NEXT_PUBLIC_BASE_URL! || "http://localhost:3000";
  const bannerTextWidth = regularFont.widthOfTextAtSize(bannerText, 8);
  page.drawText(bannerText, {
    x: (width - bannerTextWidth) / 2,
    y: bannerY + (bannerHeight - 8) / 2, // Center text vertically within the banner
    size: 8,
    font: boldFont,
    color: rgb(0, 0, 0), // Text color
  });

  // Save the PDF document as bytes and convert to Base64 (if necessary)
  const pdfBytes = await pdfDoc.save();
  const base64pdf = Buffer.from(pdfBytes).toString("base64");

  return base64pdf; // Optionally return this value if needed elsewhere
}