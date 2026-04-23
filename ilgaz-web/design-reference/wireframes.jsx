// Four low-fi retro wireframes for ilg.az
// All rendered as 720x520 static frames. Rough/sketchy; composition > polish.

// ─────────────────────── A. WINDOWS 98 ───────────────────────
function Win98() {
  return (
    <div className="wf d1">
      <div className="desktop">
        {/* Desktop icons */}
        <div style={{position:'absolute', left:16, top:10}}>
          <div className="icon"><div className="ico">img</div>My Computer</div>
          <div className="icon"><div className="ico">img</div>About.txt</div>
          <div className="icon"><div className="ico">img</div>Projects</div>
          <div className="icon"><div className="ico">img</div>Contact</div>
          <div className="icon"><div className="ico">img</div>Recycle Bin</div>
        </div>

        {/* Main window */}
        <div className="win" style={{left:180, top:30, width:480, height:340}}>
          <div className="tbar">
            <span>ilg.az — Welcome</span>
            <span className="btns"><span>_</span><span>□</span><span>×</span></span>
          </div>
          <div className="menu">File  Edit  View  Help</div>
          <div className="body">
            <div className="bevel" style={{marginBottom:8, fontFamily:'VT323, monospace', fontSize:18, textAlign:'center'}}>
              ★ WELCOME TO ILG.AZ ★
            </div>
            <div style={{display:'flex', gap:8}}>
              <div className="placeholder-img" style={{width:100, height:100}}>photo</div>
              <div style={{flex:1, fontSize:13}}>
                <p style={{margin:'0 0 6px'}}>Hi. I'm [name]. I do [thing].</p>
                <p style={{margin:'0 0 6px', color:'#555'}}>Real bio copy goes here once we have it.</p>
                <button className="btn" style={{marginRight:6}}>Projects →</button>
                <button className="btn">Contact →</button>
              </div>
            </div>
            <div className="lbl" style={{marginTop:8}}>(secondary window w/ project list could go here)</div>
          </div>
        </div>

        {/* Secondary floating window */}
        <div className="win" style={{left:420, top:230, width:260, height:150}}>
          <div className="tbar">
            <span>Projects.lst</span>
            <span className="btns"><span>×</span></span>
          </div>
          <div className="body" style={{fontFamily:'VT323, monospace', fontSize:15}}>
            ▸ project_one.html<br/>
            ▸ project_two.html<br/>
            ▸ project_three.html<br/>
            ▸ …
          </div>
        </div>

        {/* Taskbar */}
        <div className="taskbar">
          <div className="start">▣ Start</div>
          <div className="taskitem">ilg.az — Welcome</div>
          <div className="taskitem">Projects.lst</div>
          <div className="clock">14:48</div>
        </div>

        {/* Annotations */}
        <div className="lbl" style={{position:'absolute', right:12, top:90, background:'#fef4a8', padding:'3px 6px', border:'1.5px solid #000', transform:'rotate(1deg)'}}>
          windows are draggable →
        </div>
      </div>
    </div>
  );
}

