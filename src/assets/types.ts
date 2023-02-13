type BlogData = {
    id?: number
    image_url: string
    title: string
    excerpt: string
    content: string
    commentator_image_url?: string
    commentator_name?: string
    comment?: string
    comments?: Comment[]
}

type Comment = {
    id?: number
    commentator_image_url: string
    commentator_name: string
    comment: string
}

export type {BlogData, Comment}

