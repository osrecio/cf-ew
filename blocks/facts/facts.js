export default function decorate(block) {
  const dl = document.createElement('dl');

  [...block.children].forEach((row) => {
    const [termCell, ...detailCells] = [...row.children];
    if (!termCell) return;
    const dt = document.createElement('dt');
    dt.textContent = termCell.textContent.trim();
    const dd = document.createElement('dd');
    detailCells.forEach((cell) => dd.append(...cell.childNodes));
    dl.append(dt, dd);
  });

  block.replaceChildren(dl);
}
