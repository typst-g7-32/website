#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_OWNER="typst-g7-32"
REPO_NAME="modern-g7-32"
GITHUB_API="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest"
GIT_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}"

echo -e "${BLUE}==>${NC} Инициализация установки пакета ${REPO_NAME}..."

LATEST_TAG=$(curl -sL "${GITHUB_API}" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
    echo -e "${RED}Ошибка:${NC} Не удалось получить информацию о последнем релизе."
    exit 1
fi

VERSION=${LATEST_TAG#v}

INSTRUCTIONS="Для того чтобы начать использовать шаблон, выполните команду:\ntypst init @local/modern-g7-32:${VERSION} project-directory"

TARGET_DIR="$HOME/.cache/typst/packages/local/${REPO_NAME}/${VERSION}"

echo -e "${BLUE}==>${NC} Обнаружена последняя версия: ${GREEN}${VERSION}${NC}"
echo -e "${BLUE}==>${NC} Целевая директория: ${TARGET_DIR}"

draw_progress_bar() {
    local pid=$1
    local delay=0.1
    local str="##############################"
    local len=${#str}
    local i=0
    local direction=1

    tput civis 2>/dev/null || printf "\033[?25l"

    while kill -0 "$pid" 2>/dev/null; do
        local spaces=$((30 - i))
        printf "\r${YELLOW}[Загрузка]${NC} ["
        
        for ((j=0; j<i; j++)); do printf " "; done
        printf "<=>"
        for ((j=0; j<spaces; j++)); do printf " "; done
        printf "]"
        
        i=$((i + direction))
        if [ $i -ge 28 ] || [ $i -le 0 ]; then
             direction=$((direction * -1))
        fi

        sleep $delay
    done

    printf "\r\033[K"
    tput cnorm 2>/dev/null || printf "\033[?25h"
}

perform_git_ops() {
    local dir="$1"
    local url="$2"
    local progress_file="$3"
    
    if [ -d "$dir" ] && [ -d "$dir/.git" ]; then
        local current_branch=$(git -C "$dir" rev-parse --abbrev-ref HEAD 2>/dev/null)
        if [ -z "$current_branch" ] || [ "$current_branch" = "HEAD" ]; then
            if git -C "$dir" rev-parse --verify origin/main >/dev/null 2>&1; then
                current_branch="main"
            elif git -C "$dir" rev-parse --verify origin/master >/dev/null 2>&1; then
                current_branch="master"
            else
                current_branch="main"
            fi
        fi
        local remote_branch="origin/${current_branch}"
        
        if [ -n "$progress_file" ]; then
            > "$progress_file"
            if command -v stdbuf >/dev/null 2>&1; then
                stdbuf -oL -eL git -C "$dir" fetch --progress origin >/dev/null 2>>"$progress_file" && git -C "$dir" reset --hard "$remote_branch" >/dev/null 2>&1
            else
                git -C "$dir" fetch --progress origin >/dev/null 2>>"$progress_file" && git -C "$dir" reset --hard "$remote_branch" >/dev/null 2>&1
            fi
        else
            git -C "$dir" fetch origin >/dev/null 2>&1 && git -C "$dir" reset --hard "$remote_branch" >/dev/null 2>&1
        fi
        
        if [ $? -eq 0 ]; then
            return 0
        else
            return 2
        fi
    fi

    if [ -d "$dir" ]; then
        rm -rf "$dir"
    fi

    mkdir -p "$(dirname "$dir")"
    
    if [ -n "$progress_file" ]; then
        > "$progress_file"
        if command -v stdbuf >/dev/null 2>&1; then
            if stdbuf -oL -eL git clone --progress --depth 1 "$url" "$dir" >/dev/null 2>>"$progress_file"; then
                return 0
            else
                return 1
            fi
        else
            if GIT_HTTP_LOW_SPEED_LIMIT=0 GIT_HTTP_LOW_SPEED_TIME=999999 git clone --progress --depth 1 "$url" "$dir" >/dev/null 2>>"$progress_file"; then
                return 0
            else
                return 1
            fi
        fi
    else
        if git clone --depth 1 "$url" "$dir" >/dev/null 2>&1; then
            return 0
        else
            return 1
        fi
    fi
}

PROGRESS_FILE=$(mktemp)
trap "rm -f $PROGRESS_FILE" EXIT

(
    perform_git_ops "$TARGET_DIR" "$GIT_URL" "$PROGRESS_FILE"
    res=$?
    
    if [ $res -eq 2 ]; then
        rm -rf "$TARGET_DIR"
        mkdir -p "$(dirname "$TARGET_DIR")"
        
        > "$PROGRESS_FILE"
        if command -v stdbuf >/dev/null 2>&1; then
            stdbuf -oL -eL git clone --progress --depth 1 "$GIT_URL" "$TARGET_DIR" >/dev/null 2>>"$PROGRESS_FILE"
        else
            git clone --progress --depth 1 "$GIT_URL" "$TARGET_DIR" >/dev/null 2>>"$PROGRESS_FILE"
        fi
        exit $?
    fi
    exit $res
) &

BG_PID=$!

draw_progress_bar $BG_PID

wait $BG_PID
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✔ Успешно!${NC} Пакет установлен в ${TARGET_DIR}.\n${INSTRUCTIONS}"
elif [ $EXIT_CODE -eq 2 ]; then
    echo -e "${YELLOW}⚠ Внимание:${NC} Git pull не удался, была выполнена полная переустановка."
    echo -e "${GREEN}✔ Успешно!${NC} Репозиторий перезаписан.\n${INSTRUCTIONS}"
else
    echo -e "${RED}✖ Ошибка:${NC} Не удалось скачать или обновить репозиторий."
    exit 1
fi