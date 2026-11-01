const TONES = ["陈述", "表扬", "严肃"];
const REASONS = ["措辞调整", "AI 识别错误", "观察补充", "语气不符", "其他"];
const MINOR_RATIO = 0.2;

const specs = {
  p1: "打开先看今晚要写的人。待发送里陈思远已积压 1 天；家长回了进待回复。",
  p2: "核对今日学情，右侧对比周均。写一句线下观察，再生成家长消息。",
  p3: "生成稿可改。轻改默认「措辞调整」一键确认；大改选原因。发送前会校验数字、称谓和观察。",
  p4: "发完点右下角「下一个待处理」继续；复制和发送只在消息框内。家长回了进待回复。",
};

const db = {
  csy: {
    id: "csy",
    name: "陈思远",
    short: "思远",
    parent: "陈妈妈",
    grade: "高一",
    avatar: "陈",
    color: "#b4532a",
    arrive: "18:30",
    leave: "19:42",
    duration: "1 小时 12 分",
    progress: "数学函数复习和习题，计划 4 项完成 2 项",
    completion: "42%",
    errors: "6 道，集中在函数",
    focus: "后 40 分钟有点散",
    hint: "时长、完成都低于周均，今晚用严肃语气把节奏说清楚，不空夸。",
    recTone: "严肃",
    tone: "严肃",
    status: "todo",
    backlogDays: 1,
    observe: "",
    tags: ["后半段走神", "离开时有点疲", "主动问了一道函数"],
    metrics: [
      {
        label: "学习时长",
        value: "1小时12分",
        sub: "18:30 到店 – 19:42 离店",
        delta: "↓ 比周均少 1.1h",
        dir: "down",
      },
      {
        label: "学习内容",
        value: "数学 · 复习函数 + 习题",
        sub: "计划 4 项，完成 2 项",
        delta: "—",
        dir: "na",
      },
      {
        label: "完成进度",
        value: "42%",
        sub: "今日计划完成度",
        delta: "↓ 比周均低 36%",
        dir: "down",
      },
      {
        label: "错题",
        value: "6 道 · 函数",
        sub: "集中在函数综合",
        delta: "比周均多 3 道",
        dir: "down",
      },
      {
        label: "专注",
        value: "61",
        sub: "后 40 分钟下降",
        delta: "↓ 比周均低 12",
        dir: "down",
      },
      {
        label: "掌握度",
        value: "数据缺失",
        sub: "伴学本未回传，生成时跳过",
        delta: "—",
        dir: "na",
      },
    ],
  },
  wyt: {
    id: "wyt",
    name: "王雨桐",
    short: "雨桐",
    parent: "王妈妈",
    grade: "初三",
    avatar: "王",
    color: "#b0893a",
    arrive: "16:18",
    leave: "19:28",
    duration: "3 小时 10 分",
    progress: "物理预习力学并完成习题",
    completion: "88%",
    errors: "2 道，集中在物理",
    focus: "后半段容易走神",
    hint: "完成稳在周均附近，专注下滑。用陈述把完成和走神都说清楚。",
    recTone: "陈述",
    tone: "陈述",
    status: "todo",
    observe: "",
    tags: ["人来了也做完了", "题做得认真", "后半段容易走神"],
    metrics: [
      {
        label: "学习时长",
        value: "3小时10分",
        sub: "16:18 到店 – 19:28 离店",
        delta: "持平周均",
        dir: "flat",
      },
      {
        label: "学习内容",
        value: "物理 · 预习力学 + 习题",
        sub: "全科在读",
        delta: "—",
        dir: "na",
      },
      {
        label: "完成进度",
        value: "88%",
        sub: "今日计划完成度",
        delta: "持平周均",
        dir: "flat",
      },
      {
        label: "错题",
        value: "2 道 · 物理",
        sub: "力学小题",
        delta: "比周均少 1 道 ✓",
        dir: "up",
      },
      {
        label: "专注",
        value: "49",
        sub: "后半段走神",
        delta: "↓ 比周均低 22",
        dir: "down",
      },
    ],
  },
  lza: {
    id: "lza",
    name: "刘子昂",
    short: "子昂",
    parent: "刘妈妈",
    grade: "高二",
    avatar: "刘",
    color: "#1e4a45",
    arrive: "15:28",
    leave: "20:05",
    duration: "4 小时 37 分",
    progress: "化学复习化学平衡并做了加练习题",
    completion: "95%",
    errors: "1 道，集中在化学平衡",
    focus: "离开时还清醒",
    hint: "完成和质量都高于周均，时长偏满。表扬执行，建议减量。",
    recTone: "表扬",
    tone: "表扬",
    status: "sent",
    observe: "今晚主动要求加一组化学，离开时还清醒，揉眼睛比较勤，我拦了一下没让再加。",
    tags: ["主动加练", "揉眼睛比较勤"],
    parentReply: "林老师好，收到了。子昂说今晚化学加练有点累。错题我们回家对一下，明天会按老时间到。",
    replyWaitHours: 26,
    replyHandled: false,
    replyDraft: "",
    metrics: [
      {
        label: "学习时长",
        value: "4小时37分",
        sub: "15:28 到店 – 20:05 离店",
        delta: "↑ 比周均多 0.6h",
        dir: "up",
      },
      {
        label: "学习内容",
        value: "化学 · 复习平衡 + 加练",
        sub: "理综加强",
        delta: "—",
        dir: "na",
      },
      {
        label: "完成进度",
        value: "95%",
        sub: "今日计划完成度",
        delta: "↑ 比周均高 4%",
        dir: "up",
      },
      {
        label: "错题",
        value: "1 道 · 化学平衡",
        sub: "加练第 3 组",
        delta: "持平周均",
        dir: "flat",
      },
      {
        label: "专注",
        value: "78",
        sub: "离开时还清醒",
        delta: "持平周均",
        dir: "flat",
      },
    ],
    draft: "",
    original: "",
    reason: "",
    feedbackOk: true,
    sentText: "",
  },
};

