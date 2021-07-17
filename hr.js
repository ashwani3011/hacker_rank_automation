let pup = require("puppeteer");

let gBrowser;
let gPage;
let id = "mayahev355@eyeremind.com";
let pass = "123456";
let language;
let code;
let codeObj;
// puppeteer have a launch fn which takes object as argument
//headless: false browser ko visible karta h, agar hum true karenge to automation ho jayega hame pata nahi chalega
pup
  .launch({
    headless: false,
    //below two line open window in full page
    defaultViewport: null,
    args: ["--start-maximized"],
    //forcefully slow kar rahe script ko
    slowMo: 50,
  })
  .then(function (browser) {
    gBrowser = browser;
    //all currently open pages ki array dunga
    return browser.pages();
  })
  .then(function (pagesArr) {
    gPage = pagesArr[0];
    return gPage.goto("https://www.hackerrank.com/auth/login");
  })
  .then(function () {
    let idPromise = gPage.type("#input-1", id);
    return idPromise;
  })
  .then(function () {
    let passPromise = gPage.type("#input-2", pass);
    return passPromise;
  })
  .then(function () {
    return Promise.all([
      //navigation is needed while opening new page
      gPage.waitForNavigation(),
      gPage.click(
        ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
      ),
    ]);
  })
  .then(function () {
    //promise.all parallely resolve all these below promise
    return Promise.all([
      gPage.waitForNavigation(),
      gPage.click("#base-card-1-link"),
    ]);
  })
  .then(function () {
    //script completed even before html loaded so we have to wait for tag to load
    return gPage.waitForSelector("[data-attr1='warmup']");
  })
  .then(function () {
    return Promise.all([
      gPage.waitForNavigation(),
      gPage.click("[data-attr1='warmup']"),
    ]);
  })
  .then(function () {
    return gPage.waitForSelector(
      ".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled"
    );
  })
  .then(function () {
    return Promise.all([
      gPage.waitForNavigation(),
      gPage.click(
        ".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled"
      ),
    ]);
  })
  .then(function () {
    return gPage.waitForSelector("[data-attr2='Editorial']");
  })
  .then(function () {
    return Promise.all([
      gPage.waitForNavigation(),
      gPage.click("[data-attr2='Editorial']"),
    ]);
  })
  .then(function () {
    return lockBtnHandler(".ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled");
  })
  .then(function () {
    //evaluate takes a fn which runs in browser(dom)
    return gPage.evaluate(function () {
      let allCodes = document.querySelectorAll(
        ".challenge-editorial-block.editorial-setter-code .highlight"
      );
      let allLanguages = document.querySelectorAll(
        ".challenge-editorial-block.editorial-setter-code h3"
      );
      let obj = {};
      obj.code = allCodes[0].innerText;
      obj.language = allLanguages[0].innerText;
      return obj;
    });
  })
  .then(function (obj) {
    codeObj = obj;
    return Promise.all([
      gPage.waitForNavigation(),
      gPage.click("[data-attr2='Problem']"),
    ]);
  })
  //language dropdown
  .then(function () {
    return gPage.waitForSelector(".css-1hwfws3");
  })
  .then(function () {
    return gPage.click(".css-1hwfws3");
  })
  .then(function () {
    return gPage.type(".css-1hwfws3", codeObj.language);
  })
  .then(function () {
    return gPage.keyboard.press("Enter");
  })
  //if we directly try to type code in editor it givse us extra {}
  //to solve this we will type in custom input box copy it & paste in editor
  .then(function () {
    return gPage.click("[type='checkbox']");
  })
  .then(function () {
    return gPage.waitForSelector("#input-1");
  })
  .then(function () {
    return gPage.type("#input-1", codeObj.code);
  })
  // ctrl + A -- for copying code & paste
  .then(function () {
    return gPage.keyboard.down("Control");
  })
  .then(function () {
    return gPage.keyboard.press("KeyA");
  })
  .then(function () {
    return gPage.keyboard.press("KeyX");
  })
  //releasing down from ctrl key
  .then(function () {
    return gPage.keyboard.up("Control");
  })
  //pasting code in editor
  .then(function () {
    return gPage.click(".hr-monaco-editor-parent");
  })
  .then(function () {
    return gPage.keyboard.down("Control");
  })
  .then(function () {
    return gPage.keyboard.press("KeyA");
  })
  .then(function () {
    return gPage.keyboard.press("KeyV");
  })
  .then(function () {
    return gPage.click(
      ".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled"
    );
  })

  .catch(function (err) {
    console.log(err);
  });

// custom promise function to handle the editorial problem
//first time we get editorial locked but next time onward its unlocked
//button ho ya na ho dono case me resolve karna h

function lockBtnHandler(selector) {
  return new Promise(function (resolve, reject) {
    gPage
      .waitForSelector(selector)
      .then(function () {
        return gPage.click(selector);
      })
      .then(function () {
        //lock button click ho chuka hoga
        resolve();
      })
      .catch(function (err) {
        resolve();
      });
  });
}
