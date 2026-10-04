import SEO from "../components/SEO";

function About() {
  return (
    <div className="simple-content-page">
      <SEO
        title="About DailyTools"
        description="Learn about DailyTools, a collection of simple and free online utilities for images, PDFs, calculations and everyday work."
      />

      <div className="container">
        <div className="simple-page-header">
          <span className="section-eyebrow">
            ABOUT US
          </span>

          <h1>About DailyTools</h1>

          <p>
            We build simple online tools that help
            you finish everyday tasks faster.
          </p>
        </div>

        <div className="simple-page-content">
          <h2>What is DailyTools?</h2>

          <p>
            DailyTools is a collection of online
            utilities for common tasks such as
            compressing images, working with PDF
            files, resizing photos and performing
            everyday calculations.
          </p>

          <h2>Our Goal</h2>

          <p>
            Our goal is to keep online tools simple.
            Instead of complicated settings, we aim
            to provide a clear process: choose what
            you need, enter or select your data,
            get the result and download it when
            required.
          </p>

          <h2>Privacy-Friendly Tools</h2>

          <p>
            Many DailyTools file utilities are
            designed to process files directly
            inside your web browser. When a tool
            works this way, the processing happens
            on your device rather than requiring
            the file to be sent to our server.
          </p>

          <h2>Free to Use</h2>

          <p>
            DailyTools provides useful everyday
            utilities free of charge. The website
            may use advertising to help support
            development and operating costs.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;