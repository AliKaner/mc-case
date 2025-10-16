// Component: Portal

// Imports
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Portal Component
/**
 * Portal component that renders children outside of the current DOM hierarchy
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render in the portal
 * @param {string} props.containerId - The ID of the container element (default: "portal-root")
 * @returns {React.ReactPortal|null}
 */
export const Portal = ({ children, containerId = "portal-root" }) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let portalContainer = document.getElementById(containerId);

    if (!portalContainer) {
      portalContainer = document.createElement("div");
      portalContainer.id = containerId;
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);
    setMounted(true);

    return () => {
      if (
        portalContainer &&
        portalContainer.children.length === 0 &&
        portalContainer.id === containerId
      ) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(children, container);
};

// Default export
export default Portal;
