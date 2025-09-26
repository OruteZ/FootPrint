import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),   // 사이트/페이지 타이틀
    Component.Spacer(),      // 왼쪽 타이틀 ↔ 오른쪽 아이콘 사이 간격
    // 여기 뒤에 검색/다크모드 등 헤더용 버튼 배치
    Component.Search(),
    Component.Darkmode(),
  ],
  afterBody: [
    Component.Comments({
    provider: 'giscus',
    options: {
      // data-repo
      repo: 'OruteZ/FootPrint',
      // data-repo-id
      repoId: 'R_kgDOP2d4lA',
      // data-category
      category: 'Replies',
      // data-category-id
      categoryId: 'DIC_kwDOP2d4lM4Cv6II',
    }
  })],
  
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
        filter:   (node) => !node.path.split("/").some(seg => seg.startsWith("__")),
        filterFn: (node) => !node.path.split("/").some(seg => seg.startsWith("__")),
      }),
  ],
  right: [],
}
