#!/bin/bash

set -e

# === Configuration ===
REMOTE_USER="username"
REMOTE_HOST="IP_ADDRESS_OF_PI"
DEB_FILE="/path/to/deb/file"
REMOTE_PATH="/tmp/$(basename "$DEB_FILE")"
REMOVE_FIRST=false  # set to true if you want to remove existing version first

# === Show steps clearly ===
echo "==> Copying $DEB_FILE to $REMOTE_HOST..."
scp "$DEB_FILE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

echo "==> Installing package on remote host..."

# === Build remote command ===
if [ "$REMOVE_FIRST" = true ]; then
  REMOTE_COMMAND=$(cat <<EOF
    PKG_NAME=\$(dpkg-deb -f "$REMOTE_PATH" Package);
    echo "==> Removing existing package \$PKG_NAME...";
    sudo dpkg -r "\$PKG_NAME" || true;
    echo "==> Installing new package...";
    sudo dpkg -i "$REMOTE_PATH"
EOF
)
else
  REMOTE_COMMAND="sudo dpkg -i \"$REMOTE_PATH\""
fi

# === Run command and reboot ===
ssh "$REMOTE_USER@$REMOTE_HOST" "
  $REMOTE_COMMAND &&
  echo '==> Rebooting...';
  sudo reboot
"
