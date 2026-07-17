// ==========================================================
// D'Naty Confeitaria — interações do site
// ==========================================================

// ----- Menu mobile -----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const aberto = navMenu.classList.toggle('nav__menu--open');
  navToggle.setAttribute('aria-expanded', String(aberto));
});

navMenu.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ----- Link ativo no menu + nav flutuante conforme rolagem -----
const secoes = ['inicio', 'catalogo', 'galeria', 'sobre', 'contato'];
const links = document.querySelectorAll('.nav__link');
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--fixa', window.scrollY > 120);

  let atual = 'inicio';
  for (const id of secoes) {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) atual = id;
  }
  links.forEach((link) => {
    link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${atual}`);
  });
}, { passive: true });

// ----- Abas do catálogo -----
const tabs = document.querySelectorAll('.catalogo__tab');
const panels = document.querySelectorAll('.catalogo__panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('catalogo__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('catalogo__tab--active');
    tab.setAttribute('aria-selected', 'true');

    panels.forEach((p) => {
      p.classList.toggle('catalogo__panel--active', p.dataset.panel === tab.dataset.tab);
    });
  });
});

// ----- Carrossel de depoimentos -----
const depoimentos = document.querySelectorAll('.depoimento');
let depoAtual = 0;

function mostrarDepoimento(indice) {
  depoAtual = (indice + depoimentos.length) % depoimentos.length;
  depoimentos.forEach((d, i) => d.classList.toggle('depoimento--active', i === depoAtual));
}

let depoAutoplay;

function reiniciarDepoAutoplay() {
  clearInterval(depoAutoplay);
  depoAutoplay = setInterval(() => mostrarDepoimento(depoAtual + 1), 6000);
}

document.getElementById('depoPrev').addEventListener('click', () => {
  mostrarDepoimento(depoAtual - 1);
  reiniciarDepoAutoplay();
});
document.getElementById('depoNext').addEventListener('click', () => {
  mostrarDepoimento(depoAtual + 1);
  reiniciarDepoAutoplay();
});

reiniciarDepoAutoplay();

// ----- Revelação dos elementos ao rolar a página -----
const alvosReveal = document.querySelectorAll(
  '.destaque, .esp, .produto, .numero, .passo, .recheios, .sobre__text, .sobre__assinatura, ' +
  '.oferta__card, .oferta__img, .galeria__item, .cta__inner, .contato__img, .contato__card, .pedido__form'
);

alvosReveal.forEach((el) => el.classList.add('reveal'));

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const el = entrada.target;
    const irmaos = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
    const indice = Math.max(irmaos.indexOf(el), 0);

    el.style.transitionDelay = `${indice * 90}ms`;
    el.classList.add('reveal--on');
    observador.unobserve(el);

    // Limpa as classes após a animação para não interferir nos hovers
    setTimeout(() => {
      el.classList.remove('reveal', 'reveal--on');
      el.style.transitionDelay = '';
    }, 1100 + indice * 90);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

alvosReveal.forEach((el) => observador.observe(el));

// ----- Formulário → WhatsApp -----
const WHATSAPP_NUMERO = '5514997154069';

document.getElementById('pedidoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(e.target);

  const nome = dados.get('nome') || '';
  const telefone = dados.get('telefone') || '';
  const data = dados.get('data') || '';
  const tipo = dados.get('tipo') || '';
  const mensagem = dados.get('mensagem') || '';

  let texto = `Olá, D'Naty Confeitaria! 🎀🎂\n\nMeu nome é ${nome} e gostaria de fazer uma encomenda.\n`;
  texto += `\n*O que desejo:* ${tipo}`;
  if (data) {
    const [ano, mes, dia] = data.split('-');
    texto += `\n*Data da festa:* ${dia}/${mes}/${ano}`;
  }
  if (telefone) texto += `\n*Telefone:* ${telefone}`;
  if (mensagem) texto += `\n\n*Sobre a festa:* ${mensagem}`;

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
});
