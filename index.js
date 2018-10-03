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
  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  page.setViewport({width: 1280, height: 800});
  // Número de página para começar.
  let paginaAtual = 1;

  while(paginaAtual <= 100) {
    // Define URL da página.
    let url = 'https://www.tudogostoso.com.br/novidades?page=' + paginaAtual;
    // Carrega página
    await page.goto(url, {timeout : 600000});
    // Captura screenshot.
    let screenshotName = 'capturasDeTela/' + paginaAtual + 'aPaginaNovidades.png';
    await page.screenshot({path: screenshotName});

    paginaAtual++;
  }

  // Fecha navegador.
  await browser.close();

})();
