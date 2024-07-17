---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
} from 'vitepress/theme'

const members = [

  {
    avatar: 'https://pic.imgdb.cn/item/6697d130d9c307b7e98f4042.jpg',
    name: '【缘盟】悠',
    title: '资料整理的大大',
    links: [
    //   { icon: 'github', link: 'https://github.com/kiaking' },
    //   { icon: 'twitter', link: 'https://twitter.com/KiaKing85' },
    ],
  },
    {
    avatar: 'https://pic.imgdb.cn/item/6697d146d9c307b7e98f5ac1.jpg',
    name: '苏唯冰',
    title: '实体书策划',
    links: [
    ],
  },
    {
    avatar: 'https://pic.imgdb.cn/item/64a27f5d1ddac507ccc88b2b.jpg',
    name: '张涵筱',
    title: '本站技术支持',
    links: [
    ],
  },
      {
    avatar: 'https://pic.imgdb.cn/item/64a27f5d1ddac507ccc88b2b.jpg',
    name: '张涵筱',
    title: '本站技术支持',
    links: [
    ],
  },
]
</script>

<VPTeamPage style="margin: 0 0 20px 0;">
  <VPTeamPageTitle>
    <template #title>
      我们
    </template>
    <template #lead>
    这是问题妹妹恋上我十年来中做出重要贡献的人物
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="members" size="small" />
</VPTeamPage>

