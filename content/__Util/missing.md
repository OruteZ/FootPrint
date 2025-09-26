---
title: 이 노트는 준비 중입니다
description: 요청하신 문서가 비어있거나 비공개일 수 있어요. 아래 안내를 참고해 주세요.
permalink: /missing/
---

# 이 노트는 준비 중입니다

요청하신 경로가 아직 **비어있거나 비공개**라서 열 수 없어요.  
다음 경로로 이동해 계속 탐색해 보세요.

<div class="callout info">
  <div class="callout-title">요청 경로</div>
  <div class="callout-content">
    <code id="missing-path">/</code>
    <button id="copy-missing" style="margin-left:10px;">복사</button>
  </div>
</div>

- <a id="link-home"   href="#">홈으로</a>  
- <a id="link-explore" href="#">Explorer로</a>  
- <a id="link-tags"    href="#">태그로</a>  
- <a id="link-parent"  href="#">상위 폴더로</a>  

<p style="margin-top:12px">
  문제가 계속되면, 깃허브에 생성 요청을 남겨주세요 👉
  <a id="link-issue" href="#" target="_blank" rel="noopener">“이 노트 만들어 주세요”</a>
</p>

<script>
(function () {
  // 프로젝트 페이지(gh-pages)인지 자동 판단해서 BASE 지정
  var PROJECT_BASE = "/FootPrint"; // 커스텀 도메인이면 "" 로 두세요
  var base = location.pathname.startsWith(PROJECT_BASE) ? PROJECT_BASE : "";

  // 404.tsx에서 전달한 q 파라미터(원래 요청 경로)
  var params = new URLSearchParams(location.search);
  var raw = params.get("q") || location.pathname;
  try { raw = decodeURIComponent(raw); } catch (e) {}

  // 표시
  var pathEl = document.getElementById("missing-path");
  if (pathEl) pathEl.textContent = raw;

  // 상위 폴더 계산 (/A/B/C → /A/B/)
  function parentPath(p) {
    if (!p) return base + "/";
    var t = p.replace(base, "");
    var i = t.lastIndexOf("/");
    if (i <= 0) return base + "/";
    return base + t.slice(0, i + 1);
  }

  // 링크 바인딩
  document.getElementById("link-home").href    = base + "/";
  document.getElementById("link-explore").href = base + "/explore/";
  document.getElementById("link-tags").href    = base + "/tags/";
  document.getElementById("link-parent").href  = parentPath(raw);

  // 깃허브 이슈 템플릿(리포 경로 맞춰주세요)
  var issueTitle = encodeURIComponent("Missing note: " + raw);
  var issueBody  = encodeURIComponent([
    "요청 경로: " + raw,
    "",
    "이 노트를 생성해 주세요. (설명/요청 사항을 여기에 적어 주세요)"
  ].join("\n"));
  document.getElementById("link-issue").href =
    "https://github.com/orutez/FootPrint/issues/new?title=" + issueTitle + "&body=" + issueBody;

  // 복사 버튼
  var btn = document.getElementById("copy-missing");
  if (btn && navigator.clipboard) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(raw).then(function () {
        btn.textContent = "복사됨!";
        setTimeout(function(){ btn.textContent = "복사"; }, 900);
      });
    });
  }
})();
</script>
