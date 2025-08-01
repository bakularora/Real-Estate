import { Link,useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useEffect, useState } from "react";

function Header() {
  const {currentUser} = useSelector((state) => state.user);  
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search); 
    urlParams.set("searchTerm", searchTerm);   
    const searchQuery = urlParams.toString(); 
    navigate(`/search?${searchQuery}`);  
  };

  useEffect (() => {        
    const urlParams=new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get("searchTerm"); 
    if(searchTermFromUrl) {              
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search])

  return (
    <div className="bg-slate-300 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
            <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                <span className="text-slate-500">Prime</span>
                <span className="text-slate-700">Estate</span>
            </h1>
            </Link>
            <form onSubmit={handleSubmit} className="bg-slate-100 p-2 rounded-lg flex items-center">      
                <input type="text" placeholder=" Search..." 
                className="bg-transparent focus:outline-none w-24 sm:w-64"
                value={searchTerm}                 
                onChange={(e) => setSearchTerm(e.target.value)}        
                />
                
                <button>
                  <FaSearch className="text-slate-700"/>
                </button>
            </form>
            <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
            </Link>  

            <Link to="/about">  
              <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
            </Link>
            
            <Link to="/profile">
              {currentUser ? (
                <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="avatar" />) : (
                  <li className="text-slate-700 hover:underline">Sign-In</li>    
                )} 
            </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header;