function buildDraft(stu) {
  const obs = stu.observe.trim();
  const name = stu.short;
  const parent = stu.parent;
  const sign = "——伴学师 林晓晨，黄庄店";

  const bodies = {
    陈述: `${parent}晚上好～今天${name}在店里学了 ${stu.duration}，${stu.arrive} 到 ${stu.leave}。${stu.progress}，完成度 ${stu.completion}。

今天能坐下来学，${stu.focus}。${obs}

错的题有 ${stu.errors}，下一步重点把今天的错题过一遍。建议今晚先不加新题，让他把错题讲给您听——讲得出来，就是真的懂了。

明天我们把数学收到两项，先求做完。
${sign}`,

    表扬: `${parent}晚上好～今天${name}${stu.arrive} 到店、${stu.leave} 离店，学了 ${stu.duration}。${stu.progress}，完成度 ${stu.completion}。

${stu.focus}。${obs}

错题 ${stu.errors}，可以再过一遍解题步骤。建议今晚先收工，把作息留住，明天加练少留一组。

明天我们按这个量走。
${sign}`,

    严肃: `${parent}晚上好～今天${name}在店里学了 ${stu.duration}，${stu.arrive} 到 ${stu.leave}。${stu.progress}，完成度 ${stu.completion}，和这周平时比偏慢。

${stu.focus}。${obs}时长和完成都比周均低，今晚先把节奏收一收，不赶新进度。

错的题有 ${stu.errors}，建议今晚让他把错题讲给您听一遍，讲不清楚的明天到店我们一起过。

明天我们把任务收到两项，先把完成稳住。
${sign}`,
  };

  return bodies[stu.tone] || bodies.陈述;
}

db.lza.original = buildDraft(db.lza);
db.lza.draft = db.lza.original;
db.lza.sentText = db.lza.original;

const state = {
  screen: "p1",
  tab: "todo",
  current: "csy",
  toast: "",
  generating: false,
  tip: "",
  justSent: false,
  blocks: [],
  modal: null,
};

const $screen = document.getElementById("phoneScreen");
const $steps = document.getElementById("flowSteps");
const $spec = document.getElementById("specText");

