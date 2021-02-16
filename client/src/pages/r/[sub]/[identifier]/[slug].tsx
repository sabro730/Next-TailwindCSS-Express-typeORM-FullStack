import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import classNames from 'classnames'

import Sidebar from '../../../../components/Sidebar'
import { Post, Comment } from '../../../../types'
import { useAuthState } from '../../../../context/auth'
import ActionButton from '../../../../components/ActionButton'

dayjs.extend(relativeTime)

const postPage = () => {
  // Local state

  // Global State
  const { authenticated } = useAuthState()

  // Utils
  const router = useRouter()
  const { identifier, sub, slug } = router.query

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  )

  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  )
  const vote = async (value: number, comment?: Comment) => {
    // If not logged in go to login
    if (!authenticated) router.push('/login')

    // If vote is the same reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0

    try {
      await axios.post('/misc/vote', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      })
      revalidate()
    } catch (err) {
      console.log(err)
    }
  }

  if (error) router.push('/')
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  {/* Vote Section */}
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    {/* upvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classNames('icon-arrow-up', {
                          'text-red-500': post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteScore}</p>
                    {/* downvote */}
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classNames('icon-arrow-down', {
                          'text-blue-600': post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={`${post.url}`}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    {/* Post title */}
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    {/* Post body */}
                    <p className="my-3 text-sm">{post.body}</p>
                    {/* Actions */}
                    <div className="flex">
                      <Link href={`${post.url}`}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
                          </ActionButton>
                        </a>
                      </Link>
                      <ActionButton>
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                      </ActionButton>
                      <ActionButton>
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
                {/* Comment input area */}
                <hr />
                {/* Comments feed */}
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                      {/* upvote */}
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classNames('icon-arrow-up', {
                            'text-red-500': comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-xs font-bold">{comment.voteScore}</p>
                      {/* downvote */}
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classNames('icon-arrow-down', {
                            'text-blue-600': comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  )
}

export default postPage
