#!/usr/bin/env bash
set -euo pipefail

VERSION="1.9.1"
ARCH="linux-amd64"
SERVICE_NAME="node_exporter"

# Detectar si es contenedor
if grep -qE '/docker/|/kubepods/' /proc/1/cgroup 2>/dev/null; then
  CONTAINER=true
else
  CONTAINER=false
fi

# Detectar si sudo existe
if command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
else
  SUDO=""
fi

# Elegir directorio de instalación
if [ "$CONTAINER" = true ]; then
  INSTALL_DIR="$HOME/node_exporter"
else
  INSTALL_DIR="/usr/local/bin"
fi

echo "[INFO] Instalación en: $INSTALL_DIR (contenedor=$CONTAINER, sudo=${SUDO:-no})"

# Verificar si ya está instalado
if command -v node_exporter >/dev/null 2>&1; then
  echo "[INFO] Node Exporter ya está instalado en $(command -v node_exporter)"
  exit 0
fi

# Descargar binario
URL="https://github.com/prometheus/node_exporter/releases/download/v${VERSION}/node_exporter-${VERSION}.${ARCH}.tar.gz"
echo "[INFO] Descargando Node Exporter v${VERSION} (${ARCH})..."
curl -fsSL "$URL" -o /tmp/node_exporter.tar.gz

# Extraer
mkdir -p "$INSTALL_DIR"
tar -xzf /tmp/node_exporter.tar.gz -C /tmp
if [ "$CONTAINER" = true ]; then
  mv /tmp/node_exporter-${VERSION}.${ARCH}/node_exporter "$INSTALL_DIR/"
else
  $SUDO mv /tmp/node_exporter-${VERSION}.${ARCH}/node_exporter "$INSTALL_DIR/"
fi
rm -rf /tmp/node_exporter* 

echo "[INFO] Instalado en $INSTALL_DIR/node_exporter"

# Agregar a PATH si es en contenedor
if [ "$CONTAINER" = true ]; then
  export PATH="$INSTALL_DIR:$PATH"
fi

# Ejecutar en segundo plano
echo "[INFO] Iniciando Node Exporter..."
"$INSTALL_DIR/node_exporter" --web.listen-address=":9100" &
disown
