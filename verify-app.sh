#!/bin/bash
cd /home/z/my-project

# Start server
node node_modules/.bin/next dev --port 3000 -H 0.0.0.0 > /home/z/my-project/verify.log 2>&1 &
SERVER_PID=$!

# Wait for server
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w '%{http_code}' http://0.0.0.0:3000/ 2>/dev/null | grep -q 200; then
    echo "SERVER_READY at ${i}s"
    break
  fi
  sleep 1
done

# ====== HOMEPAGE ======
echo "=== HOMEPAGE ==="
agent-browser open http://localhost:3000/ 2>&1
agent-browser wait --load networkidle 2>&1
sleep 3
agent-browser screenshot /home/z/my-project/tool-results/homepage-verify.png 2>&1

echo "=== ABOUT SECTION ==="
agent-browser eval "(function() { var h2s = document.querySelectorAll('h2'); var whoEl = null; for(var i=0;i<h2s.length;i++){if(h2s[i].textContent.indexOf('Who')>=0)whoEl=h2s[i];} if(!whoEl)return 'Who I Am not found'; var section = whoEl.closest('section') || whoEl.parentElement.parentElement; return section ? section.innerText.substring(0, 2000) : 'no section'; })()" 2>&1

echo "=== FEATURED PROJECTS ==="
agent-browser eval "(function() { var h2s = document.querySelectorAll('h2'); var fpEl = null; for(var i=0;i<h2s.length;i++){if(h2s[i].textContent.indexOf('Featured')>=0)fpEl=h2s[i];} if(!fpEl)return 'Featured not found'; var section = fpEl.closest('section') || fpEl.parentElement.parentElement; return section ? section.innerText.substring(0, 1500) : 'no section'; })()" 2>&1

# ====== LOGIN ======
echo "=== LOGIN ==="
agent-browser open http://localhost:3000/login 2>&1
agent-browser wait --load networkidle 2>&1
sleep 2
agent-browser snapshot -i 2>&1
sleep 1

# Fill login form
agent-browser fill @e1 "admin@codevirtox.com" 2>&1
agent-browser fill @e2 "admin123" 2>&1
sleep 1
agent-browser click @e3 2>&1
agent-browser wait --url "/dashboard" 2>&1
sleep 3
echo "=== LOGGED IN, CURRENT URL ==="
agent-browser get url 2>&1

# ====== SETTINGS PAGE ======
echo "=== SETTINGS PAGE ==="
agent-browser open http://localhost:3000/dashboard/settings 2>&1
agent-browser wait --load networkidle 2>&1
sleep 5
agent-browser screenshot /home/z/my-project/tool-results/settings-verify.png 2>&1

echo "=== SETTINGS FULL TEXT ==="
agent-browser eval "document.body.innerText" 2>&1

echo "=== SETTINGS INTERACTIVE ELEMENTS ==="
agent-browser snapshot -i 2>&1

echo "=== VERIFY COMPLETE ==="
