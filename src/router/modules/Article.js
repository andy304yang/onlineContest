/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const ArticleRouter = {
  path: '/Article',
  component: Layout,
  redirect: '/Article/Judges',
  name: 'Article',
  meta: {
    title: '文章管理',
    icon: 'language',
    roles: ['admin', 'seniorAdmin', 'courseAdmin']
  },
  children: [
    {
      path: 'Carousel',
      component: () => import('@/views/Article/Carousel/index'),
      name: 'Carousel',
      meta: { title: '轮播内容', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Notice',
      component: () => import('@/views/Article/Notice'),
      name: 'Notice',
      meta: { title: '竞赛通知', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Trend',
      component: () => import('@/views/Article/Trend'),
      name: 'Trend',
      meta: { title: '竞赛动态', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Question',
      component: () => import('@/views/Article/Question'),
      name: 'Question',
      meta: { title: '常见问题', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'About',
      component: () => import('@/views/Article/About'),
      name: 'About',
      meta: { title: '关于我们', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'ScoreSheet',
      component: () => import('@/views/Article/ScoreSheet'),
      name: 'ScoreSheet',
      meta: { title: '评分表管理', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'RewardTemplate',
      component: () => import('@/views/Article/RewardTemplate'),
      name: 'RewardTemplate',
      meta: { title: '奖状模板管理', roles: ['admin', 'seniorAdmin', 'courseAdmin'] }
    }
  ]
}
export default ArticleRouter
