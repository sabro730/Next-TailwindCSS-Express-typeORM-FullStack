import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'

import { Post } from '../types'
import PostCard from '../components/PostCard'
// import { GetServerSideProps } from 'next'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPost = async () => {
      const responseObject = await axios.get('/posts')
      setPosts(responseObject.data)
    }
    fetchPost()
  }, [])

  return (
    <div className="pt-12">
      <Head>
        <title>readit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Post feed */}
        <div className="w-160">
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await axios.get('/posts')

//     return { props: { posts: res.data } }
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }
