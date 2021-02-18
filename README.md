# API - Fabbrini
Utilizado para o gerenciamento da aplicação do Fabbrini utilizado para a telemedicina

Desenvolvido utilizando ExpressJS e MongoDB.

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
