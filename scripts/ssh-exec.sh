#!/bin/bash
# SSH command execution wrapper
# Usage: ssh-exec.sh <server-name> <command>
#        ssh-exec.sh --password <pass> <ip> <command>
#        ssh-exec.sh --bg <server-name> <command> [log-file]
#        ssh-exec.sh --poll <server-name> <process-pattern> [log-file]
#
# Examples:
#   ssh-exec.sh main "uname -a"
#   ssh-exec.sh main "docker ps"
#   ssh-exec.sh main "free -h && df -h"
#   ssh-exec.sh --password MyPass123 45.55.67.89 "apt update"
#
# Reads SSH credentials from config/servers.json
# Exit codes: 0 = success, 1 = config error, 2 = SSH error

set -euo pipefail

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=4 -o LogLevel=ERROR"

# Password mode (for initial setup when server is not in config yet)
if [ "$1" = "--password" ]; then
  PASSWORD="${2:?Missing password}"
  HOST="${3:?Missing host}"
  CMD="${4:?Missing command}"

  if ! command -v sshpass &> /dev/null; then
    echo '{"error": "sshpass not installed. Install: apt install sshpass / brew install sshpass"}' >&2
    exit 1
  fi

  sshpass -p "$PASSWORD" ssh $SSH_OPTS "root@${HOST}" "$CMD"
  exit $?
fi

# Background mode — run long commands without SSH timeout
# Usage: ssh-exec.sh --bg <server-name> <command> [log-file]
if [ "$1" = "--bg" ]; then
  shift
  SERVER="${1:?Usage: ssh-exec.sh --bg <server-name> <command> [log-file]}"
  CMD="${2:?Missing command}"
  LOG_FILE="${3:-/tmp/vps-ninja-bg-$(date +%s).log}"

  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  CONFIG="$SCRIPT_DIR/../config/servers.json"

  if [ ! -f "$CONFIG" ]; then
    echo '{"error": "Config not found"}' >&2
    exit 1
  fi

  HOST=$(jq -r ".servers.\"$SERVER\".host // empty" "$CONFIG")
  USER=$(jq -r ".servers.\"$SERVER\".ssh_user // \"root\"" "$CONFIG")
  SSH_KEY=$(jq -r ".servers.\"$SERVER\".ssh_key // empty" "$CONFIG")

  if [ -z "$HOST" ]; then
    echo "{\"error\": \"Server '$SERVER' not found in config\"}" >&2
    exit 1
  fi

  SSH_CMD="nohup sh -c '${CMD}' > ${LOG_FILE} 2>&1 & echo \$!"

  if [ -n "$SSH_KEY" ] && [ "$SSH_KEY" != "null" ]; then
    PID=$(ssh $SSH_OPTS -i "$SSH_KEY" "${USER}@${HOST}" "$SSH_CMD")
  else
    PID=$(ssh $SSH_OPTS "${USER}@${HOST}" "$SSH_CMD")
  fi

  echo "{\"status\": \"started\", \"pid\": \"$PID\", \"log_file\": \"${LOG_FILE}\"}"
  exit 0
fi

# Poll mode — check if a background process is still running
# Usage: ssh-exec.sh --poll <server-name> <process-pattern> [log-file]
if [ "$1" = "--poll" ]; then
  shift
  SERVER="${1:?Usage: ssh-exec.sh --poll <server-name> <process-pattern> [log-file]}"
  PATTERN="${2:?Missing process pattern}"
  LOG_FILE="${3:-}"

  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  CONFIG="$SCRIPT_DIR/../config/servers.json"

  if [ ! -f "$CONFIG" ]; then
    echo '{"error": "Config not found"}' >&2
    exit 1
  fi

  HOST=$(jq -r ".servers.\"$SERVER\".host // empty" "$CONFIG")
  USER=$(jq -r ".servers.\"$SERVER\".ssh_user // \"root\"" "$CONFIG")
  SSH_KEY=$(jq -r ".servers.\"$SERVER\".ssh_key // empty" "$CONFIG")

  if [ -z "$HOST" ]; then
    echo "{\"error\": \"Server '$SERVER' not found in config\"}" >&2
    exit 1
  fi

  CHECK_CMD="pgrep -f '${PATTERN}' > /dev/null 2>&1 && echo running || echo done"

  if [ -n "$SSH_KEY" ] && [ "$SSH_KEY" != "null" ]; then
    STATUS=$(ssh $SSH_OPTS -i "$SSH_KEY" "${USER}@${HOST}" "$CHECK_CMD")
  else
    STATUS=$(ssh $SSH_OPTS "${USER}@${HOST}" "$CHECK_CMD")
  fi

  if [ "$STATUS" = "done" ] && [ -n "$LOG_FILE" ]; then
    if [ -n "$SSH_KEY" ] && [ "$SSH_KEY" != "null" ]; then
      TAIL=$(ssh $SSH_OPTS -i "$SSH_KEY" "${USER}@${HOST}" "tail -20 ${LOG_FILE} 2>/dev/null || echo 'Log not found'")
    else
      TAIL=$(ssh $SSH_OPTS "${USER}@${HOST}" "tail -20 ${LOG_FILE} 2>/dev/null || echo 'Log not found'")
    fi
    echo "{\"status\": \"done\", \"log_tail\": $(echo "$TAIL" | jq -Rs .)}"
  else
    echo "{\"status\": \"$STATUS\"}"
  fi
  exit 0
fi

# Normal mode — read from config
SERVER="${1:?Usage: ssh-exec.sh <server-name> <command>}"
CMD="${2:?Missing command}"

# Determine script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="$SCRIPT_DIR/../config/servers.json"

if [ ! -f "$CONFIG" ]; then
  echo '{"error": "Config not found. Run: /vps config server add <name> <ip>"}' >&2
  exit 1
fi

HOST=$(jq -r ".servers.\"$SERVER\".host // empty" "$CONFIG")
USER=$(jq -r ".servers.\"$SERVER\".ssh_user // \"root\"" "$CONFIG")
SSH_KEY=$(jq -r ".servers.\"$SERVER\".ssh_key // empty" "$CONFIG")

if [ -z "$HOST" ]; then
  echo "{\"error\": \"Server '$SERVER' not found in config\"}" >&2
  exit 1
fi

if [ -n "$SSH_KEY" ] && [ "$SSH_KEY" != "null" ]; then
  ssh $SSH_OPTS -i "$SSH_KEY" "${USER}@${HOST}" "$CMD"
else
  ssh $SSH_OPTS "${USER}@${HOST}" "$CMD"
fi