function lockScroll(fn) {
  const y = window.scrollY;
  const body = $screen.querySelector(".wb-body");
  const top = body ? body.scrollTop : 0;
  fn();
  window.scrollTo(0, y);
  requestAnimationFrame(() => {
    window.scrollTo(0, y);
    const next = $screen.querySelector(".wb-body");
    if (next) next.scrollTop = top;
  });
}

function setStep(id) {
  $spec.textContent = specs[id];
  $steps.querySelectorAll(".flow-step").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.step === id);
  });
}

function toast(text) {
  state.toast = text;
  let el = $screen.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    $screen.appendChild(el);
  }
  el.textContent = text;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    el.remove();
    state.toast = "";
  }, 1800);
}

function copyText(text) {
  if (!text) return toast("还没有可复制的内容");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => toast("已复制"),
      () => toast("请手动全选复制")
    );
  } else toast("请手动全选复制");
}

function awaitingReply(stu) {
  return Boolean(stu.parentReply) && !stu.replyHandled;
}

function listBy(tab) {
  const all = Object.values(db);
  if (tab === "reply") return all.filter(awaitingReply);
  if (tab === "done") return all.filter((s) => s.status === "sent");
  return all.filter((s) => s.status !== "sent");
}

function nextPending(exceptId) {
  return Object.values(db).find((s) => s.status !== "sent" && s.id !== exceptId);
}

function counts() {
  return { todo: listBy("todo").length, reply: listBy("reply").length, done: listBy("done").length };
}

function bar() {
  return `<div class="status-bar"><span>20:41</span><span>拾光日报</span></div>`;
}

function toastEl() {
  return state.toast ? `<div class="toast">${state.toast}</div>` : "";
}

function deltaClass(dir) {
  if (dir === "up") return "delta-up";
  if (dir === "down") return "delta-down";
  if (dir === "flat") return "delta-flat";
  return "delta-na";
}

function metricsHtml(metrics) {
  return `<div class="facts">${metrics
    .map(
      (m) => `<div class="metric">
        <div class="lab">${m.label}</div>
        <div class="val">${m.value}${m.sub ? `<small>${m.sub}</small>` : ""}</div>
        <span class="delta ${deltaClass(m.dir)}">${m.delta}</span>
      </div>`
    )
    .join("")}</div>`;
}

