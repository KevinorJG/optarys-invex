#!/usr/bin/env bash
set -euo pipefail

VERSION="1.9.1"
ARCH="linux-amd64"
SERVICE_NAME="node_exporter"

# Detectar sudo
if command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
else
  SUDO=""
fi

# Detectar si podemos escribir en /usr/local/bin
if [ -w "/usr/local/bin" ] && [ -n "$SUDO" ]; then
  INSTALL_DIR="/usr/local/bin"
else
  INSTALL_DIR="$HOME/node_exporter"
fi

echo "[INFO] Instalación en: $INSTALL_DIR (sudo=${SUDO:-no})"

# Verificar si ya está instalado
if [ -x "$INSTALL_DIR/node_exporter" ]; then
  echo "[INFO] Node Exporter ya está instalado en $INSTALL_DIR/node_exporter"
  exit 0
fi

# Descargar binario
URL="https://github.com/prometheus/node_exporter/releases/download/v${VERSION}/node_exporter-${VERSION}.${ARCH}.tar.gz"
echo "[INFO] Descargando Node Exporter v${VERSION} (${ARCH})..."
curl -fsSL "$URL" -o /tmp/node_exporter.tar.gz

# Extraer
mkdir -p "$INSTALL_DIR"
tar -xzf /tmp/node_exporter.tar.gz -C /tmp
if [ "$INSTALL_DIR" = "/usr/local/bin" ]; then
  $SUDO mv /tmp/node_exporter-${VERSION}.${ARCH}/node_exporter "$INSTALL_DIR/"
else
  mv /tmp/node_exporter-${VERSION}.${ARCH}/node_exporter "$INSTALL_DIR/"
fi
rm -rf /tmp/node_exporter* 

echo "[INFO] Instalado en $INSTALL_DIR/node_exporter"

# Agregar a PATH si no es /usr/local/bin
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  export PATH="$INSTALL_DIR:$PATH"
fi

# Ejecutar en segundo plano
echo "[INFO] Iniciando Node Exporter..."
"$INSTALL_DIR/node_exporter" --web.listen-address=":9100" &
disown
