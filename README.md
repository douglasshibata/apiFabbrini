# API - Fabbrini

Utilizado para o gerenciamento da aplicação do Fabbrini.

Desenvolvido utilizando ExpressJS e MongoDB.

<img src='https://github.com/douglasshibata/fabbrini/blob/main/src/assets/logo.png' logo='Logo do Fabbrini' />

Para rodar a aplicação 

Ter o Node.js instalado
Para verificar a versão.
```bash
node -v
```

Ter o gerenciador de pacotes do Node.js que é o NPM.
Para verificar a versão
```bash
npm -v
```
Copiar o .env.example para .env e configurar as variáveis
```bash
cp .env.example ~/Path/to/folder/.env
```
Adicione a url do MongoDB Atlas na variável MONGO_URL
```bash
MONGO_URL = mongodb+srv://<username>:<password>@host/<dbname>?options
```

Adicionar o hash secret para que seja providenciado um token válido

```bash
secret = hash md5
```

Adicionar as credenciais de provedor de email para realizar o envio de email. 
Utilizando a biblioteca do nodemailer e nodemailer-express-handlebars para realizar o envio de email e utilizar um template html para recuperação de senha

```bash
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
```

Adicionar a url do frontend para que seja enviado o email com o endereço correto.
```bash
FRONT_URL=
```

Baixar as dependencias
```bash
npm install 
```

Para executar o Projeto

```bash
node src/server.js
```
ou 
```bash
npm run dev
```
