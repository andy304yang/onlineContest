/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const CompetitionRouter = {
  path: '/Competition',
  component: Layout,
  redirect: '/Competition/Enroll',
  name: 'Competition',
  meta: {
    title: '竞赛管理',
    icon: 'star'
  },
  children: [
    {
      path: 'Event',
      component: () => import('@/views/Competition/Event'),
      name: 'Event',
      meta: { title: '竞赛项目', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Sort',
      component: () => import('@/views/Competition/Sort/index'),
      name: 'Sort',
      meta: { title: '竞赛归档', roles: ['admin', 'seniorAdmin', 'specialAdmin', 'clubAdmin'] }
    },
    {
      path: 'Works',
      component: () => import('@/views/Competition/Works/index'),
      name: 'Works',
      meta: { title: '作品管理', roles: ['admin', 'seniorAdmin', 'clubAdmin', 'courseAdmin'] }
    },
    {
      path: 'Appear',
      component: () => import('@/views/Competition/Appear/index'),
      name: 'Appear',
      meta: { title: '出线管理', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Award',
      component: () => import('@/views/Competition/Award/index'),
      name: 'Award',
      meta: { title: '奖项管理', roles: ['admin', 'seniorAdmin', 'specialAdmin', 'courseAdmin'] }
    }
  ]
}
export default CompetitionRouter
