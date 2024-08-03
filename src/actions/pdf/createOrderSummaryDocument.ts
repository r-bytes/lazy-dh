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

  // Fetch the logo image from the public directory
  const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`;
  const logoImageResponse = await fetch(logoUrl);
  const logoImageBytes = new Uint8Array(await logoImageResponse.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);

  // Calculate dimensions for the logo placement
  const logoWidth = 100;
  const logoHeight = logoImage.height * (logoWidth / logoImage.width);
  const logoX = width - logoWidth - 20; // 20 points padding from the right edge
  const logoY = height - logoHeight - 20; // 20 points padding from the top edge

  // Place the logo image
  page.drawImage(logoImage, {
    x: logoX,
    y: logoY,
    width: logoWidth,
    height: logoHeight,
  });

  // Title
  const titleY = logoY - 1; // 10cm below the logo
  page.drawText("Factuur", {
    x: 50,
    y: titleY,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Address Blocks
  const addressBlockY = titleY - 10;
  const addressDetails = `
    ${invoiceDetails.companyName ? invoiceDetails.companyName : invoiceDetails.invoiceCustomerName}
    ${invoiceDetails.invoiceCustomerAddress}
    ${invoiceDetails.invoiceCustomerPostal} ${invoiceDetails.invoiceCustomerCity}
    ${invoiceDetails.invoiceCustomerCountry}`;

  const shippingDetails = `
    ${invoiceDetails.companyName ? invoiceDetails.companyName : invoiceDetails.invoiceCustomerName}
    ${invoiceDetails.shippingCustomerAddress}
    ${invoiceDetails.shippingCustomerPostal} ${invoiceDetails.shippingCustomerCity}
    ${invoiceDetails.shippingCustomerCountry}`;

  page.drawText("Factuuradres:", {
    x: 50,
    y: addressBlockY - 40,
    size: 10,
    font: regularFont,
    lineHeight: 10,
  });
  page.drawText(addressDetails, {
    x: 43,
    y: addressBlockY - 50,
    size: 8,
    font: regularFont,
    lineHeight: 10,
  });

  page.drawText("Verzendadres:", {
    x: 400,
    y: addressBlockY - 40,
    size: 10,
    font: regularFont,
    lineHeight: 10,
  });
  page.drawText(shippingDetails, {
    x: 393,
    y: addressBlockY - 50,
    size: 8,
    font: regularFont,
    lineHeight: 10,
  });

  // Additional Info Blocks
  const referenceY = addressBlockY - 150;

  page.drawText("Referentie:", {
    x: 50,
    y: referenceY,
    size: 10,
    font: regularFont,
  });
  page.drawText(invoiceDetails.invoiceNumber, {
    x: 50,
    y: referenceY - 15,
    size: 8,
    font: regularFont,
  });

  const referenceInfoRight = `
    Opdracht: ${invoiceDetails.orderNumber}
    Factuur: ${invoiceDetails.invoiceNumber}
    Factuurdatum: ${invoiceDetails.date}
  `;

  page.drawText(referenceInfoRight, {
    x: 393,
    y: referenceY + 11,
    size: 8,
    font: regularFont,
    lineHeight: 10,
  });

  // Table Offset and Styles
  const tableStartY = addressBlockY - 250;
  const summaryStartY = tableStartY - 300; // Adjust based on content
  const footerStartY = 50; // Fixed position near the bottom

  const fontSize = 8;
  const lineSpacing = 15;

  // Headers for the table
  const headers = ["Omschrijving", "Aantal", "B.E", "Inhoud", "E.P", "Bruto", "Netto", "BTW-tarief"];

  // Define the starting positions for each column
  // Expanded the space for 'Omschrijving' and adjusted other columns accordingly
  const columnPositions = [
    50, // Start 'Omschrijving' at 20
    180, // 'Aantal' starts further out because 'Omschrijving' needs more space
    250, // 'B.E'
    300, // 'Inhoud'
    350, // 'E.P'
    400, // 'Bruto'
    450, // 'Netto'
    500, // 'BTW-tarief' ends before 580 to fit within the page
  ];

  // Ensure columnPositions are aligned within the page margins if there are adjustments needed
  const adjustedColumnPositions = columnPositions.map((pos) => pos); // Adjusted for page margin

  // Draw headers in bold
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: adjustedColumnPositions[index],
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
  let totalIncVAT = 0;
  let totalVAT = 0;

  // Draw each item row in the table
  orderItemsData.forEach((item: Product) => {
    const numericPriceExVAT = item.price * item.quantityInBox * item.quantity;
    const numericPriceIncVAT = item.price * item.quantityInBox * item.quantity * 1.21;
    const btwPrice = numericPriceIncVAT - numericPriceExVAT;

    const VAT = numericPriceExVAT - numericPriceIncVAT;
    totalExVAT += numericPriceExVAT;
    totalIncVAT += numericPriceIncVAT;
    totalVAT += VAT;

    // string
    const priceExVAT = numericPriceExVAT.toFixed(2).replace(".", ",");
    const priceIncVAT = numericPriceIncVAT.toFixed(2).replace(".", ",");

    // ["Omschrijving", "Aantal", "B.E", "Inhoud", "E.P", "Bruto", "Netto", "BTW-tarief"];
    const rowData = [
      item.name,
      item.quantity.toString(),
      item.quantityInBox.toString(),
      item.volume!.toString(),
      btwPrice.toFixed(2).replace(".", ","),
      `€ ${priceExVAT}`,
      `€ ${priceIncVAT}`,
      "21%",
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
  const xOffset = 370; // X position for all text elements
  const startY = summaryStartY; // Starting Y position for the summary section

  // Draw BTW (VAT) rate text
  page.drawText(`BTW tarief:                               21%`, {
    x: xOffset,
    y: startY,
    size: 8,
    font: regularFont,
  });

  // Draw total VAT amount
  page.drawText(`BTW prijs totaal:                      € ${totalVAT.toFixed(2).replace("-", "").replace(".", ",")}`, {
    x: xOffset,
    y: startY - verticalSpacing, // Adjust Y position based on vertical spacing
    size: 8,
    font: regularFont,
  });

  // Draw price excluding VAT
  page.drawText(`Price exclusief BTW:               € ${totalExVAT.toFixed(2).replace(".", ",")}`, {
    x: xOffset,
    y: startY - 2 * verticalSpacing, // Two times the vertical spacing for the next line
    size: 8,
    font: regularFont,
  });

  // Draw total amount to be paid including VAT
  page.drawText(`Totaal te betalen EUR:           € ${totalIncVAT.toFixed(2).replace(".", ",")}`, {
    x: xOffset,
    y: startY - 4 * verticalSpacing, // Three times the vertical spacing for the next line
    size: 8,
    font: boldFont,
  });

  page.drawText("Betalingstermijn: Betaling binnen 7 dagen", { x: 50, y: summaryStartY - 48, size: 8, font: boldFont });

  // Page number
  const pageNumber = "Pagina 1"; // Simple static example
  page.drawText(pageNumber, { x: width / 2 - 25, y: footerStartY + 20, size: 8, font: regularFont });

  // Draw a horizontal line after page number
  page.drawLine({
    start: { x: 50, y: footerStartY + 15 },
    end: { x: width - 50, y: footerStartY + 15 },
    thickness: 1,
    color: rgb(red, green, blue),
  });

  // Footer Info
  const footerInfo = `${process.env.COMPANY_NAME!}, ${process.env.COMPANY_ADDRESS!}, ${process.env.COMPANY_POSTAL!}, ${process.env.COMPANY_CITY!}, ${process.env.COMPANY_COUNTRY!}`;
  const footerTextWidth = regularFont.widthOfTextAtSize(footerInfo, 8);
  page.drawText(footerInfo, {
    x: (width - footerTextWidth) / 2,
    y: footerStartY,
    size: 8,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Contact Info
  const contactInfo = `${process.env.COMPANY_PHONE!}, ${process.env.COMPANY_EMAIL!}`;
  const contactTextWidth = regularFont.widthOfTextAtSize(contactInfo, 8);
  page.drawText(contactInfo, {
    x: (width - contactTextWidth) / 2,
    y: footerStartY - 10,
    size: 8,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Registration Info
  const regInfo = `KVK: ${process.env.COMPANY_KVK_NUMBER!}, BTW-nr: ${process.env.COMPANY_VAT_NUMBER!}, IBAN: ${process.env.COMPANY_IBAN!}`;
  const regTextWidth = regularFont.widthOfTextAtSize(regInfo, 8);
  page.drawText(regInfo, {
    x: (width - regTextWidth) / 2,
    y: footerStartY - 20,
    size: 8,
    font: regularFont,
    color: rgb(0, 0, 0),
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
