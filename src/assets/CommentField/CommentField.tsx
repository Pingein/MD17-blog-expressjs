import React, { FormEvent, useState } from 'react'
import styles from './CommentField.module.scss'




interface CommentFieldParams {
    commentator_image_url: string
    commentator_name: string
    comment?: string
    onSubmit?: React.EventHandler<FormEvent>
    deleteHandler?: React.MouseEventHandler<HTMLButtonElement>
    editHandler?: React.MouseEventHandler<HTMLButtonElement>
}

const CommentField = ({commentator_image_url, commentator_name, comment, deleteHandler, editHandler}:CommentFieldParams) => {
    return (
        <div className={styles.commentContainer}>
            <div className={styles.commentImageContainer}>
                <img src={commentator_image_url} alt={commentator_name} className={styles.commentatorImage}/>
            </div>
            <div className={styles.commentFieldContainer}>
                <div className={styles.commentatorNameContainer}>
                    <h3 className={styles.commentatorName}>
                        {commentator_name}
                    </h3>
                </div>
                <div className={styles.textContainer}>
                    <p className={styles.comment}>
                        {comment}
                    </p>
                    <div className={styles.options}>
                        <button className={styles.editBtn}
                                onClick={editHandler}>
                            edit
                        </button>
                        <button className={styles.deleteBtn}
                                onClick={deleteHandler}>
                            delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


const AddCommentField = ({commentator_image_url, commentator_name, onSubmit}:CommentFieldParams) => {
    return (
        <form className={styles.commentContainer} onSubmit={onSubmit}>
            <div className={styles.commentImageContainer}>
                <img src={commentator_image_url} className={styles.commentatorImage}/>
            </div>
            <div className={styles.commentFieldContainer}>
                <div className={styles.commentatorNameContainer}>
                    <input type="text" 
                           className={styles.commentatorName}
                           placeholder='Your name'/>
                </div>
                <div className={styles.textContainer}>
                    <textarea className={styles.commentText}
                           placeholder='Enter comment'></textarea>
                    <button className={styles.postBtn}>Post</button>
                </div>
            </div>
        </form>
    )
}

export {AddCommentField}

export default CommentField