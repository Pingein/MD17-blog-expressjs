import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CommentField, { AddCommentField } from '../../assets/CommentField/CommentField'
import { generateId, randInt } from '../../assets/helper'
import { Comment, BlogData } from '../../assets/types'
import { queryClient } from '../../main'
import styles from './FullscreenBlog.module.scss'


const FullscreenBlog = () => {
    const {blogId} = useParams()

    const [redirectCountdown, setredirectCountdown] = useState(5)

    const navigate = useNavigate()

    const blogQuery = useQuery({
        queryKey: [`blog${blogId}`],
        queryFn: () => axios.get(`http://localhost:3000/blogs/${blogId}`)
                            .then(({data}) => data as BlogData[]),
    })

    console.log(blogQuery.data)

    const singleBlogMutation = useMutation({
        mutationFn: (updatedBlog:BlogData) => axios.patch(`http://localhost:3000/blogs/${blogId}`, updatedBlog),
        onSuccess: () => queryClient.invalidateQueries([`blog${blogId}`])
    })


    if (blogQuery.isLoading) {
        return <h1>Loading...</h1>
    }
    if (blogQuery.isError) {
        setInterval(() => {
            setredirectCountdown(redirectCountdown - 1)
        }, 1000)
        setTimeout(() => {
            navigate('..')
        }, 5000)

        return (
            <h1>
                An error occured, redirecting to <Link to='..' className={styles.link}>blogs</Link> 
                page in {redirectCountdown} seconds
                </h1> 
        )
    }

    const blogComments = blogQuery.data.map(post => {
        return {
            id: post.id,
            commentator_image_url: post.commentator_image_url,
            commentator_name: post.commentator_name,
            comment: post.comment
        }
    })

    const blog = blogQuery.data[0]
    const {image_url, title, excerpt, content} = blog

    console.log(blog)
    console.log(blogComments)

    const comments = blogComments

    const pfp = `https://picsum.photos/id/${randInt(0,500)}/200`


    return (
        
        <section className={styles.fullscreenBlog}>
            {/* <h1>{JSON.stringify(blogQuery.data)}</h1> */}
            <div className={styles.blog}>
                <div className={styles.imageContainer}>
                    <img src={image_url} className={styles.image} />
                </div>
                <div className={styles.blogContent}>
                    <h1 className={styles.blogTitle}>{title}</h1>
                    <p className={styles.blogText}>{content}</p>
                </div>
            </div>


            <div className={styles.comments}>
                <AddCommentField commentator_name={''}
                                 commentator_image_url={pfp}
                                 onSubmit={(e) => {
                                    e.preventDefault()
                                    let newCommentEl = (e.currentTarget.childNodes[1].childNodes[1].childNodes[0] as HTMLInputElement)
                                    let newCommentNameEl = (e.currentTarget.childNodes[1].childNodes[0].childNodes[0] as HTMLInputElement)

                                    if (newCommentEl.value && newCommentNameEl.value) {
                                        // singleBlogMutation.mutate({
                                        //     ...blogQuery.data,
                                        //     comments: [...comments, {
                                        //         id: generateId(),
                                        //         comment: newCommentEl.value,
                                        //         commentator_image_url: pfp,
                                        //         commentator_name: newCommentNameEl.value
                                        //     }]
                                        // })
                                        newCommentEl.value = ''
                                    }
                                 }}/>

                <span>Comments ({comments.length})</span>
                {comments.map(comment => {
                    return <CommentField key={comment.id}
                                         commentator_image_url={comment.commentator_image_url}
                                         commentator_name={comment.commentator_name}
                                         comment={comment.comment}

                                         deleteHandler={() => {
                                            if (confirm(`this will delete comment '${comment.comment}' by '${comment.commentator_name}'`)) {
                                                // singleBlogMutation.mutate(
                                                // //     {
                                                // //     ...blogQuery.data,
                                                // //     comments: comments.filter(existingComment => existingComment.id != comment.id)
                                                // //     }
                                                // )
                                            }
                                         }}

                                         editHandler={() => {
                                            let editedComment = prompt('enter new comment', comment.comment)
                                            if (editedComment) {
                                                // singleBlogMutation.mutate({
                                                //     ...blogQuery.data,
                                                //     comments: comments.map(existingComment => {
                                                //         return (existingComment.id == comment.id 
                                                //                 ? {...existingComment, comment:editedComment+''} 
                                                //                 : existingComment)
                                                //     })
                                                // })
                                            }
                                         }}/>
                })}
            </div>
        </section>
    )
}


const BlogWriter = () => {
    const [blogImage, setBlogImage] = useState('')

    const imageRef = useRef<HTMLImageElement>(null)
    const titleRef = useRef<HTMLInputElement>(null)
    const excerptRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)

    const navigate = useNavigate()

    const blogsMutation = useMutation({
        mutationFn: (newBlog:BlogData) => axios.post(`http://localhost:3000/blogs/`, newBlog),
        onSuccess: () => queryClient.invalidateQueries([`blogs`])
    })


    return (
        <section className={styles.fullscreenBlog}>
            <div className={styles.blog}>
                <div className={styles.imageContainer}>
                    {blogImage 
                    ? <img src={blogImage} className={styles.image} ref={imageRef}></img> 
                    : <form className={styles.blogContent} 
                            onSubmit={(e) => {
                                e.preventDefault()
                                let link = (e.currentTarget.childNodes[0] as HTMLInputElement).value
                                if (link.match(RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/))) {
                                    setBlogImage(link)
                                } else {
                                    alert('please enter valid url')
                                }
                            }}>
                        <input type='text' 
                               placeholder='Paste image link'
                               className={styles.input}/>
                        <button className={styles.btn}>
                            submit
                        </button>
                      </form>}
                </div>
                <form className={styles.blogContent}
                      onSubmit={(e) => {
                        e.preventDefault()
                        let image_url = imageRef.current?.src
                        let title = titleRef.current?.value
                        let excerpt = excerptRef.current?.value
                        let content = contentRef.current?.value

                        if (image_url && title && excerpt && content) {
                            console.log('posting')
                            blogsMutation.mutate({
                                image_url,
                                title,
                                excerpt,
                                content,
                                comments: []
                            })
                            navigate('/blog')
                        }
                      }}>
                    <input type="text" 
                           placeholder='Enter blog title'
                           className={styles.input}
                           ref={titleRef}/>
                    <input type="text" 
                           placeholder='Enter blog excerpt'
                           className={styles.input}
                           ref={excerptRef}/>      
                    <textarea placeholder='Enter blog text'
                              className={styles.input}
                              ref={contentRef}>
                    </textarea>

                    <button className={styles.btn}>
                        Post
                    </button>
                </form>
            </div>
            
        </section>
    )
}


export { BlogWriter }

export default FullscreenBlog