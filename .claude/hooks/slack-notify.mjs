// Claude Code hook: 작업 완료(Stop) / 입력 대기(Notification) 시 Slack으로 알림 전송
// Webhook URL은 환경변수 SLACK_WEBHOOK_URL에서만 읽는다 (파일/커밋에 저장하지 않음)
// 알림 실패가 Claude 작업을 막지 않도록 항상 exit 0으로 종료한다

import { readFileSync } from 'node:fs';
import path from 'node:path';

// 파일 변경으로 간주하는 도구 이름
const FILE_CHANGE_TOOLS = new Set(['Write', 'Edit', 'NotebookEdit']);
// Slack 메시지에 나열할 최대 파일 수 (초과분은 개수만 표기)
const MAX_LISTED_FILES = 10;

// stdin으로 들어오는 hook 입력(JSON)을 전부 읽는다
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

// transcript(JSONL)에서 마지막 사용자 입력 이후 생성·수정된 파일 경로를 모은다
function collectChangedFiles(transcriptPath, cwd) {
  if (!transcriptPath) return [];

  let lines;
  try {
    lines = readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
  } catch {
    return [];
  }

  // 현재 턴의 시작점: 사용자가 직접 입력한 메시지(텍스트)가 마지막으로 등장한 위치
  let turnStart = 0;
  const entries = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  });
  entries.forEach((entry, index) => {
    const content = entry?.message?.content;
    const isUserPrompt = entry?.message?.role === 'user' && (
      typeof content === 'string' ||
      (Array.isArray(content) && content.some(block => block.type === 'text'))
    );
    if (isUserPrompt) turnStart = index;
  });

  const files = new Set();
  for (const entry of entries.slice(turnStart)) {
    const content = entry?.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block.type !== 'tool_use' || !FILE_CHANGE_TOOLS.has(block.name)) continue;
      const filePath = block.input?.file_path ?? block.input?.notebook_path;
      if (filePath) files.add(path.relative(cwd, filePath) || filePath);
    }
  }
  return [...files];
}

// 완료 메시지에 붙일 변경 파일 목록 문구를 만든다
function formatChangedFiles(files) {
  if (files.length === 0) return '';

  const listed = files.slice(0, MAX_LISTED_FILES).map(file => `• ${file}`);
  const rest = files.length - listed.length;
  const suffix = rest > 0 ? `\n… 외 ${rest}개` : '';
  return `\n변경 파일 ${files.length}개:\n${listed.join('\n')}${suffix}`;
}

// 이벤트 종류에 따라 Slack 메시지 문구를 만든다
function buildText(hookInput) {
  const cwd = hookInput.cwd || process.cwd();
  const projectName = path.basename(cwd);

  if (hookInput.hook_event_name === 'Stop') {
    const changedFiles = collectChangedFiles(hookInput.transcript_path, cwd);
    return `✅ [${projectName}] 작업 완료${formatChangedFiles(changedFiles)}`;
  }

  if (hookInput.hook_event_name === 'Notification') {
    const detail = hookInput.message ? `: ${hookInput.message}` : '';
    return `⏳ [${projectName}] 입력 대기${detail}`;
  }

  return `ℹ️ [${projectName}] ${hookInput.hook_event_name ?? 'unknown'} 이벤트`;
}

async function main() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  // 환경변수가 없으면 조용히 건너뛴다 (팀원 중 미설정자도 작업 가능)
  if (!webhookUrl) {
    console.error('[slack-notify] SLACK_WEBHOOK_URL이 설정되지 않아 알림을 건너뜁니다.');
    return;
  }

  const raw = await readStdin();
  const hookInput = raw ? JSON.parse(raw) : {};

  const payload = {
    username: 'webhookbot',
    icon_emoji: ':robot_face:',
    text: buildText(hookInput)
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error(`[slack-notify] 전송 실패: HTTP ${response.status}`);
  }
}

main().catch(error => {
  // 어떤 오류든 hook이 Claude 작업을 중단시키지 않도록 로그만 남긴다
  console.error('[slack-notify] 오류:', error instanceof Error ? error.message : error);
}).finally(() => {
  process.exit(0);
});
