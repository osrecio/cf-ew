export default function decorate(block) {
  const ol = document.createElement('ol');
  ol.className = 'flow-steps';

  [...block.children].forEach((row) => {
    const [titleCell, ...bodyCells] = [...row.children];
    if (!titleCell) return;
    const li = document.createElement('li');

    const title = document.createElement('h3');
    title.className = 'flow-title';
    title.textContent = titleCell.textContent.trim();
    li.append(title);

    const body = document.createElement('div');
    body.className = 'flow-body';
    bodyCells.forEach((cell) => body.append(...cell.childNodes));
    if (body.childNodes.length) li.append(body);

    ol.append(li);
  });

  block.style.setProperty('--flow-count', ol.children.length);

  const track = document.createElement('div');
  track.className = 'flow-track';
  track.setAttribute('aria-hidden', 'true');
  const packet = document.createElement('span');
  packet.className = 'flow-packet';
  track.append(packet);

  block.replaceChildren(ol, track);

  // start the packet only while the diagram is on screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => block.classList.toggle('is-running', entry.isIntersecting));
  }, { threshold: 0.4 });
  observer.observe(block);
}