function levenshtein(a, b) {
  const n = a.length;
  const m = b.length;
  if (!n) return m;
  if (!m) return n;
  const dp = new Array(m + 1);
  for (let j = 0; j <= m; j++) dp[j] = j;
  for (let i = 1; i <= n; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= m; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[m];
}

function rewriteRatio(original, draft) {
  const s = String(original || "").replace(/\s+/g, "");
  const t = String(draft || "").replace(/\s+/g, "");
  if (!s.length) return t.length ? 1 : 0;
  return levenshtein(s, t) / Math.max(s.length, t.length);
}

function isMinorEdit(stu) {
  return rewriteRatio(stu.original, stu.draft) < MINOR_RATIO;
}

function validateSend(stu) {
  const blocks = [];
  const text = stu.draft || "";
  if (!text.includes(stu.parent)) {
    blocks.push({ type: "称谓", msg: `家长称谓与档案不一致，正文需出现「${stu.parent}」` });
  }
  const obs = (stu.observe || "").trim();
  if (obs && !text.includes(obs)) {
    blocks.push({ type: "观察缺失", msg: "线下观察句已不在正文中，发送前请保留现场观察。" });
  }
  const times = text.match(/\d{1,2}[:：]\d{2}/g) || [];
  const allowed = new Set([stu.arrive, stu.leave, stu.arrive.replace(":", "："), stu.leave.replace(":", "：")]);
  times.forEach((t) => {
    const norm = t.replace("：", ":");
    if (!allowed.has(t) && !allowed.has(norm)) {
      blocks.push({ type: "数字不一致", msg: `正文时间 ${t} 与事实区（${stu.arrive}–${stu.leave}）不一致` });
    }
  });
  const percents = text.match(/\d+(?:\.\d+)?\s*%/g) || [];
  const factPct = stu.completion.replace(/\s/g, "");
  percents.forEach((p) => {
    if (p.replace(/\s/g, "") !== factPct) {
      blocks.push({ type: "数字不一致", msg: `完成度 ${p} 与事实区 ${stu.completion} 不一致` });
    }
  });
  const errFact = ((stu.errors.match(/\d+/) || [])[0] || "");
  [...text.matchAll(/(\d+)\s*道/g)].forEach((m) => {
    if (errFact && m[1] !== errFact) {
      blocks.push({ type: "数字不一致", msg: `错题 ${m[1]} 道与事实区 ${errFact} 道不一致` });
    }
  });
  const seen = new Set();
  return blocks.filter((b) => {
    if (seen.has(b.msg)) return false;
    seen.add(b.msg);
    return true;
  });
}

function blockPanel(blocks) {
  if (!blocks || !blocks.length) return "";
  return `<div class="block-list">
    <h4>发送前校验未通过</h4>
    ${blocks.map((b) => `<p><b>${b.type}</b> ${b.msg}</p>`).join("")}
  </div>`;
}

function modalHtml() {
  const modal = state.modal;
  if (!modal || modal.type !== "tone") return "";
  return `<div class="overlay">
    <div class="modal">
      <h4>切换语气将重新生成</h4>
      <p>当前稿有未保存的修改。可以保留现在的文字，或按「${modal.nextTone}」重写。</p>
      <div class="modal-actions">
        <button class="ghost" type="button" data-tone-cancel>取消</button>
        <button class="ghost" type="button" data-tone-keep>保留当前修改</button>
        <button class="primary" type="button" data-tone-rewrite>用新语气重写</button>
      </div>
    </div>
  </div>`;
}

function insertAtCursor(el, text) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  const before = el.value.slice(0, start);
  const after = el.value.slice(end);
  const needComma = before && !/[\s，。、；\n]$/.test(before);
  const insert = (needComma ? "，" : "") + text;
  const next = before + insert + after;
  el.value = next;
  const pos = before.length + insert.length;
  el.focus();
  el.setSelectionRange(pos, pos);
  return next;
}

function replyPanel(stu) {
  if (!awaitingReply(stu)) return "";
  const overdue = (stu.replyWaitHours || 0) >= 24;
  return `<div class="sec" id="replySec">
    <h4>家长回复${overdue ? " · 已超时" : ""}</h4>
    ${overdue ? `<p class="summary">满 24 小时未跟进，已同步店长。店长只看不代发。</p>` : ""}
    <div class="parent-bubble">${stu.parentReply}</div>
    <textarea class="observe" id="replyBox" placeholder="回给家长的下一句……">${stu.replyDraft || ""}</textarea>
    <div class="msg-actions">
      <button class="ghost" type="button" data-reply-done>标记已处理</button>
      <button class="primary" type="button" data-reply-send>回复家长</button>
    </div>
  </div>`;
}

