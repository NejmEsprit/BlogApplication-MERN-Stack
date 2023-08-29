import PostsItem from "./PostsItem"
import "./posts.css"

const PostsList = ({posts}) => {
    return ( 
        <div className="post-list"> 
        {posts.map(item=> <PostsItem post={item} key={item._id}/>)}
        </div>
     );
}
 
export default PostsList;