// ─────────────────────── B. TERMINAL ───────────────────────
function Terminal() {
  return (
    <div className="wf d2">
      <div className="crt">
        <div className="hdr">ILG.AZ v2.0 — TERMINAL INTERFACE</div>
        <div className="ascii" style={{marginBottom:10}}>{`
 ╔══════════════════════════════════════════╗
 ║   I L G . A Z                            ║
 ║   ─────────                              ║
 ║   personal homepage · est. 1997          ║
 ╚══════════════════════════════════════════╝`}</div>

        <div style={{marginBottom:8}}>&gt; whoami</div>
        <div style={{marginLeft:16, marginBottom:10, color:'#aaffaa'}}>
          [name]. [role]. based in baku, az.<br/>
          currently: [status line]
        </div>

        <div style={{marginBottom:6}}>&gt; ls ./</div>
        <div className="row" style={{marginLeft:16, marginBottom:10}}>
          <div className="menu">
            <div><span className="k">[1]</span> about.txt</div>
            <div><span className="k">[2]</span> projects/</div>
            <div><span className="k">[3]</span> writing/</div>
            <div><span className="k">[4]</span> contact.vcf</div>
            <div><span className="k">[5]</span> links.md</div>
          </div>
          <div style={{flex:1, fontSize:14, color:'#88ff88'}}>
            press a number key to cd into section<br/>
            ESC returns to root<br/><br/>
            navigation is keyboard-first.<br/>
            mouse works too, but ugly.
          </div>
        </div>

        <div style={{marginBottom:4}}>&gt; cat now.txt</div>
        <div style={{marginLeft:16, color:'#aaffaa', fontSize:14}}>
          · reading: [book]<br/>
          · building: [project]<br/>
          · listening: [album]
        </div>

        <div style={{position:'absolute', left:24, bottom:28}}>
          &gt; <span className="blink">█</span>
        </div>

        <div className="statusbar">
          <span>ILG.AZ · 80×24 · UTF-8</span>
          <span>MEM: 640K · DISK: OK</span>
          <span>LN 1 · COL 1</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────── C. GEOCITIES ───────────────────────
function GeoCities() {
  return (
    <div className="wf d3">
      <div className="page">
        <div className="marquee"><span>★★★ WELCOME TO MY HOMEPAGE ★★★ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 ★★★ PLEASE SIGN MY GUESTBOOK ★★★ LAST UPDATED: 04/23/2026 ★★★</span></div>

        <div className="wordart" style={{margin:'10px 0'}}>★ ilg.az ★</div>

        <div style={{textAlign:'center', marginBottom:8, fontSize:14}}>
          <span className="blink">★ NEW! ★</span> &nbsp;
          you are visitor # <span className="counter">00042069</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'160px 1fr 160px', gap:10, marginTop:6}}>
          {/* LEFT SIDEBAR */}
          <div className="box3d" style={{fontSize:12}}>
            <div style={{fontWeight:'bold', textAlign:'center', marginBottom:4, textDecoration:'underline'}}>☆ NAVIGATE ☆</div>
            <div className="linklist">
              <a href="#">» home</a>
              <a href="#">» about me</a>
              <a href="#">» my projects</a>
              <a href="#">» pictures!</a>
              <a href="#">» guestbook</a>
              <a href="#">» cool links</a>
              <a href="#">» email me</a>
            </div>
            <div className="under-construction" style={{marginTop:8}}>◢◣ under construction ◢◣</div>
            <div style={{textAlign:'center', marginTop:6}}>
              <div className="counter" style={{fontSize:12}}>♫ MIDI ON</div>
            </div>
          </div>

          {/* MAIN */}
          <div className="box3d">
            <div style={{background:'#ff00ff', color:'#ffff00', padding:'2px 6px', fontWeight:'bold', fontFamily:'Impact, sans-serif', letterSpacing:1}}>▓▒░ ABOUT ME ░▒▓</div>
            <div style={{padding:'6px 4px', fontSize:13, color:'#000'}}>
              <p style={{margin:'0 0 6px'}}>Hello and welcome to my corner of the World Wide Web!!!</p>
              <p style={{margin:'0 0 6px'}}>my name is [name] and this is my homepage. here u will find info about me, my hobbies, and my projects.</p>
              <p style={{margin:0, color:'#c00', fontWeight:'bold'}}>please sign my guestbook before you leave!!! ♥</p>
            </div>
            <div style={{display:'flex', gap:6, marginTop:6}}>
              <div className="placeholder-img" style={{flex:1, height:80}}>me.jpg</div>
              <div className="placeholder-img" style={{flex:1, height:80}}>pet.jpg</div>
              <div className="placeholder-img" style={{flex:1, height:80}}>car.jpg</div>
            </div>
            <div style={{marginTop:6, textAlign:'center', fontSize:12}}>
              <span className="blink">✉</span> email me at: [name]@ilg.az
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="box3d" style={{fontSize:12}}>
            <div style={{fontWeight:'bold', textAlign:'center', marginBottom:4, textDecoration:'underline'}}>★ WEBRING ★</div>
            <div style={{textAlign:'center', fontSize:11}}>
              « prev | random | next »
            </div>
            <div className="placeholder-img" style={{height:50, marginTop:6}}>banner</div>
            <div className="placeholder-img" style={{height:50, marginTop:4}}>88×31</div>
            <div className="placeholder-img" style={{height:50, marginTop:4}}>88×31</div>
            <div style={{marginTop:6, textAlign:'center', color:'#c00', fontWeight:'bold'}}>
              ♥ NETSCAPE NOW! ♥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────── D. WINDOWS XP LUNA ───────────────────────
function WinXP() {
  return (
    <div className="wf d4">
      <div className="bliss">
        {/* Main window */}
        <div className="win" style={{left:60, top:30, width:560, height:380, display:'flex', flexDirection:'column'}}>
          <div className="tbar">
            <span>🌐 ilg.az — Internet Explorer</span>
            <span className="btns"><span className="min"/><span className="max"/><span/></span>
          </div>
          <div style={{background:'#ece9d8', borderBottom:'1px solid #aca899', padding:'3px 8px', fontSize:11}}>
            File  Edit  View  Favorites  Tools  Help
          </div>
          <div style={{background:'linear-gradient(180deg,#f5f4ea,#d4d0c0)', padding:'4px 8px', fontSize:11, display:'flex', gap:6, borderBottom:'1px solid #aca899'}}>
            <span>← Back</span><span>→</span><span>⟳</span><span>⌂</span>
            <span style={{marginLeft:12, background:'#fff', border:'1px inset #aca899', padding:'1px 6px', flex:1}}>http://www.ilg.az/</span>
            <span>Go</span>
          </div>
          <div style={{display:'flex', flex:1}}>
            <div className="sidebar">
              <div style={{fontWeight:'bold', fontSize:12, marginBottom:6}}>ilg.az</div>
              <div className="group">▸ Home</div>
              <div className="group">▸ About</div>
              <div className="group">▸ Projects</div>
              <div className="group">▸ Blog</div>
              <div className="group">▸ Contact</div>
            </div>
            <div className="body" style={{flex:1}}>
              <div style={{fontFamily:'Trebuchet MS, sans-serif', fontSize:22, color:'#003399', fontWeight:'bold', marginBottom:4}}>Welcome</div>
              <div style={{fontSize:11, color:'#666', marginBottom:8, borderBottom:'1px solid #ccc', paddingBottom:4}}>home &gt; index.html</div>
              <div style={{display:'flex', gap:10}}>
                <div className="placeholder-img" style={{width:120, height:120, fontSize:14}}>photo.jpg</div>
                <div style={{flex:1, fontSize:12, lineHeight:1.4}}>
                  <p style={{margin:'0 0 6px'}}>Hi, I'm [name]. This is my website, hosted on Azerbaijan's finest .az domain.</p>
                  <p style={{margin:'0 0 6px', color:'#444'}}>Lorem ipsum placeholder for the real bio — slightly more "professional" tone here vs. the 98 version.</p>
                  <div style={{marginTop:8}}>
                    <span style={{background:'linear-gradient(180deg,#f0f0f0,#d8d8d8)', border:'1px solid #888', padding:'2px 10px', fontSize:11, marginRight:4}}>See projects</span>
                    <span style={{background:'linear-gradient(180deg,#f0f0f0,#d8d8d8)', border:'1px solid #888', padding:'2px 10px', fontSize:11}}>Email me</span>
                  </div>
                </div>
              </div>
              <div style={{marginTop:10, background:'#fffacd', border:'1px solid #d4c060', padding:'4px 8px', fontSize:11}}>
                ⓘ Tip: Add this page to your Favorites!
              </div>
            </div>
          </div>
        </div>

        {/* Taskbar */}
        <div className="taskbar">
          <div className="startbtn">start</div>
          <div style={{background:'linear-gradient(180deg,#3a93ff,#2575d6)', color:'#fff', padding:'3px 12px', marginLeft:8, borderRadius:3, fontSize:12, fontWeight:'bold'}}>🌐 ilg.az — IE</div>
          <div className="tray">🔊 🖥 14:48</div>
        </div>

        {/* annotation */}
        <div style={{position:'absolute', right:10, top:10, background:'#fef4a8', padding:'3px 6px', border:'1.5px solid #000', fontFamily:'Caveat, cursive', fontSize:14, transform:'rotate(-1deg)'}}>
          Bliss wallpaper + IE6 chrome
        </div>
      </div>
    </div>
  );
}

// Expose to global scope for the inline babel script
Object.assign(window, { Win98, Terminal, GeoCities, WinXP });
