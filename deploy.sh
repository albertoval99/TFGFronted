#!/bin/bash

# 1. Actualizar código desde git
git pull origin main

# 2. Instalar dependencias (opcional si ya están instaladas)
npm install

# 3. Construir el proyecto (generar carpeta dist o build)
npm run build

# 4. Copiar la carpeta build/dist al directorio de Apache
# Cambia esta ruta por la ruta real donde Apache sirve tu frontend
cp -r dist/* /mnt/c/path/to/apache/www/frontend/

# 5. Reiniciar Apache para asegurarse que recarga archivos (opcional)
sudo service apache2 restart

echo "Despliegue completado."