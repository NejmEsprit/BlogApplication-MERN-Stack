import "./profile.css"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import swal from "sweetalert"
import UpdateProfileModal from "./UpdateProfileModal"
import { useParams, useNavigate } from "react-router-dom"
import { deleteProfile, getUserProfile, uploadProfilePhoto } from "../../redux/apiCalls/profileApiCall"
import PostsItem from "../../components/posts/PostsItem"
import { Oval } from "react-loader-spinner"
import { logoutUser } from "../../redux/apiCalls/authApiCall"


const Profile = () => {
    const dispatch = useDispatch()

    const { profile, loading, isProfileDeleted } = useSelector(state => state.profile)
    const { user } = useSelector(state => state.auth)


    const [file, setFile] = useState(null);
    const [updateProfile, setUpdateProfile] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        dispatch(getUserProfile(id));
        window.scrollTo(0, 0);
    }, [id]);
    const navigate = useNavigate()
    useEffect(() => {
        if (isProfileDeleted) {
            navigate("/")
        }
    }, [navigate, isProfileDeleted]);

    const formSumbitHandler = (e) => {
        e.preventDefault()
        if (!file) return toast.warning("ther is no file!")
        const formData = new FormData()
        formData.append("image", file)
        dispatch(uploadProfilePhoto(formData))
        console.log("image uploaded")
    }
    //delete profile Handler
    const deleteProfileHandler = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover profile !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((isOk) => {
                if (isOk) {
                    dispatch(deleteProfile(user?._id))
                    dispatch(logoutUser())
                }
            });
    }
    if (loading) {
        return (
            <div className="profile-loader">
                <Oval
                    height={120}
                    width={120}
                    color="#000"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="grey"
                    strokeWidth={3}
                    strokeWidthSecondary={3}

                />
            </div>
        )
    }
    return (
        <section className="profile">
            <div className="profile-header">
                <div className="profile-image-wrapper">
                    <img src={file ? URL.createObjectURL(file) : profile?.profilePhoto?.url}
                        alt=""
                        className="profile-image" />
                    {
                        user?._id === profile?._id && (
                            <form onSubmit={formSumbitHandler}>
                                <abbr title="choose profile photo">
                                    <label htmlFor="file" className="bi bi-camera-fill upload-profile-photo-icon"></label>
                                </abbr>
                                <input style={{ display: 'none' }}
                                    type="file"
                                    name="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])} />
                                <button type="submit" className="upload-profile-photo-btn">
                                    upload
                                </button>
                            </form>
                        )
                    }
                </div>
                <h1 className="profile-username">
                    {profile?.username}
                </h1>
                <p className="profile-bio">
                    {profile?.bio}
                </p>
                <div className="user-date-joined">
                    <strong>date Joined </strong>
                    <span> {new Date(profile?.createdAt).toDateString()}</span>
                </div>
                {
                    user?._id === profile?._id && (
                        <button
                            onClick={() => setUpdateProfile(true)}
                            className="profile-update-btn">
                            <i className="bi bi-file-person-fill">
                                Update Profile
                            </i>
                        </button>
                    )
                }

            </div>
            <div className="profile-posts-list">
                <h2 className="profiel-post-list-title">{profile?.username} Posts</h2>
                {
                    profile?.posts?.map(post =>
                        <PostsItem
                            key$={post._id}
                            post={post}
                            username={profile?.username}
                            userId={profile?._id}
                        />
                    )
                }
            </div>
            {
                user?._id === profile?._id && (
                    <button onClick={deleteProfileHandler} className="delete-account-btn">
                        Delete Your Account
                    </button>
                )
            }
            {updateProfile && (
                <UpdateProfileModal profile={profile} setUpdateProfile={setUpdateProfile} />
            )}
        </section>
    );
}

export default Profile;