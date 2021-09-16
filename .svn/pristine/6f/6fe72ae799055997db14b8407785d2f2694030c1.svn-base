/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const UserRouter = {
  path: '/User',
  component: Layout,
  redirect: '/User/Judges',
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'user',
    roles: ['admin', 'seniorAdmin', 'courseAdmin']
  },
  children: [
    {
      path: 'Administrators',
      component: () => import('@/views/User/Administrators'),
      name: 'Administrators',
      meta: { title: '管理员管理', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Competitors',
      component: () => import('@/views/User/Competitors'),
      name: 'Competitors',
      meta: { title: '选手管理', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Teachers',
      component: () => import('@/views/User/Teachers'),
      name: 'Teachers',
      meta: { title: '教师评委管理', roles: ['admin', 'seniorAdmin'] }
    },
    {
      path: 'Judges',
      component: () => import('@/views/User/Judges'),
      name: 'Judges',
      meta: { title: '课程评委管理', roles: ['admin', 'seniorAdmin', 'courseAdmin'] }
    }
  ]
}
export default UserRouter
