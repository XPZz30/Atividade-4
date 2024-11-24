const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");



const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.redirect("/login");
  });
  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "segredo",
        resave: false,
        saveUninitialized: true,
    })
);

let produtos = [];

function autenticar(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

app.get("/login", (req, res) => {
    res.render("login", { mensagem: null });
});

app.post("/login", (req, res) => {
    const { usuario } = req.body;

    if (usuario) {
        req.session.usuario = usuario;
        res.cookie("ultimoAcesso", new Date().toLocaleString());
        return res.redirect("/cadastro");
    }

    res.render("login", { mensagem: "Por favor, insira um nome de usuário." });
});

app.get("/cadastro", autenticar, (req, res) => {
    const ultimoAcesso = req.cookies.ultimoAcesso || "Primeiro acesso";
    res.render("cadastro", { usuario: req.session.usuario, ultimoAcesso });
});

app.post("/cadastro", autenticar, (req, res) => {
    const { codigo, descricao, precoCusto, precoVenda, validade, qtdEstoque, fabricante } = req.body;

    if (codigo && descricao) {
        produtos.push({ codigo, descricao, precoCusto, precoVenda, validade, qtdEstoque, fabricante });
        return res.redirect("/produtos");
    }

    res.redirect("/cadastro");
});

app.get("/produtos", autenticar, (req, res) => {
    const ultimoAcesso = req.cookies.ultimoAcesso || "Primeiro acesso";
    res.render("produtos", { produtos, usuario: req.session.usuario, ultimoAcesso });
});

app.set("view engine", "ejs");
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
