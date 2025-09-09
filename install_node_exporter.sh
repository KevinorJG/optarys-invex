#!/usr/bin/env bash

set -e

NODE_EXPORTER_VERSION="1.9.1"
ARCH=$(uname -m)

# Map architecture
case "$ARCH" in
  x86_64) ARCH="amd64" ;;
  aarch64) ARCH="arm64" ;;
  armv7l) ARCH="armv7" ;;
esac

FILE="node_exporter-${NODE_EXPORTER_VERSION}.linux-${ARCH}.tar.gz"
URL="https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/${FILE}"

# Detectar si estoy en un contenedor
if [ -f "/.dockerenv" ] || grep -qE '/docker/|/kubepods/' /proc/1/cgroup 2>/dev/null; then
  IN_CONTAINER=true
  INSTALL_DIR="$HOME/node_exporter"
  SUDO_CMD=""
else
  IN_CONTAINER=false
  INSTALL_DIR="/usr/local/bin"
  if [ "$(id -u)" -eq 0 ]; then
    SUDO_CMD=""
  else
    SUDO_CMD="sudo"
  fi
fi

echo "[INFO] Instalación en: $INSTALL_DIR (contenedor=$IN_CONTAINER)"

# Verificar si ya está instalado
if command -v node_exporter >/dev/null 2>&1; then
  CURRENT_VERSION=$(node_exporter --version 2>&1 | grep "node_exporter," | awk '{print $3}')
  if [ "$CURRENT_VERSION" = "$NODE_EXPORTER_VERSION" ]; then
    echo "[OK] Node Exporter v$NODE_EXPORTER_VERSION ya está instalado en $(command -v node_exporter)"
    exit 0
  else
    echo "[WARN] Se encontró Node Exporter $CURRENT_VERSION, instalando v$NODE_EXPORTER_VERSION..."
  fi
fi

echo "[INFO] Descargando Node Exporter v${NODE_EXPORTER_VERSION} (${ARCH})..."
curl -L "$URL" -o "$FILE"

if [ "$IN_CONTAINER" = true ]; then
  mkdir -p "$INSTALL_DIR"
  tar -xzf "$FILE" -C "$INSTALL_DIR" --strip-components=1
else
  tar -xzf "$FILE"
  $SUDO_CMD cp "node_exporter-${NODE_EXPORTER_VERSION}.linux-${ARCH}/node_exporter" "$INSTALL_DIR/"
fi

# Limpieza
rm -rf "node_exporter-${NODE_EXPORTER_VERSION}.linux-${ARCH}" "$FILE"

# Ejecutar en segundo plano
echo "[INFO] Iniciando Node Exporter en segundo plano..."
nohup "$INSTALL_DIR/node_exporter" --web.listen-address=":9100" >/dev/null 2>&1 &

echo "[OK] Node Exporter v${NODE_EXPORTER_VERSION} está corriendo en http://localhost:9100/metrics"
