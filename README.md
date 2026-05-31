# The God Cards

Marketplace especializado en la compra y venta de cartas coleccionables TCG desarrollado como Proyecto Fin de Ciclo del CFGS de Desarrollo de Aplicaciones Web (DAW).

## Descripción

The God Cards es una plataforma web que permite a compradores y vendedores gestionar cartas coleccionables de diferentes categorías TCG mediante un sistema de marketplace moderno.

La aplicación incorpora autenticación de usuarios, gestión de ofertas, favoritos, carrito de compra, historial de pedidos, panel de administración y pagos online mediante Stripe.

---

## Tecnologías utilizadas

### Frontend

* React
* React Router
* Bootstrap
* Recharts
* Vite

### Backend y servicios

* Firebase Authentication
* Firestore Database
* Stripe Checkout
* Node.js
* Express

---

## Funcionalidades principales

### Usuarios

* Registro de usuarios.
* Inicio de sesión.
* Gestión de perfil.
* Sistema de roles.

### Catálogo

* Búsqueda de cartas.
* Filtrado por categorías.
* Visualización de detalles.

### Marketplace

* Creación de ofertas por vendedores.
* Gestión de stock.
* Gestión de precios.
* Diferentes estados de conservación.
* Diferentes idiomas.

### Favoritos

* Añadir cartas a favoritos.
* Consulta rápida de cartas guardadas.

### Compras

* Carrito de compra.
* Cálculo automático del total.
* Comisión de plataforma.
* Pago mediante Stripe Checkout.
* Historial de pedidos.

### Administración

* Gestión de cartas base.
* Creación de cartas.
* Edición de cartas.
* Eliminación de cartas.
* Gestión de usuarios.
* Estadísticas de ventas.

---

## Estructura del proyecto

```txt
src/
├── auth/
├── cart/
├── components/
├── data/
├── layout/
├── pages/
├── routes/
└── services/
```

---

## Instalación

### Clonar repositorio

```bash
git clone <url-del-repositorio>
cd tienda-react
```

### Instalar dependencias

```bash
npm install
```

### Configurar Firebase

Crear un archivo:

```txt
.env
```

e introducir las variables correspondientes de Firebase y Stripe.

---

## Ejecución del proyecto

### Frontend

```bash
npm run dev
```

### Servidor Stripe

```bash
node server.js
```

---

## Roles disponibles

### Comprador

* Consultar cartas.
* Añadir favoritos.
* Comprar ofertas.
* Consultar pedidos.

### Vendedor

* Crear ofertas.
* Gestionar stock.
* Gestionar precios.

### Administrador

* Gestionar cartas.
* Gestionar usuarios.
* Consultar estadísticas.

---

## Mejoras futuras

* Sistema de valoraciones.
* Chat entre usuarios.
* Notificaciones.
* Aplicación móvil.
* Recomendaciones inteligentes.

---

## Autor

Cristian Mirón Vázquez

Proyecto Fin de Ciclo DAW
Liceo La Paz
