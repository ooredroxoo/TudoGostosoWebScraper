# TudoGostosoWebScraper

Este repositório abriga um Web Scraper para consultar e indexar receitas do site [TudoGostoso](https://www.tudogostoso.com.br/) por seus ingredientes.

## Robots.txt

Antes de iniciar este projeto foi verificado o arquivo [robots.txt](https://www.tudogostoso.com.br/robots.txt) do site [TudoGostoso](https://www.tudogostoso.com.br/) para consultar o que nosso software pode ou não consultar sozinho do site.

No momento de escrita deste código o arquivo possui o seguinte conteúdo:
```
User-Agent: *
Allow: /
Disallow: /usuario/
Disallow: *recipe_id=*
```
