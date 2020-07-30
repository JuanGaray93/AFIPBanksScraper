const puppeteer = require("puppeteer");

const url =
  "http://www.afip.gov.ar/genericos/emisorasGarantias/formularioCompa%C3%B1ias.asp?completo=1&ent=3";

const scrape = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url);
    const bankData = await page.evaluate(() => {
      const INDICES = {
        CODE: 1,
        NAME: 2,
        STATUS: 3,
      };

      const tbody = document.querySelector(
        "#cuerpoInternas > table.contenido > tbody"
      );
      const trs = tbody.querySelectorAll("tr");
      const banks = {};

      for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];
        const tds = tr.querySelectorAll("td");
        const bankCode = tds[INDICES.CODE] && tds[INDICES.CODE].innerText.trim();
        const bankName = tds[INDICES.NAME] && tds[INDICES.NAME].innerText.trim();
        
        if(!isNaN(+bankCode)) banks[bankCode] = bankName;
      }
      return banks;
    });
    console.log(bankData);
    await browser.close();
  } catch (e) {
    console.error(e);
    await browser.close();
  }
};

scrape();