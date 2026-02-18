# 🃏 Tienda TCG Online – React + Firebase

Tienda TCG Online – Instrucciones de Instalación
Este documento explica cómo instalar y ejecutar la aplicación web “Tienda TCG Online”,
desarrollada con React (Vite) y Firebase (Authentication y Firestore).

1. Tecnologías utilizadas
• React 18
• Vite
• Bootstrap 5
• Firebase Authentication
• Firestore Database
• React Router DOM

2. Requisitos previos
• Node.js (versión LTS recomendada)
• npm
• Cuenta de Google para Firebase
• Conexión a Internet

3. Instalación del proyecto
3.1. Clonar el repositorio:
 git clone URL_DEL_REPOSITORIO
 cd NOMBRE_DEL_PROYECTO
3.2. Instalar dependencias:
 npm install
3.3. Configuración de Firebase
El proyecto está conectado a Firebase para la autenticación y la base de datos. Para que funcione
correctamente es necesario que el proyecto Firebase tenga: - Authentication activado con método
Email/Password - Firestore Database creada - Una colección llamada 'products' con los siguientes
campos: - nombre (string) - precio (number) - cate
