import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import Navigation, { links } from './assets/Navigation/Navigation';

import Home from './Pages/Home/Home';
import Blog from './Pages/Blog/Blog';
import FullscreenBlog from './Pages/FullscreenBlog/FullscreenBlog';
import { BlogWriter } from './Pages/FullscreenBlog/FullscreenBlog';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <section>
        <Navigation links={links}/>
        <Home/>
      </section>
    ),
  },
  {
    path: "/blog",
    element: (
      <section>
        <Navigation links={links}/>
        <Blog/>
      </section>
    ),
    children: [
      {
        path: "/blog/:blogId",
        element: <FullscreenBlog />
      },
      {
        path: "/blog/write",
        element: <BlogWriter/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  </React.StrictMode>,
)
