/* src/components/HubSpotModal.tsx */

import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { useBuilding } from "../context/BuildingContext";
import ContentLoader from "./ContentLoader";

declare global {
  interface Window {
    hbspt: any;
  }
}

export default function HubSpotModal() {
  const { isHubSpotOpen, setIsHubSpotOpen, data } = useBuilding();
  const [isFormReady, setIsFormReady] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isHubSpotOpen || !data?.portalId || !data?.formId) {
      setIsFormReady(false);
      initializedRef.current = false;
      return;
    }

    const scriptSrc = "https://js.hsforms.net/forms/v2.js";

    const createForm = () => {
      if (window.hbspt && !initializedRef.current) {
        window.hbspt.forms.create({
          portalId: data.portalId,
          formId: data.formId,
          target: "#hubspot-form-container",
          onFormReady: () => setIsFormReady(true),
          onFormSubmitted: () => {
            setTimeout(() => setIsHubSpotOpen(false), 2500);
          }
        });
        initializedRef.current = true;
      }
    };

    let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = createForm;
      document.body.appendChild(script);
    } else if (window.hbspt) {
      createForm();
    } else {
      script.addEventListener('load', createForm);
    }

    return () => {
      const container = document.getElementById("hubspot-form-container");
      if (container) container.innerHTML = "";
      if (script) script.removeEventListener('load', createForm);
    };
  }, [isHubSpotOpen, data, setIsHubSpotOpen]);

  if (!isHubSpotOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#fff]/95 backdrop-blur-md flex flex-col items-center justify-center">
      <style>{`
        /* Base Form Layout */
        #hubspot-form-container .hs-form { 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
        }

        /* Label Styling */
        #hubspot-form-container .hs-form-field > label { 
          font-size: 10px; 
          font-weight: 700; 
          color: #0f172a; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          margin-bottom: 0.375rem; 
          display: block; 
        }

        /* Input Styling */
        #hubspot-form-container .hs-input:not([type="checkbox"]):not([type="radio"]) { 
          width: 100%; 
          padding: 0.75rem 1rem; 
          border-radius: 0.75rem; 
          border: 1px solid #e2e8f0; 
          background-color: #f8fafc; 
          color: #0f172a; 
          font-size: 0.875rem; 
          transition: all 0.2s; 
        }

        #hubspot-form-container .hs-input:focus { 
          outline: none; 
          border-color: #102a43; 
          box-shadow: 0 0 0 2px rgba(16, 42, 67, 0.1); 
        }

        /* Desktop Two-Column Layout */
        @media (min-width: 768px) {
          #hubspot-form-container .hs-form { 
            flex-direction: row; 
            flex-wrap: wrap; 
            column-gap: 1.25rem; 
          }
          #hubspot-form-container .hs-form-field { width: 100%; }
          
          #hubspot-form-container .hs_firstname,
          #hubspot-form-container .hs_lastname,
          #hubspot-form-container .hs_email,
          #hubspot-form-container .hs_phone,
          #hubspot-form-container .hs_zip { 
            width: calc(50% - 0.625rem); 
          }

          /* Desired Suite Type: 50% width items on desktop */
          #hubspot-form-container .hs_desired_suite_type .inputs-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            column-gap: 1.25rem;
          }
          #hubspot-form-container .hs_desired_suite_type .hs-form-checkbox {
            width: calc(50% - 0.625rem);
          }
        }

        /* Centered Submit Button */
        #hubspot-form-container .hs-submit {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        #hubspot-form-container .hs-button.primary { 
          width: 100%;
          max-width: 300px; 
          background-color: #102a43; 
          color: white; 
          font-weight: 700; 
          padding: 1rem; 
          border-radius: 0.75rem; 
          border: none; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          cursor: pointer; 
          transition: all 0.2s; 
          margin-top: 1rem; 
        }

        /* Legal & Circle Text Styling */
        #hubspot-form-container .hs-richtext,
        #hubspot-form-container .hs-form-booleancheckbox-display span { 
          font-size: 11px; 
          line-height: 1.6; 
          color: #94a3b8; /* Small grey font for legal/consent */
        }

        /* Keep Desired Suite Type checkboxes at standard size/color */
        #hubspot-form-container .hs_desired_suite_type .hs-form-checkbox-display span {
          font-size: 0.875rem;
          color: #475569;
        }

        #hubspot-form-container ul.inputs-list { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
          display: flex; 
          flex-direction: column; 
          gap: 0.75rem; 
        }

        #hubspot-form-container .hs-form-checkbox-display,
        #hubspot-form-container .hs-form-booleancheckbox-display { 
          display: flex; 
          align-items: flex-start; 
          gap: 0.75rem; 
          cursor: pointer; 
        }

        .legal-consent-container {
            display: flex;
            flex-flow: column nowrap;
            row-gap: 10px;

            span {
                margin-left: 0 !important;
            }
        }

        #hubspot-form-container input[type="checkbox"] {
          margin-top: 2px;
        }
      `}</style>

      <button
        onClick={() => setIsHubSpotOpen(false)}
        className="absolute top-6 right-6 text-white/50 hover:text-white z-[100] p-2 bg-[#102a43]/60 hover:bg-[#102a43]/80 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full h-full md:w-[90%] md:h-auto md:max-w-2xl bg-white md:rounded-2xl md:shadow-2xl overflow-hidden relative">
        {!isFormReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <ContentLoader label="Loading Contact Form" />
          </div>
        )}

        <div className="p-8 pt-20 md:pt-12 md:pb-12 h-full overflow-y-auto no-scrollbar">
          <div 
            id="hubspot-form-container" 
            className={`transition-opacity duration-500 ${isFormReady ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>
    </div>
  );
}