if pm path io.github.a13e300.ksuwebui >/dev/null 2>&1; then
    am start -n "io.github.a13e300.ksuwebui/.WebUIActivity" -e id "tri_exp_caelifall"
elif pm path com.dergoogler.mmrl.wx > /dev/null 2>&1; then
    am start -n "com.dergoogler.mmrl.wx/.ui.activity.webui.WebUIActivity" -e MOD_ID "tri_exp_caelifall"
fi
