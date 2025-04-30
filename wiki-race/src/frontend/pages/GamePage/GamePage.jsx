import "./GamePage.css";
import React, { useEffect, useState, useRef } from "react";

function GamePage() {
  const [pageTitle, setPageTitle] = useState("");
  const [pageHtml, setPageHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [clickHistory, setClickHistory] = useState([]);
  const startLink = useRef(null);
  const endLink = useRef(null);
  const initialized = useRef(false);

  //FETCH RANDOM PAGE TITLE - only on init
  useEffect(() => {
    const fetchPageTitle = async () => {
      try {
        if(initialized.current) return;
        initialized.current = true;
        //init link, start and load w this
        const startResponse = await fetch(
          "https://en.wikipedia.org/api/rest_v1/page/random/summary"
        );
        const startData = await startResponse.json();

        const startUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(startData.title)}`;

        startLink.current = {
          title: startData.title,
          url: startUrl
        };
         
        //goal link
        const endResponse = await fetch(
          "https://en.wikipedia.org/api/rest_v1/page/random/summary"
        );
        const endData = await endResponse.json();
        const endUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(endData.title)}`;

        endLink.current = {
          title: endData.title,
          url: endUrl
        };

        //move on
        setPageTitle(startData.title);
      } catch (error) {
        console.error("Error fetching page title:", error);
      }
    };
    fetchPageTitle();
  }, []);

  //FETCH PAGE CONTENT
  useEffect(() => {
    if (!pageTitle) return; //if page title is empty

    const fetchPageContent = async () => {
      setLoading(true); //allow for buffering
      try {
        const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
          pageTitle)}`

        const response = await fetch(pageUrl);
        const html = await response.text();
        setPageHtml(html);

        setClickHistory(prevHistory => [...prevHistory,{
          title: pageTitle,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
      }]);
  
        console.log("clickHistory: ", clickHistory);
      } catch (error) {
        console.error("Error fetching page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageTitle]);

  // Native event handler for internal wiki links
  //handle click links now, navigate to other pages
  //takes link attribute, checks if wiki link, extract page title
  //CLICK HANDLER - ALLOW NAVIGATING TO NEXT PAGE
  useEffect(() => {
    const contentDiv = contentRef.current;
    if (!contentDiv) return;

    const handleClick = (e) => {
      // prevent all other links from being clicked

      if (e.defaultPrevented || (e.target.nodeName === "a" && !e.target.href)) {
        //if not correct link
        return;
      }
      //find closest based on dom hierarchy
      const target = e.target.closest("a");
      if (!target || !target.href) return;

      try {
        const url = new URL(target.href); //filter only wiki pages

        const isWikiLink =
          url.hostname.includes("wikipedia.org") &&
          url.pathname.startsWith("/wiki/") &&
          !url.pathname.split("/wiki/")[1]?.includes(":"); //&& //ignore special pages
        //!target.classList.length //ignore classes

        if (isWikiLink) {
          e.preventDefault();
          const nextTitle = target.title;
          setPageTitle(nextTitle);
        } else {
          e.preventDefault();
        }
      } catch (e) {
        console.error("could not load next page", error);
      }
    };

    contentDiv.addEventListener("click", handleClick);
    return () => {
      contentDiv.removeEventListener("click", handleClick);
    };
  }, [pageHtml]);

  if (loading) return <div style={{ background: "white", height: "100vh" }} />;
  if (!pageHtml)
    return <div style={{ background: "white", height: "100vh" }} />;

  return (
    <div className="wiki-page">
      <div className="wiki-content-container">
        <h1 className="wiki-title">{pageTitle}</h1>
        <div
          id="wikipedia-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: pageHtml }}
        />
      </div>
    </div>
  );
}

export default GamePage;
