#!/bin/bash


#Load configuration file
CONFIG_FILE="$HOME/.omniwhere-agent.conf"

if [! -f "$CONFIG_FILE"];then
    echo "Config file not found: $CONFIG_FILE"
    exit 1
fi

#loading env varibales from config file
source "$CONFIG_FILE"

#check if jq is installed - for json parsing
# Check for 'jq' dependency
if ! command -v jq &> /dev/null; then
  echo " 'jq' is not installed. Please run: sudo apt install jq"
  exit 1
fi

# Step 1: Login to get JWT token
echo " Logging in to obtain JWT token..."

TOKEN=$(curl -s -X POST "$BACKEND_URL/api/login/" \
  -H "Content-Type: application/json" \
  -d '{"username": "'"$USERNAME"'", "password": "'"$PASSWORD"'"}' | jq -r '.access')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo " Failed to retrieve JWT token. Check your credentials."
  exit 1
fi

echo " Token retrieved."

# Step 2: Register device
echo " Registering device $DEVICE_ID..."

curl -s -X POST "$BACKEND_URL/api/register_device/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "'"$DEVICE_ID"'",
    "ssh_port": '"$SSH_PORT"'
  }' | jq

# Step 3: Start reverse SSH tunnel
echo " Starting reverse SSH tunnel from backend port $REMOTE_SSH_PORT to local port $SSH_PORT..."
ssh -N -R $REMOTE_SSH_PORT:localhost:$SSH_PORT $USERNAME@localhost
