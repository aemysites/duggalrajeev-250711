/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the required format exactly
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find the card container (flex box)
  const flexContainer = element.querySelector('.blogPostSuggestionFooter_flex_container__akOVu');
  if (!flexContainer) return;
  const cards = flexContainer.querySelectorAll(':scope > .suggestionBlogCard_card__3Mhtg');

  cards.forEach(card => {
    // --- IMAGE COLUMN ---
    // Find the <img> in the card (required)
    const img = card.querySelector('img'); // Reference, not clone
    
    // --- TEXT COLUMN ---
    const contentDiv = card.querySelector('.suggestionBlogCard_content__1PtLq');
    const cellContent = [];
    if (contentDiv) {
      // 1. Meta info (author | date | read time) -- as a <p>
      const meta = contentDiv.querySelector('.suggestionBlogCard_blog_date__wgLig');
      if (meta && meta.textContent.trim()) {
        // Use a <p> for meta, reference child nodes
        const metaP = document.createElement('p');
        // Use childNodes to preserve bold etc.
        metaP.append(...Array.from(meta.childNodes));
        cellContent.push(metaP);
      }
      // 2. Title (usually an <a>), render as <h3> containing the <a>
      const titleLink = contentDiv.querySelector('.suggestionBlogCard_blog_title__xNaUK');
      if (titleLink) {
        const h3 = document.createElement('h3');
        // Reference the existing <a> node (not clone)
        h3.appendChild(titleLink);
        cellContent.push(h3);
      }
      // 3. Description paragraph, if present
      const descDiv = contentDiv.querySelector('.suggestionBlogCard_blog_content__B97Y9');
      if (descDiv) {
        // There may be a <p> in descDiv, or just text. Reference descDiv directly
        cellContent.push(descDiv);
      }
    }
    // If no content found, insert empty array (shouldn't happen)
    rows.push([
      img || '',
      cellContent.length ? cellContent : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
