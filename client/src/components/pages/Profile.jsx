import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase/firebase";
import { getDownloadURL } from "firebase/storage";
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure,signOutUserSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser,loading,error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  console.log(file); 
  const [filePerc, setFilePerc] = useState(0);
  console.log(filePerc);
  const [fileUploaderror, setFileUploaderror] = useState(false);  
  const [formData, setFormData] = useState({});
  console.log(formData);
  const [updateSuccess, setUpdateSuccess] = useState(false);  
  console.log(fileUploaderror)
  const dispatch = useDispatch();
  const [showListingsError,setShowListingsError]=useState(false);
  const [userListings,setUserListings]=useState([]);

  useEffect(() => {      
    if (file) {
      handleFileUpload(file);
    }
  }, [file]); 

  const handleFileUpload = (file) => {        
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;  
    const storageRef = ref(storage, fileName);  
    const uploadTask = uploadBytesResumable(storageRef, file);  

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploaderror(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });  
        });
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });  
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res=await fetch(`https://real-estate-fcpk.onrender.com/api/user/update/${currentUser._id}`, 
      {
        method:"POST",
        headers:{
          "Content-type":"application/json",
        },
        body:JSON.stringify(formData),
      });  
      const data=await res.json();
      console.log(data);
      if(data.success===false){   
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data)); 
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {    
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`https://real-estate-fcpk.onrender.com/api/user/delete/${currentUser._id}`,{     
        method:"DELETE",
      });             
      const data=await res.json();     
      if(data.success===false){                 
        dispatch(deleteUserFailure(data.message));
        return;
      }     
      dispatch(deleteUserSuccess(data)); 

    } catch (error) {
      dispatch(deleteUserFailure(error.message));   
    }
  }

  const handleSignOut = async() => {
    try {
      dispatch(signOutUserStart());
      const res=await fetch("https://real-estate-fcpk.onrender.com/api/auth/sign-out"); 
      const data=await res.json();
      if(data.success===false){   
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());  
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings=async()=>{   
    try {
      setShowListingsError(false);
      const res=await fetch(`https://real-estate-fcpk.onrender.com/api/user/listing/${currentUser._id}`);  
      const data=await res.json();
      if(data.success===false){   
        setShowListingsError(true);
        return;
      }
      setUserListings(data); 
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete=async(id)=>{  
    try {
      const res=await fetch(`https://real-estate-fcpk.onrender.com/api/listing/delete-listing/${id}`,{  
        method:"DELETE",
      }); 
      const data=await res.json();
      if(data.success===false){  
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>
        prev.filter((listing)=>listing._id!==id));  

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden accept="image/*" ref={fileRef} />  

        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />

        <p className='text-sm self-center'>
          {fileUploaderror ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder=" Username" className="border p-3 rounded-lg" id="username" />   
        <input onChange={handleChange} defaultValue={currentUser.email} type="text" placeholder=" email" className="border p-3 rounded-lg" id="email" />
        <input onChange={handleChange} type="password" placeholder=" password" className="border p-3 rounded-lg" id="password" />

        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase 
        hover:opacity-90 disabled:opacity-80">{loading ? "Loading" : "Update"}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90" to={"/create-listing"}>
          Create Listing</Link>
      </form>       
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? "User updated successfully" : ""}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 &&    
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 mb-4 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) =>(   
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">          
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing" className="w-16 h-16 object-contain" /> 
              </Link>
              <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">   
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>   
                <button className="text-green-700 uppercase">
                  Edit
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default Profile;

