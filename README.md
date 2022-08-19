# Next.js Teslo E-Commerce App
Para ejecutar la app localmente se necesita la base de datos(de momento es un contenedor Docker con la imagen de MongoDB v5). Para ello se debe ejecutar el siguiente comando(dejo la db en el 27021):
```
docker-compose up -d
```
* El -d, significa __detached__

## LLenar la base de datos con información de pruebas

LLamar al url por GET: 
```
http://localhost:3000/api/seed
```
### Hay que crear el .env con la MongoURI

```
MONGO_URL=mongodb://root:root@localhost:27021/teslodb
```
## Para crear una db con un user y pass con roles y accesos restringidos puedo crear un file llamado init-mongo.js con esto(el cual hay que pasar luego en el yaml):

```
db.createUser({
  user: "root", <- el usuario que desee
  pwd: "root", <-la pass que quiera
  roles: [
    {
      role: "readWrite",
      db: "teslodb" <- la db a la que apunto
    }
  ]
})
```

### El docker-compose.yaml lucirá asi(fijate que el file anterior debe ser provisto a ese punto de entrada.Tuve que usar un unnamed volume(/mongo) para persistir :data/db en mi SO ya que no tengo permisos suficientes en el SSD.Exited(14) es falta de permisos):
```
version: "3"

services:
    teslodb:
      image: mongo:5.0.0
      container_name: teslo-database
      ports:
        - '27021:27017'
      environment:
        - MONGO_INITDB_DATABASE=teslodb
        - MONGO_INITDB_ROOT_USERNAME=root
        - MONGO_INITDB_ROOT_PASSWORD=root
      volumes:
        - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
        - /mongo:/data/db # ojo con exited(14) que es por wrong permissions en el SSD(usar volumen en el SO)
```

#### Puedo ver en las docker images que tengo la imagen 5.0.0 de mongo con docker container ls(o simplemente docker ps) y que el contenedor esta UP.
#### Desde aqui puedo entrar al contenedor,entrar a la db directamente o entrar desde un gestor gráfico a la db(robo3T o MongoDB Compass)

- Para entrar al contenedor:
```
docker exec -ti <container-name> bash
```

- Para entrar a la db:
```
mongo -u<username> -p <password> --authenticationDatabase <database> OJO con los puertos si no es el 27017
```

- Para entrar con una MONGO_URI:
```
mongodb://<username>:<password>@127.0.0.1:27017/<database> <- de nuevo ojo con el puerto que va hardcodeado
```

