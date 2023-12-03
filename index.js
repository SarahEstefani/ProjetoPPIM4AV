import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Session } from 'inspector';

const porta = 5000;
const host = '0.0.0.0';

var listaUsuarios = [];

function processarCadastroUsuario(requisicao, resposta) {
    if (!(dados.nome && dados.sobrenome && dados.email
        && dados.aplicacao && dados.senhoridade && dados.experiencia)) {
        conteudoResposta = `
        <!DOCTYPE html>
        <head>
            <meta charset="utf-8">
        </head>

        <body>
            <div class="container">
                <form action='/cadastrarUsuarios.html' method='POST' class="row g-3 needs-validation" novalidate>
                    <fieldset class="grupo">
                    <div class="campo">
                        <label for="nome"><strong>Nome</strong></label>
                        <input type="text" name="nome" id="nome" required></input>
                    </div>
        `;
        if (!dados.nome) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, informe o nome!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="campo">
                        <label for="nome"><strong>Nome</strong></label>
                        <input type="text" name="nome" id="nome" required></input>
                    </div>;`
        if (!dados.sobrenome) {
            conteudoResposta +=
                    `<div>
                        <p class="text-dang*r">Por favor, informe o sobrenome!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="campo">
                        <label for="sobrenome"><strong>Sobrenome</strong></label>
                        <input type="text" name="sobrenome" id="sobrenome" required>
                    </div>
        `;
        if (!dados.email) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, informe seu email!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <div class="campo">
                        <label for="email"><strong>Email</strong></label>
                        <input type="email" name="email" id="email" required>
                    </div>;`
        if (!dados.aplicacao) {
            conteudoResposta +=
                    `<div>
                        <p class="text-danger">Por favor, qual é a sua aplicação!</p>
                    </div>`;
        }
        conteudoResposta += `
                    <label>
                        <input type="radio"  id="aplicacao" nome="devweb" value="frontend" checked>Front-end
                        </input>
                    </label>
                    <label>
                        <input type="radio" id="aplicacao" nome="devweb" value="backend">Back-end
                        </input>
                    </label>
                    <label>
                        <input type="radio" id="aplicacao" nome="devweb" value="fullstack">Fullstack
                        </input>
                    </label>`
       if (!dados.senhoridade) {
          conteudoResposta +=
                         `<div>
                            <p class="text-danger">Por favor, senhoridade?</p>
                        </div>`;
        }
          conteudoResposta += `
                        <select id="senioridade">
                            <option selected disable value="">Selecione</option>
                            <option>Junior</option>
                            <option>Pleno</option>
                            <option>Senior</option> 
                        </select>`
        if (!dados.experiencia) {
            conteudoResposta +=
                                `<div>
                                     <p class="text-danger">Por favor, experiência?</p>
                                </div>`;
        }
            conteudoResposta += `
                             <textarea row="6" style="width: 26em" id="experiencia" 
                             nome="experiencia"></textarea>;`
    }
    else {
    const usuario = {
        nome: requisicao.query.nome,
        sobrenome: requisicao.query.sobronome,
        email: requisicao.query.email,
        aplicação: requisicao.query.aplicacao,
        senhoridade: requisicao.query.senhoridade,
        experiencia: requisicao.query.experiencia,
    }

    listaUsuarios.push(usuario);
    let conteudoResposta = `
    <!DOCTYPE html>
    <head>
        <meta charset="UTF-8">
        <title>Menu do sistema</title>
    </head>
    <body>
        <h1>Usuário cadastrados</h1>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Sobronome</th>
                    <th>Email</th>
                    <th>Aplicação</th>
                    <th>Expêriencia/th>
                </tr>
            </thead>
            <tbody> `;

    for (const usuario of listaUsuarios) {
        conteudoResposta += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.sobrenome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.aplicacao}</td>
                        <td>${usuario.senhoridade}</td>
                        <td>${usuario.experiencia}</td>
                    <tr>
                `;
    }

    conteudoResposta+=`
    <body>
        </table>
        <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
        <a class="btn btn-primary" href="/cadastraUsuarios.html" role="button">Continuar cadastrando</a>
    </body>
    </html>`;
    resposta.end(conteudoResposta);
    }
}
function autenticar(requisicao, resposta, netx){
    if(requisicao.session.usuarioautenticado){
        next();
    }
    else{
        resposta.redirect("/login.html")
    }
}

const app = express();
app.use(cookieParser());
app.use(session({
    secret:"M1nH4Ch4v3S3cR3t4",
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*15
    }
}));

app.use(express.static(path.join(process.cwd(),'paginas')));
app.post('/login.html', (requisicao,resposta)=>{
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario && senha && (usuario === 'Sarah') && (senha === '123') ){
        requisicao.session.usuarioautenticado = true;
        resposta.redirect('/');
    }
    else{
        resposta.end(`
            <!DOCTYPE html>
            <head>
                <meta charset="UTF-8">
                <title>FALHA NA AUTENTICACAO</title>
            </head>
            <body>
                <h1>Usuário ou Senha invalidos</h1>
                <a href="/login.html">VOLTAR AO LOGIN</a>
        `
        )
    }
})
app.get('/', autenticar, (requisicao, resposta) => {

    const ultimoacesso = requisicao.cookies.get("ultimoacesso");
    const data = new Date();
    resposta.cookie("ultimoacesso", data.toLocaleString(),{
        maxAge: 1000*60*60*24*30,
        httpOnly: true
    });
    resposta.end(`
        <!DOCTYPE html>
            <head>
                <meta charset="UTF-8">
                <title>Pagina para cadastro de usuario</title>
            </head>
            <body>
                <h1>Bem vindo!<br> Acesse o <strong>formulario</strong> pelo link abaixo</h1>
                <ul>
                    <li><a href="/cadastraUsuarios.html">Cadastrar Usuário</a></li>
                </ul>
            </body>
            <footer><p>${usuario} seu ultimo acesso foi em ${ultimoacesso}</p></footer>
        </html>
    `);
})
app.post('/cadastraUsuarios.html', autenticar, processarCadastroUsuario);

app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);
});