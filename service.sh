#!/system/bin/sh
MOD_PATH=$(dirname "$0")
EVENT_DIR="$MOD_PATH/webroot/key"
CONFIG_FILE="$EVENT_DIR/cmd/config.conf"
SENTINEL_BIN="$MOD_PATH/webroot/bin/sentinel"
PORTAL_BIN="$MOD_PATH/webroot/bin/portal"
SOCKET_PATH="/data/adb/modules/tri_exp_caelifall/webroot/key/state/daemon.sock"
until [ -d "/storage/emulated/0/Android/" ]; do sleep 0.5; done
chmod 0755 "$MOD_PATH/webroot/bin/"* 2>/dev/null
rm -f "$SOCKET_PATH" 2>/dev/null
[ -x "$SENTINEL_BIN" ] && "$SENTINEL_BIN" >/dev/null 2>&1 &
timeout=30
while [ $timeout -gt 0 ] && [ ! -S "$SOCKET_PATH" ]; do
    sleep 0.5
    timeout=$((timeout - 1))
done
if [ -f "$CONFIG_FILE" ]; then
    [ ! -f "/proc/tristatekey/tri_state" ] && sed -i "/^SWITCH_TRIKEY=/d;/^DEVICE_KEY_F3=/d;/^BIND_up=/d;/^BIND_down=/d;/^BIND_shielded=/d" "$CONFIG_FILE"
    getevent -lp 2>/dev/null | grep -q "BTN_TRIGGER_HAPPY32" || sed -i "/^SWITCH_BTN32=/d;/^DEVICE_BTN32=/d;/^BIND_dc=/d;/^BIND_lp=/d" "$CONFIG_FILE"
    fi
CUSTOM_BASE="/storage/emulated/0/Android/custom"
_process_pairs() {
    local src="" dst=""
    for pair in $2; do
        if [ -z "$src" ]; then src="$pair"; else
            dst="$pair"
            if [ "$1" = "ensure" ] && [ ! -f "$src" ]; then
                mkdir -p "$(dirname "$src")"
                printf "#!/system/bin/sh\n# 自定义脚本占位：请在此处编写命令\n" > "$src"
                chmod 0644 "$src" 2>/dev/null
            elif [ "$1" = "mount" ] && [ -f "$src" ] && ! mount | grep -q "on $dst "; then
                mkdir -p "$(dirname "$dst")"
                [ -f "$dst" ] || touch "$dst"
                mount --bind "$src" "$dst"
            fi
            src=""
        fi
    done
}
mount_for_key() {
    grep -q "^BIND_$1=2" "$CONFIG_FILE" && { _process_pairs ensure "$2"; _process_pairs mount "$2"; }
}
for k in up:上拨 down:下拨; do
    n="${k#*:}"; m="${k%:*}"
    mount_for_key "$m" "$CUSTOM_BASE/三段式/${n}.rc $EVENT_DIR/sdk/${m}.sh $CUSTOM_BASE/三段式/${n}复位.rc $EVENT_DIR/sdk/re${m}.sh"
done
for k in dc:双击 lp:长按; do
    n="${k#*:}"; m="${k%:*}"
    for t in cbk:侧边键 vuk:音量上 vdk:音量下 dyk:电源键; do
        d="${t#*:}"; p="${t%:*}"
        mount_for_key "${p%%k}_${m}" "$CUSTOM_BASE/${d}/${n}.rc $EVENT_DIR/$p/${m}.sh $CUSTOM_BASE/${d}/${n}复位.rc $EVENT_DIR/$p/re${m}.sh"
    done
done
update_device() { sed -i "s|^DEVICE_$2=.*|DEVICE_$2=$3|" "$1"; }
sleep 3
if ! grep -q "未运行" "$MOD_PATH/module.prop"; then
    [ -x "$PORTAL_BIN" ] && "$PORTAL_BIN" start_all >/dev/null 2>&1
    shielded=$(grep "^BIND_shielded=" "$CONFIG_FILE" | cut -d= -f2)
    [ "$shielded" = "0" ] && chmod 0200 /proc/tristatekey/tri_state 2>/dev/null || chmod 0644 /proc/tristatekey/tri_state 2>/dev/null
fi
[ -f "/proc/tristatekey/tri_state" ] && {
    key_f3_device=$(getevent -lp | awk '/^add device/ {dev=$NF} /KEY_F3/ {print dev; exit}')
    [ -n "$key_f3_device" ] && update_device "$CONFIG_FILE" "KEY_F3" "$key_f3_device"
}
getevent -lp 2>/dev/null | grep -q "BTN_TRIGGER_HAPPY32" && {
    btn32_device=$(getevent -lp | awk '/^add device/ {dev=$NF} /BTN_TRIGGER_HAPPY32/ {print dev; exit}')
    [ -n "$btn32_device" ] && update_device "$CONFIG_FILE" "BTN32" "$btn32_device"
}
listen_key() {
    device=$(getevent -lt 2>/dev/null | sed -nr "/KEY_$1/ { s/.*(\/dev\/input\/event[0-9]+).*/\1/p; q }")
    [ -n "$device" ] && {
        update_device "$CONFIG_FILE" "$1" "$device"
        pkill -KILL -f "getevent -lc 1"
        sleep 1
        [ -x "$PORTAL_BIN" ] && { "$PORTAL_BIN" stopall >/dev/null 2>&1; sleep 0.2; "$PORTAL_BIN" start_all >/dev/null 2>&1; }
}
}
for key in VOLUMEUP:VUP VOLUMEDOWN:VDOWN POWER:POWER; do
    switch_key="${key#*:}"; key_name="${key%:*}"
    grep -q "^SWITCH_${switch_key}=1" "$CONFIG_FILE" 2>/dev/null && listen_key "$key_name" &
done