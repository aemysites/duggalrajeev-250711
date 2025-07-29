/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as shown in the example
  const headerRow = ['Cards (cards1)'];
  const cells = [headerRow];

  // Find all direct blog cards (don't descend further than necessary)
  // Each card is a .blogCard_card__g4s2a
  const cards = element.querySelectorAll('.blogCard_card__g4s2a');

  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Find the main blog image
    let imageCell = null;
    const imageLink = card.querySelector('a.blogCard_image_link__Gt6qj');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }

    // --- TEXT CELL ---
    const textCell = document.createElement('div');
    // Author/date/meta (as a paragraph)
    const meta = card.querySelector('.blogCard_blog_date__LbplO');
    if (meta && meta.childNodes.length > 0) {
      const metaP = document.createElement('p');
      // Use .textContent to preserve all text (author, date, read time)
      metaP.textContent = meta.textContent.trim();
      textCell.appendChild(metaP);
    }
    // Title (heading with link inside)
    const titleLink = card.querySelector('a.blogCard_blog_title__Ntvch');
    if (titleLink) {
      const h3 = document.createElement('h3');
      h3.appendChild(titleLink);
      textCell.appendChild(h3);
    }
    // Description/excerpt (as a paragraph)
    const excerptP = card.querySelector('.blogCard_blog_content__LfMQr p');
    if (excerptP) {
      textCell.appendChild(excerptP);
    }

    cells.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
