import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'

import { Post, Sub } from '../types'
import PostCard from '../components/PostCard'
import Image from 'next/image'
// import { GetServerSideProps } from 'next'

export default function Home() {
  const { data: posts } = useSWR<Post[]>('/posts')
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs')

  return (
    <>
      <Head>
        <title>readit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Post feed */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className="rounded-full cursor-pointer"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                  </Link>
                  <Link href={`r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
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
