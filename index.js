const receitasDAO = require('./database/receitas.js');
const puppeteer = require('puppeteer');

// Iniciando banco de dados.
receitasDAO.setup();

// Configurando script de scraping.
(async () => {
  // Inicia um navegador.
  const browser = await puppeteer.launch({headless : false});
  // Abre uma nova página
  const page = await browser.newPage();
  // Define agente e dimensões (para screenshot)
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.setViewport({width: 1280, height: 800});
  // Número de página para começar.
  let paginaAtual = 1;

  while(paginaAtual <= 100) {
    console.log('Visitando página de novidades',paginaAtual);
    // Define URL da página.
    let url = 'https://www.tudogostoso.com.br/novidades?page=' + paginaAtual;
    // Carrega página
    await page.goto(url, {timeout : 600000});
    // Captura screenshot.
    let screenshotName = 'capturasDeTela/Novidade_' + paginaAtual.toString().padStart(3, '0') + '.png';
    await page.screenshot({path: screenshotName, fullPage : true});

    // Obtendo URLs das receitas.
    let links = await page.evaluate( () => {
      return Array.from(document.querySelectorAll('.recipe-list a'))
                  .map(ancora => ancora.href)
                  .filter(value => value.indexOf('/receita/') > 0);
    });

    while(links.length > 0) {
      let link = links.shift();
      let id = link.replace(/[a-z\-\/:\.]/g,'') * 1;
      await page.goto(link, {timeout : 600000});
      let screenshotName = 'capturasDeTela/Receita_' +id.toString().padStart(6,'0') + '.png';
      await page.screenshot({path: screenshotName, fullPage : true});

      let dadosReceita = await page.evaluate( () => {
        let titulo = document.querySelector('.recipe-title h1')
                             .textContent
                             .trim();
        let tempoPreparo = document.querySelector('.dt-duration')
                                   .innerText
                                   .trim()
                                   .replace('MIN','').trim();
        let rendimento = document.querySelector('.serve .num.yield')
                                 .textContent
                                 .trim()
                                 .replace('porções', '').trim();
        let favoritos = document.querySelector('.like.block .label')
                                .textContent
                                .trim()
                                .replace('Favoritos', '').trim();

        let ingredientes = Array.from(document.querySelectorAll('.p-ingredient'))
                                .map(span => span.innerText.trim());
        return {
          nome : titulo,
          tempoPreparo : tempoPreparo,
          rendimento : rendimento,
          favoritos : favoritos,
          ingredientes : ingredientes
        }
      });

      dadosReceita.id = id;
      dadosReceita.url = link;

      await receitasDAO.insert(dadosReceita);
    }

    paginaAtual++;
  }

  // Fecha navegador.
  await browser.close();

})();
