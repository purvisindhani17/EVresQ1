import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfileOfHost() {
  const { hostId } = useParams();
  const [host, setHost] = useState(null);

  useEffect(() => {
    const fetchHost = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/EVowner/${hostId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setHost(data);
    };
    fetchHost();
  }, [hostId]);

  if (!host) return <p>Loading...</p>;

  return (
    <div>
      <h1>Host Profile</h1>
      <p><b>Name:</b> {host.name}</p>
      <p><b>Email:</b> {host.email}</p>
      <p><b>Location:</b> {host.location}</p>
      <p><b>Charger Type:</b> {host.chargerType}</p>
    </div>
  );
}
