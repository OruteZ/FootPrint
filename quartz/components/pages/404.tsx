// quartz/components/pages/404.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = (_props: QuartzComponentProps) => {
  return (
    <main class="surface" style={{ padding: "24px" }}>
      <h1>문서를 찾을 수 없어요</h1>
      <p>요청하신 노트가 <strong>비공개</strong>거나 <strong>아직 비어있어서</strong> 공개되지 않았을 수 있어요.</p>
      <ul>
        <li><a href="/">홈으로</a></li>
        <li><a href="/tags/">태그로 탐색하기</a></li>
        <li><a href="/recent/">최근 업데이트</a></li>
      </ul>

      {/* 0.6초 후 안내 페이지로 이동 */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function () {
            // BASE 자동 판별: /사용자명.github.io/FootPrint 형태면 "/FootPrint", 커스텀 도메인이면 ""
            var repo = "FootPrint"; // 리포 이름
            var base = location.pathname.indexOf("/" + repo + "/") === 0 ? "/" + repo : "";

            var raw = location.pathname;
            try { raw = decodeURIComponent(raw); } catch (e) {}

            // 동일 경로로만 무한루프 방지
            var target = base + "/missing/?q=" + encodeURIComponent(raw);
            if (location.pathname !== "/missing/") {
              setTimeout(function(){ location.replace(target); }, 600);
            }
          })();
        `
      }} />

      <meta name="robots" content="noindex" />
    </main>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
