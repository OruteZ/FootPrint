// quartz/components/pages/404.tsx
// 간단한 맞춤 404: 메시지 + 홈/탐색 + (선택) 자동 이동
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const BASE = "/FootPrint" // 사용자/프로젝트 페이지면 "/FootPrint", 커스텀 도메인이면 "" 로!

const NotFound: QuartzComponent = (_props: QuartzComponentProps) => {
  return (
    <main class="surface" style={{ padding: "24px" }}>
      <h1>문서를 찾을 수 없어요</h1>
      <p>요청하신 노트가 <strong>비공개</strong>거나 <strong>아직 비어있어서</strong> 공개되지 않았을 수 있어요.</p>

      <ul>
        <li><a href={`${BASE}/`}>홈으로</a></li>
        <li><a href={`${BASE}/tags/`}>태그로 탐색하기</a></li>
        <li><a href={`${BASE}/recent/`}>최근 업데이트</a></li>
      </ul>

      {/* 선택 기능: 0.8초 후 안내 페이지(예: /missing/)로 부드럽게 이동 */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function () {
            var wantRedirect = true;            // 이동을 끄려면 false
            if (!wantRedirect) return;
            var raw = location.pathname.replace(/^${BASE}/, "");
            var to = "${BASE}/missing/?q=" + encodeURIComponent(raw);
            setTimeout(function(){ location.replace(to); }, 800);
          })();
        `
      }} />

      {/* 404 페이지는 검색 엔진에 안 보이게 */}
      <meta name="robots" content="noindex" />
    </main>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
