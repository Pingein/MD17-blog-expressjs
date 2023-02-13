import React from 'react'
import styles from './Pagination.module.css'


interface PaginationParams {
    currentPage: string | number
    pageCount: string | number

    prevPageBtnHandler: React.MouseEventHandler<HTMLDivElement>
    nextPageBtnHandler: React.MouseEventHandler<HTMLDivElement>
}

const Pagination = ({currentPage, pageCount, prevPageBtnHandler, nextPageBtnHandler }:PaginationParams) => {

    return (
        <div className={styles.root}>
            <div style={currentPage === 1
                            ? { backgroundColor: 'rgb(59, 59, 59)', cursor:'not-allowed' }
                            : { backgroundColor: 'gray', cursor:'pointer' }
                        }
                 className={styles.button}
                 onClick={(e) => {
                    prevPageBtnHandler(e)
                 }}>
                {'<'}
            </div>
            <div className={styles.page}>
                {currentPage} / {pageCount}
            </div>
            <div style={currentPage === pageCount
                            ? { backgroundColor: 'rgb(59, 59, 59)', cursor:'not-allowed' }
                            : { backgroundColor: 'gray', cursor:'pointer' }
                        }
                 className={styles.button}
                 onClick={(e) => {
                    nextPageBtnHandler(e)
                 }}>
                {'>'}
            </div>
        </div>
    )
}


export default Pagination