function renderList() {
  state.screen = "p1";
  state.justSent = false;
  state.modal = null;
  setStep(state.tab === "todo" ? "p1" : "p4");
  const n = counts();
  const tab = state.tab;
  const list = listBy(tab);
  const emptyText =
    tab === "todo"
      ? "待发送已清完，可到已处理回看。"
      : tab === "reply"
        ? "没有待回复。家长回了会从企微进这里。"
        : "还没有已处理的日报。";
  const cards = list.length
    ? list
        .map((stu) => {
          const focus = stu.metrics.find((m) => m.label === "专注");
          const done = stu.metrics.find((m) => m.label === "完成进度");
          const pill =
            tab === "reply"
              ? (stu.replyWaitHours || 0) >= 24
                ? "pill-bad"
                : "pill-reply"
              : stu.status === "sent"
                ? "pill-ok"
                : stu.backlogDays
                  ? "pill-bad"
                  : "pill-wait";
          const pillText =
            tab === "reply"
              ? (stu.replyWaitHours || 0) >= 24
                ? "已超时"
                : "待回复"
              : stu.status === "sent"
                ? "已处理"
                : stu.backlogDays
                  ? `已积压 ${stu.backlogDays} 天`
                  : "待发送";
          const summary =
            tab === "reply"
              ? `已等 ${stu.replyWaitHours}h · ${stu.parentReply}`
              : `${done.value}完成 · 专注${focus.value} · ${done.delta}`;
          return `<div class="card" data-open="${stu.id}">
            <div class="card-top">
              <div class="who">
                <div class="avatar" style="background:${stu.color}">${stu.avatar}</div>
                <div>
                  <b>${stu.name} · ${stu.grade}</b>
                  <span>${stu.leave} 离店 · ${stu.duration}</span>
                </div>
              </div>
              <span class="pill ${pill}">${pillText}</span>
            </div>
            <p class="summary">${summary}</p>
          </div>`;
        })
        .join("")
    : `<div class="empty">${emptyText}</div>`;

  $screen.innerHTML = `
    <div class="wb">
      ${bar()}
      <div class="wb-head">
        <div>
          <h3>待办</h3>
          <p>10月29日 · 黄庄店 · 林晓晨</p>
        </div>
      </div>
      <div class="tabs">
        <button class="tab ${tab === "todo" ? "is-on" : ""}" type="button" data-tab="todo">待发送 <em>${n.todo}</em></button>
        <button class="tab ${tab === "reply" ? "is-on" : ""}" type="button" data-tab="reply">待回复 <em>${n.reply}</em></button>
        <button class="tab ${tab === "done" ? "is-on" : ""}" type="button" data-tab="done">已处理 <em>${n.done}</em></button>
      </div>
      <div class="wb-body">
        ${
          tab === "todo" && n.todo
            ? `<div class="ai-banner"><small>今晚焦点</small><p>先写陈思远：时长和完成都低于周均。王雨桐完成稳，专注下滑。</p></div>`
            : tab === "reply" && n.reply
              ? `<div class="ai-banner"><small>待回复</small><p>刘子昂家长已回。超时项同步店长，店长只看不代发。</p></div>`
              : ""
        }
        ${cards}
      </div>
      <div class="home-indicator"></div>
      ${toastEl()}
    </div>
  `;
}

function reasonPanel(stu, dirty) {
  if (!dirty) {
    return `<div class="reason" style="opacity:.45">
    <h4>修改原因</h4>
    <p>还没改动。轻改默认「措辞调整」，大改再选具体原因。</p>
  </div>`;
  }
  const ratio = rewriteRatio(stu.original, stu.draft);
  const pct = Math.round(ratio * 100);
  const minor = ratio < MINOR_RATIO;
  if (stu.feedbackOk) {
    return `<div class="reason"><h4>修改原因</h4><p class="ok">已确认反馈：${stu.reason}${minor ? " · 轻微修改" : ""}</p></div>`;
  }
  if (minor) {
    return `<div class="reason">
    <h4>修改原因</h4>
    <p>轻微修改（改写 ${pct}%），默认记为「措辞调整」。</p>
    <button class="primary" type="button" data-confirm-reason>确认反馈</button>
  </div>`;
  }
  return `<div class="reason">
    <h4>修改原因</h4>
    <p>改写 ${pct}%，请选具体原因后确认。</p>
    ${REASONS.map((r) => `<button class="chip ${stu.reason === r ? "is-on" : ""}" type="button" data-reason="${r}">${r}</button>`).join("")}
    <button class="primary" type="button" data-confirm-reason ${stu.reason ? "" : "disabled"}>确认反馈</button>
  </div>`;
}

