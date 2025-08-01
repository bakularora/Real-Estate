import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import { useEffect, useState } from "react";
  import { app } from "../../firebase/firebase.js";
  import { useSelector } from "react-redux";
  import { useNavigate,useParams } from "react-router-dom";

  
  function UpdateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]); 
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: "",
      description: "",
      address: "",
      type: "rent",
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 1000000,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false); 
    const [uploading, setUploading] = useState(false); 
    const [error, setError] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const params=useParams();

    useEffect(() => {            
        const getListing=async()=>{
            const listingId=params.listingId;  
            const res=await fetch(`https://real-estate-fcpk.onrender.com/api/listing/get-listing/${listingId}`);  
            const data=await res.json();
            if(data.success===false){
                console.log(data.message);
                return;
            }
            setFormData(data);  
        }
        getListing();
    }, [])   
  
  
    console.log(formData);
    const handleImageSubmit = () => {
      if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
  
        const promises = [];
  
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises)
          .then((urls) => {
            setFormData({
              ...formData, 
              imageUrls: formData.imageUrls.concat(urls), 
            });
            setImageUploadError(false);
            setUploading(false); 
          })
          .catch((error) => {
            console.log(error);
            setImageUploadError("image is more than 2mb");
            setUploading(false);
          });
      } else {
        setImageUploadError("You can upload a maximum of 6 images");
        setUploading(false);
      }
    };
    const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name; 
        const storageRef = ref(storage, fileName); 
        const uploadTask = uploadBytesResumable(storageRef, file); 
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress + "%");
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const handleRemoveImage = (index) => () => {
      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index), 
      });
    };
  
    const handleChange = (e) => {
      if (e.target.id === "sale" || e.target.id === "rent") {
        setFormData({
          ...formData,
          type: e.target.id,
        });
      }
      if (
        e.target.id === "parking" ||
        e.target.id === "furnished" ||
        e.target.id === "offer"
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
        });
      }
      if (
        e.target.type === "number" ||
        e.target.type === "text" ||
        e.target.type === "textarea"
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        if(formData.imageUrls.length<1)  
        return setError("Please upload atleast one image");
        
        if(+formData.regularPrice<+formData.discountPrice)  
        return setError("Discounted price cannot be greater than the regular price");
  
        setLoading(true);
        setError(false);
        const res=await fetch(`https://real-estate-fcpk.onrender.com/api/listing/update-listing/${params.listingId}`,{ 
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            ...formData,
            userRef:currentUser._id, 
          }),
        });
        const data=await res.json();
        setLoading(false);
        if(data.success===false){
          setError(data.message);
        }
        navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    return (
      <div className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Update Listing
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              required
              onChange={handleChange}
              value={formData.address} 
            />
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"} 
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="16"
                  className="border p-3 rounded-lg border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Bed</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="16"
                  className="border p-3 rounded-lg border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="1"
                  className="border p-3 rounded-lg border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000"
                  className="border p-3 rounded-lg border-gray-300"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover image (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="image"
                accept="image/*"
                multiple
              />
              <button
                disabled={uploading}
                type="button"
                onClick={handleImageSubmit}
                className="p-3 text-green-700 border border-green-700 uppercase rounded hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "upload"}
              </button>{" "}
            </div>
            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (   
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listingImages"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
  
                  <button
                    onClick={handleRemoveImage(index)}
                    type="button"
                    className="p-3 text-red-700 uppercase rounded-lg hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-75">
              {loading ? "Creating..." : "Update Listing"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    );
  }
  
  export default UpdateListing;
  