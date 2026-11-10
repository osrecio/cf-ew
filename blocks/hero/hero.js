const CITIES = {
  MAD: 'Madrid',
  BCN: 'Barcelona',
  LIS: 'Lisboa',
  CDG: 'París',
  MRS: 'Marsella',
  LHR: 'Londres',
  MAN: 'Mánchester',
  DUB: 'Dublín',
  AMS: 'Ámsterdam',
  FRA: 'Fráncfort',
  MUC: 'Múnich',
  MXP: 'Milán',
  ZRH: 'Zúrich',
  IAD: 'Washington',
  EWR: 'Nueva York',
  SJC: 'San José',
  MIA: 'Miami',
  GRU: 'São Paulo',
  MEX: 'Ciudad de México',
};

function formatTtl(header) {
  const match = /max-age=(\d+)/.exec(header || '');
  if (!match) return '—';
  const seconds = Number(match[1]);
  if (seconds >= 86400 && seconds % 3600 === 0) return `${seconds / 3600} h`;
  if (seconds >= 3600) return `${Math.round(seconds / 3600)} h`;
  return `${Math.round(seconds / 60)} min`;
}

function row(label, valueEl) {
  const dt = document.createElement('dt');
  dt.textContent = label;
  const dd = document.createElement('dd');
  dd.append(valueEl);
  return [dt, dd];
}

function text(value, className) {
  const span = document.createElement('span');
  if (className) span.className = className;
  span.textContent = value;
  return span;
}

async function inspect(receipt, button) {
  receipt.classList.add('is-loading');
  button.disabled = true;
  const list = receipt.querySelector('dl');
  const note = receipt.querySelector('.hero-receipt-note');
  try {
    const started = performance.now();
    const resp = await fetch(window.location.pathname, { method: 'HEAD', cache: 'no-store' });
    const elapsed = Math.round(performance.now() - started);
    const ray = resp.headers.get('cf-ray');
    const status = resp.headers.get('cf-cache-status');

    if (!ray) {
      list.replaceChildren(
        ...row('Host', text(window.location.hostname)),
        ...row('Cloudflare', text('No pasa por aquí', 'pill is-off')),
        ...row('Tiempo', text(`${elapsed} ms`)),
      );
      note.textContent = 'Estás en el origen de AEM. Abre cf-ew.osrecio.com para ver la respuesta de Cloudflare.';
      return;
    }

    const colo = ray.split('-').pop();
    const pillClass = status === 'HIT' ? 'pill is-hit' : 'pill';
    list.replaceChildren(
      ...row('Caché', text(status || '—', pillClass)),
      ...row('Nodo', text(CITIES[colo] ? `${colo} · ${CITIES[colo]}` : colo)),
      ...row('TTL en el edge', text(formatTtl(resp.headers.get('cdn-cache-control')))),
      ...row('Tiempo', text(`${elapsed} ms`)),
      ...row('cf-ray', text(ray, 'is-mono')),
    );
    note.textContent = status === 'HIT'
      ? 'Servida desde la caché de Cloudflare, sin tocar el origen.'
      : 'Cloudflare ha ido al origen. Repite la petición y debería salir HIT.';
  } catch {
    note.textContent = 'No se pudieron leer las cabeceras de esta página.';
  } finally {
    receipt.classList.remove('is-loading');
    button.disabled = false;
  }
}

function buildReceipt(cell) {
  const receipt = document.createElement('div');
  receipt.className = 'hero-receipt';
  receipt.setAttribute('aria-live', 'polite');

  const title = document.createElement('p');
  title.className = 'hero-receipt-title';
  title.textContent = cell.textContent.trim() || 'Tu petición, ahora mismo';

  const list = document.createElement('dl');
  const note = document.createElement('p');
  note.className = 'hero-receipt-note';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button secondary hero-receipt-retry';
  button.textContent = 'Repetir petición';
  button.addEventListener('click', () => inspect(receipt, button));

  receipt.append(title, list, note, button);
  cell.replaceChildren(receipt);
  inspect(receipt, button);
}

export default function decorate(block) {
  const cells = [...(block.firstElementChild?.children || [])];
  if (cells.length < 2) return;
  block.classList.add('has-aside');
  cells[0].classList.add('hero-content');
  cells[1].classList.add('hero-aside');
  if (block.classList.contains('live')) buildReceipt(cells[1]);
}