function renderCompose(id, step) {
  const stu = db[id];
  state.current = id;
  state.screen = "p2";
  const hasDraft = Boolean(stu.draft);
  const dirty = hasDraft && stu.draft !== stu.original;
  const nxt = nextPending(id);
  const blocks = state.blocks || [];
  setStep(step || (state.justSent ? "p4" : hasDraft ? "p3" : "p2"));

  $screen.innerHTML = `
    <div class="wb">
      ${bar()}
      <div class="wb-head">
        <div>
          <button class="back" type="button" data-go="p1">← 返回</button>
          <h3>${stu.name} · ${stu.grade}</h3>
          <p>${stu.arrive}–${stu.leave} · 建议语气「${stu.recTone}」${stu.backlogDays ? ` · 已积压 ${stu.backlogDays} 天` : ""}</p>
        </div>
      </div>
      <div class="wb-body">
        <div class="sec gray">
          <h4>今日学情 · 对比周均</h4>
          ${metricsHtml(stu.metrics)}
        </div>
        <div class="ai-banner"><small>今晚怎么说</small><p>${stu.hint}</p></div>
        <div class="sec">
          <h4>线下观察 <span class="must">必填</span></h4>
          <textarea class="observe" id="obsBox" placeholder="今天在店里亲眼看到什么……">${stu.observe}</textarea>
          <p class="tag-hint">标签点一下插到光标处，不要连点拼成模板句。</p>
          <div class="tags">${stu.tags.map((t) => `<button class="chip" type="button" data-tag="${t}">${t}</button>`).join("")}</div>
          <div class="row" style="margin-top:10px">
            <span class="summary" style="margin:0">${stu.observe.trim() ? "可以生成" : "先写观察"}</span>
            <button class="gen" type="button" data-gen ${stu.observe.trim() && !state.generating ? "" : "disabled"}>${state.generating ? "生成中…" : "生成日报"}</button>
          </div>
        </div>
        ${
          state.generating
            ? `<div class="sec" id="draftSec">
                <h4>发给家长的消息</h4>
                <p class="summary">正在按已核对的学情和观察起草，上面的事实区保持不动。</p>
              </div>`
            : hasDraft
              ? `<div class="sec" id="draftSec">
                <h4>发给家长的消息</h4>
                <div class="tags" style="margin-top:0;margin-bottom:10px">${TONES.map((t) => `<button class="chip ${stu.tone === t ? "is-on" : ""}" type="button" data-tone="${t}">${t}${t === stu.recTone ? " · 推荐" : ""}</button>`).join("")}</div>
                <textarea class="draft${blocks.length ? " is-bad" : ""}" id="draftBox">${stu.draft}</textarea>
                ${blockPanel(blocks)}
                <div class="msg-actions">
                  <button class="ghost" type="button" data-copy>复制</button>
                  <button class="primary" type="button" data-send ${stu.status === "sent" ? "disabled" : ""}>${stu.status === "sent" ? "已发送" : "发送"}</button>
                </div>
                ${reasonPanel(stu, dirty)}
              </div>`
              : `<div class="sec"><h4>发给家长的消息</h4><p class="summary">写完观察后点「生成日报」，消息、语气、复制和发送会出现在这里。</p></div>`
        }
        ${replyPanel(stu)}
        ${state.tip ? `<p class="summary" style="color:var(--accent)">${state.tip}</p>` : ""}
      </div>
      <div class="foot foot-next">
        <span class="foot-spacer"></span>
        <button class="primary" type="button" data-next ${nxt ? "" : "disabled"}>${nxt ? "下一个待处理" : "已全部处理"}</button>
      </div>
      <div class="home-indicator"></div>
      ${toastEl()}
      ${modalHtml()}
    </div>
  `;

  const obs = document.getElementById("obsBox");
  if (obs) {
    obs.addEventListener("input", () => {
      stu.observe = obs.value;
      const genBtn = $screen.querySelector("[data-gen]");
      if (genBtn) genBtn.disabled = !stu.observe.trim() || state.generating;
    });
  }
  const draft = document.getElementById("draftBox");
  if (draft) {
    draft.addEventListener("input", () => {
      stu.draft = draft.value;
      const nowDirty = stu.draft !== stu.original;
      if (!nowDirty) {
        stu.reason = "";
        stu.feedbackOk = false;
      } else stu.feedbackOk = false;
      state.blocks = [];
      const box = $screen.querySelector(".reason");
      if (box) box.outerHTML = reasonPanel(stu, nowDirty);
      const oldBlocks = $screen.querySelector(".block-list");
      if (oldBlocks) oldBlocks.remove();
      draft.classList.remove("is-bad");
    });
  }
  const replyBox = document.getElementById("replyBox");
  if (replyBox) {
    replyBox.addEventListener("input", () => {
      stu.replyDraft = replyBox.value;
    });
  }
}

