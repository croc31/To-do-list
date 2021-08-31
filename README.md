# To-do-list

## Requisitos

1. Node.js
2. Express.js
3. lodash
4. config

## Configuração

Abra o arquivo [config.json](/config.json), e edite o host e a porta a qual os frontend deve se comunicar.

```js
{
	"url": {
		"hostname": "todolist.ufrn.br",
		"port": 80
	}
}
```

## Instalação

```sh
npm i express lodash config
```

## Uso 

```sh
node server.js
```

## Docker

```sh
docker-compose up
```
