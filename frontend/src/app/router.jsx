import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './AppShell'
import { RequireAuth } from '../auth/RequireAuth'
import { TopPage } from '../pages/TopPage'
import { PostsPage } from '../pages/PostsPage'
import { PostDetailPage } from '../pages/PostDetailPage'
import { SearchPage } from '../pages/SearchPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { MePage } from '../pages/MePage'
import { NewPostPage } from '../pages/NewPostPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <TopPage /> },
      { path: 'posts', element: <PostsPage /> },
      { path: 'posts/new', element: <RequireAuth><NewPostPage /></RequireAuth> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'me', element: <RequireAuth><MePage /></RequireAuth> },
    ],
  },
])