function applyTone(stu, nextTone, keepEdit) {
  const prev = stu.tone;
  stu.tone = nextTone;
  if (stu.draft && !keepEdit) {
    stu.original = buildDraft(stu);
    stu.draft = stu.original;
    stu.reason = "";
    stu.feedbackOk = false;
  }
  state.modal = null;
  state.blocks = [];
  toast(keepEdit ? `已记语气切换：${prev} → ${nextTone}（保留修改）` : `已记语气切换：${prev} → ${nextTone}`);
  lockScroll(() => renderCompose(stu.id, stu.draft ? "p3" : "p2"));
}

function finishReply(stu, sent) {
  const box = document.getElementById("replyBox");
  if (box) stu.replyDraft = box.value;
  if (sent && !(stu.replyDraft || "").trim()) {
    toast("先写一句再回");
    return;
  }
  stu.replyHandled = true;
  state.tab = "done";
  toast(sent ? "已回复" + stu.parent : "已标记处理");
  lockScroll(() => renderList());
}

function showDraft(stu) {
  lockScroll(() => {
    renderCompose(stu.id, "p3");
    const body = $screen.querySelector(".wb-body");
    const sec = document.getElementById("draftSec");
    if (body && sec) body.scrollTop = Math.max(0, sec.offsetTop - 8);
  });
}

$screen.addEventListener("mousedown", (event) => {
  if (event.target.closest("button")) event.preventDefault();
});

