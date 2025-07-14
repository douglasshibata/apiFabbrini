# Fabbrini

Projeto de telemedicina para realizar teleconsultas para ajudar na área da saúde

![Logo](https://github.com/douglasshibata/apiFabbrini/blob/refactor_api/src/main/webapp/public/logo.png?raw=true)


## Stack utilizada

**Front-end:** Angular, Bootstrap

**Back-end:** Java, Spring boot

## Instalação

Ao iniciar a aplicação, execute  
```
docker compose up
```  
e o app se conectará aos serviços contidos.

Durante o desenvolvimento, recomenda-se usar o perfil `local`. No IntelliJ, após habilitar essa propriedade em **Modify options**, adicione `-Dspring.profiles.active=local` nas opções de VM da Configuração de Execução. Crie seu próprio arquivo `application-local.properties` para sobrescrever as configurações de desenvolvimento.

Além da aplicação Spring Boot, é necessário iniciar também o DevServer. Para isso, é preciso ter o [Node.js](https://nodejs.org/) versão 22. Na primeira vez e após atualizações, instale as dependências:

```
npm install -g @angular/cli
npm install
```

Executar o servidor

```
ng serve
```

Your application is now accessible under `localhost:4200`.

Add code using Angular schematics with `ng generate ...`.
Frontend unit tests can be executed with `ng test`.
Generate a messages.json for translation with `ng extract-i18n --format=json`.

---

## Build

A aplicação pode ser empacotada com:

```
mvnw clean package
```

O Node.js é baixado automaticamente pelo `frontend-maven-plugin`, e os arquivos JS/CSS finais são integrados ao JAR.

Inicie sua aplicação com o perfil `production`:

```
java -Dspring.profiles.active=production -jar ./target/fabbrini-0.0.1-SNAPSHOT.jar
```

Se necessário, uma imagem Docker pode ser criada usando o plugin do Spring Boot. Adicione `SPRING_PROFILES_ACTIVE=production` como variável de ambiente ao executar o container:

```
mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=br.com.kontongroup.api/fabbrini
```


## Autores

- [@douglasshibata](https://www.github.com/douglasshibata)
