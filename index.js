const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
// الاول بتحدد بالموس و بعدين كنترول و دي حلوة جربها
//////////////////////////
//Files
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOut = `that is  what we want to know about avocado ${textIn}\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("fileOutput");

// fs.readFile("./txt/starttttt.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! ❤️❤️❤️❤️");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your file has been written");
//       });
//     });
//   });
// });
// console.log("Will read file");

///////////////////////////////////////////////////////////
//Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

// علشان اقرا ملف جوسن
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// علشان احول الملف اللي قريته من نص الى اوبجكت
const dataObj = JSON.parse(data);
// علشان اخد اسم الفاكه من ملف جوسن بعد ما تحول اوبجكت و حطهم في اراي جديدة مع بعض
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  // انا عامل متغيرين اوبجكت هم بالترتيب ده
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(tempCard);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});
