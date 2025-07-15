import { Link } from "react-router-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
// import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Swagger() {
  return (
    <div>
      <Link to="/" data-testid="back-link">
        Go back to the app
      </Link>
      <SwaggerUI url={`${apiUrl}/api-docs/swagger.json`} />
    </div>
  );
}
