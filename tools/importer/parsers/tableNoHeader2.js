/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the required block name
  const headerRow = ['Table (no header)'];

  // Find the figure containing the image and figcaption
  const figure = element.querySelector('figure');
  const rows = [];

  if (figure) {
    // Reference the existing figure element as a single cell (image + figcaption)
    rows.push([figure]);
  } else if (element.children.length) {
    // If there's no figure, but there are children, group them all together
    const group = Array.from(element.children);
    rows.push([group]);
  } else {
    // Fallback: if the element is empty or has only text
    if (element.textContent.trim()) {
      rows.push([element.textContent.trim()]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table block
  element.replaceWith(table);
}
