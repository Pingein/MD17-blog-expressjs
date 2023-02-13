import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './BlogPreview.module.scss'


interface BlogPreviewParams {
    id:number
    title: string
    image: string
    excerpt: string
}

const BlogPreview = ({id, title, image, excerpt}:BlogPreviewParams) => {
    return (
        <Link to={id+''} className={styles.link}>
            <div className={styles.blogCard}>  
                    <img src={image} 
                        alt={title}
                        className={styles.image} />
                <div className={styles.textContainer}>
                    <h1 className={styles.title}>{title}</h1>      
                </div>
                <p className={styles.excerpt}>{excerpt}</p>
            </div>
        </Link>
    )
}


export default BlogPreview