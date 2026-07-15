<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Instala los node_modules luego de clonar el proyecto

```bash
$ pnpm install
```

## Completa las variables de entorno en el **.env**

```
.env.template --> .env
```

## Ejecuta el archivo docker compose para crear las imagenes de los servicios

```bash
docker compose up -d
```

## Ejecuta los comandos para usar prisma

### En este caso ya tiene las dependencias y migraciones

```bash
pnpm dlx prisma generate
```

```bash
pnpm dlx prisma migrate deploy
```

### En caso de no tener migraciones solo cargar las tablas de la db

```bash
pnpm dlx prisma generate
```

```bash
pnpm dlx prisma db push
```

## Compila y ejecuta el proyecto

```bash
# watch mode
$ pnpm run start:dev
```
