import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';

export default function DetailsByIndex({ param = 'details', index, summary, children }) {
  const location = useLocation();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Open if query param matches
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get(param);
    setIsOpen(paramValue === String(index));
  }, [location.search, param, index]);

  const toggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Update URL query param
    const searchParams = new URLSearchParams(location.search);
    if (newIsOpen) {
      searchParams.set(param, index);
    } else {
      searchParams.delete(param);
    }

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    history.replace(newUrl); // updates URL without page reload
  };

  return (
    <div className="details-container">
      <style>{`
        [data-theme="light"] .details-container {
          background: #efefef;
        }
        [data-theme="dark"] .details-container {
          background: rgb(57 63 79) !important;
        }

        .details-container {
          border: 2px solid var(--ifm-color-primary) !important;
          border-radius: 0.5rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        [data-theme="dark"] .details-summary {
          background: rgb(57 63 79) !important;
        }

        .details-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          cursor: pointer;
          width: 100%;
          border: none;
          font-weight: 600;
          font-style: italic;
          font-size: 1.3rem;
          text-align: left;
          background: #e2e8f0;
        }

        .arrow {
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
          transition: transform 0.3s ease;
          fill: var(--ifm-color-primary);
        }

        .arrow.open {
          transform: rotate(90deg);
        }

        .details-content-wrapper {
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .details-content {
          padding: 0.5rem 1rem;
        }
      `}</style>

      <button className="details-summary" onClick={toggle}>
        <svg
          className={`arrow ${isOpen ? 'open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
        </svg>
        {summary}
      </button>

      <div
        ref={contentRef}
        className="details-content-wrapper"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <div className="details-content">{children}</div>
      </div>
    </div>
  );
}
