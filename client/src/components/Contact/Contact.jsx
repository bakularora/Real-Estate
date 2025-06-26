import PropTypes from "prop-types"; 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`https://real-estate-fcpk.onrender.com/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]); 

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>{" "}
          <textarea
            name="message"
            id="message"
            placeholder=" Enter your message"
            rows={2}
            className="w-full border p-3 rounded-lg "
            value={message}
            onChange={onChange}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-80"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
Contact.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default Contact;
