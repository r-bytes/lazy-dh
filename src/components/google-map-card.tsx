import React from "react";

const GoogleMapCard: React.FC = () => {
  const address = `${process.env.COMPANY_ADDRESS!}, ${process.env.COMPANY_POSTAL!} ${process.env.COMPANY_CITY!}`;
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`;

  return (
    <div className="google-map-card h-96 w-full overflow-hidden rounded-lg shadow-lg">
      <iframe width="100%" height="100%" style={{ border: 0 }} src={mapSrc} allowFullScreen></iframe>
    </div>
  );
};

export default GoogleMapCard;
