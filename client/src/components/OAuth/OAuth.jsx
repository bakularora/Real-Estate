import { GoogleAuthProvider,getAuth, signInWithPopup } from "firebase/auth";
import {app} from "../../firebase/firebase.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../../redux/user/userSlice";

function OAuth() {
    const dispatch=useDispatch(); 
    const navigate=useNavigate(); 

    const handleGoogleClick = async () => {
        try {
            const Provider=new GoogleAuthProvider();
            const auth=getAuth(app);
            const result=await signInWithPopup(auth,Provider);
            
            const res=await fetch("https://real-estate-fcpk.onrender.com/api/auth/sign-in-google",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:result.user.displayName,
                    email:result.user.email,
                    photo:result.user.photoURL}),       
            });
            const data=await res.json();
            dispatch(signInSuccess(data));
            navigate("/");

        } catch (error) {
            console.log("could not sign in with google",error);
        }
    };

    return (
    <button type="button" className="bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-90"
    onClick={handleGoogleClick}>
        continue with google</button>
    )
}

export default OAuth;