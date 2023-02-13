import styles from './Navigation.module.scss'
import { Link, NavLink } from "react-router-dom";


interface NavigationLink {
    to: string
    text: string
}

interface NavigationParams {
    links: NavigationLink[]
}


let links:NavigationLink[] = [{to:'../', text:'Home'},
                              {to:'../blog', text:'Blog'}]

const Navigation = ({links}:NavigationParams) => {
    return (
        <div className={styles.navBar}>
            <ul className={styles.navList}>
                {links.map(link => {
                    return (
                        <NavLink key={link.text} className={styles.navText} to={link.to}> 
                            {link.text}
                        </NavLink>
                    )
                })}
            </ul>
            <Link to='../blog/write' className={`${styles.addPostBtn} ${styles.navText}`}>
                Add Post
            </Link> 
        </div>
    )
}


export { links }

export default Navigation

