import { InvoiceDetails } from "@/lib/types/invoice";
import Product from "@/lib/types/product";
import { PDFDocument, PDFImage, PDFPage, rgb, StandardFonts } from "pdf-lib";

export async function createOrderSummaryDocument(orderItemsData: Product[], invoiceDetails: InvoiceDetails) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  // A4 size in points (595.28 x 841.89)
  const width = 595.28;
  const height = 841.89;

  const red = 250 / 255;
  const green = 204 / 255;
  const blue = 21 / 255;

  // Fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Fetch and place the logo image
  let logoImage: PDFImage | undefined;
  try {
    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`;
    const logoImageResponse = await fetch(logoUrl);
    if (logoImageResponse.ok) {
      const contentType = logoImageResponse.headers.get("content-type");
      const logoImageBytes = new Uint8Array(await logoImageResponse.arrayBuffer());

      // Determine image type from content-type header or try both
      if (contentType?.includes("png")) {
        try {
          logoImage = await pdfDoc.embedPng(logoImageBytes);
        } catch (error) {
          console.warn("Failed to embed PNG, trying JPG:", error);
          try {
            logoImage = await pdfDoc.embedJpg(logoImageBytes);
          } catch {
            // Skip logo if both fail
          }
        }
      } else if (contentType?.includes("jpeg") || contentType?.includes("jpg")) {
        try {
          logoImage = await pdfDoc.embedJpg(logoImageBytes);
        } catch (error) {
          console.warn("Failed to embed JPG:", error);
        }
      } else {
        // Try PNG first, then JPG
        try {
          logoImage = await pdfDoc.embedPng(logoImageBytes);
        } catch {
          try {
            logoImage = await pdfDoc.embedJpg(logoImageBytes);
          } catch {
            // Skip logo if both fail
          }
        }
      }
    }
  } catch (error) {
    console.warn("Could not load logo image, continuing without logo:", error);
    // Continue without logo if it fails
  }

  // Constants
  const logoWidth = 60;
  let logoHeight = 0;
  let logoY = height - 20;
  if (logoImage) {
    logoHeight = logoImage.height * (logoWidth / logoImage.width);
    logoY = height - logoHeight - 20;
  }

  // Layout constants
  const headerHeight = 300; // Space for header content
  const footerHeight = 150; // Space for footer content
  const tableStartY = height - headerHeight;
  const minTableEndY = footerHeight; // Minimum Y position before needing new page
  const lineSpacing = 15;
  const fontSize = 8;
  const columnPositions = [50, 100, 300, 400, 500];
  const headers = ["Aantal", "Omschrijving", "Prijs per stuk", "Aantal in doos", "Totaal"];

  // Calculate total
  let totalExVAT = 0;
  orderItemsData.forEach((item: Product) => {
    const isAndersProduct = item.land === "Anders" || !item.land;
    let totalPrice: number;
    
    if (isAndersProduct && item.quantityInBox > 1) {
      // Price in DB is per box, but we sell per piece
      const pricePerPiece = item.price / item.quantityInBox;
      totalPrice = pricePerPiece * item.quantity;
    } else if (isAndersProduct) {
      // quantityInBox === 1, price is already per piece
      totalPrice = item.price * item.quantity;
    } else {
      // Other products: price is per box
      totalPrice = item.price * item.quantity * item.quantityInBox;
    }
    
    totalExVAT += totalPrice;
  });

  // Function to draw header on a page
  const drawHeader = (page: PDFPage, pageNumber: number, totalPages: number) => {
    const logoX = 50;
    const companyNameX = logoImage ? (width - logoWidth - 150) / 2 + logoWidth - 100 : width / 2 - 100;
    const companyNameY = height - 80;

    // Draw logo if available
    if (logoImage && pageNumber === 1) {
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoWidth,
        height: logoHeight,
      });
    }

    // Company name and slogan (only on first page)
    if (pageNumber === 1) {
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

      // Address Blocks (only on first page)
      const addressBlockY = companyNameY - 100;
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
      });
      page.drawText(addressDetails, {
        x: 40,
        y: addressBlockY + 50,
        size: 8,
        font: regularFont,
        lineHeight: 10,
      });

      const lazoBlockX = width / 2 + 50;
      page.drawText(lazoDetails, {
        x: lazoBlockX + 55,
        y: addressBlockY + 50,
        size: 8,
        font: regularFont,
        lineHeight: 10,
      });

      // Reference info (only on first page)
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
    }

    // Table headers (on every page)
    const tableHeaderY = pageNumber === 1 ? tableStartY : height - 50;
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: columnPositions[index],
        y: tableHeaderY,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
    });

    // Draw a horizontal line after headers
    page.drawLine({
      start: { x: 50, y: tableHeaderY - 5 },
      end: { x: width - 50, y: tableHeaderY - 5 },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });

    return tableHeaderY - lineSpacing;
  };

  // Function to draw footer on a page
  const drawFooter = (page: PDFPage, pageNumber: number, totalPages: number, isLastPage: boolean) => {
    const footerStartY = 70;

    // Page number
    const pageNumberText = `Pagina ${pageNumber} van ${totalPages}`;
    page.drawText(pageNumberText, {
      x: width / 2 - 40,
      y: footerStartY + 20,
      size: 8,
      font: regularFont,
    });

    // Only draw payment info on last page
    if (isLastPage) {
      // Payment request text
      const paymentRequest = `We verzoeken u vriendelijk het bovenstaande totaalbedrag binnen 7 dagen over te maken op rekening: ${process.env.COMPANY_IBAN!}`;
      const paymentRequestWidth = regularFont.widthOfTextAtSize(paymentRequest, 8);
      page.drawText(paymentRequest, {
        x: (width - paymentRequestWidth) / 2,
        y: footerStartY - 15,
        size: 8,
        font: regularFont,
        color: rgb(0, 0, 0),
      });

      const paymentReference = `t.n.v. ${process.env.COMPANY_NAME!}, onder vermelding van het factuurnummer: ${invoiceDetails.invoiceNumber}`;
      const paymentReferenceWidth = regularFont.widthOfTextAtSize(paymentReference, 8);
      page.drawText(paymentReference, {
        x: (width - paymentReferenceWidth) / 2,
        y: footerStartY - 35,
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
    }

    // Yellow Banner (on every page)
    const bannerHeight = 20;
    const bannerY = -1;
    page.drawRectangle({
      x: 0,
      y: bannerY,
      width: width,
      height: bannerHeight,
      color: rgb(red, green, blue),
    });
    const bannerText = process.env.NEXT_PUBLIC_BASE_URL! || "http://localhost:3000";
    const bannerTextWidth = regularFont.widthOfTextAtSize(bannerText, 8);
    page.drawText(bannerText, {
      x: (width - bannerTextWidth) / 2,
      y: bannerY + (bannerHeight - 8) / 2,
      size: 8,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  };

  // Function to draw summary (only on last page)
  const drawSummary = (page: PDFPage, currentY: number) => {
    const verticalSpacing = 12;
    const xOffset = 500;
    const summaryY = Math.max(currentY - 30, minTableEndY + 60); // Ensure summary doesn't overlap with footer

    const vatAmount = totalExVAT * 0.21;
    const totalIncVAT = totalExVAT * 1.21;

    // Draw price excluding VAT (Subtotal)
    page.drawText(`Subtotaal:`, {
      x: xOffset - 100,
      y: summaryY,
      size: 8,
      font: regularFont,
    });
    page.drawText(`€ ${totalExVAT.toFixed(2).replace(".", ",")}`, {
      x: xOffset,
      y: summaryY,
      size: 8,
      font: regularFont,
    });

    // Draw BTW (VAT) amount
    page.drawText(`BTW 21%:`, {
      x: xOffset - 100,
      y: summaryY - verticalSpacing,
      size: 8,
      font: regularFont,
    });
    page.drawText(`€ ${vatAmount.toFixed(2).replace(".", ",")}`, {
      x: xOffset,
      y: summaryY - verticalSpacing,
      size: 8,
      font: regularFont,
    });

    // Draw total amount to be paid including VAT
    page.drawText(`Totaal:`, {
      x: xOffset - 100,
      y: summaryY - 2 * verticalSpacing,
      size: 8,
      font: boldFont,
    });
    page.drawText(`€ ${totalIncVAT.toFixed(2).replace(".", ",")}`, {
      x: xOffset,
      y: summaryY - 2 * verticalSpacing,
      size: 8,
      font: boldFont,
    });
  };

  // Calculate how many pages we need first
  const maxItemsPerPage = Math.floor((tableStartY - minTableEndY) / lineSpacing);
  const totalPages = Math.max(1, Math.ceil(orderItemsData.length / maxItemsPerPage));
  const actualMaxItemsPerPage = Math.ceil(orderItemsData.length / totalPages);

  // Create first page
  let currentPage = pdfDoc.addPage([width, height]);
  let pageNumber = 1;
  let currentY = drawHeader(currentPage, pageNumber, totalPages);
  let itemsPerPage = 0;

  // Draw items
  orderItemsData.forEach((item: Product, index: number) => {
    // Check if we need a new page
    if (itemsPerPage >= actualMaxItemsPerPage && currentY < minTableEndY + 100) {
      // Draw footer on current page
      drawFooter(currentPage, pageNumber, totalPages, false);

      // Create new page
      currentPage = pdfDoc.addPage([width, height]);
      pageNumber++;
      itemsPerPage = 0;
      currentY = drawHeader(currentPage, pageNumber, totalPages);
    }

    const isAndersProduct = item.land === "Anders" || !item.land;
    let pricePerPiece: number;
    let totalPrice: number;
    
    if (isAndersProduct && item.quantityInBox > 1) {
      // Price in DB is per box, but we sell per piece
      pricePerPiece = item.price / item.quantityInBox;
      totalPrice = pricePerPiece * item.quantity;
    } else if (isAndersProduct) {
      // quantityInBox === 1, price is already per piece
      pricePerPiece = item.price;
      totalPrice = pricePerPiece * item.quantity;
    } else {
      // Other products: price is per box
      pricePerPiece = item.price * item.quantityInBox;
      totalPrice = pricePerPiece * item.quantity;
    }

    const rowData = [
      item.quantity.toString(),
      item.name,
      `€ ${pricePerPiece.toFixed(2).replace(".", ",")}`,
      item.quantityInBox.toString(),
      `€ ${totalPrice.toFixed(2).replace(".", ",")}`,
    ];

    rowData.forEach((text, colIndex) => {
      currentPage.drawText(text, {
        x: columnPositions[colIndex],
        y: currentY,
        size: fontSize,
        font: regularFont,
        color: rgb(0, 0, 0),
      });
    });

    currentY -= lineSpacing;
    itemsPerPage++;
  });

  // Draw summary on last page
  drawSummary(currentPage, currentY);

  // Draw footer on last page
  drawFooter(currentPage, pageNumber, totalPages, true);

  // Save the PDF document as bytes and convert to Base64
  const pdfBytes = await pdfDoc.save();
  const base64pdf = Buffer.from(pdfBytes).toString("base64");

  return base64pdf;
}