$screen.addEventListener("click", (event) => {
  if (event.target.closest("button")) event.preventDefault();
  const tab = event.target.closest("[data-tab]");
  const open = event.target.closest("[data-open]");
  const go = event.target.closest("[data-go]");
  const tag = event.target.closest("[data-tag]");
  const tone = event.target.closest("[data-tone]");
  const gen = event.target.closest("[data-gen]");
  const reason = event.target.closest("[data-reason]");
  const confirm = event.target.closest("[data-confirm-reason]");
  const copy = event.target.closest("[data-copy]");
  const send = event.target.closest("[data-send]");
  const nextBtn = event.target.closest("[data-next]");
  const toneCancel = event.target.closest("[data-tone-cancel]");
  const toneKeep = event.target.closest("[data-tone-keep]");
  const toneRewrite = event.target.closest("[data-tone-rewrite]");
  const replySend = event.target.closest("[data-reply-send]");
  const replyDone = event.target.closest("[data-reply-done]");

  if (toneCancel) {
    state.modal = null;
    lockScroll(() => renderCompose(state.current, "p3"));
    return;
  }
  if (toneKeep) {
    applyTone(db[state.current], state.modal.nextTone, true);
    return;
  }
  if (toneRewrite) {
    applyTone(db[state.current], state.modal.nextTone, false);
    return;
  }
  if (replySend) {
    finishReply(db[state.current], true);
    return;
  }
  if (replyDone) {
    finishReply(db[state.current], false);
    return;
  }

  if (tab) {
    state.tab = tab.dataset.tab;
    lockScroll(() => renderList());
    return;
  }
  if (open) {
    state.tip = "";
    state.justSent = false;
    state.blocks = [];
    const id = open.dataset.open;
    lockScroll(() => renderCompose(id));
    if (state.tab === "reply") {
      requestAnimationFrame(() => {
        const body = $screen.querySelector(".wb-body");
        const sec = document.getElementById("replySec");
        if (body && sec) body.scrollTop = Math.max(0, sec.offsetTop - 8);
      });
    }
    return;
  }
  if (go) {
    state.justSent = false;
    state.tip = "";
    lockScroll(() => renderList());
    return;
  }
  if (tag) {
    const stu = db[state.current];
    const obs = document.getElementById("obsBox");
    if (obs) {
      stu.observe = insertAtCursor(obs, tag.dataset.tag);
      const genBtn = $screen.querySelector("[data-gen]");
      if (genBtn) genBtn.disabled = !stu.observe.trim() || state.generating;
    }
    return;
  }
  if (tone) {
    const stu = db[state.current];
    const nextTone = tone.dataset.tone;
    if (nextTone === stu.tone) return;
    const box = document.getElementById("draftBox");
    if (box) stu.draft = box.value;
    const dirty = Boolean(stu.draft) && stu.draft !== stu.original;
    if (dirty) {
      state.modal = { type: "tone", nextTone };
      lockScroll(() => renderCompose(stu.id, "p3"));
      return;
    }
    applyTone(stu, nextTone, false);
    return;
  }
  if (gen && !gen.disabled) {
    const stu = db[state.current];
    const obs = document.getElementById("obsBox");
    if (obs) stu.observe = obs.value;
    if (!stu.observe.trim()) return;
    state.generating = true;
    stu.feedbackOk = false;
    stu.reason = "";
    lockScroll(() => renderCompose(stu.id, "p3"));
    setTimeout(() => {
      stu.original = buildDraft(stu);
      stu.draft = stu.original;
      state.generating = false;
      showDraft(stu);
    }, 550);
    return;
  }
  if (reason) {
    db[state.current].reason = reason.dataset.reason;
    db[state.current].feedbackOk = false;
    lockScroll(() => renderCompose(state.current, "p3"));
    return;
  }
  if (confirm) {
    const stu = db[state.current];
    const box = document.getElementById("draftBox");
    if (box) stu.draft = box.value;
    if (isMinorEdit(stu)) stu.reason = "措辞调整";
    if (!stu.reason) return;
    stu.feedbackOk = true;
    toast("已记录修改原因：" + stu.reason);
    lockScroll(() => renderCompose(stu.id, "p3"));
    return;
  }
  if (copy) {
    copyText(db[state.current].draft || db[state.current].sentText);
    return;
  }
  if (send && !send.disabled) {
    const stu = db[state.current];
    const box = document.getElementById("draftBox");
    if (box) stu.draft = box.value;
    const blocks = validateSend(stu);
    if (blocks.length) {
      state.blocks = blocks;
      state.tip = "";
      toast("发送被拦截，请先改标红项");
      lockScroll(() => renderCompose(stu.id, "p3"));
      return;
    }
    const dirty = stu.draft !== stu.original;
    if (dirty && !stu.feedbackOk) {
      state.tip = isMinorEdit(stu) ? "轻改需点一次确认反馈" : "请选修改原因并点确认反馈";
      lockScroll(() => renderCompose(stu.id, "p3"));
      return;
    }
    stu.status = "sent";
    stu.sentText = stu.draft;
    state.justSent = true;
    state.tip = "";
    state.blocks = [];
    toast("已发给" + stu.parent);
    lockScroll(() => renderCompose(stu.id, "p4"));
    return;
  }
  if (nextBtn && !nextBtn.disabled) {
    const nxt = nextPending(state.current);
    if (!nxt) {
      state.tab = "done";
      lockScroll(() => renderList());
      return;
    }
    state.tip = "";
    state.justSent = false;
    const y = window.scrollY;
    renderCompose(nxt.id, "p2");
    window.scrollTo(0, y);
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
      const body = $screen.querySelector(".wb-body");
      if (body) body.scrollTop = 0;
    });
  }
});

$steps.addEventListener("mousedown", (event) => {
  if (event.target.closest("button")) event.preventDefault();
});

$steps.addEventListener("click", (event) => {
  event.preventDefault();
  const step = event.target.closest(".flow-step");
  if (!step) return;
  const y = window.scrollY;
  const id = step.dataset.step;
  if (id === "p1") {
    state.tab = "todo";
    lockScroll(() => renderList());
  } else if (id === "p2") {
    lockScroll(() => renderCompose("csy", "p2"));
  } else if (id === "p3") {
    const stu = db.csy;
    if (!stu.observe.trim()) stu.observe = "后半段走神，离开时有点疲，函数题主动问了一次。";
    if (!stu.draft) {
      stu.original = buildDraft(stu);
      stu.draft = stu.original;
    }
    showDraft(stu);
  } else {
    state.tab = "done";
    lockScroll(() => renderList());
  }
  window.scrollTo(0, y);
});

renderList();
