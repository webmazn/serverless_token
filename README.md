# Prueba tecnica

## Tecnologías

node
typescript
serverlees
dynamodb
diversos plugins
aws-sdk, aws-lambda, middy y demas

## Requerimientos

Tener una un access key y secret key a aws, para el despliegue de los lambda
configurarlo en la maquina host con aws-cli

```
npm install -g serverless # Herramienta de despliegue a aws
npm install #instalar los paquetes
```

## Estructura

src : se ubica los metodos lambda
    addToken
    getToken

middleware : se ubica el validador pk del Header su valor actual es de: "pk_test_LstJoiskhHytsmksjgakKhs"

persistence
    dynamodb

## Ejecución

Despues de configurar el aws-cli, hay dos modo de ejecución uno desde aws y otro de manera local
Desde aws se despliega con 
```
 serverless deploy 
```
Esto creara el stack, que posee las funciones y la tabla dynamo donde se almacena

## Evidencia

postman
health
![image](https://user-images.githubusercontent.com/2517404/194188578-2f9b405d-e85f-4612-8540-3bd6b3a7c3a0.png)

Nuevo token
![image](https://user-images.githubusercontent.com/2517404/194188596-396c1f36-2878-473b-9a19-b73cb77689ed.png)

pk se envia tambien
![image](https://user-images.githubusercontent.com/2517404/194188618-a03c2a71-eb30-4435-bfab-7b8f7934727a.png)

Obtener token
![image](https://user-images.githubusercontent.com/2517404/194188640-dadfe0de-21fb-4e72-8a13-50b207ec9662.png)

Recursos en aws
Stack
![image](https://user-images.githubusercontent.com/2517404/194189677-37239739-a0bb-412d-8ab9-06bb371e8186.png)

Functions
![image](https://user-images.githubusercontent.com/2517404/194189742-8da285a6-e6d2-4ac0-b813-b96a4a38a3f3.png)

Tabla dynamo
![image](https://user-images.githubusercontent.com/2517404/194189791-76b0f418-93e5-49fc-b4f0-7d5844f60c5b.png)

![image](https://user-images.githubusercontent.com/2517404/194189915-55eabef1-c92a-440b-9d24-bb60d610b5e9.png)

Ejecución local

Agregar un nuevo token
```
serverless invoke local --function addToken --path data-test/data2.json
```

Consultar 
```
serverless invoke local --function getToken --path data-test/dataGet.json
```
pero antes editar la linea 39 al 41 con un nuevo id 

```
    "pathParameters": {
        "id": "ef4f22f4-b29e-47c3-a263-a123864e4f87"
    },    
```    
